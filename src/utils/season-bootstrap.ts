import type { Season, SeasonConfig } from "@/types/seasonConfig";

/** 自包含：同时用于 head 首帧脚本与客户端，避免两份日期/存储规则。 */
export function bootstrapSeason(
	config: SeasonConfig,
	requested?: Season,
): Season {
	if (typeof document === "undefined" || !config.enabled)
		return config.defaultSeason;
	const read = (key: string): string | null => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	};
	const valid = (value: string | null | undefined): value is Season =>
		value === "spring" ||
		value === "summer" ||
		value === "autumn" ||
		value === "winter";
	const saved = read("aiphadeity-season");
	let season = valid(requested)
		? requested
		: valid(saved)
			? saved
			: config.defaultSeason;
	if (!requested && !valid(saved) && config.initialSeason === "calendar") {
		try {
			const month = Number(
				new Intl.DateTimeFormat("en-US", {
					month: "numeric",
					timeZone: config.timeZone,
				}).format(new Date()),
			);
			season =
				month >= 3 && month <= 5
					? "spring"
					: month >= 6 && month <= 8
						? "summer"
						: month >= 9 && month <= 11
							? "autumn"
							: "winter";
		} catch {
			/* 无效时区使用明确的配置默认值。 */
		}
	}
	const root = document.documentElement;
	const definition = config.seasons[season];
	root.dataset.season = season;
	root.dataset.seasonJournal = String(config.journalLayout);
	const hue = read("hue");
	const customHue =
		hue !== null &&
		hue.trim() !== "" &&
		Number.isFinite(Number(hue)) &&
		Number(hue) >= 0 &&
		Number(hue) <= 360;
	root.dataset.seasonPalette = customHue ? "custom" : "auto";
	root.style.setProperty("--hue", customHue ? hue : String(definition.hue));
	for (const [key, value] of Object.entries({
		"--season-page": definition.background,
		"--season-accent": definition.accent,
		"--season-strong": definition.strong,
		"--season-dark-page": definition.darkBackground,
		"--season-dark-card": definition.darkCard,
	}))
		root.style.setProperty(key, value);
	return season;
}
