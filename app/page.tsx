export default function Home() {
  if (typeof window !== 'undefined') {
    window.location.replace('/cards'); // отправим посетителя в раздел карточек
  }
  return null;
}
