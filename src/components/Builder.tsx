import ChatInterface from "./builder/ChatInterface"
import CodeWorkspace from "./builder/CodeWorkspace"



const Builder = () => {


  return (
    <div className="flex justify-center h-full w-full min-h-screen">
        <div className="border-2 border-black w-1/4">
            <ChatInterface/>
        </div>
        <div className="border-2 border-black w-3/4">
            <CodeWorkspace/>
        </div>
    </div>
  )
}

export default Builder
