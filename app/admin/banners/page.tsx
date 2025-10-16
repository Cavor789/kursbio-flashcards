export default function AdminBannersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление баннерами</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Тематические баннеры</h2>
          <p className="text-gray-600 mb-4">
            Настройте баннеры для разных разделов биологии
          </p>
          <div className="space-y-3">
            {[
              { name: 'Общая биология', theme: 'general-biology' },
              { name: 'Ботаника', theme: 'botany' },
              { name: 'Зоология', theme: 'zoology' },
              { name: 'Анатомия', theme: 'anatomy' }
            ].map((section) => (
              <div key={section.theme} className="flex justify-between items-center p-3 border rounded-lg">
                <span>{section.name}</span>
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Настроить
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Добавить баннер</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Изображение</label>
              <input type="file" className="w-full p-2 border rounded" accept="image/*" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тема</label>
              <select className="w-full p-2 border rounded">
                <option value="">Выберите тему</option>
                <option value="general-biology">Общая биология</option>
                <option value="botany">Ботаника</option>
                <option value="zoology">Зоология</option>
                <option value="anatomy">Анатомия</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Загрузить баннер
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
