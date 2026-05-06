import type { Metadata } from "next"
import { AppProfile } from "@/components/app-profile"

export const metadata: Metadata = {
  title: "Mi perfil | Hanzi",
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return <AppProfile />
}
