# Image Analysis Tool

A Docker-based tool that performs comprehensive analysis of images, extracting metadata and content information.

## Overview

This tool analyzes images by examining both:

- File metadata (EXIF data, file format, dimensions, etc.)
- Image contents (objects, faces, text, colors, etc.)

## Features

- Extract EXIF metadata from images
- Analyze image dimensions and format
- Detect objects and scenes
- Perform facial detection/recognition
- Extract text from images (OCR)
- Analyze color composition
- Generate detailed reports

## Usage

### Using Docker

```bash
docker pull image-insight
docker run -v /path/to/images:/images image-insight photo.jpg
```

### Output

The tool generates a detailed report containing:

- Technical metadata
- Content analysis results
- Detected objects/faces
- Extracted text
- Color analysis

## Requirements

- Docker
- Input images in common formats (JPG, PNG, TIFF, etc.)

## License

```plaintext
MIT License

<year> <copyright owner>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
