import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/squelette/layout";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import UserPage from "./pages/UserPage";
import { EventsPage } from "./pages/EventsPage";
import ClubPage from "./pages/ClubPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";

import AdminPage from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import SidebarAdmin from "./pages/Admin/SidebarAdmin"

export default function App() {
  return (
    <Routes>
      {/* Route pour l'authentification (sans la sidebar) */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sidebarAdmin" element={<SidebarAdmin />} />

      {/* Routes principales (avec la sidebar via Layout) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/accueil" replace />} />
        <Route path="accueil" element={<LandingPage />} />
        <Route path="rechercher" element={<SearchPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="profil" element={<UserPage />} />
        <Route path="evenements" element={<EventsPage />} />
        <Route path="clubs" element={<ClubPage />} />
        <Route path="creer-publication" element={<CreatePublicationPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>

      {/* Redirection par défaut pour les routes inconnues */}
      <Route path="*" element={<Navigate to="/accueil" replace />} />
    </Routes>
  );
}