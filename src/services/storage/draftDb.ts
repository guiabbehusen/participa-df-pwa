import Dexie, { type Table } from 'dexie'
import type { ManifestationFormData } from '../../features/manifestation/types/manifestation'

type DraftRecord = {
  id: 'new_manifestation'
  updatedAt: string
  data: Partial<Omit<ManifestationFormData, 'audioFile' | 'imageFile' | 'videoFile'>>
}

class DraftDatabase extends Dexie {
  drafts!: Table<DraftRecord, DraftRecord['id']>

  constructor() {
    super('participa_df_drafts')
    this.version(1).stores({
      drafts: 'id, updatedAt',
    })
  }
}

const db = new DraftDatabase()

export async function saveNewManifestationDraft(
  data: DraftRecord['data'],
): Promise<void> {
  await db.drafts.put({
    id: 'new_manifestation',
    updatedAt: new Date().toISOString(),
    data,
  })
}

export async function loadNewManifestationDraft(): Promise<DraftRecord['data'] | null> {
  const record = await db.drafts.get('new_manifestation')
  return record?.data ?? null
}

export async function clearNewManifestationDraft(): Promise<void> {
  await db.drafts.delete('new_manifestation')
}
