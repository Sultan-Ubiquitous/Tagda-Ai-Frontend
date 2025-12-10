import { useState, useEffect } from "react";
import {
  useChatResponseStore,
  useInitialPromptStore,
  useStepStore,
  useTemplatePromptStore,
} from "@/store";
import { Message } from "@/types";
import { parseAgentActionsToSteps } from "@/lib/parser";
import { StepItem } from "../StepItem";

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "I'll help you build a bolt-style AI website builder. Tell me what you want to create and I'll break it into a plan and implementation steps.",
  },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const { prompt } = useInitialPromptStore();
  const { response } = useTemplatePromptStore();
  const { steps, setSteps } = useStepStore();
  const { response: chatResponse } = useChatResponseStore();

  useEffect(() => {
    if (response?.uiPrompts?.[0]) {
      const parsed = parseAgentActionsToSteps(response.uiPrompts[0]);
      setSteps(parsed);
    }
  }, [response, setSteps]);

  useEffect(() => {
    if (chatResponse) {
      const chatSteps = parseAgentActionsToSteps(chatResponse);
      setSteps(chatSteps);
    }
  }, [chatResponse, setSteps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;

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

  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    // Lock the whole interface to the screen height
    <div className="flex flex-col h-screen max-h-screen bg-white text-black text-sm">
      {/* Header */}
      <header className="border-b border-black px-3 py-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide">Project</span>
          <span className="text-sm font-medium">Bolt Website Clone</span>
        </div>
        <span className="text-xs text-gray-500">AI Builder</span>
      </header>

      {/* Main content – no scroll here, scroll lives in inner sections */}
      <div className="flex-1 px-3 py-3 space-y-4 overflow-hidden">
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

          {/* Scrollable steps area with fixed max height */}
          <div className="border border-gray-300 rounded">
            <div className="max-h-[35vh] overflow-y-auto divide-y divide-gray-200">
              {steps.map((step) => (
                <StepItem key={step.id} step={step} />
              ))}
            </div>
          </div>
        </section>

        {/* Conversation – its own scroll area */}
        <section className="flex-1 min-h-0">
          <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-1">
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
          </div>
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
