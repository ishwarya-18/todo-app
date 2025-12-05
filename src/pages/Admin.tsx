import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/tasks');
      return;
    }

    // Mock users data - replace with actual API call
    setUsers([
      { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
      { id: '2', email: 'john@example.com', name: 'John Doe', role: 'user' },
      { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'user' },
    ]);
  }, [isAuthenticated, isAdmin, navigate]);

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/tasks')}
        className="fixed top-4 left-4 z-50 rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 mb-8 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{users.length}</p>
              <p className="text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
