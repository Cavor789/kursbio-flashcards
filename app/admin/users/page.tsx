export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Список пользователей</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Экспорт в CSV
          </button>
        </div>
        
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">1</td>
                <td className="p-3">user@example.com</td>
                <td className="p-3">2024-01-15</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Всего пользователей: 1
        </div>
      </div>
    </div>
  );
}// app/admin/users/page.tsx
