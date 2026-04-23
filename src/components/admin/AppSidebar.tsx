import { Users, UserPen, ClipboardList, LogOut } from "lucide-react";
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
import { useLogout } from "@/utils/useLogout";

const items = [
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
    {
        title: "Проекты",
        url: "projects",
        icon: ClipboardList,
    },
];

export const AppSidebar = () => {
    const [menuVal, setMenuVal] = useState(items[0].title);
    const { logout } = useLogout();

    return (
        <Sidebar className="p-4 bg-background border-r">
            <SidebarHeader>
                <h1 className="text-foreground text-2xl font-bold mb-4">
                    Админ-панель
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="gap-2 flex-1">
                    <div className="flex-1">
                        {items.map((item) => (
                            <SidebarMenuItem
                                onClick={() => setMenuVal(item.title)}
                                key={item.title}
                            >
                                <SidebarMenuButton
                                    isActive={item.title === menuVal}
                                    size="lg"
                                    asChild
                                >
                                    <Link to={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                    <SidebarMenuButton
                        onClick={logout}
                        size="lg"
                        className="cursor-pointer"
                    >
                        <LogOut />
                        <span>Выйти</span>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar >
    );
};
