import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import appCss from '../styles.css?url'
import Navbar from '@/components/Navbar'

function NotFound() {
  return (
    <div className="p-10 text-center text-2xl font-bold">
      404 — Page Not Found
    </div>
  );
}


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tagda AI',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

const queryClient = new QueryClient();

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
        <Navbar/>
            {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
