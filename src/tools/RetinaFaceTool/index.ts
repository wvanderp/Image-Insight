import { exec } from 'child_process';
import BaseTool from '../../BaseTool';

class RetinaFaceTool extends BaseTool {
    static toolName = 'RetinaFaceTool';
    static version = '1.0.0';
    static description = 'Tool to detect faces using RetinaFace model';

    async runTool(imagePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(`python3 src/tools/RetinaFaceTool/retina_face_tool.py ${imagePath}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`Stderr: ${stderr}`);
                    return;
                }
                resolve(JSON.parse(stdout));
            });
        });
    }

    canRunTool(imagePath: string): boolean {
        return true; // Assume it can run on any image for now
    }
}

export default RetinaFaceTool;
