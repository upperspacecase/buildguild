import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProjectCard } from "./project-card";

interface TeamMember {
  name: string;
  role: string;
}

interface Project {
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
}

interface ProjectCarouselProps {
  projects: Project[];
  onRefresh: () => void;
}

export function ProjectCarousel({ projects, onRefresh }: ProjectCarouselProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
          Featured Projects
        </h2>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Swipe to explore
        </div>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="h-full p-1">
                <ProjectCard 
                  project={project} 
                  onRefresh={onRefresh}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4 pr-4">
          <CarouselPrevious className="static translate-y-0 bg-secondary/50 border-none hover:bg-primary hover:text-white" />
          <CarouselNext className="static translate-y-0 bg-secondary/50 border-none hover:bg-primary hover:text-white" />
        </div>
      </Carousel>
    </div>
  );
}
