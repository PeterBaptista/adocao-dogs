import "dotenv/config"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { puppies as puppiesTable } from "@/lib/db/schema"
import { puppies as seedPuppies } from "@/lib/puppies"

async function seedPuppyRows() {
  for (const [index, p] of seedPuppies.entries()) {
    await db
      .insert(puppiesTable)
      .values({
        id: p.id,
        name: p.name,
        sex: p.sex,
        birth: p.birth,
        image: p.image,
        blurb: p.blurb,
        status: "disponivel",
        sortOrder: index,
      })
      // Idempotent: keep the existing status, just refresh content + order.
      .onConflictDoUpdate({
        target: puppiesTable.id,
        set: {
          name: p.name,
          sex: p.sex,
          birth: p.birth,
          image: p.image,
          blurb: p.blurb,
          sortOrder: index,
        },
      })
  }
  console.log(`✓ Seeded ${seedPuppies.length} puppies`)
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.warn("⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin creation")
    return
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: "Admin" },
    })
    console.log(`✓ Created admin user: ${email}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/exist/i.test(message)) {
      console.log(`• Admin user already exists: ${email}`)
    } else {
      throw err
    }
  }
}

async function main() {
  await seedPuppyRows()
  await seedAdmin()
  console.log("Seed complete.")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
