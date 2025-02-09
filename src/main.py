from pathlib import Path
from tools.exif_tool import ExifTool

def main():
    # Example usage
    image_path = "path/to/your/image.jpg"
    results = ExifTool().run_tool(image_path)
    print(f"EXIF data: {results}")

if __name__ == "__main__":
    main()
