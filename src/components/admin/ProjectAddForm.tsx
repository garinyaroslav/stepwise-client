import { Save } from "lucide-react";
import { Button } from "../ui/button";

export const ProjectAddForm = () => {
  return (
    <div className="flex min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Cоздание новой пояснительной записки
          </h1>
          <p className="text-muted-foreground mt-1">
            Заполните поля, чтобы создать новое задание для пояснительной
            записки.
          </p>
        </div>
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background p-6 rounded-xl border-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Подробности проекта
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Title
                  </label>
                  <input
                    className="form-input mt-1"
                    id="assignment-title"
                    placeholder="e.g., Master's Thesis Explanatory Note"
                    type="text"
                    value="Bachelor's Thesis Explanatory Note 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    className="form-input mt-1 min-h-[120px]"
                    id="assignment-description"
                    placeholder="Provide a brief description of the assignment."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Required Sections
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Define the individual parts of the explanatory note. Drag to
                reorder.
              </p>
              <div className="space-y-3" id="sections-container">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined cursor-grab text-slate-400">
                    drag_indicator
                  </span>
                  <input
                    className="form-input"
                    type="text"
                    value="1. Title Page"
                  />
                  <button
                    className="text-slate-400 hover:text-red-500"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined cursor-grab text-slate-400">
                    drag_indicator
                  </span>
                  <input
                    className="form-input"
                    type="text"
                    value="2. Abstract"
                  />
                  <button
                    className="text-slate-400 hover:text-red-500"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined cursor-grab text-slate-400">
                    drag_indicator
                  </span>
                  <input
                    className="form-input"
                    type="text"
                    value="3. Introduction"
                  />
                  <button
                    className="text-slate-400 hover:text-red-500"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined cursor-grab text-slate-400">
                    drag_indicator
                  </span>
                  <input
                    className="form-input"
                    type="text"
                    value="4. Relevance and Novelty"
                  />
                  <button
                    className="text-slate-400 hover:text-red-500"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <button className="mt-4 btn-secondary text-sm" type="button">
                <span className="material-symbols-outlined text-lg mr-1 -ml-1">
                  add
                </span>
                Add Section
              </button>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reviewer
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Assign Teacher
                </label>
                <select className="form-input mt-1" id="select-teacher">
                  <option>Select a reviewer</option>
                  <option>Dr. Katherine Johnson</option>
                  <option>Dr. Richard Feynman</option>
                  <option>Dr. Marie Curie</option>
                  <option>Dr. Albert Einstein</option>
                </select>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Assign to Groups
              </h2>
              <div className="space-y-3">
                <p className="text-sm text-slate-500 -mt-2">
                  Select one or more student groups for this assignment.
                </p>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    id="group-cs-2024"
                    type="checkbox"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    Computer Science - 2024
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    id="group-bio-2024"
                    type="checkbox"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    Biology - 2024
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    id="group-me-2024"
                    type="checkbox"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    Mechanical Engineering - 2024
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    id="group-psy-2024"
                    type="checkbox"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    Psychology - 2024
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-4 lg:sticky lg:top-8">
              <Button size="lg" className="w-full" type="submit">
                <Save />
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
