
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Admin credentials validation
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'Super Admin' },
      { username: 'manager', password: 'manager123', role: 'Manager' },
      { username: 'staff', password: 'staff123', role: 'Staff' }
    ];
    
    const validUser = validCredentials.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );
    
    if (validUser) {
      // Store admin authentication and user info
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        username: validUser.username,
        role: validUser.role,
        loginTime: new Date().toISOString()
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome ${validUser.role}! Redirecting to dashboard...`,
      });
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } else {
      setError('Invalid username or password. Please try again.');
      toast({
        title: "Login Failed",
        description: "Invalid credentials provided",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Access CommerceHaven Administration Panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    id="username"
                    className="pl-10"
                    placeholder="Enter admin username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="password"
                    id="password"
                    className="pl-10"
                    placeholder="Enter admin password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded text-sm">
              <strong>Super Admin:</strong><br />
              Username: admin | Password: admin123
            </div>
            <div className="p-3 bg-green-50 rounded text-sm">
              <strong>Manager:</strong><br />
              Username: manager | Password: manager123
            </div>
            <div className="p-3 bg-yellow-50 rounded text-sm">
              <strong>Staff:</strong><br />
              Username: staff | Password: staff123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
