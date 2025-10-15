'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import React from 'react';

// 💡 ВАЖНО: Вставь СВОЙ JSX баннера в место, отмеченное /* HERO */ ниже.

export default function BiologyLayout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  // segments:
  //  []                         -> /biology (если есть index)
  //  ["chemistry"]              -> /biology/chemistry
  //  ["chemistry", "<slug>"]    -> /biology/chemistry/[slug]

  const isChemistryRoot = segments.length === 1 && segments[0] === 'chemistry';
  const showHero = isChemistryRoot; // показываем баннер только на /biology/chemistry

  return (
    <>
      {showHero ? (
        /* HERO */ (
          // 👉 СЮДА ВСТАВЬ твой фиолетовый баннер (ровно тот JSX, что был раньше).
          // Например: <SubjectHero subject="Химический состав клетки" />
          <></>
        )
      ) : null}

      {children}
    </>
  );
}
