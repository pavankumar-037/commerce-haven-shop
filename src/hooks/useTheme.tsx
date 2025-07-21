import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  accent_color: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (theme: ThemeSettings) => void;
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  primary_color: "#f59e0b",
  secondary_color: "#78716c",
  background_color: "#fafaf9",
  accent_color: "#ea580c",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const applyThemeToDOM = (theme: ThemeSettings) => {
  const root = document.documentElement;

  // Convert hex to HSL for CSS variables
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Apply theme colors as CSS variables
  root.style.setProperty("--primary", hexToHsl(theme.primary_color));
  root.style.setProperty("--secondary", hexToHsl(theme.secondary_color));
  root.style.setProperty("--background", hexToHsl(theme.background_color));
  root.style.setProperty("--accent", hexToHsl(theme.accent_color));

  // Also set the raw hex values for compatibility
  root.style.setProperty("--primary-hex", theme.primary_color);
  root.style.setProperty("--secondary-hex", theme.secondary_color);
  root.style.setProperty("--background-hex", theme.background_color);
  root.style.setProperty("--accent-hex", theme.accent_color);

  // Apply to specific color classes used in the app
  root.style.setProperty("--orange-500", theme.primary_color);
  root.style.setProperty("--orange-600", theme.accent_color);
  root.style.setProperty("--emerald-600", theme.secondary_color);
  root.style.setProperty("--emerald-700", theme.secondary_color);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching theme settings:", error);
        applyThemeToDOM(defaultTheme);
        return;
      }

      if (data) {
        setTheme(data);
        applyThemeToDOM(data);
      } else {
        applyThemeToDOM(defaultTheme);
      }
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      applyThemeToDOM(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
