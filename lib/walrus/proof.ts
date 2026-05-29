import type { UserQuestProgress, WalrusProofRecord } from '@/lib/quest-types';
import { walrusBlobUrl } from './client';

/** True if blob id looks like a real Walrus blob (not local fallback). */
export function isWalrusBlobId(id: string): boolean {
  return Boolean(id) && !id.startsWith('bafyquest');
}

export function getWalrusProofs(progress: UserQuestProgress): WalrusProofRecord[] {
  if (progress.walrusProofs?.length) {
    return progress.walrusProofs.filter((p) => isWalrusBlobId(p.blobId));
  }
  return progress.ipfsProofCids
    .filter(isWalrusBlobId)
    .map((blobId) => ({
      blobId,
      gatewayUrl: walrusBlobUrl(blobId),
      storedAt: progress.updatedAt,
    }));
}

export function getProofForQuest(
  progress: UserQuestProgress,
  questId: string,
): WalrusProofRecord | undefined {
  return getWalrusProofs(progress).find((p) => p.questId === questId);
}

export function appendWalrusProof(
  progress: UserQuestProgress,
  proof: Omit<WalrusProofRecord, 'storedAt'> & { storedAt?: string },
): UserQuestProgress {
  const record: WalrusProofRecord = {
    ...proof,
    gatewayUrl: proof.gatewayUrl ?? walrusBlobUrl(proof.blobId),
    storedAt: proof.storedAt ?? new Date().toISOString(),
  };

  if (!isWalrusBlobId(record.blobId)) {
    return {
      ...progress,
      ipfsProofCids: [...progress.ipfsProofCids, record.blobId],
    };
  }

  const existing = progress.walrusProofs ?? [];
  const withoutDup = existing.filter(
    (p) => p.blobId !== record.blobId && p.questId !== record.questId,
  );

  return {
    ...progress,
    walrusProofs: [...withoutDup, record],
    ipfsProofCids: [...progress.ipfsProofCids, record.blobId],
  };
}
