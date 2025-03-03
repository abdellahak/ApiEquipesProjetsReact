import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Header from "./Header";
export default function Dashboard() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100">
        <Outlet />
      </div>
    </>
  );
}
