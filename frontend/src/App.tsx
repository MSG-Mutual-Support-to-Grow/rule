import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import DocsPage from "./pages/DocsPage";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <div className="relative h-screen w-screen overflow-hidden text-white">
        {/* Full-Page Gradient Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />

        {/* Main Routes */}
        <div className="relative h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            {/* Future routes can be added here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
