
import { Badge } from '@/components/ui/badge';
import { ProductPlan } from '../types';

interface ProductPlansCellProps {
  plans: ProductPlan[];
}

const ProductPlansCell = ({ plans }: ProductPlansCellProps) => {
  const getBillingBadgeColor = (billing: string) => {
    switch (billing) {
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'yearly': return 'bg-purple-100 text-purple-800';
      case 'one-time': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!plans || plans.length === 0) {
    return <span className="text-muted-foreground">No plans available</span>;
  }

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  
  return (
    <div className="space-y-1">
      {sortedPlans.map((plan) => (
        <div key={plan.id} className="flex items-center gap-2 text-sm">
          <span className="font-medium">{plan.name}:</span>
          <span>₹{plan.price.toFixed(2)}</span>
          <Badge className={getBillingBadgeColor(plan.billing)} variant="secondary">
            {plan.billing}
          </Badge>
          {plan.isPopular && (
            <Badge variant="default" className="text-xs">Popular</Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductPlansCell;
