import { seasonConfig } from "@/config/seasonConfig";
import { getArticleBrowseView } from "./article-browse-utils";
import { pathsEqual, url } from "./url-utils";

/** 所有非首页共用清爽内页样式；SSR 与 Swup 使用同一判断。 */
export function getSeasonPageKind(
	input: string,
): "article" | "archive" | "page" | null {
	if (!seasonConfig.enabled || !seasonConfig.innerLayout) return null;
	const pathname = new URL(input, "https://season.local").pathname;
	if (pathsEqual(pathname, url("/"))) return null;
	if (getArticleBrowseView(pathname)) return "archive";
	const prefix = url("/posts/");
	return pathname.startsWith(prefix) &&
		pathname.slice(prefix.length).replace(/\//g, "")
		? "article"
		: "page";
}
