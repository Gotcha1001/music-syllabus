// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   // ====================== USERS TABLE ======================
//   users: defineTable({
//     clerkId: v.string(),
//     email: v.string(),
//     name: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//     role: v.union(v.literal("admin"), v.literal("user")),
//     createdAt: v.number(),
//   }).index("by_clerk_id", ["clerkId"]),

//   // ====================== SYLLABUS TABLE ======================
//   syllabusContent: defineTable({
//     grade: v.string(),
//     term: v.number(),
//     category: v.union(
//       v.literal("songs"),
//       v.literal("booklet"),
//       v.literal("clapping"),
//       v.literal("test"),
//     ),

//     title: v.string(),
//     description: v.optional(v.string()),

//     // Songs
//     youtubeLinks: v.optional(
//       v.array(
//         v.object({
//           title: v.string(),
//           url: v.string(),
//           duration: v.optional(v.string()),
//         }),
//       ),
//     ),

//     // PDFs
//     workingBookletDriveId: v.optional(v.string()),
//     workingBookletViewLink: v.optional(v.string()),
//     answerBookletDriveId: v.optional(v.string()),
//     answerBookletViewLink: v.optional(v.string()),

//     clappingPdfDriveId: v.optional(v.string()),
//     clappingPdfViewLink: v.optional(v.string()),

//     testPdfDriveId: v.optional(v.string()),
//     testPdfViewLink: v.optional(v.string()),

//     uploadedBy: v.string(),
//     uploadedAt: v.number(),
//     isActive: v.boolean(),
//   })
//     .index("by_grade_term", ["grade", "term"])
//     .index("by_category", ["category"]),
// });

// convex/schema.ts
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
      v.literal("youtubeLinks"), // NEW: standalone Extra YouTube Links per term
    ),
    title: v.string(),
    description: v.optional(v.string()),

    // ── Term Songs: YouTube links ──
    youtubeLinks: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          duration: v.optional(v.string()),
        }),
      ),
    ),

    // ── Extra teaching/resource YouTube links (now its own category) ──
    teachingLinks: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          description: v.optional(v.string()),
        }),
      ),
    ),

    // ── Booklet PDFs ──
    workingBookletDriveId: v.optional(v.string()),
    workingBookletViewLink: v.optional(v.string()),
    answerBookletDriveId: v.optional(v.string()),
    answerBookletViewLink: v.optional(v.string()),

    // ── Mini / shorter booklet version (optional) ──
    miniBookletDriveId: v.optional(v.string()),
    miniBookletViewLink: v.optional(v.string()),
    miniBookletTitle: v.optional(v.string()),

    // ── Clapping PDF ──
    clappingPdfDriveId: v.optional(v.string()),
    clappingPdfViewLink: v.optional(v.string()),

    // ── Test PDFs ──
    testPdfDriveId: v.optional(v.string()),
    testPdfViewLink: v.optional(v.string()),

    // ── Test Scope PDF (optional) ──
    testScopePdfDriveId: v.optional(v.string()),
    testScopePdfViewLink: v.optional(v.string()),
    testScopeTitle: v.optional(v.string()),

    // ── NEW: Test Answer Sheet PDF (optional) ──
    testAnswerSheetDriveId: v.optional(v.string()),
    testAnswerSheetViewLink: v.optional(v.string()),

    uploadedBy: v.string(),
    uploadedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_grade_term", ["grade", "term"])
    .index("by_category", ["category"]),
});
