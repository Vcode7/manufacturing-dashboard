import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ColorTheme = "blue" | "green" | "purple" | "orange";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
}

interface ThemeProviderState {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const initialState: ThemeProviderState = {
  theme: "light",
  colorTheme: "blue",
  setTheme: () => null,
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultColorTheme = "blue",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("vite-ui-theme") as Theme) || defaultTheme
  );
  
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (localStorage.getItem("vite-color-theme") as ColorTheme) || defaultColorTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vite-ui-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", colorTheme);
    localStorage.setItem("vite-color-theme", colorTheme);
  }, [colorTheme]);

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    setColorTheme: (colorTheme: ColorTheme) => {
      setColorTheme(colorTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
