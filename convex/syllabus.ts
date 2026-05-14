// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

// // ============================================================================
// // TYPES
// // ============================================================================

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
//   args: {
//     grade: v.string(),
//     term: v.number(),
//   },
//   handler: async (ctx, { grade, term }) => {
//     return await ctx.db
//       .query("syllabusContent")
//       .withIndex("by_grade_term", (q) => q.eq("grade", grade).eq("term", term))
//       .filter((q) => q.eq(q.field("isActive"), true))
//       .collect();
//   },
// });

// export const getByCategory = query({
//   args: {
//     category: v.union(
//       v.literal("songs"),
//       v.literal("booklet"),
//       v.literal("clapping"),
//       v.literal("test"),
//     ),
//     grade: v.optional(v.string()),
//   },
//   handler: async (ctx, { category, grade }) => {
//     let q = ctx.db
//       .query("syllabusContent")
//       .withIndex("by_category", (q) => q.eq("category", category));

//     if (grade) {
//       q = q.filter((q) => q.eq(q.field("grade"), grade));
//     }

//     return await q
//       .filter((q) => q.eq(q.field("isActive"), true))
//       .order("desc")
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

// export const getById = query({
//   args: { id: v.id("syllabusContent") },
//   handler: async (ctx, { id }) => {
//     return await ctx.db.get(id);
//   },
// });

// // ============================================================================
// // MUTATIONS
// // Access is controlled by the admin password in the UI — any logged-in
// // Clerk user can call these, but the admin panel is password-gated.
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

//     const commonFields = {
//       grade: args.grade,
//       term: args.term,
//       category: args.category,
//       title: args.title,
//       description: args.description,
//       youtubeLinks: args.youtubeLinks,
//       workingBookletDriveId: args.workingBookletDriveId,
//       workingBookletViewLink: args.workingBookletViewLink,
//       answerBookletDriveId: args.answerBookletDriveId,
//       answerBookletViewLink: args.answerBookletViewLink,
//       clappingPdfDriveId: args.clappingPdfDriveId,
//       clappingPdfViewLink: args.clappingPdfViewLink,
//       testPdfDriveId: args.testPdfDriveId,
//       testPdfViewLink: args.testPdfViewLink,
//       isActive: args.isActive ?? true,
//       uploadedBy: identity.subject, // store clerk ID directly, no users table lookup
//       uploadedAt: now,
//     };

//     if (args.id) {
//       await ctx.db.patch(args.id, commonFields);
//       return { success: true, id: args.id, action: "updated" };
//     } else {
//       const newId = await ctx.db.insert("syllabusContent", commonFields);
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

// export const toggleActive = mutation({
//   args: { id: v.id("syllabusContent") },
//   handler: async (ctx, { id }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     const item = await ctx.db.get(id);
//     if (!item) throw new Error("Item not found");
//     await ctx.db.patch(id, { isActive: !item.isActive });
//     return { success: true, isActive: !item.isActive };
//   },
// });

// export const getAll = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("syllabusContent").order("desc").collect();
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export type SyllabusCategory = "songs" | "booklet" | "clapping" | "test";

export interface YoutubeSong {
  title: string;
  url: string;
  duration?: string;
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
    youtubeLinks: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          duration: v.optional(v.string()),
        }),
      ),
    ),
    workingBookletDriveId: v.optional(v.string()),
    workingBookletViewLink: v.optional(v.string()),
    answerBookletDriveId: v.optional(v.string()),
    answerBookletViewLink: v.optional(v.string()),
    clappingPdfDriveId: v.optional(v.string()),
    clappingPdfViewLink: v.optional(v.string()),
    testPdfDriveId: v.optional(v.string()),
    testPdfViewLink: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = Date.now();

    // Build update fields without using `any`
    const updateFields: {
      grade: string;
      term: number;
      category: SyllabusCategory;
      title: string;
      description?: string;
      youtubeLinks?: YoutubeSong[];
      workingBookletDriveId?: string;
      workingBookletViewLink?: string;
      answerBookletDriveId?: string;
      answerBookletViewLink?: string;
      clappingPdfDriveId?: string;
      clappingPdfViewLink?: string;
      testPdfDriveId?: string;
      testPdfViewLink?: string;
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

    // Only include fields that were explicitly passed
    if (args.youtubeLinks !== undefined) {
      updateFields.youtubeLinks = args.youtubeLinks;
    }

    if (args.workingBookletDriveId !== undefined) {
      updateFields.workingBookletDriveId = args.workingBookletDriveId;
      updateFields.workingBookletViewLink = args.workingBookletViewLink;
    }
    if (args.answerBookletDriveId !== undefined) {
      updateFields.answerBookletDriveId = args.answerBookletDriveId;
      updateFields.answerBookletViewLink = args.answerBookletViewLink;
    }
    if (args.clappingPdfDriveId !== undefined) {
      updateFields.clappingPdfDriveId = args.clappingPdfDriveId;
      updateFields.clappingPdfViewLink = args.clappingPdfViewLink;
    }
    if (args.testPdfDriveId !== undefined) {
      updateFields.testPdfDriveId = args.testPdfDriveId;
      updateFields.testPdfViewLink = args.testPdfViewLink;
    }

    if (args.id) {
      // UPDATE
      await ctx.db.patch(args.id, updateFields);
      return { success: true, id: args.id, action: "updated" };
    } else {
      // CREATE
      const newId = await ctx.db.insert("syllabusContent", updateFields);
      return { success: true, id: newId, action: "created" };
    }
  },
});

export const remove = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, { isActive: false });
    return { success: true };
  },
});

export const hardDelete = mutation({
  args: { id: v.id("syllabusContent") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.delete(id);
    return { success: true };
  },
});
