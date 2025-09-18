import { LayoutDashboard, Users, UserPen } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link } from "react-router";
import { useState } from "react";

const items = [
  {
    title: "Паналь управления",
    url: "main",
    icon: LayoutDashboard,
  },
  {
    title: "Пользователи",
    url: "users",
    icon: UserPen,
  },
  {
    title: "Группы",
    url: "groups",
    icon: Users,
  },
];
export const AppSidebar = () => {
  const [menuVal, setMenuVal] = useState(items[0].title);

  return (
    <Sidebar className="p-4 bg-background">
      <SidebarHeader>
        <h1 className="text-foreground text-2xl font-bold mb-4">
          Админ-панель
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem
              onClick={() => setMenuVal(item.title)}
              key={item.title}
            >
              <SidebarMenuButton
                isActive={item.title === menuVal}
                variant="default"
                size="lg"
                asChild
              >
                <Link to={item.url}>
                  <item.icon size={34} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
