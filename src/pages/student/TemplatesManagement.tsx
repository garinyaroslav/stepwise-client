import { useState } from 'react';
import { Search, Plus, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
// import { TemplateDetailView } from './TemplateDetailView';
// import { TemplateModal } from '@/components/teacher/TemplateModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkTemplate } from '@/types/WorkTemplate';
import { useTemplates } from '@/hooks/useTemplates';

export function TemplatesManagement() {
    const { templates, totalPages } = useTemplates(0, '');
    // const [templates, setTemplates] = useState<WorkTemplate[]>(mockTemplates);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<WorkTemplate | null>(null);
    const [viewingTemplate, setViewingTemplate] = useState<WorkTemplate | null>(null);

    const handleDelete = (id: string) => {
        console.log("delete", id);
    };

    // if (viewingTemplate) {
    //     return (
    //         <TemplateDetailView
    //             template={viewingTemplate}
    //             onBack={() => setViewingTemplate(null)}
    //             onEdit={() => {
    //                 setSelectedTemplate(viewingTemplate);
    //                 setShowModal(true);
    //             }}
    //         />
    //     );
    // }

    const renderTemplates = (templates: WorkTemplate[]) => {
        if (templates.length === 0)
            return (
                <div className="p-12 text-center text-muted-foreground">
                    {searchQuery ? 'Шаблоны не найдены' : 'Пока нет шаблонов. Создайте первый!'}
                </div>
            )

        return (
            <div className="divide-y divide-border">
                {templates.map((template) => (
                    <div key={template.id} className="p-6 hover:bg-muted transition-colors">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold">{template.title}</h3>
                                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                                        {template.type}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-3">{template.description}</p>
                                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                    <span>Разделов: {template.chapters.length}</span>
                                    <span>Создан: {new Date(template.createdAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                            </div>
                            {/* <div className="h-max flex items-center justify-center gap-1"> */}
                            {/* <Button */}
                            {/*     variant="ghost" */}
                            {/*     size="icon" */}
                            {/*     onClick={() => setViewingTemplate(template)} */}
                            {/*     title="Просмотр" */}
                            {/* > */}
                            {/*     <Eye className="w-5 h-5" /> */}
                            {/* </Button> */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(template.id)}
                                title="Удалить"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                            {/* </div> */}
                        </div>
                    </div>
                ))
                }
            </div >
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Управление шаблонами работ</h1>
                <p className="text-muted-foreground text-sm">
                    Создавайте и управляйте шаблонами для различных типов академических работ
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Поиск по шаблонам..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10"
                    />
                </div>
                <Button onClick={() => { setSelectedTemplate(null); setShowModal(true); }}>
                    <Plus className="w-5 h-5" />
                    Создать шаблон
                </Button>
            </div>

            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
                {renderTemplates(templates)}
            </div>

            {/* Pagination */}
            {/* {totalPages > 1 && ( */}
            {/*     <div className="mt-6 flex items-center justify-between"> */}
            {/*         <p className="text-sm text-muted-foreground"> */}
            {/*             Показано {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredTemplates.length)} из{' '} */}
            {/*             {filteredTemplates.length} */}
            {/*         </p> */}
            {/*         <div className="flex items-center gap-2"> */}
            {/*             <Button */}
            {/*                 variant="outline" */}
            {/*                 size="icon" */}
            {/*                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} */}
            {/*                 disabled={currentPage === 1} */}
            {/*             > */}
            {/*                 <ChevronLeft className="w-5 h-5" /> */}
            {/*             </Button> */}
            {/*             <div className="flex items-center gap-1"> */}
            {/*                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => ( */}
            {/*                     <Button */}
            {/*                         key={page} */}
            {/*                         variant={currentPage === page ? 'default' : 'ghost'} */}
            {/*                         size="sm" */}
            {/*                         onClick={() => setCurrentPage(page)} */}
            {/*                     > */}
            {/*                         {page} */}
            {/*                     </Button> */}
            {/*                 ))} */}
            {/*             </div> */}
            {/*             <Button */}
            {/*                 variant="outline" */}
            {/*                 size="icon" */}
            {/*                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} */}
            {/*                 disabled={currentPage === totalPages} */}
            {/*             > */}
            {/*                 <ChevronRight className="w-5 h-5" /> */}
            {/*             </Button> */}
            {/*         </div> */}
            {/*     </div> */}
            {/* )} */}

            {/* {showModal && ( */}
            {/*     <TemplateModal */}
            {/*         template={selectedTemplate} */}
            {/*         onClose={() => { */}
            {/*             setShowModal(false); */}
            {/*             setSelectedTemplate(null); */}
            {/*         }} */}
            {/*         onSave={handleSaveTemplate} */}
            {/*     /> */}
            {/* )} */}
        </div>
    );
}
