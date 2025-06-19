"use client";

import { useState, useTransition, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { assessDisasterSeverity, type AssessDisasterSeverityOutput } from "@/ai/flows/assess-disaster-severity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2, ImagePlus, CheckCircle, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  photo: z.custom<FileList>()
    .optional()
    .refine(files => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      files => !files || files.length === 0 || ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
});

export function DisasterSeverityAssessmentForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AssessDisasterSeverityOutput | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("photo", { type: "manual", message: "Max file size is 5MB." });
        setPreviewImage(null);
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        form.setError("photo", { type: "manual", message: "Invalid file type." });
        setPreviewImage(null);
        return;
      }
      form.clearErrors("photo");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      form.setValue("photo", undefined); // Clear the value if no file is selected
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setResult(null);
      try {
        let photoDataUri: string | undefined = undefined;
        if (values.photo && values.photo.length > 0) {
          const file = values.photo[0];
          photoDataUri = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        const res = await assessDisasterSeverity({
          description: values.description,
          photoDataUri: photoDataUri,
        });
        setResult(res);
      } catch (error) {
        console.error("Error assessing severity:", error);
        toast({
          title: "Error",
          description: "Failed to get severity assessment. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ShieldAlert className="mr-2 h-6 w-6 text-accent" />
          Assess Disaster Severity
        </CardTitle>
        <CardDescription>
          Describe the situation and optionally upload a photo for an AI-powered severity assessment and safety recommendations.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of the Situation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Strong wind, trees falling, minor flooding in streets..." {...field} rows={4} />
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
                  <FormLabel>Upload Photo (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      ref={fileInputRef}
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleFileChange(e);
                      }}
                      className="cursor-pointer"
                      aria-describedby="photo-help"
                    />
                  </FormControl>
                  <p id="photo-help" className="text-sm text-muted-foreground">Max 5MB. JPG, PNG, WEBP, GIF.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {previewImage && (
              <div className="mt-4">
                <FormLabel>Image Preview:</FormLabel>
                <div className="mt-2 relative w-full max-w-xs h-auto aspect-video rounded-md border border-border overflow-hidden">
                  <Image src={previewImage} alt="Preview" layout="fill" objectFit="contain" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Assess Severity
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent className="mt-6 border-t border-border pt-6">
          <h4 className="font-semibold mb-3 text-lg flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            AI Assessment:
          </h4>
          <div className="bg-muted p-4 rounded-md space-y-4">
            <div>
              <p className="font-medium text-primary-foreground">Severity:</p>
              <p className="text-sm">{result.severityAssessment}</p>
            </div>
            {result.potentialHazards && result.potentialHazards.length > 0 && (
              <div>
                <p className="font-medium text-primary-foreground">Potential Hazards:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {result.potentialHazards.map((hazard, index) => (
                    <li key={index}>{hazard}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.recommendedActions && result.recommendedActions.length > 0 && (
               <div>
                <p className="font-medium text-primary-foreground">Recommended Actions:</p>
                <ul className="list-decimal list-inside text-sm space-y-1">
                  {result.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
