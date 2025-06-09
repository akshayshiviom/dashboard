
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BulkImportDialog from './BulkImportDialog';
import { Customer, Partner, Product, User } from '@/types';
import { Upload, Database } from 'lucide-react';

interface ImportDataProps {
  onCustomerImport?: (customers: Customer[]) => void;
  onPartnerImport?: (partners: Partner[]) => void;
  onProductImport?: (products: Product[]) => void;
  onUserImport?: (users: User[]) => void;
}

const ImportData = ({ 
  onCustomerImport, 
  onPartnerImport, 
  onProductImport, 
  onUserImport 
}: ImportDataProps) => {
  const importOptions = [
    {
      title: 'Import Customers',
      description: 'Bulk import customer data from CSV files',
      type: 'customers' as const,
      onImport: onCustomerImport,
      icon: Upload
    },
    {
      title: 'Import Partners',
      description: 'Bulk import partner data from CSV files',
      type: 'partners' as const,
      onImport: onPartnerImport,
      icon: Upload
    },
    {
      title: 'Import Products',
      description: 'Bulk import product data from CSV files',
      type: 'products' as const,
      onImport: onProductImport,
      icon: Upload
    },
    {
      title: 'Import Users',
      description: 'Bulk import user data from CSV files',
      type: 'users' as const,
      onImport: onUserImport,
      icon: Upload
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Database size={24} />
          Import Data
        </h3>
        <p className="text-muted-foreground">Import data from CSV files into the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {importOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.type} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon size={20} />
                  {option.title}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {option.onImport ? (
                  <BulkImportDialog
                    type={option.type}
                    onImport={option.onImport}
                    trigger={
                      <div className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer text-center">
                        <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to import {option.type}</p>
                      </div>
                    }
                  />
                ) : (
                  <div className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center opacity-50">
                    <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Import not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ImportData;
