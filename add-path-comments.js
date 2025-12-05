import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function addPathComment(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
        const pathComment = `// ${relativePath.replace(/\\/g, '/')}\n`;

        // Check if comment already exists
        if (content.startsWith('// ')) {
            const firstLineEnd = content.indexOf('\n');
            const firstLine = content.substring(0, firstLineEnd);

            // If first line is already a path comment, replace it
            if (firstLine.includes('/') || firstLine.includes('\\')) {
                const newContent = pathComment + content.substring(firstLineEnd + 1);
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ Updated: ${relativePath}`);
                return;
            }
        }

        // Add comment at the beginning
        const newContent = pathComment + content;
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Added: ${relativePath}`);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function processDirectory(directory) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.js')) {
            addPathComment(fullPath);
        }
    }
}

console.log('🚀 Adding path comments to all .js files in src/...\n');
processDirectory(srcDir);
console.log('\n✨ Done!');
