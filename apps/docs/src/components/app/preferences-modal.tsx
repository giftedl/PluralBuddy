import { APIApplication, APIUser } from "discord-api-types/v10";
import { useMediaQuery } from "fumadocs-core/utils/use-media-query";
import { PAlter, PExpressApplication } from "plurography";
import { ReactNode, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "../ui/drawer";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/shadcn-button";
import { useMutation } from "@tanstack/react-query";
import { useTRPCClient } from "@/server/client";
import { Spinner } from "../ui/spinner";

export function PreferencesModal({
	children,
	alter,
	open,
	setOpen,
}: {
	children?: ReactNode;
	open: boolean;
	setOpen: (a: boolean) => void;
	alter: PAlter & {
		express: PExpressApplication | null;
		user: APIUser | undefined;
		application: APIApplication | undefined;
	};
}) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const trpc = useTRPCClient();
	const [displayMode, setDisplayMode] = useState(
		alter.express?.usesContainer ? "container" : "text-display",
	);
	const [profileName, setProfileName] = useState(
		alter.express?.profileName ?? "",
	);
	const [loading, setLoading] = useState(false);

	const submit = useMutation({
		mutationFn: async () =>
			trpc.express.edit.mutate({
				alter_id: alter.alterId.toString(),
				options: {
					usesContainer: displayMode === "container",
					profileName: profileName,
				},
			}),
	});

	if (isDesktop)
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger>{children}</DialogTrigger>
				<DialogContent className="min-w-[700px]">
					<DialogContents
						alter={alter}
						input={{
							displayMode,
							setDisplayMode,
							setProfileName,
							profileName,
						}}
					/>
					<DialogFooter>
						<Button
							disabled={loading}
							onClick={async () => {
								setLoading(true);
								await submit.mutateAsync();

								setLoading(false);
							}}
						>
							{loading && <Spinner />}Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger>{children}</DrawerTrigger>
			<DrawerContent className="px-2">
				<DialogContents
					alter={alter}
					input={{
						displayMode,
						setDisplayMode,
						setProfileName,
						profileName,
					}}
				/>
				<DrawerFooter>
					<Button
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await submit.mutateAsync();

							setLoading(false);
						}}
					>
						{loading && <Spinner />}Submit
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function DialogContents({
	alter,
	input,
}: {
	alter: PAlter & {
		express: PExpressApplication | null;
		user: APIUser | undefined;
		application: APIApplication | undefined;
	};
	input: {
		displayMode: string;
		setDisplayMode: (newState: string) => void;

		profileName: string;
		setProfileName: (newState: string) => void;
	};
}) {
	return (
		<div className="grid gap-3">
			<DialogTitle>Preferences</DialogTitle>
			<DialogDescription>
				Configure various settings relating to PluralBuddy Express
			</DialogDescription>

			<Separator className="my-1 h-px" />

			<FieldGroup className="w-full bg-card border rounded-xl p-4">
				<FieldSet>
					<FieldLegend variant="label">Display Mode</FieldLegend>
					<FieldDescription>
						Express alters can have a differently displayed message depending on
						your preference.
					</FieldDescription>
					<RadioGroup
						defaultValue="text-display"
						value={input.displayMode}
						onValueChange={(e) => input.setDisplayMode(e)}
					>
						<FieldLabel htmlFor="text-display" className="bg-background/35">
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Text Display Mode</FieldTitle>
									<FieldDescription>
										Render displayed message with just normal Discord Components
										V2 text display's. Most similar to how PluralBuddy usually
										proxies messages.
									</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="text-display" id="text-display" />
							</Field>
						</FieldLabel>
						<FieldLabel htmlFor="container" className="bg-background/35">
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Container Mode</FieldTitle>
									<FieldDescription>
										Render displayed message with a text display inside of a
										container. Colored using the alters specified accent color.
									</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="container" id="container" />
							</Field>
						</FieldLabel>
					</RadioGroup>
				</FieldSet>
			</FieldGroup>

			<FieldGroup className="w-full bg-card border rounded-xl p-4">
				<FieldSet className="flex! justify-between items-center">
					<div>
						<FieldLegend variant="label">Profile Name Override</FieldLegend>
						<FieldDescription>
							If you want your application to be named something other than your
							alter's username, input the username you'd like to use here.
						</FieldDescription>
					</div>
					<Input
						placeholder={alter.username}
						value={input.profileName}
						onChange={(e) => input.setProfileName(e.target.value)}
					/>
				</FieldSet>
			</FieldGroup>
		</div>
	);
}
