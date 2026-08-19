/* Interim homepage. Iteration 9 of plan.md replaces this with the real
 * Anasayfa (hero, kategoriler, öne çıkanlar, hizmetler, hakkımızda, iletişim).
 * It exists now only so `/` is not the create-next-app template. */

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col justify-center bg-charcoal px-6 py-24">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-label uppercase text-gold-soft">
            2000&apos;den beri · Kapaklı
          </p>
          <h1 className="mt-5 display-lg text-cream">
            Trakya Kapaklı
            <br />
            <span className="text-gold-soft">Kuyumculuk</span>
          </h1>
          <div className="mt-6 h-px w-11 bg-gold" />
          <p className="mt-6 max-w-md text-cream/70">
            Altın, pırlanta ve özel tasarım takılar. Yeni web sitemiz yapım
            aşamasında.
          </p>
        </div>
      </section>
    </main>
  );
}
