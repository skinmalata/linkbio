"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

const themes = [
  { id: "minimal", name: "Minimal", desc: "Clean white", bg: "bg-white border-gray-200", text: "text-gray-900", preview: "bg-gray-100" },
  { id: "dark", name: "Dark", desc: "Bold black", bg: "bg-gray-900 border-gray-700", text: "text-white", preview: "bg-gray-800" },
  { id: "forest", name: "Forest", desc: "Deep green", bg: "bg-green-900 border-green-700", text: "text-white", preview: "bg-green-800" },
  { id: "ocean", name: "Ocean", desc: "Blue depths", bg: "bg-blue-900 border-blue-700", text: "text-white", preview: "bg-blue-800" },
  { id: "sunset", name: "Sunset", desc: "Warm glow", bg: "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600", text: "text-white", preview: "bg-white/20" },
  { id: "lavender", name: "Lavender", desc: "Soft purple", bg: "bg-purple-100 border-purple-200", text: "text-purple-900", preview: "bg-purple-100" },
];

export default function AppearancePage() {
  const { data: session } = useSession();
  const [currentTheme, setCurrentTheme] = useState("minimal");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.theme) setCurrentTheme(data.theme);
      })
      .catch(() => {});
  }, []);

  const handleThemeChange = async (themeId: string) => {
    setCurrentTheme(themeId);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: themeId }),
    });
  };

  const active = themes.find((t) => t.id === currentTheme) || themes[0];

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
          <h2 className="text-sm font-medium text-gray-700 mb-4">Themes</h2>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => {
              const active = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                    active ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-20 ${theme.bg} flex items-center justify-center`}>
                    {active && <Check className="w-6 h-6 text-white drop-shadow" />}
                  </div>
                  <div className="p-2.5 text-left">
                    <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                    <p className="text-xs text-gray-400">{theme.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Preview</h2>
          <div className={`rounded-2xl p-8 flex flex-col items-center gap-4 ${active.bg}`}>
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-16 h-16 rounded-full ring-4 ring-white/30" />
            )}
            <p className={`font-bold text-lg ${active.text}`}>
              {session?.user?.name || "Your Name"}
            </p>
            <div className="w-full max-w-xs space-y-2">
              <div className={`w-full px-5 py-3.5 text-center text-sm font-medium rounded-xl border ${active.preview} ${active.text} backdrop-blur-sm transition-all`}>
                My GitHub
              </div>
              <div className={`w-full px-5 py-3.5 text-center text-sm font-medium rounded-xl border ${active.preview} ${active.text} backdrop-blur-sm transition-all`}>
                My Website
              </div>
              <div className={`w-full px-5 py-3.5 text-center text-sm font-medium rounded-xl border ${active.preview} ${active.text} backdrop-blur-sm transition-all`}>
                My Twitter
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
