import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string | null;
  category: 'curated' | 'trending' | 'festival';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const AdminOffersManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    start_date: string;
    end_date: string;
    category: 'curated' | 'trending' | 'festival';
    status: 'active' | 'inactive';
  }>({
    title: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    category: 'curated',
    status: 'active'
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }
    
    fetchOffers();
  }, [navigate]);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch offers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const offerData = {
        ...formData,
        start_date: formData.start_date || new Date().toISOString(),
        end_date: formData.end_date || null
      };

      let result;
      if (editingOffer) {
        result = await supabase
          .from('offers')
          .update(offerData)
          .eq('id', editingOffer.id);
      } else {
        result = await supabase
          .from('offers')
          .insert([offerData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Offer ${editingOffer ? 'updated' : 'created'} successfully`
      });

      setDialogOpen(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Error",
        description: "Failed to save offer",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      image_url: offer.image_url,
      start_date: offer.start_date.split('T')[0],
      end_date: offer.end_date ? offer.end_date.split('T')[0] : '',
      category: offer.category,
      status: offer.status
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Offer deleted successfully"
      });
      
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (offer: Offer) => {
    try {
      const newStatus = offer.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Offer ${newStatus === 'active' ? 'activated' : 'deactivated'}`
      });
      
      fetchOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: "Error",
        description: "Failed to update offer status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      start_date: '',
      end_date: '',
      category: 'curated',
      status: 'active'
    });
    setEditingOffer(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'curated': return 'bg-amber-100 text-amber-800';
      case 'trending': return 'bg-blue-100 text-blue-800';
      case 'festival': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Offers Manager</h1>
            <p className="text-stone-600">Manage offers for Curated Elegance, Trending, and Festival sections</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: 'curated' | 'trending' | 'festival') => 
                        setFormData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curated">Curated Elegance</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="/lovable-uploads/..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                    }
                  />
                  <Label htmlFor="status">Active</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingOffer ? 'Update' : 'Create'} Offer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getCategoryColor(offer.category)}>
                        {offer.category === 'curated' ? 'Curated Elegance' : 
                         offer.category === 'trending' ? 'Trending' : 'Festival'}
                      </Badge>
                      <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                        {offer.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(offer)}
                    className="text-stone-600 hover:text-stone-800"
                  >
                    {offer.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {offer.image_url && (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                <p className="text-sm text-stone-600 line-clamp-2">
                  {offer.description}
                </p>
                
                <div className="text-xs text-stone-500">
                  <div>Start: {new Date(offer.start_date).toLocaleDateString()}</div>
                  {offer.end_date && (
                    <div>End: {new Date(offer.end_date).toLocaleDateString()}</div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(offer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(offer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-stone-400 text-lg mb-4">No offers found</div>
            <p className="text-stone-600 mb-6">Create your first offer to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffersManager;