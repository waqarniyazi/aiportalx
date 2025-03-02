"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ModelSelector, { Model } from "@/components/ModelSelector";
import { Plus, ArrowUp } from "lucide-react";

interface ChatSidebarProps {
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  selectedModel,
  onSelectModel,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <ModelSelector selectedModel={selectedModel} onSelect={onSelectModel} />
        <Button
          className="mt-4 flex w-full items-center justify-center"
          onClick={onNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div>
        <Button variant="outline" className="flex w-full flex-col items-center">
          <ArrowUp className="mb-1 h-4 w-4" />
          <span>Upgrade</span>
          <span className="text-xs text-muted-foreground">
            Upgrade for advanced model
          </span>
        </Button>
      </div>
    </div>
  );
}
