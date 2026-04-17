import { addDays } from "date-fns";

export interface TeamMember {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  resourcesNeeded: string[];
  team: TeamMember[];
  image: string;
  category: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Neon Horizon Initiative",
    description: "Building a decentralized mesh network for urban environments. We need hardware hackers and rust developers to prototype the first nodes.",
    date: addDays(new Date(), 5),
    location: "San Francisco, CA",
    resourcesNeeded: ["Raspberry Pis", "LoRa Modules", "3D Printer"],
    team: [
      { name: "Alex Chen", role: "Lead Engineer" },
      { name: "Sarah Jones", role: "Hardware Specialist" }
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    category: "Hardware"
  },
  {
    id: "2",
    name: "Project Aether",
    description: "A sustainable vertical garden system with automated irrigation controlled by AI. Looking for botanists and IoT experts.",
    date: addDays(new Date(), 12),
    location: "Austin, TX",
    resourcesNeeded: ["Sensors", "Water Pumps", "LED Grow Lights"],
    team: [
      { name: "Marcus Thorne", role: "Project Lead" }
    ],
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?w=800&q=80",
    category: "Sustainability"
  },
  {
    id: "3",
    name: "CyberDeck 2077",
    description: "Custom mechanical keyboard and deck build with integrated display. Community focused open-source hardware project.",
    date: addDays(new Date(), 20),
    location: "Tokyo, Japan",
    resourcesNeeded: ["CNC Mill Access", "PCB Design", "Keycaps"],
    team: [
      { name: "Elena Rodriguez", role: "Designer" },
      { name: "Kenji Sato", role: "Firmware Dev" },
      { name: "Mike Ross", role: "Assembly" }
    ],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    category: "Hardware"
  },
  {
    id: "4",
    name: "Void Walker Game",
    description: "Indie rouge-like set in a procedural void. Need pixel artists and sound designers.",
    date: addDays(new Date(), 2),
    location: "Remote / Discord",
    resourcesNeeded: ["Unity License", "Sound Library"],
    team: [],
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    category: "Software"
  }
];
