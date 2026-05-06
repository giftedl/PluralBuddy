import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/intent-input";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import type { PPrivacyGroup } from "plurography";
import { useEffect, useState } from "react";
import { FullColorPicker } from "../full-color-picker";
import { Color, parseColor } from "@react-stately/color";
import { db } from "@/lib/app/dexie";
import { useQuickSync } from "@/lib/app/use-sync";

export function PrivacyGroupSettings({ data }: { data: PPrivacyGroup }) {
	const sync = useQuickSync();
	const [currentId, setCurrentId] = useState(data.id);
	const [currentName, setCurrentName] = useState(data.name);
	const [currentColor, setCurrentColor] = useState(
		parseColor(data.color ?? "#000000"),
	);
	const [selectedKey, setSelectedKey] = useState("g");

	useEffect(() => {
		if (currentId !== data.id) {
			setCurrentColor(parseColor(data.color ?? "#000000"));

			setCurrentName(data.name);
			setSelectedKey("g");
		}
		setCurrentId(data.id);
	}, [data]);

	const reload = async (currentName: string, currentColor: Color) => {
		await db.privacyGroups.update(data.id, {
			name: currentName,
			color: currentColor.toString("hex"),
		});

		sync();
	};

	useEffect(() => {
		reload(currentName, currentColor);
	}, [currentName, currentColor]);

	return (
		<Tabs defaultSelectedKey="g" selectedKey={selectedKey} onSelectionChange={(key: string | number) => setSelectedKey(key as string)}>
			<TabList>
				<Tab id="g">General</Tab>
				<Tab id="p">Privacy</Tab>
				<Tab id="f">Fields</Tab>
				<Tab id="i">Members</Tab>
			</TabList>
			<TabPanel id="g" className="grid gap-4">
				<Field>
					<FieldLabel htmlFor="name">Group Name</FieldLabel>
					<Input
						id="name"
						value={currentName}
						onChange={(e) => setCurrentName(e.target.value)}
					/>
					<FieldDescription>
						How your Privacy Group will be described.
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="name">Group Color</FieldLabel>
					<FullColorPicker color={currentColor} setColor={setCurrentColor} />
				</Field>
			</TabPanel>
			<TabPanel id="p">hello</TabPanel>
			<TabPanel id="f">hello</TabPanel>
			<TabPanel id="i">hello</TabPanel>
		</Tabs>
	);
}
