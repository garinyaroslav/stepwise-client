import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

document.addEventListener('DOMContentLoaded', () => {
    const style = getComputedStyle(document.body);
    console.log('Font family:', style.fontFamily);

    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            console.log('Fonts loaded:', JSON.stringify(document.fonts));
        });
    }
});
