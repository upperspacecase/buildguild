import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(5, "Project name must be at least 5 characters"),
  description: z.string().min(20, "Please provide a detailed description"),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(1, "Please select a category"),
  submitterEmail: z.string().email("Contact email is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  resourcesNeeded: z.string().min(3, "Please list at least one resource"),
  image: z.string().url("Please provide a valid image URL").or(z.literal("")),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

async function submitProject(data: z.infer<typeof formSchema>) {
  const response = await fetch("/api/projects/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      resourcesNeeded: data.resourcesNeeded.split(",").map(r => r.trim()).filter(Boolean),
      image: data.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit project");
  }

  return response.json();
}

export function StartProjectForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      category: "",
      submitterEmail: "",
      startDate: "",
      endDate: "",
      resourcesNeeded: "",
      image: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitProject,
    onSuccess: () => {
      toast({
        title: "Project Submitted for Review",
        description: "Your project has been sent to the Guild Council for approval. You will be notified via email once it is live.",
        duration: 5000,
      });
      setOpen(false);
      form.reset();
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
        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all hover:scale-105 text-primary-foreground font-bold">
          <Plus className="mr-2 h-5 w-5" /> Start a Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Start a New Project</DialogTitle>
          <DialogDescription>
            Propose a new initiative. All projects require admin approval before going live.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Quantum Mesh Network" {...field} className="bg-background/50" data-testid="input-project-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50" data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Sustainability">Sustainability</SelectItem>
                        <SelectItem value="Art">Art / Installation</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country or Remote" {...field} className="bg-background/50" data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-background/50" data-testid="input-start-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-background/50" data-testid="input-end-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description & Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you want to build and what resources you need..." 
                      className="resize-none min-h-[100px] bg-background/50" 
                      {...field}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourcesNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resources Needed</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Raspberry Pis, 3D Printer, Arduino" 
                      {...field} 
                      className="bg-background/50"
                      data-testid="input-resources"
                    />
                  </FormControl>
                  <FormDescription>Separate multiple items with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                      className="bg-background/50"
                      data-testid="input-image"
                    />
                  </FormControl>
                  <FormDescription>A cover image for your project</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="lead@example.com" {...field} className="bg-background/50" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                disabled={mutation.isPending}
                data-testid="button-submit"
              >
                {mutation.isPending ? "Submitting..." : "Submit for Approval"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Your project will be visible after moderator review (usually 24h).
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
