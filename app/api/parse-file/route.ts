import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/app/lib/file-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFile(buffer, file.type);

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Parse Error:", err);
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 });
  }
}
