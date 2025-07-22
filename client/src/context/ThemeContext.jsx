import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
    setTheme: () => { },
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }, [theme]);


    useEffect(() => {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only update if user hasn't manually set a theme
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            if (!savedTheme) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const setTheme = (newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            setThemeState(newTheme);
        }
    };

    const toggleTheme = () => {
        setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};