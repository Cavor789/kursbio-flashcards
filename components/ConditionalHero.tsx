'use client';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default function ConditionalHero({ children }: PropsWithChildren) {
  const pathname = usePathname();
  // показываем баннер только на /biology/chemistry
  return pathname === '/biology/chemistry' ? <>{children}</> : null;
}
