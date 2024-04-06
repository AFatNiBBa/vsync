
import "@seanalunni/style/fix";

import { getAnimeWorldVideoUrl } from "./api/animeworld";
import { createEpExp } from "@seanalunni/epexp";

export default function() {
	Object.assign(globalThis, { createEpExp, getAnimeWorldVideoUrl });
	return <>1</>
}