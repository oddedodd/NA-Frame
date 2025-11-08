import { fetchSheetRows } from "@/lib/googleSheet";
import Carousel from "./CarouselClient";

const FALLBACK_ITEMS = [
  {
    title: "Set up your Google Sheet",
    description:
      "Add rows to your sheet and publish it so this carousel can display them.",
    imageUrl: "",
    linkUrl: "",
    linkLabel: "",
  },
];

export default async function TNTCarouselPage() {
  let items = FALLBACK_ITEMS;

  try {
    const rows = await fetchSheetRows();
    console.log(
      `[TNTCarousel] Loaded ${rows.length} row(s) from Google Sheet.`
    );
    const parsedItems = rows
      .map((row) => mapRowToItem(row))
      .filter((item) => item.title || item.description);

    if (parsedItems.length > 0) {
      items = parsedItems;
    } else {
      console.warn(
        "[TNTCarousel] No rows yielded displayable items. Check column names (title/description/image/link)."
      );
    }
  } catch (error) {
    console.error("Failed to load Google Sheet data:", error);
  }

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-white px-6 py-12 text-black">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          TNT Carousel
        </h1>
        <p className="mt-2 text-base text-zinc-600">
          Swipe through stories sourced from your Google Spreadsheet.
        </p>
      </header>
      <Carousel items={items} />
    </div>
  );
}

function mapRowToItem(row) {
  const get = (key) => {
    const candidates = [
      key,
      key.toLowerCase(),
      key.replace(/\s+/g, "_"),
      key.toLowerCase().replace(/\s+/g, "_"),
      key.replace(/[^\w]+/g, "_"),
      key
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w]+/g, "_"),
    ];

    for (const candidate of candidates) {
      if (candidate in row && row[candidate]) {
        return row[candidate];
      }
    }

    return "";
  };

  return {
    title: get("title") || get("headline"),
    description: get("description") || get("summary") || get("body"),
    imageUrl: get("image") || get("imageurl") || get("image_url"),
    linkUrl: get("link") || get("url") || get("cta_url"),
    linkLabel:
      get("linklabel") || get("cta") || (get("link") || get("url") ? "Read more" : ""),
  };
}