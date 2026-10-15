const name = "Jaber - Yomi";
const version = "1.0.2";
const type = "anime";
const lang = "en";
const baseUrl = "https://yomi.to";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`
};

async function getMainPage() {
  try {
    const response = await fetch(`${baseUrl}/`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="\/anime\/([^"]+)".*?title="([^"]+)".*?data-src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3],
        subOrDub: "Sub/Dub"
      });
    }

    return [{ title: "Popular Anime", list: results }];
  } catch (error) {
    return [];
  }
}

async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="\/anime\/([^"]+)".*?title="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      results.push({
        id: match[1],
        title: match[2],
        image: match[3],
        subOrDub: "Sub/Dub"
      });
    }

    return results;
  } catch (error) {
    return [];
  }
}

async function getDetail(id) {
  try {
    const response = await fetch(`${baseUrl}/anime/${id}`, { headers });
    const html = await response.text();

    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    const episodes = [];
    const epMatches = [...html.matchAll(/href="\/watch\/([^"]+)"[^>]*>([0-9]+)<\/a>/g)];

    epMatches.forEach((m, idx) => {
      episodes.push({
        id: m[1],
        number: idx + 1,
        title: `Episode ${m[2]}`
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

async function getStreams(episodeId) {
  try {
    const response = await fetch(`${baseUrl}/watch/${episodeId}`, { headers });
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
