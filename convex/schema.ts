import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ====================== USERS TABLE ======================
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // ====================== SYLLABUS TABLE ======================
  syllabusContent: defineTable({
    grade: v.string(),
    term: v.number(),
    category: v.union(
      v.literal("songs"),
      v.literal("booklet"),
      v.literal("clapping"),
      v.literal("test"),
    ),

    title: v.string(),
    description: v.optional(v.string()),

    // Songs
    youtubeLinks: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          duration: v.optional(v.string()),
        }),
      ),
    ),

    // PDFs
    workingBookletDriveId: v.optional(v.string()),
    workingBookletViewLink: v.optional(v.string()),
    answerBookletDriveId: v.optional(v.string()),
    answerBookletViewLink: v.optional(v.string()),

    clappingPdfDriveId: v.optional(v.string()),
    clappingPdfViewLink: v.optional(v.string()),

    testPdfDriveId: v.optional(v.string()),
    testPdfViewLink: v.optional(v.string()),

    uploadedBy: v.string(),
    uploadedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_grade_term", ["grade", "term"])
    .index("by_category", ["category"]),
});
