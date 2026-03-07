import type { Metadata } from "next"
import { LessonStudy } from "@/components/lesson-study"

export const metadata: Metadata = {
  title: "Estudiar lección | Hanzi",
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <LessonStudy id={id} />
}
