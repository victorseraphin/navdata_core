// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </main>
  );
}
