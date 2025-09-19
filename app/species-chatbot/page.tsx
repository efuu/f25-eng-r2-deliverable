"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export default function SpeciesChatbot() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      // stop it from going to a new line
      e.preventDefault();

      if (!isProcessing) {
        void handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {

    const text = message.trim();
    if (!text || isProcessing) return;

    setIsProcessing(true);

    setChatLog((prev) => [...prev, { role: "user", content: text }]);

    setMessage("");



    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),

      });
      const data = await response.json();
      //needs some fixing for showing the chatbot response
      setChatLog((prev) => [...prev, { role: "bot", content: data.response }]);


    } catch {
      setChatLog((prev) => [...prev, { role: "bot", content: "Error contacting server." }]);
    } finally {
      setIsProcessing(false);
    }



  }

  return (
    <>
      {/* <TypographyH2>Species Chatbot</TypographyH2> */}
      <div className="mt-4 flex gap-4">
        {/* <div className="mt-4 rounded-lg bg-foreground p-4 text-background">
 
        </div> */}
      </div>

      <div className="flex items-center justify-between">
        <TypographyH2>Species Chatbot</TypographyH2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-4">Learn More</Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                <h3 className="mt-3 text-2xl font-semibold">Species Chatbot</h3>
              </DialogTitle>
            </DialogHeader>
            <TypographyP>
              Species Chatbot answers questions about animals and plants, their habitat, 
              diet, and conservation status.
            </TypographyP>
          </DialogContent>
        </Dialog>
      </div>



      {/* Chat UI, ChatBot to be implemented */}
      <div className="mx-auto mt-6">
        {/* Chat history */}
        <div className="h-[600px] space-y-3 overflow-y-auto rounded-lg border border-border bg-muted p-4">
          {chatLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start chatting about a species!</p>
          ) : (
            chatLog.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${msg.role === "user"
                    ? "rounded-br-none bg-primary text-primary-foreground"
                    : "rounded-bl-none border border-border bg-foreground text-primary-foreground"
                    }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        {/* Textarea and submission */}
        <div className="mt-4 flex flex-col items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about a species..."
            className="w-full resize-none max-h-40 overflow-y-auto rounded border border-border bg-background p-2 text-sm text-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
            disabled={isProcessing}
          >
            {isProcessing ? "Waiting..." : "Enter"}
          </button>
        </div>
      </div>
    </>
  );
}
