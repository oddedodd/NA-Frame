import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6 text-center sm:text-left">
        Velkommen til NA Kreativ Frame
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-10 text-center sm:text-left">
        Oppdag kreative prosjekter og inspirasjon!
      </p>
      <a
        href="/widgets/tntcarousel"
        className="inline-block rounded-full bg-black px-6 py-3 text-white font-medium text-base shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Se karusell-widget
      </a>
      </main>
    </div>
  );
}
