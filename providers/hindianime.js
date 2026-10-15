const name = "Jaber - HindiAnime";
const version = "1.0.2";
const type = "anime";
const lang = "hi";
const baseUrl = "https://www.hindianime.site";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`
};

async function getMainPage() {
  try {
    const response = await fetch(`${baseUrl}/`, { headers });
    const html = await response.text();
    const results = [];
    
    // Scrape homepage titles
    const matches = [...html.matchAll(/<a href="\/anime\/([^"]+)".*?title="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3].startsWith("http") ? match[3] : `${baseUrl}${match[3]}`,
        subOrDub: "Hindi Dub"
      });
    }

    return [{ title: "Trending Hindi Dubbed", list: results }];
  } catch (error) {
    console.error("HindiAnime MainPage Error:", error);
    return [];
  }
}

async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/?s=${encodeURIComponent(query)}`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="\/anime\/([^"]+)".*?title="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3].startsWith("http") ? match[3] : `${baseUrl}${match[3]}`,
        subOrDub: "Hindi Dub"
      });
    }

    return results;
  } catch (error) {
    console.error("HindiAnime Search Error:", error);
    return [];
  }
}

async function getDetail(id) {
  try {
    const response = await fetch(`${baseUrl}/anime/${id}`, { headers });
    const html = await response.text();

    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    const episodes = [];
    const epMatches = [...html.matchAll(/href="\/watch\/([^"]+)"[^>]*>(Episode \d+|\d+)<\/a>/g)];
    
    epMatches.forEach((m, idx) => {
      episodes.push({
        id: m[1],
        number: idx + 1,
        title: m[2] || `Episode ${idx + 1}`
      });
    });

    return {
      id: id,
      title: titleMatch ? titleMatch[1].trim() : id,
      description: descMatch ? descMatch[1] : "",
      image: imgMatch ? imgMatch[1] : "",
      status: "Completed",
      episodes: episodes
    };
  } catch (error) {
    console.error("HindiAnime Detail Error:", error);
    return { episodes: [] };
  }
}

async function getStreams(episodeId) {
  try {
    const response = await fetch(`${baseUrl}/watch/${episodeId}`, { headers });
    const html = await response.text();

    // Extract iframe video embed URL
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
    if (!iframeMatch) return [];

    const embedUrl = iframeMatch[1].startsWith("//") ? `https:${iframeMatch[1]}` : iframeMatch[1];
    
    return [
      {
        url: embedUrl,
        quality: "1080p",
        isHls: embedUrl.includes(".m3u8"),
        headers: { "User-Agent": "Mozilla/5.0", "Referer": baseUrl }
      }
    ];
  } catch (error) {
    console.error("HindiAnime Stream Error:", error);
    return [];
  }
  }
