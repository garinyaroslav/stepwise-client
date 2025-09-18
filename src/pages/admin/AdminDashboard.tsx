import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex size-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
