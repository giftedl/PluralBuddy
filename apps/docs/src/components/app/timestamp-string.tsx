import {
	RelativeTime,
	RelativeTimeZone,
	RelativeTimeZoneDate,
	RelativeTimeZoneDisplay,
	RelativeTimeZoneLabel,
} from "../kibo-ui/relative-time";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function TimestampString({ date }: { date: Date }) {
	const timezones = [
        { label: new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2], zone: Intl.DateTimeFormat().resolvedOptions().timeZone  },
		{ label: "EST", zone: "America/New_York" },
		{ label: "GMT", zone: "Europe/London" },
		{ label: "JST", zone: "Asia/Tokyo" },
	];

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="underline decoration-dashed">
					{date.toLocaleDateString()}
				</span>
			</TooltipTrigger>
			<TooltipContent className="bg-background text-foreground min-w-fit">
				<RelativeTime time={date} dateFormatOptions={{ dateStyle: "full" }} onClick={e => e.stopPropagation()}>
					{timezones.map(({ zone, label }) => (
						<RelativeTimeZone key={zone} zone={zone}>
							<RelativeTimeZoneLabel>{label}</RelativeTimeZoneLabel>
							<RelativeTimeZoneDate />
							<RelativeTimeZoneDisplay />
						</RelativeTimeZone>
					))}
				</RelativeTime>
			</TooltipContent>
		</Tooltip>
	);
}
