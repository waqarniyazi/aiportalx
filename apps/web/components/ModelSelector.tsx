// components/ModelSelector.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define your models with their value, label, and image path.
const models = [
  {
    value: "meta-llama/Llama-3.1-8B-Instruct",
    label: "Llama 3.1 8B Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "meta-llama/Llama-3.2-3B-Instruct",
    label: "Llama 3.2 3B Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "meta-llama/Llama-3.3-70B-Instruct",
    label: "Llama 3.3 70B Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "Qwen/Qwen2.5-72B-Instruct",
    label: "Qwen 2.5 72B Instruct",
    image: "/OrganizationIcons/qwen.png",
  },
  {
    value: "Qwen/QwQ-32B-Preview",
    label: "QwQ 32B Preview",
    image: "/OrganizationIcons/qwen.png",
  },
  {
    value: "01-ai/Yi-1.5-34B-Chat",
    label: "Yi 1.5 34B Chat",
    image: "/OrganizationIcons/01-ai.png",
  },
  {
    value: "deepseek-ai/DeepSeek-R1",
    label: "DeepSeek R1",
    image: "/OrganizationIcons/deepseek-ai.png",
  },
  {
    value: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
    label: "DeepSeek R1 Distill Qwen 1.5B",
    image: "/OrganizationIcons/deepseek-ai.png",
  },
  {
    value: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    label: "DeepSeek R1 Distill Qwen 32B",
    image: "/OrganizationIcons/deepseek-ai.png",
  },
  {
    value: "google/gemma-2-27b-it",
    label: "Gemma 2 27B IT",
    image: "/OrganizationIcons/google.png",
  },
  {
    value: "google/gemma-2-2b-it",
    label: "Gemma 2 2B IT",
    image: "/OrganizationIcons/google.png",
  },
  {
    value: "HuggingFaceH4/starchat2-15b-v0.1",
    label: "Starchat 2 15B v0.1",
    image: "/OrganizationIcons/huggingfaceh4.png",
  },
  {
    value: "Hugging FaceH4/zephyr-7b-alpha",
    label: "Zephyr 7B Alpha",
    image: "/OrganizationIcons/huggingfaceh4.png",
  },
  {
    value: "HuggingFaceH4/zephyr-7b-beta",
    label: "Zephyr 7B Beta",
    image: "/OrganizationIcons/huggingfaceh4.png",
  },
  {
    value: "meta-llama/Llama-3.1-70B-Instruct",
    label: "Llama 3.1 70B Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "meta-llama/Llama-3.2-18-Instruct",
    label: "Llama 3.2 18 Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "meta-llama/Meta-Llama-3-8B-Instruct",
    label: "Meta-Llama 3 8B Instruct",
    image: "/OrganizationIcons/meta-llama.png",
  },
  {
    value: "microsoft/Phi-3-mini-4k-instruct",
    label: "Phi 3 Mini 4K Instruct",
    image: "/OrganizationIcons/microsoft.png",
  },
  {
    value: "microsoft/Phi-3.5-mini-instruct",
    label: "Phi 3.5 Mini Instruct",
    image: "/OrganizationIcons/microsoft.png",
  },
  {
    value: "mistralai/Mistral-7B-Instruct-v0.2",
    label: "Mistral 7B Instruct v0.2",
    image: "/OrganizationIcons/mistralai.png",
  },
  {
    value: "mistralai/Mistral-7B-Instruct-v0.3",
    label: "Mistral 7B Instruct v0.3",
    image: "/OrganizationIcons/mistralai.png",
  },
  {
    value: "mistralai/Mistral-Nemo-Instruct-2407",
    label: "Mistral Nemo Instruct 2407",
    image: "/OrganizationIcons/mistralai.png",
  },
  {
    value: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    label: "Mixtral 8x7B Instruct v0.1",
    image: "/OrganizationIcons/mistralai.png",
  },
  {
    value: "NousResearch/Hermes-3-Llama-3.1-8B",
    label: "Hermes 3 Llama 3.1 8B",
    image: "/OrganizationIcons/nousresearch.png",
  },
  {
    value: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    label: "Nous Hermes 2 Mixtral 8x7B DPO",
    image: "/OrganizationIcons/nousresearch.png",
  },
  {
    value: "Qwen/Qwen2.5-Coder-32B-Instruct",
    label: "Qwen 2.5 Coder 32B Instruct",
    image: "/OrganizationIcons/qwen.png",
  },
  {
    value: "tiiuae/falcon-7b-instruct",
    label: "Falcon 7B Instruct",
    image: "/OrganizationIcons/tiiuae.png",
  },
];

interface ModelSelectorProps {
  value: string;
  onSelect: (model: string) => void;
}

export default function ModelSelector({ value, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedModel = models.find((m) => m.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedModel ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedModel.image}
                alt={selectedModel.label}
                className="h-6 w-6 object-contain"
              />
              {selectedModel.label}
            </div>
          ) : (
            "Select Model"
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." className="h-9" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <img
                    src={model.image}
                    alt={model.label}
                    className="mr-2 h-5 w-5 object-contain"
                  />
                  {model.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === model.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
