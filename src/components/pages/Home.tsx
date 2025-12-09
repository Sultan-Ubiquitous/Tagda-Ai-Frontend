import { useInitialPromptStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTemplatePromptStore, useChatResponseStore } from "@/store"


export default function Home() {
  const [text, setText] = useState("");
  const { setPrompt, prompt } = useInitialPromptStore();
  const navigate = useNavigate();
  const {setResponse: setTemplateResponse, response: templateResponse} = useTemplatePromptStore();
  const {setResponse: setChatResponse} = useChatResponseStore();

  const templateMutation = useMutation({
  mutationFn: async () => {
    const templatePromptRequest = {prompt: prompt} ;
    const res = await axios.post( 
      "http://localhost:8008/test_template",
      templatePromptRequest,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    setTemplateResponse(res.data);
    return res.data;
  },
});

  const chatMutation = useMutation({
  mutationFn: async (messages: any) => {
    const res = await axios.post(
      "http://localhost:8008/test_chat",
      {messages},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    setChatResponse(res.data.response);
    return res.data;
  },
});


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(text){
    setPrompt(text);    
    console.log("Submitted:", prompt);

    await templateMutation.mutateAsync();
    
    let messages = [];
    if(templateResponse?.prompts){
      templateResponse.prompts.forEach((templatePrompt)=>{
        messages.push({
          role:"user",
          content: templatePrompt
        })
      })
    }

    if(prompt){
      messages.push({
        role: "user",
        content: prompt
      });
    }
    console.log(messages);
    
    await chatMutation.mutateAsync("Just a test, lyt ninja");

    navigate({to: "/builder"});
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2 text-center">
        What will you build today?
      </h1>

      <p className="text-gray-700 text-center mb-6">
        Describe your idea and start building.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl border border-gray-300 rounded-lg p-4 flex flex-col gap-4"
      >
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what you want to build..."
          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-black"
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-900 transition"
        >
          Build now →
        </button>
      </form>
    </div>
  );
}
