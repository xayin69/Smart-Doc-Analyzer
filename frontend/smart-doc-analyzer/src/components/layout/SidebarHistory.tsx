import { useEffect, useState } from "react";
import { AlertTriangle, History, Search, Trash2 } from "lucide-react";

import api from "../../api/axios";
import type { HistoryDocument } from "../../types/document";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { getFileIconByName } from "../../utils/fileIcons";
import "./WorkSpacestyles/sidebar-history.css";

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

  const formatDate = (createdAt: string) => {
    const d = new Date(createdAt);
    return d.toLocaleDateString([], { dateStyle: "medium" });
  };

  const formatTime = (createdAt: string) => {
    const d = new Date(createdAt);
    return d.toLocaleTimeString([], { timeStyle: "short" });
  };

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
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title alyamama">
          <History className="sidebar-title-icon" />
          History
        </h3>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sidebar-search-input inter"
          />
          <Search className="sidebar-search-icon" />
        </div>
      </div>

      <div className="sidebar-list">
        {filteredDocs.length === 0 && (
          <div className="sidebar-list-empty inter">No documents yet</div>
        )}
        {filteredDocs.map((doc) => {
          const isActive = selectedDocument?.document_id === doc.document_id;
          const showConfirm = confirmDeleteId === doc.document_id;
          const isDeleting = deletingId === doc.document_id;

          return (
            <div
              key={doc.document_id}
              className={isDeleting ? "animate-fadeOutDisintegrate" : ""}
            >
              <div
                className={`document-item ${isActive ? "active" : ""}`}
                onClick={() => selectDocument(doc)}
              >
                <div className="document-item-content">
                  <img
                    src={getFileIconByName(doc.filename)}
                    alt="file"
                    className="document-icon"
                  />

                  <div className="document-info">
                    <div className="document-top-row">
                      <span className="document-name inter">
                        {doc.filename}
                      </span>
                      {doc.tasks?.length > 0 && (
                        <span className="document-badge">
                          {doc.tasks.length} tasks
                        </span>
                      )}
                    </div>

                    <div className="document-meta">
                      <span className="document-date inter">
                      <span className="text-[#8B949E]">Date : </span>
                      {formatDate(doc.created_at)}
                    </span>
                      <span className="document-date inter">
                      <span className="text-[#8B949E]">Time : </span>
                      {formatTime(doc.created_at)}
                    </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(doc.document_id);
                  }}
                  className="document-delete-btn"
                  aria-label="Delete document"
                >
                  <Trash2 size={14} />
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
