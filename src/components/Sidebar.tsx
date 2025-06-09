
import { LayoutDashboard, Users, Tag, Plus, Package, UserCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    { id: 'user-hierarchy', label: 'User Hierarchy', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
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
          const isCustomersSection = item.id === 'customers';
          const isActiveOrSubActive = activeTab === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeTab));
          
          return (
            <div key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  isActiveOrSubActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
              
              {/* Sub-items for customers */}
              {isCustomersSection && hasSubItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => onTabChange(subItem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors text-sm",
                          activeTab === subItem.id
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {SubIcon && <SubIcon size={16} />}
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
