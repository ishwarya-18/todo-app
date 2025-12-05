import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover animate-scale-in",
        task.completed && "bg-muted/50"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          task.completed
            ? "bg-primary border-primary"
            : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10"
        )}
      >
        {task.completed && (
          <Check className="w-4 h-4 text-primary-foreground animate-check" />
        )}
      </button>

      <span
        className={cn(
          "flex-grow text-base transition-all duration-200",
          task.completed
            ? "line-through text-muted-foreground/60"
            : "text-foreground"
        )}
      >
        {task.title}
      </span>

      {task.completed && (
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-2 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
