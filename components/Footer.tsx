export default function Footer(){
  return (
    <footer className="mt-10 bg-gradient-to-r from-brand to-indigo-400 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-white/90 text-sm">© Kursbio, 2025</div>
        <div className="flex gap-3 text-sm">
          <a className="text-white/90 hover:text-white" href="#">Политика</a>
          <a className="text-white/90 hover:text-white" href="#">Контакты</a>
        </div>
      </div>
    </footer>
  )
}
