import { Metadata } from "next"
import { eventsApi } from "@/lib/api-client"
import { Event } from "@/lib/supabase/events/types"
import RegistrationPage from "./RegistrationPage"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

// Helper to ensure absolute URL
const toAbsoluteUrl = (url: string) => {
  if (!url) return `${BASE_URL}/images/ritw.jpeg`
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const response = await eventsApi.getById(id)
    const event = response.data as unknown as Event

    const imageUrl = toAbsoluteUrl(event.image_url || '/images/ritw.jpeg')

    return {
      metadataBase: new URL(BASE_URL),
      title: `Register for ${event.title} | Run in the Wood`,
      description: `Join us for ${event.description}.`,
      openGraph: {
        title: `Register for ${event.title}`,
        description: `Join us for ${event.description}.`,
        url: `${BASE_URL}/registration/${id}`,
        siteName: "Run in the Wood",
        images: [
          {
            url: imageUrl,
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
        images: [imageUrl],
      },
    }
  } catch (error) {
    return {
      metadataBase: new URL(BASE_URL),
      title: 'Event Registration | Run in the Wood',
      description: 'Register for our trail running events',
    }
  }
}

export default function Page() {
  return <RegistrationPage />
}