/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import { Dithering, GrainGradient, Spiral } from "@paper-design/shaders-react";
import {
	DiscordMessage,
	DiscordMessages,
	DiscordReaction,
	DiscordReactions,
	setConfig,
} from "@penwin/discord-components-react-render";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { cn } from "cn";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import {
	AnimatePresence,
	motion,
	progress,
	useAnimate,
	useInView,
	useMotionValue,
	useScroll,
} from "motion/react";
import { useTheme } from "next-themes";
import React, {
	type SVGProps,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { CorrectHeaderFixer } from "@/components/correct-header-fixer";
import { Highlighter } from "@/components/ui/highlighter";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { useHover } from "@/lib/hooks/use-hover";

export function Hero() {
	const { resolvedTheme } = useTheme();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref);
	const [speed, setSpeed] = useState(0);

	useEffect(() => {
		if (inView) setSpeed(0.01);
		else setSpeed(0);
	}, [inView]);

	return (
		<div ref={ref}>
			{speed !== 0 && (
				<GrainGradient
					width={1280}
					height={720}
					colors={["#89b4fa", "#0080ff"]}
					colorBack={resolvedTheme === "dark" ? "#1e1e2e" : "#ffffff"}
					softness={1}
					intensity={0.5}
					noise={0}
					offsetX={-0.5}
					offsetY={-1.2}
					rotation={5}
					shape="dots"
					speed={speed}
					scale={1.25}
					minPixelRatio={1}
					maxPixelCount={1920 * 1080}
					className="absolute w-full h-full inset-0 animate-fd-fade-in xl:mx-60 duration-3000 fade-in rounded-sm blur-[128px]"
				/>
			)}
		</div>
	);
}

export function GithubLogo(props: SVGProps<SVGSVGElement>) {
	const { resolvedTheme } = useTheme();

	return resolvedTheme === "dark" ? (
		<GithubDark {...props} />
	) : (
		<GithubLight {...props} />
	);
}

export function DynamicHighligher({ children }: { children: string }) {
	const { resolvedTheme } = useTheme();

	return (
		<Highlighter
			action="highlight"
			color={resolvedTheme === "dark" ? "#89b4fa32" : "#E1C2D2"}
		>
			{children}
		</Highlighter>
	);
}

export function ProxyingBackgroundEffect() {
	const { resolvedTheme } = useTheme();

	return (
		<Dithering
			width={1280}
			height={720}
			colorBack={resolvedTheme === "dark" ? "#1e1e2e" : "#ffffff"}
			colorFront="#89b4fa"
			className="rounded-t-lg h-75 max-w-150"
			shape="warp"
			type="2x2"
			rotation={0}
			size={2}
			speed={1}
			scale={3}
		/>
	);
}

export function ProxyingMessages() {
	const [rendered, setRendered] = useState(false);
	const { resolvedTheme } = useTheme();
	const [stage, setStage] = useState(0);
	const ref = useRef(null);
	const isInView = useInView(ref);

	setConfig({
		profiles: {
			giftedly: {
				author: "giftedly",
				avatar: "/image/main-page/giftedly-pfp.jpg",
				roleColor: "#E8C3CF",
			},
		},
	});

	useEffect(() => {
		setRendered(true);
		if (isInView && stage === 0) {
			setTimeout(() => setStage(1), 500);
			setTimeout(() => setStage(2), 1000);
			setTimeout(() => setStage(3), 1500);
			setTimeout(() => setStage(4), 2500);
			setTimeout(() => setStage(5), 3000);
		}
	}, [isInView]);

	return (
		<DiscordMessages
			className="py-4 font-[gg_sans] rounded-[8px] gap-2 border bg-transparent border-none "
			lightTheme={resolvedTheme === "light"}
			ref={ref}
		>
			{rendered && (
				<AnimatePresence>
					<DiscordMessage
						author={stage >= 3 ? "giftedly, as @love" : "giftedly"}
						avatar="/image/main-page/giftedly-pfp.jpg"
						roleColor="#E8C3CF"
						className={cn(
							"px-3 hover:bg-transparent transition-colors text-foreground",
							stage >= 1 && "text-red-400",
						)}
						lightTheme={resolvedTheme === "light"}
					>
						{stage < 3 && <Spinner className="inline" />} hii, how are you
						doing? :love
					</DiscordMessage>
					{stage >= 3 && (
						<motion.div
							key="modal"
							initial={{ opacity: 0, translateY: -10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{ duration: 0.2, type: "tween" }}
						>
							<DiscordMessage
								author="💘 love | xe/xem"
								avatar="/image/main-page/love-pfp.jpg"
								bot={true}
								className="px-3 hover:bg-transparent mt-2 text-foreground"
								roleColor={resolvedTheme === "light" ? "#000000" : "#FFFFFF"}
								lightTheme={resolvedTheme === "light"}
							>
								hii, how are you doing?
								<AnimatePresence>
									{stage >= 4 && (
										<motion.div
											initial={{ opacity: 0, translateY: -10 }}
											animate={{ opacity: 1, translateY: 0 }}
											transition={{ duration: 0.2, type: "tween" }}
											className="pt-1"
										>
											<DiscordReactions>
												<AnimatePresence key="reactions">
													<DiscordReaction
														count={stage - 3}
														emoji="❤️"
														key="reaction1"
													/>
													{stage >= 5 && (
														<motion.div
															initial={{ opacity: 0, translateY: -10 }}
															animate={{ opacity: 1, translateY: 0 }}
															transition={{ duration: 0.2, type: "tween" }}
															key="reaction2"
														>
															<DiscordReaction count={1} emoji="🥰" />
														</motion.div>
													)}
												</AnimatePresence>
											</DiscordReactions>
										</motion.div>
									)}
								</AnimatePresence>
							</DiscordMessage>
						</motion.div>
					)}
				</AnimatePresence>
			)}
			<CorrectHeaderFixer />
		</DiscordMessages>
	);
}

export function SpiralEffect() {
	const { resolvedTheme } = useTheme();

	return (
		<Spiral
			width={200}
			height={200}
			colorBack={resolvedTheme === "dark" ? "#313244" : "#e6e9ef"}
			colorFront={resolvedTheme === "dark" ? "#11111b" : "#dce0e8"}
			density={1}
			distortion={0}
			strokeWidth={0.39}
			strokeTaper={0}
			strokeCap={0}
			noise={0.25}
			noiseFrequency={0.39}
			softness={0}
			scale={0.32}
			speed={10}
		/>
	);
}

export function ShiftingText() {
	const possibleStates = ["command", "component", "option", "alter", "tag"];
	const duration = 1000;
	const localRef = useRef<HTMLSpanElement>(null);

	const [currentWord, setCurrentWord] = useState(possibleStates[0]);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);
	const isInView = useInView(localRef);

	const startAnimation = useCallback(() => {
		const word =
			possibleStates[possibleStates.indexOf(currentWord) + 1] ||
			possibleStates[0];
		setCurrentWord(word);
		setIsAnimating(true);
	}, [currentWord]);

	useEffect(() => {
		if (isInView && !isAnimating) {
			const timeoutId = setTimeout(() => {
				startAnimation();
			}, duration);
			return () => clearTimeout(timeoutId);
		}
	}, [isInView, isAnimating, startAnimation]);

	return (
		<span ref={localRef}>
			<AnimatePresence
				onExitComplete={() => {
					setIsAnimating(false);
				}}
			>
				<motion.span
					animate={{
						opacity: 1,
						y: 0,
					}}
					className={cn("inline-block relative text-left")}
					exit={{
						opacity: 0,
						y: -10,
						position: "absolute",
					}}
					initial={{
						opacity: 0,
						y: 10,
					}}
					key={currentWord}
					transition={{
						type: "tween",
					}}
				>
					{currentWord}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}

export function ForceRerender({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	if (mounted) return children;

	return null;
}

export function ShiftingComponentsBox() {
	const componentExamples = [
		{
			btn: "Set Pronouns",
			cmd: "pb;ea pn clementine xe/xem",
			slash: "/edit-alter pronouns clementine xe/xem",
		},
		{
			btn: "Set Display Name",
			cmd: "pb;ea dn clementine clem",
			slash: "/edit-alter display-name love cute",
		},
		{
			btn: "Set Banner",
			cmd: "pb;ea banner clementine",
			slash: "/edit-alter banner clementine",
		},
		{
			btn: "Set Profile Picture",
			cmd: "pb;ea pfp clementine",
			slash: "/edit-alter avatar clementine",
		},
		{
			btn: "Terminology",
			cmd: "pb;s terminology",
			slash: "/system terminology",
		},
	];
	const [currentState, setCurrentState] = useState(0);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);
	const [userControlled, setUserControlled] = useState<boolean>(false);
	const { resolvedTheme } = useTheme();

	const outlyingComp = useRef<HTMLDivElement>(null);
	const isInView = useInView(outlyingComp);

	const fallbackIfOverUnder = (newState: number) => {
		if (newState === -1) {
			return componentExamples.length - 1;
		}
		if (newState === componentExamples.length) {
			return 0;
		}
		return newState;
	};
	const [scope, animate] = useAnimate();
	const hovering = useHover(outlyingComp);
	const startAnimation = useCallback(() => {
		const state = fallbackIfOverUnder(currentState + 1);
		animate(
			scope.current,
			{ width: "0%" },
			{ ease: [0.37, 0, 0.63, 1], duration: 0.5 },
		).then(() =>
			animate(
				scope.current,
				{
					width: "100%",
				},
				{ ease: [0.4, 0, 0.2, 1], duration: 2, delay: 0.2 },
			),
		);
		setCurrentState(state);
		setIsAnimating(true);
	}, [currentState]);

	useEffect(() => {
		if (isInView)
			animate(
				scope.current,
				{ width: "0%" },
				{ ease: [0.37, 0, 0.63, 1], duration: 0.5 },
			).then(() =>
				animate(
					scope.current,
					{
						width: "100%",
					},
					{ ease: [0.4, 0, 0.2, 1], duration: 2, delay: 0.2 },
				),
			);
	}, [isInView]);

	useEffect(() => {
		if (hovering) {
			startAnimation();
		}
	}, [hovering]);

	useEffect(() => {
		if (isInView && hovering && !userControlled && !isAnimating) {
			const timeoutId = setTimeout(() => {
				startAnimation();
			}, 2700);
			return () => clearTimeout(timeoutId);
		}
	}, [hovering, isInView, isAnimating, userControlled, startAnimation]);

	const shiftAnimation = {
		initial: {
			translateX: -30,
			opacity: 0,
		},
		exit: {
			opacity: 0,
			translateX: 30,
		},
		animate: {
			opacity: 1,
			translateX: 0,
		},
		transition: {
			duration: 0.2,
		},
		className: "mt-6 absolute -translate-y-3",
	};

	return (
		<div className="relative w-full h-full" ref={outlyingComp}>
			{isInView && (
				<Dithering
					width={1280}
					height={720}
					colorBack={resolvedTheme === "dark" ? "#1e1e2e" : "#dce0e8"}
					colorFront="#89b4fa"
					shape="warp"
					type="4x4"
					size={4}
					speed={hovering ? 0.005 : 0}
					className="max-w-full absolute z-0 top-0 w-full h-full max-h-full rounded-lg"
				/>
			)}
			<div className="absolute z-10 w-full pr-7">
				<div className="w-full m-3 bg-crust/70 rounded-xl p-1 flex justify-between items-center">
					<Button
						size="sm"
						onClick={() => {
							setUserControlled(true);
							setCurrentState((state) => fallbackIfOverUnder(state - 1));
						}}
					>
						<ArrowLeft />
					</Button>
					<div className="flex items-center gap-1">
						{Array.from({ length: componentExamples.length }).map((_, i) => (
							<div
								className={cn(
									"w-4 h-4 rounded-full transition-colors duration-500",
									currentState + 1 > i ? "bg-primary" : "bg-white",
								)}
								key={i}
							/>
						))}
					</div>
					<Button
						size="sm"
						onClick={() => {
							setUserControlled(true);
							setCurrentState((state) => fallbackIfOverUnder(state + 1));
						}}
					>
						<ArrowRight />
					</Button>
				</div>
				<AnimatePresence
					onExitComplete={() => {
						setIsAnimating(false);
					}}
				>
					<motion.div key={`${currentState}`} {...shiftAnimation}>
						<div className={cn("flex items-center gap-2 m-3")}>
							<div className="w-[24px] h-[24px] text-xs pt-1 text-center rounded-full bg-crust">
								1
							</div>
							<div
								className={cn(
									"p-2 text-xs rounded-xl",
									"bg-crust/70 border font-mono",
								)}
							>
								{componentExamples[currentState].slash}
							</div>
						</div>
						<div className={cn("flex items-center gap-2 m-3")}>
							<div className="w-[24px] h-[24px] text-xs pt-1 text-center rounded-full bg-crust">
								2
							</div>
							<div
								className={cn(
									"p-2 text-xs rounded-xl",
									"bg-crust/70 border font-mono w-fit",
								)}
							>
								{componentExamples[currentState].cmd}
							</div>
						</div>
						<div className={cn("flex items-center gap-2 m-3")}>
							<div className="w-[24px] h-[24px] text-xs pt-1 text-center rounded-full bg-crust">
								3
							</div>
							<div
								className={cn(
									"p-2 text-xs rounded-xl",
									"bg-primary/90 cursor-pointer brightness-90 hover:brightness-100",
									"transition-all overflow w-fit text-primary-foreground",
								)}
							>
								{componentExamples[currentState].btn}
							</div>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="absolute z-15 bottom-0 w-full h-[30px] px-4 bg-[linear-gradient(transparent,var(--mantle)_50%)] rounded-b-lg">
				<div
					className="w-[0px] h-px bg-primary mt-4"
					// initial={{
					// 	width: "0px",
					// }}
					ref={scope}
					// transition={{
					// 	duration: 2,
					// 	ease: [0.37, 0, 0.63, 1],
					// }}
				/>
			</div>
		</div>
	);
}
export function RandomIdsVisualization() {
	const ids = Array.from({ length: 10 }, (_, i) => {
		const date = new Date();
		date.setSeconds(i ?? 0);
		return {
			private: Math.random() > 0.5,
			snowflake: DiscordSnowflake.generate({
				timestamp: date,
				workerId: BigInt(i ?? 0),
				processId: BigInt(Math.floor(Math.random() * 1000)),
			}),
		};
	});

	return (
		<ForceRerender>
			<div className="font-mono 2xl:text-2xl text-xl flex flex-col gap-2">
				{ids.map((v) => (
					<div
						key={v.snowflake}
						className="flex items-center gap-1 justify-between"
					>
						<Lock size={20} />
						{v.snowflake}
					</div>
				))}
			</div>
		</ForceRerender>
	);
}

export function AutoTopSectionNav({
	scrollPosition,
	number,
	text,
}: {
	scrollPosition: number;
	number: number;
	text: string;
}) {
	const scroll = useScroll();
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		scroll.scrollY.on("change", setScrollY);
		return () => scroll.scrollY.clearListeners();
	});

	return (
		<AnimatePresence>
			{scrollY > scrollPosition && (
				<motion.div
					transition={{ type: "tween" }}
					initial={{ translateY: -30, opacity: 0 }}
					animate={{ translateY: 0, opacity: 1 }}
					exit={{ translateY: -30, opacity: 0 }}
					className="fixed top-14 left-0 w-full shadow-2xl h-[30px] bg-primary z-100 flex items-center justify-between lg:px-35 max-lg:px-10 rounded-b-lg"
				>
					<p className="font-mono text-transparent bg-clip-text bg-linear-to-b from-primary-foreground to-primary flex items-center gap-2">
						0{number}{" "}
						<a
							href={`#0${number}-${text.replaceAll(" ", "-").toLocaleLowerCase()}`}
							className="text-xs text-black"
						>
							#
						</a>
					</p>
					<h1 className="text-primary-foreground text-left font-semibold tracking-tighter text-sm">
						{text}
					</h1>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export function BillingualLanguageBox() {
	const languagesPossible: Record<
		string,
		{ flag: string; title: string; para1: string; para2: string }
	> = {
		en: {
			flag: "🇬🇧",
			title: "Welcome to PluralBuddy",
			para1:
				"PluralBuddy is a bot designed to fill the gap for quality customizable plurality exchanges for Discord servers and users.",
			para2:
				":track_next: To get started, click the Next Page button below to setup your system.",
		},
		es: {
			flag: "🇪🇸",
			title: "Bienvenido/a a PluralBuddy",
			para1:
				"PluralBuddy es un bot diseñado para cubrir la necesidad de intercambios de pluralidad personalizables y de calidad para servidores y usuarios de Discord.",
			para2:
				":track_next: Para empezar, haz clic en el botón Siguiente página abajo para configurar tu sistema.",
		},
		de: {
			flag: "🇩🇪",
			title: "Willkommen bei PluralBuddy",
			para1:
				"PluralBuddy ist ein Bot, der entwickelt wurde, um die Lücke zwischen Qualität und Anpassbarkeit im Plural Austausch für Discord Server und Benutzer zu schließen.",
			para2:
				":track_next: Klicken Sie zum Starten auf die Schaltfläche Nächste Seite unten, um Ihr System einzurichten.",
		},
	};
	const [state, setState] = useState("es");
	const [userControlled, setUserControlled] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const outlyingComp = useRef<HTMLDivElement>(null);
	const hovering = useHover(outlyingComp);

	const nullifyNum = (c: number) => {
		if (Object.keys(languagesPossible)[c] === undefined) return null;
		return c;
	};

	const startAnimation = useCallback(() => {
		const newState =
			nullifyNum(
				Object.values(languagesPossible).indexOf(languagesPossible[state]) + 1,
			) || 0;
		setState(Object.keys(languagesPossible)[newState]);
		setIsAnimating(true);
		console.log(newState, state + 1);
	}, [state]);

	useEffect(() => {
		if (hovering) startAnimation();
	}, [hovering]);

	useEffect(() => {
		if (hovering && !userControlled && !isAnimating) {
			const timeoutId = setTimeout(() => {
				startAnimation();
			}, 2000);
			return () => clearTimeout(timeoutId);
		}
	}, [hovering, isAnimating, userControlled, startAnimation]);

	return (
		<div className="border rounded-lg bg-crust rounded-b-none border-b-none mt-2 relative max-h-[200px]" ref={outlyingComp}>
			<div className="bottom-2.5 absolute justify-center mx-auto w-fit left-0 right-0 z-30 flex items-center gap-1">
				{Object.entries(languagesPossible).map(([k, v]) => (
					<Button
						size="sm"
						variant="ghost"
						className={cn(state !== k && "grayscale")}
						key={k}
						onClick={() => {
							setUserControlled(true);
							setState(k);
						}}
					>
						{v.flag}
					</Button>
				))}
			</div>
			<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_90%)] w-full h-[calc(100%+2px)] absolute z-20" />
			<div className="relative h-[300px]">
				<AnimatePresence onExitComplete={() => setIsAnimating(false)}>
					<motion.div
						key={state}
						initial={{ translateX: -15, opacity: 0 }}
						animate={{ translateX: 0, opacity: 1 }}
						exit={{ translateX: 15, opacity: 0 }}
						transition={{ ease: [0.64, 0, 0.78, 0] }}
						className="absolute h-[300px] w-full p-4 flex flex-col gap-2"
					>
						<h2 className="text-xl font-bold font-[Mona_Sans]">
							{languagesPossible[state].title}
						</h2>
						<p>{languagesPossible[state].para1}</p>
						<p>{languagesPossible[state].para2.replace(":track_next:", "⏭️")}</p>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
