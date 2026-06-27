"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Loader2, Lock, Send, ShieldCheck, UserRound } from "lucide-react";

type Message = {
  id: string;
  sender_type: "buyer" | "seller" | "system";
  content: string;
  created_at: string;
};

type TransactionChatProps = {
  textbookId: string;
  textbookTitle: string;
  textbookPrice: string;
  textbookCourse: string;
  sellerLabel: string;
};

export function TransactionChat({ textbookId, textbookTitle, textbookPrice, textbookCourse, sellerLabel }: TransactionChatProps) {
  const [handleName, setHandleName] = useState("");
  const [major, setMajor] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "system-1", sender_type: "system", content: "安全のため、初回は定型文のみ送信できます。学術目的が分かる内容から取引を始めてください。", created_at: new Date().toISOString() },
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/messages/${textbookId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: Message[]) => { if (data.length > 0) setMessages((prev) => [...prev, ...data]); })
      .catch(() => {});
  }, [textbookId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const templates = useMemo(() => [
    `I'm ${handleName || "[Handle Name]"} from ${major || "[Major]"}, interested in this book.`,
    `${major || "[Major]"}の${handleName || "[Handle Name]"}です。この教科書を購入希望です。`,
    `${textbookCourse}で使用するため、${textbookTitle}について受け渡し可能日を相談したいです。`,
  ], [handleName, major, textbookCourse, textbookTitle]);

  const canSendTemplate = handleName.trim().length > 0 && major.trim().length > 0;
  const hasBuyerMessage = messages.some((m) => m.sender_type === "buyer");

  const sendTemplate = async (content: string) => {
    if (!canSendTemplate || sending) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${textbookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const { error: apiError } = await res.json();
        setError(apiError ?? "送信に失敗しました。");
        return;
      }
      const newMessage: Message = await res.json();
      setMessages((prev) => [...prev, newMessage]);
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#0056b3] text-white">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-slate-950">{textbookTitle}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{textbookPrice} / {sellerLabel}</p>
            </div>
          </div>
        </div>
        <div className="min-h-[24rem] space-y-3 bg-slate-50 p-4">
          {messages.map((message) => (
            <div key={message.id} className={message.sender_type === "buyer" ? "ml-auto max-w-[80%] rounded-lg bg-[#0056b3] px-4 py-3 text-sm font-bold leading-6 text-white" : "max-w-[88%] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-700"}>
              {message.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-slate-200 bg-white p-4">
          {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500"><UserRound className="h-4 w-4" aria-hidden="true" />Handle Name</span>
              <input value={handleName} onChange={(e) => setHandleName(e.target.value)} placeholder="例: econ_student" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-bold outline-none focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Major</span>
              <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="例: 経済学部" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-bold outline-none focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
          <div className="mt-4 space-y-2">
            {templates.map((template) => (
              <button key={template} type="button" onClick={() => sendTemplate(template)} disabled={!canSendTemplate || sending} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold leading-6 text-slate-800 transition hover:border-[#0056b3] hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">
                <span>{template}</span>
                {sending ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#0056b3]" /> : <Send className="h-4 w-4 shrink-0 text-[#0056b3]" />}
              </button>
            ))}
          </div>
          {hasBuyerMessage ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-bold leading-6 text-[#28a745]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />初回メッセージを送信しました。出品者の返信をお待ちください。</div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold leading-6 text-slate-600"><Lock className="mt-0.5 h-4 w-4 shrink-0" />初回は定型文のみ送信できます。ハンドルネームと学部を入力してください。</div>
          )}
        </div>
      </section>
      <aside className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-950">取引ルール</h2>
          <div className="mt-3 space-y-3 text-sm font-bold leading-6 text-slate-600">
            <p>初回連絡は学術目的が分かる定型文のみです。</p>
            <p>ハンドルネームを使い、実名や個人連絡先の送信は避けてください。</p>
            <p>受け渡しは大学図書館入口、大学生協など公共の場所を推奨します。</p>
            <p>外部SNSへの誘導は避けてください。</p>
          </div>
        </section>
        <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#0056b3]"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Recommended meetup spots</h2>
          <p className="mt-2 text-sm font-black leading-6 text-slate-700">Library entrance, Univ. Co-op</p>
        </section>
      </aside>
    </div>
  );
}
