export default function AdminBannersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление баннерами</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Тематические баннеры</h2>
        <p className="text-gray-600 mb-4">
          Настройте баннеры для разных разделов: Общая биология, Ботаника, Зоология, Анатомия
        </p>
        <div className="space-y-4">
          {['Общая биология', 'Ботаника', 'Зоология', 'Анатомия'].map((topic) => (
            <div key={topic} className="flex items-center justify-between p-3 border rounded-lg">
              <span>{topic}</span>
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Настроить
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Загрузить новый баннер</h2>
        <div className="space-y-4">
          <input 
            type="file" 
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          <select className="w-full p-2 border rounded">
            <option value="">Выберите тему</option>
            <option value="general-biology">Общая биология</option>
            <option value="botany">Ботаника</option>
            <option value="zoology">Зоология</option>
            <option value="anatomy">Анатомия</option>
          </select>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Загрузить баннер
          </button>
        </div>
      </div>
    </div>
  );
}