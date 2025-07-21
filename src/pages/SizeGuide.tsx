import { Link } from "react-router-dom";
import { ArrowLeft, Ruler, Info, Users, Shirt } from "lucide-react";
import { useState } from "react";

const SizeGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState("women");

  const sizeCharts = {
    women: {
      tops: [
        {
          size: "XS",
          chest: "30-32",
          waist: "24-26",
          hip: "32-34",
          length: "24-25",
        },
        {
          size: "S",
          chest: "32-34",
          waist: "26-28",
          hip: "34-36",
          length: "25-26",
        },
        {
          size: "M",
          chest: "34-36",
          waist: "28-30",
          hip: "36-38",
          length: "26-27",
        },
        {
          size: "L",
          chest: "36-38",
          waist: "30-32",
          hip: "38-40",
          length: "27-28",
        },
        {
          size: "XL",
          chest: "38-40",
          waist: "32-34",
          hip: "40-42",
          length: "28-29",
        },
        {
          size: "XXL",
          chest: "40-42",
          waist: "34-36",
          hip: "42-44",
          length: "29-30",
        },
      ],
      bottoms: [
        {
          size: "XS",
          waist: "24-26",
          hip: "32-34",
          inseam: "28-29",
          length: "38-39",
        },
        {
          size: "S",
          waist: "26-28",
          hip: "34-36",
          inseam: "29-30",
          length: "39-40",
        },
        {
          size: "M",
          waist: "28-30",
          hip: "36-38",
          inseam: "30-31",
          length: "40-41",
        },
        {
          size: "L",
          waist: "30-32",
          hip: "38-40",
          inseam: "31-32",
          length: "41-42",
        },
        {
          size: "XL",
          waist: "32-34",
          hip: "40-42",
          inseam: "32-33",
          length: "42-43",
        },
        {
          size: "XXL",
          waist: "34-36",
          hip: "42-44",
          inseam: "33-34",
          length: "43-44",
        },
      ],
    },
    men: {
      tops: [
        {
          size: "XS",
          chest: "34-36",
          waist: "28-30",
          shoulder: "16-17",
          length: "26-27",
        },
        {
          size: "S",
          chest: "36-38",
          waist: "30-32",
          shoulder: "17-18",
          length: "27-28",
        },
        {
          size: "M",
          chest: "38-40",
          waist: "32-34",
          shoulder: "18-19",
          length: "28-29",
        },
        {
          size: "L",
          chest: "40-42",
          waist: "34-36",
          shoulder: "19-20",
          length: "29-30",
        },
        {
          size: "XL",
          chest: "42-44",
          waist: "36-38",
          shoulder: "20-21",
          length: "30-31",
        },
        {
          size: "XXL",
          chest: "44-46",
          waist: "38-40",
          shoulder: "21-22",
          length: "31-32",
        },
      ],
      bottoms: [
        {
          size: "XS",
          waist: "28-30",
          hip: "34-36",
          inseam: "30-31",
          length: "40-41",
        },
        {
          size: "S",
          waist: "30-32",
          hip: "36-38",
          inseam: "31-32",
          length: "41-42",
        },
        {
          size: "M",
          waist: "32-34",
          hip: "38-40",
          inseam: "32-33",
          length: "42-43",
        },
        {
          size: "L",
          waist: "34-36",
          hip: "40-42",
          inseam: "33-34",
          length: "43-44",
        },
        {
          size: "XL",
          waist: "36-38",
          hip: "42-44",
          inseam: "34-35",
          length: "44-45",
        },
        {
          size: "XXL",
          waist: "38-40",
          hip: "44-46",
          inseam: "35-36",
          length: "45-46",
        },
      ],
    },
  };

  const measurementTips = [
    {
      title: "Chest/Bust",
      description:
        "Measure around the fullest part of your chest, keeping the measuring tape horizontal.",
      icon: "📐",
    },
    {
      title: "Waist",
      description:
        "Measure around your natural waistline, which is the narrowest part of your torso.",
      icon: "📏",
    },
    {
      title: "Hip",
      description:
        "Measure around the fullest part of your hips, about 7-9 inches below your waist.",
      icon: "📐",
    },
    {
      title: "Shoulder",
      description:
        "Measure from one shoulder point to the other, across the back of your neck.",
      icon: "📏",
    },
    {
      title: "Inseam",
      description:
        "Measure from the crotch seam to the bottom of the leg along the inside of your leg.",
      icon: "📐",
    },
    {
      title: "Length",
      description:
        "Measure from the highest point of the shoulder down to the desired length.",
      icon: "📏",
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
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ruler className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Size Guide
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size charts and
            measurement guide. When in doubt, contact our support team for
            personalized sizing advice.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Sizing Note</h3>
              <p className="text-blue-700">
                Our sizes are based on body measurements, not garment
                measurements. For the best fit, measure yourself and compare
                with our size charts. If you're between sizes, we recommend
                choosing the larger size for comfort.
              </p>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-stone-200">
            <button
              onClick={() => setSelectedCategory("women")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                selectedCategory === "women"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "text-stone-600 hover:text-stone-800"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Women's Sizes
            </button>
            <button
              onClick={() => setSelectedCategory("men")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                selectedCategory === "men"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "text-stone-600 hover:text-stone-800"
              }`}
            >
              <Shirt className="w-4 h-4 inline mr-2" />
              Men's Sizes
            </button>
          </div>
        </div>

        {/* Size Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Tops Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-gradient-to-r from-stone-50 to-slate-50 px-6 py-4 border-b border-stone-200">
              <h3 className="text-xl font-bold text-stone-800">
                {selectedCategory === "women" ? "Women's" : "Men's"} Tops &
                Shirts
              </h3>
              <p className="text-sm text-stone-600">
                All measurements in inches
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Chest/Bust
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Waist
                    </th>
                    {selectedCategory === "men" && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                        Shoulder
                      </th>
                    )}
                    {selectedCategory === "women" && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                        Hip
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts[selectedCategory].tops.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-stone-25"}
                    >
                      <td className="px-4 py-3 font-semibold text-stone-800">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{row.chest}</td>
                      <td className="px-4 py-3 text-stone-600">{row.waist}</td>
                      {selectedCategory === "men" && (
                        <td className="px-4 py-3 text-stone-600">
                          {row.shoulder}
                        </td>
                      )}
                      {selectedCategory === "women" && (
                        <td className="px-4 py-3 text-stone-600">{row.hip}</td>
                      )}
                      <td className="px-4 py-3 text-stone-600">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottoms Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-gradient-to-r from-stone-50 to-slate-50 px-6 py-4 border-b border-stone-200">
              <h3 className="text-xl font-bold text-stone-800">
                {selectedCategory === "women" ? "Women's" : "Men's"} Bottoms
              </h3>
              <p className="text-sm text-stone-600">
                All measurements in inches
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Waist
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Hip
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Inseam
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-800">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts[selectedCategory].bottoms.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-stone-25"}
                    >
                      <td className="px-4 py-3 font-semibold text-stone-800">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{row.waist}</td>
                      <td className="px-4 py-3 text-stone-600">{row.hip}</td>
                      <td className="px-4 py-3 text-stone-600">{row.inseam}</td>
                      <td className="px-4 py-3 text-stone-600">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">
            How to Take Accurate Measurements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {measurementTips.map((tip, index) => (
              <div
                key={index}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="text-2xl mb-3">{tip.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">
                  {tip.title}
                </h3>
                <p className="text-stone-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Measurement Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">
            Pro Measurement Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-4">
                Before You Measure
              </h3>
              <ul className="space-y-2 text-stone-600">
                <li>• Use a soft measuring tape (cloth/plastic, not metal)</li>
                <li>• Wear fitted clothing or undergarments only</li>
                <li>• Stand straight with feet together</li>
                <li>• Ask someone to help for more accurate measurements</li>
                <li>• Breathe normally and don't hold your breath</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-4">
                During Measurement
              </h3>
              <ul className="space-y-2 text-stone-600">
                <li>• Keep the tape snug but not tight</li>
                <li>• Ensure the tape is parallel to the floor</li>
                <li>• Take measurements at the fullest/narrowest points</li>
                <li>• Record measurements immediately</li>
                <li>• Double-check all measurements for accuracy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fit Guarantee */}
        <div className="text-center bg-green-50 border border-green-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Perfect Fit Guarantee
          </h2>
          <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
            Not sure about your size? Order multiple sizes and return the ones
            that don't fit. We offer free returns within 7 days to ensure you
            get the perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
            >
              Get Sizing Help
            </Link>
            <Link
              to="/shipping-returns"
              className="inline-flex items-center px-6 py-3 bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SizeGuide;
