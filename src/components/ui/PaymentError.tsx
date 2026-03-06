import React from 'react'
import Template from "../layout/Template"
import { Card } from "./Card"
import { Button } from "./Button"
import { Iconify } from "@/lib/icons"
import { useRouter } from "next/navigation"

export default function PaymentError({ error }: { error: string }) {
  const router = useRouter()
  return (
    <Template>
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <Iconify
              icon="heroicons:exclamation-triangle"
              className="h-16 w-16 mx-auto mb-6 text-red-500"
            />
            <h2 className="font-heading text-3xl font-bold mb-4">Payment Error</h2>
            <p className="text-forest-300 mb-8">{error}</p>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </Template>
  )
}
