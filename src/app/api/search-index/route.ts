import { getSearchDocuments } from '@/lib/postContent'

export const revalidate = 3600

export async function GET() {
  const documents = await getSearchDocuments()
  return Response.json(documents, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
