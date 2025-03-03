"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/components/ui/chat";
import ChatSidebar from "@/components/chat-sidebar";
import UpgradeDialog from "@/components/UpgradeDialog";
import { Model } from "@/components/ModelSelector";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeploymentPage() {
  // Define a default model
  const defaultModel: Model = {
    value: "deepseek-ai/DeepSeek-R1",
    label: "DeepSeek R1",
    image: "/OrganizationIcons/deepseek-ai.png",
  };

  const [messages, setMessages] = useState<
    { id: string; role: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(defaultModel);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  // Sidebar is open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Access Clerk user data
  const { user } = useUser();
  const usageCount = Number(user?.publicMetadata.usageCount) || 0;
  const isUpgraded = user?.publicMetadata.isUpgraded || false;

  // Listen for window resize to set mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList },
  ) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (!isUpgraded && usageCount >= 3) {
      setShowUpgradeDialog(true);
      return;
    }
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel.value,
        }),
      });
      const data = await response.json();
      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
      };
      setMessages([...newMessages, assistantMessage]);

      if (!isUpgraded) {
        // TODO: Implement metadata update if needed using Clerk's backend API
        console.warn("User metadata update not implemented.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsGenerating(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setShowUpgradeDialog(false);
  };

  return (
    <ClerkProvider>
      <div className="flex h-screen flex-col">
        <SignedOut>
          <div className="flex h-screen flex-col items-center justify-center">
            <p className="mb-4 text-lg">
              You need to sign in to access this page.
            </p>
            <SignInButton mode="modal" />
          </div>
        </SignedOut>

        <SignedIn>
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Image
                src="/aiportalxlogo.svg"
                alt="AI Portal X Logo"
                width={150}
                height={50}
                className="object-contain"
              />
              {/* Toggle Icon moved to right of logo with animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? "open" : "closed"}
                  initial={{ opacity: 0, x: isSidebarOpen ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSidebarOpen ? -10 : 10 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4"
                >
                  <Button onClick={toggleSidebar} variant="ghost">
                    {isSidebarOpen ? (
                      <PanelLeftClose size={20} />
                    ) : (
                      <Settings2 size={20} />
                    )}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
            <UserButton />
          </div>

          {/* Main Content */}
          <div className="relative flex flex-1">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <motion.div
                animate={{
                  width: isSidebarOpen ? 256 : 0,
                  opacity: isSidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <ChatSidebar
                  selectedModel={selectedModel}
                  onSelectModel={(model) => setSelectedModel(model)}
                  onNewChat={handleNewChat}
                />
              </motion.div>
            )}

            {/* Chat Area */}
            <div className="flex-1 border-t">
              <Chat
                messages={messages}
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={handleSubmit}
                isGenerating={isGenerating}
                suggestions={[
                  "What is the weather in Tokyo?",
                  "Tell me about AI inference.",
                ]}
                append={(message: { role: "user"; content: string }) =>
                  setMessages([
                    ...messages,
                    { id: Date.now().toString(), ...message },
                  ])
                }
              />
            </div>

            {/* Mobile Sidebar Drawer */}
            {isMobile && (
              <AnimatePresence>
                {isSidebarOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 z-40 bg-black"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white p-4"
                    >
                      <ChatSidebar
                        selectedModel={selectedModel}
                        onSelectModel={(model) => setSelectedModel(model)}
                        onNewChat={handleNewChat}
                      />
                      {/* Apply button to collapse the drawer */}
                      <Button
                        className="mt-4"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Apply
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            )}
          </div>
          {showUpgradeDialog && <UpgradeDialog isOpen={true} />}
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}
