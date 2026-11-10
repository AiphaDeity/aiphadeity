import type { SeasonConfig } from "@/types/seasonConfig";

interface CompanionState {
	available: boolean;
	greeting: string;
}

/** 只管理小槿的展示与交互；季节和素材仍由原四季控制器提供。 */
export function createSeasonCompanion(
	host: HTMLElement,
	options: SeasonConfig["companionOptions"],
	initiallyCollapsed: boolean,
	saveCollapsed: (collapsed: boolean) => void,
): { update(next: CompanionState): void } | null {
	const character = host.querySelector<HTMLButtonElement>(
		"[data-companion-greet]",
	);
	const expanded = host.querySelector<HTMLElement>("[data-companion-expanded]");
	const restore = host.querySelector<HTMLButtonElement>(
		"[data-companion-restore]",
	);
	const message = host.querySelector<HTMLElement>("[data-companion-message]");
	const text = host.querySelector<HTMLElement>("[data-companion-text]");
	if (!character || !expanded || !restore || !message || !text) return null;
	const mobile = matchMedia("(max-width: 767px)");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let state: CompanionState = { available: false, greeting: "" };
	let desktopExpanded = !initiallyCollapsed;
	let mobileExpanded = false;
	let frame = 0;
	let messageTimer = 0;
	let mobileTimer = 0;
	let idleTimer = 0;
	let response: Animation | undefined;
	let fade: Animation | undefined;
	let lastPage = location.pathname + location.search;
	let lastGreeting = "";

	const clearMessage = () => {
		clearTimeout(messageTimer);
		fade?.cancel();
		fade = undefined;
		message.hidden = true;
		character.setAttribute("aria-expanded", "false");
	};
	const dismissMessage = () => {
		clearTimeout(messageTimer);
		if (reduced.matches || message.hidden || host.hidden) {
			clearMessage();
			schedule();
			return;
		}
		fade?.cancel();
		fade = message.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 180,
			easing: "ease-out",
		});
		fade.onfinish = () => {
			clearMessage();
			schedule();
		};
	};
	const collapse = (remember = false) => {
		mobileExpanded = false;
		if (!mobile.matches) desktopExpanded = false;
		if (remember && !mobile.matches) saveCollapsed(true);
		clearTimeout(mobileTimer);
		clearMessage();
		schedule();
	};
	const typing = () =>
		document.activeElement instanceof HTMLElement &&
		document.activeElement.matches(
			"textarea, input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=submit]), [contenteditable=true]",
		);
	const overlaps = (
		a: { x: number; y: number; width: number; height: number },
		b: DOMRect,
	) =>
		a.x < b.right + 8 &&
		a.x + a.width > b.left - 8 &&
		a.y < b.bottom + 8 &&
		a.y + a.height > b.top - 8;
	const idleLater = () => {
		clearTimeout(idleTimer);
		host.dataset.idle = "false";
		if (!host.hidden && !reduced.matches) {
			idleTimer = window.setTimeout(() => {
				if (!host.hidden && !document.hidden && !reduced.matches)
					host.dataset.idle = "true";
			}, options.idleDelay);
		}
	};
	const layout = () => {
		frame = 0;
		if (!state.available || document.hidden || typing()) {
			mobileExpanded = false;
			host.hidden = true;
			host.dataset.idle = "false";
			clearMessage();
			clearTimeout(idleTimer);
			clearTimeout(mobileTimer);
			return;
		}
		const wasHidden = host.hidden;
		host.hidden = false;
		const viewport = window.visualViewport;
		const style = getComputedStyle(host);
		const inset = (side: string) =>
			Number.parseFloat(style.getPropertyValue(`--companion-safe-${side}`)) ||
			0;
		const left = (viewport?.offsetLeft || 0) + inset("left");
		const top = (viewport?.offsetTop || 0) + inset("top");
		const width =
			(viewport?.width || innerWidth) - inset("left") - inset("right");
		const height =
			(viewport?.height || innerHeight) - inset("top") - inset("bottom");
		const gap = 12;
		const content = document
			.querySelector(".content-panel > div")
			?.getBoundingClientRect();
		const obstacles = [
			...document.querySelectorAll<HTMLElement>(
				".floating-controls-container > *, #post-comments, .mobile-pagination, .desktop-pagination, .footer a",
			),
		]
			.filter(
				(element) =>
					element.getClientRects().length &&
					getComputedStyle(element).visibility !== "hidden",
			)
			.map((element) => element.getBoundingClientRect())
			.filter(
				(rect) =>
					rect.width > 0 &&
					rect.height > 0 &&
					rect.bottom > top &&
					rect.top < top + height,
			);
		const requested = mobile.matches ? mobileExpanded : desktopExpanded;
		const characterWidth = mobile.matches ? 105 : 140;
		const characterHeight = mobile.matches ? 135 : 180;
		const leftSpace = content
			? Math.max(0, content.left - left - gap * 2)
			: width;
		const rightSpace = content
			? Math.max(0, left + width - content.right - gap * 2)
			: width;
		// 桌面默认显示立绘，只在访客手动收起时显示花；手机保持主动展开。
		const full = requested;
		host.dataset.compact = String(!full);
		expanded.hidden = !full;
		restore.hidden = full;
		restore.setAttribute("aria-expanded", String(full));
		restore.setAttribute("aria-label", "展开小槿");
		const boxWidth = full ? characterWidth : 44;
		const boxHeight = full ? characterHeight : 44;
		const navbar = document
			.getElementById("navbar-wrapper")
			?.getBoundingClientRect();
		const minTop = Math.max(
			top + gap,
			navbar && navbar.bottom > top ? navbar.bottom + gap : top + gap,
		);
		let placement:
			| { x: number; y: number; side: "left" | "right"; messageWidth: number }
			| undefined;
		const sides: ("left" | "right")[] =
			full && leftSpace < characterWidth && rightSpace >= characterWidth
				? ["right", "left"]
				: ["left", "right"];
		for (const side of sides) {
			const space = side === "left" ? leftSpace : rightSpace;
			const x = side === "left" ? left + gap : left + width - gap - boxWidth;
			const messageWidth =
				full && !mobile.matches
					? Math.min(190, Math.max(characterWidth, space))
					: Math.min(190, width - gap * 2);
			host.style.setProperty("--companion-message-width", `${messageWidth}px`);
			const messageHeight = message.hidden ? 0 : message.offsetHeight + 10;
			const candidates = [
				top + height - gap - boxHeight,
				...obstacles.map((rect) => rect.top - gap - boxHeight),
			];
			for (const y of candidates) {
				if (
					x < left ||
					x + boxWidth > left + width ||
					y - messageHeight < minTop
				)
					continue;
				const box = { x, y, width: boxWidth, height: boxHeight };
				if (obstacles.some((rect) => overlaps(box, rect))) continue;
				placement = { x, y, side, messageWidth };
				break;
			}
			if (placement) break;
		}
		if (!placement) {
			host.hidden = true;
			host.dataset.idle = "false";
			clearMessage();
			clearTimeout(idleTimer);
			clearTimeout(mobileTimer);
			mobileExpanded = false;
			return;
		}
		host.dataset.side = placement.side;
		host.style.left = `${placement.x}px`;
		host.style.top = `${placement.y}px`;
		host.style.setProperty(
			"--companion-message-width",
			`${placement.messageWidth}px`,
		);
		if (expanded.hidden && expanded.contains(document.activeElement))
			restore.focus({ preventScroll: true });
		if (wasHidden) idleLater();
	};
	function schedule() {
		if (!frame) frame = requestAnimationFrame(layout);
	}
	const showMessage = () => {
		clearTimeout(messageTimer);
		fade?.cancel();
		fade = undefined;
		text.textContent = state.greeting;
		message.hidden = false;
		character.setAttribute("aria-expanded", "true");
		messageTimer = window.setTimeout(dismissMessage, options.messageDuration);
		response?.cancel();
		if (!reduced.matches && !expanded.hidden) {
			response = character.animate(
				[
					{ transform: "translateY(0)" },
					{ transform: "translateY(-3px)" },
					{ transform: "translateY(0)" },
				],
				{ duration: 360, easing: "ease-out" },
			);
		}
		idleLater();
		schedule();
	};
	host.addEventListener("click", (event) => {
		const target = event.target instanceof Element ? event.target : null;
		if (target?.closest("[data-companion-restore]")) {
			if (mobile.matches) mobileExpanded = true;
			else desktopExpanded = true;
			if (!mobile.matches) saveCollapsed(false);
			layout();
			showMessage();
			if (!expanded.hidden) character.focus({ preventScroll: true });
			clearTimeout(mobileTimer);
			if (mobile.matches)
				mobileTimer = window.setTimeout(
					() => collapse(),
					options.mobileExpandDuration,
				);
		} else if (target?.closest("[data-companion-greet]")) {
			if (message.hidden) showMessage();
			else dismissMessage();
		} else if (target?.closest("[data-companion-dismiss]")) {
			dismissMessage();
		} else if (target?.closest("[data-companion-collapse]")) collapse(true);
	});
	host.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			event.stopPropagation();
			collapse(true);
		}
	});
	window.addEventListener(
		"scroll",
		() => {
			if (mobile.matches && mobileExpanded) collapse();
			idleLater();
			schedule();
		},
		{ passive: true },
	);
	window.addEventListener("resize", schedule, { passive: true });
	window.visualViewport?.addEventListener("resize", schedule, {
		passive: true,
	});
	window.visualViewport?.addEventListener("scroll", schedule, {
		passive: true,
	});
	document.addEventListener("focusin", () => {
		if (typing()) {
			mobileExpanded = false;
			clearMessage();
			host.hidden = true;
			host.dataset.idle = "false";
			clearTimeout(idleTimer);
			clearTimeout(mobileTimer);
		}
		schedule();
	});
	document.addEventListener("focusout", schedule);
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			host.hidden = true;
			host.dataset.idle = "false";
			mobileExpanded = false;
			response?.cancel();
			clearMessage();
			clearTimeout(idleTimer);
			clearTimeout(mobileTimer);
		}
		schedule();
	});
	for (const event of ["astro:page-load", "swup:page:view"])
		document.addEventListener(event, () => {
			const nextPage = location.pathname + location.search;
			if (nextPage !== lastPage) {
				lastPage = nextPage;
				mobileExpanded = false;
				clearTimeout(mobileTimer);
				clearMessage();
			}
			idleLater();
			schedule();
		});
	mobile.addEventListener("change", () => {
		mobileExpanded = false;
		clearMessage();
		schedule();
	});
	reduced.addEventListener("change", () => {
		response?.cancel();
		if (reduced.matches && fade) clearMessage();
		idleLater();
	});
	const contentPanel = document.querySelector(".content-panel");
	if (contentPanel) new ResizeObserver(schedule).observe(contentPanel);
	return {
		update(next: CompanionState) {
			if (next.greeting !== lastGreeting) {
				clearMessage();
				lastGreeting = next.greeting;
			}
			state = next;
			schedule();
		},
	};
}
