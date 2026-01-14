"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DocEditor from "@/components/DocEditor";
import SuggestionsPanel from "@/components/SuggestionsPanel";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [documentTitle, setDocumentTitle] = useState("Untitled document");
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Editing">("Saved");
  const [contentLength, setContentLength] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);

  // ✅ setTimeout 중첩 방지(타이핑 빠를 때 상태 튐 방지)
  const saveTimerRef = useRef<number | null>(null);

  const handleContentChange = (content: string) => {
    setContentLength(content.length);

    const paragraphs = content
      .split("\n")
      .filter((line) => line.trim().length > 0);
    setParagraphCount(paragraphs.length);

    if (content.length > 0) {
      setSaveStatus("Editing");
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        setSaveStatus("Saved");
      }, 900);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const subtitle = useMemo(() => {
    const c = contentLength.toLocaleString();
    return `${c} chars · ${paragraphCount} paras`;
  }, [contentLength, paragraphCount]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      {/* subtle background (landing page style) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.05),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,0.9))]" />
      </div>

      {/* Header */}
      <header
        className={cx(
          "fixed top-0 left-0 right-0 z-50",
          "border-b border-black/6",
          "bg-white/70 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto max-w-[1720px] px-6 lg:px-10 h-16 flex items-center gap-4">
          {/* Brand */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-tight">
              Writetracer
            </span>
          </div>

          {/* Title + meta */}
          <div className="min-w-0 flex-1 flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="flex items-center justify-center gap-3">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className={cx(
                    "w-full max-w-[520px] text-center",
                    "bg-transparent outline-none",
                    "text-[15px] font-semibold text-slate-900",
                    "placeholder:text-slate-400",
                    "rounded-lg",
                    "focus:ring-2 focus:ring-blue-500/20"
                  )}
                  placeholder="Untitled document"
                />
              </div>

              <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/3 px-2 py-0.5 ring-1 ring-black/6">
                  <span
                    className={cx(
                      "h-1.5 w-1.5 rounded-full",
                      saveStatus === "Saved"
                        ? "bg-emerald-500/70"
                        : "bg-amber-500/70 animate-pulse"
                    )}
                  />
                  {saveStatus}
                </span>
                <span className="opacity-60">·</span>
                <span>{subtitle}</span>
              </div>
            </div>
          </div>

          {/* Right actions (placeholder) */}
          <div className="shrink-0 hidden md:flex items-center gap-2">
            <button
              type="button"
              className="h-9 rounded-xl px-3 text-[13px] font-medium bg-black/3 hover:bg-black/5 ring-1 ring-black/6 transition"
            >
              Share
            </button>
            <button
              type="button"
              className="h-9 rounded-xl px-3 text-[13px] font-medium bg-blue-600/90 hover:bg-blue-600 text-white ring-1 ring-blue-600/30 transition"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative pt-16">
        <div className="mx-auto max-w-[1720px] px-6 lg:px-10 py-10">
          {/* Responsive layout:
              - xl: 2 columns (editor + panel)
              - smaller: panel collapses under editor
          */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8">
            {/* Editor column */}
            <section className="min-w-0">
              {/* Canvas shell: looks like modern doc page */}
              <div
                className={cx(
                  "rounded-[28px]",
                  "border border-black/6",
                  "bg-white/80 backdrop-blur",
                  "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_30px_90px_-70px_rgba(0,0,0,0.55)]"
                )}
              >
                {/* Top padding to feel like page */}
                <div className="px-5 md:px-7 lg:px-8 py-5">
                  <DocEditor onContentChange={handleContentChange} />
                </div>
              </div>
            </section>

            {/* Suggestions panel */}
            <aside className="min-w-0">
              <div className="xl:sticky xl:top-24">
                <SuggestionsPanel
                  contentLength={contentLength}
                  paragraphCount={paragraphCount}
                />
              </div>

              {/* Mobile hint (optional) */}
              <div className="mt-3 xl:hidden text-[12px] text-slate-500 text-center">
                큰 화면에서 추천 패널이 오른쪽에 고정됩니다.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
