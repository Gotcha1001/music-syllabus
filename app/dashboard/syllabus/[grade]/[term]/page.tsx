// "use client";

// import { useParams } from "next/navigation";
// import { useQuery } from "convex/react";
// import { api } from "../../../../../convex/_generated/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Eye, BookOpen, Award, FileText } from "lucide-react";
// import { motion } from "framer-motion";
// import { FaYoutube } from "react-icons/fa";

// // ── Types ────────────────────────────────────────────────────────────────────

// type SyllabusItem = {
//   category: "songs" | "booklet" | "clapping" | "test";
//   description?: string;
//   youtubeLinks?: { title: string; url: string; duration?: string }[];
//   workingBookletViewLink?: string;
//   answerBookletViewLink?: string;
//   clappingPdfViewLink?: string;
//   testPdfViewLink?: string;
// };

// type Category = {
//   key: SyllabusItem["category"];
//   label: string;
//   icon: React.ElementType;
//   color: string;
// };

// // ── Helpers ──────────────────────────────────────────────────────────────────

// // "grade-r" → "Grade R" | "grade-1" → "Grade 1"
// function slugToGrade(slug: string): string {
//   return slug
//     .split("-")
//     .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//     .join(" ");
// }

// // "term-2" → 2 | "term-1" → 1
// function slugToTerm(slug: string): number {
//   const n = parseInt(slug.replace("term-", ""), 10);
//   return Number.isNaN(n) ? 1 : n;
// }

// // ── Static data ──────────────────────────────────────────────────────────────

// const categories: Category[] = [
//   { key: "songs", label: "Term Songs", icon: FaYoutube, color: "text-red-500" },
//   {
//     key: "booklet",
//     label: "Termly Booklet",
//     icon: BookOpen,
//     color: "text-purple-500",
//   },
//   {
//     key: "clapping",
//     label: "Clapping Assessment",
//     icon: Award,
//     color: "text-amber-500",
//   },
//   {
//     key: "test",
//     label: "Term Test",
//     icon: FileText,
//     color: "text-emerald-500",
//   },
// ];

// // ── Component ────────────────────────────────────────────────────────────────

// export default function TermPage() {
//   // Folder renamed to [grade]/[term]
//   // useParams gives: { grade: "grade-1", term: "term-2" }
//   const { grade: gradeSlug, term: termSlug } = useParams<{
//     grade: string;
//     term: string;
//   }>();

//   const grade = slugToGrade(gradeSlug ?? ""); // "Grade 1", "Grade R", …
//   const termNumber = slugToTerm(termSlug ?? ""); // 1, 2, 3, 4

//   const content = useQuery(api.syllabus.getByGradeAndTerm, {
//     grade,
//     term: termNumber,
//   });

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <motion.h1
//         key={`${grade}-${termNumber}`}
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-5xl font-bold mb-8 text-white"
//       >
//         {grade} — Term {termNumber}
//       </motion.h1>

//       <div className="grid md:grid-cols-2 gap-6">
//         {categories.map((cat) => {
//           const item = content?.find(
//             (c: SyllabusItem) => c.category === cat.key,
//           );

//           return (
//             <Card
//               key={cat.key}
//               className="bg-zinc-900 border-purple-900/50 hover:border-purple-500 transition-all duration-300"
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-3 text-xl">
//                   <cat.icon className={`h-6 w-6 ${cat.color}`} />
//                   {cat.label}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="space-y-4 min-h-[200px]">
//                 {item ? (
//                   <>
//                     {item.description && (
//                       <p className="text-zinc-400">{item.description}</p>
//                     )}

//                     {/* Songs */}
//                     {cat.key === "songs" &&
//                       item.youtubeLinks &&
//                       item.youtubeLinks.length > 0 && (
//                         <div className="space-y-3">
//                           {item.youtubeLinks.map((song, i) => (
//                             <a
//                               key={i}
//                               href={song.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="flex items-center gap-3 text-blue-400 hover:text-blue-300 hover:underline"
//                             >
//                               <FaYoutube className="h-5 w-5 flex-shrink-0" />
//                               {song.title}
//                             </a>
//                           ))}
//                         </div>
//                       )}

//                     {/* PDFs */}
//                     {(cat.key === "booklet" ||
//                       cat.key === "clapping" ||
//                       cat.key === "test") && (
//                       <div className="flex flex-wrap gap-3">
//                         {item.workingBookletViewLink && (
//                           <Button asChild variant="outline">
//                             <a
//                               href={item.workingBookletViewLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <Eye className="mr-2 h-4 w-4" /> Working Booklet
//                             </a>
//                           </Button>
//                         )}
//                         {item.answerBookletViewLink && (
//                           <Button asChild variant="outline">
//                             <a
//                               href={item.answerBookletViewLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <Eye className="mr-2 h-4 w-4" /> Answer Booklet
//                             </a>
//                           </Button>
//                         )}
//                         {item.clappingPdfViewLink && (
//                           <Button asChild variant="outline">
//                             <a
//                               href={item.clappingPdfViewLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <Eye className="mr-2 h-4 w-4" /> Clapping PDF
//                             </a>
//                           </Button>
//                         )}
//                         {item.testPdfViewLink && (
//                           <Button asChild variant="outline">
//                             <a
//                               href={item.testPdfViewLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <Eye className="mr-2 h-4 w-4" /> Term Test
//                             </a>
//                           </Button>
//                         )}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-zinc-500 italic py-8 text-center">
//                     No content uploaded yet for this category.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  BookOpen,
  Award,
  FileText,
  BookOpenCheck,
  FileSearch,
} from "lucide-react";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";

// ── Types ────────────────────────────────────────────────────────────────────

type SyllabusItem = {
  category: "songs" | "booklet" | "clapping" | "test";
  description?: string;
  youtubeLinks?: { title: string; url: string; duration?: string }[];
  teachingLinks?: { title: string; url: string; description?: string }[];
  workingBookletViewLink?: string;
  answerBookletViewLink?: string;
  miniBookletViewLink?: string;
  miniBookletTitle?: string;
  clappingPdfViewLink?: string;
  testPdfViewLink?: string;
  testScopePdfViewLink?: string;
  testScopeTitle?: string;
};

type Category = {
  key: SyllabusItem["category"];
  label: string;
  icon: React.ElementType;
  color: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugToGrade(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugToTerm(slug: string): number {
  const n = parseInt(slug.replace("term-", ""), 10);
  return Number.isNaN(n) ? 1 : n;
}

// ── Static data ──────────────────────────────────────────────────────────────

const categories: Category[] = [
  { key: "songs", label: "Term Songs", icon: FaYoutube, color: "text-red-500" },
  {
    key: "booklet",
    label: "Termly Booklet",
    icon: BookOpen,
    color: "text-purple-500",
  },
  {
    key: "clapping",
    label: "Clapping Assessment",
    icon: Award,
    color: "text-amber-500",
  },
  {
    key: "test",
    label: "Term Test",
    icon: FileText,
    color: "text-emerald-500",
  },
];

// ── Reusable Teaching Links section ──────────────────────────────────────────

function TeachingLinksSection({
  links,
}: {
  links: SyllabusItem["teachingLinks"];
}) {
  if (!links?.length) return null;
  return (
    <div className="mt-4 pt-4 border-t border-zinc-700">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
        <FaYoutube className="h-3 w-3" /> Extra Teaching Resources
      </p>
      <div className="space-y-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-0.5 text-amber-300 hover:text-amber-200 hover:underline"
          >
            <span className="flex items-center gap-2 text-sm">
              <FaYoutube className="h-4 w-4 flex-shrink-0" />
              {link.title}
            </span>
            {link.description && (
              <span className="text-xs text-zinc-500 pl-6">
                {link.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TermPage() {
  const { grade: gradeSlug, term: termSlug } = useParams<{
    grade: string;
    term: string;
  }>();

  const grade = slugToGrade(gradeSlug ?? "");
  const termNumber = slugToTerm(termSlug ?? "");

  const content = useQuery(api.syllabus.getByGradeAndTerm, {
    grade,
    term: termNumber,
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1
        key={`${grade}-${termNumber}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8 text-white"
      >
        {grade} — Term {termNumber}
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const item = content?.find(
            (c: SyllabusItem) => c.category === cat.key,
          );

          return (
            <Card
              key={cat.key}
              className="bg-zinc-900 border-purple-900/50 hover:border-purple-500 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                  {cat.label}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 min-h-[200px]">
                {item ? (
                  <>
                    {item.description && (
                      <p className="text-zinc-400 text-sm">
                        {item.description}
                      </p>
                    )}

                    {/* ── Songs ── */}
                    {cat.key === "songs" &&
                      item.youtubeLinks &&
                      item.youtubeLinks.length > 0 && (
                        <div className="space-y-2">
                          {item.youtubeLinks.map((song, i) => (
                            <a
                              key={i}
                              href={song.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-sm"
                            >
                              <FaYoutube className="h-4 w-4 flex-shrink-0" />
                              {song.title}
                            </a>
                          ))}
                        </div>
                      )}

                    {/* ── Booklet PDFs ── */}
                    {cat.key === "booklet" && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {item.workingBookletViewLink && (
                            <Button asChild variant="outline" size="sm">
                              <a
                                href={item.workingBookletViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-2 h-4 w-4" /> Working Booklet
                              </a>
                            </Button>
                          )}
                          {item.answerBookletViewLink && (
                            <Button asChild variant="outline" size="sm">
                              <a
                                href={item.answerBookletViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-2 h-4 w-4" /> Answer Booklet
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* ── NEW: Mini Booklet ── */}
                        {item.miniBookletViewLink && (
                          <div className="pt-2 border-t border-zinc-700">
                            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1">
                              <BookOpenCheck className="h-3 w-3" /> Short
                              Version
                            </p>
                            <Button asChild variant="secondary" size="sm">
                              <a
                                href={item.miniBookletViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <BookOpenCheck className="mr-2 h-4 w-4" />
                                {item.miniBookletTitle || "Mini Booklet"}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Clapping PDF ── */}
                    {cat.key === "clapping" && item.clappingPdfViewLink && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={item.clappingPdfViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> Clapping PDF
                        </a>
                      </Button>
                    )}

                    {/* ── Test PDF + Scope ── */}
                    {cat.key === "test" && (
                      <div className="space-y-3">
                        {item.testPdfViewLink && (
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={item.testPdfViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> Term Test
                            </a>
                          </Button>
                        )}

                        {/* ── NEW: Test Scope PDF ── */}
                        {item.testScopePdfViewLink && (
                          <div className="pt-2 border-t border-zinc-700">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1">
                              <FileSearch className="h-3 w-3" /> Test Scope
                            </p>
                            <Button asChild variant="secondary" size="sm">
                              <a
                                href={item.testScopePdfViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileSearch className="mr-2 h-4 w-4" />
                                {item.testScopeTitle || "Test Scope"}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── NEW: Teaching Links (shown for all categories) ── */}
                    <TeachingLinksSection links={item.teachingLinks} />
                  </>
                ) : (
                  <p className="text-zinc-500 italic py-8 text-center">
                    No content uploaded yet for this category.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
