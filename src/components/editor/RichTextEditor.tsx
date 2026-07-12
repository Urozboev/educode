"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code2, Loader2,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Rasmlar shu Storage bucket'ga yuklanadi */
  bucket?: string;
}

function Btn({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
        active ? "bg-neon-purple text-white" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onImage, uploading }: { editor: Editor; onImage: () => void; uploading: boolean }) {
  const Sep = () => <div className="w-px h-5 bg-border/60 mx-0.5 flex-shrink-0" />;

  function setLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Havola URL:", prev || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex items-center gap-0.5 flex-wrap p-2 border-b border-border/60 bg-surface/40 sticky top-0 z-10">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Qalin (Ctrl+B)"><Bold className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursiv (Ctrl+I)"><Italic className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Tagchiziq"><UnderlineIcon className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="O'chirilgan"><Strikethrough className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Kod (inline)"><Code className="w-4 h-4" /></Btn>
      <Sep />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Sarlavha 1"><Heading1 className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Sarlavha 2"><Heading2 className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Sarlavha 3"><Heading3 className="w-4 h-4" /></Btn>
      <Sep />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Belgili ro'yxat"><List className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Raqamli ro'yxat"><ListOrdered className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Iqtibos"><Quote className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Kod bloki"><Code2 className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ajratuvchi chiziq"><Minus className="w-4 h-4" /></Btn>
      <Sep />
      <Btn onClick={setLink} active={editor.isActive("link")} title="Havola qo'shish"><LinkIcon className="w-4 h-4" /></Btn>
      <Btn onClick={onImage} disabled={uploading} title="Rasm qo'shish">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
      </Btn>
      <Sep />
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Ortga"><Undo className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Oldinga"><Redo className="w-4 h-4" /></Btn>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder, bucket = "course-thumbnails" }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: "hljs" } } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-neon-purple underline", rel: "noopener", target: "_blank" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4 max-w-full" } }),
      Placeholder.configure({ placeholder: placeholder || "Dars matnini shu yerga yozing..." }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm md:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-4 " +
          "prose-headings:font-display prose-a:text-neon-purple prose-code:text-neon-green " +
          "prose-code:bg-surface prose-code:px-1 prose-code:rounded prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  // Tashqaridan value o'zgarsa (masalan AI generatsiya) editor'ni sinxronlash
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Faqat rasm"); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("Rasm 3MB dan kichik bo'lsin"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `lesson-images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "31536000" });
      if (error) { toast.error(error.message); setUploading(false); return; }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      editor?.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch (e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  }, [editor, supabase, bucket]);

  if (!editor) return <div className="h-64 rounded-xl border border-border/60 bg-surface/30 animate-pulse" />;

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <Toolbar editor={editor} uploading={uploading} onImage={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
