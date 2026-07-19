"use client";

import { create } from "zustand";
import { MOCK_CREDENTIALS } from "@/features/auth/constants";
import type { SignInInput } from "@/features/auth/schemas";

interface AuthStore {
  hydrated: boolean;
  userEmail: string | null;
  hydrateSession: () => void;
  signIn: (credentials: SignInInput) => boolean;
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

  signIn(credentials) {
    const isValid =
      credentials.email === MOCK_CREDENTIALS.email &&
      credentials.password === MOCK_CREDENTIALS.password;

    if (!isValid) return false;

    window.localStorage.setItem("lamia-user", credentials.email);
    set({ userEmail: credentials.email });
    return true;
  },

  signOut() {
    window.localStorage.removeItem("lamia-user");
    set({ userEmail: null });
  },
}));
