import subprocess
import json
from pathlib import Path
from pydantic import BaseModel, ValidationError
from ..Base import BaseTool

class ExifData(BaseModel):
    # Define the expected fields based on EXIF data structure
    # Example fields, you may need to adjust based on actual EXIF data
    FileName: str
    FileSize: int
    Make: str
    Model: str
    # Add other fields as necessary

class ExifTool(BaseTool):
    def __init__(self):
        super().__init__()
        self.version = "1.0.0"  # Update version as needed

    def run_tool(self, image_path: str | Path) -> ExifData:
        """
        Extracts EXIF data from the given image using exiftool.

        Args:
            image_path: The path to the image file.

        Returns:
            ExifData: A Pydantic model containing the EXIF data.
        """
        try:
            result = subprocess.run(['exiftool', '-json', image_path], capture_output=True, text=True, check=True)
            exif_data = json.loads(result.stdout)
            if (exif_data):
                return ExifData(**exif_data[0])
            else:
                return ExifData()
        except subprocess.CalledProcessError as e:
            print(f"Error occurred while extracting EXIF data: {e}")
            return ExifData()
        except ValidationError as e:
            print(f"Validation error: {e}")
            return ExifData()

    def can_run_tool(self, image_path: str | Path) -> bool:
        """
        Checks if exiftool can be run on the given image.

        Args:
            image_path: The path to the image file.

        Returns:
            bool: True if exiftool can be run, False otherwise.
        """
        try:
            result = subprocess.run(['exiftool', '-ver'], capture_output=True, text=True, check=True)
            return result.returncode == 0
        except subprocess.CalledProcessError:
            return False

# Example usage
if __name__ == "__main__":
    image_path = 'path/to/your/image.jpg'
    exif_tool = ExifTool()
    if exif_tool.can_run_tool(image_path):
        exif_data = exif_tool.get_exif_data(image_path)
        print(exif_data.json(indent=4))
    else:
        print("ExifTool cannot be run on this image.")
