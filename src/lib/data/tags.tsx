import {
  Code,
  Palette,
  Bug,
  Rocket,
  Users,
  FileText,
  Settings,
  Zap,
  Shield,
  Database,
  Globe,
  Smartphone,
  TestTube,
  BookOpen,
  Target
} from 'lucide-react';

export interface TaskTag {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const taskTags: TaskTag[] = [
  {
    id: 'development',
    name: 'Development',
    color: 'bg-blue-500',
    icon: Code
  },
  {
    id: 'design',
    name: 'Design',
    color: 'bg-purple-500',
    icon: Palette
  },
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    color: 'bg-red-500',
    icon: Bug
  },
  {
    id: 'feature',
    name: 'Feature',
    color: 'bg-green-500',
    icon: Rocket
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    color: 'bg-yellow-500',
    icon: Users
  },
  {
    id: 'documentation',
    name: 'Documentation',
    color: 'bg-indigo-500',
    icon: FileText
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    color: 'bg-gray-500',
    icon: Settings
  },
  {
    id: 'performance',
    name: 'Performance',
    color: 'bg-orange-500',
    icon: Zap
  },
  {
    id: 'security',
    name: 'Security',
    color: 'bg-rose-500',
    icon: Shield
  },
  {
    id: 'database',
    name: 'Database',
    color: 'bg-teal-500',
    icon: Database
  },
  {
    id: 'frontend',
    name: 'Frontend',
    color: 'bg-cyan-500',
    icon: Globe
  },
  {
    id: 'mobile',
    name: 'Mobile',
    color: 'bg-pink-500',
    icon: Smartphone
  },
  {
    id: 'testing',
    name: 'Testing',
    color: 'bg-lime-500',
    icon: TestTube
  },
  {
    id: 'research',
    name: 'Research',
    color: 'bg-amber-500',
    icon: BookOpen
  },
  {
    id: 'planning',
    name: 'Planning',
    color: 'bg-emerald-500',
    icon: Target
  }
];

export default taskTags;