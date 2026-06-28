export type Textbook = {
  id: string;
  title: string;
  author: string;
  course: string;
  professor: string;
  price: string;
  cover: string;
  note: string;
  condition: string;
  seller: string;
  likesCount?: number;
};

export const textbooks: Textbook[] = [
  {
    id: "microeconomics",
    title: "ミクロ経済学入門",
    author: "山田 太郎",
    course: "経済学部 / 基礎ミクロ経済",
    professor: "佐藤教授",
    price: "¥1,800",
    cover: "/covers/economics.svg",
    note: "先輩メモ付き",
    condition: "書き込み少なめ。試験対策メモ付き。",
    seller: "経済学部 3年",
    likesCount: 42,
  },
  {
    id: "organic-chemistry",
    title: "有機化学の基礎",
    author: "中村 明",
    course: "理学部 / 有機化学 I",
    professor: "田中教授",
    price: "¥2,400",
    cover: "/covers/chemistry.svg",
    note: "先輩メモ付き",
    condition: "表紙に軽い使用感あり。重要反応のメモ付き。",
    seller: "理学部 4年",
    likesCount: 28,
  },
  {
    id: "sociology",
    title: "現代社会学講義",
    author: "鈴木 花子",
    course: "文学部 / 社会学概論",
    professor: "山本教授",
    price: "¥1,200",
    cover: "/covers/sociology.svg",
    note: "先輩メモ付き",
    condition: "良好。講義ノートの要点メモ付き。",
    seller: "文学部 2年",
    likesCount: 15,
  },
  {
    id: "statistics",
    title: "統計解析ハンドブック",
    author: "高橋 健",
    course: "情報学部 / データ分析",
    professor: "伊藤教授",
    price: "¥2,100",
    cover: "/covers/statistics.svg",
    note: "先輩メモ付き",
    condition: "一部マーカーあり。演習問題の解き方メモ付き。",
    seller: "情報学部 3年",
    likesCount: 37,
  },
  {
    id: "psychology",
    title: "教育心理学ノート",
    author: "小林 美咏",
    course: "教育学部 / 学習心理学",
    professor: "森教授",
    price: "¥1,500",
    cover: "/covers/psychology.svg",
    note: "先輩メモ付き",
    condition: "状態良好。試験頻出テーマのメモ付き。",
    seller: "教育学部 4年",
    likesCount: 9,
  },
  {
    id: "international-law",
    title: "国際法ケースブック",
    author: "加藤 誠",
    course: "法学部 / 国際法",
    professor: "井上教授",
    price: "¥2,900",
    cover: "/covers/law.svg",
    note: "先輩メモ付き",
    condition: "ケース判例に付箋あり。期末対策メモ付き。",
    seller: "法学部 3年",
    likesCount: 56,
  },
];

export function getTextbook(id: string) {
  return textbooks.find((textbook) => textbook.id === id);
}
