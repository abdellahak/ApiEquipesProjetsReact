import { Outlet } from "react-router-dom";
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
