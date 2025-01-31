// components/ModelCTA.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompareDrawer } from "@/components/CompareDrawer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MyForm } from "@/components/MyForm";

interface ModelCTAProps {
  model: any; // Replace 'any' with the actual Model type if defined
}

export default function ModelCTA({ model }: ModelCTAProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCompareClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {/* Compare Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center gap-1 bg-white px-4 py-2"
        onClick={handleCompareClick}
      >
        <img src="/tableicons/compare.svg" alt="compare" className="h-5 w-5" />
        Compare
      </Button>

      {/* Use Model Button with Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-1 bg-white px-4 py-2"
          >
            <img
              src="/tableicons/monitor.svg"
              alt="use model"
              className="h-5 w-5"
            />
            Use Model
          </Button>
        </DialogTrigger>
        <DialogContent>
          <MyForm />
        </DialogContent>
      </Dialog>

      {/* Compare Drawer */}
      {isDrawerOpen && (
        <CompareDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          model={model}
        />
      )}
    </div>
  );
}
