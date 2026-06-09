"use client";

import { Grip, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";

interface LinkItem {
  linkId: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clicks: number;
}

interface LinkCardProps {
  link: LinkItem;
  onToggle: (linkId: string, isActive: boolean) => void;
  onDelete: (linkId: string) => void;
}

export default function LinkCard({ link, onToggle, onDelete }: LinkCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border rounded-xl group hover:shadow-sm transition-shadow">
      <Grip className="w-5 h-5 text-gray-300 cursor-grab" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{link.title}</p>
        <p className="text-sm text-gray-500 truncate">{link.url}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{link.clicks} clicks</span>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
      <button
        onClick={() => onToggle(link.linkId, !link.isActive)}
        className={`p-2 rounded-lg transition-colors ${
          link.isActive
            ? "text-green-500 hover:bg-green-50"
            : "text-gray-300 hover:bg-gray-100"
        }`}
      >
        {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button
        onClick={() => onDelete(link.linkId)}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
