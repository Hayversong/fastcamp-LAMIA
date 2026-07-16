"use client";

import { create } from "zustand";

interface AuthStore {
  hydrated: boolean;
  userEmail: string | null;
  hydrateSession: () => void;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  hydrated: false,
  userEmail: null,

  hydrateSession() {
    set({
      userEmail: window.localStorage.getItem("lamia-user"),
      hydrated: true,
    });
  },

  signIn(email) {
    window.localStorage.setItem("lamia-user", email);
    set({ userEmail: email });
  },

  signOut() {
    window.localStorage.removeItem("lamia-user");
    set({ userEmail: null });
  },
}));
