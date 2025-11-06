import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SchedulerPage from "./pages/SchedulerPage";
import SubscribePage from "./pages/SubscribePage";
import WishlistPage from "./pages/WishlistPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
