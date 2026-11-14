export function Sidebar() {
    return <main className="flex max-h-screen w-full overflow-hidden pt-[57px] pl-8">
                <div className="flex w-full max-w-[300px] flex-col gap-2 border-r pt-7 pr-6">
                  <SignedIn>
                    {(profile) => (
                      <Button
                        variant="tertiary"
                        rounding="xl"
                        className="flex items-center justify-start gap-2 text-left"
                      >
                        <Avatar className="size-6">
                          <AvatarImage src={profile.picture} />
                          <AvatarFallback>{profile.name[0].toLocaleUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{profile.name}</span>
                          <span className="text-muted-foreground">No system</span>
                        </div>
                      </Button>
                    )}
                  </SignedIn>
                  <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
                    <span className="shrink-0">Profile</span>
                    <Separator className="shrink" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <SignedIn>
                      <Button
                        className="flex w-full items-center justify-start gap-2 text-left text-muted-foreground!"
                        variant="tertiary"
                        rounding="xl"
                      >
                        <Container size={16} />
                        System
                      </Button>
                      <Button
                        className="flex w-full items-center justify-start gap-2 text-left text-muted-foreground!"
                        variant="tertiary"
                        rounding="xl"
                      >
                        <UserGroup size={16} />
                        Alters
                      </Button>
                    </SignedIn>
                    <SignedOut>
                      <Button
                        className="flex w-full items-center justify-start gap-2 text-left text-muted-foreground!"
                        variant="tertiary"
                        rounding="xl"
                      >
                        <LogIn size={16} />
                        Log in
                      </Button>
                    </SignedOut>
                    <Button
                      className="flex w-full items-center justify-start gap-2 text-left text-muted-foreground!"
                      variant="tertiary"
                      rounding="xl"
                    >
                      <Discord className="size-4 fill-muted-foreground" />
                      Invite PluralBuddy
                    </Button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 px-3 text-sm text-muted-foreground">
                    <span className="shrink-0">App</span>
                    <Separator className="shrink" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      className="flex w-full items-center justify-start gap-2 text-left text-muted-foreground!"
                      variant="tertiary"
                      rounding="xl"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Settings
                    </Button>
                    <Button
                      className="flex w-full items-center justify-between text-left text-muted-foreground!"
                      variant="tertiary"
                      rounding="xl"
                    >
                      <span className="flex gap-2 items-center">
                      <SwatchBook className="size-4 text-muted-foreground" />
                      Color scheme</span>
                      <ChevronDown className="size-4" />
                    </Button>
                  </div>
                </div>
                {children}
              </main>
}