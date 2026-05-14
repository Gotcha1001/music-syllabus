// // convex/users.ts
// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const createOrGet = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const existing = await ctx.db
//       .query("users")
//       .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (existing) return existing;

//     // Create new user
//     const userId = await ctx.db.insert("users", {
//       clerkId: identity.subject,
//       email: identity.email ?? "",
//       name: identity.name || identity.givenName || identity.nickname || "User",
//       imageUrl: identity.pictureUrl,
//       role: "user",           // Change to "admin" for first user if needed
//       createdAt: Date.now(),
//     });

//     return await ctx.db.get(userId);
//   },
// });

// export const get = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     return await ctx.db
//       .query("users")
//       .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
//       .first();
//   },
// });

// export const syncProfile = mutation({
//   args: {
//     name: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) throw new Error("User not found");

//     const updates: any = {};
//     if (args.name !== undefined) updates.name = args.name;
//     if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;

//     if (Object.keys(updates).length > 0) {
//       await ctx.db.patch(user._id, updates);
//     }

//     return await ctx.db.get(user._id);
//   },
// });
// convex/users.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createOrGet = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existing) return existing;

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name || identity.givenName || identity.nickname || "User",
      imageUrl: identity.pictureUrl,
      role: "user",
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

export const syncProfile = mutation({
  args: {
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Proper typing instead of `any`
    const updates: {
      name?: string;
      imageUrl?: string;
    } = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(user._id, updates);
    }

    return await ctx.db.get(user._id);
  },
});
