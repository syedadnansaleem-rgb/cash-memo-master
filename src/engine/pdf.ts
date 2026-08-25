import { jsPDF } from "jspdf";
import type { Memo, MemoBatch } from "./types";

export const BILLED_TO_LINES = ["Nxtwave Disruptive", "Technologies Pvt. Ltd."] as const;

const INR = (n: number) => n.toLocaleString("en-IN");

/**
 * Renders a single Cash Memo reproducing the approved handwritten format.
 */
export function buildMemoPdf(batch: MemoBatch, memo: Memo): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const L = 20; // left margin
  const R = 190; // right edge

  // ---------- Heading ----------
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  const title = "CASH MEMO";
  const titleWidth = doc.getTextWidth(title);
  const titleX = (210 - titleWidth) / 2;
  doc.text(title, titleX, 30);
  doc.setLineWidth(0.5);
  doc.line(titleX, 31.5, titleX + titleWidth, 31.5);

  // ---------- Details (left) + Billed To (top right) ----------
  doc.setFontSize(12);
  const rows: [string, string][] = [
    ["Date :", batch.details.dateOrMonth],
    ["Name :", batch.details.employeeName],
    ["Phone No :", batch.details.phoneNo ?? ""],
    ["Address :", batch.details.address ?? ""],
  ];
  let y = 45;
  for (const [label, value] of rows) {
    doc.setFont("times", "bold");
    doc.text(label, L, y);
    doc.setFont("times", "normal");
    doc.text(value, L + doc.getTextWidth(label) + 2, y);
    y += 8;
  }

  // Billed To - FIXED value, top right corner
  doc.setFont("times", "bold");
  doc.text("Billed To:", 118, 45);
  doc.setFont("times", "normal");
  doc.text(BILLED_TO_LINES[0], 118 + doc.getTextWidth("Billed To:") + 2, 45);
  doc.text(BILLED_TO_LINES[1], 118 + doc.getTextWidth("Billed To:") + 2, 52);

  // ---------- Expense table ----------
  const tableTop = 85;
  const colX = [L, 35, 120, 145, 170, R]; // S No | Description | Price | Quantity | Amount
  const headerH = 9;
  const rowH = 9;
  const descLines = doc.splitTextToSize(
    `NIAT offline marketing event at ${memo.collegeName}`,
    colX[2] - colX[1] - 6,
  ) as string[];
  const descH = descLines.length * 6 + 4;
  const bodyH = descH + memo.categories.length * rowH + 4;

  doc.setLineWidth(0.4);
  // outer box
  doc.rect(L, tableTop, R - L, headerH + bodyH);
  // header separator
  doc.line(L, tableTop + headerH, R, tableTop + headerH);
  // vertical separators
  for (let i = 1; i < colX.length - 1; i++) {
    doc.line(colX[i], tableTop, colX[i], tableTop + headerH + bodyH);
  }

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  const headerBaseline = tableTop + 6.2;
  doc.text("S No.", L + 2, headerBaseline);
  doc.text("Description", (colX[1] + colX[2]) / 2, headerBaseline, { align: "center" });
  doc.text("Price", (colX[2] + colX[3]) / 2, headerBaseline, { align: "center" });
  doc.text("Quantity", (colX[3] + colX[4]) / 2, headerBaseline, { align: "center" });
  doc.text("Amount", (colX[4] + colX[5]) / 2, headerBaseline, { align: "center" });

  // Body
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(String(memo.serial), L + 5, tableTop + headerH + 7);

  let ty = tableTop + headerH + 7;
  for (const line of descLines) {
    doc.text(line, colX[1] + 3, ty);
    ty += 6;
  }
  ty += 3;

  for (const cat of memo.categories) {
    doc.text(`${cat.name}`, colX[1] + 10, ty);
    doc.text("-", colX[2] - 6, ty);
    doc.text(INR(cat.amount), colX[3] - 3, ty, { align: "right" });
    doc.text(INR(cat.amount), colX[5] - 3, ty, { align: "right" });
    ty += rowH;
  }

  // ---------- Given Cash + Total / Amount in Words ----------
  const boxTop = tableTop + headerH + bodyH + 8;
  const boxLeft = 90;
  const labelRight = 130;
  const totalRowH = 10;
  const wordLines = doc.splitTextToSize(memo.amountInWords, R - labelRight - 6) as string[];
  const wordsRowH = Math.max(12, wordLines.length * 6 + 5);

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.text("Given", L, boxTop + 8);
  doc.text("Cash.", L, boxTop + 16);

  doc.setLineWidth(0.4);
  doc.rect(boxLeft, boxTop, R - boxLeft, totalRowH + wordsRowH);
  doc.line(boxLeft, boxTop + totalRowH, R, boxTop + totalRowH);
  doc.line(labelRight, boxTop, labelRight, boxTop + totalRowH + wordsRowH);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("Total", boxLeft + 2, boxTop + 6.8);
  doc.text("Amount in Words", boxLeft + 2, boxTop + totalRowH + 6.8);

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.text(`${INR(memo.amount)} /-`, labelRight + 6, boxTop + 7);
  doc.setFontSize(11);
  let wy = boxTop + totalRowH + 6.5;
  for (const line of wordLines) {
    doc.text(line, labelRight + 4, wy);
    wy += 6;
  }

  // ---------- Signature ----------
  const sigY = boxTop + totalRowH + wordsRowH + 32;
  doc.setLineWidth(0.4);
  doc.line(135, sigY, R, sigY);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("Signature", (135 + R) / 2, sigY + 6, { align: "center" });

  return doc;
}

function sanitize(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "College";
}

export function memoFileName(memo: Memo): string {
  return `Cash_Memo_${String(memo.serial).padStart(3, "0")}_${sanitize(memo.collegeName)}.pdf`;
}

export function memoPdfBlob(batch: MemoBatch, memo: Memo): Blob {
  return buildMemoPdf(batch, memo).output("blob");
}

export function downloadMemoPdf(batch: MemoBatch, memo: Memo): void {
  buildMemoPdf(batch, memo).save(memoFileName(memo));
}

export async function downloadAllMemosZip(batch: MemoBatch): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const memo of batch.memos) {
    zip.file(memoFileName(memo), memoPdfBlob(batch, memo));
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cash_Memos_${sanitize(batch.details.employeeName)}_${sanitize(batch.details.dateOrMonth)}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
