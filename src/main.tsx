import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WishlistProvider } from "./contexts/WishlistContext.tsx"; // WishlistProvider 불러오기

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2. <App /> 컴포넌트를 <WishlistProvider>로 감싸주기 */}
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </React.StrictMode>
);
