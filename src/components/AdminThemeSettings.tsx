import { useState, useEffect } from "react";
import { Palette, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";

interface ThemeSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  accent_color: string;
}

interface Props {
  onThemeUpdate?: (theme: ThemeSettings) => void;
}

const AdminThemeSettings = ({ onThemeUpdate }: Props) => {
  const { toast } = useToast();
  const { theme, updateTheme, isLoading } = useTheme();

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(theme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setThemeSettings(theme);
  }, [theme]);

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setThemeSettings(data);
        applyThemeToDOM(data);
        onThemeUpdate?.(data);
      }
    } catch (error) {
      console.error("Error fetching theme settings:", error);
    } finally {
      setLoading(false);
    }
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
      let h,
        s,
        l = (max + min) / 2;

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
  };

  const handleColorChange = (field: keyof ThemeSettings, value: string) => {
    const updatedTheme = { ...themeSettings, [field]: value };
    setThemeSettings(updatedTheme);

    // Apply changes immediately for preview
    updateTheme(updatedTheme);
    onThemeUpdate?.(updatedTheme);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if theme settings exist
      const { data: existing } = await supabase
        .from("theme_settings")
        .select("id")
        .limit(1)
        .single();

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from("theme_settings")
          .update({
            primary_color: themeSettings.primary_color,
            secondary_color: themeSettings.secondary_color,
            background_color: themeSettings.background_color,
            accent_color: themeSettings.accent_color,
          })
          .eq("id", existing.id);
      } else {
        // Insert new
        result = await supabase.from("theme_settings").insert([
          {
            primary_color: themeSettings.primary_color,
            secondary_color: themeSettings.secondary_color,
            background_color: themeSettings.background_color,
            accent_color: themeSettings.accent_color,
          },
        ]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Theme Saved",
        description: "Your theme settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultTheme = {
      primary_color: "#f59e0b",
      secondary_color: "#78716c",
      background_color: "#fafaf9",
      accent_color: "#ea580c",
    };

    setThemeSettings(defaultTheme);
    updateTheme(defaultTheme);
    onThemeUpdate?.(defaultTheme);
  };

  if (isLoading) {
    return (
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Theme Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <CardTitle className="text-stone-800 flex items-center justify-between">
          <div className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Theme Customization
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-stone-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Theme"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-3 mt-2">
              <Input
                id="primaryColor"
                type="color"
                value={themeSettings.primary_color}
                onChange={(e) =>
                  handleColorChange("primary_color", e.target.value)
                }
                className="w-16 h-10 border-stone-300 rounded-lg cursor-pointer"
              />
              <Input
                value={themeSettings.primary_color}
                onChange={(e) =>
                  handleColorChange("primary_color", e.target.value)
                }
                className="flex-1 border-stone-300"
                placeholder="#f59e0b"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Main accent color for buttons and highlights
            </p>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-3 mt-2">
              <Input
                id="secondaryColor"
                type="color"
                value={themeSettings.secondary_color}
                onChange={(e) =>
                  handleColorChange("secondary_color", e.target.value)
                }
                className="w-16 h-10 border-stone-300 rounded-lg cursor-pointer"
              />
              <Input
                value={themeSettings.secondary_color}
                onChange={(e) =>
                  handleColorChange("secondary_color", e.target.value)
                }
                className="flex-1 border-stone-300"
                placeholder="#78716c"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Secondary text and border colors
            </p>
          </div>

          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center space-x-3 mt-2">
              <Input
                id="backgroundColor"
                type="color"
                value={themeSettings.background_color}
                onChange={(e) =>
                  handleColorChange("background_color", e.target.value)
                }
                className="w-16 h-10 border-stone-300 rounded-lg cursor-pointer"
              />
              <Input
                value={themeSettings.background_color}
                onChange={(e) =>
                  handleColorChange("background_color", e.target.value)
                }
                className="flex-1 border-stone-300"
                placeholder="#fafaf9"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">Main background color</p>
          </div>

          <div>
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center space-x-3 mt-2">
              <Input
                id="accentColor"
                type="color"
                value={themeSettings.accent_color}
                onChange={(e) =>
                  handleColorChange("accent_color", e.target.value)
                }
                className="w-16 h-10 border-stone-300 rounded-lg cursor-pointer"
              />
              <Input
                value={themeSettings.accent_color}
                onChange={(e) =>
                  handleColorChange("accent_color", e.target.value)
                }
                className="flex-1 border-stone-300"
                placeholder="#ea580c"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Accent color for special elements
            </p>
          </div>
        </div>

        {/* Theme Preview */}
        <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
          <h4 className="text-sm font-medium text-stone-700 mb-3">
            Theme Preview
          </h4>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: themeSettings.primary_color }}
                title="Primary Color"
              />
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: themeSettings.secondary_color }}
                title="Secondary Color"
              />
              <div
                className="w-8 h-8 rounded border border-stone-300"
                style={{ backgroundColor: themeSettings.background_color }}
                title="Background Color"
              />
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: themeSettings.accent_color }}
                title="Accent Color"
              />
            </div>
            <div className="text-xs text-stone-600">
              Changes are applied immediately and will be saved when you click
              "Save Theme"
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminThemeSettings;
