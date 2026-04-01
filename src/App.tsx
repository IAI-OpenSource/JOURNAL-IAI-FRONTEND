import { Routes, Route } from "react-router-dom";
import Layout from "./components/squelette/layout";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage";
import { EventsPage } from "./pages/EventsPage";
import ClubPage from "./pages/ClubPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/rechercher" element={<SearchPage />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/clubs" element={<ClubPage />} />
      </Route>
    </Routes>
  );
}