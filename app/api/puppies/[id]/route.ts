import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { puppies } from "@/lib/db/schema"
import { PUPPY_STATUSES, type PuppyStatus } from "@/lib/puppies"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json().catch(() => null)) as { status?: string } | null
  const status = body?.status

  if (!status || !PUPPY_STATUSES.includes(status as PuppyStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 })
  }

  const [updated] = await db
    .update(puppies)
    .set({ status: status as PuppyStatus })
    .where(eq(puppies.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Filhote não encontrado" }, { status: 404 })
  }

  return NextResponse.json(updated)
}
