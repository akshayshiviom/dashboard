
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Plus, Calendar, Filter, BarChart3, Users, Tag, Package } from 'lucide-react';
import { Customer, Partner, Product, User } from '../types';
import CustomReportDialog from './CustomReportDialog';

interface ReportsProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  users: User[];
}

const Reports = ({ customers, partners, products, users }: ReportsProps) => {
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);

  const predefinedReports = [
    {
      id: 'customer-summary',
      title: 'Customer Summary Report',
      description: 'Overview of all customers with status and value metrics',
      category: 'customers',
      lastGenerated: new Date('2024-06-08'),
    },
    {
      id: 'partner-performance',
      title: 'Partner Performance Report',
      description: 'Partner revenue and customer acquisition metrics',
      category: 'partners',
      lastGenerated: new Date('2024-06-07'),
    },
    {
      id: 'product-adoption',
      title: 'Product Adoption Report',
      description: 'Product usage and customer adoption analytics',
      category: 'products',
      lastGenerated: new Date('2024-06-06'),
    },
    {
      id: 'renewal-tracking',
      title: 'Renewal Tracking Report',
      description: 'Upcoming renewals with partner and customer information',
      category: 'renewals',
      lastGenerated: new Date('2024-06-08'),
    },
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline Report',
      description: 'Current sales opportunities and conversion rates',
      category: 'sales',
      lastGenerated: new Date('2024-06-08'),
    },
    {
      id: 'user-activity',
      title: 'User Activity Report',
      description: 'Team performance and activity tracking',
      category: 'users',
      lastGenerated: new Date('2024-06-05'),
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      customers: 'bg-blue-100 text-blue-800',
      partners: 'bg-green-100 text-green-800',
      products: 'bg-purple-100 text-purple-800',
      renewals: 'bg-orange-100 text-orange-800',
      sales: 'bg-orange-100 text-orange-800',
      users: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`);
    // In a real app, this would generate and download the actual report
  };

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In a real app, this would trigger report generation
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Available Reports</h3>
          <p className="text-muted-foreground">Generate and download business reports</p>
        </div>
        <Button onClick={() => setIsCustomReportOpen(true)} className="gap-2">
          <Plus size={16} />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold">{partners.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{customers.reduce((sum, c) => sum + c.value, 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predefined Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Predefined Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {predefinedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{report.title}</h4>
                    <Badge className={getCategoryColor(report.category)}>
                      {report.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    Last generated: {report.lastGenerated.toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    className="gap-1"
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Dialog */}
      <CustomReportDialog
        open={isCustomReportOpen}
        onOpenChange={setIsCustomReportOpen}
        customers={customers}
        partners={partners}
        products={products}
        users={users}
      />
    </div>
  );
};

export default Reports;
