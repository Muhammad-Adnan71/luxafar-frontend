"use client";

import { BespokeResponse } from "lib/types";
import { create } from "zustand";

type Store = {
  bespokeResponse: BespokeResponse;
  setBespokeResponse: (form: BespokeResponse) => void;
};

const useBespokeStore = create<Store>((set) => ({
  bespokeResponse: {
    name: "",
    email: "",
    phoneNumber: "",
    tripDays: "",
    selectedCode: "",
    selectedDestination: "",
  },
  setBespokeResponse: (form) =>
    set((state) => ({ ...state, bespokeResponse: form })),
}));

export default useBespokeStore;
