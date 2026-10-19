import Image from "next/image";

export function MarketingHomeShowcase() {
	return (
		<div className="w-full max-lg:mt-5 bg-[linear-gradient(to_bottom,var(--primary),transparent_30%)] opacity-70 max-xl:ml-5 rounded-xl p-px relative z-20 ">
			<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--background)_60%)] inset-px w-full h-full absolute z-20 rounded-b-xl" />
			<div className="bg-mantle rounded-xl max-lg:overflow-y-auto inter p-10 py-30 h-[500px] w-full xl:grid max-xl:flex max-xl:gap-4 relative inset-0 grid-cols-4">
				<Image
					src="/image/main-page/terminology_1.png"
					height={872}
					width={692}
					alt="PluralBuddy terminology feature in use."
					className="rounded-lg w-sm shadow-lg -rotate-10 border not-dark:hidden"
				/>

				<Image
					src="/image/main-page/terminology_2.png"
					height={872}
					width={692}
					alt="PluralBuddy terminology feature in use."
					className="rounded-lg w-sm shadow-lg -rotate-10 border dark:hidden"
				/>

				<Image
					src="/image/main-page/server-config.png"
					width={829}
					height={660}
					alt="PluralBuddy server-configuration feature in use."
					className="rounded-lg rotate-10 shadow-lg w-[414.5px] max-h-[330px] border not-dark:hidden"
				/>

				<Image
					src="/image/main-page/server-config_2.png"
					width={829}
					height={660}
					alt="PluralBuddy server-configuration feature in use."
					className="rounded-lg rotate-10 shadow-lg w-[414.5px] max-h-[330px] border dark:hidden"
				/>

				<Image
					src="/image/main-page/alters.png"
					width={829}
					height={660}
					alt="PluralBuddy alter list in use. An extensive menu full of all of the alters in the menu."
					className="max-h-[330px] w-[414.5] shadow-lg rounded-lg -rotate-10 border not-dark:hidden"
				/>

				<Image
					src="/image/main-page/alters_2.png"
					width={829}
					height={660}
					alt="PluralBuddy alter list in use. An extensive menu full of all of the alters in the menu."
					className="max-h-[330px] w-[414.5] shadow-lg rounded-lg -rotate-10 border dark:hidden"
				/>

				<Image
					src="/image/main-page/setup.png"
					alt="The PluralBuddy setup menu, the first page of it. It walks you through all of the steps to setting up a PluralBuddy system."
					width={856}
					height={378}
					className="max-lg:max-w-[428px] max-h-[189px] shadow-lg rounded-lg rotate-10 border not-dark:hidden xl:translate-y-6"
				/>

				<Image
					src="/image/main-page/setup_2.png"
					alt="The PluralBuddy setup menu, the first page of it. It walks you through all of the steps to setting up a PluralBuddy system."
					width={856}
					height={378}
					className="w-[428px] max-h-[189px] shadow-lg rounded-lg rotate-10 border dark:hidden xl:translate-y-6"
				/>
			</div>
		</div>
	);
}
