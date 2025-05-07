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
import { Menu, X } from "lucide-react"; // Importing icons for mobile toggle

type Department = {
  id: number;
  name: string;
  url: string;
  icon: React.ReactElement;
};

function SidebarComponent({ Departments }: { Departments: Department[] }) {
  const [currentTab, setCurrentTab] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile drawer visibility

  const { pathname } = useLocation();
  useEffect(() => {
    setCurrentTab(pathname);
  }, [pathname]);

  const urls: { [key: string]: string } = {
    "/": "Dashboard",
    "/outpatient-department": "Out-patient Department",
    "/inpatient-department": "In-patient Department",
    "/icu": "Intensive Care Unit",
    "/surgeries": "Surgeries List",
    "/clinic": "Clinic",
    "/mobile-clinic": "Mobile Clinic",
    "/disease-prediction": "Disease Prediction",
    "/pharmacy-unit": "Pharmacy Unit",
    "/inpatient-department/admission-sheet": "In-patient Department",
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex">
      {/* Mobile Drawer Button */}
      <button
        className="lg:hidden p-4 text-blue-600"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Content */}
      <Sidebar className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block`}>
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
                      <Link to={department.url}>
                        {department.icon}
                        <span className="text-lg text-blue-600">
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
  );
}

export default SidebarComponent;
