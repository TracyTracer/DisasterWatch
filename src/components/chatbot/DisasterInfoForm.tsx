"use client";

import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { disasterInfo, type DisasterInfoOutput } from "@/ai/flows/disaster-info"; // Updated import
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Info, Loader2, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(5, { message: "Query must be at least 5 characters." }),
});

export function DisasterInfoForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DisasterInfoOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setResult(null);
      try {
        const res = await disasterInfo({ query: values.query }); // Updated function call
        setResult(res);
      } catch (error) {
        console.error("Error fetching disaster info:", error);
        toast({
          title: "Error",
          description: "Failed to get disaster information. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
            <Info className="mr-2 h-6 w-6 text-accent" />
            Disaster Information
        </CardTitle>
        <CardDescription>
          Ask questions about natural disasters (e.g., "What causes tsunamis?", "Tell me about hurricane preparedness.").
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., How are tornadoes formed?" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              Get Information
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent className="mt-4 border-t border-border pt-4">
          <h4 className="font-semibold mb-2 text-lg">AI Response:</h4>
          <div className="bg-muted p-4 rounded-md text-sm prose prose-sm max-w-none prose-invert">
            <p>{result.answer}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
