export interface TaskResult {
  task_id: number;
  task_type: string;
  created_at: string;
  result_text: string;
  question?: string | null;
}

export interface HistoryDocument {
  document_id: number;
  filename: string;
  created_at: string;
  tasks: TaskResult[];
}
