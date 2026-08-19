export interface StackFrame {
  id: string;
  funcName: string;
  line: number;
  locals: Record<string, any>;
}

export interface HeapObject {
  id: string;
  type: "list" | "dict" | "set" | "tuple" | "custom";
  value: any;
  refCount: number;
}

export interface ExecutionStep {
  step: number;
  line: number;
  funcName: string;
  event: "call" | "line" | "return" | "exception";
  callStack: StackFrame[];
  heap: Record<string, HeapObject>;
  stdout: string;
  errorMessage?: string;
}

export interface TraceResult {
  steps: ExecutionStep[];
  totalSteps: number;
  finalStdout: string;
  error?: string;
}

export const PYTHON_TRACER_SCRIPT = `
import sys, json, copy, io

class LiveExecutionTracer:
    def __init__(self, max_steps=300):
        self.steps = []
        self.max_steps = max_steps
        self.step_count = 0
        self.stdout_capture = io.StringIO()
        self.heap_objects = {}
        self.heap_counter = 1

    def _sanitize(self, val):
        if val is None or isinstance(val, (int, float, bool, str)):
            return val
        if isinstance(val, (list, tuple, set, dict)):
            # Representation
            return str(val)
        return f"<{type(val).__name__}>"

    def trace_calls(self, frame, event, arg):
        if self.step_count >= self.max_steps:
            return None
        if frame.f_code.co_filename != "user_code.py":
            return self.trace_calls

        self.step_count += 1
        line_no = frame.f_lineno
        func_name = frame.f_code.co_name

        # Extract Call Stack
        stack = []
        curr = frame
        while curr and curr.f_code.co_filename == "user_code.py":
            locs = {}
            for k, v in curr.f_locals.items():
                if not k.startswith("__"):
                    locs[k] = self._sanitize(v)
            stack.append({
                "id": f"frame_{id(curr)}",
                "funcName": curr.f_code.co_name,
                "line": curr.f_lineno,
                "locals": locs
            })
            curr = curr.f_back

        # Extract Heap
        heap = {}
        for k, v in frame.f_locals.items():
            if not k.startswith("__") and isinstance(v, (list, dict, set, tuple)):
                obj_id = f"heap_{id(v)}"
                t_name = "list" if isinstance(v, list) else ("dict" if isinstance(v, dict) else ("set" if isinstance(v, set) else "tuple"))
                heap[obj_id] = {
                    "id": obj_id,
                    "type": t_name,
                    "value": [self._sanitize(x) for x in v] if isinstance(v, (list, tuple, set)) else {str(dk): self._sanitize(dv) for dk, dv in v.items()},
                    "refCount": 1
                }

        self.steps.append({
            "step": self.step_count,
            "line": line_no,
            "funcName": func_name,
            "event": event,
            "callStack": stack,
            "heap": heap,
            "stdout": self.stdout_capture.getvalue()
        })
        return self.trace_calls

def run_traced_code(code_str, stdin_str=""):
    tracer = LiveExecutionTracer(max_steps=200)
    old_stdout = sys.stdout
    sys.stdout = tracer.stdout_capture
    
    compiled = compile(code_str, "user_code.py", "exec")
    glob = {"__name__": "__main__"}
    
    sys.settrace(tracer.trace_calls)
    err = None
    try:
        exec(compiled, glob)
    except Exception as e:
        err = f"{type(e).__name__}: {str(e)}"
    finally:
        sys.settrace(None)
        sys.stdout = old_stdout

    return json.dumps({
        "steps": tracer.steps,
        "totalSteps": len(tracer.steps),
        "finalStdout": tracer.stdout_capture.getvalue(),
        "error": err
    })
`;

export async function tracePythonExecution(pyodide: any, code: string, stdin: string = ""): Promise<TraceResult> {
  if (!pyodide) {
    throw new Error("Pyodide is not initialized");
  }

  // Load tracer runner
  pyodide.globals.set("__tracer_code__", code);
  pyodide.globals.set("__tracer_stdin__", stdin);

  const rawJson = pyodide.runPython(`
${PYTHON_TRACER_SCRIPT}
run_traced_code(__tracer_code__, __tracer_stdin__)
  `);

  return JSON.parse(rawJson) as TraceResult;
}
