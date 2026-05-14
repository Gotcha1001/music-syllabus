"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music } from "lucide-react";

const grades = [
  "Grade R",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
];

function gradeToSlug(grade: string): string {
  return grade.toLowerCase().replace(/\s+/g, "-"); // "Grade R" → "grade-r"
}

export default function SyllabusSidebar() {
  const pathname = usePathname();

  // Derive which grade is active directly from the URL — no useState needed.
  // pathname looks like: /dashboard/syllabus/grade-1/term-2
  const segments = pathname.split("/");
  const activeGradeSlug = segments[3] ?? ""; // "grade-1", "grade-r", etc.
  const activeTermSegment = segments[4] ?? ""; // "term-2", "term-3", etc.
  const activeTerm = parseInt(
    activeTermSegment.replace("term-", "") || "0",
    10,
  );

  return (
    <div className="w-72 border-r border-purple-900/50 bg-zinc-950 p-4">
      <div className="flex items-center gap-3 mb-8">
        <Music className="h-8 w-8 text-purple-500" />
        <h1 className="text-2xl font-bold">Music Syllabus</h1>
      </div>

      <nav className="space-y-1">
        {grades.map((grade) => {
          const gradeSlug = gradeToSlug(grade); // "grade-r", "grade-1", …
          const isExpanded = activeGradeSlug === gradeSlug;

          return (
            <div key={grade}>
              {/* Grade header — links to term-1 of that grade so the URL
                  always reflects a valid page, which in turn drives expansion */}
              <Link
                href={`/dashboard/syllabus/${gradeSlug}/term-1`}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  isExpanded ? "text-white" : "hover:bg-purple-950/50"
                }`}
              >
                {grade}
                <span className="text-zinc-400">{isExpanded ? "−" : "+"}</span>
              </Link>

              {/* Term list — only rendered when this grade is active */}
              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {[1, 2, 3, 4].map((term) => {
                    const isActiveTerm = activeTerm === term;
                    return (
                      <Link
                        key={term}
                        href={`/dashboard/syllabus/${gradeSlug}/term-${term}`}
                        className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                          isActiveTerm
                            ? "bg-purple-600 text-white"
                            : "hover:bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        Term {term}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
