import { create } from "zustand";

interface Model {
  name: string;
  supports_vision: boolean;
  local: boolean;
}

interface ModelState {
  models: Model[];
  selectedModel: string | null;
  setModels: (models: Model[]) => void;
  setSelectedModel: (name: string) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  selectedModel: null,
  setModels: (models) => set({ models }),
  setSelectedModel: (name) => set({ selectedModel: name }),
}));
