import { useState } from "react";
import type { AxiosError } from "axios";
import { createPortal } from "react-dom";
import api from "../../api/axios";

interface Props {
  taskId: number;
  onClose: () => void;
  onSubmitted: () => void;
}

const FeedbackModal = ({ taskId, onClose, onSubmitted }: Props) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!rating) return;

    setError("");
    setSubmitting(true);
    try {
      await api.post("/feedback", null, {
        params: {
          task_result_id: taskId,
          rating,
          comment: comment.trim() || undefined,
        },
      });

      onSubmitted();
      onClose();
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      const detail = axiosErr.response?.data?.detail;

      if (detail === "You already rated this result.") {
        onSubmitted();
        onClose();
        return;
      }

      setError(typeof detail === "string" ? detail : "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hovered || rating;

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  const modalContent = (
    <>
      {/* ── Styles ── */}
      <style>{`
        @keyframes fm-in {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fm-star-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.35); }
          100% { transform: scale(1.18); }
        }
        .fm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          /* Full blur of background — nothing accessible until modal closed */
          backdrop-filter: blur(2px) brightness(0.35) saturate(0.7);
          -webkit-backdrop-filter: blur(14px) brightness(0.35) saturate(0.7);
          background: rgba(7, 11, 20, 0.65);
        }
        .fm-card {
          animation: fm-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          width: 100%;
          max-width: 420px;
          background: rgba(13, 17, 30, 0.97);
          border: 1px solid rgba(139, 92, 246, 0.35);
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 0 60px rgba(139, 92, 246, 0.12),
            0 32px 64px rgba(0, 0, 0, 0.6);
          position: relative;
        }
        /* Thin top accent bar */
        .fm-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #8b5cf6, #22d3ee, #8b5cf6, transparent);
        }
        .fm-header {
          padding: 1.5rem 1.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .fm-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fm-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(139, 92, 246, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .fm-title {
          font-size: 1rem;
          font-weight: 700;
          color: #f0f6ff;
          letter-spacing: -0.01em;
        }
        .fm-sub {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
          margin-top: 1px;
        }
        .fm-close {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .fm-close:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        .fm-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        /* Stars */
        .fm-stars-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .fm-stars {
          display: flex;
          gap: 6px;
        }
        .fm-star {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          font-size: 2rem;
          line-height: 1;
          transition: color 0.15s ease, transform 0.15s ease;
          color: rgba(255,255,255,0.12);
        }
        .fm-star--active {
          color: #fbbf24;
          animation: fm-star-pop 0.25s ease forwards;
        }
        .fm-star--hover {
          color: #fde68a;
          transform: scale(1.15);
        }
        .fm-rating-label {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fbbf24;
          min-height: 1rem;
          transition: opacity 0.2s;
        }
        .fm-rating-label--empty {
          color: rgba(255,255,255,0.2);
        }
        /* Divider */
        .fm-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
        }
        /* Comment */
        .fm-textarea-wrap {
          position: relative;
        }
        .fm-textarea-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
          display: block;
        }
        .fm-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 12px;
          color: #e6edf3;
          font-size: 0.875rem;
          font-family: inherit;
          padding: 12px 14px;
          resize: none;
          outline: none;
          transition: all 0.25s ease;
          min-height: 88px;
          line-height: 1.55;
        }
        .fm-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .fm-textarea:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
        }
        /* Error */
        .fm-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 0.82rem;
        }
        /* Footer */
        .fm-footer {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .fm-hint {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
        }
        .fm-actions {
          display: flex;
          gap: 0.6rem;
        }
        .fm-btn-cancel {
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 0.83rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.55);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .fm-btn-cancel:hover {
          background: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.18);
        }
        .fm-submit-wrap { position: relative; }
        .fm-submit-glow {
          position: absolute;
          inset: -1px;
          border-radius: 11px;
          background: linear-gradient(135deg, #8b5cf6, #22d3ee);
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .fm-submit-wrap:hover .fm-submit-glow { opacity: 0.5; }
        .fm-btn-submit {
          position: relative;
          padding: 9px 22px;
          border-radius: 10px;
          font-size: 0.83rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fm-btn-submit--ready {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white;
          box-shadow: 0 4px 16px rgba(139,92,246,0.3);
        }
        .fm-btn-submit--ready:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(139,92,246,0.45);
        }
        .fm-btn-submit--disabled {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          cursor: not-allowed;
          border: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      {/* ── Overlay (blurs entire page) ── */}
      <div className="fm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="fm-card">

          {/* Header */}
          <div className="fm-header">
            <div className="fm-title-row">
              <div className="fm-icon">
                <svg width="17" height="17" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <div className="fm-title">Rate this result</div>
                <div className="fm-sub">Your feedback helps improve AI quality</div>
              </div>
            </div>
            <button className="fm-close" onClick={onClose} type="button" aria-label="Close">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="fm-body">

            {/* Stars */}
            <div className="fm-stars-wrap">
              <div className="fm-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`fm-star ${
                      star <= activeRating
                        ? star <= rating
                          ? "fm-star--active"
                          : "fm-star--hover"
                        : ""
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className={`fm-rating-label ${activeRating === 0 ? "fm-rating-label--empty" : ""}`}>
                {activeRating ? ratingLabels[activeRating] : "Select a rating"}
              </span>
            </div>

            <div className="fm-divider" />

            {/* Comment */}
            <div>
              <span className="fm-textarea-label">Comment (optional)</span>
              <textarea
                className="fm-textarea"
                placeholder="What did you think of this result? Any suggestions?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={400}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="fm-error">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="fm-footer">
            <span className="fm-hint">{rating > 0 ? `${rating} of 5 stars` : "Required"}</span>
            <div className="fm-actions">
              <button className="fm-btn-cancel" onClick={onClose} type="button">
                Cancel
              </button>
              <div className="fm-submit-wrap">
                <div className="fm-submit-glow" />
                <button
                  className={`fm-btn-submit ${rating && !submitting ? "fm-btn-submit--ready" : "fm-btn-submit--disabled"}`}
                  onClick={submitFeedback}
                  disabled={!rating || submitting}
                  type="button"
                >
                  {submitting ? (
                    <>
                      <svg style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default FeedbackModal;
