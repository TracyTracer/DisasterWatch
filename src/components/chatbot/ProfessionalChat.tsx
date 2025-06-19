
"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { disasterInfo, type DisasterInfoInput } from "@/ai/flows/disaster-info";
import type { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BotMessageSquare, Loader2, Send, UserCircle, Paperclip, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
  photo: z.custom<FileList>().optional(),
});

export function ProfessionalChat() {
  const [isPending, startTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
        setPreviewImage(null);
        form.setValue("photo", undefined);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Only JPG, PNG, WEBP, GIF allowed.", variant: "destructive" });
        setPreviewImage(null);
        form.setValue("photo", undefined);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("photo", event.target.files);
    } else {
      setPreviewImage(null);
      form.setValue("photo", undefined);
    }
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    form.setValue("photo", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let photoDataUri: string | undefined = undefined;
    if (values.photo && values.photo.length > 0 && previewImage) {
       photoDataUri = previewImage; // Already a data URI from preview
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: values.message,
      timestamp: new Date(),
      photoDataUri: photoDataUri,
    };
    setChatMessages(prev => [...prev, userMessage]);
    form.reset();
    setPreviewImage(null); // Clear preview after sending
    if (fileInputRef.current) fileInputRef.current.value = "";


    startTransition(async () => {
      try {
        const aiPayload: DisasterInfoInput = { query: values.message };
        if (userMessage.photoDataUri) {
          aiPayload.photoDataUri = userMessage.photoDataUri;
        }
        const aiResponse = await disasterInfo(aiPayload);
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
          Ask questions or seek guidance. You can also upload an image.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[280px] p-4 space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start gap-2.5 max-w-[75%]`}>
                {msg.sender === 'ai' && <BotMessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                 <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} p-3 rounded-lg shadow`}>
                    <p className="text-sm font-normal leading-snug">{msg.text}</p>
                    {msg.photoDataUri && (
                      <div className="mt-2 relative w-full max-w-[200px] aspect-video rounded-md border border-border overflow-hidden">
                        <Image src={msg.photoDataUri} alt="Uploaded image" layout="fill" objectFit="contain" />
                      </div>
                    )}
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
      
      {previewImage && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Image Preview:</p>
            <Button variant="ghost" size="sm" onClick={removePreviewImage} aria-label="Remove image preview">
              <XCircle className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
          <div className="relative w-full max-w-[150px] h-auto aspect-video rounded-md border border-border overflow-hidden">
            <Image src={previewImage} alt="Preview" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}

      <CardFooter className="border-t border-border pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2">
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
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          // field.onChange(e.target.files) // RHF handles this internally
                          handleFileChange(e);
                        }}
                        id="chat-file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                        aria-label="Attach image"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || !form.formState.isValid && !previewImage} size="icon" aria-label="Send message">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
