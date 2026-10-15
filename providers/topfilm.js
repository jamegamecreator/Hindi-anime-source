const name = "Jaber - TopFilm";
const version = "1.0.2";
const type = "movie";
const lang = "en";
const baseUrl = "https://topfilm.pro";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`
};

async function getMainPage() {
  try {
    const response = await fetch(`${baseUrl}/`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="\/([^\/"]+)\/".*?alt="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      if (match[1] !== "category" && match[1] !== "tag") {
        results.push({
          id: match[1],
          title: match[2],
          image: match[3],
          subOrDub: "HD"
        });
      }
    }

    return [{ title: "Latest Movies", list: results }];
  } catch (error) {
    return [];
  }
}

async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/?s=${encodeURIComponent(query)}`, { headers });
    const html = await response.text();
    const results = [];

    const matches = [...html.matchAll(/<a href="\/([^\/"]+)\/".*?alt="([^"]+)".*?src="([^"]+)"/g)];
    for (const match of matches) {
      if (match[1] !== "category" && match[1] !== "tag") {
        results.push({
          id: match[1],
          title: match[2],
          image: match[3],
          subOrDub: "HD"
        });
      }
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

    return {
      id: id,
      title: titleMatch ? titleMatch[1].trim() : id,
      image: imgMatch ? imgMatch[1] : "",
      episodes: [{ id: id, number: 1, title: "Full Movie" }]
    };
  } catch (error) {
    return { episodes: [] };
  }
}

async function getStreams(movieId) {
  try {
    const response = await fetch(`${baseUrl}/${movieId}/`, { headers });
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
