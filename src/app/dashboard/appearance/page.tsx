"use client";

import { useState, useEffect } from "react";
import ThemePicker from "@/components/ThemePicker";
import { useSession } from "next-auth/react";

const themeMap: Record<string, any> = {
  sunset: {
    background: "bg-gradient-to-br from-purple-500 to-pink-500",
    cardStyle: "rounded-2xl shadow-lg",
    textColor: "text-white",
    buttonStyle: "rounded-full",
    font: "font-sans",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  ocean: {
    background: "bg-gradient-to-br from-blue-600 to-cyan-400",
    cardStyle: "rounded-2xl shadow-lg",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    font: "font-sans",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  midnight: {
    background: "bg-gradient-to-br from-slate-900 to-slate-700",
    cardStyle: "rounded-2xl shadow-lg",
    textColor: "text-white",
    buttonStyle: "rounded-xl",
    font: "font-sans",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  forest: {
    background: "bg-gradient-to-br from-emerald-600 to-teal-400",
    cardStyle: "rounded-2xl shadow-lg",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    font: "font-sans",
    cardBg: "bg-white/10 backdrop-blur-sm",
    border: "border-white/20",
  },
  minimal: {
    background: "bg-white",
    cardStyle: "rounded-xl shadow-md",
    textColor: "text-gray-900",
    buttonStyle: "rounded-lg",
    font: "font-sans",
    cardBg: "bg-gray-50",
    border: "border-gray-200",
  },
  dark: {
    background: "bg-black",
    cardStyle: "rounded-xl",
    textColor: "text-white",
    buttonStyle: "rounded-lg",
    font: "font-sans",
    cardBg: "bg-neutral-900",
    border: "border-neutral-800",
  },
};

export default function AppearancePage() {
  const { data: session } = useSession();
  const [currentTheme, setCurrentTheme] = useState("sunset");

  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("linkbio-theme");
    if (saved) setCurrentTheme(saved);
  }, []);

  const handleThemeChange = async (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("linkbio-theme", themeId);
    const theme = themeMap[themeId];
    if (theme) {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: JSON.stringify(theme) }),
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize how your public profile looks
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Themes</h2>
          <ThemePicker currentTheme={currentTheme} onSelect={handleThemeChange} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Preview</h2>
          <div className={`${themeMap[currentTheme]?.background || "bg-gray-100"} rounded-2xl p-8 flex flex-col items-center gap-4`}>
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-16 h-16 rounded-full border-2 border-white/30" />
            )}
            <p className={`font-bold text-lg ${themeMap[currentTheme]?.textColor || "text-white"}`}>
              {session?.user?.name || "Your Name"}
            </p>
            <div className="w-full max-w-xs space-y-2">
              <div className={`w-full px-4 py-3 text-center text-sm font-medium ${themeMap[currentTheme]?.cardBg || "bg-white/10"} ${themeMap[currentTheme]?.textColor || "text-white"} ${themeMap[currentTheme]?.border || "border-white/20"} border backdrop-blur-sm ${themeMap[currentTheme]?.buttonStyle || "rounded-lg"}`}>
                Example Link
              </div>
              <div className={`w-full px-4 py-3 text-center text-sm font-medium ${themeMap[currentTheme]?.cardBg || "bg-white/10"} ${themeMap[currentTheme]?.textColor || "text-white"} ${themeMap[currentTheme]?.border || "border-white/20"} border backdrop-blur-sm ${themeMap[currentTheme]?.buttonStyle || "rounded-lg"}`}>
                Another Link
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
