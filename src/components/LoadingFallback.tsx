import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export const LoadingFallback = () => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setShow(true), 100);

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressTimer);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        return () => {
            clearTimeout(showTimer);
            clearInterval(progressTimer);
        };
    }, []);

    if (!show) return null;

    return (
        <div className="size-full flex items-center justify-center bg-background">
            <div className="w-140 max-w-[80vw] space-y-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Загрузка</h2>
                    <p className="text-lg text-muted-foreground">
                        Пожалуйста, подождите...
                    </p>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="text-lg text-muted-foreground text-center">
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
};
