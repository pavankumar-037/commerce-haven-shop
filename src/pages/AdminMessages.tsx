
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Search, 
  Eye, 
  Trash2,
  MailOpen,
  Clock,
  Phone,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminSidebar from '@/components/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'read' | 'unread';
}

const AdminMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem('contactMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [navigate]);

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageDialog(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      const updatedMessages = messages.map(m => 
        m.id === message.id ? { ...m, status: 'read' as const } : m
      );
      setMessages(updatedMessages);
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(m => m.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    
    toast({
      title: "Message Deleted",
      description: "Contact message has been removed successfully",
    });
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">
              Manage customer inquiries and messages ({unreadCount} unread)
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages by name, email, subject, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`border rounded-lg p-4 ${
                    message.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{message.name}</h3>
                        <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                          {message.status === 'unread' ? (
                            <>
                              <Mail className="w-3 h-3 mr-1" />
                              Unread
                            </>
                          ) : (
                            <>
                              <MailOpen className="w-3 h-3 mr-1" />
                              Read
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {message.email}
                        </p>
                        {message.phone && (
                          <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {message.phone}
                          </p>
                        )}
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {message.subject && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Subject: </span>
                      <span className="text-sm text-gray-700">{message.subject}</span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Message: </span>
                    {message.message.length > 150 
                      ? `${message.message.substring(0, 150)}...` 
                      : message.message
                    }
                  </div>
                </div>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No contact messages yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Name:</Label>
                    <p>{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Email:</Label>
                    <p>{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <Label className="font-semibold">Phone:</Label>
                      <p>{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="font-semibold">Date:</Label>
                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedMessage.subject && (
                  <div>
                    <Label className="font-semibold">Subject:</Label>
                    <p>{selectedMessage.subject}</p>
                  </div>
                )}
                
                <div>
                  <Label className="font-semibold">Message:</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your Inquiry'}`);
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Button onClick={() => setShowMessageDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminMessages;
