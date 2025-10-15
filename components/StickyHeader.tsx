type Props = {
  deck: {
    title: string;
    description: string | null;
  };
};

export default function StickyHeader({ deck }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 py-4">
      <h1 className="text-xl font-semibold">{deck.title}</h1>
      {deck.description && (
        <p className="text-sm text-gray-600">{deck.description}</p>
      )}
    </div>
  );
}
