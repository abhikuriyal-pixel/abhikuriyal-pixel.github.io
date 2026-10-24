// Apply the theme before the stylesheet loads to avoid a light-mode flash.
(() => {
    const storageKey = 'portfolio-theme';
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    function readPreference() {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved === 'light' || saved === 'dark' ? saved : null;
        } catch {
            return null;
        }
    }

    let preference = readPreference();

    function applyTheme() {
        const theme = preference ?? (systemTheme.matches ? 'dark' : 'light');
        root.dataset.theme = theme;

        const heart = document.getElementById('theme-heart');
        if (heart) heart.textContent = theme === 'dark' ? '🤍' : '🖤';

        const button = document.getElementById('theme-toggle');
        if (button) {
            const nextTheme = theme === 'dark' ? 'light' : 'dark';
            button.setAttribute('aria-checked', String(theme === 'dark'));
            button.setAttribute('title', `Switch to ${nextTheme} mode`);
        }
    }

    applyTheme();

    document.addEventListener('DOMContentLoaded', () => {
        const button = document.getElementById('theme-toggle');
        const controls = document.getElementById('theme-controls');
        if (!button || !controls) return;

        button.addEventListener('click', () => {
            preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme();
            try {
                localStorage.setItem(storageKey, preference);
            } catch {
                // The toggle still works for this visit when storage is unavailable.
            }
        });

        applyTheme();
        controls.hidden = false;
    }, { once: true });

    systemTheme.addEventListener('change', () => {
        if (preference === null) applyTheme();
    });

    window.addEventListener('storage', (event) => {
        if (event.key === storageKey || event.key === null) {
            preference = readPreference();
            applyTheme();
        }
    });
})();
