// Beamer animations for the projection around the TV. Each variant draws one frame into a canvas (320 wide, any height)
// and keeps `mask` (canvas pixels: the TV on the wall) black so the projector doesn't light the TV itself. Black is no
// light, so everything is drawn on black. VARIANTS lists them; make(canvas, mask) returns frame(now).
const PAL = { R: '#e83b3b', S: '#f5c08a', B: '#3b6cf0', K: '#111', G: '#5ad15a', W: '#fff', Y: '#ffd23f', O: '#e09a20', D: '#a0521c' }

const SPR = {
  invA: ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'],
  invB: ['..X.....X..', 'X..X...X..X', 'X.XXXXXXX.X', 'XXX.XXX.XXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..X.....X..', '.X.......X.'],
  heroA: ['...RRRR.', '..RRRRRR', '..SSKSK.', '..SSSSSS', '...SSSS.', '..RBBBR.', '.S.BBB.S', '...BBB..', '..B...B.', '.KK...KK'],
  heroB: ['...RRRR.', '..RRRRRR', '..SSKSK.', '..SSSSSS', '...SSSS.', '..RBBBR.', '.S.BBB.S', '...BBB..', '...B.B..', '..KK.KK.'],
  slimeA: ['...GG...', '..GGGG..', '.GGGGGG.', 'GGWGGWGG', 'GGKGGKGG', 'GGGGGGGG', '.GGGGGG.'],
  slimeB: ['..GGGG..', '.GGGGGG.', 'GGWGGWGG', 'GGKGGKGG', 'GGGGGGGG', 'GGGGGGGG'],
  ghostA: ['..XXXX..', '.XXXXXX.', 'XWWXXWWX', 'XWBXXWBX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XX.XX.XX'],
  ghostB: ['..XXXX..', '.XXXXXX.', 'XWWXXWWX', 'XWBXXWBX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'X.X..X.X'],
  chompOpen: ['..YYYY..', '.YYYKYY.', 'YYYYY...', 'YYYY....', 'YYYY....', 'YYYYY...', '.YYYYYY.', '..YYYY..'],
  chompShut: ['..YYYY..', '.YYYKYY.', 'YYYYYYYY', 'YYYYYYYY', 'YYYYYYYY', 'YYYYYYYY', '.YYYYYY.', '..YYYY..'],
  coin: [
    ['.YYYY.', 'YYWYYY', 'YWYYOY', 'YWYYOY', 'YWYYOY', 'YWYYOY', 'YYYYOY', '.YYYY.'],
    ['.YY.', 'YWYY', 'YWOY', 'YWOY', 'YWOY', 'YWOY', 'YYOY', '.YY.'],
    ['YY', 'YW', 'YW', 'YW', 'YW', 'YW', 'YY', 'YY'],
  ],
}

const FONT = {
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001',
  5: '111100111001111', 6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111',
  I: '111010010010111', N: '110101101101101', S: '111100111001111', E: '111100110100111', R: '110101110101101',
  T: '111010010010010', C: '111100100100111', O: '111101101101111', H: '101101111101101', U: '101101101101111',
  P: '111101111100100', A: '010101111101101', B: '110101110101110', D: '110101101101110', F: '111100110100100',
  G: '111100101101111', K: '101101110101101', L: '100100100100111', M: '101111111101101', V: '101101101101010',
  W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111', '+': '000010111010000',
  '?': '111001011000010', '-': '000000111000000',
}

// Arcade (from retro-tv-loop.html): invaders on top, chomper and ghosts through the middle, hero and slime on a brick strip.
export function retroLoop(canvas, mask) {
  const g = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height, MID = Math.round(H * 0.44)

  function draw(rows, x0, y0, tint) {
    x0 = Math.round(x0); y0 = Math.round(y0)
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < rows[j].length; i++) {
        const ch = rows[j][i]
        if (ch === '.') continue
        g.fillStyle = ch === 'X' ? tint : PAL[ch]
        g.fillRect(x0 + i, y0 + j, 1, 1)
      }
    }
  }

  function text(str, x0, y0, color) {
    g.fillStyle = color
    ;[...str].forEach((ch, k) => {
      const glyph = FONT[ch]
      if (!glyph) return
      for (let p = 0; p < 15; p++) {
        if (glyph[p] === '1') g.fillRect(x0 + k * 4 + (p % 3), y0 + Math.floor(p / 3), 1, 1)
      }
    })
  }

  const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 3 + Math.random() * 14, b: Math.random() }))

  function frame(now) {
    const t = now / 1000
    g.fillStyle = '#000'
    g.fillRect(0, 0, W, H)

    for (const s of stars) {
      g.fillStyle = `rgba(255,255,255,${0.2 + 0.6 * s.b * (0.6 + 0.4 * Math.sin(t * 3 + s.x))})`
      g.fillRect(Math.round((((s.x - t * s.v) % W) + W) % W), Math.round(s.y), 1, 1)
    }

    const step = Math.floor(t / 0.5)
    const k = step % 16
    const march = k < 8 ? k * 2 : (16 - k) * 2
    for (let i = 0; i < 16; i++) {
      draw(step % 2 ? SPR.invB : SPR.invA, -8 + i * 20 + march, 12, '#7cfc5a')
      draw(step % 2 ? SPR.invA : SPR.invB, -8 + i * 20 + march, 24, '#4fe0ff')
    }

    const lap = Math.floor((t * 40) / 420)
    const chompX = ((t * 40) % 420) - 40
    const fleeing = lap % 2 === 1
    let eaten = 0
    g.fillStyle = '#ffd9a0'
    for (let dx = 4; dx < W; dx += 8) {
      if (dx < chompX + 4) { eaten++; continue }
      g.fillRect(dx, MID + 3, 2, 2)
    }
    draw(Math.floor(t * 7) % 2 ? SPR.chompOpen : SPR.chompShut, chompX, MID)
    const ghostColors = ['#ff6fb5', '#4fe0ff', '#ffa53b']
    ghostColors.forEach((color, i) => {
      const gx = fleeing ? chompX + 16 + i * 12 : chompX - 18 - i * 12
      const tint = fleeing ? (Math.floor(t * 4) % 2 ? '#2b3bff' : '#fff') : color
      draw(Math.floor(t * 5 + i) % 2 ? SPR.ghostA : SPR.ghostB, gx, MID - 1, tint)
    })

    g.fillStyle = PAL.D
    g.fillRect(0, H - 12, W, 12)
    g.fillStyle = '#5a2a0a'
    g.fillRect(0, H - 6, W, 1)
    for (let bx = 0; bx < W; bx += 8) {
      g.fillRect(bx, H - 12, 1, 6)
      g.fillRect(bx + 4, H - 5, 1, 5)
    }
    g.fillStyle = PAL.G
    g.fillRect(0, H - 13, W, 1)

    const heroX = ((t * 25) % 380) - 20
    const slimeX = 340 - ((t * 18) % 400)
    const gap = slimeX - heroX
    const jumping = gap > -10 && gap < 18
    const heroY = H - 22 - (jumping ? Math.sin(Math.PI * (18 - gap) / 28) * 16 : 0)
    draw(jumping || Math.floor(t * 7) % 2 ? SPR.heroA : SPR.heroB, heroX, heroY)
    if (Math.floor(t * 3) % 2) draw(SPR.slimeA, slimeX, H - 19)
    else draw(SPR.slimeB, slimeX, H - 18)

    ;[[24, H - 32], [40, H - 36], [W - 48, H - 36], [W - 32, H - 32]].forEach(([cx, cy], i) => {
      const f = [0, 1, 2, 1][Math.floor(t * 8 + i) % 4]
      draw(SPR.coin[f], cx + f, cy + Math.sin(t * 2 + i) * 2)
    })

    const score = String(4200 + lap * 400 + eaten * 10).padStart(6, '0')
    text('1UP', 4, 3, '#e83b3b')
    text(score, 20, 3, '#fff')
    text('HI', W - 37, 3, '#e83b3b')
    text('050000', W - 27, 3, '#fff')

    g.fillStyle = '#000'
    g.fillRect(mask.x, mask.y, mask.w, mask.h)
    if (Math.floor(t * 1.5) % 2) text('INSERT COIN', Math.round(mask.x + mask.w / 2 - 21), mask.y + mask.h + 13 <= H - 13 ? mask.y + mask.h + 8 : mask.y - 8, '#ffd23f')
  }
  return frame
}

// ---- Shared helpers for the variants ----
function kit(canvas, M) {
  const g = canvas.getContext('2d'), W = canvas.width, H = canvas.height
  const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h) }
  const sprite = (rows, x0, y0, tint, scale = 1) => {
    x0 = Math.round(x0); y0 = Math.round(y0)
    rows.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch !== '.') rect(x0 + i * scale, y0 + j * scale, scale, scale, ch === 'X' ? tint : PAL[ch])
    }))
  }
  const text = (str, x0, y0, color, scale = 1) => [...str].forEach((ch, k) => {
    const glyph = FONT[ch]
    if (glyph) for (let p = 0; p < 15; p++) if (glyph[p] === '1') rect(x0 + (k * 4 + p % 3) * scale, y0 + Math.floor(p / 3) * scale, scale, scale, color)
  })
  const textW = (str, scale = 1) => (str.length * 4 - 1) * scale
  const clear = () => rect(0, 0, W, H, '#000')
  const hideTV = () => rect(M.x - 1, M.y - 1, M.w + 2, M.h + 2, '#000')
  return { g, W, H, rect, sprite, text, textW, clear, hideTV }
}
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
const mix = (a, b, f) => { const [p, q] = [hex(a), hex(b)]; return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * f)).join(',')})` }

// Synthwave: a striped sun rising behind the TV (glowing out over its top and sides), neon mountains and a scrolling
// perspective grid on both sides, stars and the odd shooting star.
function synthwave(canvas, M) {
  const { g, W, H, rect, clear, hideTV } = kit(canvas, M)
  const hz = Math.round(M.y + M.h * 0.62), cx = M.x + M.w / 2, R = Math.max(M.w * 0.62, hz - M.y + 22)
  const r = rng(11), stars = Array.from({ length: 80 }, () => ({ x: r() * W, y: r() * (hz - 4), b: r() }))
  const ridge = (x0, x1, amp, seed) => { const q = rng(seed), pts = []; for (let x = x0; x <= x1 + 8; x += 8) pts.push(6 + amp * (0.5 + 0.5 * Math.sin(x * 0.045 + seed)) * (0.55 + 0.45 * q())); return { x0, pts } }
  const ridges = [ridge(0, M.x + 6, 30, 3), ridge(M.x + M.w - 6, W, 30, 5)]
  const ridgeY = ({ x0, pts }, x) => { const f = (x - x0) / 8, i = Math.floor(f), a = pts[i] ?? 0, b = pts[i + 1] ?? a; return hz - (a + (b - a) * (f - i)) }
  return now => {
    const t = now / 1000
    clear()
    for (const s of stars) rect(s.x, s.y, 1, 1, `rgba(255,255,255,${0.15 + 0.6 * s.b * (0.5 + 0.5 * Math.sin(t * 2 + s.x))})`)
    const shoot = (t % 5.5) / 0.6                                          // a shooting star every 5.5 s
    if (shoot < 1) { const sx = 20 + (Math.floor(t / 5.5) * 97) % (W - 80), sy = 6 + (Math.floor(t / 5.5) * 31) % 30
      for (let k = 0; k < 14; k++) rect(sx + shoot * 60 - k * 2, sy + shoot * 18 - k * 0.6, 1, 1, `rgba(255,255,255,${1 - k / 14})`) }
    for (let y = Math.ceil(hz - R); y < hz; y++) {                           // the sun, slits scrolling down in its lower half
      const dy = hz - y, half = Math.sqrt(R * R - dy * dy), f = 1 - dy / R
      if (f > 0.42 && (y + t * 5) % 9 < 1 + f * 5) continue
      g.fillStyle = mix('#ffe45c', '#ff2e88', Math.min(1, f * 1.15))
      g.fillRect(Math.round(cx - half), y, Math.round(half * 2), 1)
    }
    for (const rd of ridges) for (let x = Math.max(0, rd.x0); x < Math.min(W, rd.x0 + (rd.pts.length - 1) * 8); x++) {
      const y = Math.round(ridgeY(rd, x)), y2 = Math.round(ridgeY(rd, x + 1))
      for (let yy = y; yy < hz; yy++) rect(x, yy, 1, 1, mix('#2a0b4a', '#06020c', (yy - y) / Math.max(1, hz - y)))
      rect(x, Math.min(y, y2), 1, Math.abs(y2 - y) + 1, '#38f2ff')               // continuous neon ridge line
    }
    for (let y = hz; y < H; y++) rect(0, y, W, 1, '#000')
    rect(0, hz, W, 1, '#ff2bd6')                                           // horizon
    const ph = (t * 0.9) % 1
    for (let k = 0; k < 9; k++) {                                          // grid: horizontal lines rushing towards you
      const z = (k + ph) / 9, y = Math.round(hz + (H - hz) * z * z)
      rect(0, y, W, 1, mix('#5a0b6e', '#ff2bd6', z))
    }
    for (let i = -14; i <= 14; i++) {                                      // grid: lines from the vanishing point
      const xb = cx + i * 30, n = Math.ceil(Math.max(Math.abs(xb - cx), H - hz))
      for (let k = 1; k <= n; k++) { const f = k / n; rect(cx + (xb - cx) * f, hz + (H - hz) * f, 1, 1, mix('#5a0b6e', '#ff2bd6', f)) }
    }
    hideTV()
  }
}

// Tetris: two wells beside the TV that play themselves (a little AI picks the spot), clear lines with a flash and
// start over when they top out; the title and line count above the TV.
const TETRO = {
  I: { c: '#38e8ff', s: [[0, 1], [1, 1], [2, 1], [3, 1]] }, O: { c: '#ffd93b', s: [[1, 0], [2, 0], [1, 1], [2, 1]] },
  T: { c: '#b56cff', s: [[1, 0], [0, 1], [1, 1], [2, 1]] }, S: { c: '#5ad15a', s: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { c: '#ff4a4a', s: [[0, 0], [1, 0], [1, 1], [2, 1]] }, J: { c: '#3b6cf0', s: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  L: { c: '#ff9a2e', s: [[2, 0], [0, 1], [1, 1], [2, 1]] },
}
function tetris(canvas, M, opts = {}) {
  const { W, H, rect, text, textW, clear, hideTV } = kit(canvas, M)
  const S = 6, C = Math.max(4, Math.floor((M.x - 10) / S)), Rows = Math.floor((H - (opts.top ?? 8)) / S)
  let lines = 0
  const rot = (cells, n) => { let s = cells; for (let k = 0; k < n; k++) s = s.map(([x, y]) => [-y, x]); const mx = Math.min(...s.map(p => p[0])), my = Math.min(...s.map(p => p[1])); return s.map(([x, y]) => [x - mx, y - my]) }
  const well = (x0, seed) => {
    const r = rng(seed), grid = Array.from({ length: Rows }, () => Array(C).fill(null))
    const fits = (cells, px, py) => cells.every(([x, y]) => x + px >= 0 && x + px < C && y + py < Rows && (y + py < 0 || !grid[y + py][x + px]))
    const w = { x0, grid, piece: null, flash: null, over: 0, clock: 0 }
    w.spawn = () => {
      const k = 'IOTSZJL'[Math.floor(r() * 7)], best = { score: -1e9 }
      for (let n = 0; n < 4; n++) { const cells = rot(TETRO[k].s, n), width = Math.max(...cells.map(p => p[0])) + 1
        for (let px = 0; px + width <= C; px++) {
          let py = -2; while (fits(cells, px, py + 1)) py++
          if (!fits(cells, px, py)) continue
          const g2 = grid.map(row => row.slice()); cells.forEach(([x, y]) => { if (y + py >= 0) g2[y + py][x + px] = 1 })
          const full = g2.filter(row => row.every(Boolean)).length
          let holes = 0, height = 0, bump = 0, last = null                 // classic heuristic: lines, holes, height, bumpiness
          for (let x = 0; x < C; x++) { let h = 0
            for (let y = 0; y < Rows; y++) { if (g2[y][x]) { if (!h) h = Rows - y } else if (h) holes++ }
            height += h; if (last !== null) bump += Math.abs(h - last); last = h }
          const score = full * 3.4 - holes * 3.6 - height * 0.51 - bump * 0.6 + r() * 0.3
          if (score > best.score) Object.assign(best, { score, cells, px })
        } }
      if (!best.cells) { w.over = 1; return }
      w.piece = { k, cells: best.cells, x: Math.floor((C - 3) / 2), tx: best.px, y: -2 }
      if (!fits(w.piece.cells, w.piece.x, 0) && !fits(w.piece.cells, w.piece.tx, 0)) w.over = 1
    }
    w.step = () => {
      if (w.over) { w.over++; if (w.over > Rows + 6) { grid.forEach(row => row.fill(null)); w.over = 0 } return }
      if (w.flash) { w.flash.t--; if (!w.flash.t) { for (const y of w.flash.rows) { grid.splice(y, 1); grid.unshift(Array(C).fill(null)) } lines += w.flash.rows.length; opts.onScore?.(w.flash.rows.length * 100); w.flash = null } return }
      if (!w.piece) return w.spawn()
      const p = w.piece
      if (p.x !== p.tx && fits(p.cells, p.x + Math.sign(p.tx - p.x), p.y)) p.x += Math.sign(p.tx - p.x)
      if (fits(p.cells, p.x, p.y + 1)) { p.y++; return }
      p.cells.forEach(([x, y]) => { if (y + p.y >= 0) grid[y + p.y][x + p.x] = TETRO[p.k].c })
      w.piece = null
      const rows = grid.map((row, y) => row.every(Boolean) ? y : -1).filter(y => y >= 0)
      if (rows.length) w.flash = { rows, t: 5 }
    }
    return w
  }
  const wells = [well(Math.floor((M.x - C * S) / 2), 21), well(M.x + M.w + Math.floor((W - M.x - M.w - C * S) / 2), 42)]
  const y0 = H - 2 - Rows * S
  const cell = (x, y, c, bright = 1) => {
    rect(x, y, S - 1, S - 1, c); rect(x, y, S - 1, 1, mix(c.startsWith('#') ? c : '#ffffff', '#ffffff', 0.5)); rect(x, y + S - 2, S - 1, 1, 'rgba(0,0,0,0.35)')
  }
  let last = 0
  return now => {
    while (now - last > 70) { last = last ? last + 70 : now; wells.forEach(w => w.step()) }
    clear()
    for (const w of wells) {
      rect(w.x0 - 2, y0 - 1, 1, Rows * S + 2, '#2b2f5a'); rect(w.x0 + C * S + 1, y0 - 1, 1, Rows * S + 2, '#2b2f5a'); rect(w.x0 - 2, y0 + Rows * S + 1, C * S + 4, 1, '#2b2f5a')
      w.grid.forEach((row, y) => row.forEach((c, x) => {
        if (!c) return
        const flash = w.flash?.rows.includes(y) && w.flash.t % 2, gone = w.over && Rows - y <= w.over
        cell(w.x0 + x * S, y0 + y * S, flash ? '#ffffff' : gone ? '#555566' : c)
      }))
      if (w.piece) w.piece.cells.forEach(([x, y]) => { if (y + w.piece.y >= 0) cell(w.x0 + (x + w.piece.x) * S, y0 + (y + w.piece.y) * S, TETRO[w.piece.k].c) })
    }
    const cx = M.x + M.w / 2, top = Math.max(2, M.y - 26)
    text('TETRIS', Math.round(cx - textW('TETRIS', 2) / 2), top, '#ff4a4a', 2)
    const l = `LINES ${String(lines).padStart(3, '0')}`
    text(l, Math.round(cx - textW(l) / 2), top + 14, '#ffffff')
    hideTV()
  }
}

// Pac-maze: a neon maze corridor runs all the way round the TV; the chomper eats the dots, grabs a power pellet in a
// corner and turns the ghosts; extra maze blocks fill the sides.
function pacmaze(canvas, M, opts = {}) {
  const { W, H, rect, sprite, text, textW, clear, hideTV } = kit(canvas, M)
  const L = M.x - 9, Rr = M.x + M.w + 8, T = Math.max(14, M.y - 9), B = Math.min(H - 7, M.y + M.h + 7)
  const sides = [[L, T, Rr, T], [Rr, T, Rr, B], [Rr, B, L, B], [L, B, L, T]]
  const lens = sides.map(([a, b, c, d]) => Math.abs(c - a) + Math.abs(d - b)), P = lens.reduce((a, b) => a + b)
  const at = s => { s = ((s % P) + P) % P; for (let i = 0; i < 4; i++) { if (s <= lens[i]) { const [a, b, c, d] = sides[i], f = s / lens[i]; return [a + (c - a) * f, b + (d - b) * f, i] } s -= lens[i] } return [L, T, 0] }
  const corners = [0, lens[0], lens[0] + lens[1], lens[0] + lens[1] + lens[2]]
  const outline = (x0, y0, x1, y1, c) => { rect(x0 + 1, y0, x1 - x0 - 1, 1, c); rect(x0 + 1, y1, x1 - x0 - 1, 1, c); rect(x0, y0 + 1, 1, y1 - y0 - 1, c); rect(x1, y0 + 1, 1, y1 - y0 - 1, c) }
  const wall = (x0, y0, x1, y1) => { outline(x0, y0, x1, y1, '#2a3cff'); outline(x0 + 2, y0 + 2, x1 - 2, y1 - 2, '#1a1f9a') }
  const blocks = []                                                         // decorative maze blocks on the sides and top
  for (const [xa, xb] of [[4, L - 9], [Rr + 9, W - 5]]) if (xb - xa > 16)
    for (let y = T - 2; y + 14 < B; y += 22) blocks.push([xa, y, xb, y + 12])
  if (T - 9 > 22) blocks.push([L - 5, 14, M.x + M.w / 2 - 14, T - 9], [M.x + M.w / 2 + 14, 14, Rr + 5, T - 9])
  // Ghosts chase the chomper round the ring; a power pellet turns it around to hunt them, eaten ones come back later.
  const ghosts = ['#ff4a4a', '#ffb8ff', '#38e8ff', '#ffb852'].map((c, i) => ({ c, s: -30 - i * 14, gone: 0 }))
  const dots = []; for (let s = 3; s < P; s += 6) if (corners.every(c => Math.abs(s - c) > 4)) dots.push(s)
  let pac = 0, dir = 1, scare = 0, score = 0, eaten = new Set(), pellets = new Set(), prev = 0, popups = [], reset = 0
  const add = n => { score += n; opts.onScore?.(n) }
  const near = (a, b, d) => Math.abs((((a - b) % P) + P + P / 2) % P - P / 2) < d
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    pac += dir * (scare ? 44 : 34) * dt
    dots.forEach((s, i) => { if (near(pac, s, 2)) { if (!eaten.has(i)) add(10); eaten.add(i) } })
    corners.forEach((c, i) => { if (!pellets.has(i) && near(pac, c, 2)) { pellets.add(i); scare = 5; dir = -1; add(50) } })
    if (scare && (scare -= dt) <= 0) { scare = 0; dir = 1 }
    if (eaten.size === dots.length && !reset) reset = 1.5
    if (reset && (reset -= dt) <= 0) { reset = 0; eaten = new Set(); pellets = new Set() }
    for (const gh of ghosts) {
      if (gh.gone > 0) { if ((gh.gone -= dt) <= 0) gh.s = pac - 90; continue }
      gh.s += (scare ? -14 : 33) * dt
      if (!scare && gh.s > pac - 10) gh.s = pac - 10                       // tailing, never quite catching it
      if (scare && near(gh.s, pac, 5)) { gh.gone = 4; add(200); const [x, y] = at(gh.s); popups.push({ x, y, t: 1 }) }
    }
    clear()
    wall(L - 5, T - 5, Rr + 5, B + 5); wall(L + 5, T + 5, Rr - 5, B - 5)
    for (const b of blocks) wall(...b)
    dots.forEach((s, i) => { if (!eaten.has(i)) { const [x, y] = at(s); rect(x, y, 1, 1, '#ffcfa8') } })
    corners.forEach((c, i) => { if (!pellets.has(i) && Math.floor(t * 3) % 2) { const [x, y] = at(c); rect(x - 1, y - 1, 3, 3, '#ffcfa8') } })
    for (const gh of ghosts) if (gh.gone <= 0) { const [x, y] = at(gh.s)
      sprite(Math.floor(t * 6) % 2 ? SPR.ghostA : SPR.ghostB, x - 4, y - 4, scare ? (scare < 1.2 && Math.floor(t * 8) % 2 ? '#ffffff' : '#2b3bff') : gh.c) }
    const [px, py, side] = at(pac), open = Math.abs(Math.sin(t * 12)) * 0.8, face = [0, Math.PI / 2, Math.PI, -Math.PI / 2][side] + (dir < 0 ? Math.PI : 0)
    for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {            // the chomper, facing where it goes
      if (x * x + y * y > 18) continue
      let a = Math.atan2(y, x) - face; a = Math.atan2(Math.sin(a), Math.cos(a))
      if (Math.abs(a) < open && x * x + y * y > 1) continue
      rect(px + x, py + y, 1, 1, '#ffe14d')
    }
    popups = popups.filter(p => (p.t -= dt) > 0); for (const p of popups) text('200', p.x - 5, p.y - 10, '#38e8ff')
    if (opts.hud !== false) {
      text('1UP', 4, 3, '#ff4a4a'); text(String(score).padStart(6, '0'), 20, 3, '#fff')
      text('HIGH SCORE', Math.round(W / 2 - textW('HIGH SCORE') / 2), 3, '#fff')
    }
    hideTV()
  }
}

// Hyperspace: the TV is the vanishing point of a warp starfield; every few seconds the jump kicks in and the stars stretch
// into streaks, rings pulse out from the TV edge and the odd ship flies out of the screen.
function hyperspace(canvas, M) {
  const { W, H, rect, sprite, clear, hideTV } = kit(canvas, M)
  const cx = M.x + M.w / 2, cy = M.y + M.h / 2, r = rng(5), F = 46
  const stars = Array.from({ length: 220 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, z: r() }))
  const SHIP = ['...X...', '..XXX..', '.XXWXX.', 'XXXXXXX', 'X.X.X.X']
  let prev = 0
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    const cyc = t % 12, jump = cyc > 8 ? Math.sin((cyc - 8) / 4 * Math.PI) : 0, speed = 0.12 + jump * 1.4
    clear()
    for (let k = 0; k < 6; k++) {                                          // rings pulsing out of the TV
      const e = ((t * 26 + k * 18) % 108)
      if (e < 2) continue
      const a = (1 - e / 108) * (0.35 + jump * 0.5)
      const c = `rgba(${k % 2 ? '120,220,255' : '190,140,255'},${a})`
      rect(M.x - e, M.y - e, M.w + 2 * e, 1, c); rect(M.x - e, M.y + M.h + e, M.w + 2 * e, 1, c)
      rect(M.x - e, M.y - e, 1, M.h + 2 * e, c); rect(M.x + M.w + e, M.y - e, 1, M.h + 2 * e, c)
    }
    for (const s of stars) {
      const z0 = s.z
      s.z -= speed * dt
      if (s.z < 0.03) { s.x = r() * 2 - 1; s.y = r() * 2 - 1; s.z = 1 }
      const x1 = cx + s.x / s.z * F, y1 = cy + s.y / s.z * F, tail = Math.min(1, 0.02 + speed * 0.12)
      const x0 = cx + s.x / Math.min(1, s.z + tail) * F, y0 = cy + s.y / Math.min(1, s.z + tail) * F
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0))), b = Math.min(1, (1 - s.z) * 1.3)
      const col = s.z > 0.5 ? `rgba(140,170,255,${b})` : `rgba(255,255,255,${b})`
      for (let k = 0; k <= n; k++) rect(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, 1, 1, col)
    }
    const sh = (t % 7) / 2.2                                               // a ship flies out of the screen every 7 s
    if (sh < 1) { const a = Math.floor(t / 7) * 2.4, d = 30 + sh * 140, sc = 1 + Math.floor(sh * 3)
      sprite(SHIP, cx + Math.cos(a) * d - 3.5 * sc, cy + Math.sin(a) * d * 0.7 - 2.5 * sc, '#ff6fb5', sc) }
    hideTV()
  }
}

// Platformer: clouds drift over the TV, question blocks above it bump out coins, green pipes and hills flank it and the
// hero runs the brick strip, hopping pipes and walkers.
function platformer(canvas, M) {
  const { W, H, rect, sprite, text, textW, clear, hideTV } = kit(canvas, M)
  const ground = H - 12, cx = M.x + M.w / 2
  const pipes = [{ x: M.x - 30, w: 16, h: 22 }, { x: M.x + M.w + 14, w: 16, h: 30 }]
  const GOOMBA = ['..DDDD..', '.DDDDDD.', 'DWKDDKWD', 'DWWDDWWD', 'DDDDDDDD', '.DSSSSD.', '..SSSS..', '.KK..KK.']
  const CLOUD = ['....WWW.....', '..WWWWWWW...', '.WWWWWWWWWW.', 'WWWWWWWWWWWW', '.WWWWWWWWWW.']
  const BLOCK = { q: ['YYYYYYYY', 'YOOOOOOY', 'YOOKKOOY', 'YOOOKOOY', 'YOOOKOOY', 'YOOOOOOY', 'YOOOKOOY', 'KKKKKKKK'],
    b: ['DDDDDDDD', 'OOODOOOO', 'OOODOOOO', 'DDDDDDDD', 'OOOOOOOD', 'OOOOOOOD', 'DDDDDDDD', 'KKKKKKKK'] }
  const row = ['b', 'q', 'b', 'q', 'b', 'q', 'b'], by = Math.max(10, M.y - 20), bx = Math.round(cx - row.length * 4)
  const hill = (x, r) => { for (let dy = 0; dy < r; dy++) { const half = Math.round(Math.sqrt(r * r - dy * dy)); rect(x - half, ground - dy - 1, half * 2, 1, dy === r - 1 || half < 3 ? '#2fbf4a' : '#1d7a32') } }
  return now => {
    const t = now / 1000
    clear()
    for (let k = 0; k < 4; k++) sprite(CLOUD, ((t * (6 + k * 2) + k * 97) % (W + 30)) - 20, 8 + (k * 13) % 30, '#fff')
    hill(22, 22); hill(W - 26, 16); hill(M.x - 52, 12)
    for (const p of pipes) {                                                // pipes standing on the ground
      rect(p.x, ground - p.h + 6, p.w, p.h - 6, '#1d9a32'); rect(p.x + 3, ground - p.h + 6, 2, p.h - 6, '#7cf58a')
      rect(p.x - 2, ground - p.h, p.w + 4, 6, '#2fbf4a'); rect(p.x + 1, ground - p.h, 2, 6, '#9cffaa'); rect(p.x - 2, ground - p.h + 5, p.w + 4, 1, '#0d4f1a')
    }
    const bump = Math.floor(t / 2.5) % 3, bt = (t % 2.5) / 0.9               // one ? block bumps every 2.5 s
    row.forEach((k, i) => {
      const hit = k === 'q' && Math.floor(i / 2) === bump && bt < 0.25
      sprite(k === 'q' && bt < 1 && Math.floor(i / 2) === bump ? BLOCK.b : BLOCK[k], bx + i * 8, by - (hit ? 2 : 0))
      if (k === 'q' && Math.floor(i / 2) === bump && bt < 1) {
        sprite(SPR.coin[Math.floor(t * 10) % 3], bx + i * 8 + 1, by - 10 - bt * 16)
        if (bt > 0.4) text('100', bx + i * 8 - 2, by - 30 - bt * 4, '#ffffff')
      }
    })
    rect(0, ground, W, 12, PAL.D); rect(0, ground + 6, W, 1, '#5a2a0a'); rect(0, ground - 1, W, 1, PAL.G)
    for (let x = 0; x < W; x += 8) { rect(x, ground, 1, 6, '#5a2a0a'); rect(x + 4, ground + 7, 1, 5, '#5a2a0a') }
    const gx = W + 10 - ((t * 14) % (W + 40))                                // walker going left
    sprite(GOOMBA, gx, ground - 8 - (Math.floor(t * 4) % 2 ? 0 : 0))
    const hx = ((t * 32) % (W + 40)) - 20                                    // hero: hop over pipes and the walker
    let lift = 0
    for (const p of pipes) { const a = p.x - 16, b = p.x + p.w + 6; if (hx > a && hx < b) lift = Math.max(lift, Math.sin(Math.PI * (hx - a) / (b - a)) * (p.h + 8)) }
    const gap = gx - hx; if (gap > -10 && gap < 16) lift = Math.max(lift, Math.sin(Math.PI * (16 - gap) / 26) * 14)
    sprite(lift || Math.floor(t * 8) % 2 ? SPR.heroA : SPR.heroB, hx, ground - 10 - lift)
    hideTV()
  }
}

// ======================================================================================================================
// Retro Odyssey: one show through five eras of games, staged around the TV. The TV is part of the set: shots vanish
// behind it, enemies fly out of it, the hero runs across its top edge and between eras it swallows the whole wall and
// the next era bursts back out of it. A coloured halo glows around the TV like ambilight, everything gets a soft bloom,
// and one score runs through the whole show.
// ======================================================================================================================
const ODY = {
  squidA: ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '..X..X..', '.X.XX.X.', 'X.X..X.X'],
  squidB: ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '.X.XX.X.', 'X......X', '.X....X.'],
  octoA: ['....XXXX....', '.XXXXXXXXXX.', 'XXXXXXXXXXXX', 'XXX..XX..XXX', 'XXXXXXXXXXXX', '...XX..XX...', '..XX.XX.XX..', 'XX........XX'],
  octoB: ['....XXXX....', '.XXXXXXXXXX.', 'XXXXXXXXXXXX', 'XXX..XX..XXX', 'XXXXXXXXXXXX', '..XXX..XXX..', '.XX..XX..XX.', '..XX....XX..'],
  cannon: ['.....X.....', '....XXX....', '.XXXXXXXXX.', 'XXXXXXXXXXX', 'XXXXXXXXXXX'],
  ufo: ['.....XXXXXX.....', '...XXXXXXXXXX...', '..XXXXXXXXXXXX..', '.XX.XX.XX.XX.XX.', 'XXXXXXXXXXXXXXXX', '..XXX..XX..XXX..', '...X........X...'],
  bunker: ['...XXXXXXXX...', '..XXXXXXXXXX..', '.XXXXXXXXXXXX.', 'XXXXXXXXXXXXXX', 'XXXXXXXXXXXXXX', 'XXXX......XXXX', 'XXX........XXX'],
  ship: ['.XX.........', '.XXXX.......', '.XXBBXXX....', 'XXXBBXXXXXX.', 'OXXXXXXXXXXX', 'XXXXXXXXXX..', '.XXXX.......', '.XX.........'],
  drone: ['..XXXX..', '.XWXXWX.', 'XXXXXXXX', 'X.XXXX.X', 'X..XX..X'],
  boss: ['........XXXXXXXX........', '.....XXXXXXXXXXXXXX.....', '...XXXXXXXXXXXXXXXXXX...', '..XXXXXXWWXXXXWWXXXXXX..',
    '.XXXXXXXWWXXXXWWXXXXXXX.', 'XXXXXXXXXXXRRXXXXXXXXXXX', 'XXXXXXXXXXRRRRXXXXXXXXXX', 'XX.XXXXXXXXRRXXXXXXXX.XX',
    'X...XXXXXXXXXXXXXXXX...X', '.....XX..XXXXXX..XX.....', '....XX....XXXX....XX....', '...XX......XX......XX...'],
  goomba: ['..DDDD..', '.DDDDDD.', 'DWKDDKWD', 'DWWDDWWD', 'DDDDDDDD', '.DSSSSD.', '..SSSS..', '.KK..KK.'],
  squash: ['.DDDDDD.', 'DWKDDKWD', 'DDDDDDDD', 'KK....KK'],
  cloud: ['....WWW.....', '..WWWWWWW...', '.WWWWWWWWWW.', 'WWWWWWWWWWWW', '.WWWWWWWWWW.'],
  qblock: ['YYYYYYYY', 'YOOOOOOY', 'YOOKKOOY', 'YOOOKOOY', 'YOOOKOOY', 'YOOOOOOY', 'YOOOKOOY', 'KKKKKKKK'],
  used: ['DDDDDDDD', 'DOOOOOOD', 'DOOOOOOD', 'DOOOOOOD', 'DOOOOOOD', 'DOOOOOOD', 'DOOOOOOD', 'KKKKKKKK'],
  brick: ['DDDDDDDD', 'OOODOOOO', 'OOODOOOO', 'DDDDDDDD', 'OOOOOOOD', 'OOOOOOOD', 'DDDDDDDD', 'KKKKKKKK'],
}

// 1978 - Invasion: a full-width fleet marches above the TV. The cannon on the strip below fires straight up through
// (behind) the TV and blows them apart; their bombs burst into sparks on the TV's top edge. A saucer crosses now and then.
function eraInvasion(canvas, M, api) {
  const { W, H, rect, sprite, clear } = kit(canvas, M)
  const r = rng(78), rows = [['squid', '#ff6fd8', 30], ['crab', '#38e8ff', 20], ['octo', '#7cfc5a', 10]]
  const cols = Math.min(13, Math.floor((W - 30) / 18)), top = 16, gapY = Math.max(9, Math.min(12, (M.y - top - 8) / 3))
  let fleet, dx = 0, step = 0, prev = 0, shots = [], bombs = [], ufo = null, cannon = W / 2, target = null, cool = 0
  const newFleet = () => { fleet = []; rows.forEach(([kind, c, pts], j) => { for (let i = 0; i < cols; i++) fleet.push({ kind, c, pts, i, j, alive: true }) }) }
  newFleet()
  const pos = a => [W / 2 - (cols - 1) * 9 + a.i * 18 + dx, top + a.j * gapY]
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    if (Math.floor(t / 0.45) !== step) { step = Math.floor(t / 0.45); dx = Math.sin(step * 0.35) * 14 }
    const alive = fleet.filter(a => a.alive)
    if (!alive.length) newFleet()
    if (!target?.alive) target = alive[Math.floor(r() * alive.length)]
    if (target) cannon += Math.sign(pos(target)[0] - cannon) * Math.min(Math.abs(pos(target)[0] - cannon), 70 * dt)
    if ((cool -= dt) <= 0 && target && Math.abs(pos(target)[0] - cannon) < 3) { shots.push({ x: cannon, y: H - 20 }); cool = 0.45 }
    for (const s of shots) { s.y -= 190 * dt
      for (const a of fleet) { if (!a.alive) continue; const [x, y] = pos(a); if (Math.abs(s.x - x) < 6 && s.y < y + 7 && s.y > y - 2) {
        a.alive = false; s.y = -99; api.score(a.pts); api.burst(x, y + 3, [a.c, '#ffffff'], 26, 55) } } }
    shots = shots.filter(s => s.y > 0)
    if (r() < dt * 1.6 && alive.length) { const a = alive[Math.floor(r() * alive.length)], [x, y] = pos(a); bombs.push({ x, y: y + 8 }) }
    for (const b of bombs) { b.y += 55 * dt
      const onTV = b.x > M.x && b.x < M.x + M.w && b.y >= M.y - 1
      if (onTV) { api.burst(b.x, M.y - 1, ['#ffd23f', '#ff8a3a', '#ffffff'], 14, 40, -1); b.y = 1e9 }
      else if (b.y >= H - 13) { api.burst(b.x, H - 14, ['#ffd23f', '#ff8a3a'], 8, 25, -1); b.y = 1e9 } }
    bombs = bombs.filter(b => b.y < 1e8)
    if (!ufo && r() < dt / 7) ufo = { x: -18, dir: 1 }
    if (ufo) { ufo.x += 40 * dt; if (ufo.x > W + 18) ufo = null }
    clear()
    for (const a of fleet) if (a.alive) { const [x, y] = pos(a), odd = step % 2
      const spr = a.kind === 'squid' ? (odd ? ODY.squidB : ODY.squidA) : a.kind === 'crab' ? (odd ? SPR.invB : SPR.invA) : (odd ? ODY.octoB : ODY.octoA)
      sprite(spr, x - spr[0].length / 2, y, a.c) }
    if (ufo) sprite(ODY.ufo, ufo.x, 9, '#ff4a4a')
    for (const s of shots) rect(s.x, s.y, 1, 4, '#ffffff')
    for (const b of bombs) { rect(b.x + (Math.floor(b.y / 3) % 2), b.y, 1, 2, '#ffd23f'); rect(b.x + 1 - (Math.floor(b.y / 3) % 2), b.y + 2, 1, 2, '#ffd23f') }
    for (const bx of [M.x / 2 - 7, W - (W - M.x - M.w) / 2 - 7]) sprite(ODY.bunker, bx, H - 24, '#3fd65a')
    rect(0, H - 13, W, 1, '#3fd65a')
    sprite(ODY.cannon, cannon - 5, H - 19, '#3fd65a')
  }
}

// 1985 - World 1-1: the hero climbs a pipe and brick steps, lands on top of the TV, bumps a ? block, stomps a walker
// on the TV's edge, hops down the other side and grabs the flag. Fireworks.
function eraWorld(canvas, M, api) {
  const { W, H, rect, sprite, text, clear } = kit(canvas, M)
  const G = H - 12, top = M.y, L1 = G - 20, L2 = Math.round(G - (G - top) * 0.45), L3 = Math.round(G - (G - top) * 0.75)
  const pipeX = Math.max(2, M.x - 78), stepsL = [[M.x - 52, L2], [M.x - 26, L3]], stepsR = [[M.x + M.w + 4, L3], [M.x + M.w + 28, L2]]
  const poleX = W - 14, qx = Math.round(M.x + M.w / 2 - 4), qy = top - 30
  // Hero timeline: walk / jump / slide segments, built once.
  const seg = []; let T = 0, cur = [-12, G]
  const walk = x1 => { const d = Math.abs(x1 - cur[0]) / 42; seg.push({ k: 'w', t0: T, t1: T + d, a: cur, b: [x1, cur[1]] }); T += d; cur = [x1, cur[1]] }
  const jump = (x1, y1, lift = 14) => { const apex = Math.min(cur[1], y1) - lift, d = 0.5 + Math.abs(y1 - cur[1]) / 200
    seg.push({ k: 'j', t0: T, t1: T + d, a: cur, b: [x1, y1], c: 2 * apex - (cur[1] + y1) / 2 }); T += d; cur = [x1, y1] }
  const slide = y1 => { const d = (y1 - cur[1]) / 60; seg.push({ k: 'w', t0: T, t1: T + d, a: cur, b: [cur[0], y1], slide: true }); T += d; cur = [cur[0], y1] }
  walk(pipeX - 10); jump(pipeX + 4, L1); jump(stepsL[0][0] + 4, L2); jump(stepsL[1][0] + 4, L3); jump(M.x + 6, top)
  walk(qx - 4); const bumpAt = T; jump(qx + 4, top, 14); walk(M.x + M.w - 12)
  jump(stepsR[0][0] + 6, L3); jump(stepsR[1][0] + 8, L2); jump(poleX - 6, L2 - 20); const slideAt = T; slide(G); walk(W + 14)
  const loop = T + 1.5
  const at = tt => { const s = seg.find(s => tt < s.t1) ?? seg.at(-1), u = Math.min(1, Math.max(0, (tt - s.t0) / (s.t1 - s.t0)))
    const x = s.a[0] + (s.b[0] - s.a[0]) * u
    const y = s.k === 'j' ? (1 - u) ** 2 * s.a[1] + 2 * u * (1 - u) * s.c + u * u * s.b[1] : s.a[1] + (s.b[1] - s.a[1]) * u
    return { x, y, air: s.k === 'j', slide: s.slide } }
  const coins = Array.from({ length: 5 }, (_, i) => ({ x: M.x + 20 + i * ((M.w - 40) / 4), y: top - 14 - Math.sin(i / 4 * Math.PI) * 6 }))
  let lap = -1, goomba, taken, fired, bumped, prev = 0
  const hill = (x, rr) => { for (let dy = 0; dy < rr; dy++) { const half = Math.round(Math.sqrt(rr * rr - dy * dy)); rect(x - half, G - dy - 1, half * 2, 1, dy === rr - 1 || half < 3 ? '#2fbf4a' : '#16612a') } }
  const pipe = (x, h) => { rect(x, G - h + 6, 16, h - 6, '#1d9a32'); rect(x + 3, G - h + 6, 2, h - 6, '#7cf58a'); rect(x - 2, G - h, 20, 6, '#2fbf4a'); rect(x + 1, G - h, 2, 6, '#9cffaa') }
  return now => {
    const t = now / 1000, tt = t % loop, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    if (Math.floor(t / loop) !== lap) { lap = Math.floor(t / loop); goomba = { x: M.x + M.w - 10, dead: -1 }; taken = new Set(); fired = 0; bumped = 0 }
    const h = at(tt)
    if (goomba.dead < 0) { goomba.x -= 13 * dt; if (Math.abs(goomba.x - h.x) < 7 && Math.abs(h.y - top) < 3 && tt > bumpAt) { goomba.dead = tt; api.score(100); api.burst(goomba.x + 4, top - 4, ['#ffffff'], 8, 20) } }
    goomba.x = Math.max(M.x, goomba.x)
    coins.forEach((c, i) => { if (!taken.has(i) && Math.abs(h.x + 4 - c.x) < 5 && Math.abs(h.y - 8 - c.y) < 10) { taken.add(i); api.score(200); api.burst(c.x + 2, c.y + 4, ['#ffd23f', '#ffffff'], 10, 30) } })
    if (!bumped && tt > bumpAt + 0.22) { bumped = 1; api.score(200) }
    if (fired < 3 && tt > slideAt + (G - (L2 - 20)) / 60 + fired * 0.45) { fired++
      api.burst(W - 40 - fired * 18, 22 + fired * 6, [['#ff4a4a', '#ffd23f'], ['#38e8ff', '#ffffff'], ['#b56cff', '#ff6fb5']][fired - 1], 60, 70, 0.6) }
    clear()
    for (let k = 0; k < 3; k++) sprite(ODY.cloud, ((t * (5 + k * 2) + k * 120) % (W + 30)) - 20, 12 + k * 9, '#fff')
    hill(24, 20); hill(W - 50, 14)
    pipe(pipeX, 20)
    for (const [x, y] of [...stepsL, ...stepsR]) for (let k = 0; k < 3; k++) sprite(ODY.brick, x + k * 8 - 4, y)
    const qb = tt > bumpAt && tt < bumpAt + 0.15 ? 2 : 0
    sprite(bumped ? ODY.used : ODY.qblock, qx, qy - qb); sprite(ODY.brick, qx - 8, qy); sprite(ODY.brick, qx + 8, qy)
    if (tt > bumpAt && tt < bumpAt + 0.9) { const u = (tt - bumpAt) / 0.9; sprite(SPR.coin[Math.floor(t * 12) % 3], qx + 1, qy - 10 - Math.sin(u * Math.PI) * 18); if (u > 0.5) text('200', qx - 2, qy - 34, '#fff') }
    coins.forEach((c, i) => { if (!taken.has(i)) sprite(SPR.coin[Math.floor(t * 8 + i) % 3], c.x, c.y) })
    rect(poleX, L2 - 40, 1, G - (L2 - 40), '#c8f0c8'); rect(poleX - 1, L2 - 42, 3, 3, '#7cfc5a')
    const flagY = tt > slideAt ? Math.min(G - 8, L2 - 38 + (tt - slideAt) * 60) : L2 - 38
    for (let k = 0; k < 6; k++) rect(poleX - 1 - k, flagY + k / 2, 1, 6 - k, '#ffffff')
    if (goomba.dead < 0) sprite(ODY.goomba, goomba.x, top - 8)
    else if (tt - goomba.dead < 0.6) sprite(ODY.squash, goomba.x, top - 4)
    rect(0, G, W, 12, PAL.D); rect(0, G + 6, W, 1, '#5a2a0a'); rect(0, G - 1, W, 1, PAL.G)
    for (let x = 0; x < W; x += 8) { rect(x, G, 1, 6, '#5a2a0a'); rect(x + 4, G + 7, 1, 5, '#5a2a0a') }
    sprite(h.air || h.slide || Math.floor(t * 8) % 2 ? SPR.heroA : SPR.heroB, h.x, h.y - 10)
  }
}

// 1991 - Star Fighter: parallax space, a ringed planet; the fighter patrols the left and fires through the TV at drones
// coming in from the right, and at drones that fly straight out of the TV screen. Then the boss rises from behind it.
function eraFighter(canvas, M, api) {
  const { W, H, rect, sprite, clear } = kit(canvas, M)
  const r = rng(91), layers = [0.25, 0.6, 1].map((v, k) => ({ v, s: Array.from({ length: 40 - k * 10 }, () => ({ x: r() * W, y: r() * H })) }))
  let prev = 0, ship = { x: 10, y: H / 2 }, shots = [], drones = [], wave = 0, cool = 0, boss = null, bossDone = false, t0 = null
  const planet = (cx, cy, R) => {
    for (let y = -R; y <= R; y++) { const half = Math.round(Math.sqrt(R * R - y * y))
      for (let x = -half; x <= half; x++) { const band = Math.floor((y + R) / 3) % 3
        rect(cx + x, cy + y, 1, 1, x + y < -R * 0.4 ? '#f2c38a' : ['#c87f3a', '#a85a2a', '#e0a060'][band]) } }
    for (let a = 0; a < Math.PI * 2; a += 0.02) { const x = Math.cos(a) * R * 1.9, y = Math.sin(a) * R * 0.45
      if (y > 0 || x * x / (R * R) + (y * y) / (R * R) > 1) rect(cx + x, cy + y, 1, 1, '#ffe0a8') }
  }
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t; t0 ??= t; const et = t - t0
    if (Math.floor(et / 2.2) !== wave && !boss) { wave = Math.floor(et / 2.2)
      const fromTV = wave % 2 === 1, baseY = fromTV ? M.y + 8 + r() * (M.h - 16) : 14 + r() * Math.max(4, M.y - 26)
      for (let i = 0; i < 5; i++) drones.push({ x: fromTV ? M.x + M.w / 2 + i * 12 : W + 10 + i * 13, y: baseY, base: baseY, ph: i * 0.9, fromTV, hp: 1 }) }
    if (!boss && !bossDone && et > 11) boss = { y: M.y + 8, hp: 24, hit: 0, born: et }
    for (const d of drones) { d.x -= (d.fromTV ? 42 : 48) * dt; d.y = d.base + Math.sin(et * 3 + d.ph) * (d.fromTV ? 4 : 7) }
    drones = drones.filter(d => d.x > -14 && d.hp > 0)
    const visible = drones.filter(d => !(d.x > M.x && d.x < M.x + M.w && d.y > M.y && d.y < M.y + M.h) && d.x < W - 4)
    const aim = boss && boss.y < M.y - 6 ? boss.y + 6 : (visible.sort((a, b) => a.x - b.x)[0]?.y ?? H / 2)
    ship.y += Math.sign(aim - 3 - ship.y) * Math.min(Math.abs(aim - 3 - ship.y), 60 * dt); ship.x = 10 + Math.sin(et * 0.8) * 5
    if ((cool -= dt) <= 0) { shots.push({ x: ship.x + 12, y: ship.y + 4 }); cool = 0.16 }
    for (const s of shots) { s.x += 230 * dt
      for (const d of drones) if (d.hp > 0 && Math.abs(s.x - d.x - 4) < 5 && Math.abs(s.y - d.y - 2) < 4 && !(d.x > M.x && d.x < M.x + M.w && d.y > M.y && d.y < M.y + M.h)) {
        d.hp = 0; s.x = 1e9; api.score(50); api.burst(d.x + 4, d.y + 2, ['#ff8a3a', '#ffd23f', '#ffffff'], 22, 50) }
      if (boss && boss.y < M.y - 6) { const bx = M.x + M.w / 2 - 12; if (s.x > bx && s.x < bx + 24 && s.y > boss.y && s.y < boss.y + 12) {
        api.burst(s.x, s.y, ['#ffffff'], 3, 30); s.x = 1e9; boss.hp--; boss.hit = 0.06
        if (boss.hp <= 0) { for (let k = 0; k < 4; k++) api.burst(bx + 4 + k * 6, boss.y + 6, ['#ff4a4a', '#ffd23f', '#ffffff', '#38e8ff'], 50, 90); api.score(5000); api.flash(); boss = null; bossDone = true } } }
    }
    shots = shots.filter(s => s.x < W + 4)
    if (boss) { boss.y = Math.max(M.y - 26 + Math.sin(et * 1.5) * 2, M.y + 8 - (et - boss.born) * 14); boss.hit -= dt }
    clear()
    for (const L of layers) for (const s of L.s) { const x = ((s.x - et * 40 * L.v) % W + W) % W; rect(x, s.y, L.v > 0.9 ? 2 : 1, 1, `rgba(${L.v > 0.9 ? '255,255,255' : '150,180,255'},${0.3 + L.v * 0.6})`) }
    planet(W - 46, 30, 9)
    for (const d of drones) sprite(ODY.drone, d.x, d.y, d.fromTV ? '#ff6fb5' : '#b56cff')
    if (boss) sprite(ODY.boss, M.x + M.w / 2 - 12, boss.y, boss.hit > 0 ? '#ffffff' : '#7c8bff')
    for (const s of shots) rect(s.x, s.y, 4, 1, '#7cfcff')
    const flame = Math.floor(et * 20) % 2 ? '#ffd23f' : '#ff8a3a'
    rect(ship.x - 3, ship.y + 3, 3, 2, flame)
    sprite(ODY.ship, ship.x, ship.y, '#d8dcef')
  }
}

const ERAS = [
  { year: '1978', title: 'INVASION', color: '#7cfc5a', make: eraInvasion },
  { year: '1980', title: 'MAZE CHASE', color: '#4f6bff', make: (c, m, api) => pacmaze(c, m, { hud: false, onScore: api.score }) },
  { year: '1985', title: 'WORLD 1-1', color: '#ff4a4a', make: eraWorld },
  { year: '1989', title: 'FALLING BLOCKS', color: '#b56cff', make: (c, m, api) => tetris(c, m, { top: 14, onScore: api.score }) },
  { year: '1991', title: 'STAR FIGHTER', color: '#38e8ff', make: eraFighter },
]

function odyssey(canvas, M) {
  const { g, W, H } = kit(canvas, M)
  const ERA = 22, OUT = 0.8, IN = 0.8
  const buf = Object.assign(document.createElement('canvas'), { width: W, height: H }), bg = buf.getContext('2d')
  const small = Object.assign(document.createElement('canvas'), { width: Math.ceil(W / 4), height: Math.ceil(H / 4) }), sg = small.getContext('2d')
  const hud = kit(buf, M), r = rng(1)
  let score = 0, shown = 0, parts = [], flashT = 0, cur = -1, frame = null, start = 0, vacuum = [], prev = 0
  const api = {
    score: n => { score += n },
    burst: (x, y, colors, n, speed, gravity = 1) => { for (let k = 0; k < n; k++) { const a = r() * Math.PI * 2, v = speed * (0.3 + r() * 0.7)
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (gravity < 0 ? speed * 0.5 : 0), g: Math.abs(gravity) * 60, life: 0.5 + r() * 0.7, c: colors[k % colors.length] }) } },
    flash: () => { flashT = 0.12 },
  }
  const cx = M.x + M.w / 2, cy = M.y + M.h / 2
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    const idx = Math.floor(t / ERA) % ERAS.length, era = ERAS[idx]
    if (idx !== cur) {                                                       // era change: snapshot the wall for the vacuum
      if (cur >= 0) { const d = bg.getImageData(0, 0, W, H).data, lit = []
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (d[i] + d[i + 1] + d[i + 2] > 90) lit.push([x, y, `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`]) }
        const keep = Math.max(1, Math.ceil(lit.length / 2600)), far = Math.hypot(W, H) / 2
        vacuum = lit.filter((_, i) => i % keep === 0).map(([x, y, c]) => ({ x, y, c, delay: (1 - Math.hypot(x - cx, y - cy) / far) * 0.25 + r() * 0.1 })) }
      cur = idx; start = t; frame = era.make(buf, M, api)
    }
    const et = t - start, intro = cur >= 0 && vacuum.length && et < OUT
    bg.fillStyle = '#000'; bg.fillRect(0, 0, W, H)
    if (intro) {                                                            // the TV swallows the old era, spiralling in
      for (const p of vacuum) { const u = Math.min(1, Math.max(0, (et - p.delay) / (OUT - 0.3))), e = u * u * u, a = e * 1.6
        const dx = (p.x - cx) * (1 - e), dy = (p.y - cy) * (1 - e)
        bg.fillStyle = p.c; bg.fillRect(Math.round(cx + dx * Math.cos(a) - dy * Math.sin(a)), Math.round(cy + dx * Math.sin(a) + dy * Math.cos(a)), 1, 1) }
    } else {
      frame(now)
      const ru = vacuum.length ? (et - OUT) / IN : 1
      if (ru < 1) {                                                         // the new era bursts out of the TV: shockwave reveal
        const e = 1 - (1 - ru) ** 3, R = e * Math.hypot(W, H)
        bg.save(); bg.globalCompositeOperation = 'destination-in'; bg.fillStyle = '#fff'
        bg.fillRect(M.x - R, M.y - R * 0.6, M.w + 2 * R, M.h + 1.2 * R); bg.restore()
        bg.fillStyle = era.color
        for (const [x, y, w, h] of [[M.x - R, M.y - R * 0.6, M.w + 2 * R, 1], [M.x - R, M.y + M.h + R * 0.6, M.w + 2 * R, 1], [M.x - R, M.y - R * 0.6, 1, M.h + 1.2 * R], [M.x + M.w + R, M.y - R * 0.6, 1, M.h + 1.2 * R]])
          bg.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)))
      }
    }
    parts = parts.filter(p => (p.life -= dt) > 0)                           // particles (explosions, sparks, fireworks)
    for (const p of parts) { p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; bg.globalAlpha = Math.min(1, p.life * 2); bg.fillStyle = p.c; bg.fillRect(Math.round(p.x), Math.round(p.y), 1, 1) }
    bg.globalAlpha = 1
    shown += Math.sign(score - shown) * Math.max(1, Math.ceil(Math.abs(score - shown) * 0.15)) * (score !== shown)  // score rolls up
    bg.fillStyle = '#000'; bg.fillRect(0, 0, W, 10)
    hud.text('1UP', 4, 3, '#ff4a4a'); hud.text(String(shown).padStart(6, '0'), 20, 3, '#ffffff')
    const label = `ERA ${era.year}`; hud.text(label, Math.round(W / 2 - hud.textW(label) / 2), 3, era.color)
    hud.text('HI', W - 37, 3, '#ff4a4a'); hud.text(String(Math.max(50000, shown)).padStart(6, '0'), W - 27, 3, '#ffffff')
    if (!intro && et < 4.2) {                                               // title card, typed out, above the TV
      const n = Math.floor((et - OUT) * 14), y = Math.max(12, M.y - 26), title = era.title.slice(0, Math.max(0, n - 4))
      const ww = Math.max(hud.textW(era.year, 2), hud.textW(era.title)) + 10
      bg.fillStyle = '#000'; bg.fillRect(Math.round(cx - ww / 2), y - 3, ww, 22)
      bg.fillStyle = era.color; bg.fillRect(Math.round(cx - ww / 2), y - 3, ww, 1); bg.fillRect(Math.round(cx - ww / 2), y + 18, ww, 1)
      if (n > 0) hud.text(era.year.slice(0, n), Math.round(cx - hud.textW(era.year, 2) / 2), y, era.color, 2)
      if (title) hud.text(title, Math.round(cx - hud.textW(era.title) / 2), y + 12, '#ffffff')
    }
    if (flashT > 0) { flashT -= dt; bg.fillStyle = 'rgba(255,255,255,0.35)'; bg.fillRect(0, 0, W, H) }
    // Composite: ambilight halo round the TV, a soft bloom of the scene, then the crisp pixels on top; the TV stays black.
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H)
    const breath = 0.75 + 0.25 * Math.sin(t * 1.7), [cr, cg, cb] = hex(era.color)
    for (let d = 1; d <= 12; d++) { g.fillStyle = `rgba(${cr},${cg},${cb},${0.16 * (1 - d / 13) * breath})`
      g.fillRect(M.x - d, M.y - d, M.w + 2 * d, 1); g.fillRect(M.x - d, M.y + M.h + d - 1, M.w + 2 * d, 1)
      g.fillRect(M.x - d, M.y - d, 1, M.h + 2 * d); g.fillRect(M.x + M.w + d - 1, M.y - d, 1, M.h + 2 * d) }
    sg.imageSmoothingEnabled = true; sg.clearRect(0, 0, small.width, small.height); sg.drawImage(buf, 0, 0, small.width, small.height)
    g.globalCompositeOperation = 'lighter'; g.imageSmoothingEnabled = true; g.globalAlpha = 0.55; g.drawImage(small, 0, 0, W, H)
    g.globalAlpha = 1; g.imageSmoothingEnabled = false; g.drawImage(buf, 0, 0)
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(M.x - 1, M.y - 1, M.w + 2, M.h + 2)
  }
}

export const VARIANTS = [
  { id: 'odyssey', name: 'Retro Odyssey', make: odyssey },
  { id: 'arcade', name: 'Arcade', make: (c, m) => retroLoop(c, m) },
  { id: 'synthwave', name: 'Synthwave', make: synthwave },
  { id: 'tetris', name: 'Tetris', make: tetris },
  { id: 'pacmaze', name: 'Pac-maze', make: pacmaze },
  { id: 'hyperspace', name: 'Hyperspace', make: hyperspace },
  { id: 'platformer', name: 'Platformer', make: platformer },
]

// Labels the beamer puts on the console fronts: model name in the scene -> [text, year of first release, colour].
export const CONSOLES = {
  'NES': ['NES', 1985, '#ff4a4a'], 'SNES': ['SUPER NINTENDO', 1990, '#ff4a4a'], 'PlayStation': ['PLAYSTATION', 1994, '#4fa3ff'],
  'Nintendo 64': ['NINTENDO 64', 1996, '#ff4a4a'], 'PlayStation 2': ['PLAYSTATION 2', 2000, '#4fa3ff'], 'GameCube': ['GAMECUBE', 2001, '#b28cff'],
  'Dreamcast': ['DREAMCAST', 1998, '#ff8a3a'], 'Wii': ['WII', 2006, '#4fe0ff'], 'Xbox 360': ['XBOX 360', 2005, '#7cfc5a'],
  'Wii U': ['WII U', 2012, '#4fe0ff'], 'PlayStation 3': ['PLAYSTATION 3', 2006, '#4fa3ff'], 'PlayStation 4': ['PLAYSTATION 4', 2013, '#4fa3ff'],
}
