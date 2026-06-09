"use client";

import { cn } from "@/lib/utils";

const themes = [
  {
    id: "sunset",
    name: "Sunset",
    background: "bg-gradient-to-br from-purple-500 to-pink-500",
    textColor: "text-white",
    buttonStyle: "rounded-full",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "bg-gradient-to-br from-blue-600 to-cyan-400",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  {
    id: "midnight",
    name: "Midnight",
    background: "bg-gradient-to-br from-slate-900 to-slate-700",
    textColor: "text-white",
    buttonStyle: "rounded-xl",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  {
    id: "forest",
    name: "Forest",
    background: "bg-gradient-to-br from-emerald-600 to-teal-400",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  {
    id: "minimal",
    name: "Minimal",
    background: "bg-white",
    textColor: "text-gray-900",
    buttonStyle: "rounded-lg",
    cardBg: "bg-gray-50",
    border: "border-gray-200",
  },
  {
    id: "dark",
    name: "Dark",
    background: "bg-black",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    cardBg: "bg-neutral-900",
    border: "border-neutral-800",
  },
];

interface ThemePickerProps {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={cn(
            "relative p-4 rounded-xl border-2 transition-all text-left",
            currentTheme === theme.id
              ? "border-purple-500 ring-2 ring-purple-200"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className={cn("h-16 rounded-lg mb-2 flex items-center justify-center", theme.background)}>
            <div className={cn("w-12 h-2 rounded", theme.cardBg)} />
          </div>
          <p className="text-sm font-medium text-gray-900">{theme.name}</p>
        </button>
      ))}
    </div>
  );
}
