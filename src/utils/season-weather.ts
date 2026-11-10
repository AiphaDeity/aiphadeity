import type { SeasonConfig, SeasonDefinition } from "@/types/seasonConfig";

interface Particle {
	x: number;
	y: number;
	radius: number;
	phase: number;
	speed: number;
}

/** 单一首屏 Canvas：只在可见、允许动态时运行，停止后不保留绘制循环。 */
export function createSeasonWeather(
	canvas: HTMLCanvasElement,
	options: SeasonConfig["weatherOptions"],
): {
	update: (kind: SeasonDefinition["weather"], enabled: boolean) => void;
	destroy: () => void;
} {
	const context = canvas.getContext("2d");
	let frame = 0;
	let lastTime = 0;
	let width = 0;
	let height = 0;
	let kind: SeasonDefinition["weather"] = "none";
	let running = false;
	let particles: Particle[] = [];
	const resize = () => {
		const bounds = canvas.getBoundingClientRect();
		width = bounds.width;
		height = bounds.height;
		const ratio = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		context?.setTransform(ratio, 0, 0, ratio, 0, 0);
		const settings = options[kind === "rain" ? "rain" : "snow"];
		const count = Math.min(
			160,
			Math.max(
				0,
				width < 768 ? settings.mobileDensity : settings.desktopDensity,
			),
		);
		particles = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			radius: 0.6 + Math.random() * 1.3,
			phase: Math.random() * Math.PI * 2,
			speed: 0.7 + Math.random() * 0.6,
		}));
	};
	const draw = (now: number) => {
		if (!running || !context) return;
		frame = requestAnimationFrame(draw);
		if (now - lastTime < 1000 / 30) return;
		const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.08) : 1 / 30;
		lastTime = now;
		context.clearRect(0, 0, width, height);
		const settings = options[kind === "rain" ? "rain" : "snow"];
		for (const particle of particles) {
			particle.y += settings.speed * particle.speed * delta;
			particle.x +=
				(kind === "rain"
					? settings.drift
					: Math.sin(now / 1800 + particle.phase) * settings.drift) * delta;
			if (particle.y > height + 12) {
				particle.y = -12;
				particle.x = Math.random() * width;
			}
			if (particle.x < -12) particle.x = width + 12;
			// 右侧为檐下/角色区域，左上为网页标题，均不绘制天气。
			if (
				particle.x > width * 0.62 ||
				(particle.x < width * 0.42 && particle.y < height * 0.73)
			)
				continue;
			if (kind === "rain") {
				context.strokeStyle = `rgba(89, 118, 137, ${settings.opacity})`;
				context.lineWidth = 0.8;
				context.beginPath();
				context.moveTo(particle.x, particle.y);
				context.lineTo(
					particle.x - 2,
					particle.y + settings.size * particle.speed,
				);
				context.stroke();
			} else {
				context.fillStyle = `rgba(255, 255, 255, ${settings.opacity})`;
				context.beginPath();
				context.arc(
					particle.x,
					particle.y,
					(particle.radius * settings.size) / 1.9,
					0,
					Math.PI * 2,
				);
				context.fill();
			}
		}
	};
	const observer = new ResizeObserver(resize);
	observer.observe(canvas);
	return {
		update(nextKind, enabled) {
			const changed = nextKind !== kind;
			kind = nextKind;
			const nextRunning = enabled && kind !== "none" && !!context;
			if (nextRunning === running && !changed) return;
			running = nextRunning;
			cancelAnimationFrame(frame);
			lastTime = 0;
			if (running) {
				resize();
				frame = requestAnimationFrame(draw);
			} else context?.clearRect(0, 0, width, height);
		},
		destroy() {
			running = false;
			cancelAnimationFrame(frame);
			observer.disconnect();
			context?.clearRect(0, 0, width, height);
		},
	};
}
