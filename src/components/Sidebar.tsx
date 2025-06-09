
import { LayoutDashboard, Users, Tag, Plus, Package, UserCheck, FileText, RefreshCw, Settings, Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: Users,
      subItems: [
        { id: 'customers', label: 'View Customers' },
        { id: 'add-customer', label: 'Add Customer', icon: Plus },
      ]
    },
    { id: 'partners', label: 'Partners', icon: Tag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'renewals', label: 'Renewals', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: FileText },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      subItems: [
        { id: 'user-hierarchy', label: 'User Hierarchy', icon: UserCheck },
        { id: 'email-templates', label: 'Email Templates', icon: Mail },
      ]
    },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">CRM Dashboard</h1>
        <p className="text-sm text-muted-foreground">Customer & Partner Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActiveOrSubActive = activeTab === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeTab));
          
          return (
            <div key={item.id}>
              {hasSubItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                        isActiveOrSubActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <DropdownMenuItem
                          key={subItem.id}
                          onClick={() => onTabChange(subItem.id)}
                          className={cn(
                            "flex items-center space-x-3 cursor-pointer",
                            activeTab === subItem.id && "bg-primary/10 text-primary"
                          )}
                        >
                          {SubIcon && <SubIcon size={16} />}
                          <span>{subItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
