import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, Hammer, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { InterestForm } from "./interest-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

interface TeamMember {
  name: string;
  role: string;
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location: string;
    category: string;
    resourcesNeeded: string[];
    image: string;
    team: TeamMember[];
  };
  onRefresh?: () => void;
}

export function ProjectCard({ project, onRefresh }: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const startDate = typeof project.startDate === 'string' ? new Date(project.startDate) : project.startDate;
  const endDate = typeof project.endDate === 'string' ? new Date(project.endDate) : project.endDate;
  
  const dateDisplay = isSameDay(startDate, endDate)
    ? format(startDate, "MMM do, yyyy")
    : `${format(startDate, "MMM do")} - ${format(endDate, "MMM do, yyyy")}`;

  return (
    <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.2)] group cursor-pointer" onClick={() => setLocation(`/project/${project.id}`)} data-testid={`card-project-${project.id}`}>
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img 
          src={project.image} 
          alt={project.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md border-white/10 hover:bg-black/70">
          {project.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <CardTitle className="text-2xl mb-1">{project.name}</CardTitle>
            <div className="flex flex-wrap gap-3 items-center text-muted-foreground text-sm">
              <div className="flex items-center">
                <CalendarIcon className="mr-1.5 h-3 w-3" />
                {dateDisplay}
              </div>
              <div className="flex items-center text-primary/80">
                <MapPin className="mr-1.5 h-3 w-3" />
                {project.location}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          {project.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center text-primary">
            <Hammer className="mr-2 h-4 w-4" /> Needed Resources
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.resourcesNeeded.map((res, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs font-normal">
                {res}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
           <h4 className="text-sm font-medium flex items-center text-primary">
            <Users className="mr-2 h-4 w-4" /> Guild Members
          </h4>
          <div className="flex items-center -space-x-2 overflow-hidden py-1">
            {project.team.length > 0 ? (
              project.team.map((member, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8 border-2 border-background ring-2 ring-white/5 transition-transform hover:z-10 hover:scale-110">
                        <AvatarFallback className="bg-primary/20 text-[10px]">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{member.name} - {member.role}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic pl-1">No guild members yet. Be the first!</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <div className="mt-auto p-6 pt-0" onClick={(e) => e.stopPropagation()}>
        <InterestForm 
          projectId={project.id}
          projectName={project.name}
          onSuccess={onRefresh}
          trigger={
            <Button className="w-full group/btn bg-secondary hover:bg-secondary/80 hover:text-primary transition-all">
              I'm interested
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          }
        />
      </div>
    </Card>
  );
}
