import collegeLogo from '@/assets/college-logo.png';
import todoImage from '@/assets/todo-image.png';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <img src={todoImage} alt="To-Do List" className="w-12 h-12 object-contain" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
      </div>
      {subtitle && (
        <div className="flex items-center gap-3">
          <img src={collegeLogo} alt="College Logo" className="w-10 h-10 object-contain" />
          <span className="text-lg font-medium text-muted-foreground">{subtitle}</span>
        </div>
      )}
    </div>
  );
}
