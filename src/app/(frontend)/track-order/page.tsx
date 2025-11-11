import { Mail, Phone, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Package className="w-12 h-12 lg:w-16 lg:h-16" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Track Your Order
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Stay updated with real-time tracking of your order.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg text-center">
            Thank you for shopping with Sum N Substance. You can easily track the status of your order using the details provided below.
          </p>
        </div>

        {/* How to Track */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6 text-center">
            How to Track Your Order
          </h2>

          <div className="space-y-4">
            <div className="flex items-center bg-gray-50 rounded-lg p-5">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                1
              </div>
              <p className="text-gray-700 text-base lg:text-lg">
                Enter your unique order number and registered email address in the tracking section.
              </p>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg p-5">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                2
              </div>
              <p className="text-gray-700 text-base lg:text-lg">
                Once submitted, you will see real-time updates about your order status, including processing, shipping, and delivery details.
              </p>
            </div>

            <div className="flex items-start bg-gray-50 rounded-lg p-5">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                3
              </div>
              <p className="text-gray-700 text-base lg:text-lg">
                If you encounter any issues or have questions about your order status, please contact our customer support team at{' '}
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
          </div>
        </section>

        {/* Order Status Updates */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6 text-center">
            Order Status Updates
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Processing
                </h3>
              </div>
              <p className="text-gray-700 text-base">
                Your order is being prepared.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Shipped
                </h3>
              </div>
              <p className="text-gray-700 text-base">
                Your package is on the way.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Out for Delivery
                </h3>
              </div>
              <p className="text-gray-700 text-base">
                Your order is out for delivery and will arrive soon.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Delivered
                </h3>
              </div>
              <p className="text-gray-700 text-base">
                Your order has been successfully delivered.
              </p>
            </div>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Thank You
          </h2>
          <p className="text-lg lg:text-xl text-white/90 leading-relaxed mb-8">
            Thank you for choosing Sum N Substance. We are dedicated to delivering quality products quickly and efficiently.
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

