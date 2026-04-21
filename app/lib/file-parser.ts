import { PDFParse } from 'pdf-parse';

export async function parseFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } catch (err) {
      console.error("PDF Parse Error:", err); // Log the REAL error here
      throw new Error("Failed to parse PDF document");
    } finally {
      await parser.destroy(); // Always clean up
    }
  }

  if (mimeType.startsWith('text/') || mimeType === 'application/json') {
    return buffer.toString('utf-8');
  }

  return buffer.toString('utf-8');
}