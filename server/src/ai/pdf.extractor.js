import ApiError from "../utils/ApiError.js";

/**
 * PDF Text & Metadata Extraction Utility
 * Extracts raw text, word count, estimated page count, and structural metadata from PDF buffers.
 */
class PDFExtractor {
  /**
   * Extract plain text and metadata from a PDF Buffer
   * @param {Buffer} pdfBuffer 
   * @returns {Promise<Object>} { text, pageCount, wordCount, metadata }
   */
  async extractText(pdfBuffer) {
    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      throw new ApiError(400, "Invalid PDF buffer provided for text extraction.");
    }

    try {
      // Dynamic import of pdf-parse with fallback
      let pdfParseModule;
      try {
        pdfParseModule = (await import("pdf-parse")).default;
      } catch (err) {
        pdfParseModule = null;
      }

      if (pdfParseModule) {
        const parsed = await pdfParseModule(pdfBuffer);
        const text = parsed.text ? parsed.text.trim() : "";
        const words = text ? text.split(/\s+/).filter(Boolean) : [];

        return {
          text,
          pageCount: parsed.numpages || 1,
          wordCount: words.length,
          metadata: parsed.info || {},
        };
      }

      // Fallback plain text extraction if pdf-parse binary is not present
      const rawText = pdfBuffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const words = rawText.split(/\s+/).filter(Boolean);
      // Rough page count estimation (approx 500 words per page)
      const estimatedPages = Math.max(1, Math.ceil(words.length / 500));

      return {
        text: rawText,
        pageCount: estimatedPages,
        wordCount: words.length,
        metadata: { info: "Extracted via fallback stream buffer" },
      };
    } catch (error) {
      console.error("[PDF Extraction Error]", error);
      throw new ApiError(400, `Failed to parse PDF document content: ${error.message}`);
    }
  }

  /**
   * Clean and normalize raw extracted resume text
   * @param {string} rawText 
   */
  cleanExtractedText(rawText = "") {
    return rawText
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}

export default new PDFExtractor();
