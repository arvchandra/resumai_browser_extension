import { HashRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import "./App.css";
import "./assets/styles/shared.css";

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
