import { Link } from "react-router-dom";
import { ArrowLeft, Scale, FileText, AlertCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center text-stone-600 hover:text-amber-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link to="/" className="text-2xl font-bold text-stone-800">
              StyleHub
            </Link>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-stone-600">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-stone-700">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-amber-700">
                  By accessing and using StyleHub, you agree to be bound by
                  these Terms of Service. Please read them carefully before
                  making any purchases.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-amber-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using StyleHub's website and services, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service and our Privacy Policy. If you do not
              agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              2. User Accounts
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You must provide accurate and complete information when creating
                an account
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account
              </li>
              <li>
                You must be at least 18 years old to create an account and make
                purchases
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              3. Product Information and Pricing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We strive to provide accurate product descriptions and images
              </li>
              <li>
                Colors may vary slightly due to monitor settings and lighting
              </li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to correct pricing errors</li>
              <li>
                All prices are in Indian Rupees (INR) unless otherwise specified
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              4. Orders and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All orders are subject to acceptance and product availability
              </li>
              <li>
                We reserve the right to refuse or cancel orders at our
                discretion
              </li>
              <li>Payment must be made in full before order processing</li>
              <li>
                We accept various payment methods as displayed at checkout
              </li>
              <li>
                You authorize us to charge your payment method for all purchases
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              5. Shipping and Delivery
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>
                Risk of loss transfers to you upon delivery to the carrier
              </li>
              <li>
                You must inspect packages upon delivery and report damage
                immediately
              </li>
              <li>
                We are not responsible for delays caused by courier services or
                force majeure
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              6. Returns and Refunds
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Returns must be initiated within 7 days of delivery</li>
              <li>Items must be in original condition with tags attached</li>
              <li>Custom or personalized items cannot be returned</li>
              <li>Refunds will be processed to the original payment method</li>
              <li>
                Return shipping costs may apply unless the item is defective
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              7. Intellectual Property
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All content on our website is protected by copyright and
                trademark laws
              </li>
              <li>
                You may not reproduce, distribute, or create derivative works
                without permission
              </li>
              <li>Product images and descriptions are for reference only</li>
              <li>StyleHub and related logos are trademarks of our company</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              8. User Conduct
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our services for any unlawful purpose</li>
              <li>Interfere with or disrupt our website or servers</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              StyleHub shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of our services. Our total liability shall not exceed the amount
              paid by you for the specific product or service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              10. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting. Your continued
              use of our services after any changes constitutes acceptance of
              the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-stone-50 rounded-lg p-4 mt-4">
              <p>
                <strong>Email:</strong> legal@stylehub.com
              </p>
              <p>
                <strong>Phone:</strong> +91 1234567890
              </p>
              <p>
                <strong>Address:</strong> StyleHub Legal Department, India
              </p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 pt-8 border-t border-stone-200">
          <p className="text-stone-600 mb-4">
            Have questions about our terms? We're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
