/**
 * Hackathon / competitive season window.
 * Set NEXT_PUBLIC_SEASON_START + NEXT_PUBLIC_SEASON_END (UTC ISO) when running a timed event.
 * If either is missing, the season is treated as always open (local dev).
 */

export type SeasonStatus = {
  active: boolean;
  configured: boolean;
  startAt: Date | null;
  endAt: Date | null;
  daysRemaining: number | null;
  message: string;
};

function parseSeasonDate(raw: string | undefined): Date | null {
  if (!raw?.trim()) return null;
  const d = new Date(raw.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getSeasonStatus(now = new Date()): SeasonStatus {
  const startAt = parseSeasonDate(process.env.NEXT_PUBLIC_SEASON_START);
  const endAt = parseSeasonDate(process.env.NEXT_PUBLIC_SEASON_END);
  const configured = !!(startAt && endAt);

  if (!configured) {
    return {
      active: true,
      configured: false,
      startAt: null,
      endAt: null,
      daysRemaining: null,
      message: 'Season open — configure dates when the hackathon starts.',
    };
  }

  if (now < startAt!) {
    const daysUntil = Math.ceil(
      (startAt!.getTime() - now.getTime()) / 86_400_000,
    );
    return {
      active: false,
      configured: true,
      startAt,
      endAt,
      daysRemaining: null,
      message: `Season starts in ${daysUntil} day${daysUntil === 1 ? '' : 's'}.`,
    };
  }

  if (now > endAt!) {
    return {
      active: false,
      configured: true,
      startAt,
      endAt,
      daysRemaining: 0,
      message: 'Season ended. Bonus quest is closed.',
    };
  }

  const daysRemaining = Math.max(
    0,
    Math.ceil((endAt!.getTime() - now.getTime()) / 86_400_000),
  );

  return {
    active: true,
    configured: true,
    startAt,
    endAt,
    daysRemaining,
    message: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in season.`,
  };
}

export function formatSeasonRange(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return `${fmt.format(start)} – ${fmt.format(end)} UTC`;
}
