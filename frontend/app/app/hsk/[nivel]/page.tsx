import type { Metadata } from "next"
import { HskNivelView } from "@/components/hsk-nivel-view"

export const metadata: Metadata = {
  title: "Vocabulario HSK | Hanzi",
}

export default async function HskNivelPage({
  params,
}: {
  params: Promise<{ nivel: string }>
}) {
  const { nivel } = await params
  return <HskNivelView nivel={nivel} />
}
