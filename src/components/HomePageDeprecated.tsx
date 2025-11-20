import { Textarea } from "./ui/textarea"

const HomePage = () => {
  return (
    <div className=" min-h-screen flex justify-center">
      <div className="  mt-36 p-5 flex flex-col
      border-white/20 border-[.5px] bg-white/10 backdrop-blur-sm hover:backdrop-blur-md transition-all  
      text-3xl max-w-6xl w-full h-full rounded-lg shadow-md hover:shadow-lg duration-300
      flex justify-center">

      <div className="text-6xl text-white font-medium text-shadow-lg">What will you create today?</div>
      <div className="mt-10">
        <form >
        <Textarea className="border-white/35 backdrop-blur-lg bg-teal-100/10 resize-none max-h-36 overflow-y-auto custom-scrollbar hover:shadow-md"/>
        </form>
      </div>
      </div>
    </div>
  )
}

export default HomePage
