/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/shadcn-button";
import { Wrench } from "lucide-react";

export function SystemCardExample() {
	return (
		<>
			<Card className="flex justify-between justify-left">
				<div>
					<CardHeader className="pb-6">
						<CardTitle>Solar's System</CardTitle>
						<CardDescription>🌼 · he/him</CardDescription>
					</CardHeader>
					<CardContent>
						Hello! I'm Solar, and this is Solar's System. I go by he/him
						pronouns and I'm a system on PluralBuddy. 👋 Be sure if see me
						around to say hi! <br />
						<br />
						<strong className="font-bold">Alters:</strong> 2 <br />
						<strong className="font-bold">Tags:</strong> 0 <br />
						<strong className="font-bold">Associated to:</strong> @giftedly
						(1252031635692720224)
					</CardContent>
				</div>
				<Image
					src="/image/solar.png"
					alt="Solar"
					className="h-[85px] mr-6 w-[85px] rounded-lg"
					width={85}
					height={85}
				/>
			</Card>
			<Button className="mt-3 gap-1! bg-[#5865f2] hover:bg-[#5865f2]/90 cursor-pointer border-[#6672f4] border-2 text-white">
				<Wrench className="size-6 text-white"/>
				Configure Profile
			</Button>
		</>
	);
}
