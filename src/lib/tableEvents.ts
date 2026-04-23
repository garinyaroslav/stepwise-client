import { useEffect } from "react";

export const TABLE_REFRESH_EVENT = 'works-table:refresh';

export function emitTableRefresh() {
    window.dispatchEvent(new CustomEvent(TABLE_REFRESH_EVENT));
}

export function useTableRefreshListener(callback: () => void) {
    useEffect(() => {
        window.addEventListener(TABLE_REFRESH_EVENT, callback);
        return () => window.removeEventListener(TABLE_REFRESH_EVENT, callback);
    }, [callback]);
}
