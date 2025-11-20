import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builder/')({ component: App })

export function App(){
    return <div>
        <p>Hello</p>
    </div>
}
