import { Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  overlayGradient: string;
}

interface AppearanceSettings {
  heroTitle: string;
  heroSubtitle: string;
  promoBanner: string;
  showPromoBanner: boolean;
  heroThumbnail: string;
  trendingCollectionLink: string;
  offerCollectionLink: string;
  backgroundStyle: string;
  colorTheme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  carouselSlides: CarouselSlide[];
}

interface Props {
  settings: AppearanceSettings;
  onUpdate: (field: string, value: any) => void;
  onSlideChange: (slideId: number, field: string, value: string) => void;
  onAddSlide: () => void;
  onRemoveSlide: (slideId: number) => void;
  onThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdminAppearanceSettings = ({
  settings,
  onUpdate,
  onSlideChange,
  onAddSlide,
  onRemoveSlide,
  onThumbnailUpload
}: Props) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-stone-300 rounded-lg p-6">
            <Label className="text-stone-700 font-medium mb-3 block">Hero Thumbnail Image</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onThumbnailUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="border-stone-400 text-stone-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              {settings.heroThumbnail && (
                <img 
                  src={settings.heroThumbnail} 
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
                value={settings.trendingCollectionLink}
                onChange={(e) => onUpdate('trendingCollectionLink', e.target.value)}
                placeholder="#trending or /trending-page"
                className="border-stone-300"
              />
            </div>
            <div>
              <Label htmlFor="offerCollectionLink">Offer Collection Link</Label>
              <Input
                id="offerCollectionLink"
                value={settings.offerCollectionLink}
                onChange={(e) => onUpdate('offerCollectionLink', e.target.value)}
                placeholder="#offers or /offers-page"
                className="border-stone-300"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="promoBanner">Promo Banner Text</Label>
            <Input
              id="promoBanner"
              value={settings.promoBanner}
              onChange={(e) => onUpdate('promoBanner', e.target.value)}
              className="border-stone-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showPromoBanner"
              checked={settings.showPromoBanner}
              onCheckedChange={(checked) => onUpdate('showPromoBanner', checked)}
            />
            <Label htmlFor="showPromoBanner">Show Promo Banner</Label>
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Color Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => onUpdate('primaryColor', e.target.value)}
                  className="w-16 h-10 border-stone-300"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => onUpdate('primaryColor', e.target.value)}
                  className="flex-1 border-stone-300"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => onUpdate('secondaryColor', e.target.value)}
                  className="w-16 h-10 border-stone-300"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => onUpdate('secondaryColor', e.target.value)}
                  className="flex-1 border-stone-300"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => onUpdate('accentColor', e.target.value)}
                  className="w-16 h-10 border-stone-300"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => onUpdate('accentColor', e.target.value)}
                  className="flex-1 border-stone-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carousel Slides */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800 flex items-center justify-between">
            Hero Carousel Slides
            <Button onClick={onAddSlide} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.carouselSlides.map((slide) => (
            <div key={slide.id} className="border border-stone-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-stone-700">Slide {slide.id}</h4>
                {settings.carouselSlides.length > 1 && (
                  <Button
                    onClick={() => onRemoveSlide(slide.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => onSlideChange(slide.id, 'title', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={slide.subtitle}
                    onChange={(e) => onSlideChange(slide.id, 'subtitle', e.target.value)}
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label>Background Gradient</Label>
                  <Input
                    value={slide.bgGradient}
                    onChange={(e) => onSlideChange(slide.id, 'bgGradient', e.target.value)}
                    placeholder="from-amber-200/80 via-orange-200/80 to-yellow-300/80"
                    className="border-stone-300"
                  />
                </div>
                <div>
                  <Label>Overlay Gradient</Label>
                  <Input
                    value={slide.overlayGradient}
                    onChange={(e) => onSlideChange(slide.id, 'overlayGradient', e.target.value)}
                    placeholder="bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-yellow-100/90"
                    className="border-stone-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppearanceSettings;