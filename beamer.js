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
function tetris(canvas, M) {
  const { W, H, rect, text, textW, clear, hideTV } = kit(canvas, M)
  const S = 6, C = Math.max(4, Math.floor((M.x - 10) / S)), Rows = Math.floor((H - 8) / S)
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
      if (w.flash) { w.flash.t--; if (!w.flash.t) { for (const y of w.flash.rows) { grid.splice(y, 1); grid.unshift(Array(C).fill(null)) } lines += w.flash.rows.length; w.flash = null } return }
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
function pacmaze(canvas, M) {
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
  const near = (a, b, d) => Math.abs((((a - b) % P) + P + P / 2) % P - P / 2) < d
  return now => {
    const t = now / 1000, dt = Math.min(0.05, prev ? t - prev : 0); prev = t
    pac += dir * (scare ? 44 : 34) * dt
    dots.forEach((s, i) => { if (near(pac, s, 2)) { if (!eaten.has(i)) score += 10; eaten.add(i) } })
    corners.forEach((c, i) => { if (!pellets.has(i) && near(pac, c, 2)) { pellets.add(i); scare = 5; dir = -1; score += 50 } })
    if (scare && (scare -= dt) <= 0) { scare = 0; dir = 1 }
    if (eaten.size === dots.length && !reset) reset = 1.5
    if (reset && (reset -= dt) <= 0) { reset = 0; eaten = new Set(); pellets = new Set() }
    for (const gh of ghosts) {
      if (gh.gone > 0) { if ((gh.gone -= dt) <= 0) gh.s = pac - 90; continue }
      gh.s += (scare ? -14 : 33) * dt
      if (!scare && gh.s > pac - 10) gh.s = pac - 10                       // tailing, never quite catching it
      if (scare && near(gh.s, pac, 5)) { gh.gone = 4; score += 200; const [x, y] = at(gh.s); popups.push({ x, y, t: 1 }) }
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
    const sc = String(score).padStart(6, '0')
    text('1UP', 4, 3, '#ff4a4a'); text(sc, 20, 3, '#fff')
    text('HIGH SCORE', Math.round(W / 2 - textW('HIGH SCORE') / 2), 3, '#fff')
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

export const VARIANTS = [
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
