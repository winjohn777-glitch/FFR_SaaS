// Type declarations for external modules without TypeScript definitions

declare module 'jspdf' {
  const jsPDF: any;
  export default jsPDF;
  export { jsPDF };
}

declare module 'html2canvas' {
  const html2canvas: any;
  export default html2canvas;
}