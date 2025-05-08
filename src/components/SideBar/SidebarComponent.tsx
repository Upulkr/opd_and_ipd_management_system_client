import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Menu, X } from "lucide-react";

type Department = {
  id: number;
  name: string;
  url: string;
  icon: React.ReactElement;
};

function SidebarComponent({ Departments }: { Departments: Department[] }) {
  const [currentTab, setCurrentTab] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();
  useEffect(() => {
    setCurrentTab(pathname);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const toggleButton = document.getElementById("mobile-toggle");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const urls: { [key: string]: string } = {
    "/": "Dashboard",
    "/outpatient-department": "Out-patient Department",
    "/inpatient-department": "In-patient Department",
    "/surgeries": "Surgeries List",
    "/clinic": "Clinic",
    "/mobile-clinic": "Mobile Clinic",
    "/disease-prediction": "Disease Prediction",
    "/inpatient-department/admission-sheet": "In-patient Department",
    "/employee": "Current Employees",
    "/pharmacy": "Pharamacy Unit",
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          id="mobile-toggle"
          className="p-2 rounded-md shadow-lg text-blue-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          {!isMobileMenuOpen && <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="mt-20">
                <SidebarMenu>
                  {Departments.map((department) => (
                    <SidebarMenuItem key={department.id} className="mb-2">
                      <SidebarMenuButton
                        asChild
                        className={
                          department.name === urls[currentTab]
                            ? "bg-blue-100"
                            : ""
                        }
                      >
                        <Link
                          to={department.url}
                          className="flex items-center gap-3 p-2"
                        >
                          <span className="text-blue-600">
                            {department.icon}
                          </span>
                          <span className="text-lg  font-medium">
                            {department.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-sidebar"
          className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl overflow-y-auto"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-blue-600">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="py-4">
            {Departments.map((department) => (
              <Link
                key={department.id}
                to={department.url}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 ${
                  department.name === urls[currentTab] ? "bg-blue-100" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-blue-600">{department.icon}</span>
                <span className="text-lg font-medium">{department.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarComponent;
