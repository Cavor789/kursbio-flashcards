"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TopNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Главная", href: "/" },
    { label: "Карточки", href: "/cards" },
    { label: "Словарь", href: "/dictionary" },
    { label: "Тесты", href: "/tests" },
    { label: "О нас", href: "/about" },
  ];

  return (
    <nav className="flex gap-4 border-b px-6 py-3 text-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors hover:text-blue-600 ${
            pathname === item.href ? "font-semibold text-blue-600" : "text-gray-700"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default TopNav;
