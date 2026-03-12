import { create } from "zustand";
import type { User } from "../types/user";
import api from "../api/axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecked: false,

 login: async (email, password) => {
   set({ loading: true });
   try {
     const formData = new URLSearchParams();
     formData.append("username", email);
     formData.append("password", password);

     await api.post("/login", formData, {
       headers: {
         "Content-Type": "application/x-www-form-urlencoded",
       },
     });

     await useAuthStore.getState().checkAuth();
   } finally {
     set({ loading: false });
   }
},
  logout: async () => {
    await api.post("/logout");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/me");
      set({
        user: res.data,
        isAuthenticated: true,
        authChecked: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        authChecked: true,
        loading: false,
      });
    }
  },
}));
