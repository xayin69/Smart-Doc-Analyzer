import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCopy,
  ClipboardPaste,
  MessageCircleCheck,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { useWorkspaceStore } from "../../store/workspaceStore";
import InputSummary from "./Inputsummary";
import FeedbackModal from "../common/FeedbackModal";
import api from "../../api/axios";
import type { HistoryDocument } from "../../types/document";
import AnimatedSmartDocIcon from "../icons/AnimatedSmartDocIcon";
import "./WorkSpacestyles/results-panel.css";

const ResultsPanel = () => {
  const { selectedDocument, selectDocument, setDocuments, isProcessing } =
    useWorkspaceStore();

  const navigate = useNavigate();

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTaskId, setFeedbackTaskId] = useState<number | null>(null);
  const [ratedTasks, setRatedTasks] = useState<Set<number>>(new Set());
  const [copiedTaskId, setCopiedTaskId] = useState<number | null>(null);
  const [convertingTaskId, setConvertingTaskId] = useState<number | null>(null);
  const [convertedTaskId, setConvertedTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  useEffect(() => {
    setRatedTasks(new Set());
    setCopiedTaskId(null);
    setConvertedTaskId(null);
    setDeletingTaskId(null);
  }, [selectedDocument?.document_id]);

  useEffect(() => {
    const loadRatedTasks = async () => {
      if (!selectedDocument?.tasks?.length) {
        setRatedTasks(new Set());
        return;
      }

      try {
        const taskIds = selectedDocument.tasks.map((t) => t.task_id).join(",");
        const res = await api.get<{ rated_task_ids: number[] }>(
          `/feedback/rated?task_ids=${taskIds}`
        );
        setRatedTasks(new Set(res.data.rated_task_ids));
      } catch (err) {
        console.error("Failed to load rated tasks:", err);
      }
    };

    loadRatedTasks();
  }, [selectedDocument?.document_id, selectedDocument?.tasks]);

  const handleDeleteTask = async (taskId: number) => {
    setDeletingTaskId(taskId);

    setTimeout(async () => {
      try {
        await api.delete(`/history/task/${taskId}`);

        const res = await api.get<HistoryDocument[]>("/history");
        setDocuments(res.data);

        if (selectedDocument) {
          const updated = res.data.find(
            (doc) => doc.document_id === selectedDocument.document_id
          );

          if (updated) {
            selectDocument(updated);
          } else {
            selectDocument(null);
          }
        }
      } catch (err) {
        console.error("Failed to delete task:", err);
      } finally {
        setDeletingTaskId((prev) => (prev === taskId ? null : prev));
      }
    }, 280);
  };

  const handleCopy = async (taskId: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTaskId(taskId);
      setTimeout(() => {
        setCopiedTaskId((prev) => (prev === taskId ? null : prev));
      }, 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleConvert = async (taskId: number, text: string) => {
    setConvertingTaskId(taskId);

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const containsArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-99999px";
    container.style.top = "0";
    container.style.width = `${printableWidth}px`;
    container.style.padding = "0";
    container.style.paddingBottom = "24px";
    container.style.margin = "0";
    container.style.whiteSpace = "pre-wrap";
    container.style.wordBreak = "break-word";
    container.style.fontSize = "14px";
    container.style.lineHeight = "1.6";
    container.style.color = "#111827";
    container.style.background = "#ffffff";
    container.style.direction = containsArabic ? "rtl" : "ltr";
    container.style.textAlign = containsArabic ? "right" : "left";
    container.style.fontFamily = containsArabic
      ? "Tahoma, Arial, sans-serif"
      : "Helvetica, Arial, sans-serif";

    const title = document.createElement("div");
    title.style.fontWeight = "700";
    title.style.fontSize = "16px";
    title.style.marginBottom = "12px";
    title.textContent = "Smart Doc Analyzer Result";

    const body = document.createElement("div");
    body.textContent = text;
    body.style.paddingBottom = "16px";

    container.appendChild(title);
    container.appendChild(body);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * printableWidth) / canvas.width;

      let heightLeft = imgHeight;
      let positionY = margin;

      doc.addImage(
        imgData,
        "PNG",
        margin,
        positionY,
        printableWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= printableHeight;

      while (heightLeft > 0) {
        doc.addPage();
        positionY = margin - (imgHeight - heightLeft);
        doc.addImage(
          imgData,
          "PNG",
          margin,
          positionY,
          printableWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= printableHeight;
      }

      doc.save(`result-${taskId}.pdf`);
      setConvertedTaskId(taskId);
      setTimeout(() => {
        setConvertedTaskId((prev) => (prev === taskId ? null : prev));
      }, 1200);
    } catch (err) {
      console.error("PDF conversion failed:", err);
    } finally {
      document.body.removeChild(container);
      setConvertingTaskId((prev) => (prev === taskId ? null : prev));
    }
  };

  const handleRate = (taskId: number) => {
    setFeedbackTaskId(taskId);
    setShowFeedback(true);
  };

  const handleRatingSubmitted = (taskId: number) => {
    setRatedTasks((prev) => new Set(prev).add(taskId));
  };

  if (isProcessing) {
    return (
      <div className="results-loading">
        <div className="loading-file-info">
          <div className="loading-file-label alyamama">
            File
          </div>
          <div className="loading-file-name inter">
            {selectedDocument?.filename}
          </div>
        </div>

        <div className="loading-spinner" />

        <p className="loading-text inter">Executing request...</p>
      </div>
    );
  }

  if (!selectedDocument || selectedDocument.tasks?.length === 0) {
    return (
      <div className="results-empty inter">
        No results yet!
      </div>
    );
  }

  const sortedTasks = [...selectedDocument.tasks].sort((a, b) => {
    const timeDiff =
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.task_id - b.task_id;
  });

  const latestTaskId = sortedTasks[sortedTasks.length - 1]?.task_id;

  return (
    <div className="results-container">
      <div className="results-scroll">
        <div className="results-grid">
          {sortedTasks.map((task) => {
            const isLatest = task.task_id === latestTaskId;
            const isRated = ratedTasks.has(task.task_id);
            const isCopied = copiedTaskId === task.task_id;
            const isConverted = convertedTaskId === task.task_id;
            const isDeleting = deletingTaskId === task.task_id;

            return (
              <div key={task.task_id} className="result-card-wrapper">
                <div className="flex justify-end">
                  <InputSummary filename={selectedDocument.filename} task={task} />
                </div>

                <div
                  className={`result-card ${isLatest ? "latest" : ""} ${isDeleting ? "deleting" : ""}`}
                >
                  <div className="result-card-header">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="result-branding"
                      title="Go to Home"
                    >
                      <AnimatedSmartDocIcon />
                      <span className="result-branding-text rubik-maps-regular">
                        Smart Doc Analyzer
                      </span>
                    </button>

                    <span className="result-status-badge alyamama">
                      {isLatest ? "Current Result" : "Previous Result"}
                    </span>
                  </div>

                  <div className="result-card-content inter">
                    {task.result_text}
                  </div>

                  <div className="result-card-footer">
                    <button
                      onClick={() => handleRate(task.task_id)}
                      disabled={isRated}
                      title="Rate"
                      className={`result-action-btn ${isRated ? "rated" : ""}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {isRated ? (
                          <StarOff className="w-4 h-4 animate-iconPop" />
                        ) : (
                          <Star className="w-4 h-4 animate-iconPop" />
                        )}
                        <span className="alyamama">{isRated ? "Rated" : "Rate"}</span>
                      </span>
                    </button>

                    <div className="result-action-group">
                      <button
                        onClick={() => handleDeleteTask(task.task_id)}
                        disabled={isDeleting}
                        className="result-action-btn delete-btn"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopy(task.task_id, task.result_text)}
                        className="result-action-btn"
                        title={isCopied ? "Copied" : "Copy"}
                      >
                        {isCopied ? (
                          <MessageCircleCheck className="w-4 h-4 animate-iconPop" />
                        ) : (
                          <ClipboardCopy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleConvert(task.task_id, task.result_text)}
                        disabled={convertingTaskId !== null}
                        className="result-action-btn"
                        title={
                          convertingTaskId === task.task_id
                            ? "Converting..."
                            : isConverted
                              ? "Converted"
                              : "Convert"
                        }
                      >
                        {convertingTaskId === task.task_id ? (
                          <span className="inline-block w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                        ) : isConverted ? (
                          <MessageCircleCheck className="w-4 h-4 animate-iconPop" />
                        ) : (
                          <ClipboardPaste className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showFeedback && feedbackTaskId !== null && (
        <FeedbackModal
          taskId={feedbackTaskId}
          onClose={() => {
            setShowFeedback(false);
            setFeedbackTaskId(null);
          }}
          onSubmitted={() => {
            handleRatingSubmitted(feedbackTaskId);
            setShowFeedback(false);
            setFeedbackTaskId(null);
          }}
        />
      )}
    </div>
  );
};

export default ResultsPanel;
