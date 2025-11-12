import { Mail, Phone, RefreshCw, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsRefundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <RefreshCw className="w-10 h-10 lg:w-14 lg:h-14" />
            <DollarSign className="w-10 h-10 lg:w-14 lg:h-14" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Returns & Refunds
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Your satisfaction is our priority. Learn about our hassle-free return and refund process.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
            At Sum N Substance, customer satisfaction is our priority. If you are not fully satisfied with your purchase, please review our Returns & Refund policy below:
          </p>
        </div>

        {/* Returns Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-8 h-8 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              Returns
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Products can be returned within 2 days of delivery only in the case of any damage or defect.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                The product must be unused, unopened, and in its original packaging.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                To initiate a return, contact our customer care at{' '}
                <a href="mailto:care@sumnsubstance.com" className="text-primary font-bold underline">
                  care@sumnsubstance.com
                </a>{' '}
                or{' '}
                <a href="tel:+919873890047" className="text-primary font-bold underline">
                  +91 98738 90047
                </a>{' '}
                with your order details.
              </p>
            </div>

            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Return shipping costs may apply unless the product is defective or damaged.
              </p>
            </div>
          </div>
        </section>

        {/* Refunds Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              Refunds
            </h2>
          </div>

          <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 lg:p-8 space-y-4">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Once the returned product is received and inspected, we will notify you of the refund approval status.
            </p>

            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Approved refunds will be processed to the original payment method within 7-10 business days.
            </p>

            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Shipping fees are non-refundable unless the return is due to an error on our part.
            </p>
          </div>
        </section>

        {/* Non-Returnable Items */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              Non-Returnable Items
            </h2>
          </div>

          <div className="bg-white border-2 border-primary rounded-xl p-6 lg:p-8">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Certain products like opened cosmetics or personal care items cannot be returned due to hygiene reasons.
            </p>
          </div>
        </section>

        {/* Additional Note */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8 mb-12">
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed text-center">
            For any questions regarding returns or refunds, please contact us using the details below.
          </p>
        </div>

        {/* Contact Section */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
            Contact Us
          </h2>
          <p className="text-white/90 text-center mb-8 text-base lg:text-lg">
            Have questions about returns or refunds? We're here to help!
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

