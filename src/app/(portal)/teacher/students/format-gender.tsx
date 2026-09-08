"use client";

export function FormatGender({ gender }: { gender: string }) {
  if (gender === "M") return "Male";
  if (gender === "F") return "Female";
  return gender;
}