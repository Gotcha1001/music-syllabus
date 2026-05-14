// app/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, BookOpen, Award, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard/syllabus");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-950/50 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
              <Music className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Official Music Syllabus
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
              Music Syllabus{" "}
              <span className="text-purple-500">Grade R - 7</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Complete term-by-term music curriculum with songs, theory
              booklets, clapping assessments, and term tests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-10 h-14 bg-purple-600 hover:bg-purple-700"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 h-14"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-purple-500" />,
                title: "Theory Booklets",
                desc: "Working + Answer booklets with notation and theory",
              },
              {
                icon: <Music className="h-10 w-10 text-red-500" />,
                title: "Term Songs",
                desc: "Curated YouTube playlist for every term",
              },
              {
                icon: <Award className="h-10 w-10 text-amber-500" />,
                title: "Clapping Assessments",
                desc: "Rhythm & clapping exercises in PDF",
              },
              {
                icon: <Calendar className="h-10 w-10 text-emerald-500" />,
                title: "Term Tests",
                desc: "Printable assessments with answers",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-colors"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 border-t border-zinc-800">
        <div className="max-w-md mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to start teaching?</h2>
          <p className="text-zinc-400 mb-8">
            Sign up now and get instant access to the full syllabus.
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="w-full text-lg h-14 bg-white text-black hover:bg-zinc-200"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
