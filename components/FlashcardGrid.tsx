import Flashcard from "./Flashcard";

type Props = {
  cards: {
    id: string;
    front: string;
    back: string;
  }[];
};

export default function FlashcardGrid({ cards }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Flashcard key={card.id} front={card.front} back={card.back} />
      ))}
    </div>
  );
}
