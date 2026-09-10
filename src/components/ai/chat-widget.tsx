"use client";

import * as React from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { Send, X, RotateCcw, Paperclip, FileText } from "lucide-react";

const SUGGESTIONS = [
  "Tell me about admissions",
  "Which classes do you offer?",
  "When is the next school event?",
  "What are your office hours?",
];

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hello! I'm Elbie, the EL-BETH-EL Assistant. I can help with school information, admissions, events and announcements. What would you like to know?",
    },
  ],
};

function textOf(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === "text" && "text" in p)
    .map((p) => (p as { text: string }).text)
    .join("");
}

function hasTools(message: UIMessage): boolean {
  return message.parts.some((p) => p.type.startsWith("tool-"));
}

type AttachedFile = {
  name: string;
  mimeType: string;
  data?: string;
};

function filePartsOf(message: UIMessage): AttachedFile[] {
  return message.parts
    .filter((p) => p.type === "file" && "mimeType" in p)
    .map((p) => p as AttachedFile & { type: string });
}

const MAX_FILES = 6;
const MAX_FILE_BYTES = 6 * 1024 * 1024;

function asFileList(files: File[]) {
  if (files.length === 0) return undefined;
  const dt = new DataTransfer();
  for (const f of files) dt.items.add(f);
  return dt.files;
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    messages: [WELCOME],
  });

  const isLoading = status === "submitted" || status === "streaming";

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  function reset() {
    setMessages([WELCOME]);
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const allowed = picked.filter((f) => f.size <= MAX_FILE_BYTES);
    setFiles((prev) => [...prev, ...allowed].slice(0, MAX_FILES));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function send(text: string) {
    if (!text.trim() && files.length === 0) return;
    const toSend = files;
    setInput("");
    setFiles([]);
    const fileListArg = asFileList(toSend);
    if (fileListArg) {
      void sendMessage({ text, files: fileListArg });
    } else {
      void sendMessage({ text });
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Chat with Elbie, the EL-BETH-EL assistant"}
        aria-expanded={open}
        className="ai-widget-beat fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-royal text-white shadow-[0_0_24px_rgba(21,48,107,0.45)] ring-4 ring-royal/25 transition-colors hover:bg-royal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-400 active:scale-95"
      >
        <span
          aria-hidden="true"
          className="ai-widget-halo pointer-events-none absolute inset-0 rounded-full bg-royal/50"
        />
        {open ? (
          <X className="relative h-6 w-6" />
        ) : (
          <Image
            src="/ebksAI.png"
            alt=""
            width={32}
            height={32}
            className="relative h-8 w-8 rounded-full object-cover"
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <aside
          className="fixed bottom-24 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl"
          aria-label="AI assistant chat"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 bg-royal px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Image
                  src="/ebksAI.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Elbie</p>
                <p className="text-xs text-royal-300">School info &amp; records</p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Start a new chat"
              className="rounded p-1.5 text-royal-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: "280px", maxHeight: "360px" }}>
            {messages.map((m) => {
              const text = textOf(m);
              const attached = filePartsOf(m);
              if (!text && !hasTools(m) && attached.length === 0) return null;
              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-[var(--radius)] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-royal text-white"
                        : "border border-border bg-ash-50 text-ink"
                    }`}
                  >
                    {m.role === "assistant" && hasTools(m) && (
                      <span className="mb-1 block text-xs font-medium text-ash-500">
                        checked the school records
                      </span>
                    )}
                    {attached.length > 0 && (
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        {attached.map((fp, i) =>
                          fp.mimeType.startsWith("image/") && fp.data ? (
                            <img
                              key={i}
                              src={fp.data}
                              alt=""
                              className="h-14 w-14 rounded-md object-cover"
                            />
                          ) : (
                            <span
                              key={i}
                              className="flex max-w-[10rem] items-center gap-1 rounded-md bg-white/20 px-2 py-1 text-[11px]"
                            >
                              <FileText className="h-3 w-3 shrink-0" />
                              <span className="truncate">{fp.name}</span>
                            </span>
                          ),
                        )}
                      </div>
                    )}
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-ash-50 px-3.5 py-2.5 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-royal-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-royal-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-royal-400 [animation-delay:240ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="rounded-[var(--radius)] border border-danger-soft bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                  {error.message.includes("configured")
                    ? error.message
                    : "Sorry, I hit an issue. Please try again."}
                  <button
                    type="button"
                    onClick={() => void regenerate()}
                    className="mt-1 block font-medium underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {messages.length <= 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-royal-200 bg-royal-50 px-3 py-1.5 text-xs font-medium text-royal-accent transition-colors hover:bg-royal hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
              onChange={onPickFiles}
            />
            {files.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${f.name}`}
                    className="group flex items-center gap-1.5 rounded-md border border-ash-300 bg-ash-50 py-1 pl-1 pr-2 text-xs text-ink transition-colors hover:border-danger-soft hover:bg-danger-soft"
                  >
                    {f.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="h-6 w-6 rounded object-cover"
                      />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-ash-500" />
                    )}
                    <span className="max-w-[7rem] truncate">{f.name}</span>
                    <X className="h-3 w-3 shrink-0 text-ash-500 group-hover:text-danger" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach a photo or document"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] text-ash-500 transition-colors hover:bg-ash-200 hover:text-ink"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder={
                  files.length > 0 ? "Add a message (optional)" : "Ask about the school..."
                }
                aria-label="Message the assistant"
                className="max-h-28 w-full resize-none rounded-[var(--radius)] border border-ash-400 bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors placeholder:text-ash-500 focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal-100"
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label="Stop generating"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-ash-200 text-ink transition-colors hover:bg-ash-300"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim() && files.length === 0}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal text-white transition-all hover:bg-royal-600 disabled:opacity-45 disabled:pointer-events-none"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-2 space-x-1 text-[11px] text-ash-500">
              <span>AI-generated answers — confirm important details with the school office.</span>
              {files.length > 0 && <span>(max {MAX_FILES} files · 6 MB each)</span>}
            </p>
          </form>
        </aside>
      )}
    </>
  );
}