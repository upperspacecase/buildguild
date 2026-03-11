import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, MapPin, Hammer, Users, ArrowLeft, Share2 } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { InterestForm } from "@/components/interest-form";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  name: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  resourcesNeeded: string[];
  image: string;
  team: TeamMember[];
}

async function fetchProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  return response.json();
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Project link has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Project not found</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const dateDisplay = isSameDay(startDate, endDate)
    ? format(startDate, "MMMM do, yyyy")
    : `${format(startDate, "MMMM do")} - ${format(endDate, "MMMM do, yyyy")}`;

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 hover:bg-secondary"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>

        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <Badge className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border-white/10 text-base px-4 py-2">
            {project.category}
          </Badge>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {project.name}
            </h1>
            <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span className="text-lg">{dateDisplay}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span className="text-lg">{project.location}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-shrink-0"
            data-testid="button-share"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Resources Needed */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hammer className="mr-2 h-5 w-5 text-primary" /> Resources Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {project.resourcesNeeded.map((resource, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/50 text-base px-4 py-2">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Button */}
            <InterestForm
              projectId={project.id}
              projectName={project.name}
              onSuccess={() => refetch()}
              trigger={
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]" data-testid="button-interested">
                  I'm interested
                </Button>
              }
            />

            {/* Guild Members */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-primary" /> Guild Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.team.length > 0 ? (
                  <div className="space-y-3">
                    {project.team.map((member, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                              <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/20 text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{member.name} - {member.role}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No guild members yet. Be the first to join!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
