
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';

interface Coupon {
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

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    validFrom: '',
    validTo: '',
    isActive: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const savedCoupons = localStorage.getItem('adminCoupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }
  };

  const saveCoupons = (newCoupons: Coupon[]) => {
    localStorage.setItem('adminCoupons', JSON.stringify(newCoupons));
    setCoupons(newCoupons);
  };

  const generateCouponCode = () => {
    const prefix = 'SAVE';
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomString}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData: Coupon = {
      id: editingCoupon?.id || Date.now().toString(),
      code: formData.code.toUpperCase(),
      description: formData.description,
      type: formData.type,
      value: formData.value,
      minOrderValue: formData.minOrderValue,
      maxDiscount: formData.type === 'percentage' ? formData.maxDiscount : undefined,
      usageLimit: formData.usageLimit,
      usedCount: editingCoupon?.usedCount || 0,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      isActive: formData.isActive,
      createdAt: editingCoupon?.createdAt || new Date().toISOString()
    };

    let newCoupons;
    if (editingCoupon) {
      newCoupons = coupons.map(coupon => 
        coupon.id === editingCoupon.id ? couponData : coupon
      );
      toast({ title: "Coupon updated successfully!" });
    } else {
      newCoupons = [...coupons, couponData];
      toast({ title: "Coupon created successfully!" });
    }

    saveCoupons(newCoupons);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      usageLimit: 100,
      validFrom: '',
      validTo: '',
      isActive: true
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      isActive: coupon.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (couponId: string) => {
    const newCoupons = coupons.filter(coupon => coupon.id !== couponId);
    saveCoupons(newCoupons);
    toast({ title: "Coupon deleted successfully!" });
  };

  const toggleCouponStatus = (couponId: string) => {
    const newCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
    );
    saveCoupons(newCoupons);
    toast({ title: "Coupon status updated!" });
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Coupon code copied to clipboard!" });
  };

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date();
  };

  const isValidFromFuture = (validFrom: string) => {
    return new Date(validFrom) > new Date();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Coupon Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                          placeholder="Enter coupon code"
                          required
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setFormData({...formData, code: generateCouponCode()})}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Discount Type</Label>
                      <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe this coupon offer..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">
                        Discount Value ({formData.type === 'percentage' ? '%' : '₹'})
                      </Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                        min="1"
                        max={formData.type === 'percentage' ? "99" : "10000"}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
                      <Input
                        id="minOrderValue"
                        type="number"
                        value={formData.minOrderValue}
                        onChange={(e) => setFormData({...formData, minOrderValue: Number(e.target.value)})}
                        min="0"
                      />
                    </div>
                  </div>

                  {formData.type === 'percentage' && (
                    <div>
                      <Label htmlFor="maxDiscount">Maximum Discount Amount (₹)</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})}
                        min="0"
                        placeholder="Optional - leave 0 for no limit"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validFrom">Valid From</Label>
                      <Input
                        id="validFrom"
                        type="datetime-local"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="validTo">Valid Until</Label>
                      <Input
                        id="validTo"
                        type="datetime-local"
                        value={formData.validTo}
                        onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-blue-600 flex items-center">
                        {coupon.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCouponCode(coupon.code)}
                          className="ml-2 p-1 h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {coupon.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                      {isExpired(coupon.validTo) && (
                        <Badge className="bg-red-100 text-red-800">Expired</Badge>
                      )}
                      {isValidFromFuture(coupon.validFrom) && (
                        <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Discount:</span>
                      <p className="font-semibold">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        {coupon.maxDiscount && coupon.type === 'percentage' && (
                          <span className="text-gray-500 text-xs"> (max ₹{coupon.maxDiscount})</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Min Order:</span>
                      <p className="font-semibold">₹{coupon.minOrderValue}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="font-semibold">{coupon.usedCount}/{coupon.usageLimit}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Valid Until:</span>
                      <p className="font-semibold text-xs">
                        {new Date(coupon.validTo).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon.id)}
                      >
                        {coupon.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {coupons.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons created yet</h3>
              <p className="text-gray-600">Create your first coupon to start offering discounts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
