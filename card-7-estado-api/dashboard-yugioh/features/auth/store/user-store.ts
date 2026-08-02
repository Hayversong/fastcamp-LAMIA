"use client";

import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  login: () => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const mockUser: User = {
  name: "Haytham",
  email: "haytham@example.com",
};

export const useUserStore = create<UserStore>((set) => ({
  user: mockUser,
  login: () => set({ user: mockUser }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
