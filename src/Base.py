from abc import ABC, abstractmethod
from typing import Any, Dict
from pathlib import Path

class BaseTool(ABC):
    """Base class for all image analysis tools."""
    
    def __init__(self):
        self.name: str = self.__class__.__name__
        self.version: str = "1.0.0"
    
    @abstractmethod
    def run_tool(self, image_path: str | Path) -> Any:
        """Run the tool on the specified image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Tool-specific output data
        """
        pass
    
    @abstractmethod
    def can_run_tool(self, image_path: str | Path) -> bool:
        """Check if the tool can be run on the specified image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            True if tool can process the image, False otherwise
        """
        pass
    
    def get_tool_info(self) -> Dict[str, str]:
        """Get basic information about the tool.
        
        Returns:
            Dictionary containing tool name and version
        """
        return {
            "name": self.name,
            "version": self.version
        }
