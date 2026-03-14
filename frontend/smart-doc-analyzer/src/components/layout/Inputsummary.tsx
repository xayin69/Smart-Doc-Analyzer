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
import "./WorkSpacestyles/Input-summary.css";

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

  // Determine variant class based on task type
  const variantClass = 
    task.task_type === "qa" ? "variant-rag" :
    task.task_type === "translate" ? "variant-translate" :
    task.task_type === "sentiment" ? "variant-sentiment" :
    "";

  return (
    <div className={`input-summary-card ${variantClass}`}>
      {/* Filename Section */}
      <div className="input-summary-filename">
        <img
          src={getFileIconByName(filename)}
          alt="File type"
          className="input-summary-file-icon"
        />
        <span className="input-summary-file-name inter">
          {filename}
        </span>
      </div>

      {/* Method Section */}
      <div className="input-summary-method">
        <MethodIcon className="input-summary-method-icon" />
        <span className="input-summary-method-name inter">
          {displayMethod}
        </span>
      </div>

      {/* Question Section (only for RAG/QA) */}
      {normalizedQuestion && (
        <div className="input-summary-question">
          <div className="input-summary-question-text inter">
            {normalizedQuestion}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSummary;
