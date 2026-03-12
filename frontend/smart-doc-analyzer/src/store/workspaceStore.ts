import { create } from "zustand";
import type { HistoryDocument } from "../types/document";

export type TaskType =
  | "summarize"
  | "translate"
  | "topic"
  | "sentiment"
  | "rag";

interface WorkspaceState {
  documents: HistoryDocument[];
  selectedDocument: HistoryDocument | null;
  selectedTask: TaskType | null;
  chatInput: string;
  isProcessing : boolean;

  setDocuments: (docs: HistoryDocument[]) => void;
  selectDocument: (doc: HistoryDocument | null) => void;
  setSelectedTask: (task: TaskType | null) => void;
  setChatInput: (value: string) => void;
  setProcessing: (value: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  documents: [],
  selectedDocument: null,
  selectedTask: null,
  chatInput: "",
  isProcessing : false,

  setDocuments: (docs) => set({ documents: docs }),
  selectDocument: (doc) =>
    set({
      selectedDocument: doc,
      selectedTask: null,
      chatInput: "",
      isProcessing: false,
    }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setChatInput: (value) => set({ chatInput: value }),
  setProcessing: (value) => set({ isProcessing : value }),
}));
