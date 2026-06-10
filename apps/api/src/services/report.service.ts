import PDFDocument from "pdfkit";
import type { User, CarbonRecord } from "@prisma/client";

export function buildCarbonReport(user: User, records: CarbonRecord[], recommendation: string) {
  const doc = new PDFDocument({ margin: 48 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk as Buffer));

  doc.fontSize(24).fillColor("#0f766e").text("EcoTrack AI Sustainability Report");
  doc.moveDown();
  doc.fontSize(12).fillColor("#0f172a").text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();

  const latest = records[0];
  if (latest) {
    doc.fontSize(18).fillColor("#111827").text("Latest Carbon Snapshot");
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Monthly Emissions: ${latest.monthlyEmissionKg} kg CO2e`);
    doc.text(`Annual Emissions: ${latest.annualEmissionKg} kg CO2e`);
    doc.text(`Carbon Score: ${latest.carbonScore}/100`);
    doc.text(`Transportation: ${latest.transportationKg} kg`);
    doc.text(`Energy: ${latest.energyKg} kg`);
    doc.text(`Food: ${latest.foodKg} kg`);
    doc.text(`Lifestyle: ${latest.lifestyleKg} kg`);
  }

  doc.moveDown();
  doc.fontSize(18).text("AI Recommendations");
  doc.moveDown(0.5);
  doc.fontSize(11).text(recommendation, { align: "left" });

  doc.moveDown();
  doc.fontSize(18).text("Recent History");
  records.slice(0, 6).forEach((record) => {
    doc.fontSize(11).text(
      `${record.monthLabel}: ${record.monthlyEmissionKg} kg CO2e | Score ${record.carbonScore}`
    );
  });

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
