// utils/read_pdf.js
const fs = require('fs');
const pdf = require('pdf-extraction');

const files = [
    "C:\\Users\\aakas\\OneDrive\\Desktop\\prototype\\Minor Project.pdf",
    "C:\\Users\\aakas\\OneDrive\\Desktop\\prototype\\SIH2025-Code_Innovation.pdf"
];

async function readPdf(path, outputPath) {
    try {
        const dataBuffer = fs.readFileSync(path);
        const data = await pdf(dataBuffer);
        fs.writeFileSync(outputPath, JSON.stringify({ text: data.text }, null, 2), 'utf8');
        console.log(`Saved ${outputPath}`);
    } catch (error) {
        console.error(`Error reading ${path}:`, error.message);
    }
}

async function main() {
    await readPdf("C:\\Users\\aakas\\OneDrive\\Desktop\\prototype\\Minor Project.pdf", "minor_project.json");
    await readPdf("C:\\Users\\aakas\\OneDrive\\Desktop\\prototype\\SIH2025-Code_Innovation.pdf", "sih_innovation.json");
}

main();
