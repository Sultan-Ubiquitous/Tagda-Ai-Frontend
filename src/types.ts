export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};



export interface ParsedAction {
  type: string;
  filePath?: string;
  content: string;
}


export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}

export enum StepType {
    RunScript,
    CreateFile
}