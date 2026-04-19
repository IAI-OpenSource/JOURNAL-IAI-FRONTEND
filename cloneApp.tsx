import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/squelette/layout";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import UserPage from "./pages/UserPage";
import { EventsPage } from "./pages/EventsPage";
//import ClubPage from "./pages/ClubPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";
import AdminPage from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";

import { ClasseListe } from "./pages/Admin/ClasseListe";
import { AcademicYearsList } from "./pages/Admin/AcademicYearsList";
import { ClasseDetail } from "./pages/Admin/ClasseDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";

//la si tu n'est pas connect" tu ne peut pas avoir acces au pages 
const RequireAuth = () => {
  const isAuth = localStorage.getItem("isAuthenticated");
  return isAuth === "true" ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Route pour l'authentification (sans la sidebar) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Routes principales (protégées) */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/accueil" replace />} />
          <Route path="accueil" element={<LandingPage />} />
          <Route path="rechercher" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profil" element={<UserPage />} />
          <Route path="evenements" element={<EventsPage />} />
          {/* <Route path="clubs" element={<ClubPage />} /> */}
          <Route path="creer-publication" element={<CreatePublicationPage />} />

          {/* Zone Admin */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="annees-academiques" element={<AcademicYearsList />} />
          <Route path="classeListe" element={<ClasseListe />} />
          <Route path="admin/classes/:id" element={<ClasseDetail />} />
        </Route>
      </Route>

      {/* Redirection par défaut pour les routes inconnues (s'il n'est pas connecté ira dans auth sinon redirigé par les autres routes) */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}



