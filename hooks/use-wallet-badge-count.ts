'use client';

import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useCallback, useEffect, useState } from 'react';
import { fetchUserBadgeCount } from '@/lib/contracts/sui-read';
import { suiContractsConfigured } from '@/lib/contracts/sui-config';

export function useWalletBadgeCount() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const address = account?.address;
  const configured = suiContractsConfigured();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address || !configured) {
      setCount(0);
      return 0;
    }
    setLoading(true);
    try {
      const n = await fetchUserBadgeCount(client, address);
      setCount(n);
      return n;
    } catch {
      setCount(0);
      return 0;
    } finally {
      setLoading(false);
    }
  }, [address, client, configured]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    connected: Boolean(address),
    configured,
    count,
    loading,
    refresh,
  };
}
