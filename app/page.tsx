import { WordCard } from "./components/WordCard";

const mockWords = [
  {
    eng: "apple",
    partOfSpeech: "noun",
    pronunciation: "ˈæp.əl",
    difficulty: "A1",
    definition:
      "A round fruit with firm, white flesh and a green, red, or yellow skin",
    examples: [
      "Would you like an apple?",
      "Apple pie is my favorite dessert.",
      "The apple trees are in bloom.",
    ],
    imgUrl:
      "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?q=80&w=2070&auto=format&fit=crop",
    videoUrls: [
      "https://www.youtube.com/watch?v=1J3LccpyzCk&ab_channel=HowToPronounce8",
      "https://youtu.be/N2IHKJSbCiw?si=LqUlQ2HEcK50cXK1&t=3",
    ],
  },
  // {
  //   eng: "day",
  //   partOfSpeech: "noun",
  //   pronunciation: "deɪ",
  //   difficulty: "A1",
  //   definition:
  //     "a period of 24 hours",
  //   examples: [
  //     "the days of the week",
  //     "January has 31 days.",
  //     "I saw her the day before yesterday.",
  //   ],
  //   imgUrl:
  //     "https://images.unsplash.com/photo-1600152983255-f295d9174e73?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   videoUrls: [
  //     "https://www.youtube.com/watch?v=R5uhIqcLf1E&ab_channel=EnglishwithCollinsDictionary",
  //   ],
  // }
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden pt-16 sm:pt-0">
      <main>
        {mockWords.map((word) => (
          <WordCard key={word.eng} word={word} />
        ))}
      </main>
    </div>
  );
}
