import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Award, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
            About StyleHub
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Your trusted destination for authentic fashion, bringing together
            traditional elegance and modern style to create unforgettable
            moments.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-stone-600">
            <p className="mb-6">
              Founded with a passion for authentic fashion, StyleHub has been
              dedicated to bringing you the finest collection of traditional and
              contemporary clothing. Our journey began with a simple mission: to
              make premium fashion accessible to everyone while maintaining the
              highest standards of quality and authenticity.
            </p>
            <p className="mb-6">
              We believe that clothing is more than just fabric – it's an
              expression of your personality, culture, and aspirations. Every
              piece in our collection is carefully curated to ensure it meets
              our strict standards for quality, design, and craftsmanship.
            </p>
            <p>
              Today, StyleHub serves thousands of satisfied customers across the
              country, and we continue to expand our collection to include the
              latest trends while honoring timeless traditions.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-12 text-center">
            Why Choose StyleHub?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Authentic Quality
              </h3>
              <p className="text-stone-600">
                Every product is sourced from trusted manufacturers and
                undergoes rigorous quality checks.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Award-Winning Service
              </h3>
              <p className="text-stone-600">
                Recognized for excellence in customer service and fashion retail
                across multiple platforms.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Fast Delivery
              </h3>
              <p className="text-stone-600">
                Quick and reliable shipping with real-time tracking for all your
                orders nationwide.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Secure Shopping
              </h3>
              <p className="text-stone-600">
                Your privacy and security are our top priority with encrypted
                transactions and data protection.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-stone-700 text-center leading-relaxed">
            To democratize fashion by making premium, authentic clothing
            accessible to everyone. We strive to bridge the gap between
            traditional craftsmanship and modern convenience, ensuring that
            every customer finds their perfect style while experiencing
            exceptional service.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Ready to Explore Our Collection?
          </h2>
          <p className="text-stone-600 mb-8">
            Discover thousands of authentic products waiting for you.
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
          >
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
