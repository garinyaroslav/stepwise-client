import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const GroupSetting = () => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-background rounded-lg border-2">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Настроить группу: Бета
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Добавляйте и удаляйте студентов из этой группы.
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-md font-medium text-foreground mb-2">
              Students in this group (2)
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-sm text-gray-500">S67890</p>
                </div>
                <button className="text-red-600 hover:text-red-800">
                  <span className="material-symbols-outlined">
                    remove_circle_outline
                  </span>
                </button>
              </li>
              <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Another Student</p>
                  <p className="text-sm text-gray-500">S54321</p>
                </div>
                <button className="text-red-600 hover:text-red-800">
                  <span className="material-symbols-outlined">
                    remove_circle_outline
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-foreground mb-2">
              Доступные студенты
            </h4>
            <div className="mb-4">
              <Input placeholder="Поиск студентов..." />
            </div>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">S12345</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Peter Jones</p>
                  <p className="text-sm text-gray-500">S24680</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Maria Garcia</p>
                  <p className="text-sm text-gray-500">S13579</p>
                </div>
                <button className="text-green-600 hover:text-green-800">
                  <span className="material-symbols-outlined">
                    add_circle_outline
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Сохранить изменения</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
