"use client";
import { ShareIcon } from "@heroicons/react/24/solid";
import copyToClipboard from "@/utils/copyToClipboard";

export default function ShareButton({ url, title }) {
  return (
    <button
      onClick={() => copyToClipboard(url, title)}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
    >
      <ShareIcon className="h-5 w-5" />
      แชร์
    </button>
  );
}
