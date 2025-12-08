import { useState, useEffect } from "react";
import { useChatResponseStore, useInitialPromptStore, useStepStore, useTemplatePromptStore } from "@/store";
import { Step, StepType, Message } from "@/types";
import { parseAgentActionsToSteps } from "@/lib/parser";


const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "I'll help you build a bolt-style AI website builder. Tell me what you want to create and I'll break it into a plan and implementation steps.",
  },
];

type StepItemProps = {
  step: Step;
  onToggle?: () => void;
};

const StepItem = ({ step, onToggle }: StepItemProps) => {
  const isDone = step.status === "completed";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left px-3 py-2 flex items-start gap-2 text-xs hover:bg-gray-50"
    >
      <div
        className={[
          "mt-0.5 h-3 w-3 border border-black rounded-sm shrink-0",
          isDone ? "bg-black" : "",
        ].join(" ")}
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-medium">
            {step.type === StepType.CreateFile ? "Create file" : "Run script"}
          </span>
          <span className="text-[10px] text-gray-500">
            {isDone ? "Completed" : "Pending"}
          </span>
        </div>
        {step.path && (
          <div className="font-mono text-[11px] mb-0.5">
            {step.path}
          </div>
        )}
        <div className="text-[11px] text-gray-600 line-clamp-2">
          {step.description}
        </div>
      </div>
    </button>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const { prompt } = useInitialPromptStore();
  const {response} = useTemplatePromptStore();
  const {steps, setSteps} = useStepStore();
  const {response: chatResponse} = useChatResponseStore();
  

  useEffect(() => {
    if (response?.uiPrompts?.[0]) {
      const parsed = parseAgentActionsToSteps(response.uiPrompts[0]);
      setSteps(parsed);
    }
  }, [response]);

  useEffect(() => {
    if(chatResponse){
      const chatSteps = parseAgentActionsToSteps(chatResponse);
      setSteps(chatSteps);
    }
  }, [chatResponse]);

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const nextId = messages.length
      ? messages[messages.length - 1].id + 1
      : 1;

    const userMessage: Message = {
      id: nextId,
      role: "user",
      content: input.trim(),
    };

    const assistantMessage: Message = {
      id: nextId + 1,
      role: "assistant",
      content:
        "Got it. I’ll turn this into a step-by-step plan and start generating the layout and code in the preview panel.",
    };

    console.log(response?.uiPrompts);

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  const toggleStepStatus = (id: number) => {
    setSteps(
      steps.map((step) => step.id === id ? {
        ...step,
        status: step.status === "completed" ? "pending" : "completed",
      } : step)
    )
  };

  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    <div className="flex flex-col h-full bg-white text-black text-sm">
      {/* Header */}
      <header className="border-b border-black px-3 py-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide">Project</span>
          <span className="text-sm font-medium">Bolt Website Clone</span>
        </div>
        <span className="text-xs text-gray-500">AI Builder</span>
      </header>

      {/* Scrollable main content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Request */}
        <section className="border border-gray-300 rounded p-3">
          <div className="text-xs uppercase text-gray-500 mb-1">Request</div>
          <p className="text-sm leading-relaxed">{prompt}</p>
        </section>

        {/* Build steps */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase text-gray-500">
              Build steps
            </span>
            <span className="text-xs text-gray-500">
              {completedCount}/{steps.length} completed
            </span>
          </div>
          <div className="border border-gray-300 rounded divide-y divide-gray-200">
            {steps.map((step) => (
              <StepItem
                key={step.id}
                step={step}
                onToggle={() => toggleStepStatus(step.id)}
              />
            ))}
          </div>
        </section>

        {/* Conversation */}
        <section className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="text-xs text-gray-500">
                {m.role === "user" ? "You" : "AI"}
              </div>
              <div className="border border-gray-300 rounded p-2 leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-300 px-3 py-3 space-y-2"
      >
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you want the AI to build next..."
          className="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            The AI will turn your message into a plan and code.
          </span>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium border border-black rounded disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
