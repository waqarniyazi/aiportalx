// components/ModelCTA.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompareDrawer } from "@/components/CompareDrawer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MyForm } from "@/components/MyForm";
import { MeteorDemo } from "@/components/FormLanding";

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
        className="flex items-center justify-center gap-1 px-4 py-2"
        onClick={handleCompareClick}
      >
        <img src="/tableicons/compare.svg" alt="compare" className="h-5 w-5" />
        Compare
      </Button>

      {/* Use Model Button with Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-800"
          >
            <img
              src="/tableicons/monitor.svg"
              alt="use model"
              className="no-dark-filter h-5 w-5"
            />
            Use Model
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-auto max-h-[100vh] w-full max-w-4xl overflow-auto p-4">
          <div className="flex w-full flex-col overflow-x-hidden md:flex-row md:gap-4">
            {/* Reduced width for FormLanding */}
            <div className="hidden w-full md:block md:w-1/3">
              <MeteorDemo />
            </div>
            {/* MyForm gets preference with 2/3 width */}
            <div className="w-full md:w-2/3">
              <MyForm model={model} />
            </div>
          </div>
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
