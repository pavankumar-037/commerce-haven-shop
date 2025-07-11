// Payment Gateway Service - Razorpay Integration

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
