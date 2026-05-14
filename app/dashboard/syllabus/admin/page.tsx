// "use client";

// import { useState } from "react";
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
// import { Loader2, Upload } from "lucide-react";

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

// export default function SyllabusAdminPage() {
//   const [formData, setFormData] = useState({
//     grade: "",
//     term: "",
//     category: "",
//     title: "",
//     description: "",
//   });

//   const [youtubeLinks, setYoutubeLinks] = useState([{ title: "", url: "" }]);
//   const [workingFile, setWorkingFile] = useState<File | null>(null);
//   const [answerFile, setAnswerFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

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

//   // Upload a single file and return drive links
//   const uploadFile = async (
//     file: File,
//     bookletType: "working" | "answer" | "single",
//   ) => {
//     const uploadForm = new FormData();
//     uploadForm.append("title", formData.title);
//     uploadForm.append("grade", formData.grade);
//     uploadForm.append("term", formData.term);
//     uploadForm.append("category", formData.category);
//     uploadForm.append("bookletType", bookletType);
//     if (formData.description)
//       uploadForm.append("description", formData.description);
//     uploadForm.append("file", file);

//     const response = await fetch("/api/upload-syllabus", {
//       method: "POST",
//       body: uploadForm,
//     });
//     return response;
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
//       if (formData.category === "booklet") {
//         // Upload working and answer booklets separately if provided
//         if (!workingFile && !answerFile) {
//           toast.error("Please upload at least one booklet PDF");
//           setIsUploading(false);
//           return;
//         }

//         if (workingFile) {
//           const res = await uploadFile(workingFile, "working");
//           if (!res.ok) {
//             const result = await res.json();
//             toast.error(result.error || "Working booklet upload failed");
//             setIsUploading(false);
//             return;
//           }
//         }

//         if (answerFile) {
//           const res = await uploadFile(answerFile, "answer");
//           if (!res.ok) {
//             const result = await res.json();
//             toast.error(result.error || "Answer booklet upload failed");
//             setIsUploading(false);
//             return;
//           }
//         }
//       } else if (formData.category === "songs") {
//         // Songs — send youtube links via JSON body separately
//         const uploadForm = new FormData();
//         uploadForm.append("title", formData.title);
//         uploadForm.append("grade", formData.grade);
//         uploadForm.append("term", formData.term);
//         uploadForm.append("category", formData.category);
//         uploadForm.append("bookletType", "single");
//         if (formData.description)
//           uploadForm.append("description", formData.description);
//         uploadForm.append(
//           "youtubeLinks",
//           JSON.stringify(youtubeLinks.filter((l) => l.title && l.url)),
//         );

//         const res = await fetch("/api/upload-syllabus", {
//           method: "POST",
//           body: uploadForm,
//         });
//         if (!res.ok) {
//           const result = await res.json();
//           toast.error(result.error || "Upload failed");
//           setIsUploading(false);
//           return;
//         }
//       } else {
//         // Clapping or Test — single file
//         if (!workingFile) {
//           toast.error("Please upload a PDF file");
//           setIsUploading(false);
//           return;
//         }
//         const res = await uploadFile(workingFile, "single");
//         if (!res.ok) {
//           const result = await res.json();
//           toast.error(result.error || "Upload failed");
//           setIsUploading(false);
//           return;
//         }
//       }

//       toast.success("Uploaded successfully!");
//       setFormData({
//         grade: "",
//         term: "",
//         category: "",
//         title: "",
//         description: "",
//       });
//       setWorkingFile(null);
//       setAnswerFile(null);
//       setYoutubeLinks([{ title: "", url: "" }]);
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const isBooklet = formData.category === "booklet";
//   const isSongs = formData.category === "songs";

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4">
//       <Card className="bg-zinc-900 border-purple-800">
//         <CardHeader>
//           <CardTitle className="text-3xl text-center text-purple-400">
//             📚 Upload Syllabus Content
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Grade, Term, Category */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <Label>Grade *</Label>
//                 <Select
//                   value={formData.grade}
//                   onValueChange={(v) => setFormData({ ...formData, grade: v })}
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
//                   onValueChange={(v) => setFormData({ ...formData, term: v })}
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
//                   onValueChange={(v) =>
//                     setFormData({ ...formData, category: v })
//                   }
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

//             {/* Title */}
//             <div>
//               <Label>Title *</Label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g. Grade 1 Term 2 Music Booklet"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Optional description..."
//                 rows={3}
//               />
//             </div>

//             {/* Booklet — two separate file inputs */}
//             {isBooklet && (
//               <div className="space-y-4">
//                 <div className="p-4 bg-zinc-800 rounded-lg space-y-4">
//                   <div>
//                     <Label>
//                       Working Booklet PDF{" "}
//                       <span className="text-zinc-400 text-xs">
//                         (without answers)
//                       </span>
//                     </Label>
//                     <Input
//                       type="file"
//                       accept=".pdf"
//                       onChange={(e) =>
//                         setWorkingFile(e.target.files?.[0] || null)
//                       }
//                     />
//                     {workingFile && (
//                       <p className="text-xs text-green-400 mt-1">
//                         ✓ {workingFile.name}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>
//                       Answer Booklet PDF{" "}
//                       <span className="text-zinc-400 text-xs">
//                         (with answers)
//                       </span>
//                     </Label>
//                     <Input
//                       type="file"
//                       accept=".pdf"
//                       onChange={(e) =>
//                         setAnswerFile(e.target.files?.[0] || null)
//                       }
//                     />
//                     {answerFile && (
//                       <p className="text-xs text-green-400 mt-1">
//                         ✓ {answerFile.name}
//                       </p>
//                     )}
//                   </div>
//                   <p className="text-xs text-zinc-500">
//                     You can upload one or both booklets.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Single PDF — Clapping or Test */}
//             {(formData.category === "clapping" ||
//               formData.category === "test") && (
//               <div>
//                 <Label>Upload PDF</Label>
//                 <Input
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) => setWorkingFile(e.target.files?.[0] || null)}
//                 />
//                 {workingFile && (
//                   <p className="text-xs text-green-400 mt-1">
//                     ✓ {workingFile.name}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* YouTube Links */}
//             {isSongs && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <Label>YouTube Song Links</Label>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addYoutubeField}
//                   >
//                     + Add Song
//                   </Button>
//                 </div>
//                 {youtubeLinks.map((link, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
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
//                           className="text-red-400 hover:text-red-300 flex-shrink-0"
//                         >
//                           ✕
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <Button
//               type="submit"
//               className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700"
//               disabled={isUploading}
//             >
//               {isUploading ? (
//                 <>
//                   <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="mr-2 h-5 w-5" /> Upload Content
//                 </>
//               )}
//             </Button>
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
import { Loader2, Upload, Trash2, RefreshCw } from "lucide-react";

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
];

type SyllabusItem = {
  _id: Id<"syllabusContent">;
  grade: string;
  term: number;
  category: "songs" | "booklet" | "clapping" | "test";
  title: string;
  description?: string;
  youtubeLinks?: { title: string; url: string; duration?: string }[];
  workingBookletViewLink?: string;
  answerBookletViewLink?: string;
  clappingPdfViewLink?: string;
  testPdfViewLink?: string;
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

  const [youtubeLinks, setYoutubeLinks] = useState([{ title: "", url: "" }]);
  const [workingFile, setWorkingFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allContent = useQuery(api.syllabus.getAllActive) as
    | SyllabusItem[]
    | undefined;
  const remove = useMutation(api.syllabus.remove);

  // Find current item based on selection
  const currentItem = allContent?.find(
    (item) =>
      item.grade === formData.grade &&
      item.term === parseInt(formData.term || "0") &&
      item.category === formData.category,
  );

  const editingId = currentItem?._id || null;

  // Populate form when user selects Grade/Term/Category
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        title: "",
        description: "",
      }));
      setYoutubeLinks([{ title: "", url: "" }]);
    }

    setWorkingFile(null);
    setAnswerFile(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const resetForm = () => {
    setFormData({
      grade: "",
      term: "",
      category: "",
      title: "",
      description: "",
    });
    setYoutubeLinks([{ title: "", url: "" }]);
    setWorkingFile(null);
    setAnswerFile(null);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Delete this content?")) return;
    await remove({ id: editingId });
    toast.success("Content deleted");
    resetForm();
  };

  const uploadFile = async (
    file: File,
    bookletType: "working" | "answer" | "single",
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

    const response = await fetch("/api/upload-syllabus", {
      method: "POST",
      body: uploadForm,
    });
    return response;
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
      if (formData.category === "booklet") {
        if (!workingFile && !answerFile && !editingId) {
          toast.error("Please upload at least one booklet PDF");
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
      } else if (formData.category === "songs") {
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
      } else if (workingFile) {
        const res = await uploadFile(workingFile, "single");
        if (!res.ok) throw new Error("Upload failed");
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="bg-zinc-900 border-purple-800">
        <CardHeader>
          <CardTitle className="text-3xl text-purple-400">
            📚 Syllabus Content Manager
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                rows={3}
              />
            </div>

            {isBooklet && (
              <div className="p-4 bg-zinc-800 rounded-lg space-y-4">
                <div>
                  <Label>Working Booklet PDF (without answers)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setWorkingFile(e.target.files?.[0] || null)
                    }
                  />
                  {workingFile && (
                    <p className="text-green-400 text-sm mt-1">
                      ✓ {workingFile.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Answer Booklet PDF (with answers)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setAnswerFile(e.target.files?.[0] || null)}
                  />
                  {answerFile && (
                    <p className="text-green-400 text-sm mt-1">
                      ✓ {answerFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(formData.category === "clapping" ||
              formData.category === "test") && (
              <div>
                <Label>Upload PDF</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setWorkingFile(e.target.files?.[0] || null)}
                />
                {workingFile && (
                  <p className="text-green-400 text-sm mt-1">
                    ✓ {workingFile.name}
                  </p>
                )}
              </div>
            )}

            {isSongs && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>YouTube Song Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addYoutubeField}
                  >
                    + Add Song
                  </Button>
                </div>
                {youtubeLinks.map((link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
