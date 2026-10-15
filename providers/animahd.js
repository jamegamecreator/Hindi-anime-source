const name = "Jaber - AnimaHD";
const version = "1.0.2";
const type = "anime";
const lang = "hi";
const baseUrl = "https://animahd.com";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`
};

async function getMainPage() {
  try {
    const response = await fetch(`${baseUrl}/`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="https:\/\/animahd\.com\/([^\/"]+)\/".*?title="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3],
        subOrDub: "Multi/Dub"
      });
    }

    return [{ title: "Latest Anime", list: results }];
  } catch (error) {
    return [];
  }
}

async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/?s=${encodeURIComponent(query)}`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="https:\/\/animahd\.com\/([^\/"]+)\/".*?title="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3],
        subOrDub: "Multi/Dub"
      });
    }

    return results;
  } catch (error) {
    return [];
  }
}

async function getDetail(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}/`, { headers });
    const html = await response.text();

    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    const episodes = [];
    const epMatches = [...html.matchAll(/href="([^"]+)"[^>]*class="episode-[^"]*">([^<]+)<\/a>/g)];
    
    epMatches.forEach((m, idx) => {
      episodes.push({
        id: m[1],
        number: idx + 1,
        title: m[2].trim() || `Episode ${idx + 1}`
      });
    });

    return {
      id: id,
      title: titleMatch ? titleMatch[1].trim() : id,
      image: imgMatch ? imgMatch[1] : "",
      episodes: episodes
    };
  } catch (error) {
    return { episodes: [] };
  }
}

async function getStreams(episodeUrl) {
  try {
    const response = await fetch(episodeUrl, { headers });
    const html = await response.text();

    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
    if (!iframeMatch) return [];

    return [
      {
        url: iframeMatch[1],
        quality: "1080p",
        isHls: iframeMatch[1].includes(".m3u8"),
        headers: { "User-Agent": "Mozilla/5.0", "Referer": baseUrl }
      }
    ];
  } catch (error) {
    return [];
  }
  }
