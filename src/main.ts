import { ExifTool } from './tools/ExifTool/exif_tool';
import { PathLike, copyFileSync } from 'fs';
import { join } from 'path';

function main(imagePath: PathLike) {
    const tools = [new ExifTool()];
    const results: any = {};
    const tempImagePath = join(__dirname, 'temp_image.jpg');

    // Copy the image to a temporary location
    copyFileSync(imagePath, tempImagePath);

    tools.forEach(tool => {
        if (tool.canRunTool(tempImagePath)) {
            results[tool.constructor.name] = tool.runTool(tempImagePath);
        } else {
            console.log(`${tool.constructor.name} cannot be run on this image.`);
        }
    });

    console.log(`Results: ${JSON.stringify(results, null, 4)}`);
}

const imagePath = process.argv[2];
if (imagePath) {
    main(imagePath);
} else {
    console.log('Please provide the path to an image as the first argument.');
}