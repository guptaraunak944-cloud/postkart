import { Home, Film, PlusSquare, User } from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: 'products', label: 'Products', icon: Home },
  { id: 'reels', label: 'Reels', icon: Film },
  { id: 'upload', label: 'Upload', icon: PlusSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

type BottomNavProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
