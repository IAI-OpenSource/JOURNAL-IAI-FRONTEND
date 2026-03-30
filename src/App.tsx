
import {  Routes, Route } from "react-router-dom";
import Layout from "./components/squelette/layout";
import SearchPage from "./pages/SearchPage";
//import UserPage from "./pages/userPage";
import NotificationPage from "./pages/NotificationPage";

export default function App() {
  return (
    
      <Routes>
        <Route element={<Layout />}>
          {/* La page qu'on veut tester */}
          <Route path="/rechercher" element={<SearchPage />} />
          {/*<Route path="/userPage" element={<UserPage />} />*/}
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Routes>
    );
}