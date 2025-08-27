import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPlaceholder from "../components/LoginPlaceholder/LoginPlaceholder";
import TailorResumesPage from "../components/TailorResumesPage/TailorResumesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPlaceholder />} />

      {/* All routes below require user to be authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<TailorResumesPage />} />
      </Route>
    </Routes>
  );
}
