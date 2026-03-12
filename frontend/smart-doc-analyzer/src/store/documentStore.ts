import { create } from "zustand"
import axios from "axios"

export interface TaskResult {
  id: number
  task_type: string
  result_text: string
  created_at: string
}

export interface Document {
  id: number
  filename: string
  created_at: string
  tasks: TaskResult[]
}

interface DocumentStore {
  documents: Document[]
  selectedDocument: Document | null
  loading: boolean

  fetchDocuments: () => Promise<void>
  selectDocument: (doc: Document) => void
  refreshDocuments: () => Promise<void>
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,
  loading: false,

  fetchDocuments: async () => {
    set({ loading: true })

    try {
      const res = await axios.get("http://localhost:8000/history", {
        withCredentials: true
      })

      set({ documents: res.data })
    } catch (err) {
      console.error("Failed to fetch documents", err)
    }

    set({ loading: false })
  },

  refreshDocuments: async () => {
    const res = await axios.get("http://localhost:8000/history", {
      withCredentials: true
    })
    set({ documents: res.data })
  },

  selectDocument: (doc) => set({ selectedDocument: doc })
}))
