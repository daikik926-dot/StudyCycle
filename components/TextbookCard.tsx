import Image from "next/image";
import { BadgeCheck, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Textbook } from "@/lib/textbooks";
import { LikeButton } from "@/components/LikeButton";

type TextbookCardProps = {
  textbook: Textbook;
};

export function TextbookCard({ textbook }: TextbookCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-mint">
        {textbook.cover && textbook.cover !== "" ? (
          <Image
            src={textbook.cover}
            alt={`${textbook.title} cover`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-mint">
            <BookOpen className="h-12 w-12 text-leaf opacity-40" aria-hidden="true" />
            <span className="text-xs font-bold text-leaf opacity-50">画像なし</span>
          </div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-bold leading-tight text-ink">
            {textbook.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-stone-500">
            {textbook.course}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-black text-leaf">{textbook.price}</p>
          {textbook.note && (
            <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-bold text-leaf">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {textbook.note}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/textbooks/${textbook.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-stone-200 bg-white text-sm font-bold text-ink transition hover:border-leaf hover:bg-mint hover:text-leaf"
          >
            詳細を見る
          </Link>
          <LikeButton textbookId={textbook.id} initialCount={textbook.likesCount ?? 0} />
        </div>
      </div>
    </article>
  );
}
