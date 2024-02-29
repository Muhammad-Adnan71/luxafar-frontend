"use client";

import { AuthUser } from "lib/types";
import { create } from "zustand";

type Store = {
  authUser: AuthUser | null;
  requestLoading: boolean;
  setAuthUser: (user: AuthUser | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
  reset: () => void;
};

const useAuthStore = create<Store>((set) => ({
  authUser: null,
  requestLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
  reset: () => set({ authUser: null, requestLoading: false }),
}));

export default useAuthStore;
