import { useRef, useState, useEffect } from "react";
import type { ComponentType } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import {
  ArrowUp,
  CloudCheck,
  CloudUpload,
  Plus,
  Search,
  X,
} from "lucide-react";

import { useWorkspaceStore } from "../../store/workspaceStore";
import { useModelStore } from "../../store/modelStore";
import type { TaskType } from "../../store/workspaceStore";
import type { HistoryDocument } from "../../types/document";
import type { AxiosError } from "axios";
import api from "../../api/axios";
import { getFileIconByName } from "../../utils/fileIcons";
import SummarizeIcon from "../icons/SummarizeIcon";
import TranslateIcon from "../icons/TranslateIcon";
import RagIcon from "../icons/RagIcon";
import SentimentIcon from "../icons/SentimentIcon";
import TopicIcon from "../icons/TopicIcon";
import "./WorkSpacestyles/upload-panel.css";
import "./WorkSpacestyles/chatbox.css";

type TaskOption = {
  type: TaskType;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const taskOptions: TaskOption[] = [
  { type: "summarize", Icon: SummarizeIcon, label: "SUMMARIZATION" },
  { type: "translate", Icon: TranslateIcon, label: "TRANSLATION" },
  { type: "rag", Icon: RagIcon, label: "Q & A" },
  { type: "sentiment", Icon: SentimentIcon, label: "SENTIMENT" },
  { type: "topic", Icon: TopicIcon, label: "TOPIC " },
];

const UploadPanel = () => {
  const {
    selectedDocument,
    selectedTask,
    setSelectedTask,
    chatInput,
    setChatInput,
    setDocuments,
    selectDocument,
    setProcessing,
  } = useWorkspaceStore();
  const { selectedModel } = useModelStore();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMoreMethods, setShowMoreMethods] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreMethodsRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  useEffect(() => {
    if (!showMoreMethods) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        moreMethodsRef.current &&
        !moreMethodsRef.current.contains(event.target as Node)
      ) {
        setShowMoreMethods(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showMoreMethods]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadError(null);

    try {
      setProcessing(true);
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const res = await api.get<HistoryDocument[]>("/history");
      setDocuments(res.data);

      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      if (sorted.length > 0) selectDocument(sorted[0]);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      const detail = axiosErr.response?.data?.detail;
      if (axiosErr.response?.status === 409) {
        setUploadError(detail || "File already uploaded, try another file.");
      } else {
        setUploadError(null);
      }
      console.error("Upload failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const executeTask = async () => {
    if (!selectedDocument || !selectedTask) return;

    try {
      setProcessing(true);

      const taskTypeMap: Record<TaskType, string> = {
        summarize: "summarize_document",
        translate: "translate",
        topic: "topic_classification",
        sentiment: "sentiment",
        rag: "qa",
      };

      await api.post("/tasks/execute", {
        filename: selectedDocument.filename,
        task_type: taskTypeMap[selectedTask],
        question: selectedTask === "rag" ? chatInput : undefined,
        target_language: selectedTask === "translate" ? "ar" : undefined,
        model_name: selectedModel,
      });

      if (selectedTask === "rag") setChatInput("");

      const res = await api.get<HistoryDocument[]>("/history");
      setDocuments(res.data);

      const updated = res.data.find(
        (doc) => doc.document_id === selectedDocument.document_id
      );
      if (updated) selectDocument(updated);
    } catch (err) {
      console.error("Task execution failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  const isChatMode = selectedTask === "rag";
  const isSubmitEnabled =
    selectedDocument &&
    selectedTask &&
    (selectedTask !== "rag" || chatInput.trim().length > 0);

  useEffect(() => {
    if (!isChatMode) return;
    const el = chatTextareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const nextHeight = Math.min(Math.max(el.scrollHeight, 48), 96);
    el.style.height = `${nextHeight}px`;
  }, [chatInput, isChatMode]);

  const handleChatKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isSubmitEnabled) void executeTask();
    }
  };

  const uploadedFileIcon = selectedDocument
    ? getFileIconByName(selectedDocument.filename)
    : null;

  return (
    <div
      className="upload-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-overlay-text">Drop a file to upload</div>
        </div>
      )}

      {uploadError && (
        <div className="upload-error-toast">
          <div className="upload-error-content">{uploadError}</div>
        </div>
      )}

      {/* ── Drop zone ─────────────────────────────────────────── */}
      {/* FIX: items-center + justify-center so the file info is always centred */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`upload-dropzone ${selectedDocument ? "uploaded" : ""} ${isDragging ? "dragging" : ""}`}
      >
        {selectedDocument ? (
          <div className="upload-file-display">
            <CloudCheck className="upload-icon" />
            <div className="upload-file-main">
              {uploadedFileIcon && (
                <img
                  src={uploadedFileIcon}
                  alt="File"
                  className="upload-file-icon"
                />
              )}
              <div className="upload-file-info">
                <p className="upload-file-status">Uploaded</p>
                <p className="upload-file-name">{selectedDocument.filename}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <CloudUpload className="upload-icon" />
            <p className="upload-text-primary">Upload a Document</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }}
        />
      </div>

      {/* ── Chat / Analyze area ───────────────────────────────── */}
      {/*
        FIX: Both the chatbox (#poda) and the analyze button are wrapped in
        chat-or-analyze-wrapper which already constrains the width.
        The Analyze button now uses the class "analyze-button-full" which
        stretches to 100% of that wrapper — exactly like the chatbox does.
        To change the button size, adjust .chat-or-analyze-wrapper width in
        upload-panel.css (it currently mirrors the #poda max-width).
      */}
      <div className="chat-or-analyze-wrapper">
        {isChatMode ? (
          <div className="chatbox-wrap">
            <div className="grid"></div>
            <div id="poda">
              <div className="glow"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>
              <div className="white"></div>
              <div className="border"></div>

              <div id="main">
                <textarea
                  ref={chatTextareaRef}
                  placeholder="Enter as chat here..."
                  name="text"
                  className="input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  rows={1}
                />
                <div id="input-mask"></div>
                <div id="pink-mask"></div>
                <div className="filterBorder"></div>

                <button
                  id="filter-icon"
                  disabled={!isSubmitEnabled}
                  onClick={() => void executeTask()}
                  title="Send"
                  type="button"
                >
                  <ArrowUp size={18} />
                </button>

                <div id="search-icon">
                  <Search size={20} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FIX: w-full so it matches the chatbox width exactly */
          <div className="analyze-button-wrapper w-full">
            <button
              className="analyze-button w-full"
              disabled={!isSubmitEnabled}
              onClick={executeTask}
              title="Execute"
            >
              <span>Analyze</span>
              <ArrowUp className="analyze-button-icon" />
            </button>
          </div>
        )}
      </div>

      {/* ── Task method buttons ───────────────────────────────── */}
      <div className="task-methods-container">
        {taskOptions.map(({ type, Icon, label }) => {
          const isActive = selectedTask === type;
          const iconAnimationClass =
            type === "summarize"
              ? "icon-noteLoop"
              : type === "sentiment"
              ? "icon-moodLoop"
              : type === "rag"
              ? "icon-ragLoop"
              : type === "topic"
              ? "icon-libraryLoop"
              : "icon-langLoop";

          return (
            <button
              key={type}
              onClick={() => setSelectedTask(isActive ? null : type)}
              className={`task-method-button group ${isActive ? "active" : ""}`}
            >
              <div className="task-border-ring" />
              <div className="task-glow-halo" />
              <div className="task-shine" />

              <div className="task-method-inner">
                <Icon
                  className={`task-method-icon ${iconAnimationClass} ${
                    type === "summarize" && isActive ? "animate-noteLoop" : ""
                  } ${type === "sentiment" && isActive ? "animate-moodLoop" : ""} ${
                    type === "rag" && isActive ? "animate-ragLoop" : ""
                  } ${type === "topic" && isActive ? "animate-libraryLoop" : ""} ${
                    type === "translate" && isActive ? "animate-langLoop" : ""
                  }`.trim()}
                />
                <span className="task-method-label">{label}</span>
              </div>
            </button>
          );
        })}

        <div className="relative" ref={moreMethodsRef}>
          <button
            type="button"
            onClick={() => setShowMoreMethods((prev) => !prev)}
            className="more-methods-button text-[#8B949E] hover:text-[#E6EDF3] transition"
            title="More methods"
          >
            {showMoreMethods ? (
              <X className="w-6 h-6 animate-iconPop" />
            ) : (
              <Plus className="w-6 h-6 animate-iconPop" />
            )}
          </button>

          {showMoreMethods && (
            <div className="absolute right-0 bottom-full mb-2 w-52 p-3 rounded-xl bg-[#161B22] border border-[#30363D] shadow-xl animate-fadeInUp z-20">
              <div className="text-xs uppercase tracking-wide text-[#8B949E] mb-2 alyamama">
                More Methods
              </div>
              <div className="text-sm text-[#E6EDF3]">No additional methods yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
