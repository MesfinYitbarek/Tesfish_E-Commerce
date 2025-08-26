// services/pdfGenerator.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Generate a PDF file
 * @param {Object} options
 * @param {String} options.fileName - Output filename
 * @param {Object} options.data - Dynamic data for PDF content
 * @returns {String} path to the generated PDF
 */
export const generatePDF = async ({ fileName, data }) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfDir = path.resolve("uploads/pdfs"); // store PDFs in /uploads/pdfs
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      const filePath = path.join(pdfDir, fileName);
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ---------- HEADER ----------
      doc
        .fontSize(20)
        .text("🏠 Property Registration", { align: "center" })
        .moveDown(2);

      // ---------- MAIN CONTENT ----------
      doc.fontSize(14).text(`Owner: ${data.ownerName}`, { align: "left" });
      doc.text(`Property ID: ${data.propertyId}`);
      doc.text(`Status: ${data.status}`);
      doc.text(`Registered At: ${new Date().toLocaleString()}`);

      doc.moveDown(2).fontSize(12).text("Details:", { underline: true });
      doc.moveDown(0.5);

      if (data.details) {
        Object.entries(data.details).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`);
        });
      }

      // ---------- FOOTER ----------
      doc.moveDown(3).fontSize(10).text("This is a system-generated document.", {
        align: "center",
      });

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });

      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
