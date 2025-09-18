import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabItems = [
  {
    label: "Создать студента",
    value: "create-student",
  },
  {
    label: "Создать учителя",
    value: "create-teacher",
  },
  {
    label: "Создать администратора",
    value: "create-admin",
  },
];

export const UserManagement = () => {
  const [tabVal, setTabVal] = useState(tabItems[0].value);

  return (
    <>
      <SidebarTrigger />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Управление пользователями
          </h2>
          <p className="mt-2 opacity-70">
            Создавайте учетные записи пользователей и группы и управляйте ими.
          </p>
        </header>
        <Tabs defaultValue={tabVal}>
          <TabsList className="py-5.5 gap-2 mb-8">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                className="py-4"
                value={tab.value}
                onClick={() => setTabVal(tab.value)}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="create-student">
            <div className="bg-white p-8 rounded-lg shadow-sm">
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
          </TabsContent>
          <TabsContent value="create-teacher">
            Change your password here.
          </TabsContent>
          <TabsContent value="create-admin">
            Make changes to your account here.
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
