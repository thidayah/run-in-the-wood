import { Metadata } from "next"
import { eventsApi } from "@/lib/api-client"
import { Event } from "@/lib/supabase/events/types"
import RegistrationPage from "./RegistrationPage"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const response = await eventsApi.getById(id)
    const event = response.data as unknown as Event

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
      title: `Register for ${event.title} | Run in the Wood`,
      // description: `Join us for ${event.title}. Distance: ${event.distance}, Elevation: ${event.elevation}. Register now for ${event.price} IDR.`,
      description: `Join us for ${event.description}.`,
      openGraph: {
        title: `Register for ${event.title}`,
        description: `Join the trail running event at ${event.location}`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/registration/${id}`,
        siteName: "Run in the Wood",
        images: [
          {
            url: event.image_url || '/images/ritw.jpeg',
            width: 900,
            height: 600,
            alt: `Register for ${event.title} - Run in the Wood`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        images: [event.image_url || '/images/ritw.jpeg'],
      },
    }
  } catch (error) {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
      title: 'Event Registration | Run in the Wood',
      description: 'Register for our trail running events',
    }
  }
}

export default function Page() {
  return <RegistrationPage />
}