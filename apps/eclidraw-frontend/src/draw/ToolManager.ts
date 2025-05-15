import { ToolType, StrokeStyleType } from '@/interfaces';

export class ToolManager {
  private selectedTool: ToolType = 'select';
  private stroke: string = '#ffffff';
  private bgColor: string = 'transparent';
  private strokeWidth: number = 1;
  private strokeStyle: StrokeStyleType = 'solid';

  setTool(tool: ToolType) {
    this.selectedTool = tool;
  }

  getTool() {
    return this.selectedTool;
  }

  setStroke(stroke: string) {
    this.stroke = stroke;
  }

  setBgColor(bgColor: string) {
    this.bgColor = bgColor;
  }

  setStrokeWidth(strokeWidth: number) {
    this.strokeWidth = strokeWidth;
  }

  setStrokeStyle(strokeStyle: StrokeStyleType) {
    this.strokeStyle = strokeStyle;
  }

  getCommonProps() {
    return {
      id: undefined,
      stroke: this.stroke,
      bgColor: this.bgColor,
      strokeWidth: this.strokeWidth,
      strokeStyle: this.strokeStyle,
      selected: false,
    };
  }
}
