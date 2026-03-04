import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ObserveWidget } from "./components/ObserveWidget";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
          <ObserveWidget userId="demo-user-id" />
        </div>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
