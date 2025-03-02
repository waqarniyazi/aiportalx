// components/orderdialog.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PricingPlan } from "@/components/pricing";

interface OrderDialogProps {
  plan: PricingPlan | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function OrderDialog({ plan, onConfirm, onClose }: OrderDialogProps) {
  // If no plan is selected, do not render the dialog.
  if (!plan) return null;

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <p>
          You have selected the <strong>{plan.name}</strong> plan.
        </p>
        <p>
          Price: {plan.price} {plan.period === "month" ? "/ month" : ""}
        </p>
        <button className="btn btn-secondary mt-4" onClick={onConfirm}>
          Confirm Payment
        </button>
      </DialogContent>
    </Dialog>
  );
}
