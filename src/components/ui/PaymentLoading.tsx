import Template from "../layout/Template"
import { Iconify } from "@/lib/icons"

export default function PaymentLoading() {
  return (
    <Template>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <Iconify
            icon="svg-spinners:ring-resize"
            className="h-12 w-12 mx-auto mb-6 text-trail-500"
          />
          <p className="text-forest-300">Processing payment information...</p>
        </div>
      </div>
    </Template>
  )
}
