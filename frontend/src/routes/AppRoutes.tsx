import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPlaceholder from "../components/LoginPlaceholder/LoginPlaceholder";
import TailorResumesPage from "../components/TailorResumesPage/TailorResumesPage";
import Layout from "../components/Layout/Layout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPlaceholder />} />

      {/* All routes below require user to be authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<TailorResumesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
