import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }

  return <AdminDashboard username={session.username} />
}
