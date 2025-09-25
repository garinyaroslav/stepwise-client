import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export const GroupsManagement = () => {
	return (
		<>
			<SidebarTrigger />
			<div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden p-4">
				<main className="flex-1 p-4">
					<div className="max-w-7xl mx-auto">
						<header className="mb-8">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-3xl font-bold text-foreground">
										Управление группами
									</h2>
									<p className="mt-2 text-muted-foreground">
										Настройте группы и назначьте студентов
									</p>
								</div>
								<Button size="lg">Добавить группу</Button>
							</div>
						</header>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-1">
								<div className="bg-background rounded-lg border-2">
									<div className="p-6 border-b">
										<h3 className="text-lg font-medium leading-6 text-foreground">
											Существующие группы
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											Выберите группу для настройки.
										</p>
									</div>

									<ul className="divide-y divide-gray-200">
										<li className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
											<div>
												<p className="font-medium text-gray-900">Group Alpha</p>
												<p className="text-sm text-gray-500">3 Students</p>
											</div>
											<ChevronRight />
											{/* <span className="material-symbols-outlined text-gray-400"> */}
											{/* 	chevron_right */}
											{/* </span> */}
										</li>
										<li className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center bg-indigo-50 border-l-4 border-[var(--primary-color)]">
											<div>
												<p className="font-medium text-[var(--primary-color)]">
													Group Beta
												</p>
												<p className="text-sm text-gray-500">2 Students</p>
											</div>
											<span className="material-symbols-outlined text-gray-400">
												chevron_right
											</span>
										</li>
										<li className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
											<div>
												<p className="font-medium text-gray-900">Group Gamma</p>
												<p className="text-sm text-gray-500">1 Student</p>
											</div>
											<span className="material-symbols-outlined text-gray-400">
												chevron_right
											</span>
										</li>
									</ul>
								</div>
							</div>
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
														<p className="font-medium text-gray-900">
															Jane Smith
														</p>
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
														<p className="font-medium text-gray-900">
															Another Student
														</p>
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
														<p className="font-medium text-gray-900">
															John Doe
														</p>
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
														<p className="font-medium text-gray-900">
															Peter Jones
														</p>
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
														<p className="font-medium text-gray-900">
															Maria Garcia
														</p>
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
						</div>
					</div>
				</main>
			</div>
		</>
	);
};
