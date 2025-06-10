
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter, Search } from 'lucide-react';
import { Partner, Product } from '../types';

interface CustomerTableFiltersProps {
  partners: Partner[];
  products: Product[];
  onStatusFilter: (status: string) => void;
  onProcessFilter: (process: string) => void;
  onPartnerFilter: (partnerId: string) => void;
  onZoneFilter: (zone: string) => void;
  onProductFilter?: (productId: string) => void;
}

const CustomerTableFilters = ({ 
  partners, 
  products,
  onStatusFilter, 
  onProcessFilter,
  onPartnerFilter, 
  onZoneFilter,
  onProductFilter
}: CustomerTableFiltersProps) => {
  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => 
      partner.name.toLowerCase().includes(partnerSearchTerm.toLowerCase())
    );
  }, [partners, partnerSearchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [products, productSearchTerm]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onStatusFilter('all')}>
              All statuses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Process
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onProcessFilter('all')}>
              All processes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onProcessFilter('prospect')}>
              Prospect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('demo')}>
              Demo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('poc')}>
              POC
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('negotiating')}>
              Negotiating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('won')}>
              Won
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('lost')}>
              Lost
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onProcessFilter('deployment')}>
              Deployment
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Partner
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <div className="p-2">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
                  value={partnerSearchTerm}
                  onChange={(e) => setPartnerSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-48 overflow-y-auto">
              <DropdownMenuItem onClick={() => onPartnerFilter('all')}>
                All partners
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPartnerFilter('unassigned')}>
                Unassigned
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {filteredPartners.map((partner) => (
                <DropdownMenuItem key={partner.id} onClick={() => onPartnerFilter(partner.id)}>
                  {partner.name}
                </DropdownMenuItem>
              ))}
              {filteredPartners.length === 0 && partnerSearchTerm && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No partners found
                </div>
              )}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {onProductFilter && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Filter by Product
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-64">
              <div className="p-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-48 overflow-y-auto">
                <DropdownMenuItem onClick={() => onProductFilter('all')}>
                  All products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {filteredProducts.map((product) => (
                  <DropdownMenuItem key={product.id} onClick={() => onProductFilter(product.id)}>
                    {product.name}
                  </DropdownMenuItem>
                ))}
                {filteredProducts.length === 0 && productSearchTerm && (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Zone
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onZoneFilter('all')}>
              All zones
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onZoneFilter('north')}>
              North
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('east')}>
              East
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('west')}>
              West
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('south')}>
              South
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerTableFilters;
