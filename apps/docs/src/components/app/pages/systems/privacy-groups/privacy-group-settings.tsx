import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/intent-input";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import type { PPrivacyGroup } from "plurography";
import { useEffect, useState } from "react";

export function PrivacyGroupSettings({ data }: { data: PPrivacyGroup }) {
	
	const [currentName, setCurrentName] = useState(data.name);

	useEffect(() =>{
		setCurrentName(data.name);
	}, [data])

	return (
		<Tabs defaultSelectedKey="g">
			<TabList>
				<Tab id="g">General</Tab>
				<Tab id="p">Privacy</Tab>
				<Tab id="f">Fields</Tab>
				<Tab id="i">Members</Tab>
			</TabList>
			<TabPanel id="g">
				<Field>
					<FieldLabel htmlFor="name">Group Name</FieldLabel>
					<Input id="name" value={currentName} onChange={(e) => setCurrentName(e.target.value)} />
					<FieldDescription>How your Privacy Group will be described.</FieldDescription>
				</Field>
			</TabPanel>
			<TabPanel id="p">hello</TabPanel>
			<TabPanel id="f">hello</TabPanel>
			<TabPanel id="i">hello</TabPanel>
		</Tabs>
	);
}
