
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Package, DollarSign, Plus, Minus, Download, Trash2 } from 'lucide-react';
import { Product, User, CalculationItem } from '../types';

interface PriceCalculatorProps {
  products: Product[];
  users: User[];
}

const PriceCalculator = ({ products, users }: PriceCalculatorProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [calculationItems, setCalculationItems] = useState<CalculationItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const roleDiscounts = {
    'admin': 25,
    'manager': 20,
    'team-leader': 15,
    'assistant-manager': 12,
    'fsr': 10,
    'bde': 8
  };

  const addProductToCalculation = () => {
    if (!selectedProductId || !selectedUser) return;

    const existingItemIndex = calculationItems.findIndex(item => item.productId === selectedProductId);
    const userDiscount = roleDiscounts[selectedUser.role] || 0;

    if (existingItemIndex >= 0) {
      const updatedItems = [...calculationItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCalculationItems(updatedItems);
    } else {
      const newItem: CalculationItem = {
        productId: selectedProductId,
        quantity,
        userDiscount
      };
      setCalculationItems([...calculationItems, newItem]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    setCalculationItems(calculationItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = calculationItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCalculationItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = calculationItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      return sum + (product.price * item.quantity);
    }, 0);

    const totalDiscount = calculationItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      const itemTotal = product.price * item.quantity;
      const itemDiscount = (itemTotal * item.userDiscount) / 100;
      return sum + itemDiscount;
    }, 0);

    const finalTotal = subtotal - totalDiscount;

    return { subtotal, totalDiscount, finalTotal };
  };

  const downloadCalculation = () => {
    if (!selectedUser || calculationItems.length === 0) return;

    const { subtotal, totalDiscount, finalTotal } = calculateTotals();
    
    let csvContent = "Product Name,Quantity,Unit Price,Line Total,Discount %,Discount Amount,Final Line Total\n";
    
    calculationItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      
      const lineTotal = product.price * item.quantity;
      const discountAmount = (lineTotal * item.userDiscount) / 100;
      const finalLineTotal = lineTotal - discountAmount;
      
      csvContent += `"${product.name}",${item.quantity},${product.price.toFixed(2)},${lineTotal.toFixed(2)},${item.userDiscount}%,${discountAmount.toFixed(2)},${finalLineTotal.toFixed(2)}\n`;
    });
    
    csvContent += `\nSubtotal,,,,,$${subtotal.toFixed(2)}\n`;
    csvContent += `Total Discount,,,,,$${totalDiscount.toFixed(2)}\n`;
    csvContent += `Final Total,,,,,$${finalTotal.toFixed(2)}\n`;
    csvContent += `\nUser: ${selectedUser.name}\n`;
    csvContent += `Role: ${selectedUser.role}\n`;
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-calculation-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { subtotal, totalDiscount, finalTotal } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={20} />
            Multi-Product Price Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="user-select">Select User (for discount calculation)</Label>
            <Select onValueChange={(userId) => {
              const user = users.find(u => u.id === userId);
              setSelectedUser(user || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      {user.name} - {user.role} ({roleDiscounts[user.role] || 0}% discount)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Selected User:</strong> {selectedUser.name} ({selectedUser.role})
              </p>
              <p className="text-sm text-muted-foreground">
                Discount Rate: {roleDiscounts[selectedUser.role] || 0}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Addition */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Add Products to Calculation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product-select">Select Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.filter(p => p.status === 'active').map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          {product.name} - ${product.price}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={addProductToCalculation}
                  disabled={!selectedProductId}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculation Table */}
      {calculationItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calculation Summary</span>
              <Button onClick={downloadCalculation} variant="outline">
                <Download size={16} className="mr-2" />
                Download CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Line Total</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Final Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationItems.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  
                  const lineTotal = product.price * item.quantity;
                  const discountAmount = (lineTotal * item.userDiscount) / 100;
                  const finalLineTotal = lineTotal - discountAmount;

                  return (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${lineTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.userDiscount}% (-${discountAmount.toFixed(2)})
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${finalLineTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg text-green-600">
                <span>Total Discount:</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Final Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PriceCalculator;
