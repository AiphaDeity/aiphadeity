import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// 母版保留原始像素，发布图按设备缩小，不通过放大冒充 4K。
const source = path.resolve("src/assets/seasons");
const destination = path.resolve("public/assets/seasons");
await fs.mkdir(destination, { recursive: true });
const assets = [];
const animeScenes = [
	"spring-anime-v2",
	"summer-anime-v2",
	"autumn-anime-v2",
	"winter-anime-v2",
	"winter-night-anime-v2",
];
for (const season of ["spring", "summer", "autumn", "winter"]) {
	for (const mascot of [false, true]) {
		const name = `${mascot ? "xiaojin-" : ""}${season}`;
		const original = path.join(source, `${name}.png`);
		const metadata = await sharp(original).metadata();
		const output = path.join(destination, `${name}.webp`);
		await sharp(original)
			.resize({ width: mascot ? 640 : 1920, withoutEnlargement: true })
			.webp({ quality: 88, alphaQuality: 100 })
			.toFile(output);
		if (!mascot) {
			await sharp(original)
				.resize({ width: 960, withoutEnlargement: true })
				.webp({ quality: 86 })
				.toFile(path.join(destination, `${name}-mobile.webp`));
		}
		assets.push({
			name,
			original: `src/assets/seasons/${name}.png`,
			width: metadata.width,
			height: metadata.height,
			alpha: metadata.hasAlpha,
			web: `public/assets/seasons/${name}.webp`,
			bytes: (await fs.stat(output)).size,
		});
	}
}
for (const name of ["winter-night", ...animeScenes]) {
	const original = path.join(source, `${name}.png`);
	const metadata = await sharp(original).metadata();
	for (const [suffix, width] of [
		["", 1920],
		["-mobile", 960],
	]) {
		const portrait = path.join(source, `${name}-mobile.png`);
		const input =
			suffix &&
			(await fs.access(portrait).then(
				() => true,
				() => false,
			))
				? portrait
				: original;
		await sharp(input)
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 88 })
			.toFile(path.join(destination, `${name}${suffix}.webp`));
	}
	assets.push({
		name,
		original: `src/assets/seasons/${name}.png`,
		width: metadata.width,
		height: metadata.height,
		alpha: metadata.hasAlpha,
		web: `public/assets/seasons/${name}.webp`,
		bytes: (await fs.stat(path.join(destination, `${name}.webp`))).size,
	});
	if (animeScenes.includes(name)) {
		const portrait = path.join(source, `${name}-mobile.png`);
		const portraitMetadata = await sharp(portrait).metadata();
		assets.push({
			name: `${name}-mobile`,
			original: `src/assets/seasons/${name}-mobile.png`,
			width: portraitMetadata.width,
			height: portraitMetadata.height,
			alpha: portraitMetadata.hasAlpha,
			web: `public/assets/seasons/${name}-mobile.webp`,
			bytes: (await fs.stat(path.join(destination, `${name}-mobile.webp`)))
				.size,
		});
	}
}
await fs.writeFile(
	path.join(source, "provenance.json"),
	`${JSON.stringify(
		{
			generator: "OpenAI built-in imagegen",
			status:
				"First implementation assets; static character layers, not Live2D animations.",
			backgroundPrompt:
				"Text-free delicate anime landscape, quiet open sky at left for website title, clear foreground at right for separate Xiaojin layer. Spring lakeside greenery; summer sheltered cove; autumn misty lakeside porch; winter snow and warm window. No baked-in rain or snow particles.",
			characterPrompt:
				"Original chibi catgirl Xiaojin: silver-white hair, jade-gold eyes, cat ears, curling forelock, small hibiscus clip. Transparent full-body seasonal layers: spring kite, summer straw hat and fan, autumn reading, winter scarf and hot cup. Preserve identity; no text or background.",
			mobile:
				"All four anime v2 seasons, including winter night, have separately generated portrait compositions. Original v1 backgrounds remain as archived alternatives.",
			revisions: [
				"src/assets/seasons/spring-anime-v2.provenance.json",
				"src/assets/seasons/four-seasons-anime-v2.provenance.json",
			],
			assets,
		},
		null,
		2,
	)}\n`,
);
console.log(JSON.stringify(assets, null, 2));
