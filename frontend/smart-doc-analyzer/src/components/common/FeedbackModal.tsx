import { useState } from "react";
import type { AxiosError } from "axios";
import api from "../../api/axios";

interface Props {
  taskId: number;
  onClose: () => void;
  onSubmitted: () => void;
}

const FeedbackModal = ({ taskId, onClose, onSubmitted }: Props) => {
  const [rating, setRating] = useState<number>(0);
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

      // Keep UI in sync if backend says this task was already rated.
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0891b2] border-2 border-cyan-300 p-6 rounded-2xl w-[420px] neon-cyan-strong animate-fadeInUp shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Rate this result</h3>

        <div className="flex gap-2 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition-all ${
                star <= rating ? "text-yellow-400 scale-125" : "text-cyan-700 hover:text-cyan-500 hover:scale-110"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-200 bg-red-500/30 border border-red-300/40 rounded-lg px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <textarea
          placeholder="Optional comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-white border-2 border-cyan-300 text-gray-900 placeholder-gray-500 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition min-h-[100px] shadow-md"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-700 border-2 border-cyan-400 text-white font-medium hover:bg-cyan-600 transition shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={submitFeedback}
            disabled={!rating || submitting}
            className={`px-4 py-2 rounded-lg font-semibold transition shadow-md ${
              rating && !submitting
                ? "bg-cyan-500 text-white hover:bg-cyan-400 neon-cyan border-2 border-cyan-300"
                : "bg-gray-400 text-gray-600 cursor-not-allowed border-2 border-gray-300"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
