// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-400">
      <Outlet />
    </main>
  );
}
