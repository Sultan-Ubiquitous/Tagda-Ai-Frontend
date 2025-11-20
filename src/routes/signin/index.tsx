import { createFileRoute } from '@tanstack/react-router'
import SignInButton from '@/components/SigninButton'
export const Route = createFileRoute('/signin/')({ component: App })

function App() {
  

  return (
    <div className='flex justify-center items-center min-h-screen'>
        <SignInButton/>
    </div>
  )
};
