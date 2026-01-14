"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import YouTube from "@tiptap/extension-youtube";
import { useEffect } from "react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  CheckSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Highlighter,
  Quote,
  Minus,
  Youtube,
} from "lucide-react";

interface DocEditorProps {
  onContentChange?: (content: string) => void;
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function ToolbarButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center rounded-lg px-2.5 py-2 text-[13px] leading-none",
        "transition duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0",
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "hover:bg-black/4 active:bg-black/6",
        active && "bg-blue-500/10 text-blue-700"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-white/60 ring-1 ring-black/6 px-1 py-1 backdrop-blur">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-2 h-6 w-px bg-black/6" />;
}

export default function DocEditor({ onContentChange }: DocEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500",
        },
      }),
      Highlight.configure({ multicolor: false }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-xl my-6 ring-1 ring-black/10",
        },
      }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class:
            "border-collapse my-6 w-full overflow-hidden rounded-xl ring-1 ring-black/10",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-black/[0.03] font-semibold",
        },
      }),
      TableCell,
      Color,
      TextStyle,
      YouTube.configure({
        HTMLAttributes: {
          class: "rounded-xl my-6 ring-1 ring-black/10 overflow-hidden",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: cx(
          // typography: landing page 느낌의 깔끔한 prose
          "prose prose-lg max-w-none",
          "focus:outline-none",
          // spacing
          "min-h-[720px] px-12 py-10",
          // selection 느낌 조금 더 모던하게 (선택은 tailwind 기본)
          "selection:bg-blue-500/15"
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor || !onContentChange) return;

    const handleUpdate = ({ editor }: { editor: Editor }) => {
      onContentChange(editor.getText());
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onContentChange]);

  if (!editor) return null;

  return (
    <div className="w-full">
      {/* Toolbar wrapper (glass / sticky) */}
      <div className="sticky top-0 z-30">
        <div
          className={cx(
            "rounded-2xl",
            "border border-black/6",
            "bg-white/70 backdrop-blur-xl",
            "px-3 py-2",
            // heavy shadow 대신: 아주 은은한 하이라이트 + 미세한 그림자
            "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-20px_rgba(0,0,0,0.35)]"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* Text styles */}
            <ToolbarGroup>
              <ToolbarButton
                title="굵게 (Ctrl+B)"
                active={editor.isActive("bold")}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="기울임 (Ctrl+I)"
                active={editor.isActive("italic")}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="밑줄 (Ctrl+U)"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="취소선"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarGroup>

            <Divider />

            {/* Headings */}
            <ToolbarGroup>
              <ToolbarButton
                title="제목 1"
                active={editor.isActive("heading", { level: 1 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="제목 2"
                active={editor.isActive("heading", { level: 2 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="제목 3"
                active={editor.isActive("heading", { level: 3 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarGroup>

            <Divider />

            {/* Alignment */}
            <ToolbarGroup>
              <ToolbarButton
                title="왼쪽 정렬"
                active={editor.isActive({ textAlign: "left" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="가운데 정렬"
                active={editor.isActive({ textAlign: "center" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="오른쪽 정렬"
                active={editor.isActive({ textAlign: "right" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarGroup>

            <Divider />

            {/* Lists */}
            <ToolbarGroup>
              <ToolbarButton
                title="글머리 기호"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="번호 매기기"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="할 일 목록"
                active={editor.isActive("taskList")}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
              >
                <CheckSquare className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarGroup>

            <Divider />

            {/* Inserts */}
            <ToolbarGroup>
              <ToolbarButton
                title="이미지 삽입"
                onClick={() => {
                  const url = window.prompt("이미지 URL을 입력하세요:");
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="YouTube 동영상"
                onClick={() => {
                  const url = window.prompt("YouTube URL을 입력하세요:");
                  if (url)
                    editor.chain().focus().setYoutubeVideo({ src: url }).run();
                }}
              >
                <Youtube className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="링크 삽입"
                active={editor.isActive("link")}
                onClick={() => {
                  const url = window.prompt("링크 URL을 입력하세요:");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="표 삽입"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                <TableIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="하이라이트"
                active={editor.isActive("highlight")}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
              >
                <Highlighter className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="인용구"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                title="구분선"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>
            </ToolbarGroup>
          </div>
        </div>
      </div>

      {/* Editor surface (landing page card) */}
      <div
        className={cx(
          "mt-4 overflow-hidden rounded-3xl",
          "border border-black/6",
          "bg-white",
          // 과한 shadow 대신 '카드' 느낌만 살짝
          "shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_18px_60px_-50px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* subtle background like modern docs */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.035),transparent_50%)]" />
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
