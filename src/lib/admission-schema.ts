import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().trim().min(2, "Enter the child's first name"),
  lastName: z.string().trim().min(2, "Enter the child's last name"),
  gender: z.string().min(1, "Select the child's gender"),
  dateOfBirth: z.string().min(1, "Enter the child's date of birth"),
  classApplying: z.string().min(1, "Select the class you are applying for"),
  previousSchool: z.string().trim().max(200).optional().or(z.literal("")),
  studentAddress: z.string().trim().max(300).optional().or(z.literal("")),
  parentFirstName: z.string().trim().min(2, "Enter the parent's first name"),
  parentLastName: z.string().trim().min(2, "Enter the parent's last name"),
  parentPhone: z.string().trim().min(7, "Enter a valid phone number"),
  parentEmail: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  parentOccupation: z.string().trim().max(150).optional().or(z.literal("")),
  emergencyContactName: z.string().trim().max(200).optional().or(z.literal("")),
  emergencyContactPhone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const classOptions = [
  { value: "Nursery 1", group: "Early Years" },
  { value: "Nursery 2", group: "Early Years" },
  { value: "KG 1", group: "Early Years" },
  { value: "KG 2", group: "Early Years" },
  { value: "Grade 1", group: "Primary" },
  { value: "Grade 2", group: "Primary" },
  { value: "Grade 3", group: "Primary" },
  { value: "Grade 4", group: "Primary" },
  { value: "Grade 5", group: "Primary" },
  { value: "Grade 6", group: "Primary" },
  { value: "JSS 1", group: "Secondary" },
  { value: "JSS 2", group: "Secondary" },
  { value: "JSS 3", group: "Secondary" },
  { value: "SSS 1", group: "Secondary" },
  { value: "SSS 2", group: "Secondary" },
  { value: "SSS 3", group: "Secondary" },
];

export const divisionGroups = ["Early Years", "Primary", "Secondary"] as const;