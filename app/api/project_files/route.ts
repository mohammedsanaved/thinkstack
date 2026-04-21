// import { NextRequest, NextResponse } from "next/server";
// import { parseFile } from "@/app/lib/file-parser";
// import { embedBatch } from "@/app/lib/embeddings/embedding";
// import { addMemory, deleteMemory } from "@/app/lib/chroma/client";
// import { addProjectFile, deleteProjectFile } from "@/app/lib/firebase/project-file-service";
// import { chunkText } from "@/app/lib/utils/chunkText";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as File;
//     const projectId = formData.get('projectId') as string;

//     if (!file || !projectId) {
//       return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 });
//     }

//     // 1. Parse file
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const text = await parseFile(buffer, file.type);

//     if (!text || text.trim().length === 0) {
//       return NextResponse.json({ error: "File is empty or could not be parsed" }, { status: 400 });
//     }

//     // 2. Save metadata to Firestore
//     const fileMetadata = await addProjectFile({
//       projectId,
//       name: file.name,
//       type: file.type,
//       size: file.size,
//       createdAt: Date.now(),
//     });

//     // 3. Chunk text and index into ChromaDB
//     // Simple chunking for now: split by paragraphs or max length
//     // const chunks = text.split('\n\n').filter(c => c.trim().length > 0);
//     // // Further chunk if needed (e.g. max 1000 chars)
//     // const refinedChunks: string[] = [];
//     // for (const chunk of chunks) {
//     //   if (chunk.length > 1500) {
//     //     const subChunks = chunk.match(/.{1,1500}/g) || [];
//     //     refinedChunks.push(...subChunks);
//     //   } else {
//     //     refinedChunks.push(chunk);
//     //   }
//     // }

//     const refinedChunks = chunkText(text, 1000, 200);
//     console.log("✅ Step 1 - Parsed text length:", refinedChunks.length);
//     const embeddings = await embedBatch(refinedChunks);
//     console.log("✅ Step 2 - Embeddings created:", embeddings.length);

//     const metadatas = refinedChunks.map(() => ({
//       projectId,
//       fileId: fileMetadata.id,
//       fileName: file.name,
//       type: "file",
//       createdAt: Date.now(),
//     }));

//     await addMemory({
//       projectId,
//       texts: refinedChunks,
//       embeddings,
//       metadatas,
//     });

//     return NextResponse.json(fileMetadata);
//   } catch (err) {
//   console.error("Project File Upload Error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
//   return NextResponse.json({ error: "Failed to process project file", detail: String(err) }, { status: 500 });
// }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const fileId = searchParams.get('fileId');
//     const projectId = searchParams.get('projectId');

//     if (!fileId || !projectId) {
//       return NextResponse.json({ error: "Missing fileId or projectId" }, { status: 400 });
//     }

//     // 1. Delete from Firestore
//     await deleteProjectFile(fileId);

//     // 2. Delete from ChromaDB
//     await deleteMemory(projectId, { fileId });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Project File Delete Error:", err);
//     return NextResponse.json({ error: "Failed to delete project file" }, { status: 500 });
//   }
// }
// // const text = await parseFile(buffer, file.type);
// // console.log("✅ Step 1 - Parsed text length:", text.length);

// // const fileMetadata = await addProjectFile({...});
// // console.log("✅ Step 2 - Firestore saved:", fileMetadata.id);

// // const refinedChunks = chunkText(text, 1000, 200);
// // console.log("✅ Step 3 - Chunks created:", refinedChunks.length);

// // const embeddings = await embedBatch(refinedChunks);
// // console.log("✅ Step 4 - Embeddings created:", embeddings.length);

// // await addMemory({...});
// // console.log("✅ Step 5 - Stored in ChromaDB");


import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/app/lib/file-parser";
import { embedBatch } from "@/app/lib/embeddings/embedding";
import { addMemory, deleteMemory } from "@/app/lib/chroma/client";
import { addProjectFile, deleteProjectFile } from "@/app/lib/firebase/project-file-service";
import { chunkText } from "@/app/lib/utils/chunkText";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 });
    }

    // Step 1 - Parse file
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("📄 File type:", file.type, "| File name:", file.name, "| Size:", file.size);
    
    const text = await parseFile(buffer, file.type);
    console.log("✅ Step 1 - Parsed text length:", text.length);
    console.log("✅ Step 1 - Text preview:", text.slice(0, 300));

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "File is empty or could not be parsed" }, { status: 400 });
    }

    // Step 2 - Save metadata to Firestore
    const fileMetadata = await addProjectFile({
      projectId,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
    });
    console.log("✅ Step 2 - Firestore saved:", fileMetadata.id);

    // Step 3 - Chunk text
    const refinedChunks = chunkText(text, 1000, 200);
    console.log("✅ Step 3 - Chunks created:", refinedChunks.length);
    console.log("✅ Step 3 - First chunk preview:", refinedChunks[0]?.slice(0, 200));

    // Step 4 - Embed chunks
    const embeddings = await embedBatch(refinedChunks);
    console.log("✅ Step 4 - Embeddings created:", embeddings.length);

    // Step 5 - Store in ChromaDB
    const metadatas = refinedChunks.map(() => ({
      projectId,
      fileId: fileMetadata.id,
      fileName: file.name,
      type: "file",
      createdAt: Date.now(),
    }));

    await addMemory({
      projectId,
      texts: refinedChunks,
      embeddings,
      metadatas,
    });
    console.log("✅ Step 5 - Stored in ChromaDB successfully");

    return NextResponse.json(fileMetadata);
  } catch (err) {
    console.error("🔥 Project File Upload Error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ error: "Failed to process project file", detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    const projectId = searchParams.get('projectId');

    if (!fileId || !projectId) {
      return NextResponse.json({ error: "Missing fileId or projectId" }, { status: 400 });
    }

    await deleteProjectFile(fileId);
    await deleteMemory(projectId, { fileId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Project File Delete Error:", err);
    return NextResponse.json({ error: "Failed to delete project file" }, { status: 500 });
  }
}