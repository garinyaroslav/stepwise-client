import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 480;
const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
const COLLAPSED_HEIGHT = 52;
const STORAGE_KEY = 'summary-panel-state';

interface PanelState {
    x: number;
    y: number;
    w: number;
    h: number;
    collapsed: boolean;
    isOpen: boolean;
    lastSummary: string;
}

function getDefaultPos(w: number, h: number) {
    return {
        x: window.innerWidth - w - 24,
        y: window.innerHeight - h - 24,
    };
}

function clampPos(x: number, y: number, w: number) {
    return {
        x: Math.max(0, Math.min(window.innerWidth - w, x)),
        y: Math.max(0, Math.min(window.innerHeight - COLLAPSED_HEIGHT, y)),
    };
}

function usePersistentPanel() {
    const [state, setState] = useState<PanelState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed: PanelState = JSON.parse(saved);
                const clamped = clampPos(parsed.x, parsed.y, parsed.w);
                return { ...parsed, ...clamped };
            }
        } catch { }
        return {
            ...getDefaultPos(DEFAULT_WIDTH, DEFAULT_HEIGHT),
            w: DEFAULT_WIDTH,
            h: DEFAULT_HEIGHT,
            collapsed: false,
            isOpen: false,
            lastSummary: '',
        };
    });

    const update = useCallback((patch: Partial<PanelState>) =>
        setState(prev => {
            const next = { ...prev, ...patch };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
            return next;
        }), []);

    const setPos = useCallback((x: number, y: number) =>
        setState(prev => {
            const next = { ...prev, ...clampPos(x, y, prev.w) };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
            return next;
        }), []);

    const setSize = useCallback((w: number, h: number) =>
        setState(prev => {
            const next = { ...prev, w: Math.max(MIN_WIDTH, w), h: Math.max(MIN_HEIGHT, h) };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
            return next;
        }), []);

    return { state, update, setPos, setSize };
}

function useTypewriter(text: string, animate: boolean, speed = 4) {
    const [displayed, setDisplayed] = useState(() => animate ? '' : text);
    const [done, setDone] = useState(() => !animate);

    useEffect(() => {
        if (!text) { setDisplayed(''); setDone(false); return; }

        if (!animate) {
            setDisplayed(text);
            setDone(true);
            return;
        }

        setDisplayed('');
        setDone(false);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) { clearInterval(interval); setDone(true); }
        }, speed);
        return () => clearInterval(interval);
    }, [text, animate, speed]);

    return { displayed, done };
}

interface SummaryPanelProps {
    summary: string;
    isLoading: boolean;
    shouldOpen: boolean;
    onClose: () => void;
}

export function SummaryPanel({ summary, isLoading, shouldOpen, onClose }: SummaryPanelProps) {
    const { state, update, setPos, setSize } = usePersistentPanel();
    const isNewSummaryRef = useRef(false);

    useEffect(() => {
        if (shouldOpen) update({ isOpen: true, collapsed: false });
    }, [shouldOpen]);

    useEffect(() => {
        if (summary) {
            isNewSummaryRef.current = true;
            update({ lastSummary: summary });
        }
    }, [summary]);

    const effectiveSummary = summary || state.lastSummary;
    const shouldAnimate = isNewSummaryRef.current && !!summary;
    const { displayed, done } = useTypewriter(effectiveSummary, shouldAnimate, 4);

    useEffect(() => {
        if (done && isNewSummaryRef.current) {
            isNewSummaryRef.current = false;
        }
    }, [done]);

    const [mounted, setMounted] = useState(false);
    const [animatingOut, setAnimatingOut] = useState(false);

    useEffect(() => {
        if (state.isOpen) {
            setAnimatingOut(false);
            const t = setTimeout(() => setMounted(true), 10);
            return () => clearTimeout(t);
        } else {
            setMounted(false);
        }
    }, [state.isOpen]);

    const handleClose = useCallback(() => {
        setAnimatingOut(true);
        setMounted(false);
        setTimeout(() => {
            setAnimatingOut(false);
            update({ isOpen: false });
            onClose();
        }, 280);
    }, [onClose, update]);

    const dragState = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
    const onDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        dragState.current = { startX: e.clientX, startY: e.clientY, startPosX: state.x, startPosY: state.y };
        const onMove = (me: MouseEvent) => {
            if (!dragState.current) return;
            setPos(
                dragState.current.startPosX + me.clientX - dragState.current.startX,
                dragState.current.startPosY + me.clientY - dragState.current.startY,
            );
        };
        const onUp = () => {
            dragState.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [state.x, state.y, setPos]);

    const resizeState = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
    const onResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        resizeState.current = { startX: e.clientX, startY: e.clientY, startW: state.w, startH: state.h };
        const onMove = (me: MouseEvent) => {
            if (!resizeState.current) return;
            setSize(
                resizeState.current.startW + me.clientX - resizeState.current.startX,
                resizeState.current.startH + me.clientY - resizeState.current.startY,
            );
        };
        const onUp = () => {
            resizeState.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [state.w, state.h, setSize]);

    if (!state.isOpen && !animatingOut) return null;

    const currentHeight = state.collapsed ? COLLAPSED_HEIGHT : state.h;

    return (
        <div
            className="fixed z-[70] select-none"
            style={{
                left: state.x,
                top: state.y,
                width: state.w,
                height: currentHeight,
                transition: 'opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1)',
                opacity: mounted && !animatingOut ? 1 : 0,
                transform: mounted && !animatingOut ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
                pointerEvents: mounted ? 'auto' : 'none',
            }}
        >
            <div className="w-full h-full rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
                <div
                    onMouseDown={onDragStart}
                    className="flex items-center justify-between px-3.5 py-3 border-b border-border cursor-grab active:cursor-grabbing flex-shrink-0"
                    style={{ height: COLLAPSED_HEIGHT }}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-card-foreground truncate">Краткое содержание</span>
                        {isLoading && (
                            <div className="flex gap-1 ml-0.5 flex-shrink-0">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                                        style={{ animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                                ))}
                            </div>
                        )}
                        <GripHorizontal className="w-3.5 h-3.5 text-muted-foreground/40 ml-1 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2" onMouseDown={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => update({ collapsed: !state.collapsed })}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-card-foreground transition-colors"
                        >
                            {state.collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-card-foreground transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {!state.collapsed && (
                    <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                        {isLoading && !displayed ? (
                            <div className="space-y-2.5 py-2">
                                {[100, 85, 92, 70, 88, 76, 94].map((w, i) => (
                                    <div key={i} className="h-3 rounded-full bg-muted animate-pulse"
                                        style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }} />
                                ))}
                            </div>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => <h1 className="text-base font-semibold text-card-foreground mt-4 mb-2 first:mt-0">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-sm font-semibold text-card-foreground mt-3 mb-1.5">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-medium text-card-foreground mt-2 mb-1">{children}</h3>,
                                    p: ({ children }) => <p className="text-sm text-card-foreground leading-relaxed mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="text-sm text-card-foreground space-y-1 mb-2 pl-4 list-disc">{children}</ul>,
                                    ol: ({ children }) => <ol className="text-sm text-card-foreground space-y-1 mb-2 pl-4 list-decimal">{children}</ol>,
                                    li: ({ children }) => <li className="text-sm text-card-foreground leading-relaxed">{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold text-card-foreground">{children}</strong>,
                                    em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
                                    code: ({ children }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-card-foreground">{children}</code>,
                                    blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground italic my-2">{children}</blockquote>,
                                    hr: () => <hr className="border-border my-3" />,
                                }}
                            >
                                {displayed || effectiveSummary}
                            </ReactMarkdown>
                        )}
                    </div>
                )}

                {!state.collapsed && (
                    <div onMouseDown={onResizeStart}
                        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-1 opacity-40 hover:opacity-80 transition-opacity"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground" />
                        </svg>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes pulseDot {
                    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                    40%           { opacity: 1;   transform: scale(1);   }
                }
            `}</style>
        </div>
    );
}
