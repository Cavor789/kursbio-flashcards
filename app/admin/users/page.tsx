export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Список пользователей</h2>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              ➕ Добавить пользователя
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              📊 Экспорт в CSV
            </button>
          </div>
        </div>
        
        {/* Таблица пользователей */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">ID</th>
                <th className="p-3 text-left text-sm font-semibold">Email</th>
                <th className="p-3 text-left text-sm font-semibold">Имя</th>
                <th className="p-3 text-left text-sm font-semibold">Телефон</th>
                <th className="p-3 text-left text-sm font-semibold">Дата регистрации</th>
                <th className="p-3 text-left text-sm font-semibold">Статус</th>
                <th className="p-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">1</td>
                <td className="p-3">student@example.com</td>
                <td className="p-3">Иван Петров</td>
                <td className="p-3">+7 (900) 123-45-67</td>
                <td className="p-3">15.01.2024</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Активен
                  </span>
                </td>
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
                <td className="p-3">+7 (911) 987-65-43</td>
                <td className="p-3">20.01.2024</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Активен
                  </span>
                </td>
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
                <td className="p-3">3</td>
                <td className="p-3">admin@kursbio.ru</td>
                <td className="p-3">Алексей Иванов</td>
                <td className="p-3">+7 (999) 555-44-33</td>
                <td className="p-3">10.01.2024</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Администратор
                  </span>
                </td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 mr-2">
                    Редактировать
                  </button>
                  <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600" disabled>
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
          <span>Всего пользователей: 3</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">← Назад</button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">1</span>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Вперед →</button>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Всего пользователей</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Активных</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Администраторов</h3>
          <p className="text-3xl font-bold text-purple-600">1</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Новых за месяц</h3>
          <p className="text-3xl font-bold text-orange-600">3</p>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Поиск пользователей</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Поиск по email или имени..."
            className="p-2 border rounded"
          />
          <input 
            type="text" 
            placeholder="Номер телефона..."
            className="p-2 border rounded"
          />
          <select className="p-2 border rounded">
            <option value="">Все статусы</option>
            <option value="active">Активен</option>
            <option value="admin">Администратор</option>
            <option value="inactive">Неактивен</option>
          </select>
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            🔍 Найти
          </button>
        </div>
      </div>
    </div>
  );
}
