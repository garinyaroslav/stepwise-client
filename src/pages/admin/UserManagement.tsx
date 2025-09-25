import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersAddForm } from "@/components/admin/UsersAddForm";
import { TeacherAddForm } from "@/components/admin/TeacherAddForm";
import { AdminAddForm } from "@/components/admin/AdminAddForm";

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
          <TabsList className="py-5.5 gap-2 mb-4">
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
            <UsersAddForm />
          </TabsContent>
          <TabsContent value="create-teacher">
            <TeacherAddForm />
          </TabsContent>
          <TabsContent value="create-admin">
            <AdminAddForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
