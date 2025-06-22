
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Globe, 
  Palette, 
  Truck, 
  CreditCard, 
  Bell,
  ImageIcon,
  Type,
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from '@/hooks/use-toast';

interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  promoMessage: string;
  showPromoMessage: boolean;
  freeShippingThreshold: number;
  codAvailable: boolean;
  taxRate: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'IndiaFashion',
    tagline: 'Your trusted partner for authentic Indian fashion',
    heroTitle: 'Curated Elegance',
    heroSubtitle: 'For Every Occasion - Traditional & Modern Wear',
    promoMessage: '🎉 FREE SHIPPING ON ORDERS ABOVE ₹999 | COD AVAILABLE 🎉',
    showPromoMessage: true,
    freeShippingThreshold: 999,
    codAvailable: true,
    taxRate: 18,
    currency: '₹',
    contactEmail: 'support@indiafashion.com',
    contactPhone: '+91 98765 43210',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    seoSettings: {
      metaTitle: 'IndiaFashion - Traditional & Modern Indian Clothing',
      metaDescription: 'Shop authentic Indian fashion for all occasions. Premium quality traditional and modern wear with free shipping.',
      keywords: 'indian fashion, traditional wear, modern clothing, sarees, kurtas'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Load existing settings
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string | number | boolean, section?: string) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SiteSettings],
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save settings to localStorage
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      // Update promo message in real-time if applicable
      const event = new CustomEvent('settingsUpdated', { detail: settings });
      window.dispatchEvent(event);
      
      toast({
        title: "Settings Saved",
        description: "Your site settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-gray-600">Configure your store settings and appearance</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="commerce" className="flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Commerce
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center">
              <SettingsIcon className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure basic site information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="Your store name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Your store tagline"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="support@yourstore.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Add your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value, 'socialLinks')}
                    placeholder="https://facebook.com/yourstore"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value, 'socialLinks')}
                    placeholder="https://instagram.com/yourstore"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value, 'socialLinks')}
                    placeholder="https://twitter.com/yourstore"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Homepage Content
                </CardTitle>
                <CardDescription>
                  Customize the main hero section and promotional messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    placeholder="Main headline for your homepage"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={settings.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    placeholder="Supporting text for your hero section"
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showPromoMessage">Show Promotional Banner</Label>
                    <p className="text-sm text-gray-500">Display promotional message at the top</p>
                  </div>
                  <Switch
                    id="showPromoMessage"
                    checked={settings.showPromoMessage}
                    onCheckedChange={(checked) => handleInputChange('showPromoMessage', checked)}
                  />
                </div>
                
                {settings.showPromoMessage && (
                  <div>
                    <Label htmlFor="promoMessage">Promotional Message</Label>
                    <Textarea
                      id="promoMessage"
                      value={settings.promoMessage}
                      onChange={(e) => handleInputChange('promoMessage', e.target.value)}
                      placeholder="Your promotional message"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commerce" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping & Payment
                </CardTitle>
                <CardDescription>
                  Configure shipping thresholds and payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleInputChange('freeShippingThreshold', Number(e.target.value))}
                    placeholder="999"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Orders above this amount will have free shipping
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="codAvailable">Cash on Delivery (COD)</Label>
                    <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
                  </div>
                  <Switch
                    id="codAvailable"
                    checked={settings.codAvailable}
                    onCheckedChange={(checked) => handleInputChange('codAvailable', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                    placeholder="18"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Tax percentage applied to orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure customer notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Confirmation Emails</Label>
                      <p className="text-sm text-gray-500">Send emails when orders are placed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shipping Notifications</Label>
                      <p className="text-sm text-gray-500">Notify customers when orders ship</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">Alert when products are low in stock</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your store for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seoSettings.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value, 'seoSettings')}
                    placeholder="Your store title for search engines"
                  />
                </div>
                
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.seoSettings.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value, 'seoSettings')}
                    placeholder="Brief description of your store for search results"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={settings.seoSettings.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value, 'seoSettings')}
                    placeholder="Comma-separated keywords"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
