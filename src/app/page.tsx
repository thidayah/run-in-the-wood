import SectionHero from '@/components/ui/SectionHero'
import SectionFeatures from "@/components/ui/SectionFeatures"
import SectionEventsPreview from "@/components/ui/SectionEventsPreview"
import SectionCTA from "@/components/ui/SectionCTA"
import SectionAbout from "@/components/ui/SectionAbout"
import Template from "@/components/layout/Template"

export default function Home() {
  return (
    <Template>
      <SectionHero />
      <SectionAbout />
      <SectionFeatures />
      <SectionEventsPreview />
      <SectionCTA />
    </Template>
  )
}

