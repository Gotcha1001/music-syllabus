// "use client";

// import { useState } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import {
//   Loader2,
//   Upload,
//   Trash2,
//   RefreshCw,
//   BookOpenCheck,
//   FileSearch,
//   X,
//   Plus,
// } from "lucide-react";
// import { FaYoutube } from "react-icons/fa";

// const grades = [
//   "Grade R",
//   "Grade 1",
//   "Grade 2",
//   "Grade 3",
//   "Grade 4",
//   "Grade 5",
//   "Grade 6",
//   "Grade 7",
// ];

// const categories = [
//   { value: "songs", label: "Term Songs (YouTube)" },
//   { value: "booklet", label: "Termly Booklet" },
//   { value: "clapping", label: "Clapping Assessment" },
//   { value: "test", label: "Term Test" },
// ];

// type SyllabusItem = {
//   _id: Id<"syllabusContent">;
//   grade: string;
//   term: number;
//   category: "songs" | "booklet" | "clapping" | "test";
//   title: string;
//   description?: string;
//   youtubeLinks?: { title: string; url: string; duration?: string }[];
//   teachingLinks?: { title: string; url: string; description?: string }[];
//   workingBookletViewLink?: string;
//   answerBookletViewLink?: string;
//   miniBookletViewLink?: string;
//   miniBookletTitle?: string;
//   clappingPdfViewLink?: string;
//   testPdfViewLink?: string;
//   testScopePdfViewLink?: string;
//   testScopeTitle?: string;
//   isActive: boolean;
// };

// export default function SyllabusAdminPage() {
//   const [formData, setFormData] = useState({
//     grade: "",
//     term: "",
//     category: "",
//     title: "",
//     description: "",
//   });

//   // Song YouTube links
//   const [youtubeLinks, setYoutubeLinks] = useState([{ title: "", url: "" }]);

//   // Teaching / resource YouTube links (new — optional, all categories)
//   const [teachingLinks, setTeachingLinks] = useState<
//     { title: string; url: string; description: string }[]
//   >([]);
//   const [showTeachingLinks, setShowTeachingLinks] = useState(false);

//   // File state
//   const [workingFile, setWorkingFile] = useState<File | null>(null);
//   const [answerFile, setAnswerFile] = useState<File | null>(null);
//   // Mini booklet (new — optional)
//   const [miniBookletFile, setMiniBookletFile] = useState<File | null>(null);
//   const [miniBookletTitle, setMiniBookletTitle] = useState("");
//   const [showMiniBooklet, setShowMiniBooklet] = useState(false);
//   // Test scope (new — optional)
//   const [testScopeFile, setTestScopeFile] = useState<File | null>(null);
//   const [testScopeTitle, setTestScopeTitle] = useState("");
//   const [showTestScope, setShowTestScope] = useState(false);

//   const [isUploading, setIsUploading] = useState(false);

//   const allContent = useQuery(api.syllabus.getAllActive) as
//     | SyllabusItem[]
//     | undefined;
//   const remove = useMutation(api.syllabus.remove);
//   const clearTeachingLinks = useMutation(api.syllabus.clearTeachingLinks);
//   const clearMiniBooklet = useMutation(api.syllabus.clearMiniBooklet);
//   const clearTestScope = useMutation(api.syllabus.clearTestScope);

//   const currentItem = allContent?.find(
//     (item) =>
//       item.grade === formData.grade &&
//       item.term === parseInt(formData.term || "0") &&
//       item.category === formData.category,
//   );
//   const editingId = currentItem?._id || null;

//   const handleSelectionChange = (
//     field: "grade" | "term" | "category",
//     value: string,
//   ) => {
//     const newFormData = { ...formData, [field]: value };
//     setFormData(newFormData);

//     const termNum =
//       field === "term" ? parseInt(value) : parseInt(formData.term || "0");
//     const gradeVal = field === "grade" ? value : formData.grade;
//     const catVal = field === "category" ? value : formData.category;

//     const existing = allContent?.find(
//       (item) =>
//         item.grade === gradeVal &&
//         item.term === termNum &&
//         item.category === catVal,
//     );

//     if (existing) {
//       setFormData({
//         grade: existing.grade,
//         term: existing.term.toString(),
//         category: existing.category,
//         title: existing.title,
//         description: existing.description || "",
//       });
//       setYoutubeLinks(
//         existing.youtubeLinks?.length
//           ? existing.youtubeLinks
//           : [{ title: "", url: "" }],
//       );
//       // Populate teaching links if they exist
//       if (existing.teachingLinks?.length) {
//         setTeachingLinks(
//           existing.teachingLinks.map((l) => ({
//             ...l,
//             description: l.description || "",
//           })),
//         );
//         setShowTeachingLinks(true);
//       } else {
//         setTeachingLinks([]);
//         setShowTeachingLinks(false);
//       }
//       // Mini booklet
//       if (existing.miniBookletViewLink) {
//         setMiniBookletTitle(existing.miniBookletTitle || "");
//         setShowMiniBooklet(true);
//       } else {
//         setMiniBookletTitle("");
//         setShowMiniBooklet(false);
//       }
//       // Test scope
//       if (existing.testScopePdfViewLink) {
//         setTestScopeTitle(existing.testScopeTitle || "");
//         setShowTestScope(true);
//       } else {
//         setTestScopeTitle("");
//         setShowTestScope(false);
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//         title: "",
//         description: "",
//       }));
//       setYoutubeLinks([{ title: "", url: "" }]);
//       setTeachingLinks([]);
//       setShowTeachingLinks(false);
//       setMiniBookletTitle("");
//       setShowMiniBooklet(false);
//       setTestScopeTitle("");
//       setShowTestScope(false);
//     }

//     setWorkingFile(null);
//     setAnswerFile(null);
//     setMiniBookletFile(null);
//     setTestScopeFile(null);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ── Song YouTube helpers ──
//   const handleYoutubeChange = (
//     index: number,
//     field: "title" | "url",
//     value: string,
//   ) => {
//     const updated = [...youtubeLinks];
//     updated[index][field] = value;
//     setYoutubeLinks(updated);
//   };
//   const addYoutubeField = () =>
//     setYoutubeLinks([...youtubeLinks, { title: "", url: "" }]);
//   const removeYoutubeField = (index: number) =>
//     setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));

//   // ── Teaching link helpers ──
//   const addTeachingLink = () =>
//     setTeachingLinks([
//       ...teachingLinks,
//       { title: "", url: "", description: "" },
//     ]);
//   const removeTeachingLink = (index: number) =>
//     setTeachingLinks(teachingLinks.filter((_, i) => i !== index));
//   const updateTeachingLink = (
//     index: number,
//     field: "title" | "url" | "description",
//     value: string,
//   ) => {
//     const updated = [...teachingLinks];
//     updated[index][field] = value;
//     setTeachingLinks(updated);
//   };

//   const resetForm = () => {
//     setFormData({
//       grade: "",
//       term: "",
//       category: "",
//       title: "",
//       description: "",
//     });
//     setYoutubeLinks([{ title: "", url: "" }]);
//     setTeachingLinks([]);
//     setShowTeachingLinks(false);
//     setWorkingFile(null);
//     setAnswerFile(null);
//     setMiniBookletFile(null);
//     setMiniBookletTitle("");
//     setShowMiniBooklet(false);
//     setTestScopeFile(null);
//     setTestScopeTitle("");
//     setShowTestScope(false);
//   };

//   const handleDelete = async () => {
//     if (!editingId) return;
//     if (!confirm("Delete this content?")) return;
//     await remove({ id: editingId });
//     toast.success("Content deleted");
//     resetForm();
//   };

//   // ── Generic file upload helper ──
//   const uploadFile = async (
//     file: File,
//     bookletType: "working" | "answer" | "mini" | "single" | "testScope",
//     extra?: Record<string, string>,
//   ) => {
//     const uploadForm = new FormData();
//     uploadForm.append("title", formData.title);
//     uploadForm.append("grade", formData.grade);
//     uploadForm.append("term", formData.term);
//     uploadForm.append("category", formData.category);
//     uploadForm.append("bookletType", bookletType);
//     if (formData.description)
//       uploadForm.append("description", formData.description);
//     if (editingId) uploadForm.append("id", editingId.toString());
//     uploadForm.append("file", file);
//     if (extra) {
//       Object.entries(extra).forEach(([k, v]) => uploadForm.append(k, v));
//     }
//     return fetch("/api/upload-syllabus", { method: "POST", body: uploadForm });
//   };

//   // ── Upload teaching links (no file) ──
//   const uploadTeachingLinks = async () => {
//     const uploadForm = new FormData();
//     uploadForm.append("title", formData.title);
//     uploadForm.append("grade", formData.grade);
//     uploadForm.append("term", formData.term);
//     uploadForm.append("category", formData.category);
//     uploadForm.append("bookletType", "single");
//     if (formData.description)
//       uploadForm.append("description", formData.description);
//     if (editingId) uploadForm.append("id", editingId.toString());
//     uploadForm.append(
//       "teachingLinks",
//       JSON.stringify(teachingLinks.filter((l) => l.title && l.url)),
//     );
//     return fetch("/api/upload-syllabus", { method: "POST", body: uploadForm });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !formData.grade ||
//       !formData.term ||
//       !formData.category ||
//       !formData.title
//     ) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     setIsUploading(true);
//     try {
//       // ── Booklet: working + answer + optional mini ──
//       if (formData.category === "booklet") {
//         if (!workingFile && !answerFile && !miniBookletFile && !editingId) {
//           toast.error("Please upload at least one PDF");
//           setIsUploading(false);
//           return;
//         }
//         if (workingFile) {
//           const res = await uploadFile(workingFile, "working");
//           if (!res.ok) throw new Error("Working booklet failed");
//         }
//         if (answerFile) {
//           const res = await uploadFile(answerFile, "answer");
//           if (!res.ok) throw new Error("Answer booklet failed");
//         }
//         if (miniBookletFile) {
//           const res = await uploadFile(miniBookletFile, "mini", {
//             miniBookletTitle: miniBookletTitle || "Mini Booklet",
//           });
//           if (!res.ok) throw new Error("Mini booklet failed");
//         }
//       }

//       // ── Songs ──
//       else if (formData.category === "songs") {
//         const uploadForm = new FormData();
//         uploadForm.append("title", formData.title);
//         uploadForm.append("grade", formData.grade);
//         uploadForm.append("term", formData.term);
//         uploadForm.append("category", formData.category);
//         uploadForm.append("bookletType", "single");
//         if (formData.description)
//           uploadForm.append("description", formData.description);
//         if (editingId) uploadForm.append("id", editingId.toString());
//         uploadForm.append(
//           "youtubeLinks",
//           JSON.stringify(youtubeLinks.filter((l) => l.title && l.url)),
//         );
//         const res = await fetch("/api/upload-syllabus", {
//           method: "POST",
//           body: uploadForm,
//         });
//         if (!res.ok) throw new Error("Songs upload failed");
//       }

//       // ── Clapping or Test (main PDF) ──
//       else if (workingFile) {
//         const res = await uploadFile(workingFile, "single");
//         if (!res.ok) throw new Error("Upload failed");
//       } else if (editingId) {
//         // No new main file but maybe scope or teaching links — we still need to save metadata
//         const uploadForm = new FormData();
//         uploadForm.append("title", formData.title);
//         uploadForm.append("grade", formData.grade);
//         uploadForm.append("term", formData.term);
//         uploadForm.append("category", formData.category);
//         uploadForm.append("bookletType", "single");
//         if (formData.description)
//           uploadForm.append("description", formData.description);
//         uploadForm.append("id", editingId.toString());
//         const res = await fetch("/api/upload-syllabus", {
//           method: "POST",
//           body: uploadForm,
//         });
//         if (!res.ok) throw new Error("Update failed");
//       }

//       // ── Test scope PDF (additional, independent upload) ──
//       if (formData.category === "test" && testScopeFile) {
//         const res = await uploadFile(testScopeFile, "testScope", {
//           testScopeTitle: testScopeTitle || "Test Scope",
//         });
//         if (!res.ok) throw new Error("Test scope upload failed");
//       }

//       // ── Teaching links (any category) ──
//       if (showTeachingLinks && teachingLinks.some((l) => l.title && l.url)) {
//         const res = await uploadTeachingLinks();
//         if (!res.ok) throw new Error("Teaching links save failed");
//       }

//       toast.success(
//         editingId ? "Updated successfully!" : "Uploaded successfully!",
//       );
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const isBooklet = formData.category === "booklet";
//   const isSongs = formData.category === "songs";
//   const isTest = formData.category === "test";

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
//       <Card className="bg-zinc-900 border-purple-800">
//         <CardHeader>
//           <CardTitle className="text-3xl text-purple-400">
//             📚 Syllabus Content Manager
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* ── Grade / Term / Category selectors ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <Label>Grade *</Label>
//                 <Select
//                   value={formData.grade}
//                   onValueChange={(v) => handleSelectionChange("grade", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Grade" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {grades.map((g) => (
//                       <SelectItem key={g} value={g}>
//                         {g}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Term *</Label>
//                 <Select
//                   value={formData.term}
//                   onValueChange={(v) => handleSelectionChange("term", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Term" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[1, 2, 3, 4].map((t) => (
//                       <SelectItem key={t} value={t.toString()}>
//                         Term {t}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Category *</Label>
//                 <Select
//                   value={formData.category}
//                   onValueChange={(v) => handleSelectionChange("category", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((cat) => (
//                       <SelectItem key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* ── Title & Description ── */}
//             <div>
//               <Label>Title *</Label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g. Grade 1 Term 2 Music Booklet"
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={2}
//               />
//             </div>

//             {/* ── Songs: YouTube links ── */}
//             {isSongs && (
//               <div className="space-y-3 p-4 bg-zinc-800 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <Label className="flex items-center gap-2">
//                     <FaYoutube className="h-4 w-4 text-red-500" /> Song YouTube
//                     Links
//                   </Label>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addYoutubeField}
//                   >
//                     <Plus className="h-4 w-4 mr-1" /> Add Song
//                   </Button>
//                 </div>
//                 {youtubeLinks.map((link, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-1 md:grid-cols-2 gap-3"
//                   >
//                     <Input
//                       placeholder="Song Title"
//                       value={link.title}
//                       onChange={(e) =>
//                         handleYoutubeChange(index, "title", e.target.value)
//                       }
//                     />
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="YouTube URL"
//                         value={link.url}
//                         onChange={(e) =>
//                           handleYoutubeChange(index, "url", e.target.value)
//                         }
//                       />
//                       {youtubeLinks.length > 1 && (
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeYoutubeField(index)}
//                           className="text-red-400"
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ── Booklet PDFs ── */}
//             {isBooklet && (
//               <div className="p-4 bg-zinc-800 rounded-lg space-y-4">
//                 <Label className="text-base font-semibold">Booklet PDFs</Label>
//                 <div>
//                   <Label className="text-sm">
//                     Working Booklet PDF (without answers)
//                   </Label>
//                   <Input
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) =>
//                       setWorkingFile(e.target.files?.[0] || null)
//                     }
//                   />
//                   {currentItem?.workingBookletViewLink && !workingFile && (
//                     <p className="text-xs text-emerald-400 mt-1">
//                       ✓ Current file uploaded — upload new to replace
//                     </p>
//                   )}
//                   {workingFile && (
//                     <p className="text-green-400 text-sm mt-1">
//                       ✓ {workingFile.name}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <Label className="text-sm">
//                     Answer Booklet PDF (with answers)
//                   </Label>
//                   <Input
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => setAnswerFile(e.target.files?.[0] || null)}
//                   />
//                   {currentItem?.answerBookletViewLink && !answerFile && (
//                     <p className="text-xs text-emerald-400 mt-1">
//                       ✓ Current file uploaded — upload new to replace
//                     </p>
//                   )}
//                   {answerFile && (
//                     <p className="text-green-400 text-sm mt-1">
//                       ✓ {answerFile.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* ── NEW: Mini Booklet ── */}
//                 <div className="border-t border-zinc-700 pt-4">
//                   {!showMiniBooklet ? (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setShowMiniBooklet(true)}
//                       className="text-purple-400 border-purple-700"
//                     >
//                       <BookOpenCheck className="h-4 w-4 mr-2" />+ Add Mini /
//                       Short Booklet (optional)
//                     </Button>
//                   ) : (
//                     <div className="space-y-3 bg-purple-950/30 p-3 rounded-lg border border-purple-800">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-sm flex items-center gap-2">
//                           <BookOpenCheck className="h-4 w-4 text-purple-400" />
//                           Mini / Short Booklet PDF
//                         </Label>
//                         <div className="flex gap-2">
//                           {editingId && currentItem?.miniBookletViewLink && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="text-red-400 text-xs"
//                               onClick={async () => {
//                                 if (confirm("Remove mini booklet?")) {
//                                   await clearMiniBooklet({ id: editingId });
//                                   toast.success("Mini booklet removed");
//                                   setShowMiniBooklet(false);
//                                   setMiniBookletFile(null);
//                                   setMiniBookletTitle("");
//                                 }
//                               }}
//                             >
//                               <Trash2 className="h-3 w-3 mr-1" /> Remove
//                             </Button>
//                           )}
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => {
//                               setShowMiniBooklet(false);
//                               setMiniBookletFile(null);
//                             }}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                       <Input
//                         placeholder="Mini booklet title (e.g. Quick Reference Sheet)"
//                         value={miniBookletTitle}
//                         onChange={(e) => setMiniBookletTitle(e.target.value)}
//                       />
//                       <Input
//                         type="file"
//                         accept=".pdf"
//                         onChange={(e) =>
//                           setMiniBookletFile(e.target.files?.[0] || null)
//                         }
//                       />
//                       {currentItem?.miniBookletViewLink && !miniBookletFile && (
//                         <p className="text-xs text-emerald-400">
//                           ✓ Current mini booklet uploaded — upload new to
//                           replace
//                         </p>
//                       )}
//                       {miniBookletFile && (
//                         <p className="text-green-400 text-sm">
//                           ✓ {miniBookletFile.name}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── Clapping or Test main PDF ── */}
//             {(formData.category === "clapping" || isTest) && (
//               <div>
//                 <Label>
//                   {isTest ? "Term Test PDF" : "Clapping Assessment PDF"}
//                 </Label>
//                 <Input
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) => setWorkingFile(e.target.files?.[0] || null)}
//                 />
//                 {currentItem && !workingFile && (
//                   <p className="text-xs text-emerald-400 mt-1">
//                     ✓ File already uploaded — upload new to replace
//                   </p>
//                 )}
//                 {workingFile && (
//                   <p className="text-green-400 text-sm mt-1">
//                     ✓ {workingFile.name}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* ── NEW: Test Scope PDF ── */}
//             {isTest && (
//               <div className="border border-zinc-700 rounded-lg p-4">
//                 {!showTestScope ? (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setShowTestScope(true)}
//                     className="text-emerald-400 border-emerald-800"
//                   >
//                     <FileSearch className="h-4 w-4 mr-2" />+ Add Test Scope PDF
//                     (optional)
//                   </Button>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <Label className="text-sm flex items-center gap-2">
//                         <FileSearch className="h-4 w-4 text-emerald-400" />
//                         Test Scope / Study Guide PDF
//                       </Label>
//                       <div className="flex gap-2">
//                         {editingId && currentItem?.testScopePdfViewLink && (
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-400 text-xs"
//                             onClick={async () => {
//                               if (confirm("Remove test scope PDF?")) {
//                                 await clearTestScope({ id: editingId });
//                                 toast.success("Test scope removed");
//                                 setShowTestScope(false);
//                                 setTestScopeFile(null);
//                                 setTestScopeTitle("");
//                               }
//                             }}
//                           >
//                             <Trash2 className="h-3 w-3 mr-1" /> Remove
//                           </Button>
//                         )}
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => {
//                             setShowTestScope(false);
//                             setTestScopeFile(null);
//                           }}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     <Input
//                       placeholder="Scope title (e.g. Term 2 Test Scope)"
//                       value={testScopeTitle}
//                       onChange={(e) => setTestScopeTitle(e.target.value)}
//                     />
//                     <Input
//                       type="file"
//                       accept=".pdf"
//                       onChange={(e) =>
//                         setTestScopeFile(e.target.files?.[0] || null)
//                       }
//                     />
//                     {currentItem?.testScopePdfViewLink && !testScopeFile && (
//                       <p className="text-xs text-emerald-400">
//                         ✓ Scope already uploaded — upload new to replace
//                       </p>
//                     )}
//                     {testScopeFile && (
//                       <p className="text-green-400 text-sm">
//                         ✓ {testScopeFile.name}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NEW: Extra Teaching / Resource YouTube Links (all categories) ── */}
//             {formData.category && (
//               <div className="border border-zinc-700 rounded-lg p-4">
//                 {!showTeachingLinks ? (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setShowTeachingLinks(true);
//                       if (teachingLinks.length === 0) addTeachingLink();
//                     }}
//                     className="text-amber-400 border-amber-800"
//                   >
//                     <FaYoutube className="h-4 w-4 mr-2" />+ Add Extra Teaching
//                     YouTube Links (optional)
//                   </Button>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <Label className="flex items-center gap-2">
//                         <FaYoutube className="h-4 w-4 text-amber-400" />
//                         Extra Teaching / Resource Links
//                       </Label>
//                       <div className="flex gap-2">
//                         {editingId && currentItem?.teachingLinks?.length && (
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-400 text-xs"
//                             onClick={async () => {
//                               if (confirm("Remove all teaching links?")) {
//                                 await clearTeachingLinks({ id: editingId });
//                                 toast.success("Teaching links removed");
//                                 setTeachingLinks([]);
//                                 setShowTeachingLinks(false);
//                               }
//                             }}
//                           >
//                             <Trash2 className="h-3 w-3 mr-1" /> Clear All
//                           </Button>
//                         )}
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={addTeachingLink}
//                         >
//                           <Plus className="h-4 w-4 mr-1" /> Add Link
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setShowTeachingLinks(false)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     {teachingLinks.map((link, index) => (
//                       <div
//                         key={index}
//                         className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-zinc-800 p-3 rounded-md"
//                       >
//                         <Input
//                           placeholder="Link Title"
//                           value={link.title}
//                           onChange={(e) =>
//                             updateTeachingLink(index, "title", e.target.value)
//                           }
//                         />
//                         <Input
//                           placeholder="YouTube URL"
//                           value={link.url}
//                           onChange={(e) =>
//                             updateTeachingLink(index, "url", e.target.value)
//                           }
//                         />
//                         <div className="flex gap-2">
//                           <Input
//                             placeholder="Short description (optional)"
//                             value={link.description}
//                             onChange={(e) =>
//                               updateTeachingLink(
//                                 index,
//                                 "description",
//                                 e.target.value,
//                               )
//                             }
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeTeachingLink(index)}
//                             className="text-red-400 flex-shrink-0"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── Action buttons ── */}
//             <div className="flex gap-4">
//               <Button
//                 type="submit"
//                 className="flex-1 h-12 text-lg bg-purple-600 hover:bg-purple-700"
//                 disabled={isUploading}
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="mr-2 h-5 w-5" />{" "}
//                     {editingId ? "Update Content" : "Upload Content"}
//                   </>
//                 )}
//               </Button>
//               {editingId && (
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleDelete}
//                 >
//                   <Trash2 className="mr-2 h-4 w-4" /> Delete
//                 </Button>
//               )}
//               <Button type="button" variant="outline" onClick={resetForm}>
//                 <RefreshCw className="mr-2 h-4 w-4" /> Clear
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  Trash2,
  RefreshCw,
  BookOpenCheck,
  FileSearch,
  X,
  Plus,
  FileCheck,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

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

const categories = [
  { value: "songs", label: "Term Songs (YouTube)" },
  { value: "booklet", label: "Termly Booklet" },
  { value: "clapping", label: "Clapping Assessment" },
  { value: "test", label: "Term Test" },
  { value: "youtubeLinks", label: "Extra YouTube Links" }, // NEW standalone category
];

type SyllabusItem = {
  _id: Id<"syllabusContent">;
  grade: string;
  term: number;
  category: "songs" | "booklet" | "clapping" | "test" | "youtubeLinks";
  title: string;
  description?: string;
  youtubeLinks?: { title: string; url: string; duration?: string }[];
  teachingLinks?: { title: string; url: string; description?: string }[];
  workingBookletViewLink?: string;
  answerBookletViewLink?: string;
  miniBookletViewLink?: string;
  miniBookletTitle?: string;
  clappingPdfViewLink?: string;
  testPdfViewLink?: string;
  testScopePdfViewLink?: string;
  testScopeTitle?: string;
  testAnswerSheetViewLink?: string; // NEW
  isActive: boolean;
};

export default function SyllabusAdminPage() {
  const [formData, setFormData] = useState({
    grade: "",
    term: "",
    category: "",
    title: "",
    description: "",
  });

  // Song YouTube links
  const [youtubeLinks, setYoutubeLinks] = useState([{ title: "", url: "" }]);

  // Extra YouTube links (standalone category)
  const [teachingLinks, setTeachingLinks] = useState<
    { title: string; url: string; description: string }[]
  >([]);

  // File state
  const [workingFile, setWorkingFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);

  // Mini booklet (optional)
  const [miniBookletFile, setMiniBookletFile] = useState<File | null>(null);
  const [miniBookletTitle, setMiniBookletTitle] = useState("");
  const [showMiniBooklet, setShowMiniBooklet] = useState(false);

  // Test scope (optional)
  const [testScopeFile, setTestScopeFile] = useState<File | null>(null);
  const [testScopeTitle, setTestScopeTitle] = useState("");
  const [showTestScope, setShowTestScope] = useState(false);

  // NEW: Test answer sheet (optional)
  const [testAnswerSheetFile, setTestAnswerSheetFile] = useState<File | null>(
    null,
  );
  const [showTestAnswerSheet, setShowTestAnswerSheet] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const allContent = useQuery(api.syllabus.getAllActive) as
    | SyllabusItem[]
    | undefined;

  const remove = useMutation(api.syllabus.remove);
  const clearTeachingLinks = useMutation(api.syllabus.clearTeachingLinks);
  const clearMiniBooklet = useMutation(api.syllabus.clearMiniBooklet);
  const clearTestScope = useMutation(api.syllabus.clearTestScope);
  const clearTestAnswerSheet = useMutation(api.syllabus.clearTestAnswerSheet); // NEW

  const currentItem = allContent?.find(
    (item) =>
      item.grade === formData.grade &&
      item.term === parseInt(formData.term || "0") &&
      item.category === formData.category,
  );

  const editingId = currentItem?._id || null;

  const handleSelectionChange = (
    field: "grade" | "term" | "category",
    value: string,
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    const termNum =
      field === "term" ? parseInt(value) : parseInt(formData.term || "0");
    const gradeVal = field === "grade" ? value : formData.grade;
    const catVal = field === "category" ? value : formData.category;

    const existing = allContent?.find(
      (item) =>
        item.grade === gradeVal &&
        item.term === termNum &&
        item.category === catVal,
    );

    if (existing) {
      setFormData({
        grade: existing.grade,
        term: existing.term.toString(),
        category: existing.category,
        title: existing.title,
        description: existing.description || "",
      });

      setYoutubeLinks(
        existing.youtubeLinks?.length
          ? existing.youtubeLinks
          : [{ title: "", url: "" }],
      );

      // Populate teaching links if they exist (used by youtubeLinks category)
      if (existing.teachingLinks?.length) {
        setTeachingLinks(
          existing.teachingLinks.map((l) => ({
            ...l,
            description: l.description || "",
          })),
        );
      } else {
        setTeachingLinks([]);
      }

      // Mini booklet
      if (existing.miniBookletViewLink) {
        setMiniBookletTitle(existing.miniBookletTitle || "");
        setShowMiniBooklet(true);
      } else {
        setMiniBookletTitle("");
        setShowMiniBooklet(false);
      }

      // Test scope
      if (existing.testScopePdfViewLink) {
        setTestScopeTitle(existing.testScopeTitle || "");
        setShowTestScope(true);
      } else {
        setTestScopeTitle("");
        setShowTestScope(false);
      }

      // Test answer sheet
      if (existing.testAnswerSheetViewLink) {
        setShowTestAnswerSheet(true);
      } else {
        setShowTestAnswerSheet(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        title: "",
        description: "",
      }));
      setYoutubeLinks([{ title: "", url: "" }]);
      setTeachingLinks([]);
      setMiniBookletTitle("");
      setShowMiniBooklet(false);
      setTestScopeTitle("");
      setShowTestScope(false);
      setShowTestAnswerSheet(false);
    }

    setWorkingFile(null);
    setAnswerFile(null);
    setMiniBookletFile(null);
    setTestScopeFile(null);
    setTestAnswerSheetFile(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Song YouTube helpers ──
  const handleYoutubeChange = (
    index: number,
    field: "title" | "url",
    value: string,
  ) => {
    const updated = [...youtubeLinks];
    updated[index][field] = value;
    setYoutubeLinks(updated);
  };

  const addYoutubeField = () =>
    setYoutubeLinks([...youtubeLinks, { title: "", url: "" }]);

  const removeYoutubeField = (index: number) =>
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));

  // ── Extra YouTube link helpers ──
  const addTeachingLink = () =>
    setTeachingLinks([
      ...teachingLinks,
      { title: "", url: "", description: "" },
    ]);

  const removeTeachingLink = (index: number) =>
    setTeachingLinks(teachingLinks.filter((_, i) => i !== index));

  const updateTeachingLink = (
    index: number,
    field: "title" | "url" | "description",
    value: string,
  ) => {
    const updated = [...teachingLinks];
    updated[index][field] = value;
    setTeachingLinks(updated);
  };

  const resetForm = () => {
    setFormData({
      grade: "",
      term: "",
      category: "",
      title: "",
      description: "",
    });
    setYoutubeLinks([{ title: "", url: "" }]);
    setTeachingLinks([]);
    setWorkingFile(null);
    setAnswerFile(null);
    setMiniBookletFile(null);
    setMiniBookletTitle("");
    setShowMiniBooklet(false);
    setTestScopeFile(null);
    setTestScopeTitle("");
    setShowTestScope(false);
    setTestAnswerSheetFile(null);
    setShowTestAnswerSheet(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Delete this content?")) return;
    await remove({ id: editingId });
    toast.success("Content deleted");
    resetForm();
  };

  // ── Generic file upload helper ──
  const uploadFile = async (
    file: File,
    bookletType:
      | "working"
      | "answer"
      | "mini"
      | "single"
      | "testScope"
      | "testAnswerSheet",
    extra?: Record<string, string>,
  ) => {
    const uploadForm = new FormData();
    uploadForm.append("title", formData.title);
    uploadForm.append("grade", formData.grade);
    uploadForm.append("term", formData.term);
    uploadForm.append("category", formData.category);
    uploadForm.append("bookletType", bookletType);
    if (formData.description)
      uploadForm.append("description", formData.description);
    if (editingId) uploadForm.append("id", editingId.toString());
    uploadForm.append("file", file);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => uploadForm.append(k, v));
    }
    return fetch("/api/upload-syllabus", { method: "POST", body: uploadForm });
  };

  // ── Upload extra YouTube links (no file) ──
  const uploadTeachingLinks = async () => {
    const uploadForm = new FormData();
    uploadForm.append("title", formData.title);
    uploadForm.append("grade", formData.grade);
    uploadForm.append("term", formData.term);
    uploadForm.append("category", formData.category);
    uploadForm.append("bookletType", "single");
    if (formData.description)
      uploadForm.append("description", formData.description);
    if (editingId) uploadForm.append("id", editingId.toString());
    uploadForm.append(
      "teachingLinks",
      JSON.stringify(teachingLinks.filter((l) => l.title && l.url)),
    );
    return fetch("/api/upload-syllabus", { method: "POST", body: uploadForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.grade ||
      !formData.term ||
      !formData.category ||
      !formData.title
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsUploading(true);

    try {
      // ── Extra YouTube Links (standalone category) ──
      if (formData.category === "youtubeLinks") {
        if (!teachingLinks.some((l) => l.title && l.url) && !editingId) {
          toast.error("Please add at least one YouTube link");
          setIsUploading(false);
          return;
        }
        const res = await uploadTeachingLinks();
        if (!res.ok) throw new Error("YouTube links save failed");
      }

      // ── Booklet: working + answer + optional mini ──
      else if (formData.category === "booklet") {
        if (!workingFile && !answerFile && !miniBookletFile && !editingId) {
          toast.error("Please upload at least one PDF");
          setIsUploading(false);
          return;
        }
        if (workingFile) {
          const res = await uploadFile(workingFile, "working");
          if (!res.ok) throw new Error("Working booklet failed");
        }
        if (answerFile) {
          const res = await uploadFile(answerFile, "answer");
          if (!res.ok) throw new Error("Answer booklet failed");
        }
        if (miniBookletFile) {
          const res = await uploadFile(miniBookletFile, "mini", {
            miniBookletTitle: miniBookletTitle || "Mini Booklet",
          });
          if (!res.ok) throw new Error("Mini booklet failed");
        }
      }

      // ── Songs ──
      else if (formData.category === "songs") {
        const uploadForm = new FormData();
        uploadForm.append("title", formData.title);
        uploadForm.append("grade", formData.grade);
        uploadForm.append("term", formData.term);
        uploadForm.append("category", formData.category);
        uploadForm.append("bookletType", "single");
        if (formData.description)
          uploadForm.append("description", formData.description);
        if (editingId) uploadForm.append("id", editingId.toString());
        uploadForm.append(
          "youtubeLinks",
          JSON.stringify(youtubeLinks.filter((l) => l.title && l.url)),
        );
        const res = await fetch("/api/upload-syllabus", {
          method: "POST",
          body: uploadForm,
        });
        if (!res.ok) throw new Error("Songs upload failed");
      }

      // ── Clapping or Test (main PDF) ──
      else if (workingFile) {
        const res = await uploadFile(workingFile, "single");
        if (!res.ok) throw new Error("Upload failed");
      } else if (editingId) {
        // No new main file — save metadata only
        const uploadForm = new FormData();
        uploadForm.append("title", formData.title);
        uploadForm.append("grade", formData.grade);
        uploadForm.append("term", formData.term);
        uploadForm.append("category", formData.category);
        uploadForm.append("bookletType", "single");
        if (formData.description)
          uploadForm.append("description", formData.description);
        uploadForm.append("id", editingId.toString());
        const res = await fetch("/api/upload-syllabus", {
          method: "POST",
          body: uploadForm,
        });
        if (!res.ok) throw new Error("Update failed");
      }

      // ── Test scope PDF (independent upload) ──
      if (formData.category === "test" && testScopeFile) {
        const res = await uploadFile(testScopeFile, "testScope", {
          testScopeTitle: testScopeTitle || "Test Scope",
        });
        if (!res.ok) throw new Error("Test scope upload failed");
      }

      // ── NEW: Test answer sheet PDF (independent upload) ──
      if (formData.category === "test" && testAnswerSheetFile) {
        const res = await uploadFile(testAnswerSheetFile, "testAnswerSheet");
        if (!res.ok) throw new Error("Test answer sheet upload failed");
      }

      toast.success(
        editingId ? "Updated successfully!" : "Uploaded successfully!",
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const isBooklet = formData.category === "booklet";
  const isSongs = formData.category === "songs";
  const isTest = formData.category === "test";
  const isYoutubeLinks = formData.category === "youtubeLinks"; // NEW

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card className="bg-zinc-900 border-purple-800">
        <CardHeader>
          <CardTitle className="text-3xl text-purple-400">
            📚 Syllabus Content Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Grade / Term / Category selectors ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => handleSelectionChange("grade", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Term *</Label>
                <Select
                  value={formData.term}
                  onValueChange={(v) => handleSelectionChange("term", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((t) => (
                      <SelectItem key={t} value={t.toString()}>
                        Term {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleSelectionChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Title & Description ── */}
            <div>
              <Label>Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Grade 1 Term 2 Music Booklet"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            {/* ── Songs: YouTube links ── */}
            {isSongs && (
              <div className="space-y-3 p-4 bg-zinc-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <FaYoutube className="h-4 w-4 text-red-500" /> Song YouTube
                    Links
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addYoutubeField}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Song
                  </Button>
                </div>
                {youtubeLinks.map((link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <Input
                      placeholder="Song Title"
                      value={link.title}
                      onChange={(e) =>
                        handleYoutubeChange(index, "title", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="YouTube URL"
                        value={link.url}
                        onChange={(e) =>
                          handleYoutubeChange(index, "url", e.target.value)
                        }
                      />
                      {youtubeLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeYoutubeField(index)}
                          className="text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── NEW: Extra YouTube Links (standalone category) ── */}
            {isYoutubeLinks && (
              <div className="space-y-3 p-4 bg-amber-950/30 border border-amber-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <FaYoutube className="h-4 w-4 text-amber-400" />
                    Extra Teaching YouTube Links
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeachingLink}
                    className="text-amber-400 border-amber-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Link
                  </Button>
                </div>

                {teachingLinks.length === 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addTeachingLink}
                    className="text-amber-400 w-full border border-dashed border-amber-800"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add your first link
                  </Button>
                )}

                {teachingLinks.map((link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-zinc-800 p-3 rounded-md"
                  >
                    <Input
                      placeholder="Link Title"
                      value={link.title}
                      onChange={(e) =>
                        updateTeachingLink(index, "title", e.target.value)
                      }
                    />
                    <Input
                      placeholder="YouTube URL"
                      value={link.url}
                      onChange={(e) =>
                        updateTeachingLink(index, "url", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Short description (optional)"
                        value={link.description}
                        onChange={(e) =>
                          updateTeachingLink(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeachingLink(index)}
                        className="text-red-400 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {editingId && currentItem?.teachingLinks?.length && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400 text-xs"
                    onClick={async () => {
                      if (confirm("Remove all YouTube links?")) {
                        await clearTeachingLinks({ id: editingId });
                        toast.success("YouTube links removed");
                        setTeachingLinks([]);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Clear All Links
                  </Button>
                )}
              </div>
            )}

            {/* ── Booklet PDFs ── */}
            {isBooklet && (
              <div className="p-4 bg-zinc-800 rounded-lg space-y-4">
                <Label className="text-base font-semibold">Booklet PDFs</Label>

                <div>
                  <Label className="text-sm">
                    Working Booklet PDF (without answers)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setWorkingFile(e.target.files?.[0] || null)
                    }
                  />
                  {currentItem?.workingBookletViewLink && !workingFile && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ Current file uploaded — upload new to replace
                    </p>
                  )}
                  {workingFile && (
                    <p className="text-green-400 text-sm mt-1">
                      ✓ {workingFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm">
                    Answer Booklet PDF (with answers)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setAnswerFile(e.target.files?.[0] || null)}
                  />
                  {currentItem?.answerBookletViewLink && !answerFile && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ Current file uploaded — upload new to replace
                    </p>
                  )}
                  {answerFile && (
                    <p className="text-green-400 text-sm mt-1">
                      ✓ {answerFile.name}
                    </p>
                  )}
                </div>

                {/* Mini Booklet */}
                <div className="border-t border-zinc-700 pt-4">
                  {!showMiniBooklet ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMiniBooklet(true)}
                      className="text-purple-400 border-purple-700"
                    >
                      <BookOpenCheck className="h-4 w-4 mr-2" />+ Add Mini /
                      Short Booklet (optional)
                    </Button>
                  ) : (
                    <div className="space-y-3 bg-purple-950/30 p-3 rounded-lg border border-purple-800">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm flex items-center gap-2">
                          <BookOpenCheck className="h-4 w-4 text-purple-400" />{" "}
                          Mini / Short Booklet PDF
                        </Label>
                        <div className="flex gap-2">
                          {editingId && currentItem?.miniBookletViewLink && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-400 text-xs"
                              onClick={async () => {
                                if (confirm("Remove mini booklet?")) {
                                  await clearMiniBooklet({ id: editingId });
                                  toast.success("Mini booklet removed");
                                  setShowMiniBooklet(false);
                                  setMiniBookletFile(null);
                                  setMiniBookletTitle("");
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowMiniBooklet(false);
                              setMiniBookletFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        placeholder="Mini booklet title (e.g. Quick Reference Sheet)"
                        value={miniBookletTitle}
                        onChange={(e) => setMiniBookletTitle(e.target.value)}
                      />
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setMiniBookletFile(e.target.files?.[0] || null)
                        }
                      />
                      {currentItem?.miniBookletViewLink && !miniBookletFile && (
                        <p className="text-xs text-emerald-400">
                          ✓ Current mini booklet uploaded — upload new to
                          replace
                        </p>
                      )}
                      {miniBookletFile && (
                        <p className="text-green-400 text-sm">
                          ✓ {miniBookletFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Clapping or Test main PDF ── */}
            {(formData.category === "clapping" || isTest) && (
              <div>
                <Label>
                  {isTest ? "Term Test PDF" : "Clapping Assessment PDF"}
                </Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setWorkingFile(e.target.files?.[0] || null)}
                />
                {currentItem && !workingFile && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ✓ File already uploaded — upload new to replace
                  </p>
                )}
                {workingFile && (
                  <p className="text-green-400 text-sm mt-1">
                    ✓ {workingFile.name}
                  </p>
                )}
              </div>
            )}

            {/* ── Test additional PDFs: scope + answer sheet ── */}
            {isTest && (
              <div className="space-y-3">
                {/* Test Scope PDF */}
                <div className="border border-zinc-700 rounded-lg p-4">
                  {!showTestScope ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTestScope(true)}
                      className="text-emerald-400 border-emerald-800"
                    >
                      <FileSearch className="h-4 w-4 mr-2" />+ Add Test Scope
                      PDF (optional)
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm flex items-center gap-2">
                          <FileSearch className="h-4 w-4 text-emerald-400" />{" "}
                          Test Scope / Study Guide PDF
                        </Label>
                        <div className="flex gap-2">
                          {editingId && currentItem?.testScopePdfViewLink && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-400 text-xs"
                              onClick={async () => {
                                if (confirm("Remove test scope PDF?")) {
                                  await clearTestScope({ id: editingId });
                                  toast.success("Test scope removed");
                                  setShowTestScope(false);
                                  setTestScopeFile(null);
                                  setTestScopeTitle("");
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowTestScope(false);
                              setTestScopeFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        placeholder="Scope title (e.g. Term 2 Test Scope)"
                        value={testScopeTitle}
                        onChange={(e) => setTestScopeTitle(e.target.value)}
                      />
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setTestScopeFile(e.target.files?.[0] || null)
                        }
                      />
                      {currentItem?.testScopePdfViewLink && !testScopeFile && (
                        <p className="text-xs text-emerald-400">
                          ✓ Scope already uploaded — upload new to replace
                        </p>
                      )}
                      {testScopeFile && (
                        <p className="text-green-400 text-sm">
                          ✓ {testScopeFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* NEW: Test Answer Sheet PDF */}
                <div className="border border-zinc-700 rounded-lg p-4">
                  {!showTestAnswerSheet ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTestAnswerSheet(true)}
                      className="text-blue-400 border-blue-800"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />+ Add Answer Sheet
                      PDF (optional)
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-blue-400" /> Test
                          Answer Sheet PDF
                        </Label>
                        <div className="flex gap-2">
                          {editingId &&
                            currentItem?.testAnswerSheetViewLink && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-400 text-xs"
                                onClick={async () => {
                                  if (confirm("Remove answer sheet PDF?")) {
                                    await clearTestAnswerSheet({
                                      id: editingId,
                                    });
                                    toast.success("Answer sheet removed");
                                    setShowTestAnswerSheet(false);
                                    setTestAnswerSheetFile(null);
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowTestAnswerSheet(false);
                              setTestAnswerSheetFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setTestAnswerSheetFile(e.target.files?.[0] || null)
                        }
                      />
                      {currentItem?.testAnswerSheetViewLink &&
                        !testAnswerSheetFile && (
                          <p className="text-xs text-emerald-400">
                            ✓ Answer sheet already uploaded — upload new to
                            replace
                          </p>
                        )}
                      {testAnswerSheetFile && (
                        <p className="text-green-400 text-sm">
                          ✓ {testAnswerSheetFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Action buttons ── */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 h-12 text-lg bg-purple-600 hover:bg-purple-700"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />{" "}
                    {editingId ? "Update Content" : "Upload Content"}
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={resetForm}>
                <RefreshCw className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
