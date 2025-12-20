async function searchWikipedia(query) {
  try {
    // 1️⃣ Search Wikipedia
    const searchUrl =
      "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
      encodeURIComponent(query) +
      "&format=json&origin=*";

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query.search.length) return null;

    // 2️⃣ Take top result title
    const title = searchData.query.search[0].title;

    // 3️⃣ Get summary of that page
    const summaryUrl =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(title);

    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    return summaryData.extract || null;
  } catch (e) {
    return null;
  }
}
