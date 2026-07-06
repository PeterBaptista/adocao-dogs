import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

// Public: capture an adoption-interest submission from the landing page.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    puppyId?: string
    puppyName?: string
    name?: string
    city?: string
  } | null

  if (!body?.puppyName) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const trim = (v?: string) => {
    const t = v?.trim()
    return t ? t.slice(0, 200) : null
  }

  const [lead] = await db
    .insert(leads)
    .values({
      puppyId: trim(body.puppyId),
      puppyName: body.puppyName.trim().slice(0, 200),
      name: trim(body.name),
      city: trim(body.city),
    })
    .returning()

  return NextResponse.json(lead, { status: 201 })
}

// Admin only: list submissions, newest first.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt))
  return NextResponse.json(rows)
}
