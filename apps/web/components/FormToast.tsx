"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function ToastWithTitle({ autoShow = false }: { autoShow?: boolean }) {
  const { toast } = useToast();

  useEffect(() => {
    if (autoShow) {
      toast({
        title: "Thank You! Your details have been submitted.",
        description: "You are now being redirected to a new page.",
      });
    }
  }, [autoShow, toast]);

  return null;
}
