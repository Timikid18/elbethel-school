// Configurable school divisions (Early Years / Primary / Secondary).
// Replace with database-driven source in production if management edits these.
export interface Division {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
}

export const divisions: Division[] = [
  {
    id: "early-years",
    name: "Early Years",
    tagline: "A joyful first step",
    description:
      "A warm, play-based foundation where our youngest learners discover, explore and build confidence in a caring and stimulating environment.",
    features: ["Play-based learning", "Nursery & Kindergarten", "Speech & social skills", "Early literacy"],
  },
  {
    id: "primary",
    name: "Primary",
    tagline: "Building strong foundations",
    description:
      "A rich, broad curriculum that develops confident, curious and independent learners ready for the next stage of their journey.",
    features: ["Core academic subjects", "Values & character", "Creative and physical education", "Foundational skills"],
  },
  {
    id: "secondary",
    name: "Secondary",
    tagline: "Preparing for the future",
    description:
      "Rigorous academic programmes and leadership opportunities that prepare our students for national and international examinations.",
    features: ["Junior & senior secondary", "Examination preparation", "Leadership & clubs", "Career guidance"],
  },
];
