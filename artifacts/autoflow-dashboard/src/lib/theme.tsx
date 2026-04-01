import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";
export type ColorTheme = "blue" | "green" | "purple" | "orange" | "teal" | "rose";

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
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  filterPanelOpen: boolean;
  setFilterPanelOpen: (v: boolean) => void;
}

const initialState: ThemeProviderState = {
  theme: "light",
  colorTheme: "blue",
  setTheme: () => null,
  setColorTheme: () => null,
  sidebarCollapsed: false,
  setSidebarCollapsed: () => null,
  filterPanelOpen: false,
  setFilterPanelOpen: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultColorTheme = "blue",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("vite-ui-theme") as Theme) || defaultTheme
  );

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    () => (localStorage.getItem("vite-color-theme") as ColorTheme) || defaultColorTheme
  );

  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(
    () => localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [filterPanelOpen, setFilterPanelOpenState] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const value: ThemeProviderState = {
    theme,
    colorTheme,
    setTheme: (t) => setThemeState(t),
    setColorTheme: (c) => setColorThemeState(c),
    sidebarCollapsed,
    setSidebarCollapsed: (v) => setSidebarCollapsedState(v),
    filterPanelOpen,
    setFilterPanelOpen: (v) => setFilterPanelOpenState(v),
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
