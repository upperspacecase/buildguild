import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { isSameDay, eachDayOfInterval, isWithinInterval } from "date-fns";
import { DayButtonProps } from "react-day-picker";

interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  category: string;
}

interface ProjectCalendarProps {
  projects: Project[];
  onSelectDate: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export function ProjectCalendar({ projects, onSelectDate, selectedDate }: ProjectCalendarProps) {
  // Generate all dates within each project's range
  const projectDays: Date[] = [];
  projects.forEach(p => {
    const daysInRange = eachDayOfInterval({ start: p.startDate, end: p.endDate });
    projectDays.push(...daysInRange);
  });
  
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border border-border/50 p-4 w-full max-w-[400px]"
          modifiers={{
            hasProject: projectDays
          }}
          modifiersStyles={{
            hasProject: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              textDecorationColor: 'hsl(var(--primary))',
              textDecorationThickness: '2px'
            }
          }}
          components={{
            DayButton: (props: DayButtonProps) => {
              const { day } = props;
              const date = day.date;
              const dayProjects = projects.filter(p => 
                isWithinInterval(date, { start: p.startDate, end: p.endDate }) ||
                isSameDay(date, p.startDate) ||
                isSameDay(date, p.endDate)
              );
              
              if (dayProjects.length === 0) {
                return <CalendarDayButton {...props} />;
              }
              
              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="relative w-full h-full">
                      <CalendarDayButton {...props} />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary pointer-events-none" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 p-0 overflow-hidden border-border/50 z-50">
                    <div className="bg-secondary p-2 text-xs font-semibold text-muted-foreground">
                      {date.toLocaleDateString()}
                    </div>
                    <div className="p-2 space-y-2">
                      {dayProjects.map(p => (
                        <div key={p.id} className="flex flex-col gap-1">
                          <span className="font-bold text-sm">{p.name}</span>
                          <Badge variant="outline" className="w-fit text-[10px]">{p.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
