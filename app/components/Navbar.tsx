"use client";

import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleAdminAccess = () => {
    if (adminCode.toLowerCase().trim() === "music rabbit") {
      setShowAdminModal(false);
      setAdminCode("");
      window.location.href = "/dashboard/syllabus/admin";
      toast.success("Welcome, Admin! 🎵");
    } else {
      toast.error("Incorrect code. Try again.");
    }
  };

  return (
    <motion.nav
      className="flex items-center justify-between py-2.5 sm:py-3 pr-3 sm:pr-6 text-white bg-black/80 backdrop-blur-md border-b border-purple-900/50 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold flex items-center gap-2"
        style={{
          paddingLeft: "calc(var(--sidebar-width-icon, 3rem) + 0.75rem)",
          whiteSpace: "nowrap",
        }}
      >
        <span className="text-purple-500">♪</span> Music Rabbit
      </Link>

      <div className="flex items-center space-x-4 flex-shrink-0">
        <SignedOut>
          <Link href="/sign-in">
            <button className="text-white hover:bg-purple-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Sign Up
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          {/* Admin Access Button */}
          <Button
            variant="ghost"
            onClick={() => setShowAdminModal(true)}
            className="text-white hover:bg-purple-900/50 flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Button>

          {role === "teacher" && (
            <Link href="/dashboard/teacher" className="text-white hover:opacity-80">
              Schedule
            </Link>
          )}
          {role === "student" && (
            <Link href="/dashboard/student" className="text-white hover:opacity-80">
              My Lessons
            </Link>
          )}

          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Admin Code Modal */}
      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Admin Access
            </DialogTitle>
            <DialogDescription>
              Enter the admin code to access the syllabus management panel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              type="text"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminAccess()}
              className="text-center text-lg tracking-widest"
            />

            <Button
              onClick={handleAdminAccess}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              Unlock Admin Panel
            </Button>

            <p className="text-center text-xs text-zinc-500">
              Hint: <span className="font-mono">music rabbit</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.nav>
  );
}