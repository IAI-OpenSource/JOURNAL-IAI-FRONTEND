

/*import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <LandingPage />
    </div>
  );
}*/

/*import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/squelette/layout";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rechercher" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}*/

// =====================================================
// App.tsx — Point d'entrée pour tester le rendu
// Layout = Sidebar + SearchPage, c'est tout simple
// Pour revenir à la vraie app après : remet le vrai App.tsx
// =====================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/squelette/layout";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Toutes les routes passent par le Layout (sidebar incluse) */}
        <Route element={<Layout />}>

          {/* La page qu'on veut tester */}
          <Route path="/rechercher" element={<SearchPage />} />

          {/* Redirect vers /rechercher par défaut */}
          <Route path="*" element={<Navigate to="/rechercher" replace />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}