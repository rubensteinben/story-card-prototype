/* engine.js — shared card rendering logic */

/* ── escapeHtml ── */
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── widthConfig ── */
const widthConfig = {
  '1u':  { cardWidth: null,    maxWidth: '767px', flexDir: 'column', gap: '12px', textFlex: '1 1 auto', artFlex: '1 1 auto', tileWidth: null, carouselTileWidth: null },
  '10u': { cardWidth: '660px', maxWidth: null,    flexDir: 'row',    gap: '32px', textFlex: '0 0 298px', artFlex: '0 0 298px', tileWidth: 188,  carouselTileWidth: 232 },
  '12u': { cardWidth: '792px', maxWidth: null,    flexDir: 'row',    gap: '32px', textFlex: '0 0 232px', artFlex: '0 0 496px', tileWidth: 232,  carouselTileWidth: 200 },
  '15u': { cardWidth: '990px', maxWidth: null,    flexDir: 'row',    gap: '32px', textFlex: '0 0 298px', artFlex: '0 0 628px', tileWidth: 298,  carouselTileWidth: 232 },
};

/* ── Default card state ── */
const state = {
  headline: 'Lead headline goes here. The ideal length is between 50 and 100 characters.',
  blurb: 'Lead summary text goes here. The summary appears with the lead story only.',
  imageUrl: 'https://picsum.photos/seed/wapo/628/419',
  caption: '(Demetrius Freeman/The Post)',
  width: '15u',
  mobilePresetWidth: 390,
  phoneClip: true,
  leadPlus: 0,
  showPackageLabel: false,
  packageLabelText: 'Label Text',
  showLive: false,
  showKicker: false,
  kickerSection: 'Analysis',
  kickerAuthor: 'Jennifer Rubin',
  showHeadline: true,
  showBlurb: true,
  showTicker: false,
  tickerItems: [
    { time: '2:47 p.m.', text: 'Harris leads Trump by six points in new post-debate poll, according to a Washington Post–ABC News survey...' },
    { time: '2:31 p.m.', text: 'When Biden announced he would not seek reelection, his closest allies scrambled to understand what the decision...' },
    { time: '2:18 p.m.', text: 'Senate Democrats are pushing for an emergency session to address the latest developments...' },
  ],
  aspectRatio: '3/2',
  portrait: false,
  showOverlayButton: false,
  overlayButtonLabel: 'Play Video',
  showOverlayDuration: true,
  supportingHeadlines: ['', '', '', ''],
  supportingUrls: ['', '', '', ''],
  lastImportedSection: null,
  articleUrl: '',
};

const defaultState = JSON.parse(JSON.stringify(state));

/* ── deviceHeights ── */
const deviceHeights = { 320: 568, 375: 812, 390: 844, 430: 932 };

/* ── render() ── */
function render() {
  const cfg = widthConfig[state.width];
  const cardStyle = state.width === '1u'
    ? `width:${state.mobilePresetWidth}px;padding:0 16px`
    : `width:${parseInt(cfg.cardWidth) - 32}px`;

  const sh = (i) => {
    const text = state.supportingHeadlines[i] || 'Supporting headline text goes here lorem ipsum dolor sit amet';
    const url = state.supportingUrls && state.supportingUrls[i];
    return url ? `<a href="${url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">${text}</a>` : text;
  };
  const vDivider = `<div style="flex:0 0 32px;align-self:stretch;position:relative;"><div style="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:1px;background:rgba(0,0,0,0.1)"></div></div>`;
  const t1uCard = (item, borderRadius, isLast) => `
    <div style="flex-shrink:0;padding:16px 20px;border:1px solid rgba(0,0,0,0.1);background:white;border-radius:${borderRadius};${!isLast ? 'margin-right:-1px;' : ''}display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;gap:4px;">
        <div style="width:6px;height:6px;background:#ea0017;border-radius:50%;flex-shrink:0;"></div>
        <p style="font-family:'Source Sans 3',sans-serif;font-weight:400;font-size:12px;line-height:15px;color:#ea0017;white-space:nowrap;">${item.time || '1:00 p.m.'}</p>
      </div>
      <p style="font-family:'Source Sans 3',sans-serif;font-weight:400;font-size:14px;line-height:17.5px;color:#111;width:208px;overflow:hidden;text-overflow:ellipsis;">${item.text || 'Update text goes here'}</p>
    </div>
  `;

  const cardHTML = `
    <div id="card" style="${cardStyle}">
      ${state.showPackageLabel ? `
        <div class="package-label">
          <span class="package-label-text">${state.packageLabelText}</span>
          <span class="package-label-chevron">›</span>
        </div>
      ` : ''}
      <div id="card-inner" style="flex-direction:${cfg.flexDir};gap:${cfg.gap}">
        <div id="text-col" style="flex:${cfg.textFlex}">
          ${state.showKicker ? `<p class="kicker-label">${state.kickerSection}</p>` : ''}
          ${state.showLive ? `<div class="live-label"><span>LIVE</span></div>` : ''}
          ${state.showHeadline ? (importingText ? `<div class="card-skeleton" style="height:26px;margin-bottom:5px;"></div><div class="card-skeleton" style="height:26px;width:68%;"></div>` : `<div class="editable-wrap" data-field="headline"><button class="edit-pencil" title="Edit headline">✎</button>${state.articleUrl ? `<a href="${state.articleUrl}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:block;">` : ''}<p class="headline">${state.headline}</p>${state.articleUrl ? `</a>` : ''}</div>`) : ''}
          ${importingText && state.showBlurb ? `<div style="margin-top:8px;display:flex;flex-direction:column;gap:5px;"><div class="card-skeleton" style="height:15px;"></div><div class="card-skeleton" style="height:15px;"></div><div class="card-skeleton" style="height:15px;width:60%;"></div></div>` : state.showTicker && state.width !== '1u' && state.showBlurb ? `
            <div class="ticker-container">
              <p class="ticker-live-header">LIVE</p>
              <div class="ticker-item">
                <div class="ticker-gutter">
                  <div class="ticker-dot"></div>
                  <div class="ticker-line"></div>
                </div>
                <div class="ticker-content">
                  <p class="ticker-time">${state.tickerItems[0].time || '1:00 p.m.'}</p>
                  <p class="ticker-text">${state.tickerItems[0].text || 'Update text goes here'}</p>
                </div>
              </div>
              <div class="ticker-item">
                <div class="ticker-gutter">
                  <div class="ticker-dot"></div>
                  <div class="ticker-line"></div>
                </div>
                <div class="ticker-content">
                  <p class="ticker-time">${state.tickerItems[1].time || '1:00 p.m.'}</p>
                  <p class="ticker-text">${state.tickerItems[1].text || 'Update text goes here'}</p>
                </div>
              </div>
              <div class="ticker-item">
                <div class="ticker-gutter">
                  <div class="ticker-dot"></div>
                </div>
                <div class="ticker-content ticker-content--last">
                  <p class="ticker-time">${state.tickerItems[2].time || '1:00 p.m.'}</p>
                  <p class="ticker-text">${state.tickerItems[2].text || 'Update text goes here'}</p>
                </div>
              </div>
            </div>
          ` : (!state.showTicker && state.showBlurb ? `<div class="editable-wrap" data-field="blurb"><button class="edit-pencil" title="Edit summary">✎</button><p class="blurb">${state.blurb}</p></div>` : '')}
          ${state.leadPlus >= 1 && state.leadPlus < 3 && (state.width === '12u' || state.width === '15u') ? `
            <hr class="h-rule">
            <p class="supporting-headline">${sh(0)}</p>
          ` : ''}
          ${state.leadPlus === 2 && (state.width === '12u' || state.width === '15u') ? `
            <hr class="h-rule">
            <p class="supporting-headline">${sh(1)}</p>
          ` : ''}
        </div>
        <div id="art-col" style="flex:${cfg.artFlex}">
          <div class="art-wrapper">
            ${state.articleUrl ? `<a href="${state.articleUrl}" target="_blank" rel="noopener" style="display:block;line-height:0;">` : ''}
            ${importingImage ? `<div class="card-skeleton art-image" style="aspect-ratio:${(() => { const [w,h] = state.aspectRatio.split('/'); return state.portrait ? h+'/'+w : w+'/'+h; })()};"></div>` : `<img class="art-image" src="${state.imageUrl}" alt="" onerror="this.onerror=null;this.src='https://picsum.photos/seed/wapo/628/419'" style="aspect-ratio:${(() => { const [w,h] = state.aspectRatio.split('/'); return state.portrait ? h+'/'+w : w+'/'+h; })()};${state.articleUrl ? 'cursor:pointer;' : ''}">`}
            ${state.showOverlayButton ? `
              <div class="art-overlay-btn">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="white" style="flex-shrink:0"><path d="M0 0 L10 6 L0 12 Z"/></svg>
                <span class="overlay-label">${state.overlayButtonLabel}</span>${state.showOverlayDuration ? `<span class="overlay-duration"> 2:12</span>` : ''}
              </div>
            ` : ''}
            ${state.articleUrl ? `</a>` : ''}
          </div>
          <div class="editable-wrap" data-field="caption"><button class="edit-pencil" title="Edit caption">✎</button><p class="caption">${state.caption}</p></div>
        </div>
      </div>
      ${state.showTicker && state.width === '1u' ? `
        <div style="overflow-x:auto;padding-top:16px;">
          <div style="display:flex;">
            ${t1uCard(state.tickerItems[0], '6px 0 0 6px', false)}
            ${t1uCard(state.tickerItems[1], '0', false)}
            ${t1uCard(state.tickerItems[2], '0 6px 6px 0', true)}
          </div>
        </div>
      ` : ''}
      ${state.leadPlus >= 1 && state.width === '1u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(0)}</p>
      ` : ''}
      ${state.leadPlus >= 2 && state.width === '1u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(1)}</p>
      ` : ''}
      ${state.leadPlus === 3 && state.width === '1u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(2)}</p>
      ` : ''}
      ${state.leadPlus >= 4 && state.width === '1u' ? `
        <hr class="h-rule">
        <div style="display:flex;overflow-x:auto;">
          <p class="supporting-headline" style="flex:0 0 ${Math.floor((state.mobilePresetWidth - 32) * 0.75)}px">${sh(2)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:0 0 ${Math.floor((state.mobilePresetWidth - 32) * 0.75)}px">${sh(3)}</p>
        </div>
      ` : ''}
      ${state.leadPlus === 3 && (state.width === '12u' || state.width === '15u') ? `
        <hr class="h-rule">
        <div style="display:flex;align-items:flex-start;">
          <p class="supporting-headline" style="flex:1">${sh(0)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:1">${sh(1)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:1">${sh(2)}</p>
        </div>
      ` : ''}
      ${state.leadPlus === 1 && state.width === '10u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(0)}</p>
      ` : ''}
      ${state.leadPlus === 2 && state.width === '10u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(0)}</p>
        <hr class="h-rule">
        <p class="supporting-headline">${sh(1)}</p>
      ` : ''}
      ${state.leadPlus === 3 && state.width === '10u' ? `
        <hr class="h-rule">
        <p class="supporting-headline">${sh(0)}</p>
        <hr class="h-rule">
        <p class="supporting-headline">${sh(1)}</p>
        <hr class="h-rule">
        <p class="supporting-headline">${sh(2)}</p>
      ` : ''}
      ${state.leadPlus >= 4 && state.width !== '1u' ? `
        <hr class="h-rule">
        <div style="display:flex;overflow-x:auto;align-items:flex-start;">
          <p class="supporting-headline" style="flex:0 0 ${cfg.carouselTileWidth}px">${sh(0)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:0 0 ${cfg.carouselTileWidth}px">${sh(1)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:0 0 ${cfg.carouselTileWidth}px">${sh(2)}</p>
          ${vDivider}
          <p class="supporting-headline" style="flex:0 0 ${cfg.carouselTileWidth}px">${sh(3)}</p>
        </div>
      ` : ''}
    </div>
  `;

  const screenHeight = deviceHeights[state.mobilePresetWidth] || 844;
  (_renderTarget || document.getElementById('card-area')).innerHTML = (state.width === '1u' && !_contentOnly && !_renderTarget) ? `
    <div class="iphone-frame">
      <div class="iphone-screen" style="${state.phoneClip ? `height:${screenHeight}px` : ''}">
        <div class="iphone-island"></div>
        <div class="iphone-statusbar">
          <span class="iphone-statusbar-time">9:41</span>
          <div class="iphone-statusbar-icons">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="#111"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="4.5" width="3" height="7.5" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#111" stroke-linecap="round"><circle cx="8" cy="11.5" r="1" fill="#111" stroke="none"/><path d="M4.8 8.2a4.5 4.5 0 0 1 6.4 0" stroke-width="1.5"/><path d="M1.5 4.8a9 9 0 0 1 13 0" stroke-width="1.5"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.75" y="0.75" width="20.5" height="10.5" rx="3.25" stroke="#111" stroke-width="1.5" stroke-opacity="0.4"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="#111"/><path d="M22.5 4.5v3" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-opacity="0.4"/></svg>
          </div>
        </div>
        <div class="iphone-scroll-area">${cardHTML}</div>
        <div class="iphone-home"></div>
      </div>
    </div>
  ` : cardHTML;

  stateToHash();
  attachInlineEditors();
  _syncCardStateBack();
}

/* ── Weather bar ── */
function forecastToEmoji(text) {
  text = (text || '').toLowerCase();
  if (text.includes('thunder'))                             return '⛈️';
  if (text.includes('blizzard'))                            return '❄️';
  if (text.includes('snow') || text.includes('flurr'))     return '🌨️';
  if (text.includes('sleet') || text.includes('freezing')) return '🌧️';
  if (text.includes('fog') || text.includes('haz'))        return '🌫️';
  if (text.includes('rain') || text.includes('shower') || text.includes('drizzle')) return '🌧️';
  if (text.includes('partly') || text.includes('mostly sunny') || text.includes('partly sunny')) return '⛅';
  if (text.includes('mostly cloudy') || text.includes('overcast') || text.includes('cloudy')) return '☁️';
  if (text.includes('sunny') || text.includes('clear'))    return '☀️';
  return '🌤️';
}

let _weatherCache = null; // { ts, loc, emoji, temp }

async function renderWeatherBar(containerEl) {
  const existing = containerEl.querySelector('#weather-bar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'weather-bar';
  containerEl.appendChild(bar);

  const longDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  // Show date immediately while weather loads
  bar.innerHTML = `<span class="wb-date">${longDate}</span>`;

  // Use cache if fresh (10 min)
  const now = Date.now();
  if (_weatherCache && (now - _weatherCache.ts) < 10 * 60 * 1000) {
    bar.innerHTML = `
      <span class="wb-date">${longDate}</span>
      <span class="wb-sep">·</span>
      <span class="wb-wx">${_weatherCache.emoji} ${_weatherCache.temp}°F in ${escapeHtml(_weatherCache.loc)}</span>`;
    return;
  }

  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
    );
    const { latitude: lat, longitude: lon } = pos.coords;

    // NWS step 1: get grid point + city/state (US government API — no key, great CORS)
    const hdrs = { 'User-Agent': 'Times-of-Reston-prototype/1.0 (benrubenstein@me.com)' };
    const ptRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, { headers: hdrs });
    if (!ptRes.ok) throw new Error('NWS points ' + ptRes.status);
    const ptData = await ptRes.json();

    const forecastUrl = ptData.properties.forecastHourly;
    const city  = ptData.properties.relativeLocation?.properties?.city  || '';
    const state = ptData.properties.relativeLocation?.properties?.state || '';
    const loc   = [city, state].filter(Boolean).join(', ');

    // NWS step 2: get current hourly period
    const fcRes = await fetch(forecastUrl, { headers: hdrs });
    if (!fcRes.ok) throw new Error('NWS forecast ' + fcRes.status);
    const fcData = await fcRes.json();
    const period = fcData.properties.periods[0];

    const temp  = period.temperature; // already °F
    const emoji = forecastToEmoji(period.shortForecast);

    _weatherCache = { ts: now, loc, emoji, temp };

    bar.innerHTML = `
      <span class="wb-date">${longDate}</span>
      <span class="wb-sep">·</span>
      <span class="wb-wx">${emoji} ${temp}°F in ${escapeHtml(loc)}</span>`;

  } catch (e) {
    // Geo denied, outside US, or API error — date only, no broken UI
  }
}
