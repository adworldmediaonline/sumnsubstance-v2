import { Mail, Phone, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 lg:w-16 lg:h-16" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Please read these terms carefully before using our website and services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
            Welcome to Sum n Substance. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
          </p>
        </div>

        {/* 1. Use of Website */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            1. Use of Website
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-3">
                You agree to use the website only for lawful purposes and in ways that do not infringe on the rights of others or restrict their use and enjoyment.
              </p>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Product Information */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            2. Product Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start bg-white border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <p className="text-gray-700 text-base lg:text-lg">
                We strive to ensure that the product descriptions, images, and information on this website are accurate. However, we do not guarantee that all details are error-free.
              </p>
            </div>
            <div className="flex items-start bg-white border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <p className="text-gray-700 text-base lg:text-lg">
                Product availability is subject to change without notice.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Orders and Payments */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            3. Orders and Payments
          </h2>
          <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 lg:p-8 space-y-3">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              By placing an order, you confirm that all information provided is accurate and complete.
            </p>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Payment must be made in full before dispatch unless otherwise agreed.
            </p>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              We reserve the right to reject or cancel orders in certain circumstances.
            </p>
          </div>
        </section>

        {/* 4. Shipping and Delivery */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            4. Shipping and Delivery
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg">
                Delivery times are estimates and not guaranteed.
              </p>
            </div>
            <div className="bg-white border-2 border-primary/20 rounded-lg p-5 hover:border-primary/40 transition-colors">
              <p className="text-gray-700 text-base lg:text-lg">
                Risk and title of the products pass to you upon delivery.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Returns and Refunds */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            5. Returns and Refunds
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Please refer to our{' '}
              <Link href="/returns-refund" className="text-primary font-bold underline underline-offset-4 hover:text-primary/80 transition-colors">
                Return Policy
              </Link>{' '}
              on the website for details about returns and refunds.
            </p>
          </div>
        </section>

        {/* 6. Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            6. Intellectual Property
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              All content on this website, including text, images, logos, and trademarks, is the property of Sum n Substance or its licensors and is protected by intellectual property laws.
            </p>
            <div className="bg-primary/5 rounded-lg p-6">
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                You may not reproduce, distribute, or use the content without our prior written consent.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            7. Limitation of Liability
          </h2>
          <div className="bg-white border-2 border-primary rounded-xl p-6 lg:p-8 space-y-3">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Sum n Substance is not liable for any indirect, incidental, or consequential damages arising from the use of the website or products.
            </p>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed font-semibold">
              Our maximum liability is limited to the purchase price of the product.
            </p>
          </div>
        </section>

        {/* 8. Privacy */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            8. Privacy
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Your personal information is handled according to our{' '}
              <Link href="/privacy-policy" className="text-primary font-bold underline underline-offset-4 hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 9. Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            9. Changes to Terms
          </h2>
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
            We reserve the right to update or modify these Terms & Conditions at any time. Such changes will be posted on this page.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            10. Governing Law
          </h2>
          <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 lg:p-8">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              These Terms & Conditions are governed by the laws of the jurisdiction in which Sum n Substance operates.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
            Contact Information
          </h2>
          <p className="text-white/90 text-center mb-8 text-base lg:text-lg">
            For any questions regarding these Terms & Conditions, please contact us at:
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

