import { Mail, Phone, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 lg:w-16 lg:h-16" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we protect and handle your personal information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
            At Sum n Substance, we are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make purchases, or interact with our services.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            Information We Collect
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <p className="text-gray-700 mb-4 text-base lg:text-lg">
              We may collect the following types of information:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base lg:text-lg">
                  Personal information such as your name, email address, phone number, shipping address, and payment details when you make a purchase or sign up for our newsletter.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base lg:text-lg">
                  Usage data, including your IP address, browser type, device information, and pages visited on our website.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base lg:text-lg">
                  Cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4 text-base lg:text-lg">
            We use your information to:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Process and fulfill your orders.',
              'Communicate with you about your account, orders, and customer service inquiries.',
              'Send promotional emails and newsletters (with your consent).',
              'Improve our website, products, and services.',
              'Analyze website usage and trends.',
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-gray-700 text-base lg:text-lg">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sharing Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            Sharing Your Information
          </h2>
          <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 lg:p-8">
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, or delivering products, but only for the purposes outlined in this policy.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            Data Security
          </h2>
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            Your Rights
          </h2>
          <p className="text-gray-700 mb-4 text-base lg:text-lg">
            You have the right to:
          </p>
          <div className="space-y-3">
            {[
              'Access, update, or delete your personal information.',
              'Opt out of marketing communications.',
              'Request a copy of the data we hold about you.',
            ].map((right, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50 rounded-lg p-4"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base lg:text-lg">{right}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Changes to This Policy */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
            Contact Us
          </h2>
          <p className="text-white/90 text-center mb-8 text-base lg:text-lg">
            For any questions or concerns regarding this Privacy Policy, please contact us at:
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

