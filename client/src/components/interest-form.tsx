import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),
  skills: z.string().min(5, "Please list your skills"),
});

interface InterestFormProps {
  projectId: string;
  projectName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

async function submitInterest(projectId: string, data: z.infer<typeof formSchema>) {
  const response = await fetch(`/api/projects/${projectId}/interest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit interest");
  }

  return response.json();
}

export function InterestForm({ projectId, projectName, trigger, onSuccess }: InterestFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      skills: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => submitInterest(projectId, data),
    onSuccess: () => {
      toast({
        title: "Interest Submitted!",
        description: `Thanks! The Guild leader for ${projectName} will contact you soon.`,
      });
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button className="w-full">I'm interested</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Join {projectName}</DialogTitle>
          <DialogDescription>
            Share your details and skills to apply for this build project.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-background/50" data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} className="bg-background/50" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} className="bg-background/50" data-testid="input-whatsapp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills & Resources</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="I have a 3D printer and know Python..." 
                      className="resize-none bg-background/50" 
                      {...field}
                      data-testid="input-skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              disabled={mutation.isPending}
              data-testid="button-submit"
            >
              {mutation.isPending ? "Submitting..." : "Submit Interest"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
