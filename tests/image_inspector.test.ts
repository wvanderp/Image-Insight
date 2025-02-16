import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import tools from '../src/tools';
import { exec } from 'child_process';
import Ajv from 'ajv';

const toolsPath = path.join(__dirname, '../src/tools');
const testFilesPath = path.join(__dirname, 'files');

const ajv = new Ajv();

function loadSchema(toolName: string) {
    const schemaPath = path.join(toolsPath, toolName, 'schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    return schema;
}

function removeProps<T>(obj: T, keys: string[]): T {
    if (typeof obj !== 'object' || obj === null) return obj;

    const newObj: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (!keys.includes(key)) {
            if (typeof obj[key] === 'object') {
                newObj[key] = removeProps(obj[key], keys);
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
            const toolTestPath = path.join(testFilesPath, toolClass.name);
            const schema = loadSchema(toolClass.name);
            const validate = ajv.compile(schema);

            const testImages = fs.readdirSync(toolTestPath).filter(file => !file.endsWith('.json') && !file.endsWith('.txt'));

            console.log(testImages)

            testImages.forEach(image => {
                const imagePath = path.join(toolTestPath, image);
                const expectedOutputPath = imagePath.split('.').slice(0, -1).join('.') + '.json';

                // it(`should validate the output against the schema for ${image}`, { timeout: 30000 }, async () => {
                //     const expectedOutput = JSON.parse(fs.readFileSync(expectedOutputPath, 'utf-8'));
                //     const valid = validate(expectedOutput);

                //     if (!valid) {
                //         console.error(validate.errors);
                //     }

                //     expect(valid).toBe(true);
                // });

                it(`should match the expected output for ${image}`, { timeout: 60000 }, async () => {
                    await new Promise<void>((resolve, reject) => {
                        const dockerCommand = `docker run --rm -v ${path.dirname(imagePath)}:/images/ image-insight ${image}`;

                        exec(dockerCommand, (error: any, stdout: any, stderr: any) => {
                            if (error) {
                                console.log(error);
                                reject(new Error(`Docker run failed: ${error.message}`));
                                return;
                            }
                            if (stderr) {
                                console.log(stderr);
                                reject(new Error(`Docker run stderr: ${stderr}`));
                                return;
                            }

                            const output = JSON.parse(stdout);
                            const expectedOutput = JSON.parse(fs.readFileSync(expectedOutputPath, 'utf-8'));


                            // Remove FileInodeChangeDate from both objects before comparison
                            const cleanOutput = removeProps(output, ['FileInodeChangeDate', 'FileAccessDate', 'FilePermissions', 'FileModifyDate']);
                            const cleanExpectedOutput = removeProps(expectedOutput, ['FileInodeChangeDate', 'FileAccessDate', 'FilePermissions', 'FileModifyDate']);

                            // fs.writeFileSync(expectedOutputPath, JSON.stringify(output, null, 2));

                            expect(cleanOutput).toEqual(cleanExpectedOutput);
                            resolve();
                        });
                    });
                });
            });
        });
    });
});
