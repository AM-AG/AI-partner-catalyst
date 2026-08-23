import { Theme } from '@/types/types'


type AboutProps = {
  theme: Theme;
};

export const About = ({ theme }: AboutProps) => {

  const isDark = theme;

  const cardTheme = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-black/10 bg-white/70';

  const mutedText = isDark
    ? 'text-[#C5C6C7]/70'
    : 'text-[#1F2833]/70';

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 py-10 sm:py-16">
      {/* Hero */}
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-[#66FCF1]">
          About Voxpact
        </p>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Building better conversations through technology.
        </h1>

        <p className={`mt-6 max-w-2xl text-lg leading-8 ${mutedText}`}>
          Voxpact creates tools that make communication simpler,
          more accessible, and more meaningful.
        </p>
      </div>

      {/* Information cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <article
          className={`rounded-3xl border p-7 backdrop-blur-md ${cardTheme}`}
        >
          <h2 className="text-xl font-bold">Our mission</h2>

          <p className={`mt-4 leading-7 ${mutedText}`}>
            Create communication experiences that are useful,
            approachable, and built around real people.
          </p>
        </article>

        <article
          className={`rounded-3xl border p-7 backdrop-blur-md ${cardTheme}`}
        >
          <h2 className="text-xl font-bold">Our vision</h2>

          <p className={`mt-4 leading-7 ${mutedText}`}>
            Help people and teams communicate with greater clarity
            and confidence.
          </p>
        </article>

        <article
          className={`rounded-3xl border p-7 backdrop-blur-md ${cardTheme}`}
        >
          <h2 className="text-xl font-bold">Our values</h2>

          <p className={`mt-4 leading-7 ${mutedText}`}>
            We value simplicity, accessibility, thoughtful design,
            and continuous improvement.
          </p>
        </article>
      </div>
    </section>
  );
}
