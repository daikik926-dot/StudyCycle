"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import {
  Camera,
  CheckSquare,
  CircleDollarSign,
  FileText,
  GraduationCap,
  MailCheck,
  ScanLine,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

function isIsbnBarcode(code: string) {
  return /^(978|979)\d{10}$/.test(code);
}

export function TextbookRegistrationForm() {
  const previewRef = useRef<HTMLDivElement>(null);
  const detectedRef = useRef(false);
  const [isbn, setIsbn] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("ISBNバーコードを読み取ると、入力欄へ自動入力されます。");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const photoCount = photoNames.length;

  useEffect(() => {
    return () => {
      Quagga.offDetected();
      Quagga.stop();
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoUrls]);

  const photoSummary = useMemo(() => {
    if (photoCount === 0) {
      return "表紙写真を1枚以上アップロードしてください。";
    }

    return `${photoCount}枚の写真を選択済み`;
  }, [photoCount]);

  const stopScanner = () => {
    Quagga.offDetected();
    Quagga.stop();
    setIsScanning(false);
  };

  const startScanner = () => {
    if (!previewRef.current || isScanning) {
      return;
    }

    detectedRef.current = false;
    setStatus("カメラを起動しています...");
    setIsScanning(true);

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: previewRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      (error) => {
        if (error) {
          setStatus("カメラを起動できませんでした。ブラウザのカメラ許可を確認してください。");
          setIsScanning(false);
          return;
        }

        Quagga.start();
        setStatus("教科書裏面のISBNバーコードをカメラ枠の中央に合わせてください。");
      },
    );

    Quagga.onDetected((result: QuaggaJSResultObject) => {
      const code = result.codeResult?.code ?? "";

      if (!code || detectedRef.current) {
        return;
      }

      if (!isIsbnBarcode(code)) {
        setStatus(`ISBNではないバーコードを検出しました: ${code}`);
        return;
      }

      detectedRef.current = true;
      setIsbn(code);
      setStatus(`ISBNを読み取りました: ${code}`);
      stopScanner();
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    photoUrls.forEach((url) => URL.revokeObjectURL(url));
    setPhotoNames(files.map((file) => file.name));
    setPhotoUrls(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_18rem]">
      <form className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0056b3] text-white">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                教科書写真
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                架空出品を防ぐため、表紙が確認できる写真を1枚以上登録してください。
              </p>
            </div>
          </div>

          <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#0056b3] hover:bg-blue-50">
            <UploadCloud className="h-9 w-9 text-[#0056b3]" aria-hidden="true" />
            <span className="mt-3 text-sm font-black text-slate-900">
              写真をアップロード
            </span>
            <span className="mt-1 text-xs font-medium text-slate-500">
              JPG / PNG / WEBP
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>

          <p className="mt-3 text-sm font-bold text-[#0056b3]">{photoSummary}</p>
          {photoNames.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {photoNames.map((name, index) => (
                <div
                  key={name}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <img
                    src={photoUrls[index]}
                    alt={`${name} preview`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <p className="truncate px-3 py-2 text-xs font-bold text-slate-600">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#28a745] text-white">
              <ScanLine className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                基本情報
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                授業との対応が分かる情報を登録してください。
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-900">ISBN Code</span>
              <div className="mt-2 flex gap-2">
                <input
                  value={isbn}
                  onChange={(event) => setIsbn(event.target.value)}
                  inputMode="numeric"
                  placeholder="978xxxxxxxxxx"
                  required
                  className="h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={startScanner}
                  disabled={isScanning}
                  className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[#0056b3] px-4 text-sm font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Scan</span>
                </button>
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Textbook Title"
                icon={<FileText className="h-4 w-4" aria-hidden="true" />}
                placeholder="例: ミクロ経済学入門"
              />
              <Field
                label="Author"
                icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
                placeholder="例: 山田 太郎"
              />
              <Field
                label="Course Name"
                icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
                placeholder="例: 基礎ミクロ経済"
              />
              <Field
                label="Professor Name"
                icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
                placeholder="例: 佐藤教授"
              />
            </div>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CircleDollarSign className="h-4 w-4 text-[#0056b3]" aria-hidden="true" />
                Price
              </span>
              <div className="mt-2 flex h-12 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-[#0056b3] focus-within:ring-4 focus-within:ring-blue-100">
                <span className="grid w-12 place-items-center border-r border-slate-200 bg-slate-50 text-base font-black text-slate-600">
                  ¥
                </span>
                <input
                  inputMode="numeric"
                  placeholder="1800"
                  required
                  className="min-w-0 flex-1 px-4 font-bold outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#28a745] focus:ring-[#28a745]"
            />
            <span>
              <span className="flex items-center gap-2 text-sm font-black text-slate-950">
                <CheckSquare className="h-4 w-4 text-[#28a745]" aria-hidden="true" />
                Senior&apos;s Exam Memo（先輩の試験対策メモ付）
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                試験範囲、出題傾向、重要ページなど、学習に役立つメモを同梱する場合に選択してください。
              </span>
            </span>
          </label>
        </section>

        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#28a745] text-sm font-black text-white transition hover:bg-green-700"
        >
          出品内容を確認する
        </button>
      </form>

      <aside className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
            <Camera className="h-5 w-5 text-[#0056b3]" aria-hidden="true" />
            Camera Preview
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
            <div
              ref={previewRef}
              className="relative grid aspect-[4/3] min-h-56 place-items-center text-center text-sm font-bold text-white [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            >
              {!isScanning ? (
                <div className="px-6">
                  <Camera className="mx-auto mb-3 h-8 w-8" aria-hidden="true" />
                  <p>Scanボタンでカメラを起動</p>
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-[#28a745] shadow-[0_0_16px_rgba(40,167,69,0.9)]" />
              <div className="pointer-events-none absolute inset-6 rounded-lg border border-white/40" />
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-[#0056b3]">
            {status}
          </p>
        </section>

        <section className="rounded-lg border border-[#0056b3]/20 bg-blue-50 p-5">
          <h2 className="flex items-center gap-2 text-base font-black text-[#0056b3]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Safety Notice
          </h2>
          <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
            出品には大学メールアドレス（.ac.jp）による認証が必要です。学内の公共の場での受け渡しを推奨します。
          </p>
          <div className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
            <p className="flex items-center gap-2">
              <MailCheck className="h-4 w-4 text-[#28a745]" aria-hidden="true" />
              大学メール認証
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#28a745]" aria-hidden="true" />
              学術利用を前提とした出品
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
}

function Field({
  label,
  icon,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="text-[#0056b3]">{icon}</span>
        {label}
      </span>
      <input
        placeholder={placeholder}
        required
        className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
