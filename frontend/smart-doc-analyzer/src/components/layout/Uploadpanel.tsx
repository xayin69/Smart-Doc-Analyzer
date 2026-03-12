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
import "./Chatbox.css";

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
      const timer = setTimeout(() => {
        setUploadError(null);
      }, 5000);
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await api.get<HistoryDocument[]>("/history");
      setDocuments(res.data);

      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (sorted.length > 0) {
        selectDocument(sorted[0]);
      }
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
    if (file) {
      handleUpload(file);
    }
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

      if (selectedTask === "rag") {
        setChatInput("");
      }

      const res = await api.get<HistoryDocument[]>("/history");
      setDocuments(res.data);

      const updated = res.data.find(
        (doc) => doc.document_id === selectedDocument.document_id
      );

      if (updated) {
        selectDocument(updated);
      }
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
      if (isSubmitEnabled) {
        void executeTask();
      }
    }
  };

  const uploadedFileIcon = selectedDocument
    ? getFileIconByName(selectedDocument.filename)
    : null;

  return (
    <div
      className={`p-6 relative ${
        isDragging ? "ring-2 ring-[#58A6FF] rounded-2xl" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0D1117]/70 rounded-2xl pointer-events-none">
          <div className="px-6 py-3 rounded-xl bg-[#161B22] text-[#E6EDF3] text-sm font-medium border border-[#30363D] shadow-lg">
            Drop a  file to upload
          </div>
        </div>
      )}

      {uploadError && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-uploadErrorToast">
          <div className="px-6 py-3 rounded-full bg-red-500 text-white text-sm font-semibold shadow-2xl border border-red-300">
            {uploadError}
          </div>
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="mb-6 border-2 border-dashed border-[#30363D] rounded-2xl p-8 text-center cursor-pointer hover:border-[#58A6FF] hover:bg-[#1C2128] transition bg-[#0D1117]"
      >
        {selectedDocument ? (
          <div className="flex items-center justify-center gap-3">
            <CloudCheck className="w-11 h-11 text-[#58A6FF]" />
            {uploadedFileIcon && (
              <img
                src={uploadedFileIcon}
                alt="Uploaded file"
                className="w-8 h-8 object-contain"
              />
            )}
            <div className="text-left">
              <p className="text-[#E6EDF3] text-sm font-medium">Uploaded</p>
              <p className="text-[#8B949E] text-xs truncate max-w-[220px]">
                {selectedDocument.filename}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <CloudUpload className="w-10 h-10 mx-auto mb-2 text-[#58A6FF]" />
            <p className="text-[#E6EDF3] text-sm font-medium">Upload a Document</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      {isChatMode ? (
        <div className="mb-4 animate-swapMorph chatbox-wrap">
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
        <div className="mb-6 flex justify-center animate-swapMorph">
          <button
            disabled={!isSubmitEnabled}
            onClick={executeTask}
            className="super-button"
            title="Execute"
          >
            <span>Analyze</span>
            <ArrowUp className="super-arrow" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap justify-center relative">
        {taskOptions.map(({ type, Icon, label }) => {
          const isActive = selectedTask === type;
          const animating = isActive;

          const iconAnimationClass =
            type === "summarize"
              ? `${animating ? "animate-noteLoop" : ""} icon-noteLoop`
              : type === "sentiment"
              ? `${animating ? "animate-moodLoop" : ""} icon-moodLoop`
              : type === "rag"
              ? `${animating ? "animate-ragLoop" : ""} icon-ragLoop`
              : type === "topic"
              ? `${animating ? "animate-libraryLoop" : ""} icon-libraryLoop`
              : `${animating ? "animate-langLoop" : ""} icon-langLoop`;

          return (
            <button
              key={type}
              onClick={() => setSelectedTask(isActive ? null : type)}
              className={`relative group task-method-btn ${isActive ? "task-active" : ""} rounded-xl font-medium transition-all duration-300 min-w-[110px]`}
            >
              <div className="task-shine absolute z-[4] -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-400 to-white/10 opacity-35 -skew-x-12 pointer-events-none" />
              <div className="task-orbit-ring" />
              <div className="task-spin-halo" />

              <div
                className={`task-method-inner relative z-[2] flex flex-col items-center gap-1 px-4 py-3 rounded-[10px] ${
                  isActive ? "task-method-inner-active text-white" : "text-[#E6EDF3]"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${iconAnimationClass}`} />
                <span className="text-xs rozha-one-regular">{label}</span>
              </div>
            </button>
          );
        })}

        <div className="relative" ref={moreMethodsRef}>
          <button
            type="button"
            onClick={() => setShowMoreMethods((prev) => !prev)}
            className="text-[#8B949E] hover:text-[#E6EDF3] transition"
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
