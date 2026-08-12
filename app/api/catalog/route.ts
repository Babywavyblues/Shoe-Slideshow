import { NextResponse } from 'next/server';
import { getDriveCatalog } from '../../../lib/drive';

export const revalidate = 60;

export async function GET() {
  try {
    const models = await getDriveCatalog();
    return NextResponse.json({ models }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil foto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
