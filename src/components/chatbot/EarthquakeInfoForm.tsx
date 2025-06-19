"use client";

import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { earthquakeInfo, type EarthquakeInfoOutput } from "@/ai/flows/earthquake-info";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Info, Loader2, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(5, { message: "Query must be at least 5 characters." }),
});

export function EarthquakeInfoForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EarthquakeInfoOutput | null>(null);
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
        const res = await earthquakeInfo({ query: values.query });
        setResult(res);
      } catch (error) {
        console.error("Error fetching earthquake info:", error);
        toast({
          title: "Error",
          description: "Failed to get earthquake information. Please try again.",
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
            Earthquake Information
        </CardTitle>
        <CardDescription>
          Ask questions about earthquakes (e.g., "What causes earthquakes?", "Tell me about the San Andreas Fault.").
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
                    <Textarea placeholder="e.g., What are seismic waves?" {...field} rows={3} />
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
