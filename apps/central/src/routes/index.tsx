import { Button } from '#/components/ui/button.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="">
      hello world!
      <Button>A normal button</Button>
    </main>
  )
}
