import { createFileRoute } from '@tanstack/react-router'
import Builder from '@/components/Builder'

export const Route = createFileRoute('/builder/')({ component: App })

function App() {


  return (
    <div className='min-h-screen flex justify-center items-center'>
      <Builder/>
    </div>
  )
}
