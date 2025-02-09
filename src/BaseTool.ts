abstract class BaseTool {
    version: string;

    constructor() {
        this.version = '1.0.0';
    }

    abstract runTool(imagePath: string): any;
    abstract canRunTool(imagePath: string): boolean;
}

export default BaseTool;