import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Shield, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TaskItem } from '@/components/TaskItem';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Load tasks from localStorage for demo purposes
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask('');
    
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      <div className="max-w-xl mx-auto px-4 py-8 md:py-12">
        <Header 
          title="Task Manager" 
          subtitle={`Welcome, ${user?.name || 'User'}`} 
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <ListTodo className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-8 animate-slide-up">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={!newTask.trim()}>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline ml-1">Add</span>
            </Button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-3 mb-8">
          {tasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <ListTodo className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No tasks yet!</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Add your first task above</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
          {isAdmin && (
            <Button
              variant="success"
              onClick={() => navigate('/admin')}
              className="flex-1"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="flex-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
