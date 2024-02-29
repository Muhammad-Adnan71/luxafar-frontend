"use client";
import { create } from "zustand";

type Store = {
  isLoading: boolean;
  handleLoading: () => void;
};

const usePreloader = create<Store>((set) => ({
  isLoading: true,
  handleLoading: () => set(() => ({ isLoading: false })),
}));
export default usePreloader;
