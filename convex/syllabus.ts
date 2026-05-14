// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

// export type SyllabusCategory = "songs" | "booklet" | "clapping" | "test";

// export interface YoutubeSong {
//   title: string;
//   url: string;
//   duration?: string;
// }

// // ============================================================================
// // QUERIES
// // ============================================================================

// export const getByGradeAndTerm = query({
//   args: { grade: v.string(), term: v.number() },
//   handler: async (ctx, { grade, term }) => {
//     return await ctx.db
//       .query("syllabusContent")
//       .withIndex("by_grade_term", (q) => q.eq("grade", grade).eq("term", term))
//       .filter((q) => q.eq(q.field("isActive"), true))
//       .collect();
//   },
// });

// export const getAllActive = query({
//   handler: async (ctx) => {
//     return await ctx.db
//       .query("syllabusContent")
//       .filter((q) => q.eq(q.field("isActive"), true))
//       .collect();
//   },
// });

// export const getAll = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("syllabusContent").order("desc").collect();
//   },
// });

// export const getById = query({
//   args: { id: v.id("syllabusContent") },
//   handler: async (ctx, { id }) => await ctx.db.get(id),
// });

// // ============================================================================
// // MUTATIONS
// // ============================================================================

// export const upsert = mutation({
//   args: {
//     id: v.optional(v.id("syllabusContent")),
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
//     youtubeLinks: v.optional(
//       v.array(
//         v.object({
//           title: v.string(),
//           url: v.string(),
//           duration: v.optional(v.string()),
//         }),
//       ),
//     ),
//     workingBookletDriveId: v.optional(v.string()),
//     workingBookletViewLink: v.optional(v.string()),
//     answerBookletDriveId: v.optional(v.string()),
//     answerBookletViewLink: v.optional(v.string()),
//     clappingPdfDriveId: v.optional(v.string()),
//     clappingPdfViewLink: v.optional(v.string()),
//     testPdfDriveId: v.optional(v.string()),
//     testPdfViewLink: v.optional(v.string()),
//     isActive: v.optional(v.boolean()),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const now = Date.now();

//     // Build update fields without using `any`
//     const updateFields: {
//       grade: string;
//       term: number;
//       category: SyllabusCategory;
//       title: string;
//       description?: string;
//       youtubeLinks?: YoutubeSong[];
//       workingBookletDriveId?: string;
//       workingBookletViewLink?: string;
//       answerBookletDriveId?: string;
//       answerBookletViewLink?: string;
//       clappingPdfDriveId?: string;
//       clappingPdfViewLink?: string;
//       testPdfDriveId?: string;
//       testPdfViewLink?: string;
//       uploadedBy: string;
//       uploadedAt: number;
//       isActive: boolean;
//     } = {
//       grade: args.grade,
//       term: args.term,
//       category: args.category,
//       title: args.title,
//       description: args.description,
//       uploadedBy: identity.subject,
//       uploadedAt: now,
//       isActive: args.isActive ?? true,
//     };

//     // Only include fields that were explicitly passed
//     if (args.youtubeLinks !== undefined) {
//       updateFields.youtubeLinks = args.youtubeLinks;
//     }

//     if (args.workingBookletDriveId !== undefined) {
//       updateFields.workingBookletDriveId = args.workingBookletDriveId;
//       updateFields.workingBookletViewLink = args.workingBookletViewLink;
//     }
//     if (args.answerBookletDriveId !== undefined) {
//       updateFields.answerBookletDriveId = args.answerBookletDriveId;
//       updateFields.answerBookletViewLink = args.answerBookletViewLink;
//     }
//     if (args.clappingPdfDriveId !== undefined) {
//       updateFields.clappingPdfDriveId = args.clappingPdfDriveId;
//       updateFields.clappingPdfViewLink = args.clappingPdfViewLink;
//     }
//     if (args.testPdfDriveId !== undefined) {
//       updateFields.testPdfDriveId = args.testPdfDriveId;
//       updateFields.testPdfViewLink = args.testPdfViewLink;
//     }

//     if (args.id) {
//       // UPDATE
//       await ctx.db.patch(args.id, updateFields);
//       return { success: true, id: args.id, action: "updated" };
//     } else {
//       // CREATE
//       const newId = await ctx.db.insert("syllabusContent", updateFields);
//       return { success: true, id: newId, action: "created" };
//     }
//   },
// });

// export const remove = mutation({
//   args: { id: v.id("syllabusContent") },
//   handler: async (ctx, { id }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     await ctx.db.patch(id, { isActive: false });
//     return { success: true };
//   },
// });

// export const hardDelete = mutation({
//   args: { id: v.id("syllabusContent") },
//   handler: async (ctx, { id }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     await ctx.db.delete(id);
//     return { success: true };
//   },
// });
// convex/syllabus.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export type SyllabusCategory = "songs" | "booklet" | "clapping" | "test";

export interface YoutubeSong {
  title: string;
  url: string;
  duration?: string;
}

export interface TeachingLink {
  title: string;
  url: string;
  description?: string;
}

// ============================================================================
// QUERIES
// ============================================================================

export const getByGradeAndTerm = query({
  args: { grade: v.string(), term: v.number() },
  handler: async (ctx, { grade, term }) => {
    return await ctx.db
      .query("syllabusContent")
      .withIndex("by_grade_term", (q) => q.eq("grade", grade).eq("term", term))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getAllActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("syllabusContent")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("syllabusContent").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => await ctx.db.get(id),
});

// ============================================================================
// MUTATIONS
// ============================================================================

export const upsert = mutation({
  args: {
    id: v.optional(v.id("syllabusContent")),
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

    // NEW: Extra teaching YouTube links
    teachingLinks: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          description: v.optional(v.string()),
        }),
      ),
    ),

    // Booklet PDFs
    workingBookletDriveId: v.optional(v.string()),
    workingBookletViewLink: v.optional(v.string()),
    answerBookletDriveId: v.optional(v.string()),
    answerBookletViewLink: v.optional(v.string()),

    // NEW: Mini booklet
    miniBookletDriveId: v.optional(v.string()),
    miniBookletViewLink: v.optional(v.string()),
    miniBookletTitle: v.optional(v.string()),

    // Clapping
    clappingPdfDriveId: v.optional(v.string()),
    clappingPdfViewLink: v.optional(v.string()),

    // Test
    testPdfDriveId: v.optional(v.string()),
    testPdfViewLink: v.optional(v.string()),

    // NEW: Test scope PDF
    testScopePdfDriveId: v.optional(v.string()),
    testScopePdfViewLink: v.optional(v.string()),
    testScopeTitle: v.optional(v.string()),

    isActive: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = Date.now();

    const updateFields: {
      grade: string;
      term: number;
      category: SyllabusCategory;
      title: string;
      description?: string;
      youtubeLinks?: YoutubeSong[];
      teachingLinks?: TeachingLink[];
      workingBookletDriveId?: string;
      workingBookletViewLink?: string;
      answerBookletDriveId?: string;
      answerBookletViewLink?: string;
      miniBookletDriveId?: string;
      miniBookletViewLink?: string;
      miniBookletTitle?: string;
      clappingPdfDriveId?: string;
      clappingPdfViewLink?: string;
      testPdfDriveId?: string;
      testPdfViewLink?: string;
      testScopePdfDriveId?: string;
      testScopePdfViewLink?: string;
      testScopeTitle?: string;
      uploadedBy: string;
      uploadedAt: number;
      isActive: boolean;
    } = {
      grade: args.grade,
      term: args.term,
      category: args.category,
      title: args.title,
      description: args.description,
      uploadedBy: identity.subject,
      uploadedAt: now,
      isActive: args.isActive ?? true,
    };

    if (args.youtubeLinks !== undefined) {
      updateFields.youtubeLinks = args.youtubeLinks;
    }
    if (args.teachingLinks !== undefined) {
      updateFields.teachingLinks = args.teachingLinks;
    }
    if (args.workingBookletDriveId !== undefined) {
      updateFields.workingBookletDriveId = args.workingBookletDriveId;
      updateFields.workingBookletViewLink = args.workingBookletViewLink;
    }
    if (args.answerBookletDriveId !== undefined) {
      updateFields.answerBookletDriveId = args.answerBookletDriveId;
      updateFields.answerBookletViewLink = args.answerBookletViewLink;
    }
    if (args.miniBookletDriveId !== undefined) {
      updateFields.miniBookletDriveId = args.miniBookletDriveId;
      updateFields.miniBookletViewLink = args.miniBookletViewLink;
      updateFields.miniBookletTitle = args.miniBookletTitle;
    }
    if (args.clappingPdfDriveId !== undefined) {
      updateFields.clappingPdfDriveId = args.clappingPdfDriveId;
      updateFields.clappingPdfViewLink = args.clappingPdfViewLink;
    }
    if (args.testPdfDriveId !== undefined) {
      updateFields.testPdfDriveId = args.testPdfDriveId;
      updateFields.testPdfViewLink = args.testPdfViewLink;
    }
    if (args.testScopePdfDriveId !== undefined) {
      updateFields.testScopePdfDriveId = args.testScopePdfDriveId;
      updateFields.testScopePdfViewLink = args.testScopePdfViewLink;
      updateFields.testScopeTitle = args.testScopeTitle;
    }

    if (args.id) {
      await ctx.db.patch(args.id, updateFields);
      return { success: true, id: args.id, action: "updated" };
    } else {
      const newId = await ctx.db.insert("syllabusContent", updateFields);
      return { success: true, id: newId, action: "created" };
    }
  },
});

// Soft-delete (sets isActive = false)
export const remove = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, { isActive: false });
    return { success: true };
  },
});

// Hard delete from DB
export const hardDelete = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.delete(id);
    return { success: true };
  },
});

// ── NEW: Clear only the teaching links from a record ──
export const clearTeachingLinks = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, { teachingLinks: undefined });
    return { success: true };
  },
});

// ── NEW: Clear only the mini booklet from a record ──
export const clearMiniBooklet = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, {
      miniBookletDriveId: undefined,
      miniBookletViewLink: undefined,
      miniBookletTitle: undefined,
    });
    return { success: true };
  },
});

// ── NEW: Clear only the test scope PDF from a record ──
export const clearTestScope = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, {
      testScopePdfDriveId: undefined,
      testScopePdfViewLink: undefined,
      testScopeTitle: undefined,
    });
    return { success: true };
  },
});
