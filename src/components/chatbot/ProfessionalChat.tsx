
"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { disasterInfo } from "@/ai/flows/disaster-info";
import type { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BotMessageSquare, Loader2, Send, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

export function ProfessionalChat() {
  const [isPending, startTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: values.message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    form.reset();

    startTransition(async () => {
      try {
        const aiResponse = await disasterInfo({ query: values.message });
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponse.answer,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive",
        });
        const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            sender: 'ai',
            text: "Sorry, I couldn't process your request right now.",
            timestamp: new Date(),
        }
        setChatMessages(prev => [...prev, errorMessage]);
      }
    });
  }

  return (
    <Card className="shadow-lg flex flex-col h-full max-h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <BotMessageSquare className="mr-2 h-6 w-6 text-accent" />
          Chat with Disaster Support AI
        </CardTitle>
        <CardDescription>
          Ask questions or seek guidance about disaster situations. This AI is here to help.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[300px] p-4 space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start gap-2.5 max-w-[75%]`}>
                {msg.sender === 'ai' && <BotMessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                 <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} p-3 rounded-lg shadow`}>
                    <p className="text-sm font-normal leading-snug">{msg.text}</p>
                 </div>
                {msg.sender === 'user' && <UserCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />}
              </div>
              <span className={`text-xs ${msg.sender === 'user' ? 'text-right' : 'text-left'} text-muted-foreground mt-1 mr-1 ml-1`}>
                {format(msg.timestamp, "p")}
              </span>
            </div>
          ))}
          {isPending && chatMessages[chatMessages.length -1]?.sender === 'user' && (
            <div className="flex items-start gap-2.5 max-w-[75%]">
              <BotMessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="bg-muted text-muted-foreground p-3 rounded-lg shadow">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} disabled={isPending} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} size="icon" aria-label="Send message">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
