

import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import OnePost from "./components/OnePost";
import UserPage from "./pages/userPage";

export default function App() {
  return (
     <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      {/* < LandingPage/> */}
       {/* < AdminPage/> */}
       <UserPage/>
       {/* <OnePost/> */}
    </div>
  );
}