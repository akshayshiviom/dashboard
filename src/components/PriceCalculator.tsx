
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Package, DollarSign, Percent, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface PriceCalculatorProps {
  products: Product[];
}

const PriceCalculator = ({ products }: PriceCalculatorProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(10);
  const [markup, setMarkup] = useState(0);

  const calculatePrice = () => {
    if (!selectedProduct) return { subtotal: 0, discount: 0, tax: 0, total: 0 };

    const basePrice = selectedProduct.price;
    const subtotal = (basePrice + markup) * quantity;
    const discount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * taxPercent) / 100;
    const total = afterDiscount + tax;

    return {
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      total: total
    };
  };

  const pricing = calculatePrice();

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={20} />
            Product Price Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-select">Select Product</Label>
              <Select onValueChange={handleProductSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="markup">Markup Amount ($)</Label>
              <Input
                id="markup"
                type="number"
                value={markup}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Product Details */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <p className="text-muted-foreground">{selectedProduct.category}</p>
                <Badge className={selectedProduct.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {selectedProduct.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="text-2xl font-bold">${selectedProduct.price.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Subtotal ({quantity} × ${selectedProduct ? (selectedProduct.price + markup).toFixed(2) : '0.00'})</span>
              <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
            </div>
            
            {discountPercent > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-medium">-${pricing.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span>Tax ({taxPercent}%)</span>
              <span className="font-medium">${pricing.tax.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceCalculator;
