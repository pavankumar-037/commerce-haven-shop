
import { useState, useEffect } from 'react';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const savedCoupons = localStorage.getItem('adminCoupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }
  };

  const validateCoupon = (code: string, orderTotal: number): CouponValidationResult => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return {
        isValid: false,
        discount: 0,
        message: 'Invalid coupon code'
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        discount: 0,
        message: 'This coupon is currently inactive'
      };
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);

    if (now < validFrom) {
      return {
        isValid: false,
        discount: 0,
        message: 'This coupon is not yet active'
      };
    }

    if (now > validTo) {
      return {
        isValid: false,
        discount: 0,
        message: 'This coupon has expired'
      };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discount: 0,
        message: 'This coupon has reached its usage limit'
      };
    }

    if (orderTotal < coupon.minOrderValue) {
      return {
        isValid: false,
        discount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`
      };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed order total
    discount = Math.min(discount, orderTotal);

    return {
      isValid: true,
      discount,
      message: `Coupon applied! You saved ₹${discount.toFixed(2)}`,
      coupon
    };
  };

  const applyCoupon = (code: string, orderTotal: number): CouponValidationResult => {
    const result = validateCoupon(code, orderTotal);
    if (result.isValid && result.coupon) {
      setAppliedCoupon(result.coupon);
    }
    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const useCoupon = (couponId: string) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId 
        ? { ...coupon, usedCount: coupon.usedCount + 1 }
        : coupon
    );
    localStorage.setItem('adminCoupons', JSON.stringify(updatedCoupons));
    setCoupons(updatedCoupons);
  };

  return {
    coupons,
    appliedCoupon,
    validateCoupon,
    applyCoupon,
    removeCoupon,
    useCoupon,
    loadCoupons
  };
};
