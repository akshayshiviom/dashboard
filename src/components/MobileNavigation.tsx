
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Building2, 
  Package, 
  PackagePlus,
  Calendar,
  Users2,
  FileBarChart,
  Settings,
  Upload,
  Mail
} from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

const MobileNavigation = ({ activeTab, onTabChange, onClose }: MobileNavigationProps) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'add-customer', label: 'Add Customer', icon: UserPlus },
    { id: 'partners', label: 'Partners', icon: Building2 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PackagePlus },
    { id: 'renewals', label: 'Renewals', icon: Calendar },
    { id: 'user-hierarchy', label: 'Team', icon: Users2 },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'import-data', label: 'Import Data', icon: Upload },
    { id: 'email-templates', label: 'Email Templates', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div key={item.id}>
              {(index === 3 || index === 7 || index === 9) && (
                <Separator className="my-2" />
              )}
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  isActive ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MobileNavigation;
