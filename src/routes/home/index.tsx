import Home  from '@/components/pages/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/')({ component: App })

export function App(){
    return <div>
        <Home/>
    </div>
}
