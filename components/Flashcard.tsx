// components/Flashcard.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  front: string | null;
  back: string | null;
  image_url?: string | null;
};

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

export default function Flashcard({ front, back, image_url }: Props) {
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef<number | null>(null);

  // авто-возврат через 10 секунд после переворота
  useEffect(() => {
    if (flipped) {
      timerRef.current && window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setFlipped(false), 10000);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [flipped]);

  // выцепим первую ссылку — если это картинка, покажем под текстом
  const firstUrl = useMemo(() => {
    const m = (front || '').match(/https?:\/\/\S+/);
    return m?.[0] ?? null;
  }, [front]);

  const canInlineImage =
    !image_url && firstUrl && (() => {
      try {
        const u = new URL(firstUrl);
        return IMG_EXT.test(u.pathname || '');
      } catch {
        return false;
      }
    })();

  const showImage = image_url || (canInlineImage ? firstUrl : null);

  // остановить переворот, если пользователь скроллит внутри карточки/жмёт на ссылку/картинку
  function stopProp(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="flashcard-wrapper">
      <article
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(v => !v)}
        role="button"
        aria-pressed={flipped}
        title={flipped ? 'Нажмите, чтобы вернуть вопрос' : 'Нажмите, чтобы перевернуть'}
      >
        <div className="face front">
          <div className="inner scrollable" onClick={stopProp}>
            <div className="t-text">{front}</div>

            {showImage && (
              <img
                src={showImage}
                alt=""
                className="t-image"
                onClick={stopProp}
              />
            )}

            {firstUrl && !canInlineImage && (
              <a
                href={firstUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-link"
                onClick={stopProp}
              >
                {firstUrl}
              </a>
            )}
          </div>
          <div className="hint">Нажмите, чтобы перевернуть</div>
        </div>

        <div className="face back">
          <div className="inner scrollable" onClick={stopProp}>
            <div className="t-text">{back || '—'}</div>
          </div>
          <div className="hint">Нажмите, чтобы вернуть вопрос</div>
        </div>
      </article>

      {/* Стили flip-анимации и вёрстки карточки */}
      <style jsx>{`
        .flashcard-wrapper {
          width: 100%;
          max-width: 520px;
          height: 70vh;
        }
        .flashcard {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .flashcard:hover {
          transform: scale(1.01);
        }
        .flashcard.flipped {
          transform: rotateY(180deg);
        }
        .face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .back {
          transform: rotateY(180deg);
        }
        .inner.scrollable {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .t-text {
          white-space: pre-line;
          word-break: break-word;
          font-size: 1rem;
          line-height: 1.35;
          color: #111827;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .t-text { font-size: 0.95rem; }
        }
        .t-image {
          margin-top: 1rem;
          max-height: 28vh;
          object-fit: contain;
          border-radius: 0.5rem;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .t-link {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #2563eb;
          text-decoration: underline;
          word-break: break-all;
        }
        .hint {
          text-align: center;
          color: #6b7280;
          font-size: 0.75rem;
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
