

export async function exportResumeToPDF(element: HTMLElement, fileName = "resume.pdf") {
  if (typeof window === "undefined") return;
  
  // A small delay to ensure rendering is complete
  await new Promise((r) => setTimeout(r, 200));
  
  // Use robust native browser print engine instead of html2canvas parsing.
  // Proper @media print CSS rules exist to hide the editor controls and only show the resume.
  window.print();
}
