// Modern Payment Gateway Service - Stripe & Razorpay Integration
import { loadStripe, Stripe } from "@stripe/stripe-js";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export interface UPIPaymentOptions {
  amount: number;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  upiId?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export class PaymentGateway {
  private static readonly RAZORPAY_KEY_ID = "rzp_test_1234567890"; // Test key - replace with actual
  private static readonly RAZORPAY_SCRIPT_URL =
    "https://checkout.razorpay.com/v1/checkout.js";
  private static readonly STRIPE_PUBLIC_KEY = "pk_test_51234567890"; // Test key - replace with actual
  private static stripePromise: Promise<Stripe | null> | null = null;

  static async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = this.RAZORPAY_SCRIPT_URL;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async loadStripe(): Promise<Stripe | null> {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(this.STRIPE_PUBLIC_KEY);
    }
    return this.stripePromise;
  }

  static async initiatePayment(options: PaymentOptions): Promise<void> {
    const isLoaded = await this.loadRazorpayScript();

    if (!isLoaded) {
      options.onFailure(new Error("Failed to load payment gateway"));
      return;
    }

    const razorpayOptions = {
      key: this.RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency,
      name: "Commerce Haven Shop",
      description: `Order #${options.orderId}`,
      order_id: options.orderId,
      handler: (response: any) => {
        options.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          method: "razorpay",
        });
      },
      prefill: {
        name: options.customerInfo.name,
        email: options.customerInfo.email,
        contact: options.customerInfo.phone,
      },
      theme: {
        color: "#f97316", // Orange color matching the site theme
      },
      modal: {
        ondismiss: () => {
          options.onFailure(new Error("Payment cancelled by user"));
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }

  static async initiateUPIPayment(options: UPIPaymentOptions): Promise<void> {
    const isLoaded = await this.loadRazorpayScript();

    if (!isLoaded) {
      options.onFailure(new Error("Failed to load payment gateway"));
      return;
    }

    const razorpayOptions = {
      key: this.RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: "INR",
      name: "Commerce Haven Shop",
      description: `Order #${options.orderId}`,
      order_id: options.orderId,
      method: {
        upi: true,
      },
      handler: (response: any) => {
        options.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          method: "upi",
        });
      },
      prefill: {
        name: options.customerInfo.name,
        email: options.customerInfo.email,
        contact: options.customerInfo.phone,
        vpa: options.upiId || "",
      },
      theme: {
        color: "#f97316",
      },
      modal: {
        ondismiss: () => {
          options.onFailure(new Error("Payment cancelled by user"));
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }

  // Simulate card payment for demo purposes
  static simulateCardPayment(options: PaymentOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate processing time
      setTimeout(() => {
        // 90% success rate for demo
        if (Math.random() > 0.1) {
          resolve({
            paymentId: `pay_${Date.now()}`,
            orderId: options.orderId,
            method: "card",
            status: "captured",
          });
        } else {
          reject(new Error("Card payment failed"));
        }
      }, 2000);
    });
  }

  // Simulate Net Banking payment for demo purposes
  static simulateNetBankingPayment(options: PaymentOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          resolve({
            paymentId: `netbank_${Date.now()}`,
            orderId: options.orderId,
            method: "netbanking",
            status: "captured",
          });
        } else {
          reject(new Error("Net banking payment failed"));
        }
      }, 3000);
    });
  }

  // Modern Stripe payment processing
  static async processStripePayment(options: PaymentOptions): Promise<any> {
    try {
      const stripe = await this.loadStripe();
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      // In a real implementation, you would create a payment intent on your backend
      // For demo purposes, we'll simulate the payment
      const { error } = await stripe.redirectToCheckout({
        sessionId: `demo_session_${Date.now()}`, // In real app, get this from your backend
      });

      if (error) {
        throw error;
      }

      return {
        paymentId: `stripe_${Date.now()}`,
        orderId: options.orderId,
        method: "stripe",
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error}`);
    }
  }

  // Simulate modern UPI payment (PhonePe, Google Pay, Paytm style)
  static simulateModernUPIPayment(options: PaymentOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate UPI app redirect and processing
      setTimeout(() => {
        if (Math.random() > 0.05) {
          // 95% success rate
          resolve({
            paymentId: `upi_${Date.now()}`,
            orderId: options.orderId,
            method: "upi",
            status: "completed",
            transactionId: `UPI${Date.now()}`,
            upiId: "user@paytm",
          });
        } else {
          reject(new Error("UPI payment failed or cancelled by user"));
        }
      }, 2000);
    });
  }

  // Simulate modern card payment with better security
  static simulateSecureCardPayment(options: PaymentOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate 3D Secure and tokenization
      setTimeout(() => {
        if (Math.random() > 0.02) {
          // 98% success rate for cards
          resolve({
            paymentId: `card_${Date.now()}`,
            orderId: options.orderId,
            method: "card",
            status: "completed",
            cardLast4: "1234",
            cardType: "VISA",
            authCode: `AUTH${Date.now()}`,
          });
        } else {
          reject(new Error("Card payment declined by bank"));
        }
      }, 3000);
    });
  }

  // Cash on Delivery - immediate success
  static processCODPayment(orderId: string): Promise<any> {
    return Promise.resolve({
      paymentId: `cod_${Date.now()}`,
      orderId: orderId,
      method: "cod",
      status: "pending",
    });
  }
}
