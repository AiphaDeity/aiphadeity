export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonDefinition {
	name: string;
	title: string;
	hue: number;
	background: string;
	accent: string;
	strong: string;
	darkBackground: string;
	darkCard: string;
	scene: string;
	sceneIncludesCharacter?: boolean;
	darkScene?: string;
	mascot: string;
	greeting: string;
	weather: "none" | "rain" | "snow";
}

export interface SeasonConfig {
	enabled: boolean;
	journalLayout: boolean;
	innerLayout: boolean;
	defaultSeason: Season;
	initialSeason: "calendar" | "fixed";
	timeZone: string;
	title: string;
	subtitle: string;
	mascotEnabled: boolean;
	companionOptions: {
		messageDuration: number;
		mobileExpandDuration: number;
		idleDelay: number;
	};
	weatherEnabled: boolean;
	weatherOptions: Record<
		"rain" | "snow",
		{
			desktopDensity: number;
			mobileDensity: number;
			speed: number;
			drift: number;
			opacity: number;
			size: number;
		}
	>;
	seasons: Record<Season, SeasonDefinition>;
}
