// app/dashboard/syllabus/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export default function SyllabusDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-12 w-12 text-purple-500" />
            <h1 className="text-5xl font-bold tracking-tight">
              Music Syllabus
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-md mx-auto">
            Complete curriculum for Grade R to Grade 7
          </p>
        </div>

        {/* Grades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {grades.map((grade, index) => {
            const gradeSlug = grade.toLowerCase().replace(/\s+/g, "-");

            return (
              <motion.div
                key={grade}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/syllabus/${gradeSlug}/term-1`}>
                  <Card className="group bg-zinc-900 border-zinc-800 hover:border-purple-600 transition-all duration-300 hover:scale-105 h-full cursor-pointer">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-purple-950/50 flex items-center justify-center mb-6 group-hover:bg-purple-900/50 transition-colors">
                        <Music className="h-10 w-10 text-purple-400" />
                      </div>

                      <h2 className="text-3xl font-bold mb-2">{grade}</h2>
                      <p className="text-zinc-400 mb-6">4 Terms Available</p>

                      <Button
                        variant="outline"
                        className="group-hover:bg-purple-600 group-hover:text-white transition-colors"
                      >
                        View Syllabus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Admin Link */}
        <div className="mt-16 text-center">
          <Link href="/dashboard/syllabus/admin">
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300"
            >
              ⚙️ Admin: Upload / Manage Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
