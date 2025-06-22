
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface ProductSection {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

const AdminSections = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<ProductSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Load sections from localStorage
    const savedSections = localStorage.getItem('productSections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    } else {
      // Initialize with default sections
      const defaultSections = [
        {
          id: 1,
          name: "Men's Ethnic",
          description: "Traditional and modern ethnic wear for men",
          isActive: true,
          order: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Women's Sarees",
          description: "Beautiful collection of sarees for all occasions",
          isActive: true,
          order: 2,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Kids Collection",
          description: "Adorable ethnic wear for children",
          isActive: true,
          order: 3,
          createdAt: new Date().toISOString()
        }
      ];
      setSections(defaultSections);
      localStorage.setItem('productSections', JSON.stringify(defaultSections));
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Section name is required",
        variant: "destructive"
      });
      return;
    }

    let updatedSections;
    
    if (editingSection) {
      // Update existing section
      updatedSections = sections.map(section => 
        section.id === editingSection.id 
          ? { ...section, ...formData }
          : section
      );
    } else {
      // Add new section
      const newSection: ProductSection = {
        id: Math.max(...sections.map(s => s.id), 0) + 1,
        ...formData,
        order: sections.length + 1,
        createdAt: new Date().toISOString()
      };
      updatedSections = [...sections, newSection];
    }
    
    setSections(updatedSections);
    localStorage.setItem('productSections', JSON.stringify(updatedSections));
    
    // Reset form
    setFormData({ name: '', description: '', isActive: true });
    setShowForm(false);
    setEditingSection(null);
    
    toast({
      title: editingSection ? "Section Updated" : "Section Added",
      description: "Product section has been saved successfully",
    });
  };

  const handleEdit = (section: ProductSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      isActive: section.isActive
    });
    setShowForm(true);
  };

  const handleDelete = (sectionId: number) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    setSections(updatedSections);
    localStorage.setItem('productSections', JSON.stringify(updatedSections));
    
    toast({
      title: "Section Deleted",
      description: "Product section has been removed successfully",
    });
  };

  const toggleSectionStatus = (sectionId: number) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, isActive: !section.isActive }
        : section
    );
    setSections(updatedSections);
    localStorage.setItem('productSections', JSON.stringify(updatedSections));
    
    toast({
      title: "Section Updated",
      description: "Section status has been changed",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Sections</h1>
            <p className="text-gray-600">Manage product categories and sections</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Section Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter section name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter section description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active Section</Label>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingSection ? 'Update' : 'Save'} Section
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSection(null);
                      setFormData({ name: '', description: '', isActive: true });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sections List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Grid3X3 className="w-5 h-5 mr-2" />
                    {section.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section.isActive}
                      onCheckedChange={() => toggleSectionStatus(section.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {section.description || 'No description provided'}
                </p>
                
                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(section.createdAt).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No sections found</h3>
            <p className="text-gray-500 mb-6">Create your first product section to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Section
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSections;
