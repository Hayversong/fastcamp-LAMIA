"use client";

import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    name: "Haytham",
    email: "haytham@example.com",
  },
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
