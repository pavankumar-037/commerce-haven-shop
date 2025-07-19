import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  RotateCcw,
  Package,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

const ShippingReturns = () => {
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
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
            Shipping & Returns
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Fast, reliable shipping and hassle-free returns to ensure your
            complete satisfaction.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              Free Shipping
            </h3>
            <p className="text-stone-600">
              Free shipping on orders above ₹999 across India
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              Fast Delivery
            </h3>
            <p className="text-stone-600">
              3-7 days standard delivery, 1-3 days express delivery
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              Easy Returns
            </h3>
            <p className="text-stone-600">
              7-day return policy with free return pickup
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
            <div className="flex items-center mb-6">
              <Truck className="w-8 h-8 text-amber-600 mr-3" />
              <h2 className="text-3xl font-bold text-stone-800">
                Shipping Information
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3 flex items-center">
                  <Package className="w-5 h-5 text-green-600 mr-2" />
                  Shipping Options
                </h3>
                <div className="space-y-4">
                  <div className="border border-stone-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-stone-800">
                        Standard Delivery
                      </h4>
                      <span className="text-green-600 font-semibold">
                        FREE above ₹999
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm mb-2">
                      3-7 business days
                    </p>
                    <p className="text-stone-500 text-sm">
                      ₹99 for orders below ₹999
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-stone-800">
                        Express Delivery
                      </h4>
                      <span className="text-amber-600 font-semibold">₹199</span>
                    </div>
                    <p className="text-stone-600 text-sm mb-2">
                      1-3 business days
                    </p>
                    <p className="text-stone-500 text-sm">
                      Available in major cities
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-stone-800">
                        Cash on Delivery
                      </h4>
                      <span className="text-blue-600 font-semibold">
                        ₹49 extra
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm mb-2">
                      3-7 business days
                    </p>
                    <p className="text-stone-500 text-sm">
                      Available for orders above ₹500
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  Delivery Areas
                </h3>
                <ul className="space-y-2 text-stone-600">
                  <li>• All major cities and towns across India</li>
                  <li>• Remote areas may take 1-2 additional days</li>
                  <li>• Pincode verification available at checkout</li>
                  <li>• International shipping coming soon</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 mr-2" />
                  Order Processing
                </h3>
                <ul className="space-y-2 text-stone-600">
                  <li>• Orders placed before 2 PM are processed same day</li>
                  <li>• Weekend orders processed on next business day</li>
                  <li>• Order confirmation sent via email and SMS</li>
                  <li>• Tracking information provided once shipped</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Returns Information */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
            <div className="flex items-center mb-6">
              <RotateCcw className="w-8 h-8 text-amber-600 mr-3" />
              <h2 className="text-3xl font-bold text-stone-800">
                Returns & Exchanges
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Return Policy
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold mb-2">
                    7-Day Return Window
                  </p>
                  <p className="text-green-700 text-sm">
                    Return any item within 7 days of delivery for a full refund
                    or exchange.
                  </p>
                </div>
                <ul className="space-y-2 text-stone-600">
                  <li>• Items must be unworn and unwashed</li>
                  <li>• Original tags and packaging required</li>
                  <li>• Return reason must be specified</li>
                  <li>• Custom/personalized items not returnable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  How to Return
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p className="text-stone-600">
                      Log into your account and go to "My Orders"
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p className="text-stone-600">
                      Select the item you want to return
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p className="text-stone-600">
                      Choose return reason and request pickup
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <p className="text-stone-600">
                      Pack the item and hand it to our pickup partner
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Refund Process
                </h3>
                <ul className="space-y-2 text-stone-600">
                  <li>• Refunds processed within 3-5 business days</li>
                  <li>• Money credited to original payment method</li>
                  <li>• Bank transfer may take 5-7 additional days</li>
                  <li>• Refund confirmation sent via email</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Exchange Policy
                </h3>
                <ul className="space-y-2 text-stone-600">
                  <li>• Size/color exchanges subject to availability</li>
                  <li>• Price difference to be paid for higher value items</li>
                  <li>• Exchange delivery within 3-5 days</li>
                  <li>• One exchange per item allowed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Special Conditions */}
        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">
            Important Notes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">
                Non-Returnable Items
              </h3>
              <ul className="space-y-1 text-stone-600">
                <li>• Intimate wear and undergarments</li>
                <li>• Custom or personalized products</li>
                <li>• Items damaged by misuse</li>
                <li>• Products without original tags</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">
                Return Shipping
              </h3>
              <ul className="space-y-1 text-stone-600">
                <li>• Free return pickup for defective items</li>
                <li>• Customer pays for preference returns</li>
                <li>• Return shipping deducted from refund</li>
                <li>• Original shipping charges non-refundable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Need Help with Shipping or Returns?
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to assist you with any shipping or
            return queries.
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
      </main>
    </div>
  );
};

export default ShippingReturns;
