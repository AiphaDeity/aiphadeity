import { sakuraConfig } from "@/config/effectsConfig";
import { seasonConfig } from "@/config/seasonConfig";
import type { Season } from "@/types/seasonConfig";
import { bootstrapSeason } from "./season-bootstrap";
import { createSeasonCompanion } from "./season-companion";
import { createSeasonWeather } from "./season-weather";
import { url } from "./url-utils";

export function readSeasonPreference(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function savePreference(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		/* 本次访问仍可正常切换。 */
	}
}

export function resetSeasonPalette(): void {
	try {
		localStorage.removeItem("hue");
	} catch {
		/* 保留本次访问状态。 */
	}
	if (seasonConfig.enabled)
		bootstrapSeason(
			seasonConfig,
			document.documentElement.dataset.season as Season,
		);
	window.dispatchEvent(new Event("seasonchange"));
}

let initialized = false;

export function initSeasons(): void {
	if (initialized || !seasonConfig.enabled) return;
	initialized = true;
	const root = document.documentElement;
	let season = bootstrapSeason(seasonConfig);
	const order: Season[] = ["spring", "summer", "autumn", "winter"];
	const hero = document.getElementById("season-hero");
	const landscape = hero?.querySelector<HTMLElement>("[data-season-landscape]");
	const heroMascot = hero?.querySelector<HTMLElement>(
		"[data-season-hero-mascot]",
	);
	const companion = document.getElementById("season-companion");
	const companionCharacter = companion?.querySelector<HTMLButtonElement>(
		"[data-companion-greet]",
	);
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	const mobile = window.matchMedia("(max-width: 767px)");
	const canvas = hero?.querySelector<HTMLCanvasElement>(
		"[data-season-weather]",
	);
	const weather = canvas
		? createSeasonWeather(canvas, seasonConfig.weatherOptions)
		: null;
	const savedCollapsed = readSeasonPreference("aiphadeity-xiaojin-collapsed");
	const companionView = companion
		? createSeasonCompanion(
				companion,
				seasonConfig.companionOptions,
				savedCollapsed === "true",
				(collapsed) =>
					savePreference("aiphadeity-xiaojin-collapsed", String(collapsed)),
			)
		: null;
	let visible = false;
	let loadedKey = "";
	let pendingKey = "";
	let generation = 0;
	let mascotSource = "";
	let syncFrame = 0;
	let companionLoadedSeason = "";
	let companionPendingSeason = "";
	let companionRequest = 0;
	let calendarHome: boolean | undefined;
	let sakuraActive: boolean | undefined;

	const isSceneVisible = () =>
		document.body.classList.contains("is-home") &&
		!document.body.classList.contains("immersive-reading") &&
		(root.dataset.wallpaperMode === "banner" ||
			root.dataset.wallpaperMode === "fullscreen");
	const syncSakura = () => {
		if (!seasonConfig.journalLayout) return;
		const enabled =
			visible &&
			isSceneVisible() &&
			!document.hidden &&
			!reduced.matches &&
			(season === "spring" || season === "summer") &&
			(readSeasonPreference("sakuraEnabled") === "true" ||
				(readSeasonPreference("sakuraEnabled") === null &&
					sakuraConfig.enable));
		if (sakuraActive !== enabled) {
			sakuraActive = enabled;
			window.dispatchEvent(
				new CustomEvent("sakuraToggle", { detail: { enabled } }),
			);
		}
	};
	const loadImage = (source: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.decoding = "async";
			image.alt = "";
			image.onload = () => resolve(image);
			image.onerror = () =>
				reject(new Error(`Season asset unavailable: ${source}`));
			image.src = source;
		});
	const syncWeather = () => {
		weather?.update(
			seasonConfig.seasons[season].weather,
			seasonConfig.weatherEnabled &&
				!reduced.matches &&
				!document.hidden &&
				visible &&
				isSceneVisible() &&
				root.dataset.seasonSceneReady === "true",
		);
	};
	const syncCompanion = () => {
		const unavailable =
			document.body.classList.contains("immersive-reading") ||
			document.hidden ||
			!mascotSource ||
			companionLoadedSeason !== season;
		companionView?.update({
			available: !unavailable && !(visible && isSceneVisible()),
			greeting: seasonConfig.seasons[season].greeting,
		});
	};
	const requestAssets = async () => {
		const definition = seasonConfig.seasons[season];
		const night = root.classList.contains("dark") && !!definition.darkScene;
		const key = `${season}:${mobile.matches ? "mobile" : "desktop"}:${night}`;
		if (!hero || !landscape || !isSceneVisible() || key === pendingKey) return;
		if (key === loadedKey) {
			root.dataset.seasonSceneReady = "true";
			return;
		}
		pendingKey = key;
		const version = ++generation;
		const selected = season;
		const scene = url(
			(night
				? (definition.darkScene ?? definition.scene)
				: definition.scene
			).replace(".webp", mobile.matches ? "-mobile.webp" : ".webp"),
		);
		try {
			const [background, mascot] = await Promise.all([
				loadImage(scene),
				seasonConfig.mascotEnabled
					? loadImage(url(definition.mascot)).catch(() => null)
					: Promise.resolve(null),
			]);
			if (version !== generation) return;
			background.className = "season-landscape-image";
			landscape.replaceChildren(background);
			if (heroMascot) heroMascot.replaceChildren(...(mascot ? [mascot] : []));
			mascotSource = mascot?.src ?? "";
			companionLoadedSeason = selected;
			if (companionCharacter) {
				const image = mascot?.cloneNode(true) as HTMLImageElement | undefined;
				companionCharacter.replaceChildren(...(image ? [image] : []));
			}
			loadedKey = key;
			root.dataset.seasonSceneReady = "true";
			hero.dataset.renderedSeason = selected;
			hero.dataset.night = String(night);
			hero.dataset.sceneCharacter = String(
				definition.sceneIncludesCharacter ?? false,
			);
		} catch {
			if (version !== generation) return;
			// 原有壁纸和横幅文案在 CSS 中自动恢复。
			delete root.dataset.seasonSceneReady;
		} finally {
			if (version === generation) {
				pendingKey = "";
				syncWeather();
				syncCompanion();
			}
		}
	};
	const requestCompanion = async () => {
		if (
			!companion ||
			!companionCharacter ||
			(isSceneVisible() && visible) ||
			companionLoadedSeason === season ||
			companionPendingSeason === season
		)
			return;
		const selected = season;
		companionPendingSeason = selected;
		const version = ++companionRequest;
		try {
			const image = await loadImage(url(seasonConfig.seasons[selected].mascot));
			if (
				version !== companionRequest ||
				selected !== season ||
				(isSceneVisible() && visible)
			)
				return;
			mascotSource = image.src;
			companionLoadedSeason = selected;
			companionCharacter.replaceChildren(image);
		} catch {
			if (version === companionRequest) {
				mascotSource = "";
				companionLoadedSeason = "";
			}
		} finally {
			if (version === companionRequest) companionPendingSeason = "";
			syncCompanion();
		}
	};
	const syncView = () => {
		syncFrame = 0;
		const definition = seasonConfig.seasons[season];
		const next = order[(order.indexOf(season) + 1) % order.length];
		const description = `当前：${definition.name} · ${definition.title}，点击切换至${seasonConfig.seasons[next].name}`;
		const button = document.getElementById("season-switch");
		if (button) {
			button.hidden = false;
			button.setAttribute("aria-label", description);
			button.title = description;
		}
		const tooltip = document.querySelector("[data-season-tooltip]");
		if (tooltip) tooltip.textContent = description;
		const caption = hero?.querySelector("[data-season-caption]");
		if (caption)
			caption.textContent = `${definition.name} · ${definition.title}`;
		document.querySelectorAll("[data-journal-season]").forEach((label) => {
			label.textContent = `${definition.name} · ${definition.title}`;
		});
		const isHome = document.body.classList.contains("journal-home");
		if (calendarHome !== isHome) {
			calendarHome = isHome;
			document
				.querySelectorAll<HTMLDetailsElement>("[data-journal-calendar]")
				.forEach((details) => {
					details.open = !isHome;
				});
		}
		void requestAssets();
		void requestCompanion();
		syncWeather();
		syncCompanion();
		syncSakura();
	};
	const scheduleSync = () => {
		if (!syncFrame) syncFrame = requestAnimationFrame(syncView);
	};
	const selectSeason = (next: Season) => {
		generation++;
		pendingKey = "";
		season = bootstrapSeason(seasonConfig, next);
		savePreference("aiphadeity-season", season);
		const announcement = document.getElementById("season-announcement");
		if (announcement)
			announcement.textContent = `已切换至${seasonConfig.seasons[season].name} · ${seasonConfig.seasons[season].title}`;
		window.dispatchEvent(new Event("seasonchange"));
		syncView();
	};
	document.addEventListener("click", (event) => {
		const target = event.target instanceof Element ? event.target : null;
		if (target?.closest("#season-switch"))
			selectSeason(order[(order.indexOf(season) + 1) % order.length]);
	});
	if (hero) {
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			void requestCompanion();
			syncWeather();
			syncCompanion();
			syncSakura();
		});
		observer.observe(hero);
	}
	new MutationObserver(scheduleSync).observe(root, {
		attributes: true,
		attributeFilter: ["class", "data-wallpaper-mode"],
	});
	new MutationObserver(scheduleSync).observe(document.body, {
		attributes: true,
		attributeFilter: ["class"],
	});
	for (const name of [
		"astro:page-load",
		"swup:contentReplaced",
		"visibilitychange",
	])
		document.addEventListener(name, scheduleSync);
	window.addEventListener("seasonchange", scheduleSync);
	window.addEventListener("sakuraToggle", (event) => {
		const enabled = (event as CustomEvent<{ enabled: boolean }>).detail
			?.enabled;
		if (enabled !== sakuraActive) {
			sakuraActive = undefined;
			scheduleSync();
		}
	});
	mobile.addEventListener("change", scheduleSync);
	reduced.addEventListener("change", scheduleSync);
	window.addEventListener("storage", (event) => {
		if (
			event.key === "aiphadeity-season" ||
			event.key === "hue" ||
			event.key === null
		) {
			season = bootstrapSeason(seasonConfig);
			scheduleSync();
		}
	});
	syncView();
}
