// // app/api/upload-syllabus/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { uploadToDrive } from "@/lib/googleDrive";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";

// const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export async function POST(req: NextRequest) {
//   try {
//     const authResult = await auth();
//     const { userId } = authResult;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = await authResult.getToken({ template: "convex" });
//     if (!token) {
//       return NextResponse.json({ error: "No Convex token" }, { status: 401 });
//     }

//     convexClient.setAuth(token);

//     const formData = await req.formData();

//     const idStr = formData.get("id") as string | null;
//     const file = formData.get("file") as File | null;
//     const title = formData.get("title") as string;
//     const grade = formData.get("grade") as string;
//     const termStr = formData.get("term") as string;
//     const category = formData.get("category") as
//       | "songs"
//       | "booklet"
//       | "clapping"
//       | "test";
//     const bookletType = (formData.get("bookletType") as string) || "single";
//     const description = formData.get("description") as string | null;
//     const youtubeRaw = formData.get("youtubeLinks") as string | null;

//     if (!title || !grade || !termStr || !category) {
//       return NextResponse.json(
//         { error: "Missing required fields: title, grade, term, category" },
//         { status: 400 },
//       );
//     }

//     const term = parseInt(termStr);

//     // Convert string ID to Convex ID if present
//     const id = idStr ? (idStr as Id<"syllabusContent">) : undefined;

//     // Upload file if provided
//     let driveResponse: {
//       fileId: string;
//       webViewLink: string;
//       webContentLink: string;
//     } | null = null;

//     if (file) {
//       driveResponse = await uploadToDrive(file);
//     }

//     // Parse YouTube links
//     const youtubeLinks = youtubeRaw ? JSON.parse(youtubeRaw) : undefined;

//     const payload = {
//       id,
//       title,
//       grade,
//       term,
//       category,
//       description: description || undefined,
//       youtubeLinks: category === "songs" ? youtubeLinks : undefined,

//       workingBookletDriveId:
//         category === "booklet" && bookletType === "working"
//           ? driveResponse?.fileId
//           : undefined,
//       workingBookletViewLink:
//         category === "booklet" && bookletType === "working"
//           ? driveResponse?.webViewLink
//           : undefined,

//       answerBookletDriveId:
//         category === "booklet" && bookletType === "answer"
//           ? driveResponse?.fileId
//           : undefined,
//       answerBookletViewLink:
//         category === "booklet" && bookletType === "answer"
//           ? driveResponse?.webViewLink
//           : undefined,

//       clappingPdfDriveId:
//         category === "clapping" ? driveResponse?.fileId : undefined,
//       clappingPdfViewLink:
//         category === "clapping" ? driveResponse?.webViewLink : undefined,

//       testPdfDriveId: category === "test" ? driveResponse?.fileId : undefined,
//       testPdfViewLink:
//         category === "test" ? driveResponse?.webViewLink : undefined,
//     };

//     await convexClient.mutation(api.syllabus.upsert, payload);

//     return NextResponse.json({
//       success: true,
//       message: id ? "Updated successfully" : "Uploaded successfully",
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Upload failed" },
//       { status: 500 },
//     );
//   }
// }
// app/api/upload-syllabus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToDrive } from "@/lib/googleDrive";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const authResult = await auth();
    const { userId } = authResult;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await authResult.getToken({ template: "convex" });
    if (!token) {
      return NextResponse.json({ error: "No Convex token" }, { status: 401 });
    }

    convexClient.setAuth(token);

    const formData = await req.formData();

    const idStr = formData.get("id") as string | null;
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const grade = formData.get("grade") as string;
    const termStr = formData.get("term") as string;
    const category = formData.get("category") as
      | "songs"
      | "booklet"
      | "clapping"
      | "test";
    // bookletType: "working" | "answer" | "mini" | "single" | "testScope"
    const bookletType = (formData.get("bookletType") as string) || "single";
    const description = formData.get("description") as string | null;
    const youtubeRaw = formData.get("youtubeLinks") as string | null;
    const teachingRaw = formData.get("teachingLinks") as string | null;
    const miniBookletTitle = formData.get("miniBookletTitle") as string | null;
    const testScopeTitle = formData.get("testScopeTitle") as string | null;

    if (!title || !grade || !termStr || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, grade, term, category" },
        { status: 400 },
      );
    }

    const term = parseInt(termStr);
    const id = idStr ? (idStr as Id<"syllabusContent">) : undefined;

    // Upload file to Google Drive if provided
    let driveResponse: {
      fileId: string;
      webViewLink: string;
      webContentLink: string;
    } | null = null;

    if (file) {
      driveResponse = await uploadToDrive(file);
    }

    // Parse link arrays
    const youtubeLinks = youtubeRaw ? JSON.parse(youtubeRaw) : undefined;
    const teachingLinks = teachingRaw ? JSON.parse(teachingRaw) : undefined;

    const payload: Record<string, unknown> = {
      id,
      title,
      grade,
      term,
      category,
      description: description || undefined,
    };

    // ── Songs ──
    if (category === "songs" && youtubeLinks !== undefined) {
      payload.youtubeLinks = youtubeLinks;
    }

    // ── Teaching links (any category) ──
    if (teachingLinks !== undefined) {
      payload.teachingLinks = teachingLinks;
    }

    // ── Booklet variants ──
    if (category === "booklet" && bookletType === "working" && driveResponse) {
      payload.workingBookletDriveId = driveResponse.fileId;
      payload.workingBookletViewLink = driveResponse.webViewLink;
    }
    if (category === "booklet" && bookletType === "answer" && driveResponse) {
      payload.answerBookletDriveId = driveResponse.fileId;
      payload.answerBookletViewLink = driveResponse.webViewLink;
    }
    if (category === "booklet" && bookletType === "mini" && driveResponse) {
      payload.miniBookletDriveId = driveResponse.fileId;
      payload.miniBookletViewLink = driveResponse.webViewLink;
      payload.miniBookletTitle = miniBookletTitle || "Mini Booklet";
    }

    // ── Clapping ──
    if (category === "clapping" && driveResponse) {
      payload.clappingPdfDriveId = driveResponse.fileId;
      payload.clappingPdfViewLink = driveResponse.webViewLink;
    }

    // ── Test (main PDF) ──
    if (category === "test" && bookletType === "single" && driveResponse) {
      payload.testPdfDriveId = driveResponse.fileId;
      payload.testPdfViewLink = driveResponse.webViewLink;
    }

    // ── Test Scope PDF ──
    if (category === "test" && bookletType === "testScope" && driveResponse) {
      payload.testScopePdfDriveId = driveResponse.fileId;
      payload.testScopePdfViewLink = driveResponse.webViewLink;
      payload.testScopeTitle = testScopeTitle || "Test Scope";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await convexClient.mutation(api.syllabus.upsert, payload as any);

    return NextResponse.json({
      success: true,
      message: id ? "Updated successfully" : "Uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
