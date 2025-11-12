import { Mail, Phone, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQsPage() {
  const faqs = [
    {
      question: '1. How do I place an order on Sum N Substance?',
      answer: 'To place an order, browse our products, select the desired items, add them to your cart, and proceed to checkout. Follow the instructions to complete payment securely.',
    },
    {
      question: '2. What payment methods are accepted?',
      answer: 'We accept major credit/debit cards, UPI, net banking, and popular digital wallets for your convenience and security.',
    },
    {
      question: '3. Can I cancel or change my order?',
      answer: 'You can cancel or modify your order within 5 hours of placing it by contacting our customer care at care@sumnsubstance.com or +91 98738 90047.',
    },
    {
      question: '4. How long does shipping take?',
      answer: 'Shipping usually takes 3-7 business days depending on your location and product availability.',
    },
    {
      question: '5. How can I track my order?',
      answer: 'Use the "Track Your Order" page on our website by entering your order number and email address for real-time updates.',
    },
    {
      question: '6. What is your return policy?',
      answer: 'Products can be returned within 2 days of delivery only in the case of any damage or defect, in original, unused condition. Please see our Returns & Refunds page for details.',
    },
    {
      question: '7. Are Sum N Substance products safe for sensitive skin?',
      answer: 'Yes, our products are formulated with skin-friendly ingredients and undergo quality testing. However, please check individual product descriptions for allergens.',
    },
    {
      question: '8. How do I contact customer support?',
      answer: 'Email us at care@sumnsubstance.com or call +91 98738 90047. Our team is available Monday to Friday, 9 AM to 6 PM IST.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 lg:w-16 lg:h-16" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg lg:text-xl text-white/90 text-center max-w-2xl mx-auto">
            Find answers to common questions about our products and services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg text-center">
            Have questions? We've got answers! Browse through our most frequently asked questions below.
          </p>
        </div>

        {/* FAQs Accordion */}
        <section className="mb-12">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-primary/20 rounded-lg px-6 hover:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="text-primary hover:text-primary/80 font-semibold text-left text-base lg:text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-base lg:text-lg leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Still Have Questions */}
        <section className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
            Still Have Questions?
          </h2>
          <p className="text-white/90 text-center mb-8 text-base lg:text-lg">
            Our customer care team is here to help!
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
          <p className="text-white/80 text-center mt-6 text-sm lg:text-base">
            Available Monday to Friday, 9 AM to 6 PM IST
          </p>
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

