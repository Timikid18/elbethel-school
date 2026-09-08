// Sample testimonials. Marked clearly as sample content and easy to replace.
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  sample?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "EL-BETH-EL has completely transformed my son's confidence and love for learning. The teachers genuinely care about every child.",
    name: "Mrs. Adebayo",
    role: "Parent of a Grade 3 pupil",
    sample: true,
  },
  {
    quote:
      "The school's focus on both academics and character is exactly what we were looking for. My daughter has blossomed here.",
    name: "Mr. Okafor",
    role: "Parent of a JSS pupil",
    sample: true,
  },
  {
    quote:
      "A warm, disciplined and inspiring environment. It truly feels like a family that is raising tomorrow's leaders.",
    name: "Mrs. Eze",
    role: "Parent of a KG pupil",
    sample: true,
  },
];
