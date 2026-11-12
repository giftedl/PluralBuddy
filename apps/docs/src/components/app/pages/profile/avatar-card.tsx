import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function AvatarCard({
  sessionData,
  data,
}: {
  data: {
    username: string | undefined;
    systemName: string;
    systemPronouns: string | null | undefined;
  };
  sessionData: ReturnType<typeof authClient.useSession>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            PluralBuddy uses the avatar from your Discord profile. <br /> If it's not up to date,
            sign in again.
          </CardDescription>
        </div>
        <Avatar className="size-20">
          <AvatarImage src={sessionData.data?.user.image ?? ""} alt={`@${data.username}`} />
          <AvatarFallback>{(data.username ?? "")[0].toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
