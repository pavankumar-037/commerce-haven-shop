import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";

const PrivacyPolicy = () => {
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-stone-600">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-stone-700">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-green-700">
                  At StyleHub, we are committed to protecting your personal
                  information and maintaining transparency about how we collect,
                  use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-amber-600" />
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Billing and shipping addresses</li>
              <li>
                Payment information (processed securely by third-party
                providers)
              </li>
              <li>Account credentials and preferences</li>
              <li>Purchase history and order details</li>
            </ul>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website and search terms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-amber-600" />
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your purchases and account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>
                Send promotional emails and marketing communications (with your
                consent)
              </li>
              <li>Improve our website, products, and services</li>
              <li>Detect and prevent fraud or unauthorized activities</li>
              <li>Comply with legal obligations and resolve disputes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your
              information with:
            </p>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Service Providers
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Payment processors for transaction handling</li>
              <li>Shipping companies for order delivery</li>
              <li>Email service providers for communications</li>
              <li>Analytics providers for website improvement</li>
            </ul>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Legal Requirements
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>When required by law or legal process</li>
              <li>To protect our rights and property</li>
              <li>To ensure the safety of our users</li>
              <li>In connection with business transfers or mergers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              4. Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and employee training</li>
              <li>Compliance with industry standards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your preferences and login status</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide personalized content and recommendations</li>
              <li>Enable social media features</li>
              <li>Deliver targeted advertising (with your consent)</li>
            </ul>
            <p className="mt-4">
              You can control cookie settings through your browser, but
              disabling cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Request data portability</li>
              <li>File complaints with regulatory authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              7. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to
              provide our services, comply with legal obligations, resolve
              disputes, and enforce our agreements. When no longer needed, we
              securely delete or anonymize your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to review their privacy policies before providing
              any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              9. Children's Privacy
            </h2>
            <p>
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children. If
              we become aware of such collection, we will delete the information
              immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              10. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure appropriate
              safeguards are in place to protect your data during such
              transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes
              in our practices or legal requirements. We will notify you of
              significant changes and update the "Last updated" date at the top
              of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              12. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="bg-stone-50 rounded-lg p-4">
              <p>
                <strong>Email:</strong> privacy@stylehub.com
              </p>
              <p>
                <strong>Phone:</strong> +91 1234567890
              </p>
              <p>
                <strong>Address:</strong> StyleHub Privacy Officer, India
              </p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 pt-8 border-t border-stone-200">
          <p className="text-stone-600 mb-4">
            Questions about your data or privacy? We're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
          >
            Contact Privacy Team
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
