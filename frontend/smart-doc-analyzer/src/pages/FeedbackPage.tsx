import { useState, type FormEvent } from "react";
import api from "../api/axios";
import PublicPageLayout from "../home/PublicPageLayout";
import "../styles/feedback-animations.css";

const FeedbackPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/feedback/contact", {
        username,
        email,
        subject,
        feedback,
      });

      setUsername("");
      setEmail("");
      setSubject("");
      setFeedback("");
      setSuccessMessage("Thank you for your feedback. It has been sent.");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setErrorMessage(typeof detail === "string" ? detail : "Failed to send feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicPageLayout>
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-slow animation-delay-3000"></div>
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-none blur-xl opacity-60 animate-warm-glow"></div>

        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-none shadow-2xl border border-gray-800 p-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-10 h-10 text-amber-400 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                FeedBack
              </h1>
            </div>
            <p className="text-gray-400 text-base">We&apos;d love to hear your thoughts and suggestions!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div >
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <div className="relative">
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="What&apos;s this about?"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div >
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={8}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Share your thoughts, suggestions, or report an issue..."
              ></textarea>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">{feedback.length} characters</p>
                <p className="text-xs text-gray-500">Be specific and detailed for better assistance</p>
              </div>
            </div>

            <div className="pt-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-none blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-gray-900 font-bold text-lg rounded-none shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Feedback
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {successMessage && <p className="text-emerald-300 text-sm">{successMessage}</p>}
            {errorMessage && <p className="text-red-300 text-sm">{errorMessage}</p>}
          </form>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-none">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-amber-300 font-medium mb-1">Quick Tips</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Be specific about the issue or suggestion</li>
                  <li>• Include steps to reproduce if reporting a bug</li>
                  <li>• Screenshots are welcome (you can attach them via email)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-amber-400 text-2xl animate-float-gentle">⭐</div>
        <div className="absolute top-1/2 right-1/4 text-orange-400 text-3xl animate-float-gentle animation-delay-2000">💛</div>
        <div className="absolute bottom-1/3 left-1/2 text-yellow-400 text-2xl animate-float-gentle animation-delay-4000">✨</div>
        <div className="absolute top-2/3 right-1/3 text-amber-400 text-xl animate-float-gentle animation-delay-3000">⭐</div>
      </div>
      </div>
    </PublicPageLayout>
  );
};

export default FeedbackPage;
