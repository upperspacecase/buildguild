import { useQuery } from "@tanstack/react-query";
import { ProjectCarousel } from "@/components/project-carousel";
import { ProjectCalendar } from "@/components/project-calendar";
import { ProjectCard } from "@/components/project-card";
import { StartProjectForm } from "@/components/start-project-form";
import { useState } from "react";
import { isWithinInterval, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import bgImage from "@assets/generated_images/dark_abstract_tech_background_with_gradients.png";

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

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const projectsWithDates = projects.map(p => ({
    ...p,
    startDate: new Date(p.startDate),
    endDate: new Date(p.endDate)
  }));

  const filteredProjects = selectedDate 
    ? projectsWithDates.filter(p => {
        // Check if the selected date falls within the project's date range
        return isWithinInterval(selectedDate, { start: p.startDate, end: p.endDate }) ||
               isSameDay(selectedDate, p.startDate) ||
               isSameDay(selectedDate, p.endDate);
      })
    : projectsWithDates;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-x-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
              BUILD<span className="text-primary">.</span>GUILD
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-md">
              Recruit allies. Organize resources. <br/>
              <span className="text-foreground font-medium">Ship projects together.</span>
            </p>
          </div>
          <StartProjectForm />
        </header>

        {/* Carousel Section */}
        {projects.length > 0 && (
          <section>
            <ProjectCarousel projects={projectsWithDates} onRefresh={() => refetch()} />
          </section>
        )}

        {/* Calendar & Filtered List Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Calendar Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-2xl font-bold">Schedule</h2>
                 {selectedDate && (
                   <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)} className="text-xs text-muted-foreground hover:text-white">
                     Clear Filter
                   </Button>
                 )}
              </div>
              <ProjectCalendar 
                projects={projectsWithDates} 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate} 
              />
              
              <div className="mt-6 p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-md">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-mono font-bold">{projects.length}</div>
                    <div className="text-xs text-muted-foreground">Active Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold">
                      {projects.reduce((acc, p) => acc + p.team.length, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Guild Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtered List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">
                {selectedDate ? `Projects on ${selectedDate.toLocaleDateString()}` : "All Active Projects"}
              </h2>
              <Badge variant="secondary" className="rounded-full px-3">
                {filteredProjects.length}
              </Badge>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="h-full">
                     <ProjectCard 
                        project={project} 
                        onRefresh={() => refetch()}
                      />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-lg bg-white/5">
                <p className="text-muted-foreground text-lg mb-4">No projects yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to start a project!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-lg bg-white/5">
                <p className="text-muted-foreground text-lg">No projects found for this date.</p>
                <Button variant="link" onClick={() => setSelectedDate(undefined)} className="text-primary">
                  View all projects
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
