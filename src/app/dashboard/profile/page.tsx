"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Camera, Save, Check, AlertCircle, Upload } from "lucide-react";

interface Profile {
  name: string;
  image: string;
  username: string;
  bio: string;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    image: "",
    username: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error" | "taken">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name || "",
          image: data.image || "",
          username: data.username || "",
          bio: data.bio || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setProfile({ ...profile, image: data.url });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (res.status === 409) {
      setStatus("taken");
    } else if (res.ok) {
      setStatus("saved");
      updateSession();
    } else {
      setStatus("error");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your photo, name, username, and bio
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile picture */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "U");
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 cursor-pointer transition-colors w-fit">
                <Upload className="w-4 h-4" />
                Upload photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP, or GIF. Max 5MB.</p>
            </div>
          </div>
        </section>

        {/* Name */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Display Name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </section>

        {/* Username */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Username</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">/</span>
            <input
              type="text"
              placeholder="username"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") })
              }
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Letters, numbers, hyphens, and underscores only. Your public page will be at /
            {profile.username || "username"}
          </p>
          {status === "taken" && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> This username is already taken
            </p>
          )}
        </section>

        {/* Bio */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Bio</h2>
          <textarea
            placeholder="A short description about yourself"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{profile.bio.length} characters</p>
        </section>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>

          {status === "saved" && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-3 h-3" /> Failed to save
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
