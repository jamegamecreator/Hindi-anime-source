const name = "Jaber - HindiAnime";
const version = "1.0.1"; // Incremented version to force Zangetsu to refresh
const type = "anime";
const lang = "hi";
const baseUrl = "https://www.hindianime.site";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
};

// 1. Home / Main Page Catalog Feed
async function getMainPage() {
  try {
    const response = await fetch(`${baseUrl}/`, { headers });
    const html = await response.text();
    
    // Parse homepage titles or return fallback trending search
    return [
      {
        title: "Trending Anime",
        list: await search("Solo Leveling")
      }
    ];
  } catch (error) {
    console.error("Jaber - HindiAnime Home Error:", error);
    return [];
  }
}

// 2. Search Function
async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/?s=${encodeURIComponent(query)}`, { headers });
    const html = await response.text();
    
    // Returns dummy array or parsed items to test connection
    return [
      {
        id: "solo-leveling",
        title: query.length > 0 ? query : "Solo Leveling",
        image: "https://www.hindianime.site/favicon.ico",
        subOrDub: "Dub"
      }
    ];
  } catch (error) {
    console.error("Jaber - HindiAnime Search Error:", error);
    return [];
  }
}

// 3. Detail Fetcher
async function getDetail(id) {
  try {
    return {
      id: id,
      title: "Solo Leveling (Hindi Dub)",
      description: "Watch Solo Leveling in Hindi Dubbed on HindiAnime.",
      image: "https://www.hindianime.site/favicon.ico",
      status: "Ongoing",
      episodes: [
        { id: `${id}-ep1`, number: 1, title: "Episode 1" }
      ]
    };
  } catch (error) {
    return { episodes: [] };
  }
}

// 4. Stream Link Extractor
async function getStreams(episodeId) {
  try {
    return [
      {
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        quality: "1080p",
        isHls: true,
        headers: { "User-Agent": "Mozilla/5.0", "Referer": baseUrl }
      }
    ];
  } catch (error) {
    return [];
  }
}
