const name = "HindiAnime";
const version = "1.0.0";
const type = "anime";
const lang = "hi"; // Hindi language provider
const baseUrl = "https://www.hindianime.site";

// Helper for standard headers
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": `${baseUrl}/`,
  "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

// Search function to find anime
async function search(query) {
  try {
    // Note: Adjust the search endpoint path based on the site's internal API route or search path
    const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, { headers });
    const data = await response.json();
    
    // Fallback if data is returned as an array or object property
    const results = Array.isArray(data) ? data : (data.results || data.data || []);

    return results.map(item => ({
      id: item.id || item.slug || item.url,
      title: item.title || item.name,
      image: item.poster || item.image || item.cover,
      subOrDub: "Dub" // HindiAnime focuses heavily on Hindi dubs
    }));
  } catch (error) {
    console.error("HindiAnime Search Error:", error);
    return [];
  }
}

// Get anime details and episode lists
async function getDetail(id) {
  try {
    const response = await fetch(`${baseUrl}/api/anime/${id}`, { headers });
    const data = await response.json();

    return {
      id: data.id || id,
      title: data.title,
      description: data.description || data.synopsis,
      image: data.poster || data.image,
      status: data.status || "Ongoing",
      malId: data.mal_id || null,
      tmdbId: data.tmdb_id || null,
      episodes: (data.episodes || []).map((ep, index) => ({
        id: ep.id || ep.episode_id || `${id}/${index + 1}`,
        number: ep.number || index + 1,
        title: ep.title || `Episode ${index + 1}`
      }))
    };
  } catch (error) {
    console.error("HindiAnime Detail Error:", error);
    return { episodes: [] };
  }
}

// Extract direct stream links for an episode
async function getStreams(episodeId) {
  try {
    const response = await fetch(`${baseUrl}/api/watch/${episodeId}`, { headers });
    const data = await response.json();

    // Map video sources returned by the backend (expects .m3u8 or .mp4 streams)
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
    console.error("HindiAnime Stream Error:", error);
    return [];
  }
      }
