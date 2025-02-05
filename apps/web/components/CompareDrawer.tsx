"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ModelCC from "@/components/ModelCC";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import CompareSearch from "@/components/CompareSearch";
import { useRouter } from "next/navigation";

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: any;
}

export function CompareDrawer({ isOpen, onClose, model }: CompareDrawerProps) {
  const [selectedModels, setSelectedModels] = useState<any[]>([model]);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleAddModel = () => {
    if (selectedModels.length < 3) {
      setShowSearch(true);
    }
  };

  const handleModelSelect = (index: number, newModel: any) => {
    const updatedModels = [...selectedModels];
    updatedModels[index] = newModel;
    setSelectedModels(updatedModels);
    setShowSearch(false);
  };

  const handleCompare = () => {
    if (selectedModels.length < 2) {
      alert("Select at least 2 models to compare.");
      return;
    }

    setIsLoading(true);

    const slugString = selectedModels.map((model) => model.Model).join("-vs-");
    router.push(`/compare/${slugString}`);
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerTrigger />
      <DrawerContent className="p-4 md:px-12">
        <DrawerHeader>
          <DrawerTitle>Compare AI Models</DrawerTitle>
          <DrawerDescription>
            Select up to 3 models to compare.
          </DrawerDescription>
        </DrawerHeader>
        {showSearch && (
          <div className="mb-4">
            <CompareSearch
              onSelectModel={(model) => {
                setSelectedModels([...selectedModels, model]);
                setShowSearch(false);
              }}
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {selectedModels.map((selectedModel, index) => (
            <div key={index}>
              {selectedModel ? (
                <ModelCC model={selectedModel} />
              ) : (
                <Button
                  variant="outline"
                  className="h-full w-full"
                  onClick={handleAddModel}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              )}
            </div>
          ))}
          {selectedModels.length < 3 && (
            <Button
              variant="outline"
              className="h-full w-full"
              onClick={handleAddModel}
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </div>
        <DrawerFooter className="flex flex-col gap-2">
          <Button
            disabled={isLoading}
            variant="default"
            size="sm"
            onClick={handleCompare}
          >
            {isLoading && (
              <Loader2
                className="-ms-1 me-2 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
            Compare
          </Button>

          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
