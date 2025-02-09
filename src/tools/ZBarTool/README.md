# ZBarTool

## Description
ZBarTool is a barcode and QR code detection and reading tool that uses the ZBar library. It can detect multiple types of barcodes including:

### Linear Barcodes
- EAN-13 (ISBN)
- EAN-8
- EAN-2 (add-on)
- EAN-5 (add-on)
- UPC-A
- UPC-E
- CODE-128
- CODE-39
- CODE-93
- CODABAR
- I25 (Interleaved 2 of 5)
- DATABAR
- DATABAR-EXP (Expanded)

### 2D Barcodes
- QR Code (including binary and inverted)
- SQ Code

## Dependencies
- ZBar library (zbar-tools package on Linux, or download from http://zbar.sourceforge.net/ for Windows)
- Node.js / TypeScript for the wrapper

## Installation
1. Install ZBar:
   - On Ubuntu/Debian: `sudo apt-get install zbar-tools`
   - On Windows: Download and install from http://zbar.sourceforge.net/
   - Ensure `zbarimg` is available in your system PATH

## Usage
The tool automatically detects and reads barcodes from images. It supports common image formats (JPG, PNG, BMP, GIF).

Example outputs:
```json
{
    "barcodes": [
        {
            "data": "9780201379624",
            "type": "EAN-13"
        }
    ],
    "count": 1
}
```

```json
{
    "barcodes": [
        {
            "data": "CODE-39 EXAMPLE",
            "type": "CODE-39"
        },
        {
            "data": "1234567890128",
            "type": "EAN-13"
        }
    ],
    "count": 2
}