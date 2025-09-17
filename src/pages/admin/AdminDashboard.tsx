import { AppSidebar } from "@/components/admin/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex size-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <SidebarTrigger />
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                User Management
              </h2>
              <p className="mt-2 text-gray-500">
                Create and manage user accounts and groups.
              </p>
            </header>
            <div className="border-b border-gray-200">
              <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                <a
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-[var(--primary-color)] text-[var(--primary-color)]"
                  href="#"
                >
                  {" "}
                  Create Student{" "}
                </a>
                <a
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  href="#"
                >
                  {" "}
                  Create Teacher{" "}
                </a>
                <a
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  href="#"
                >
                  {" "}
                  Create Admin{" "}
                </a>
                <a
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  href="#"
                >
                  {" "}
                  Manage Groups{" "}
                </a>
              </nav>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                      id="name"
                      name="name"
                      placeholder="Enter student's full name"
                      type="text"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                      id="password"
                      name="password"
                      placeholder="Create a strong password"
                      type="password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Initial Group
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                    id="group"
                    name="group"
                  >
                    <option>Select a group</option>
                    <option>Group A</option>
                    <option>Group B</option>
                    <option>Group C</option>
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
                    type="submit"
                  >
                    Create Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
