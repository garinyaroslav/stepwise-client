import { LayoutDashboard, Users, UserPen } from "lucide-react";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarFooter,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";

const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "#",
        icon: UserPen,
    },
    {
        title: "Groups",
        url: "#",
        icon: Users,
    },
];
export const AppSidebar = () => {
    return (
        <Sidebar className="p-4">
            <SidebarHeader>
                <h1 className="text-foreground text-xl font-bold">Админ-панель</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>{" "}
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
    // return (
    //     <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden sm:flex">
    //         <div className="p-6">
    //             <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
    //         </div>
    //         <nav className="flex-1 px-4 space-y-2">
    //             <a
    //                 className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
    //                 href="#"
    //             >
    //                 <span className="material-symbols-outlined">dashboard</span>
    //                 <span>Dashboard</span>
    //             </a>
    //             <a
    //                 className="flex items-center gap-3 px-4 py-2 text-white bg-[var(--primary-color)] rounded-md"
    //                 href="#"
    //             >
    //                 <span className="material-symbols-outlined">group</span>
    //                 <span>Users</span>
    //             </a>
    //             <a
    //                 className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
    //                 href="#"
    //             >
    //                 <span className="material-symbols-outlined">groups</span>
    //                 <span>Groups</span>
    //             </a>
    //             <a
    //                 className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
    //                 href="#"
    //             >
    //                 <span className="material-symbols-outlined">settings</span>
    //                 <span>Settings</span>
    //             </a>
    //         </nav>
    //     </aside>
    // );
};
