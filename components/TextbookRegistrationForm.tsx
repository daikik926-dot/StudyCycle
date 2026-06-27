"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import {
  Camera, CheckSquare, CircleDollarSign, FileText, GraduationCap,
  Loader2, MailCheck, ScanLine, ShieldCheck, UploadCloud, UserRound, X,
} from "lucide-react";

function isIsbnBarcode(code: string) {
  return /^(978|979)\d{10}$/.test(code);
}

export function TextbookRegistrationForm() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const detectedRef = useRef(false);

  const [isbn, setIsbn] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("ISBNバーコードを読み取ると、入力欄へ自動入力されます。");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const photoCount = photoFiles.length;

  useEffect(() => {
    return () => {
      Quagga.offDetected();
      Quagga.stop();
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoUrls]);

  const photoSummary = useMemo(() => {
    if (photoCount === 0) return "表紙写真を1枚以上アップロードしてください。";
    return `${photoCount}枚の写真を選択済み`;
  }, [photoCount]);

  const stopScanner = () => {
    Quagga.offDetected();
    Quagga.stop();
    setIsScanning(false);
  };

  const startScanner = () => {
    if (!previewRef.current || isScanning) return;
    detectedRef.current = false;
    setScanStatus("カメラを起動しています...");
    setIsScanning(true);

    Quagga.init(
      {
        inputStream: { type: "LiveStream", target: previewRef.current, constraints: { facingMode: "environment" } },
        locator: { patchSize: "medium", halfSample: true },
        decoder: { readers: ["ean_reader"] },
      },
      (error) => {
        if (error) {
          setScanStatus("カメラを起動できませんでした。ブラウザのカメラ許可を確認してください。");
          setIsScanning(false);
          return;
        }
        Quagga.start();
        setScanStatus("教科書裏面のISBNバーコードをカメラ枚の中央に合わせてください。");
      },
    );

    Quagga.onDetected((result: QuaggaJSResultObject) => {
      const code = result.codeResult?.code ?? "";
      if (!code || detectedRef.current) return;
      if (!isIsbnBarcode(code)) {
        setScanStatus(`ISBNではないバーコードを検出しました: ${code}`);
        return;
      }
      detectedRef.current = true;
      setIsbn(code);
      setScanStatus(`ISBNを読み取りました: ${code}`);
      stopScanner();
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 5);
    photoUrls.forEach((url) => URL.revokeObjectURL(url));
    setPhotoFiles(files);
    setPhotoUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (photoFiles.length === 0) {
      setSubmitError("写真を1枚以上アップロードしてください。");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);

    try {
      let coverUrl: string | null = null;
      const uploadFormData = new FormData();
      uploadFormData.set("file", photoFiles[0]);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFormData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        coverUrl = url;
      }

      const res = await fetch("/api/textbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isbn,
          title: data.get("title"),
          author: data.get("author"),
          course: data.get("course"),
          professor: data.get("professor"),
          price: data.get("price"),
          condition: data.get("condition"),
          has_senior_notes: data.get("has_senior_notes") === "on",
          cover_url: coverUrl,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setSubmitError(error ?? "出品に失敗しました。もう一度お試しください。");
        return;
      }

      const textbook = await res.json();
      router.push(`/textbooks/${textbook.id}`);
    } catch {
      setSubmitError("ネットワークエラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_18rem]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{submitError}</div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0056b3] text-white">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">教科書写真</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">指定出品を防ぐため、表紙が確認できる写真を1枚以上（最大5枚）登録してください。</p>
            </div>
          </div>
          <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#0056b3] hover:bg-blue-50">
            <UploadCloud className="h-9 w-9 text-[#0056b3]" aria-hidden="true" />
            <span className="mt-3 text-sm font-black text-slate-900">写真をアップロード</span>
            <span className="mt-1 text-xs font-medium text-slate-500">JPG / PNG / WEBP（员5MBまで）</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoChange} className="sr-only" />
          </label>
          <p className="mt-3 text-sm font-bold text-[#0056b3]">{photoSummary}</p>
          {photoFiles.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {photoFiles.map((file, index) => (
                <div key={file.name} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img src={photoUrls[index]} alt={`${file.name} preview`} className="aspect-[4/3] w-full object-cover" />
                  <p className="truncate px-3 py-2 text-xs font-bold text-slate-600">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#28a745] text-white">
              <ScanLine className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">基本情報</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">授業との対応が分かる情報を登録してください。</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-900">ISBN Code</span>
              <div className="mt-2 flex gap-2">
                <input name="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} inputMode="numeric" placeholder="978xxxxxxxxxx" className="h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100" />
                <button type="button" onClick={startScanner} disabled={isScanning} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[#0056b3] px-4 text-sm font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Scan</span>
                </button>
              </div>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="title" label="Textbook Title" icon={<FileText className="h-4 w-4" />} placeholder="例: ミクロ経済学入門" required />
              <Field name="author" label="Author" icon={<UserRound className="h-4 w-4" />} placeholder="例: 山田 太郎" />
              <Field name="course" label="Course Name" icon={<GraduationCap className="h-4 w-4" />} placeholder="例: 基礎ミクロ経済" />
              <Field name="professor" label="Professor Name" icon={<UserRound className="h-4 w-4" />} placeholder="例: 佐藤教授" />
            </div>
            <Field name="condition" label="Condition（状態コメント）" icon={<FileText className="h-4 w-4" />} placeholder="例: 書き込み少なめ。試験対策メモ付き。" />
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CircleDollarSign className="h-4 w-4 text-[#0056b3]" aria-hidden="true" />
                Price <span className="text-red-500">*</span>
              </span>
              <div className="mt-2 flex h-12 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-[#0056b3] focus-within:ring-4 focus-within:ring-blue-100">
                <span className="grid w-12 place-items-center border-r border-slate-200 bg-slate-50 text-base font-black text-slate-600">¥</span>
                <input name="price" inputMode="numeric" placeholder="1800" required pattern="[0-9]+" className="min-w-0 flex-1 px-4 font-bold outline-none placeholder:text-slate-400" />
              </div>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="has_senior_notes" className="mt-1 h-5 w-5 rounded border-slate-300 text-[#28a745] focus:ring-[#28a745]" />
            <span>
              <span className="flex items-center gap-2 text-sm font-black text-slate-950">
                <CheckSquare className="h-4 w-4 text-[#28a745]" aria-hidden="true" />
                Senior&apos;s Exam Memo（先輩の試験対策メモ付）
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">試験範囲、出題傾向、重要ページなど、学習に役立つメモを同梱する場合に選択してください。</span>
            </span>
          </label>
        </section>

        <button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#28a745] text-sm font-black text-white transition hover:bg-green-700 disabled:bg-slate-300">
          {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />出品中...</>) : "出品する"}
        </button>
      </form>

      <aside className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
            <Camera className="h-5 w-5 text-[#0056b3]" aria-hidden="true" />Camera Preview
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
            <div ref={previewRef} className="relative grid aspect-[4/3] min-h-56 place-items-center text-center text-sm font-bold text-white [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover">
              {!isScanning && (<div className="px-6"><Camera className="mx-auto mb-3 h-8 w-8" aria-hidden="true" /><p>Scanボタンでカメラを起動</p></div>)}
              <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-[#28a745] shadow-[0_0_16px_rgba(40,167,69,0.9)]" />
              <div className="pointer-events-none absolute inset-6 rounded-lg border border-white/40" />
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-[#0056b3]">{scanStatus}</p>
        </section>
        <section className="rounded-lg border border-[#0056b3]/20 bg-blue-50 p-5">
          <h2 className="flex items-center gap-2 text-base font-black text-[#0056b3]"><ShieldCheck className="h-5 w-5" aria-hidden="true" />Safety Notice</h2>
          <p className="mt-3 text-sm font-bold leading-7 text-slate-700">出品には大学メールアドレス（.ac.jp）による認証が必要です。学内の公共の場での受け渡しを推奨します。</p>
          <div className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
            <p className="flex items-center gap-2"><MailCheck className="h-4 w-4 text-[#28a745]" aria-hidden="true" />大学メール認証</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#28a745]" aria-hidden="true" />学術利用を前提とした出品</p>
          </div>
        </section>
      </aside>
    </div>
  );
}

function Field({ name, label, icon, placeholder, required }: { name: string; label: string; icon: React.ReactNode; placeholder: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="text-[#0056b3]">{icon}</span>{label}{required && <span className="text-red-500">*</span>}
      </span>
      <input name={name} placeholder={placeholder} required={required} className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}
