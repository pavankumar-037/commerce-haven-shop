import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Search,
  Trash2,
  Eye,
  Reply,
  Clock,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import {
  userMessagesService,
  type UserMessage,
} from "@/integrations/supabase/userMessages";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

const AdminMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin/login");
      return;
    }

    const savedMessages = localStorage.getItem("contactMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [navigate]);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || message.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter((m) => m.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));
    toast({
      title: "Message Deleted",
      description: "Message has been removed successfully",
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    const updatedMessages = messages.map((m) =>
      m.id === messageId ? { ...m, status: "read" as const } : m,
    );
    setMessages(updatedMessages);
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      handleMarkAsRead(message.id);
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    const updatedMessages = messages.map((m) =>
      m.id === selectedMessage.id ? { ...m, status: "replied" as const } : m,
    );
    setMessages(updatedMessages);
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));

    toast({
      title: "Reply Sent",
      description: `Reply sent to ${selectedMessage.email}`,
    });

    setReplyText("");
    setShowReplyForm(false);
    setSelectedMessage(null);
  };

  const getStatusColor = (status: ContactMessage["status"]) => {
    switch (status) {
      case "unread":
        return "bg-blue-500";
      case "read":
        return "bg-yellow-500";
      case "replied":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: ContactMessage["status"]) => {
    switch (status) {
      case "unread":
        return Clock;
      case "read":
        return Eye;
      case "replied":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Messages
            </h1>
            <p className="text-gray-600">
              Manage customer inquiries and support requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {messages.filter((m) => m.status === "unread").length} Unread
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const StatusIcon = getStatusIcon(message.status);
              return (
                <Card
                  key={message.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {message.name}
                        </h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {message.subject}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(message.status)} text-white`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {message.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {message.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
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
                  </CardContent>
                </Card>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No messages found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Message Details</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sender">From</Label>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.email}
                  </p>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="date">Date</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm">{selectedMessage.message}</p>
                  </div>
                </div>

                {!showReplyForm ? (
                  <Button
                    onClick={() => setShowReplyForm(true)}
                    className="w-full"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Label htmlFor="reply">Reply</Label>
                    <Textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSendReply} className="flex-1">
                        Send Reply
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
