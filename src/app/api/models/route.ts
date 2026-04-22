import { PUBLIC_CATALOG } from '@/lib/catalog';

export async function GET() {
  return Response.json(PUBLIC_CATALOG);
}
