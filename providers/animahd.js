const name = "Jaber";
const version = "1.0.0";
const type = "anime";
const lang = "hi";
const baseUrl = "https://animahd.com";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`,
  "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

async function search(query) {
  try {
    const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, { headers });
    const data = await response.json();
    const results = Array.isArray(data) ? data : (data.results || data.data || []);

    return results.map(item => ({
      id: item.id || item.slug,
      title: item.title || item.name,
      image: item.poster || item.image,
      subOrDub: "Multi/Dub"
    }));
  } catch (error) {
    console.error("Jaber (AnimaHD) Search Error:", error);
    return [];
  }
}

async function getDetail(id) {
  try {
    const response = await fetch(`${baseUrl}/api/anime/${id}`, { headers });
    const data = await response.json();

    return {
      id: data.id || id,
      title: data.title,
      description: data.description || data.synopsis,
      image: data.poster || data.image,
      status: data.status || "Completed",
      malId: data.mal_id || null,
      tmdbId: data.tmdb_id || null,
      episodes: (data.episodes || []).map((ep, index) => ({
        id: ep.id || `${id}/${index + 1}`,
        number: ep.number || index + 1,
        title: ep.title || `Episode ${index + 1}`
      }))
    };
  } catch (error) {
    console.error("Jaber (AnimaHD) Detail Error:", error);
    return { episodes: [] };
  }
}

async function getStreams(episodeId) {
  try {
    const response = await fetch(`${baseUrl}/api/watch/${episodeId}`, { headers });
    const data = await response.json();
    const streams = data.sources || data.streams || [];

    return streams.map(stream => ({
      url: stream.url || stream.file,
      quality: stream.quality || "1080p",
      isHls: (stream.url || stream.file || "").includes(".m3u8"),
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": baseUrl
      }
    }));
  } catch (error) {
    console.error("Jaber (AnimaHD) Stream Error:", error);
    return [];
  }
}
