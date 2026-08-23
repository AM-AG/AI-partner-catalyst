import { Theme } from '@/types/types'

type AffiliationProps = {
  theme: Theme;
};


export const Affiliation = ({ theme }: AffiliationProps) => {

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
          About Voxpact Affiliation program. Join Us.
        </p>

      </div>
    </section>
  );
}
