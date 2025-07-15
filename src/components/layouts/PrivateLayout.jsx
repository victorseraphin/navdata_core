// src/layouts/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function PrivateLayout() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
