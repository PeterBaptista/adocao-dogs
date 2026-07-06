import { NextResponse } from "next/server"
import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { puppies } from "@/lib/db/schema"

export async function GET() {
  const rows = await db.select().from(puppies).orderBy(asc(puppies.sortOrder))
  return NextResponse.json(rows)
}
