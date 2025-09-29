import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast } from "react-toastify";

const PremiumPlan = () => {
  const user = useSelector((store) => store.user);

  const [selectedPlan, setSelectedPlan] = useState(
    user?.isPremium ? user?.membershipType?.toLowerCase() : ""
  );
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const plans = {
    silver: {
      name: "Silver",
      color: "gray",
      monthlyPrice: 300,
      yearlyPrice: "3,000",
      description: "Perfect for getting started with premium features",
      features: [
        "Up to 50 connections per month",
        "Standard profile visibility boost",
        "Basic profile edit features",
        "Email support",
        "Ad-free experience",
      ],
      nonFeatures: [
        "Priority matching",
        "Unlimited connections",
        "Advanced analytics",
        "Priority support",
      ],
    },
    gold: {
      name: "Gold",
      color: "yellow",
      monthlyPrice: 700,
      yearlyPrice: "7,000",
      description: "Our most popular plan for serious connections",
      features: [
        "Up to 200 connections per month",
        "Profile visibility priority",
        "Advanced edit profile features",
        "Priority email support",
        "Basic analytics",
      ],
      nonFeatures: [
        "Unlimited connections",
        "Personalized matching",
        "Dedicated support",
      ],
    },
    platinum: {
      name: "Platinum",
      color: "purple",
      monthlyPrice: 1000,
      yearlyPrice: "10,000",
      description: "Maximum visibility and premium features",
      features: [
        "Unlimited connections",
        "Top profile visibility",
        "See who liked you instantly",
        "Personalized matching assistance",
        "Premium edit profile features",
        "Dedicated support manager",
        "Early access to new features",
      ],
      nonFeatures: [],
    },
  };

  const savings = {
    silver: "17%",
    gold: "17%",
    platinum: "17%",
  };

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/payment/verify", {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.msg === "Payment successful") {
        console.log(res.msg);
        dispatch(addUser(res.data.user));
        toast("Payment successful", { type: "success" });
        setShowConfirmation(false);
      } else {
        setShowConfirmation(false);
        dispatch(addUser(res.data.user));

        toast("Payment failed", { type: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlanSelection = (planKey) => {
    setSelectedPlan(planKey);
    setCurrentPlan({
      key: planKey,
      ...plans[planKey],
      period: billingCycle,
      price:
        billingCycle === "monthly"
          ? plans[planKey].monthlyPrice
          : plans[planKey].yearlyPrice,
    });
  };

  const openConfirmation = (planKey) => {
    handlePlanSelection(planKey);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setCurrentPlan(null);
  };

  const membershipPlan = async (membershipType, period) => {
    try {
      setLoading(true);

      const order = await axios.post(
        BASE_URL + "/payment/order",
        {
          membershipType,
          period,
        },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "stumble",
        description: "stumble premium plan transaction",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Payment error:", error);
      setLoading(false);
    }
  };

  const handleConfirmPurchase = () => {
    if (currentPlan) {
      membershipPlan(currentPlan.key, currentPlan.period);
    }
  };

  // Confirmation Popup Component
  const ConfirmationPopup = () => {
    if (!currentPlan) return null;

    const isSamePlan =
      user.isPremium === true &&
      user.membershipType === currentPlan.name.toLowerCase() &&
      user.membershipPeriod === billingCycle;

    if (isSamePlan) {
      // Use useEffect for the timeout functionality
      React.useEffect(() => {
        const timer = setTimeout(() => {
          setShowConfirmation(false);
          setCurrentPlan(null);
        }, 3000);

        return () => clearTimeout(timer);
      }, []);

      return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-emerald-500 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">
              Plan Already Active
            </h3>
            <p className="text-gray-300 text-lg">
              You are already on the {user.membershipType} plan
            </p>
            <p className="text-gray-400 mt-2">
              This message will close automatically...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500 rounded-2xl p-4 w-full max-w-md mx-4 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-${currentPlan.color}-500 to-${currentPlan.color}-600 flex items-center justify-center`}
            >
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Confirm Your Purchase
            </h3>
            <p className="text-gray-400">You're about to upgrade to</p>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-white">
                {currentPlan.name} Plan
              </span>
              <span className="text-2xl font-bold text-purple-400">
                ₹{currentPlan.price}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {currentPlan.period === "monthly"
                  ? "Monthly billing"
                  : "Yearly billing"}
              </span>
              <span>
                {currentPlan.period === "yearly" &&
                  `Save ${savings[currentPlan.key]}`}
              </span>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Plan includes:</h4>
            <ul className="space-y-2">
              {currentPlan.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-300"
                >
                  <svg
                    className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
              {currentPlan.features.length > 3 && (
                <li className="text-xs text-gray-500 pl-6">
                  +{currentPlan.features.length - 3} more features...
                </li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closeConfirmation}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Pay
            </button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-18 lg:pt-20 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-emerald-700 to-blue-400 bg-clip-text text-transparent mb-4">
          Upgrade Your Experience
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Join thousands of successful members who found meaningful connections
          through our premium features
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              billingCycle === "yearly"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly <span className="text-green-400 text-sm ml-1">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 ${
              selectedPlan === key
                ? "border-purple-500 shadow-2xl shadow-purple-500/20"
                : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => handlePlanSelection(key)}
          >
            {/* Popular Badge */}
            {key === "gold" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600 flex items-center justify-center`}
              >
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-white">
                  ₹
                  {billingCycle === "monthly"
                    ? plan.monthlyPrice
                    : plan.yearlyPrice}
                </span>
                <span className="text-gray-400">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-green-400 text-sm mt-1">
                  Save {savings[key]} compared to monthly
                </p>
              )}
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
              {plan.nonFeatures.map((feature, index) => (
                <li key={index} className="flex items-center opacity-50">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => openConfirmation(key)}
              className={`w-10/12 py-4 rounded-xl absolute bottom-8 font-bold transition-all duration-200 ${
                selectedPlan === key
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white shadow-lg`}
            >
              {selectedPlan === key
                ? user?.isPremium &&
                  user?.membershipType?.toLowerCase() === key &&
                  user?.membershipPeriod === billingCycle
                  ? "Current Plan"
                  : "Upgrade Required"
                : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Why Upgrade Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Why Go Premium?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              2.5x More Matches
            </h3>
            <p className="text-gray-400">
              Premium members get significantly more quality matches
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💕</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Quality Connections
            </h3>
            <p className="text-gray-400">
              Advanced algorithms ensure better compatibility
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Priority Visibility
            </h3>
            <p className="text-gray-400">
              Get seen first by potential matches in your area
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I change plans later?",
              a: "Yes, you can upgrade or downgrade your plan at any time.",
            },
            {
              q: "Is there a free trial?",
              a: "We offer a 7-day free trial for all premium plans.",
            },
            {
              q: "How do I cancel my subscription?",
              a: "You can cancel anytime from your account settings.",
            },
            {
              q: "Are payments secure?",
              a: "We use industry-standard encryption to protect your payments.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && <ConfirmationPopup />}
    </div>
  );
};

export default PremiumPlan;
