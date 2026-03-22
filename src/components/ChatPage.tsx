
"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Send, FilePlus } from "lucide-react";

const avatarPool = [
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=11",
];

type Message = {
  id: number;
  sender: "user" | "ai" | "system";
  text: string;
};

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Assign random avatar on first load
    setUserAvatar(avatarPool[Math.floor(Math.random() * avatarPool.length)]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
    
    return () => {
        document.body.removeChild(script);
    }
  }, []);

  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const geminiMessages = updatedMessages
      .filter((msg) => msg.sender === "user" || msg.sender === "ai")
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    const finalInput = pdfText
      ? `${input.trim()}\n\n---\n(Attached PDF content below)\n\n${pdfText}`
      : input.trim();

    const finalMessages = [...geminiMessages.slice(0, -1), {
      role: "user",
      parts: [{ text: finalInput }],
    }];

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is not set.");
      }
        
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: finalMessages,
            generationConfig: { responseMimeType: "text/plain" },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiText },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: `Error: ${err.message}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    if (!window.pdfjsLib) {
        console.error("pdf.js is not loaded yet.");
        return;
    }
    
    const fileURL = URL.createObjectURL(file);
    const loadingTask = window.pdfjsLib.getDocument(fileURL);

    try {
      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setPdfText(fullText);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "system", text: `1 PDF uploaded: "${file.name}"` },
      ]);
    } catch (err) {
      console.error("PDF parsing error", err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setPdfText(null);
    setUserAvatar(avatarPool[Math.floor(Math.random() * avatarPool.length)]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-background text-foreground">
        <div className="w-full max-w-2xl h-[90%] bg-background text-foreground rounded-xl shadow-lg flex flex-col border border-border">
          {/* Header */}
          <header className="flex justify-between items-center p-4 border-b border-border">
            <h1 className="text-2xl font-semibold">Chat with Bloomly</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                🆕 New Chat
              </Button>
            </div>
          </header>

          {/* Chat Area */}
          <Card className="flex-1 overflow-y-auto rounded-none border-none bg-transparent">
            <CardContent className="space-y-4 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : msg.sender === "ai"
                      ? "justify-start"
                      : "justify-center"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl text-sm break-words ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground order-1"
                        : msg.sender === "ai"
                        ? "bg-card text-card-foreground order-2 border border-border"
                        : "bg-secondary text-secondary-foreground text-xs"
                    }`}
                    {...(msg.sender === "ai"
                      ? {
                          dangerouslySetInnerHTML: {
                            __html: convertMarkdownToHtml(msg.text),
                          },
                        }
                      : { children: msg.text })}
                  />

                  {msg.sender === "user" && userAvatar && (
                    <img
                      src={userAvatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover order-2"
                    />
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    AI
                  </div>
                  <div className="bg-card text-card-foreground text-sm px-4 py-2 rounded-2xl animate-pulse border border-border">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </CardContent>
          </Card>

          {/* Input + Upload */}
          <div className="p-4 border-t flex gap-2 items-center border-border">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="bg-card border-border"
            />
            <Button onClick={handleSend} disabled={isTyping}>
              <Send size={18}/>
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <FilePlus size={18} />
            </Button>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
  );
}
