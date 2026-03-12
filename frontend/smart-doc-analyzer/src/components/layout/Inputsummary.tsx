import type { ComponentType } from "react";
import {
  FileText,
  Languages,
  NotebookText,
  Smile,
  SquareLibrary,
  TextSearch,
} from "lucide-react";

import type { TaskResult } from "../../types/document";
import { getFileIconByName } from "../../utils/fileIcons";

interface Props {
  filename: string;
  task: TaskResult;
}

const InputSummary = ({ filename, task }: Props) => {
  const methodIcons: Record<string, ComponentType<{ className?: string }>> = {
    summarize_document: NotebookText,
    translate: Languages,
    topic_classification: SquareLibrary,
    sentiment: Smile,
    qa: TextSearch,
  };

  const MethodIcon = methodIcons[task.task_type] || FileText;
  const displayMethod =
    task.task_type === "qa"
      ? "RAG"
      : task.task_type.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const normalizedQuestion = task.question?.trim().replace(/^['"]+|['"]+$/g, "");

  return (
    <div className="min-w-[260px] max-w-[520px] border border-[#4b3b73] rounded-none bg-[var(--purple-panel)]">
      <div className="px-3 py-2 text-sm text-[#E6EDF3] inter flex items-center gap-2 border-b border-[#4b3b73]">
        <img
          src={getFileIconByName(filename)}
          alt="File type"
          className="w-4 h-4 object-contain"
        />
        <span className="truncate">{filename}</span>
      </div>

      <div className="px-3 py-2 text-sm text-[#E6EDF3] inter flex items-center gap-2">
        <MethodIcon className="w-4 h-4 text-[#B7A0FF]" />
        <span>{displayMethod}</span>
      </div>

      {normalizedQuestion && (
        <div className="px-3 py-2 text-sm text-[#D2C5FF] inter italic truncate border-t border-[#4b3b73]">
          {normalizedQuestion}
        </div>
      )}
    </div>
  );
};

export default InputSummary;
