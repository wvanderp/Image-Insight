import { execSync } from 'child_process';
import { PathLike } from 'fs';
import BaseTool from '../../BaseTool';

interface ExifData {
    FileName: string;
    FileSize: number;
    Make: string;
    Model: string;
    // Add other fields as necessary
}

class ExifTool extends BaseTool {
    static version: string = '1.0.0';
    static toolName: string = 'ExifTool';
    static description: string = 'Tool to extract EXIF data from images using ExifTool';

    constructor() {
        super();
    }

    runTool(imagePath: PathLike): ExifData | null {
        try {
            const result = execSync(`exiftool -json ${imagePath}`, { encoding: 'utf-8' });
            const exifData = JSON.parse(result);
            if (exifData && exifData.length > 0) {
                return exifData[0] as ExifData;
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error occurred while extracting EXIF data: ${error}`);
            return null;
        }
    }

    canRunTool(imagePath: PathLike): boolean {
        try {
            execSync('exiftool -ver', { encoding: 'utf-8' });
            return true;
        } catch (error) {
            return false;
        }
    }
}

export { ExifTool, ExifData };