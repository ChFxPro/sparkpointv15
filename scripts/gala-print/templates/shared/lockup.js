// Expands every <div class="lk-slot"> into the A World of Connections lockup
// (markup and sunburst copied from the brand kit's master lockup.html).
// Classes on the slot ("light", "no-by2") carry over to the lockup.
// render.mjs inlines this file where a template says {{INCLUDE:shared/lockup.js}}.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mark = '{{PUBLIC}}/assets/brand/sparkmark-256.webp';
  const html = `<svg class="art" viewBox="0 0 200 200" aria-hidden="true"><g class="rays"></g>
    <g class="globe"><circle cx="100" cy="100" r="78"/><ellipse cx="100" cy="100" rx="52" ry="78"/>
    <ellipse cx="100" cy="100" rx="24" ry="78"/><ellipse cx="100" cy="100" rx="78" ry="32"/><path d="M100 22v156M22 100h156"/></g>
    <path class="route" d="M38 62 Q 62 32 100 30"/><path class="route" d="M100 30 Q 138 32 162 62"/><path class="route" d="M100 30 Q 124 16 142 40"/>
    <circle class="node" cx="38" cy="62" r="1.8"/><circle class="node" cx="162" cy="62" r="1.8"/><circle class="node" cx="142" cy="40" r="1.8"/>
    <circle class="home" cx="100" cy="30" r="3.6"/><circle class="node" cx="100" cy="30" r="1.6"/></svg>
    <span class="a" aria-hidden="true">A</span><span class="world" aria-hidden="true">World</span>
    <span class="conn" aria-hidden="true">of Connections</span>
    <span class="rule" aria-hidden="true"><i></i><b></b><img src="${mark}" alt=""><b></b><i></i></span>
    <span class="by" aria-hidden="true">The SparkPoint Gala</span><span class="by2" aria-hidden="true">Live travel auction</span>`;
  for (const slot of document.querySelectorAll('.lk-slot')) {
    const lk = document.createElement('div');
    lk.className = 'lk ' + [...slot.classList].filter((c) => c !== 'lk-slot').join(' ');
    if (slot.id) lk.id = slot.id;
    lk.setAttribute('role', 'img');
    lk.setAttribute('aria-label', 'A World of Connections, the SparkPoint Gala');
    lk.innerHTML = html;
    const g = lk.querySelector('.rays');
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI * (i / 24), r1 = 20, r2 = i % 2 ? 98 : 112, ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', 100 - Math.cos(a) * r1); ln.setAttribute('y1', 132 - Math.sin(a) * r1);
      ln.setAttribute('x2', 100 - Math.cos(a) * r2); ln.setAttribute('y2', 132 - Math.sin(a) * r2);
      g.append(ln);
    }
    slot.replaceWith(lk);
  }
})();
