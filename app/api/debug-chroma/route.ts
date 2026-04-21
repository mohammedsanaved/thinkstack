import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/lib/chroma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) return NextResponse.json({ error: "Missing projectId" });

  const collection = await getCollection(projectId);
  const results = await collection.get({
    limit: 20,
    where: { type: "file" },
  });

  return NextResponse.json({
    total: results.ids.length,
    chunks: results.documents,
    metadatas: results.metadatas,
  });
}