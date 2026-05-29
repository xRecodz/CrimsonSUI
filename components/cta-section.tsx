'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Particles from '@/components/react-bits/particles';
import FadeContent from '@/components/react-bits/fade-content';
import BlurText from '@/components/react-bits/blur-text';
import ShinyText from '@/components/react-bits/shiny-text';
import Magnet from '@/components/react-bits/magnet';
import { ConnectWalletButton } from '@/components/connect-wallet-button';

export function CTASection() {
  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 opacity-40">
        <Particles
          particleColors={['#ff0000', '#660000', '#ffffff']}
          particleCount={160}
          particleSpread={8}
          speed={0.05}
          particleBaseSize={60}
          alphaParticles
          moveParticlesOnHover={false}
          className="absolute inset-0"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-accent/20 blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <FadeContent>
          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <BlurText
              as="span"
              text="Ready to Start Your"
              className="justify-center block"
              delay={40}
            />
            <span className="block mt-2">
              <ShinyText
                text="DeFi Journey?"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                color="#ffffff"
                shineColor="#ff0000"
              />
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Connect your wallet, start your first quest, and turn every lesson
            into XP, badges, and verifiable onchain progress.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnet magnetStrength={2.5}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <ConnectWalletButton variant="cta" label="Connect Wallet" />
              </motion.div>
            </Magnet>
            <Magnet magnetStrength={2.5}>
              <Link
                href="/quests"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-lg border border-white/20 hover:border-accent hover:text-accent transition-all duration-300 hover:bg-accent/5"
              >
                Explore Quests
              </Link>
            </Magnet>
          </div>

          <motion.p
            className="mt-5 text-xs text-gray-500 sm:text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Secure • Non-custodial • Fully on-chain verified
          </motion.p>
        </FadeContent>
      </div>
    </section>
  );
}
