// Builds the Gala trip cards from invitation.config.json (window.__INVITE__).
// Shared by template.html (one image) and newsletter.html (one image per trip).
//
// Prices: a trip's price shows only when the config's top-level showPrices is
// true AND the trip has a public `price`. It defaults off (Jeff, 2026-11-10).
// The internal listPrice from trips.json is never read here.
//
// Photos: most trip stills are CC BY or CC BY-SA, so a card with a photo always
// prints its credit (photoCredit, from the trip's stills.json) on the photo.
window.galaTrips = (cfg) => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const showPrices = cfg.showPrices === true;
  const trips = (cfg.trips || []).slice(0, 8);
  const card = (t) => {
    const who = t.travelers === 2 ? 'for two' : t.travelers === 4 ? 'for four' : `for ${t.travelers}`;
    const route = (t.stops || []).map((s) => `<span>${esc(s)}</span>`).join('<i></i>');
    const price = showPrices && t.price ? `<span class="trip-price">${esc(t.price)}</span>` : '';
    return `<article class="trip${t.photo ? ' has-photo' : ''}" id="trip-${esc(t.id)}">` +
      (t.photo ? `<figure class="trip-photo"><img src="${esc(t.photo)}" alt="" />` +
        `<figcaption><span>${esc(t.photoPlace || '')}</span>${t.photoCredit ? `<small>Photo: ${esc(t.photoCredit)}</small>` : ''}</figcaption></figure>` : '') +
      `<div><p class="trip-top">Connection ${esc(t.connection)}<span>${t.nights} nights · ${who}</span></p>` +
      `<p class="trip-name">${esc(t.name)}</p><p class="trip-title">${esc(t.title)}</p>` +
      (route && !(t.stops.length === 1 && t.stops[0] === t.name) ? `<p class="trip-route">${route}</p>` : '') +
      `<p class="trip-sum">${esc(t.summary)}</p>` +
      `<p class="trip-foot">${price}<span class="trip-more">See the trip &rarr;</span></p></div></article>`;
  };
  return { trips, card };
};
