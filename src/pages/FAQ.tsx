import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Orders & Shopping",
      icon: "🛒",
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping details, and choose your payment method.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer:
            "You can modify or cancel your order within 1 hour of placing it. After that, orders are processed for shipping and cannot be changed. Contact our support team immediately if you need assistance.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets. All payments are processed securely through encrypted payment gateways.",
        },
        {
          question: "Do you offer Cash on Delivery (COD)?",
          answer:
            "Yes, we offer COD for orders above ₹500 in select cities. COD charges may apply. This option will be available at checkout if your location is eligible.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      icon: "🚚",
      questions: [
        {
          question: "How long does delivery take?",
          answer:
            "Standard delivery takes 3-7 business days within India. Express delivery (1-3 days) is available in major cities for an additional charge. Remote areas may take longer.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Currently, we only ship within India. We're working on expanding to international shipping soon. Please check back for updates.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order by visiting the 'Track Order' page on our website.",
        },
        {
          question: "What if my package is damaged or lost?",
          answer:
            "If your package arrives damaged, please contact us within 24 hours with photos. For lost packages, we'll investigate with our shipping partner and provide a replacement or refund.",
        },
      ],
    },
    {
      title: "Returns & Exchanges",
      icon: "↩️",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 7-day return policy from the date of delivery. Items must be unworn, unwashed, with original tags attached. Custom or personalized items cannot be returned.",
        },
        {
          question: "How do I return an item?",
          answer:
            "Log into your account, go to 'My Orders', select the item you want to return, and follow the return process. You can also contact our support team for assistance.",
        },
        {
          question: "Who pays for return shipping?",
          answer:
            "If the item is defective or incorrect, we cover return shipping. For other returns (size/color preference), return shipping charges apply.",
        },
        {
          question: "Can I exchange an item for a different size/color?",
          answer:
            "Yes, exchanges are possible subject to availability. The exchange process is similar to returns, and you can select your preferred replacement during the return process.",
        },
      ],
    },
    {
      title: "Products & Sizing",
      icon: "👗",
      questions: [
        {
          question: "How do I choose the right size?",
          answer:
            "Each product page includes a detailed size chart. We recommend measuring yourself and comparing with our size guide. When in doubt, contact our support team for personalized sizing advice.",
        },
        {
          question: "Are the colors accurate in photos?",
          answer:
            "We strive to show accurate colors, but slight variations may occur due to lighting and screen settings. If you're unsure about a color, contact us for additional product photos.",
        },
        {
          question: "Do you restock sold-out items?",
          answer:
            "We regularly restock popular items. You can sign up for restock notifications on product pages. Follow our social media for updates on new arrivals and restocks.",
        },
        {
          question: "Are your products authentic?",
          answer:
            "Yes, all our products are 100% authentic and sourced directly from trusted manufacturers and authorized distributors. We guarantee quality and authenticity.",
        },
      ],
    },
    {
      title: "Account & Support",
      icon: "👤",
      questions: [
        {
          question: "Do I need an account to shop?",
          answer:
            "While you can browse without an account, you'll need to create one to place orders. An account helps you track orders, manage returns, and receive personalized recommendations.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the sign-in page, enter your email address, and follow the instructions in the reset email. If you don't receive it, check your spam folder.",
        },
        {
          question: "How can I contact customer support?",
          answer:
            "You can reach us through our Contact page, email us at support@stylehub.com, or call us at +91 1234567890. Our support team is available Monday-Saturday, 9 AM-6 PM.",
        },
        {
          question: "Do you have a mobile app?",
          answer:
            "Currently, we don't have a mobile app, but our website is fully optimized for mobile browsing. We're working on launching a mobile app soon for an even better shopping experience.",
        },
      ],
    },
  ];

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
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Find quick answers to common questions about shopping, shipping,
            returns, and more. Can't find what you're looking for? Contact our
            support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-stone-50 to-slate-50 px-6 py-4 border-b border-stone-200">
                <h2 className="text-2xl font-bold text-stone-800 flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  {category.title}
                </h2>
              </div>

              <div className="p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem
                      key={questionIndex}
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border border-stone-200 rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-semibold text-stone-800 pr-4">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-stone-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Still Need Help?
          </h2>
          <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
            Our friendly support team is here to help you with any questions or
            concerns. We typically respond within a few hours during business
            hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/track-order"
              className="inline-flex items-center px-6 py-3 bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Track Your Order
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link
            to="/terms"
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-amber-300 transition-colors text-center"
          >
            <h3 className="font-semibold text-stone-800 mb-2">
              Terms of Service
            </h3>
            <p className="text-sm text-stone-600">
              Read our terms and conditions
            </p>
          </Link>
          <Link
            to="/privacy"
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-amber-300 transition-colors text-center"
          >
            <h3 className="font-semibold text-stone-800 mb-2">
              Privacy Policy
            </h3>
            <p className="text-sm text-stone-600">How we protect your data</p>
          </Link>
          <Link
            to="/shipping-returns"
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-amber-300 transition-colors text-center"
          >
            <h3 className="font-semibold text-stone-800 mb-2">
              Shipping & Returns
            </h3>
            <p className="text-sm text-stone-600">
              Detailed shipping information
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
