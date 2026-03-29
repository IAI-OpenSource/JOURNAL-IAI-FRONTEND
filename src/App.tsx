import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/squelette/layout";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* La page qu'on veut tester */}
          <Route path="/rechercher" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}