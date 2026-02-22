import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon> | null = null

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Please add the Neon integration in the sidebar."
      )
    }
    _sql = neon(url)
  }
  return _sql(strings, ...values)
}
