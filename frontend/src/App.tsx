import { HashRouter } from "react-router-dom";

import "./App.css";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
