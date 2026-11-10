import { pathsEqual, url } from "./url-utils";

export function getArticleBrowseView(
	input: string,
): "year" | "category" | "tag" | null {
	const path = new URL(input, "https://browse.local").pathname;
	if (pathsEqual(path, url("/archive/"))) return "year";
	if (pathsEqual(path, url("/categories/"))) return "category";
	if (pathsEqual(path, url("/tags/"))) return "tag";
	return null;
}
