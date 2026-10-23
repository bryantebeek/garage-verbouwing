// Retro gaming loop (from retro-tv-loop.html) for the beamer projection: draws one frame into the canvas (320 wide,
// any height; rows are laid out from the top for the invaders and from the bottom for the ground strip).
// `mask` (canvas pixels) is the TV on the wall; it stays black so the projector doesn't light the TV itself.
export function retroLoop(canvas, mask) {
  const g = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height, MID = Math.round(H * 0.44)
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
    P: '111101111100100',
  }

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

// Labels the beamer puts on the console fronts: model name in the scene -> [text, year of first release, colour].
export const CONSOLES = {
  'NES': ['NES', 1985, '#ff4a4a'], 'SNES': ['SUPER NINTENDO', 1990, '#ff4a4a'], 'PlayStation': ['PLAYSTATION', 1994, '#4fa3ff'],
  'Nintendo 64': ['NINTENDO 64', 1996, '#ff4a4a'], 'PlayStation 2': ['PLAYSTATION 2', 2000, '#4fa3ff'], 'GameCube': ['GAMECUBE', 2001, '#b28cff'],
  'Dreamcast': ['DREAMCAST', 1998, '#ff8a3a'], 'Wii': ['WII', 2006, '#4fe0ff'], 'Xbox 360': ['XBOX 360', 2005, '#7cfc5a'],
  'Wii U': ['WII U', 2012, '#4fe0ff'], 'PlayStation 3': ['PLAYSTATION 3', 2006, '#4fa3ff'], 'PlayStation 4': ['PLAYSTATION 4', 2013, '#4fa3ff'],
}
