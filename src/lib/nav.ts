import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Megaphone,
  FileText,
  Wallet,
  UserRound,
  CalendarClock,
  ClipboardCheck,
  School,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const superAdminNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/super-admin/dashboard",
        icon: LayoutDashboard,
        match: ["/super-admin/dashboard"],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Students",
        href: "/super-admin/students",
        icon: GraduationCap,
        match: ["/super-admin/students"],
      },
      {
        label: "Teachers",
        href: "/super-admin/teachers",
        icon: Users,
        match: ["/super-admin/teachers"],
      },
      {
        label: "Parents",
        href: "/super-admin/parents",
        icon: UserRound,
        match: ["/super-admin/parents"],
      },
      {
        label: "Classes",
        href: "/super-admin/classes",
        icon: School,
        match: ["/super-admin/classes"],
      },
      {
        label: "Subjects",
        href: "/super-admin/subjects",
        icon: BookOpen,
        match: ["/super-admin/subjects"],
      },
    ],
  },
  {
    title: "Academics",
    items: [
      {
        label: "Sessions & Terms",
        href: "/super-admin/sessions",
        icon: CalendarClock,
        match: ["/super-admin/sessions"],
      },
      {
        label: "Results",
        href: "/super-admin/results",
        icon: FileText,
        match: ["/super-admin/results"],
      },
      {
        label: "Attendance",
        href: "/super-admin/attendance",
        icon: ClipboardCheck,
        match: ["/super-admin/attendance"],
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Admissions",
        href: "/super-admin/admissions",
        icon: ClipboardList,
        match: ["/super-admin/admissions"],
      },
      {
        label: "Fees & Payments",
        href: "/super-admin/fees",
        icon: Wallet,
        match: ["/super-admin/fees"],
      },
      {
        label: "Announcements",
        href: "/super-admin/announcements",
        icon: Megaphone,
        match: ["/super-admin/announcements"],
      },
      {
        label: "Events",
        href: "/super-admin/events",
        icon: CalendarDays,
        match: ["/super-admin/events"],
      },
    ],
  },
];

export const teacherNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
        match: ["/teacher/dashboard"],
      },
    ],
  },
  {
    title: "Teaching",
    items: [
      {
        label: "My Students",
        href: "/teacher/students",
        icon: GraduationCap,
        match: ["/teacher/students"],
      },
      {
        label: "Attendance",
        href: "/teacher/attendance",
        icon: ClipboardCheck,
        match: ["/teacher/attendance"],
      },
      {
        label: "Results & Grades",
        href: "/teacher/results",
        icon: FileText,
        match: ["/teacher/results"],
      },
      {
        label: "Assignments",
        href: "/teacher/assignments",
        icon: ClipboardList,
        match: ["/teacher/assignments"],
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        label: "Announcements",
        href: "/teacher/announcements",
        icon: Megaphone,
        match: ["/teacher/announcements"],
      },
      {
        label: "Timetable",
        href: "/teacher/timetable",
        icon: CalendarDays,
        match: ["/teacher/timetable"],
      },
    ],
  },
];

export const studentNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
        match: ["/student/dashboard"],
      },
    ],
  },
  {
    title: "Academics",
    items: [
      {
        label: "My Results",
        href: "/student/results",
        icon: FileText,
        match: ["/student/results"],
      },
      {
        label: "Attendance",
        href: "/student/attendance",
        icon: ClipboardCheck,
        match: ["/student/attendance"],
      },
      {
        label: "Timetable",
        href: "/student/timetable",
        icon: CalendarDays,
        match: ["/student/timetable"],
      },
      {
        label: "Assignments",
        href: "/student/assignments",
        icon: ClipboardList,
        match: ["/student/assignments"],
      },
    ],
  },
  {
    title: "Information",
    items: [
      {
        label: "Announcements",
        href: "/student/announcements",
        icon: Megaphone,
        match: ["/student/announcements"],
      },
      {
        label: "My Profile",
        href: "/student/profile",
        icon: UserRound,
        match: ["/student/profile"],
      },
    ],
  },
];

export const parentNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/parent/dashboard",
        icon: LayoutDashboard,
        match: ["/parent/dashboard"],
      },
    ],
  },
  {
    title: "My Children",
    items: [
      {
        label: "Academic Results",
        href: "/parent/results",
        icon: FileText,
        match: ["/parent/results"],
      },
      {
        label: "Attendance",
        href: "/parent/attendance",
        icon: ClipboardCheck,
        match: ["/parent/attendance"],
      },
      {
        label: "Timetable",
        href: "/parent/timetable",
        icon: CalendarDays,
        match: ["/parent/timetable"],
      },
      {
        label: "Assignments",
        href: "/parent/assignments",
        icon: ClipboardList,
        match: ["/parent/assignments"],
      },
    ],
  },
  {
    title: "Information",
    items: [
      {
        label: "Announcements",
        href: "/parent/announcements",
        icon: Megaphone,
        match: ["/parent/announcements"],
      },
      {
        label: "Fees & Payments",
        href: "/parent/fees",
        icon: Wallet,
        match: ["/parent/fees"],
      },
    ],
  },
];
