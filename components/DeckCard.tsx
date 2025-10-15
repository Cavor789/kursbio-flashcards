import Link from "next/link";

type Props = {
  deck: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
  };
};

export default function DeckCard({ deck }: Props) {
  return (
    <Link
      href={`/d/${deck.slug}`}
      className="group rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <h2 className="text-base font-semibold group-hover:text-blue-600">
        {deck.title}
      </h2>
      {deck.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {deck.description}
        </p>
      )}
    </Link>
  );
}
