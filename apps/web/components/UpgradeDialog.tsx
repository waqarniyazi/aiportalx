"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UpgradeDialogProps {
  isOpen: boolean;
}

export default function UpgradeDialog({ isOpen }: UpgradeDialogProps) {
  const router = useRouter();
  const handleUpgrade = () => {
    router.push("/pricing");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogDescription>
            You have reached your message limit for this session. Upgrade now
            for advanced models.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleUpgrade}>Upgrade</Button>
      </DialogContent>
    </Dialog>
  );
}
