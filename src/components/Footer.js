export default function Footer() {
  return (
    <footer className="bg-hemp-800 border-t border-cream/10 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-hemp-100/70">
        <p className="font-serif text-cream">Bhangro 🌿</p>
        <p>&copy; {new Date().getFullYear()} Bhangro. Handmade in Nepal.</p>
      </div>
    </footer>
  );
}