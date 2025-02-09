import BaseTool from '../../BaseTool';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ZBarTool extends BaseTool {
    static toolName = 'ZBarTool';
    static version = '0.1.0';
    static description = 'Tool to read barcodes from images using ZBar';

    async runTool(imagePath: string): Promise<any> {
        try {
            const { stdout } = await execAsync(`zbarimg --quiet --raw ${imagePath}`);
            const barcodes = stdout.trim().split('\n').filter(code => code.length > 0);

            return {
                barcodes: barcodes.map(code => ({
                    data: code,
                    type: this.detectBarcodeType(code)
                })),
                count: barcodes.length
            };
        } catch (error) {
            return {
                barcodes: [],
                count: 0
            };
        }
    }

    canRunTool(imagePath: string): boolean {
        // ZBar can process most common image formats
        return /\.(jpg|jpeg|png|bmp|gif)$/i.test(imagePath);
    }

    private detectBarcodeType(code: string): string {
        // Format detection based on common patterns and ZBar supported formats
        if (/^[0-9]{13}$/.test(code)) return 'EAN-13';
        if (/^[0-9]{8}$/.test(code)) return 'EAN-8';
        if (/^[0-9]{12}$/.test(code)) return 'UPC-A';
        if (/^[0-9]{11}$/.test(code)) return 'UPC-E';
        if (/^[0-9]{2}$/.test(code)) return 'EAN-2';
        if (/^[0-9]{5}$/.test(code)) return 'EAN-5';
        if (/^[A-D0-9\+\-\.\$\/:\*]+$/.test(code)) return 'CODABAR';
        if (/^[0-9]+$/.test(code)) {
            if (code.length === 14) return 'I25'; // Interleaved 2 of 5
            return 'CODE-128';
        }
        if (/^[A-Z0-9\-\.\$\/\+\%\*\s]+$/.test(code)) return 'CODE-39';
        if (/^[0-9A-Z\-\.\$\/\+\%]+$/.test(code)) return 'CODE-93';
        if (/^\[\)>[0-9]+\]$/.test(code)) return 'DATABAR';
        if (/^\[\)>[^\]]+\]$/.test(code)) return 'DATABAR-EXP';
        if (/^[A-Z0-9]+$/.test(code)) {
            if (code.length > 100) return 'SQCODE';
            return 'QR';
        }
        return 'UNKNOWN';
    }
}

export default ZBarTool;