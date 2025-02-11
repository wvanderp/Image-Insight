import BaseTool from '../../BaseTool';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';

const execAsync = promisify(exec);

/*
Example output from ZBar:
<barcodes xmlns='http://zbar.sourceforge.net/2008/barcode'>
<source href='QR_code_for_mobile_English_Wikipedia.svg.png'>
<index num='0'>
<symbol type='QR-Code' quality='1' orientation='UP'><data><![CDATA[http://en.m.wikipedia.org]]></data></symbol>
</index>
</source>
</barcodes>
*/

interface ZBarXML {
    barcodes: {
        "$": {
            xmlns: string;
        };
        source: {
            "$": {
                href: string;
            };
            index: {
                "$": {
                    num: string;
                };
                symbol: {
                    "$": {
                        type: string;
                        quality: string;
                        orientation: string;
                    };
                    polygon: {
                        "$": {
                            points: string;
                        };
                    }[];
                    data: string[];
                }[];
            }[];
        }[];
    }
}

interface Barcode {
    type: string;
    quality: string;
    orientation: string;
    data: string[];
    polygon: {
        points: string;
    }[];
}

class ZBarTool extends BaseTool {
    static toolName = 'ZBarTool';
    static version = '0.1.0';
    static description = 'Tool to read barcodes from images using ZBar';

    private async parseZBarXML(xml: string): Promise<ZBarXML> {
        return await parseStringPromise(xml) as ZBarXML;
    }

    async runTool(imagePath: string): Promise<any> {
        try {
            const { stdout } = await execAsync(`zbarimg --xml ${imagePath}`);
            const result: ZBarXML = await this.parseZBarXML(stdout);
            const barcodes: Barcode[] = result.barcodes.source[0].index.map((index: any) => {
                const symbol = index.symbol[0];
                return {
                    type: symbol.$.type,
                    quality: symbol.$.quality,
                    orientation: symbol.$.orientation,
                    data: symbol.data,
                    polygon: symbol.polygon.map((polygon: any) => {
                        return {
                            points: polygon.$.points
                        };
                    })
                };
            });

            return {
                stdout: stdout,
                barcodes: barcodes,
                count: barcodes.length
            };
        } catch (error) {
            return {
                error: (error instanceof Error) ? error.message : 'Unknown error',
                barcodes: [],
                count: 0
            };
        }
    }

    canRunTool(imagePath: string): boolean {
        // TODO: Check the official ZBar documentation for a list of supported image formats.
        // ZBar can process most common image formats
        return /\.(jpg|jpeg|png|bmp|gif)$/i.test(imagePath);
    }
}

export default ZBarTool;
