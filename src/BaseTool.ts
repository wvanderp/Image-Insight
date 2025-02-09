abstract class BaseTool {
    static version: string = '1.0.0';
    static toolName: string = 'BaseTool';

    constructor() {
    }

    abstract runTool(imagePath: string): any;
    abstract canRunTool(imagePath: string): boolean;
}

export default BaseTool;