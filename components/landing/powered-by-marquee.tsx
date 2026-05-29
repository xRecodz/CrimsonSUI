'use client';

/** Edit running text here */
export const POWERED_BY_MARQUEE =
  '· SUI · WALRUS · TATUM · WEB3 · DEFI ·';

export function PoweredByMarquee() {
  return (
    <section
      className="border-y border-white/10 py-5"
      aria-label={`Powered by ${POWERED_BY_MARQUEE}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
          Powered by
        </p>

        <div className="w-full max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="powered-by-track">
            <span className="shrink-0 pr-12 text-base font-semibold uppercase tracking-[0.15em] text-white sm:pr-16 sm:text-lg">
              {POWERED_BY_MARQUEE}
            </span>
            <span
              className="shrink-0 pr-12 text-base font-semibold uppercase tracking-[0.15em] text-white sm:pr-16 sm:text-lg"
              aria-hidden
            >
              {POWERED_BY_MARQUEE}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
