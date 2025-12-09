import { Iconify, ICONS } from "@/lib/icons"
import { Card } from "./Card"

export default function SectionFeatures() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-heading text-3xl font-bold text-center mb-12">
        Why <span className="text-trail-500">Run in the Wood</span>?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: ICONS.mountain,
            title: "Challenging Terrain",
            description: "Trails through forests and hills"
          },
          {
            icon: ICONS.trees,
            title: "Immersive Nature",
            description: "Connect with pristine forests"
          },
          {
            icon: ICONS.zap,
            title: "Adrenaline Rush",
            description: "Push your limits on technical trails"
          },
          {
            icon: ICONS.users,
            title: "Community",
            description: "Join fellow trail runners"
          }
        ].map((feature, index) => (
          // <Card key={index} glow={index === 0} className="p-6">
          <Card key={index} className="p-6">
            <div className="text-trail-500 mb-4">
              <Iconify
                icon={feature.icon}
                className="h-10 w-10"
              />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-forest-300">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
