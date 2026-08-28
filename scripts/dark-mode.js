/*==========================================================
                DARK-MODE.JS
    Detects system preference, allows manual toggle, and
    persists the user's choice across visits.
==========================================================*/

function getStoredTheme() {

    try {
        return localStorage.getItem("biodataStudioTheme");
    } catch (e) {
        return null;
    }

}


function storeTheme(theme) {

    try {
        localStorage.setItem("biodataStudioTheme", theme);
    } catch (e) {
        // localStorage unavailable — theme just won't persist
    }

}


function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    const icon = document.querySelector("#darkModeToggle .dark-mode-icon");

    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";

}


function initializeDarkMode() {

    const stored = getStoredTheme();
    const systemPrefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = stored || (systemPrefersDark ? "dark" : "light");

    applyTheme(initialTheme);

    const toggle = document.getElementById("darkModeToggle");

    if (toggle) {

        toggle.addEventListener("click", () => {

            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";

            applyTheme(next);
            storeTheme(next);

        });

    }

    // follow system changes only if the user hasn't manually chosen a theme
    if (!stored && window.matchMedia) {

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {

            if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");

        });

    }

}


document.addEventListener("DOMContentLoaded", initializeDarkMode);
