"use client";

import { createContext, useContext } from "react";
import { toast } from "react-hot-toast";

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(message),
  };
}
