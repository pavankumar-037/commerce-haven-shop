import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Globe, 
  Palette, 
  ShoppingBag, 
  Bell, 
  Search as SearchIcon,
  Settings as SettingsIcon,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
  };
  appearance: {
    heroTitle: string;
    heroSubtitle: string;
    promoBanner: string;
    showPromoBanner: boolean;
    heroThumbnail: string;
    trendingCollectionLink: string;
    offerCollectionLink: string;
    backgroundStyle: string;
    colorTheme: string;
  };
  commerce: {
    freeShippingThreshold: number;
    shippingCost: number;
    codAvailable: boolean;
    taxRate: number;
  };
  notifications: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promoEmails: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'StyleHub',
      siteDescription: 'Your trusted partner for authentic fashion',
      contactEmail: 'cuteliitleprincess150@gmail.com',
      contactPhone: '+91 98765 43210'
    },
    appearance: {
      heroTitle: 'Curated Elegance',
      heroSubtitle: 'For Every Occasion - Traditional & Modern Wear',
      promoBanner: '🎉 FREE SHIPPING ON ORDERS ABOVE ₹999 | COD AVAILABLE 🎉',
      showPromoBanner: true,
      heroThumbnail: '',
      trendingCollectionLink: '#trending',
      offerCollectionLink: '#offers',
      backgroundStyle: 'gradient',
      colorTheme: 'muted'
    },
    commerce: {
      freeShippingThreshold: 999,
      shippingCost: 50,
      codAvailable: true,
      taxRate: 0
    },
    notifications: {
      emailNotifications: true,
      orderUpdates: true,
      promoEmails: false
    },
    seo: {
      metaTitle: 'StyleHub - Authentic Fashion Online',
      metaDescription: 'Shop premium ethnic wear, sarees, kurtas, and traditional clothing online. Free shipping, COD available.',
      keywords: 'fashion, ethnic wear, sarees, kurtas, traditional clothing'
    }
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleInputChange = (section: keyof SiteSettings, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Site settings have been updated successfully",
    });
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            heroThumbnail: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Site Settings</h1>
            <p className="text-stone-600">Configure your website settings and preferences</p>
          </div>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-stone-100">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="commerce" className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Commerce</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center space-x-2">
              <SearchIcon className="w-4 h-4" />
              <span>SEO</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800">General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.general.contactPhone}
                    onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.appearance.heroTitle}
                    onChange={(e) => handleInputChange('appearance', 'heroTitle', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={settings.appearance.heroSubtitle}
                    onChange={(e) => handleInputChange('appearance', 'heroSubtitle', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6">
                  <Label className="text-stone-700 font-medium mb-3 block">Hero Thumbnail Image</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="border-stone-400 text-stone-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    {settings.appearance.heroThumbnail && (
                      <img 
                        src={settings.appearance.heroThumbnail} 
                        alt="Hero thumbnail" 
                        className="w-16 h-16 object-cover rounded-lg border-2 border-stone-200"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trendingCollectionLink">Trending Collection Link</Label>
                    <Input
                      id="trendingCollectionLink"
                      value={settings.appearance.trendingCollectionLink}
                      onChange={(e) => handleInputChange('appearance', 'trendingCollectionLink', e.target.value)}
                      placeholder="#trending or /trending-page"
                      className="border-stone-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerCollectionLink">Offer Collection Link</Label>
                    <Input
                      id="offerCollectionLink"
                      value={settings.appearance.offerCollectionLink}
                      onChange={(e) => handleInputChange('appearance', 'offerCollectionLink', e.target.value)}
                      placeholder="#offers or /offers-page"
                      className="border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colorTheme">Color Theme</Label>
                    <select
                      id="colorTheme"
                      value={settings.appearance.colorTheme}
                      onChange={(e) => handleInputChange('appearance', 'colorTheme', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
                    >
                      <option value="muted">Muted Earth Tones</option>
                      <option value="vibrant">Vibrant Colors</option>
                      <option value="monochrome">Monochrome</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="backgroundStyle">Background Style</Label>
                    <select
                      id="backgroundStyle"
                      value={settings.appearance.backgroundStyle}
                      onChange={(e) => handleInputChange('appearance', 'backgroundStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
                    >
                      <option value="gradient">Gradient</option>
                      <option value="transparent">Transparent Overlay</option>
                      <option value="solid">Solid Color</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="promoBanner">Promo Banner Text</Label>
                  <Input
                    id="promoBanner"
                    value={settings.appearance.promoBanner}
                    onChange={(e) => handleInputChange('appearance', 'promoBanner', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPromoBanner"
                    checked={settings.appearance.showPromoBanner}
                    onCheckedChange={(checked) => handleInputChange('appearance', 'showPromoBanner', checked)}
                  />
                  <Label htmlFor="showPromoBanner">Show Promo Banner</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commerce">
            <Card>
              <CardHeader>
                <CardTitle>Commerce Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.commerce.freeShippingThreshold}
                    onChange={(e) => handleInputChange('commerce', 'freeShippingThreshold', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="shippingCost">Standard Shipping Cost (₹)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={settings.commerce.shippingCost}
                    onChange={(e) => handleInputChange('commerce', 'shippingCost', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.commerce.taxRate}
                    onChange={(e) => handleInputChange('commerce', 'taxRate', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="codAvailable"
                    checked={settings.commerce.codAvailable}
                    onCheckedChange={(checked) => handleInputChange('commerce', 'codAvailable', checked)}
                  />
                  <Label htmlFor="codAvailable">Cash on Delivery Available</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="orderUpdates"
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'orderUpdates', checked)}
                  />
                  <Label htmlFor="orderUpdates">Order Update Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="promoEmails"
                    checked={settings.notifications.promoEmails}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'promoEmails', checked)}
                  />
                  <Label htmlFor="promoEmails">Promotional Emails</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Textarea
                    id="keywords"
                    value={settings.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                  />
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
