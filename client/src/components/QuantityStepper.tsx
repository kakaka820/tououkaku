import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  quantity,
  onChange,
  min = 0,
  max = 99,
}: QuantityStepperProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2" data-testid="quantity-stepper">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
        data-testid="button-quantity-decrease"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        className="w-8 text-center text-lg font-semibold tabular-nums"
        data-testid="text-quantity"
      >
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={increase}
        disabled={quantity >= max}
        data-testid="button-quantity-increase"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
