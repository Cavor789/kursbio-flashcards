export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Список пользователей</h2>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            📊 Экспорт в CSV
          </button>
        </div>
        
        {/* Таблица пользователей */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">ID</th>
                <th className="p-3 text-left text-sm font-semibold">Email</th>
                <th className="p-3 text-left text-sm font-semibold">Имя</th>
                <th className="p-3 text-left text-sm font-semibold">Дата регистрации</th>
                <th className="p-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">1</td>
                <td className="p-3">student@example.com</td>
                <td className="p-3">Иван Петров</td>
                <td className="p-3">2024-01-15</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 mr-2">
                    Редактировать
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                    Удалить
                  </button>
                </td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">2</td>
                <td className="p-3">teacher@example.com</td>
                <td className="p-3">Мария Сидорова</td>
                <td className="p-3">2024-01-20</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 mr-2">
                    Редактировать
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Всего пользователей: 2
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Активных пользователей</h3>
          <p className="text-3xl font-bold text-green-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Новых за месяц</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Избранных карточек</h3>
          <p className="text-3xl font-bold text-purple-600">15</p>
        </div>
      </div>
    </div>
  );
}
