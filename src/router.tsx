import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import ReportFraud from "@/pages/ReportFraud";
import FraudReportsPage from "@/pages/FraudReportsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/reportar-estafa",
    element: <ReportFraud />,
  },
  {
    path: "/reportes",
    element: <FraudReportsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
