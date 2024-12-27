import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useEffect, useState } from "react";
import { url } from "inspector";
type Department = {
  id: number;
  name: string;
  url: string;
  icon: React.ReactElement;
};
function SidebarComponent({ Departments }: { Departments: Department[] }) {
  const [currentTab, setCurrentTab] = useState("/");

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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md xl:text-xl font-bold text-center">
            Departments
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {Departments.map((department) => (
                <SidebarMenuItem key={department.id} className="mb-2 ">
                  <SidebarMenuButton
                    asChild
                    className={
                      department.name === urls[currentTab] ? "bg-blue-100" : ""
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
  );
}

export default SidebarComponent;
