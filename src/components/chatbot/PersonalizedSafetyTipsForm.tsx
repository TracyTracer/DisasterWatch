"use client";

import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getPersonalizedSafetyTips, type PersonalizedSafetyTipsOutput } from "@/ai/flows/personalized-safety-tips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Loader2, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  recentDisasterEvents: z.string().min(10, { message: "Please describe recent events (at least 10 characters)." }), // Renamed field
});

export function PersonalizedSafetyTipsForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PersonalizedSafetyTipsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      recentDisasterEvents: "", // Renamed field
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setResult(null);
      try {
        const res = await getPersonalizedSafetyTips({ 
          location: values.location,
          recentDisasterEvents: values.recentDisasterEvents // Updated field name
        });
        setResult(res);
      } catch (error) {
        console.error("Error fetching safety tips:", error);
        toast({
          title: "Error",
          description: "Failed to get safety tips. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
            <ShieldCheck className="mr-2 h-6 w-6 text-accent" />
            Personalized Safety Tips
        </CardTitle>
        <CardDescription>
          Enter your location and any known recent disaster activity to get personalized safety advice.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentDisasterEvents" // Renamed field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Disaster Events</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Felt a strong shake 10 minutes ago; news reports a M5.0 nearby. Or, local flood warnings issued." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Get Safety Tips
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent className="mt-4 border-t border-border pt-4">
          <h4 className="font-semibold mb-2 text-lg">AI Recommendations:</h4>
          <div className="bg-muted p-4 rounded-md text-sm prose prose-sm max-w-none prose-invert">
            {result.safetyRecommendations.split('\n').map((item, index) => item.trim() !== "" && <p key={index}>{item}</p>)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
