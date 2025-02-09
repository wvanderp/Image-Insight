import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import tools from '../src/tools';
import { exec } from 'child_process';
import Ajv from 'ajv';

const toolsPath = path.join(__dirname, '../src/tools');

const ajv = new Ajv();

function loadSchema(toolName: string) {
    const schemaPath = path.join(toolsPath, toolName, 'schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    return schema;
}

function removeFileInodeChangeDate(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    const newObj: Record<string, any> = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (key !== 'FileInodeChangeDate') {
            if (typeof obj[key] === 'object') {
                newObj[key] = removeFileInodeChangeDate(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}

describe('Image Inspector', () => {
    tools.forEach(toolClass => {
        describe(toolClass.name, () => {
            const toolTestPath = path.join(toolsPath, toolClass.name, 'tests');
            const schema = loadSchema(toolClass.name);
            const validate = ajv.compile(schema);

            const testImages = fs.readdirSync(toolTestPath).filter(file => !file.endsWith('.json') && !file.endsWith('.txt'));

            console.log(testImages)

            testImages.forEach(image => {
                const imagePath = path.join(toolTestPath, image);
                const expectedOutputPath = imagePath.split('.').slice(0, -1).join('.') + '.json';

                it(`should validate the output against the schema for ${image}`, { timeout: 30000 }, async () => {
                    const expectedOutput = JSON.parse(fs.readFileSync(expectedOutputPath, 'utf-8'));
                    const valid = validate(expectedOutput);

                    if (!valid) {
                        console.error(validate.errors);
                    }

                    expect(valid).toBe(true);
                });

                it(`should match the expected output for ${image}`, { timeout: 30000 }, async () => {
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

                            fs.writeFileSync(expectedOutputPath, JSON.stringify(expectedOutput, null, 2));

                            // Remove FileInodeChangeDate from both objects before comparison
                            const cleanOutput = removeFileInodeChangeDate(output);
                            const cleanExpectedOutput = removeFileInodeChangeDate(expectedOutput);

                            expect(cleanOutput).toEqual(cleanExpectedOutput);
                            resolve();
                        });
                    });
                });
            });
        });
    });
});
