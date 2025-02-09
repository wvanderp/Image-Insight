import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import tools from '../src/tools';
import { exec } from 'child_process';

const toolsPath = path.join(__dirname, '../src/tools');

describe('Image Inspector', () => {
    tools.forEach(toolClass => {
        describe(toolClass.name, () => {
            const toolTestPath = path.join(toolsPath, toolClass.name, 'tests');

            const testImages = fs.readdirSync(toolTestPath).filter(file => file.endsWith('.jpg'));

            testImages.forEach(image => {
                const imagePath = path.join(toolTestPath, image);
                const expectedOutputPath = imagePath.replace('.jpg', '.json');

                it(`should match the expected output for ${image}`, async () => {
                    console.log(`docker run --rm -v ${path.dirname(imagePath)}:/images/ image-insight ${image}`);

                    await new Promise<void>((resolve, reject) => {
                        exec(`docker run --rm -v ${path.dirname(imagePath)}:/images/ image-insight ${image}`, (error: any, stdout: any, stderr: any) => {
                            if (error) {
                                reject(new Error(`Docker run failed: ${error.message}`));
                                return;
                            }
                            if (stderr) {
                                reject(new Error(`Docker run stderr: ${stderr}`));
                                return;
                            }

                            const output = JSON.parse(stdout);
                            const expectedOutput = JSON.parse(fs.readFileSync(expectedOutputPath, 'utf-8'));
                            expect(output).toEqual(expectedOutput);
                            resolve();
                        });
                    });
                });
            });
        });
    });
});
