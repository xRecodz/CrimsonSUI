'use client';

import { Github, Twitter, Mail, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { BRAND_NAME, BRAND_DESCRIPTION, SITE_CONTACT } from '@/lib/brand';

const platformLinks = [
  { label: 'Quests', href: '/quests' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'FAQ', href: '/#faq' },
] as const;

const mailtoHref = `mailto:${SITE_CONTACT.email}`;

const contactIcons = [
  { icon: Github, label: 'GitHub', href: SITE_CONTACT.github },
  { icon: Twitter, label: 'Twitter', href: SITE_CONTACT.twitter },
  { icon: Mail, label: 'Email', href: mailtoHref },
] as const;

const iconLinkClass =
  'inline-flex rounded-lg border border-white/10 p-2 text-gray-400 transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent';

function ContactIconLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  const isMail = href.startsWith('mailto:');
  return (
    <a
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      aria-label={label}
      className={iconLinkClass}
    >
      <Icon className="h-[18px] w-[18px]" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-10 sm:gap-y-6">
          <div className="min-w-0 max-w-sm">
            <p className="text-base font-bold text-white">{BRAND_NAME}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {BRAND_DESCRIPTION}
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Platform
            </p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </p>
            <div className="flex items-center gap-2.5">
              {contactIcons.map((item) => (
                <ContactIconLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-7 border-t border-white/10 pt-5 text-xs text-gray-500 sm:text-sm">
          © {new Date().getFullYear()} {BRAND_NAME}, Built on Sui.
        </p>
      </div>
    </footer>
  );
}
