// components/Flashcard.tsx
'use client';

import { useState, useMemo } from 'react';

type Props = {
  front: string | null;
  back: string | null;
  image_url?: string | null;
};

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

export default function Flashcard({ front, back, image_url }: Props) {
  const [flipped, setFlipped] = useState(false);

  // выцепим первую ссылку из текста — на случай, если картинку прислали ссылкой в вопросе
  const firstUrl = useMemo(() => {
    const m = (front || '').match(/https?:\/\/\S+/);
    return m?.[0] ?? null;
  }, [front]);

  const canInlineImage =
    !image_url &&
    firstUrl &&
    IMG_EXT.test(new URL(firstUrl).pathname || '');

  const showImage = image_url || (canInlineImage ? firstUrl : null);

  return (
    <article
      className="
        w-full md:w-[90%] max-w-[520px]
        h-[70vh]
        rounded-2xl border bg-white shadow-sm hover:shadow-md
        transition-transform duration-300 hover:scale-[1.01]
        p-6 flex flex-col cursor-pointer select-none
      "
      onClick={() => setFlipped(v => !v)}
      role="button"
      aria-pressed={flipped}
      title="Нажмите, чтобы перевернуть"
    >
      {/* Контент со скроллом, чтобы длинный текст оставался внутри */}
      <div className="flex-1 overflow-y-auto pr-2">
        {!flipped ? (
          <>
            <div className="text-base md:text-sm sm:text-xs leading-tight font-medium text-gray-900 whitespace-pre-line break-words">
              {front}
            </div>

            {/* Картинка под вопросом — если есть */}
            {showImage && (
              <img
                src={showImage}
                alt=""
                className="mt-4 mx-auto max-h-[28vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Если в тексте была ссылка, но это не картинка — сделаем её кликабельной под текстом */}
            {firstUrl && !canInlineImage && (
              <a
                href={firstUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-xs text-blue-600 underline break-all"
                onClick={(e) => e.stopPropagation()}
              >
                {firstUrl}
              </a>
            )}
          </>
        ) : (
          <div className="text-base md:text-sm sm:text-xs leading-tight font-medium text-gray-900 whitespace-pre-line break-words">
            {back || '—'}
          </div>
        )}
      </div>

      <div className="pt-3 text-xs text-gray-500 text-center">
        {flipped ? 'Нажмите, чтобы вернуть вопрос' : 'Нажмите, чтобы перевернуть'}
      </div>
    </article>
  );
}
