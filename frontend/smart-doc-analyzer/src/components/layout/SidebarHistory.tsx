import { useEffect, useState } from "react";
import { AlertTriangle, FileMinusCorner, History } from "lucide-react";

import api from "../../api/axios";
import type { HistoryDocument } from "../../types/document";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { getFileIconByName } from "../../utils/fileIcons";

const SidebarHistory = () => {
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { documents, setDocuments, selectDocument, selectedDocument } =
    useWorkspaceStore();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get<HistoryDocument[]>("/history");
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, [setDocuments]);

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteDocument = async (documentId: number) => {
    setDeletingId(documentId);

    setTimeout(async () => {
      try {
        await api.delete(`/history/document/${documentId}`);

        const res = await api.get<HistoryDocument[]>("/history");
        setDocuments(res.data);

        if (selectedDocument?.document_id === documentId) {
          selectDocument(null);
        }

        setConfirmDeleteId(null);
        setDeletingId(null);
      } catch (err) {
        console.error("Failed to delete document:", err);
        setDeletingId(null);
      }
    }, 500);
  };

  return (
    <div className="h-full flex flex-col p-6 inter">
      <h2 className="text-lg mb-4 text-[#E6EDF3] flex items-center gap-2 alyamama">
        <History className="w-5 h-5 text-[#58A6FF]" />
        <span>History</span>
      </h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 rounded-none bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] text-sm placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
      />

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredDocs.map((doc) => {
          const isActive = selectedDocument?.document_id === doc.document_id;
          const showConfirm = confirmDeleteId === doc.document_id;
          const isDeleting = deletingId === doc.document_id;
          const createdAt = new Date(doc.created_at);

          return (
            <div
              key={doc.document_id}
              className={isDeleting ? "animate-fadeOutDisintegrate" : ""}
            >
              <div
                className={`flex items-center justify-between px-3 py-3 rounded-none cursor-pointer transition-all duration-200 border ${
                  isActive
                    ? "bg-[#1C2128] border-[#58A6FF] text-white"
                    : "bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]"
                }`}
              >
                <div onClick={() => selectDocument(doc)} className="flex-1 min-w-0">
                  <p className="text-sm truncate flex items-center gap-2 alyamama">
                    <img
                      src={getFileIconByName(doc.filename)}
                      alt="file"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{doc.filename}</span>
                  </p>
                  <div className="text-xs text-[#8B949E] mt-1 flex justify-between">
                    <span>Date: {createdAt.toLocaleDateString()}</span>
                    <span>Time: {createdAt.toLocaleTimeString()}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(doc.document_id);
                  }}
                  className="ml-3 text-[#8B949E] hover:text-red-300 transition"
                  aria-label="Delete document"
                >
                  <FileMinusCorner className="w-4 h-4" />
                </button>
              </div>

              {showConfirm && (
                <div className="mt-2 p-3 rounded-none bg-[#2D0E11] border border-[#8B2323] animate-fadeInUp">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#FF7B72] mt-0.5" />
                    <div>
                      <div className="text-sm text-[#FF7B72] mb-1 alyamama">CAUTION</div>
                      <div className="text-xs text-[#F2CC60]">
                        If you delete this file, all its results will be gone. Are you sure?
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1 rounded-none bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-xs"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.document_id)}
                      className="px-3 py-1 rounded-none bg-[#DA3633] text-white text-xs"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarHistory;
