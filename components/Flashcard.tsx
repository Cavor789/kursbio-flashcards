// components/FlipCard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  front: string | null;
  back: string | null;
  image_url?: string | null;
};

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

export default function FlipCard({ front, back, image_url }: Props) {
  const [flipped, setFlipped] = useState(false);

  // авто-возврат через 10 секунд
  useEffect(() => {
    if (!flipped) return;
    const t = setTimeout(() => setFlipped(false), 10000);
    return () => clearTimeout(t);
  }, [flipped]);

  // первая ссылка в тексте — если это картинка, покажем под текстом
  const firstUrl = useMemo(() => {
    const m = (front || '').match(/https?:\/\/\S+/);
    return m?.[0] ?? null;
  }, [front]);

  const canInlineImage = useMemo(() => {
    if (image_url) return false;
    if (!firstUrl) return false;
    try {
      const u = new URL(firstUrl);
      return IMG_EXT.test(u.pathname || '');
    } catch {
      return false;
    }
  }, [firstUrl, image_url]);

  const showImage = image_url || (canInlineImage ? firstUrl : null);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="w-full md:w-[90%] max-w-[520px] h-[70vh]">
      <article
        className={`relative h-full cursor-pointer rounded-2xl bg-white border
                    shadow-[0_6px_20px_rgba(0,0,0,0.08)]
                    [transform-style:preserve-3d] transition-transform duration-500
                    ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={() => setFlipped(v => !v)}
        role="button"
        aria-pressed={flipped}
        title={flipped ? 'Нажмите, чтобы вернуть вопрос' : 'Нажмите, чтобы перевернуть'}
      >
        {/* FRONT */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden]">
          <div className="h-full flex flex-col gap-3 pt-6">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="font-medium text-base md:text-sm text-gray-800 leading-tight whitespace-pre-line break-words">
                {front}
              </div>

              {showImage && (
                <img
                  src={showImage}
                  alt=""
                  className="mt-3 mx-auto max-h-[28vh] object-contain rounded-lg"
                  onClick={stop}
                />
              )}

              {firstUrl && !canInlineImage && (
                <a
                  href={firstUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-blue-600 underline break-all"
                  onClick={stop}
                >
                  {firstUrl}
                </a>
              )}
            </div>

            <div className="text-xs text-gray-500 text-center">Нажмите, чтобы перевернуть</div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full flex flex-col gap-3 pt-6">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="text-gray-800 text-base md:text-sm leading-tight whitespace-pre-line break-words text-center">
                {back || '—'}
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center">Нажмите, чтобы вернуть вопрос</div>
          </div>
        </div>
      </article>
    </div>
  );
}
