"use client";

import { useMemo, useState } from "react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  tone?: "structure" | "clarity" | "evidence" | "flow";
  priority?: "high" | "mid" | "low";
}

interface SuggestionsPanelProps {
  contentLength: number;
  paragraphCount: number;
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getProgress(contentLength: number) {
  // 0~1000 글자 기준으로 진행률 표시(UX용). 필요하면 기준을 바꿔도 됨.
  const pct = Math.round((clamp(contentLength, 0, 1000) / 1000) * 100);
  return pct;
}

function pillStyle(priority?: Suggestion["priority"]) {
  switch (priority) {
    case "high":
      return "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/15";
    case "mid":
      return "bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/15";
    default:
      return "bg-slate-400/10 text-slate-600 ring-1 ring-slate-400/15";
  }
}

function toneDot(tone?: Suggestion["tone"]) {
  switch (tone) {
    case "structure":
      return "bg-indigo-500/60";
    case "clarity":
      return "bg-blue-500/60";
    case "evidence":
      return "bg-emerald-500/60";
    case "flow":
      return "bg-amber-500/60";
    default:
      return "bg-slate-400/60";
  }
}

export default function SuggestionsPanel({
  contentLength,
  paragraphCount,
}: SuggestionsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const suggestions = useMemo((): Suggestion[] => {
    const s: Suggestion[] = [];

    if (contentLength < 100) {
      s.push(
        {
          id: "1",
          title: "목차와 구조를 먼저 잡아보세요",
          description:
            "서론–본론–결론의 뼈대를 먼저 만들면 글이 훨씬 안정적으로 전개돼요.",
          tone: "structure",
          priority: "high",
        },
        {
          id: "2",
          title: "핵심 주제를 한 문장으로 정리해보세요",
          description:
            "“이 글은 결국 무엇을 말하는가?”를 한 문장으로 못 박아보세요.",
          tone: "clarity",
          priority: "mid",
        }
      );
    } else if (contentLength < 500) {
      s.push(
        {
          id: "1",
          title: "각 문단의 핵심을 1문장으로 요약해보세요",
          description:
            "문단의 주장/근거/결론이 분리되면 논리 흐름이 훨씬 또렷해져요.",
          tone: "structure",
          priority: "high",
        },
        {
          id: "2",
          title: "구체적인 예시나 사례를 추가해볼까요?",
          description:
            "추상적인 설명에 1개의 사례만 붙여도 설득력이 크게 올라가요.",
          tone: "evidence",
          priority: "mid",
        }
      );
    } else if (paragraphCount < 3) {
      s.push(
        {
          id: "1",
          title: "문단을 나누어 구조를 명확히 해보세요",
          description:
            "한 문단에는 ‘한 주장’만 담는 게 읽기 쉬운 글의 기본이에요.",
          tone: "structure",
          priority: "high",
        },
        {
          id: "2",
          title: "각 문단의 역할을 정의해보세요",
          description:
            "서론(문제)–본론(근거)–결론(요약/제안)이 있는지 점검해보세요.",
          tone: "flow",
          priority: "mid",
        }
      );
    } else {
      s.push(
        {
          id: "1",
          title: "문단 간 연결이 자연스러운지 점검해보세요",
          description:
            "‘따라서/그러나/또한’ 같은 연결어가 흐름을 매끄럽게 만들어줘요.",
          tone: "flow",
          priority: "mid",
        },
        {
          id: "2",
          title: "근거를 어떤 형태로 보강할까요?",
          description:
            "사례·통계·인용 중 무엇이 이 문맥에 가장 잘 맞는지 골라보세요.",
          tone: "evidence",
          priority: "high",
        },
        {
          id: "3",
          title: "반대 의견을 한 번만 선제적으로 다뤄보세요",
          description: "반박을 미리 넣으면 논증 신뢰도가 크게 올라가요.",
          tone: "clarity",
          priority: "mid",
        },
        {
          id: "4",
          title: "결론을 ‘다음 행동’까지 포함해 강화해보세요",
          description:
            "요약 + 독자에게 남길 문장 1개 + 다음 단계(제안/다짐)로 마무리해요.",
          tone: "structure",
          priority: "high",
        }
      );
    }

    if (s.length < 2) {
      s.push({
        id: "default-1",
        title: "독자 관점에서 읽기 쉬운가요?",
        description:
          "전문 용어를 풀어쓰거나, 긴 문장을 둘로 나눌 수 있는지 확인해보세요.",
        tone: "clarity",
        priority: "low",
      });
    }

    return s.slice(0, 4);
  }, [contentLength, paragraphCount]);

  const progress = getProgress(contentLength);

  return (
    <aside
      className={cx(
        "sticky top-24",
        "max-h-[calc(100vh-8rem)] overflow-y-auto",
        // Modern panel shell
        "rounded-2xl border border-black/6",
        "bg-white/70 backdrop-blur-xl",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_18px_60px_-55px_rgba(0,0,0,0.45)]",
        "p-4"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/4 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-black/6">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500/60" />
              Writing Coach
            </span>
            <span className="text-[11px] text-slate-500">
              {contentLength.toLocaleString()} chars · {paragraphCount} paras
            </span>
          </div>
          <h2 className="mt-2 text-[15px] font-semibold text-slate-900 tracking-tight">
            Suggestions
          </h2>
          <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">
            지금 글 상태에 맞춰 “다음 한 걸음”만 제안해요.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 rounded-xl bg-white/60 ring-1 ring-black/6 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-slate-800">
            작성 진행
          </span>
          <span className="text-[12px] text-slate-600">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500/70"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          팁: 500자 이상부터 구조/근거 추천이 더 정교해져요.
        </div>
      </div>

      {/* Suggestion list */}
      <div className="mt-4 space-y-2">
        {suggestions.map((s) => {
          const selected = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={cx(
                "w-full text-left rounded-xl p-3",
                "ring-1 ring-black/6",
                "bg-white/60",
                "transition duration-150",
                "hover:bg-white hover:ring-black/10",
                "active:bg-black/3",
                selected && "ring-2 ring-blue-500/25 bg-blue-500/6"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cx(
                    "mt-1 inline-flex h-2 w-2 rounded-full",
                    toneDot(s.tone)
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">
                      {s.title}
                    </h3>
                    <span
                      className={cx(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        pillStyle(s.priority)
                      )}
                    >
                      {s.priority ?? "low"}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-500">
                    클릭하면 강조 표시됩니다 (UX 힌트)
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 rounded-xl bg-white/60 ring-1 ring-black/6 p-3">
        <p className="text-[11px] text-slate-600 leading-relaxed text-center">
          <span className="font-medium text-slate-800">
            AI는 글을 대신 쓰지 않고,
          </span>{" "}
          방향과 점검 포인트만 제공합니다.
        </p>
      </div>
    </aside>
  );
}
