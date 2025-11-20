import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from "axios"

export const Route = createFileRoute('/')({ component: App })

function App() {
  
  const query = useQuery({
    queryKey: ['nigga'],
    queryFn: getNigga
  })

  return (
    <div className='flex min-h-screen justify-center items-center
        h-screen w-screen bg-[url("/cool-cloudy-background.png")]
        bg-no-repeat bg-center bg-cover
    '>
     <p>{query.data}</p>
    </div>
  )
}

const getNigga = async () => {
  try {
    const response = await axios.get("http://localhost:8008/");
    return await response.data.msg; 
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
};
