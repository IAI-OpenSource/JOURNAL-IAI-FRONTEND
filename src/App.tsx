
import {  Routes, Route } from "react-router-dom";
import Layout from "./components/squelette/layout";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage";
import { EventsPage } from "./pages/EventsPage";

export default function App() {
  return (
    
      <Routes>
        <Route element={<Layout />}>
          {/* La page qu'on veut tester */}
          <Route path="/rechercher" element={<SearchPage />} />
          <Route path="/userPage" element={<UserPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Route>
      </Routes>
    );
}