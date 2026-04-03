"use client";

import { PAlter, PExpressApplication } from "plurography";
import { SettingsSidebar } from "../settings-sidebar";
import { AlterView } from "../app/alter-view";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Field, FieldLabel } from "../ui/field";
import { Select } from "../ui/select";
import { Empty } from "../ui/empty";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export function ExpressAlterPage({
	alter,
}: {
	alter: PAlter & { express: PExpressApplication | null };
}) {
	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<SettingsSidebar page="express" />
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<AlterView selectedAlter={String(alter.alterId)} />
			</div>

			{alter.express === null ? (
				<Empty></Empty>
			) : (
				<Card className="w-full">
					<CardContent>
						<CardTitle>Express Settings</CardTitle>
						<CardDescription>
							You can configure some settings with this alter below
						</CardDescription>

						<Separator className="h-px my-3" />

						<Field>
							<FieldLabel htmlFor="public-id">
								Application Public Key
							</FieldLabel>
							<Input id="public-id" value={alter.express?.publicKey} disabled />
						</Field>
						<Field className="mt-3">
							<FieldLabel htmlFor="public-id">
								Application ID
							</FieldLabel>
							<Input id="public-id" value={alter.express?.application} disabled />
						</Field>
					</CardContent>
				</Card>
			)}
		</main>
	);
}
