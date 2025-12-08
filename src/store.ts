import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Step } from "./types";


type InitialPromptStore = {
  prompt: string;
  setPrompt: (value: string) => void;
};

export const useInitialPromptStore = create<InitialPromptStore>()(
  persist(
    (set) => ({
      prompt: "",
      setPrompt: (value: string) => set({ prompt: value }),
    }),
    {
      name: "initial-prompt-store",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);


type TemplatePrompt = {
  prompts: string[];
  uiPrompts: string[];
};

type TemplatePromptStore = {
  response: TemplatePrompt | null;
  setResponse: (data: TemplatePrompt) => void;
  resetResponse: () => void;
};

export const useTemplatePromptStore = create<TemplatePromptStore>()(
  persist(
    (set) => ({
      response: null,
      setResponse: (data) => set({ response: data }),
      resetResponse: () => set({ response: null }),
    }),
    {
      name: "template-prompt-store",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);


type ResponseStore = {
  response: string | null;
  setResponse: (data: string) => void;
  resetResponse: () => void;
};

export const useChatResponseStore = create<ResponseStore>()(
  persist(
    (set) => ({
      response: null,
      setResponse: (data) => set({ response: data }),
      resetResponse: () => set({ response: null }),
    }),
    {
      name: "response-store",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);

type StepStore = {
    steps: Step[];
    setSteps: (data: Step[]) => void;
    resetSteps: () => void;
}

export const useStepStore = create<StepStore>()(
    persist(
        (set) => ({
            steps: [],
            setSteps: (data) => set({steps: data}),
            resetSteps: () => set({steps: []})
        }),
        {
            name: "step-store",
            storage:
                typeof window !== "undefined"
                ? createJSONStorage(()=>localStorage)
                : undefined,
        }
    )
)

