"use client";

import { useEffect, useRef, useState } from "react";
import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import { BookOpen, Camera, CircleDollarSign, ScanLine, X } from "lucide-react";

function isIsbnBarcode(code: string) {
  return /^(978|979)\d{10}$/.test(code);
}

export function BarcodeScanner() {
  const previewRef = useRef<HTMLDivElement>(null);
  const detectedRef = useRef(false);
  const [isbn, setIsbn] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("ISBNバーコードを読み取ると、入力欄に自動で入ります。");

  useEffect(() => {
    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);

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
        setStatus("教科書のバーコードをカメラ枠の中央に合わせてください。");
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

  return (
    <section
      id="list-textbook"
      className="scroll-mt-24 border-b border-stone-200 bg-[linear-gradient(180deg,#fbfaf6_0%,#f3fbf6_100%)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-bold text-leaf">
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            Smart Textbook Listing
          </div>
          <h2 className="mt-3 text-2xl font-black text-ink sm:text-3xl">
            教科書を出品する
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            ISBNバーコードを読み取って、出品情報の入力をスムーズにします。
          </p>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-bold text-ink">
                <BookOpen className="h-4 w-4 text-leaf" aria-hidden="true" />
                Textbook Title
              </span>
              <input
                placeholder="例: ミクロ経済学入門"
                className="mt-2 h-12 w-full rounded-lg border border-stone-200 bg-paper px-4 text-base font-bold text-ink outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">Course Name</span>
              <input
                placeholder="例: 基礎ミクロ経済"
                className="mt-2 h-12 w-full rounded-lg border border-stone-200 bg-paper px-4 text-base font-bold text-ink outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-ink">
                <CircleDollarSign className="h-4 w-4 text-leaf" aria-hidden="true" />
                Price
              </span>
              <input
                placeholder="例: 1800"
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-lg border border-stone-200 bg-paper px-4 text-base font-bold text-ink outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mt-4 flex items-center gap-2 text-sm font-bold text-ink">
              <ScanLine className="h-4 w-4 text-leaf" aria-hidden="true" />
              ISBN Number
            </span>
            <input
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              inputMode="numeric"
              placeholder="978xxxxxxxxxx"
              className="mt-2 h-12 w-full rounded-lg border border-stone-200 bg-paper px-4 text-base font-bold text-ink outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startScanner}
              disabled={isScanning}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-leaf px-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Camera className="h-5 w-5" aria-hidden="true" />
              Scan Barcode
            </button>
            {isScanning ? (
              <button
                type="button"
                onClick={stopScanner}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-bold text-ink transition hover:bg-stone-50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                Stop
              </button>
            ) : null}
          </div>

          <p className="mt-4 rounded-lg bg-mint px-4 py-3 text-sm font-bold leading-6 text-leaf">
            {status}
          </p>

          <p className="mt-4 text-xs leading-5 text-stone-500">
            スキャンにはReact/Next.jsで扱いやすい @ericblade/quagga2 を使用しています。
          </p>
        </div>

        <div className="border-t border-stone-200 bg-[linear-gradient(135deg,#e7f7ef_0%,#fff7d8_100%)] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-950 shadow-md">
            <div
              ref={previewRef}
              className="relative grid aspect-video min-h-56 place-items-center text-center text-sm font-bold text-white [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            >
              {!isScanning ? (
                <div className="px-6">
                  <Camera className="mx-auto mb-3 h-8 w-8" aria-hidden="true" />
                  <p>Camera preview</p>
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-green-300 shadow-[0_0_16px_rgba(134,239,172,0.9)]" />
              <div className="pointer-events-none absolute inset-6 rounded-lg border border-white/40" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
