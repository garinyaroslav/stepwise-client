import { StrictMode, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { LoadingFallback } from "./components/LoadingFallback";
const Login = lazy(() => import("./pages/Login"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
);
