"use client";
import { UserContextProvider } from "@/context/userContext";
import { Toaster } from "react-hot-toast";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContextProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "0.9rem",
          },
          success: {
            style: {
              border: "2px solid #22c55e",
            },
          },
          error: {
            style: {
              border: "2px solid #ef4444",
            },
          },
        }}
      />
    </UserContextProvider>
  );
};
