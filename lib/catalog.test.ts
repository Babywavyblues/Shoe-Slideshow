import { describe, expect, it } from 'vitest';
import { buildCatalog, sortByName } from './catalog';

describe('sortByName', () => {
  it('mengurutkan file sesuai nama tanpa membedakan kapital', () => {
    expect(sortByName([{ name: '10.jpg' }, { name: '02.jpg' }, { name: 'a.jpg' }]))
      .toEqual([{ name: '02.jpg' }, { name: '10.jpg' }, { name: 'a.jpg' }]);
  });
});

describe('buildCatalog', () => {
  it('membentuk model, proses, dan foto dari file Drive bertingkat', () => {
    const catalog = buildCatalog(
      [{ id: 'model-1', name: 'Revel 9' }],
      new Map([['model-1', [{ id: 'oven-2', name: 'Oven 2' }, { id: 'oven-1', name: 'Oven 1' }]]]),
      new Map([['oven-1', [
        { id: 'photo-2', name: '02-Proses.jpg', mimeType: 'image/jpeg' },
        { id: 'photo-1', name: '01-Pemanasan.jpg', mimeType: 'image/jpeg' },
        { id: 'note', name: 'catatan.pdf', mimeType: 'application/pdf' }
      ]]])
    );

    expect(catalog).toEqual([{ id: 'model-1', name: 'Revel 9', processes: [
      { id: 'oven-1', name: 'Oven 1', photos: [
        { id: 'photo-1', name: '01-Pemanasan.jpg', url: 'https://drive.google.com/uc?export=view&id=photo-1' },
        { id: 'photo-2', name: '02-Proses.jpg', url: 'https://drive.google.com/uc?export=view&id=photo-2' }
      ] },
      { id: 'oven-2', name: 'Oven 2', photos: [] }
    ] }]);
  });
});
