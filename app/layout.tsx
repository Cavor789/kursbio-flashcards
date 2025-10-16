export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen p-6">
          <h2 className="text-xl font-bold mb-6">Админпанель</h2>
          <nav className="space-y-2">
            <a href="/admin/cards" className="block py-2 px-4 hover:bg-gray-100 rounded">
              Карточки
            </a>
            <a href="/admin/users" className="block py-2 px-4 hover:bg-gray-100 rounded">
              Пользователи
            </a>
            <a href="/admin/banners" className="block py-2 px-4 hover:bg-gray-100 rounded">
              Баннеры
            </a>
            <a href="/admin/nav" className="block py-2 px-4 hover:bg-gray-100 rounded">
              Навигация
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}// app/layout.tsx
