export type Choice = { label: "A" | "B" | "C" | "D"; text: string };

export type Question = {
  id: number;
  image?: string;
  audio?: string;
  stem?: string;
  choices: Choice[];
};

export const LISTENING_PARTS: { key: number; title: string; total: number }[] =
  [
    { key: 1, title: "Part 1", total: 6 },
    { key: 2, title: "Part 2", total: 25 },
    { key: 3, title: "Part 3", total: 39 },
    { key: 4, title: "Part 4", total: 30 },
  ];

export const READING_PARTS: { key: number; title: string; total: number }[] = [
  { key: 5, title: "Part 5", total: 30 },
  { key: 6, title: "Part 6", total: 16 },
  { key: 7, title: "Part 7", total: 54 },
];

export const FULL_TEST: { key: number; title: string; total: number }[] = [
  { key: 1, title: "Part 1", total: 6 },
  { key: 2, title: "Part 2", total: 25 },
  { key: 3, title: "Part 3", total: 39 },
  { key: 4, title: "Part 4", total: 30 },
  { key: 5, title: "Part 5", total: 30 },
  { key: 6, title: "Part 6", total: 16 },
  { key: 7, title: "Part 7", total: 54 },
];
export const MOCK_Q: Question = {
  id: 4,
  image:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
  audio:
    "https://cdn.pixabay.com/download/audio/2021/09/16/audio_2a8b2cd1b2.mp3?filename=click-124467.mp3",
  choices: [
    { label: "A", text: "" },
    { label: "B", text: "" },
    { label: "C", text: "" },
    { label: "D", text: "" },
  ],
};
