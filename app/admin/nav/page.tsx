export default function AdminNavPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление навигацией</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Основное меню</h2>
        <div className="space-y-3">
          {[
            { name: 'Карточки', path: '/decks', enabled: true },
            { name: 'Избранное', path: '/favorites', enabled: true },
            { name: 'Годовой курс', path: '/course', enabled: true },
            { name: 'Конспекты', path: '/notes', enabled: true }
          ].map((item) => (
            <div key={item.path} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 text-sm ml-2">{item.path}</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked={item.enabled} />
                  <div className={`w-10 h-6 ${item.enabled ? 'bg-green-500' : 'bg-gray-300'} rounded-full transition-colors`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${item.enabled ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}// app/admin/nav/page.tsx
