import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { AvatarProfileLink } from "./Avatar";

interface TopbarProps {
    items: { name: string, onClick: () => void }[]
}

export const Topbar: FC<TopbarProps> = ({ items }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/primary-logo.svg" alt="Logo" className="w-10" />
                        <span className="text-lg font-semibold">Этапник</span>
                    </div>

                    <nav className="flex items-center gap-8">
                        {items.map((item, index) =>
                            <button
                                key={item.name}
                                onClick={() => {
                                    item.onClick();
                                    setSelected(index);
                                }}
                                className={`text-sm font-medium transition-colors cursor-pointer ${selected === index
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {item.name}
                            </button>
                        )}
                    </nav>

                    <AvatarProfileLink onClick={() => navigate("profile")} />
                </div>
            </div>
        </header>
    )
}
