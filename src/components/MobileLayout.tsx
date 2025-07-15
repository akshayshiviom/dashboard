
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationCenter from '@/components/NotificationCenter';
import { mockTasks } from '@/utils/mockTasks';
import { mockRenewals } from '@/utils/mockRenewals';
import { mockCustomers, mockPartners } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

interface MobileLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const MobileLayout = ({ sidebar, children }: MobileLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { profile } = useAuth();
  const [, setSearchParams] = useSearchParams();

  const handleNotificationClick = (notification: any) => {
    if (notification.actionUrl) {
      // Parse the URL to extract tab and other params
      const url = new URL(notification.actionUrl, window.location.origin);
      const tab = url.searchParams.get('tab');
      const taskId = url.searchParams.get('taskId');
      const customerId = url.searchParams.get('customerId');
      const partnerId = url.searchParams.get('partnerId');
      const renewalId = url.searchParams.get('renewalId');
      
      // Update search params
      const params = new URLSearchParams();
      if (tab) params.set('tab', tab);
      if (taskId) params.set('taskId', taskId);
      if (customerId) params.set('customerId', customerId);
      if (partnerId) params.set('partnerId', partnerId);
      if (renewalId) params.set('renewalId', renewalId);
      
      setSearchParams(params);
    }
  };

  if (!isMobile) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>{sidebar}</Sidebar>
          <SidebarInset className="flex-1">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 border-b bg-background px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <NotificationCenter
              tasks={mockTasks}
              renewals={mockRenewals}
              customers={mockCustomers}
              partners={mockPartners}
              userRole={profile?.role || 'user'}
              userId={profile?.user_id || ''}
              onNotificationClick={handleNotificationClick}
            />
            <h1 className="text-lg font-semibold">Customer Hub</h1>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
