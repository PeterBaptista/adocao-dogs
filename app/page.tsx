import { asc } from "drizzle-orm"
import { PawBackground } from "@/components/paw-background"
import { Hero } from "@/components/hero"
import { PuppyGrid } from "@/components/puppy-grid"
import { ContactFooter } from "@/components/contact-footer"
import { db } from "@/lib/db"
import { puppies as puppiesTable } from "@/lib/db/schema"
import { puppies as staticPuppies, type Puppy } from "@/lib/puppies"

export const dynamic = "force-dynamic"

async function getPuppies(): Promise<Puppy[]> {
  try {
    const rows = await db.select().from(puppiesTable).orderBy(asc(puppiesTable.sortOrder))
    // `sex` is stored as text; the seed only ever writes valid Sex values.
    if (rows.length > 0) return rows as Puppy[]
  } catch {
    // DB unreachable — fall back to static seed data so the site never hard-fails.
  }
  return staticPuppies.map((p) => ({ ...p, status: "disponivel" as const }))
}

export default async function Page() {
  const puppies = await getPuppies()

  return (
    <main className="relative min-h-dvh bg-background">
      <PawBackground />
      <div className="relative">
        <Hero />
        <PuppyGrid puppies={puppies} />
        <ContactFooter />
      </div>
    </main>
  )
}
