// // app/api/upload-syllabus/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { uploadToDrive } from "@/lib/googleDrive";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";

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
//     const file = formData.get("file") as File | null;
//     const title = formData.get("title") as string;
//     const grade = formData.get("grade") as string;
//     const termStr = formData.get("term") as string;
//     const category = formData.get("category") as
//       | "songs"
//       | "booklet"
//       | "clapping"
//       | "test";
//     const bookletType = (formData.get("bookletType") as string) || "single"; // "working" | "answer" | "single"
//     const description = formData.get("description") as string | null;
//     const youtubeRaw = formData.get("youtubeLinks") as string | null;

//     if (!title || !grade || !termStr || !category) {
//       return NextResponse.json(
//         { error: "Missing required fields: title, grade, term, category" },
//         { status: 400 },
//       );
//     }

//     const term = parseInt(termStr);

//     // Upload file to Google Drive if provided
//     let driveResponse: {
//       fileId: string;
//       webViewLink: string;
//       webContentLink: string;
//     } | null = null;
//     if (file) {
//       driveResponse = await uploadToDrive(file);
//     }

//     // Parse youtube links if provided
//     const youtubeLinks = youtubeRaw ? JSON.parse(youtubeRaw) : undefined;

//     // Build the upsert payload based on category + bookletType
//     const payload: Parameters<typeof convexClient.mutation>[1] = {
//       title,
//       grade,
//       term,
//       category,
//       description: description || undefined,
//       youtubeLinks: category === "songs" ? youtubeLinks : undefined,

//       // Booklet — working and answer are uploaded separately
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

//       // Clapping
//       clappingPdfDriveId:
//         category === "clapping" ? driveResponse?.fileId : undefined,
//       clappingPdfViewLink:
//         category === "clapping" ? driveResponse?.webViewLink : undefined,

//       // Test
//       testPdfDriveId: category === "test" ? driveResponse?.fileId : undefined,
//       testPdfViewLink:
//         category === "test" ? driveResponse?.webViewLink : undefined,
//     };

//     await convexClient.mutation(api.syllabus.upsert, payload);

//     return NextResponse.json({
//       success: true,
//       message: "Uploaded successfully",
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
    const bookletType = (formData.get("bookletType") as string) || "single";
    const description = formData.get("description") as string | null;
    const youtubeRaw = formData.get("youtubeLinks") as string | null;

    if (!title || !grade || !termStr || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, grade, term, category" },
        { status: 400 },
      );
    }

    const term = parseInt(termStr);

    // Convert string ID to Convex ID if present
    const id = idStr ? (idStr as Id<"syllabusContent">) : undefined;

    // Upload file if provided
    let driveResponse: {
      fileId: string;
      webViewLink: string;
      webContentLink: string;
    } | null = null;

    if (file) {
      driveResponse = await uploadToDrive(file);
    }

    // Parse YouTube links
    const youtubeLinks = youtubeRaw ? JSON.parse(youtubeRaw) : undefined;

    const payload = {
      id,
      title,
      grade,
      term,
      category,
      description: description || undefined,
      youtubeLinks: category === "songs" ? youtubeLinks : undefined,

      workingBookletDriveId:
        category === "booklet" && bookletType === "working"
          ? driveResponse?.fileId
          : undefined,
      workingBookletViewLink:
        category === "booklet" && bookletType === "working"
          ? driveResponse?.webViewLink
          : undefined,

      answerBookletDriveId:
        category === "booklet" && bookletType === "answer"
          ? driveResponse?.fileId
          : undefined,
      answerBookletViewLink:
        category === "booklet" && bookletType === "answer"
          ? driveResponse?.webViewLink
          : undefined,

      clappingPdfDriveId:
        category === "clapping" ? driveResponse?.fileId : undefined,
      clappingPdfViewLink:
        category === "clapping" ? driveResponse?.webViewLink : undefined,

      testPdfDriveId: category === "test" ? driveResponse?.fileId : undefined,
      testPdfViewLink:
        category === "test" ? driveResponse?.webViewLink : undefined,
    };

    await convexClient.mutation(api.syllabus.upsert, payload);

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
