import { useAuth } from '#/hooks/use-auth';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/callback')({
  component: RouteComponent,
})

function RouteComponent() {
    const { callback } = useAuth();

    callback();
    
    return null;
}
