
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer, Partner } from '../types';

interface CustomerChartProps {
  customers: Customer[];
  partners: Partner[];
}

const CustomerChart = ({ customers, partners }: CustomerChartProps) => {
  const partnerData = partners.map(partner => ({
    name: partner.name,
    customers: customers.filter(c => c.partnerId === partner.id).length,
    value: customers.filter(c => c.partnerId === partner.id).reduce((sum, c) => sum + c.value, 0),
  }));

  const statusData = [
    { name: 'Active', value: customers.filter(c => c.status === 'active').length, color: '#10b981' },
    { name: 'Pending', value: customers.filter(c => c.status === 'pending').length, color: '#f59e0b' },
    { name: 'Inactive', value: customers.filter(c => c.status === 'inactive').length, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Customers by Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partnerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'customers' ? `${value} customers` : `$${value.toLocaleString()}`,
                name === 'customers' ? 'Customers' : 'Total Value'
              ]} />
              <Legend />
              <Bar dataKey="customers" fill="#3b82f6" name="customers" />
              <Bar dataKey="value" fill="#10b981" name="value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerChart;
