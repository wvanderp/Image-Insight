import { execSync } from 'child_process';
import { ExifTool } from './tools/ExifTool/exif_tool';
import fs from 'fs';
import path from 'path';
import tools from './tools';

function main(imagePath: string) {
    const results: any = {};
    const tempImagePath = path.join(__dirname, 'temp_image.jpg');

    // Copy the image to a temporary location without changing anything about the file.
    const stat = fs.statSync(path.join("/images", imagePath));
    execSync(`cp -p ${path.join("/images", imagePath)} ${tempImagePath}`);
    fs.utimesSync(tempImagePath, stat.atime, stat.mtime);

    tools.forEach(toolClass => {
        const tool = new toolClass();

        if (tool.canRunTool(tempImagePath)) {
            results[tool.constructor.name] = tool.runTool(tempImagePath);
        } else {
            console.error(`${tool.constructor.name} cannot be run on this image.`);
        }
    });

    console.log(JSON.stringify(results, null, 4));
}

const imagePath = process.argv[2];
if (imagePath) {
    main(imagePath);
} else {
    console.error('Please provide the path to an image as the first argument.');
}