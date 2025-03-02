import { Link } from "react-router-dom";
import { FolderKanban, Home, Users, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Projets", href: "/dashboard/projets", icon: FolderKanban },
    { name: "personnes", href: "/dashboard/personnes", icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <FolderKanban className="h-8 w-8 text-brand-600" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      pathname === item.href
                        ? "border-brand-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
                onClick={()=>{
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
