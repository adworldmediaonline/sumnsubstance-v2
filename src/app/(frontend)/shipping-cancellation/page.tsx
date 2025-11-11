import { Mail, Phone, Package, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShippingCancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Package className="w-10 h-10 lg:w-14 lg:h-14" />
            <XCircle className="w-10 h-10 lg:w-14 lg:h-14" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Shipping & Cancellation
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Everything you need to know about shipping and order cancellations.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Shipping Policy */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              Shipping Policy
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 lg:p-8 mb-6">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6">
              At Sum N Substance, we aim to process and ship your orders promptly.
            </p>

            <div className="space-y-4">
              <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-gray-700 text-base lg:text-lg">
                  Orders are usually processed within 1-3 business days.
                </p>
              </div>

              <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-gray-700 text-base lg:text-lg">
                  Delivery time depends on your location and the shipping method selected.
                </p>
              </div>

              <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-gray-700 text-base lg:text-lg">
                  Shipping charges, if any, will be displayed at checkout.
                </p>
              </div>

              <div className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-gray-700 text-base lg:text-lg">
                  Sum N Substance is not responsible for delays caused by the courier or unforeseen circumstances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-8 h-8 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              Cancellation Policy
            </h2>
          </div>

          <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 lg:p-8 mb-6">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6">
              You may cancel your order under the following conditions:
            </p>

            <div className="space-y-4">
              <div className="flex items-center bg-white rounded-lg p-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700 text-base lg:text-lg">
                  Cancellation requests must be made within 24 hours of placing the order.
                </p>
              </div>

              <div className="flex items-center bg-white rounded-lg p-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700 text-base lg:text-lg">
                  Once the order is processed or shipped, it cannot be cancelled.
                </p>
              </div>

              <div className="flex items-start bg-white rounded-lg p-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700 text-base lg:text-lg">
                  For cancellations, please contact our customer care at{' '}
                  <a href="mailto:care@sumnsubstance.com" className="text-primary font-bold underline">
                    care@sumnsubstance.com
                  </a>{' '}
                  or{' '}
                  <a href="tel:+919873890047" className="text-primary font-bold underline">
                    +91 98738 90047
                  </a>
                  .
                </p>
              </div>

              <div className="flex items-center bg-white rounded-lg p-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <p className="text-gray-700 text-base lg:text-lg">
                  Refunds for cancelled orders will be processed promptly as per payment method.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Note */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 mb-12">
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed text-center">
            For any questions regarding shipping or cancellations, you can reach out to us at the above contact details.
          </p>
        </div>

        {/* Contact Section */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
            Need Help?
          </h2>
          <p className="text-white/90 text-center mb-8 text-base lg:text-lg">
            Contact us for any shipping or cancellation queries:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:care@sumnsubstance.com"
              className="flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full hover:bg-white/90 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              care@sumnsubstance.com
            </a>
            <a
              href="tel:+919873890047"
              className="flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full hover:bg-white/90 transition-colors font-semibold"
            >
              <Phone className="w-5 h-5" />
              +91 98738 90047
            </a>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block text-primary hover:text-primary/80 font-semibold text-lg underline underline-offset-4 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

