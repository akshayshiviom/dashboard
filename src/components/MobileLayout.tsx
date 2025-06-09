
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const MobileLayout = ({ sidebar, children }: MobileLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

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
          <h1 className="text-lg font-semibold">Customer Hub</h1>
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
