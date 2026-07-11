// ====================================
// Database Types
// ====================================

export type UserRole = 'student' | 'teacher' | 'admin';
export type UserLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SubmissionStatus = 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'compilation_error' | 'runtime_error' | 'time_limit' | 'memory_limit';
export type CoinTransactionType = 'registration_bonus' | 'topic_complete' | 'course_complete' | 'challenge_solved' | 'streak_bonus' | 'achievement_bonus' | 'course_purchase' | 'admin_adjustment' | 'quiz_bonus';

export interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  level: UserLevel;
  coins: number;
  xp: number;
  streak_days: number;
  longest_streak: number;
  last_active_date: string | null;
  preferred_language: string;
  theme: string;
  ab_group: 'control' | 'experiment';
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty: CourseDifficulty | null;
  is_free: boolean;
  price_coins: number;
  is_published: boolean;
  author_id: string | null;
  coin_reward: number;
  estimated_hours: number | null;
  total_topics: number;
  total_enrolled: number;
  average_rating: number;
  tags: string[] | null;
  prerequisites: string[] | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type VideoProvider = 'youtube' | 'bunny' | 'cloudflare' | 'vimeo' | 'direct';

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  estimated_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  course_id: string;
  section_id: string | null;
  title: string;
  slug: string;
  content_html: string | null;
  video_url: string | null;
  video_provider: VideoProvider | null;
  video_id: string | null;
  video_duration_seconds: number | null;
  presentation_url: string | null;
  order_index: number;
  coin_reward: number;
  xp_reward: number;
  estimated_minutes: number;
  is_free_preview: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/** Public mundarija (topics_toc view) — kontent ustunlarisiz */
export interface TopicTocEntry {
  id: string;
  course_id: string;
  section_id: string | null;
  title: string;
  slug: string;
  order_index: number;
  estimated_minutes: number;
  coin_reward: number;
  xp_reward: number;
  is_free_preview: boolean;
  is_published: boolean;
  video_duration_seconds: number | null;
  has_video: boolean;
}

export interface Quiz {
  id: string;
  topic_id: string;
  question: string;
  question_type: 'single' | 'multiple';
  options: QuizOption[];
  explanation: string | null;
  points: number;
  order_index: number;
  created_at: string;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface TopicTask {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  instruction_html: string | null;
  starter_code: string;
  solution_code: string | null;
  language: string;
  test_cases: TestCase[];
  hints: TaskHint[] | null;
  difficulty: Difficulty;
  coin_reward: number;
  xp_reward: number;
  time_limit_ms: number;
  memory_limit_kb: number;
  order_index: number;
  created_at: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface TaskHint {
  order: number;
  text: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  instruction_html: string | null;
  category: string;
  difficulty: Difficulty;
  languages: string[];
  starter_code: Record<string, string>;
  test_cases: TestCase[];
  hidden_test_cases: TestCase[];
  time_limit_ms: number;
  memory_limit_kb: number;
  coin_reward: number;
  xp_reward: number;
  solved_count: number;
  attempt_count: number;
  is_published: boolean;
  author_id: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_percent: number;
  completed_topics: number;
  total_topics: number;
  is_completed: boolean;
  enrolled_at: string;
  completed_at: string | null;
  last_accessed_at: string;
  course?: Course;
}

export interface TopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  course_id: string;
  content_read: boolean;
  video_watched: boolean;
  quiz_passed: boolean;
  quiz_score: number | null;
  quiz_total: number | null;
  tasks_completed: boolean;
  is_completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface Submission {
  id: string;
  user_id: string;
  task_id: string;
  task_type: 'topic_task' | 'challenge';
  code: string;
  language: string;
  status: SubmissionStatus;
  test_results: SubmissionTestResult[] | null;
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number | null;
  memory_used_kb: number | null;
  ai_feedback: string | null;
  created_at: string;
}

export interface SubmissionTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  time_ms: number;
}

export interface QuizResult {
  id: string;
  user_id: string;
  topic_id: string;
  score: number;
  total: number;
  percentage: number;
  answers: QuizAnswer[];
  ai_feedback: string | null;
  time_spent_seconds: number | null;
  attempt_number: number;
  completed_at: string;
}

export interface QuizAnswer {
  quiz_id: string;
  selected: string[];
  is_correct: boolean;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: CoinTransactionType;
  reference_id: string | null;
  description: string | null;
  balance_after: number | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  category: string;
  requirement_type: string;
  requirement_count: number;
  coin_reward: number;
  xp_reward: number;
  is_hidden: boolean;
  order_index: number;
  created_at: string;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  template_id: string | null;
  certificate_number: string;
  full_name: string;
  course_title: string;
  completion_date: string;
  score_percentage: number | null;
  pdf_url: string | null;
  issued_at: string;
  course?: Course;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  coins: number;
  streak_days: number;
  level: UserLevel;
  challenges_solved: number;
  courses_completed: number;
  rank: number;
}

// ====================================
// API Types
// ====================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CodeExecutionRequest {
  code: string;
  language: string;
  input?: string;
  test_cases?: TestCase[];
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  status: string;
  time_ms: number;
  memory_kb: number;
  test_results?: SubmissionTestResult[];
}

export interface AIFeedbackRequest {
  code: string;
  task_description: string;
  language: string;
  test_results: SubmissionTestResult[];
  user_level: UserLevel;
}

export interface AIFeedbackResponse {
  feedback: string;
  strengths: string[];
  improvements: string[];
  next_topic_suggestion: string | null;
  score: number; // 1-10
}

// ====================================
// UI Types
// ====================================

export interface SidebarLink {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
}

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java' | 'go';

export const LANGUAGE_CONFIG: Record<SupportedLanguage, { label: string; monacoId: string; icon: string }> = {
  python: { label: 'Python', monacoId: 'python', icon: '🐍' },
  javascript: { label: 'JavaScript', monacoId: 'javascript', icon: '📜' },
  typescript: { label: 'TypeScript', monacoId: 'typescript', icon: '🔷' },
  cpp: { label: 'C++', monacoId: 'cpp', icon: '⚡' },
  java: { label: 'Java', monacoId: 'java', icon: '☕' },
  go: { label: 'Go', monacoId: 'go', icon: '🐹' },
};
