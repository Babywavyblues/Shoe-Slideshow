export type DriveItem = {
  id: string;
  name: string;
  mimeType?: string;
};

export type Photo = {
  id: string;
  name: string;
  url: string;
};

export type Process = {
  id: string;
  name: string;
  photos: Photo[];
};

export type ShoeModel = {
  id: string;
  name: string;
  processes: Process[];
};

export const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
export const IMAGE_MIME_PREFIX = 'image/';

export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, {
    numeric: true,
    sensitivity: 'base'
  }));
}

export function buildCatalog(
  modelFolders: DriveItem[],
  processByModel: Map<string, DriveItem[]>,
  filesByProcess: Map<string, DriveItem[]>
): ShoeModel[] {
  return sortByName(modelFolders).map((model) => ({
    id: model.id,
    name: model.name,
    processes: sortByName(processByModel.get(model.id) ?? []).map((process) => ({
      id: process.id,
      name: process.name,
      photos: sortByName(filesByProcess.get(process.id) ?? [])
        .filter((file) => file.mimeType?.startsWith(IMAGE_MIME_PREFIX))
        .map((file) => ({
          id: file.id,
          name: file.name,
          url: `https://drive.google.com/uc?export=view&id=${file.id}`
        }))
    }))
  }));
}

export function escapeDriveQuery(value: string): string {
  return value.replace(/'/g, "\\'");
}
