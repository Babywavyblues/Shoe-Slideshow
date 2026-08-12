import { buildCatalog, type DriveItem, FOLDER_MIME_TYPE } from './catalog';

const DRIVE_FILES_API = 'https://www.googleapis.com/drive/v3/files';

type DriveApiResponse = { files?: DriveItem[]; error?: { message?: string } };

async function listDriveFiles(parentId: string, apiKey: string): Promise<DriveItem[]> {
  const query = new URLSearchParams({
    key: apiKey,
    q: `'${parentId.replace(/'/g, "\\'")}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType)',
    pageSize: '1000',
    orderBy: 'name_natural'
  });
  const response = await fetch(`${DRIVE_FILES_API}?${query}`, {
    next: { revalidate: 60 }
  });
  const data = (await response.json()) as DriveApiResponse;
  if (!response.ok) throw new Error(data.error?.message ?? 'Google Drive tidak dapat dibaca.');
  return data.files ?? [];
}

export async function getDriveCatalog() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!apiKey || !rootFolderId) {
    throw new Error('Environment Variable Google Drive belum lengkap di Vercel.');
  }

  const rootItems = await listDriveFiles(rootFolderId, apiKey);
  const models = rootItems.filter((item) => item.mimeType === FOLDER_MIME_TYPE);
  const processLists = await Promise.all(models.map(async (model) => [
    model.id,
    (await listDriveFiles(model.id, apiKey)).filter((item) => item.mimeType === FOLDER_MIME_TYPE)
  ] as const));

  const processByModel = new Map(processLists);
  const allProcesses = processLists.flatMap(([, processes]) => processes);
  const photoLists = await Promise.all(allProcesses.map(async (process) => [
    process.id,
    await listDriveFiles(process.id, apiKey)
  ] as const));

  return buildCatalog(models, processByModel, new Map(photoLists));
}
