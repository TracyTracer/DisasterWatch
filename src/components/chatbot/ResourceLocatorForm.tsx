
"use client";

import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { locateResources, type LocateResourcesOutput, type Resource } from "@/ai/flows/locate-resources-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LocateFixed, Loader2, CheckCircle, Info } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(3, { message: "Resource query must be at least 3 characters." }),
  location: z.string().optional(),
});

export function ResourceLocatorForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LocateResourcesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setResult(null);
      try {
        const res = await locateResources({ 
          query: values.query,
          location: values.location || undefined, // Pass undefined if empty
        });
        setResult(res);
      } catch (error) {
        console.error("Error locating resources:", error);
        toast({
          title: "Error",
          description: "Failed to locate resources. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <LocateFixed className="mr-2 h-6 w-6 text-accent" />
          Find Disaster Resources
        </CardTitle>
        <CardDescription>
          Search for shelters, medical aid, food, water, etc. Optionally provide your location for more relevant results.
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
                  <FormLabel>What resource are you looking for?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Emergency shelters, food distribution points, medical clinics" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your current location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Yangon, near General Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
              Find Resources
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {isPending && !result && (
        <CardContent className="mt-6 border-t border-border pt-6 flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading results...
        </CardContent>
      )}

      {result && result.foundResources && result.foundResources.length > 0 && (
        <CardContent className="mt-6 border-t border-border pt-6">
          <h4 className="font-semibold mb-3 text-lg flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Found Resources:
          </h4>
          <div className="space-y-3">
            {result.foundResources.map((resource: Resource) => (
              <Card key={resource.id} className="bg-muted/50 p-4 shadow-sm">
                <CardTitle className="text-md mb-1 font-medium">{resource.name}</CardTitle>
                <CardDescription className="text-xs mb-2 capitalize text-primary-foreground/80">Type: {resource.type}</CardDescription>
                <p className="text-sm"><strong className="font-medium">Address:</strong> {resource.address}</p>
                {resource.contact && <p className="text-sm"><strong className="font-medium">Contact:</strong> {resource.contact}</p>}
                {resource.operatingHours && <p className="text-sm"><strong className="font-medium">Hours:</strong> {resource.operatingHours}</p>}
                {resource.notes && <p className="text-sm mt-1 italic text-muted-foreground">{resource.notes}</p>}
              </Card>
            ))}
          </div>
        </CardContent>
      )}
      {result && result.foundResources && result.foundResources.length === 0 && (
        <CardContent className="mt-6 border-t border-border pt-6">
          <div className="flex items-center text-muted-foreground">
            <Info className="mr-2 h-5 w-5" />
            <p>No resources found matching your current query and location. Try broadening your search or checking back later.</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
