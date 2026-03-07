import type { Metadata } from "next"
import { AdminImport } from "@/components/admin-import"

export const metadata: Metadata = {
  title: "Importar vocabulario | Hanzi Admin",
}

export default function AdminImportPage() {
  return <AdminImport />
}
