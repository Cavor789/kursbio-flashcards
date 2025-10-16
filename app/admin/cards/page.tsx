export default function AdminCardsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление карточками</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Добавить карточку</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Вопрос</label>
            <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="Введите вопрос..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ответ</label>
            <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="Введите ответ..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Тема</label>
            <select className="w-full p-2 border rounded">
              <option value="general-biology">Общая биология</option>
              <option value="botany">Ботаника</option>
              <option value="zoology">Зоология</option>
              <option value="anatomy">Анатомия</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Создать карточку
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Все карточки</h2>
        <p className="text-gray-600">Здесь будет список всех карточек для редактирования</p>
      </div>
    </div>
  );
}// app/admin/cards/page.tsx
