When creating a new tool, you must follow the rules below. If you do not follow these rules, your tool will be removed from the repository.

This file includes practical rules for the tools. For the thoughts on what types of tools are expected and where these rules come from, see the [Manifesto](Manifesto.md).

## Language Choice

Please use whatever language is available in the Docker image. If you need a new language, add it to the Docker.

You must provide an interface to JavaScript (preferably typescript) because the collector is written in JavaScript. This means your tool should be callable from JavaScript through a direct function call.

### Example

If you are writing a tool in Python, ensure it can be executed from JavaScript using `child_process` in Node.js:

```javascript
const { exec } = require('child_process');
exec('python your_tool.py path/to/image.jpg', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
```

## Input

You get the path to the image as your input. You are free to do whatever you want with the image because it will be a clone of the image.

### Example

Your tool should accept the image path as a command-line argument or function parameter:

```python
import sys
from PIL import Image
import json

def process_image(image_path):
    image = Image.open(image_path)
    # ...process the image...
    result = {
        "width": image.width,
        "height": image.height,
        "format": image.format
    }
    return result

if __name__ == "__main__":
    image_path = sys.argv[1]
    result = process_image(image_path)
    print(json.dumps(result))
```

## Output

You must output a JSON object with any format you want.

### Example

Your tool should output JSON to stdout:

```python
import json

result = {
    "width": 1024,
    "height": 768,
    "format": "JPEG"
}
print(json.dumps(result))
```

## The Schema of the Output

A JSON schema of the output is required. You must use [json-schema.org](https://json-schema.org/) to document the output of the tool.

All fields in the schema should have a description.

The schema should be in a separate file named `schema.json`.

### Example

Create a JSON schema file for your tool's output:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "width": {
      "type": "integer",
      "description": "The width of the image in pixels"
    },
    "height": {
      "type": "integer",
      "description": "The height of the image in pixels"
    },
    "format": {
      "type": "string",
      "description": "The format of the image (e.g., JPEG, PNG)"
    }
  },
  "required": ["width", "height", "format"]
}
```

## Testing

You need to provide sample images and the expected output.

All test images should have an appropriate license. If you do not have the right to use the image, you should not include it in the repository.
The licensence, source and attribution of the images should be included in a text file with the same name as the image next to the image.

### Example

Include a `tests` directory with sample images and a JSON file with expected outputs:

```
tests/
  sample1.jpg
  sample1_expected_output.json
  sample2.png
  sample2_expected_output.json
```

## Documentation

You need to provide a README.md file with the following information:

- The dependencies of the tool.
- A short description of the tool.

### Example

Create a `README.md` file:

```markdown
# My Image Tool

## Description

This tool processes images and extracts metadata such as width, height, and format.

## Dependencies

- Python 3.x
- Pillow library

```

## Overview of the Tool Folder

The tool folder should have the following structure:

```
tool_name/
  ├── index.ts
  ├── README.md
  ├── your_tool.py
  ├── schema.json
  └── tests/
      ├── sample1.jpg
      ├── sample1_expected_output.json
      ├── sample2.png
      └── sample2_expected_output.json
```

The name of the tool folder should be the name of the tool. it should exactly match the name in the Class of the tool.
