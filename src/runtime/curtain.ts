/**
 * curtain.ts — the stage curtain that opens onto the book.
 *
 * THE SEQUENCE
 *   1. the file opens with the curtain CLOSED, the title and photo PRINTED on
 *      the cloth, breathing gently
 *   2. click, tap, scroll or press a key and the curtain SPLITS and draws back,
 *      taking its printing with it
 *   3. behind it: the floating closed book, which then opens
 *   4. a swag of cloth stays at each edge as the backdrop for the session
 *
 * PRINTED ON THE CLOTH, NOT FLOATING OVER IT
 * The copy used to be ordinary HTML sitting above the WebGL canvas, so it stayed
 * flat and rigid while the fabric moved underneath — the giveaway that it was
 * two separate things. Now the whole layout is *rasterised into a canvas* and
 * handed to the shader as the plane's texture, so every ripple, fold and slide
 * carries the ink with it.
 *
 * The DOM copy is still the layout engine: fonts, sizes, colours, wrapping and
 * positions all come from CSS, and `printCopy()` simply reads the computed
 * styles and bounding boxes back out and paints them onto the canvas. That means
 * a rebrand through theme.json restyles the printed cloth for free, and there is
 * exactly one definition of the layout rather than a CSS one and a canvas one
 * that drift apart.
 *
 * WebGL, WITH A REAL FALLBACK
 * This is training material: it has to open on a locked-down laptop, in a
 * remote-desktop session, on a machine with WebGL disabled by policy. The DOM
 * panels and the DOM copy are always present and animate on their own; the
 * shader only ever replaces them when it can. Nobody gets a blank screen.
 *
 * THE LIBRARY'S ACTUAL CONTRACT (read from node_modules/curtainsjs/src, not
 * inferred — several bugs came from guessing it):
 *
 *   1. A custom shader is compiled VERBATIM (`Program.js: this.vsCode = ...`).
 *      curtains.js concatenates its precision/attribute/varying chunks into its
 *      OWN default shaders only, so a custom one declares everything itself.
 *   2. `aTextureCoord` arrives as 0..1 and `aVertexPosition` as -1..1
 *      (Geometry.js:168).
 *   3. The texture matrix uniform is `<samplerName>Matrix` (Texture.js:343) and
 *      exists ONLY when a texture does. An earlier version multiplied by a
 *      `planeTextureMatrix` that was never defined on an untextured plane: a
 *      zero matrix, all-zero UVs, curtain painted flat black.
 *   4. A FAILED SHADER COMPILE IS SILENT. Program.js falls back to the default
 *      fragment shader, which is literally `gl_FragColor = vec4(0,0,0,1)`. So
 *      "the curtain went black" is the symptom of *any* GLSL mistake, and it
 *      arrives with no console error. Suspect the shader first.
 *   5. Linked-program uniform discovery is stage-agnostic, but an unused texture
 *      matrix is optimised away before curtains.js can discover and upload it.
 *      The fragment stage therefore applies `uPrintMatrix` to the final cloth
 *      coordinate, where the nonlinear gather is already known.
 *   6. The gathered source coordinate is recomputed per fragment. At full draw
 *      the visible cloth spans fewer than six vertex columns, so interpolating
 *      a quadratic source map from the mesh visibly bends the printed copy.
 */

import gsap from 'gsap'

/* Fraction of the viewport each half still covers once drawn back. Wider than
   it was because the gather is now the point and it needs room to read. */
const SWAG = 0.12
/* THE DRAW IS PROMPT; THE FABRIC IS WHAT LAGS. A stage carrier needs a short,
   perceptible pull-up, a broad section of near-constant travel, then a measured
   brake. `power2.out` began at maximum velocity, which made the track launch
   mechanically rather than feel like a person taking the weight of the cloth. */
const DRAW_SECONDS = 1.05
const CLOSE_DRAW_SECONDS = DRAW_SECONDS * 1.35
const PULL_ACCEL = 0.14
const PULL_DECEL = 0.18
const CLOSE_ACCEL = 0.18
const CLOSE_DECEL = 0.28
/* The shader reads a normalised velocity. The peak for our carrier profile is
   not one unit per second: acceleration/deceleration consume some of the trip,
   so the cruise section travels a little faster to cover the full distance. */
const peakSpeed = (seconds: number, acceleration: number, deceleration: number) =>
  1 / (seconds * (1 - (acceleration + deceleration) / 2))
const OPEN_PEAK_DRAW = peakSpeed(DRAW_SECONDS, PULL_ACCEL, PULL_DECEL)
const CLOSE_PEAK_DRAW = peakSpeed(CLOSE_DRAW_SECONDS, CLOSE_ACCEL, CLOSE_DECEL)
const WHIP_STIFFNESS = 81 // (9 rad/s)^2 - a heavy drape's hem swings near 1.4Hz
const WHIP_DAMPING = 3.96 // 2 * 0.22 * 9 - underdamped, so it rings down rather than stopping dead
/* Frame rate for the SETTLED swag behind an open book. The closed curtain and
   the draw itself always run at full display rate — this only applies once the
   cloth has come to rest and is framing the book rather than being the subject. */
const IDLE_FPS = 20
/* Must match .curtain-panel width in curtain.css. */
const PANEL_WIDTH = 0.51
const PANEL_SWAG_SCALE = SWAG / PANEL_WIDTH

/**
 * A continuous carrier profile: accelerate, cruise, then brake. It deliberately
 * avoids an overshoot — the cloth's spring, not the rail, supplies the settle.
 */
function carrierEase(acceleration: number, deceleration: number): (progress: number) => number {
  const cruiseEnd = 1 - deceleration
  const peak = 1 / (1 - (acceleration + deceleration) / 2)
  return (progress) => {
    const t = Math.max(0, Math.min(1, progress))
    if (t < acceleration) return peak * t * t / (2 * acceleration)
    if (t <= cruiseEnd) return peak * (acceleration / 2 + t - acceleration)
    const local = t - cruiseEnd
    return peak * (acceleration / 2 + cruiseEnd - acceleration + local - local * local / (2 * deceleration))
  }
}

const OPEN_EASE = carrierEase(PULL_ACCEL, PULL_DECEL)
const CLOSE_EASE = carrierEase(CLOSE_ACCEL, CLOSE_DECEL)

const CLOTH = `
precision mediump float;

uniform float uTime;      /* SECONDS — see the note in onRender */
uniform float uOpen;      /* 0 = closed, 1 = fully drawn back */
uniform float uVel;       /* signed normalised draw speed: open > 0, close < 0 */
uniform float uWhip;      /* the underdamped hem lag that survives the tween */
uniform float uSwag;      /* final viewport width, not the old translation inset */
uniform float uAccel;     /* |d(uOpen)/dt|' — sway peaks when the pull starts and stops */

float hemWeight(float v) {
  float d = 1.0 - v;
  return d * d;
}

float leadingEdge(float v) {
  float track = mix(0.5, uSwag, uOpen);
  float hem = hemWeight(v);
  /* live and the 0.5 upper clamp keep both halves meeting exactly while closed;
     the lower clamp also gives cloth() an explicit non-zero divisor floor. */
  float live = smoothstep(0.0, 0.03, uOpen);
  float lag = uWhip * 0.085 * hem;
  /* The free edge must lead and lag in opposite directions. Using an absolute
     speed here made close look like the opening footage played in reverse. */
  float flap = sin(uTime * 5.3 - v * 4.0) * 0.012 * hem * clamp(uVel, -1.0, 1.0);
  return clamp(track + (lag + flap) * live, 0.006, 0.5);
}

/* .xy = cloth coord, .z = s (0 pinned .. 1 free edge), .w = local compression */
vec4 cloth(vec2 uv) {
  /* step selects the right half at the exact seam; mix mirrors the same map so
     the halves cannot drift into subtly different equations. */
  float side = step(0.5, uv.x);
  float edge = leadingEdge(uv.y);
  float safeEdge = max(edge, 0.006);
  float outerDistance = mix(uv.x, 1.0 - uv.x, side);
  float s = outerDistance / safeEdge;
  /* k stays below one, so f'(s) is strictly positive and the gather cannot fold
     back on itself even at peak draw speed. */
  float k = clamp(0.55 * uOpen + 0.25 * clamp(abs(uVel), 0.0, 1.0), 0.0, 0.85);
  float gathered = mix(s, s * s, k);
  float slope = (1.0 - k) + 2.0 * k * s;
  float fromOuter = 0.5 * gathered;
  float srcX = mix(fromOuter, 1.0 - fromOuter, side);
  float compression = 0.5 * slope / safeEdge;
  return vec4(srcX, uv.y, s, compression);
}

/* THE DISPLACEMENT, shared by both stages.
   It used to live only in the vertex shader, and the fragment stage faked its
   light response with col *= 1.0 + vWave * 1.6 — brightness driven by raw
   vertex height. That is not a normal, so it could never read as true fold
   depth however carefully it was tuned. Hoisting the height field here lets the
   fragment stage sample it a second time and derive a REAL surface normal. */
float clothHeight(vec2 uv) {
  vec4 c = cloth(uv);
  float v = clamp(abs(uVel), 0.0, 1.0);
  float free = clamp(c.z, 0.0, 1.0);
  float hem = hemWeight(uv.y);

  float pleat = sin(c.x * 28.0 + uTime * 0.5) * 0.03;
  /* Sway follows ACCELERATION, not speed. A curtain does not billow evenly
     through a steady pull — it lurches when the pull starts and swings when it
     stops, which is exactly where |acceleration| peaks and speed does not. */
  float belly = sin(c.x * 3.0 + uTime * 0.9) * (0.018 + 0.055 * v + 0.05 * abs(uAccel));
  float drag = sin((1.0 - c.z) * 9.0 - uTime * 5.0) * 0.05 * clamp(uVel, -1.0, 1.0);

  return pleat * mix(0.35, 1.0, free)
       + (belly + drag) * free * mix(0.4, 1.0, hem);
}

/* Two-tap forward difference — half the extra height() calls of a central
   difference, and at this fold frequency the quality loss is invisible.
   Explicit sampling rather than dFdx/dFdy: those need OES_standard_derivatives,
   which WebGL1 does not guarantee. */
vec3 clothNormal(vec2 uv, float h0) {
  const float E = 0.004;
  const float SCALE = 2.0;
  float hR = clothHeight(uv + vec2(E, 0.0));
  float hU = clothHeight(uv + vec2(0.0, E));
  return normalize(cross(vec3(E * SCALE, 0.0, hR - h0), vec3(0.0, E * SCALE, hU - h0)));
}`

const VERTEX = `${CLOTH}\n
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vUv;
varying float vWave;

void main() {
  vec3 p = aVertexPosition;
  vec2 uv = aTextureCoord;

  /* Folds are cut in cloth space so compression carries them with the material
     instead of letting the mesh slide through a screen-space wave. */
  p.z += clothHeight(uv);
  vWave = p.z;
  vUv = uv;

  gl_Position = uPMatrix * uMVMatrix * vec4(p, 1.0);
}`

const FRAGMENT = `${CLOTH}\n
varying vec2 vUv;
varying float vWave;

uniform sampler2D uPrint;
uniform mat4 uPrintMatrix;
uniform vec3 uTint;
uniform vec3 uTintLit;
uniform vec3 uTintDeep;
uniform vec3 uRim;

void main() {
  /* Recompute the nonlinear source map here rather than interpolating it from
     the 48-column mesh. At full draw fewer than six columns cover each visible
     strip, which would make a quadratic vSrc varying visibly warp the print. */
  vec4 c = cloth(vUv);
  /* Surviving fragments intentionally continue through the complete shading
     path; only pixels beyond either free edge expose the book underneath. */
  if (c.z > 1.0) discard;
  vec2 src = c.xy;
  float free = c.z;
  /* Bound compression before it reaches fine frequencies or reciprocal light. */
  float comp = clamp(c.w, 1.0, 24.0);

  /* Pleats, deliberately irregular — evenly spaced folds read as corrugated
     metal, not cloth. The max fixes a latent NaN: sin()*0.5+0.5 can round a
     hair below zero and pow() is undefined for a negative base. */
  float folds = max(sin(src.x * 46.0) * 0.5 + 0.5, 0.0);
  folds = pow(folds, 1.6);
  float drift = sin(src.x * 13.0 + 1.7) * 0.5 + 0.5;
  float pleat = mix(folds, drift, 0.34);

  /* Cloth gathers toward the hung outer edge, so folds tighten and darken
     outward from the centre. */
  float toOuter = abs(src.x - 0.5) * 2.0;
  pleat = mix(pleat, pleat * 0.55 + 0.22, toOuter * 0.7);

  /* Fine wrinkles appear only in a real bunch and fade again before compressed
     frequencies alias into moire across the narrow swag. */
  float fine = max(sin(src.x * 190.0 + 0.9) * 0.5 + 0.5, 0.0);
  /* Fine wrinkles wash out as the cloth moves — a motion cue that costs one
     mix() and reads as speed without any true motion blur. */
  float fineFade = (1.0 - smoothstep(6.0, 12.0, comp)) * (1.0 - 0.55 * clamp(abs(uVel), 0.0, 1.0));
  float gatherAmt = clamp((comp - 1.0) * 0.2, 0.0, 1.0) * fineFade;
  pleat = mix(pleat, pleat * 0.55 + fine * 0.45, gatherAmt * 0.6);

  /* Top-lit: a stage curtain is washed from above. v = 1 is the top.
     uTintLit is warm-shifted and uTintDeep cold-shifted in theme.ts — a
     warm/cool pair, because two tones of ONE hue read as flat no matter how far
     apart their luminance is. */
  vec3 base = mix(uTint, uTintLit, pow(max(src.y, 0.0), 1.6) * 0.6);
  vec3 col = mix(uTintDeep, base, 0.42 + pleat * 0.58);

  /* REAL SURFACE NORMAL, not raw vertex height. The old line multiplied
     brightness by vWave — the displacement value itself — which is a fake
     normal: it brightens wherever the cloth is high rather than wherever it
     FACES the light, so folds could never read as depth however hard it was
     tuned. Now the height field is sampled twice more to derive an actual
     normal, and the cloth is lit by it. */
  float h0 = clothHeight(vUv);
  vec3 N = clothNormal(vUv, h0);
  /* lit accumulates every MULTIPLICATIVE lighting term applied to the cloth
     from here down. The printing is multiplied by the same number at the end,
     which is what makes it read as dye IN the weave rather than a decal ON it:
     ink that does not darken in a crease and brighten on a crest is the single
     clearest tell that the copy is a separate layer. */
  float lambert = mix(0.52, 1.16, max(dot(N, normalize(vec3(0.15, 1.0, 0.65))), 0.0));
  float lit = lambert;
  col *= lambert;

  /* Grazing sheen — the fuzzy halo real fabric gets at glancing angles, and the
     cheapest single term that says "cloth" rather than "painted surface".
     Charlie-style falloff (Estevez & Kulla), which replaced Ashikhmin-Shirley
     precisely because its grazing transition was too harsh. */
  /* Base clamped into a named variable rather than inlined. N.z is a unit-vector
     component so 1 - max(N.z,0) is provably in [0,1] — but pow() with a negative
     base is UNDEFINED in GLSL and returns NaN silently, so the guard that flags
     any subtraction inside pow() earns its false positives. */
  float grazing = clamp(1.0 - max(N.z, 0.0), 0.0, 1.0);
  float sheen = pow(grazing, 3.0);
  col += uRim * sheen * 0.16 * (0.4 + 0.6 * free);

  /* IDLE LIFE. This closed scene is the first thing anyone sees and it sits
     there until somebody clicks, which may be a long while — a frozen still
     reads as a broken page. A LOCALISED travelling highlight rather than a
     global brightness wobble: on cloth this dark, a 15% change across the whole
     panel measured 5 units out of 255 and was invisible, but a moving band is
     read as motion because the eye tracks its edge, not the level. Lighting
     rather than geometry is deliberate — displacing this much surface is what
     made the text shimmer and the earlier curtain strobe. sweepPos oscillates
     rather than wrapping; fract() would snap the highlight across every cycle.
     It fades as the curtain opens so the swag sits quiet behind the book. */
  float sweepPos = 0.5 + 0.55 * sin(uTime * 0.28);
  /* d*d, NOT pow(d, 2.0): GLSL leaves pow() UNDEFINED for a negative base and d
     is negative across half the cloth. */
  float d = (src.x - sweepPos) * 3.0;
  float band = exp(-d * d);
  float breathe = 0.5 + 0.5 * sin(uTime * 0.21 + src.y * 1.1);
  float sweep = 1.0 + (band * 0.30 + breathe * 0.08) * (1.0 - uOpen * 0.75);
  col *= sweep; lit *= sweep;

  /* THE NAP. Velvet has a directional pile, so a broad soft sheen lies across
     the cloth at the height the light strikes it — DESIGN.md §6 calls it "the
     most recognisable property of the material and the cheapest to fake", and
     it is the difference between hung velvet and a coloured rectangle.

     Distinct from the top-lighting in the base tint above, which is a gradient running
     the full height. This is a BAND: it has a top edge and a bottom edge, and
     that is what the eye reads as pile catching light rather than as a surface
     getting paler upward. Wide (sigma ~0.22) because a tight band is a
     specular highlight on something hard, which is the opposite of the reading.

     Multiplied into lit as well as col, so the printed copy brightens
     through the nap exactly as the cloth does. Ink that ignores the pile is ink
     sitting on top of the fabric. */
  float napD = (src.y - 0.62) / 0.22;
  float nap = 1.0 + 0.17 * exp(-napD * napD);
  col *= nap; lit *= nap;

  /* THE BRAID. One fine line along each pleat crest, on the SAME period as the
     folds — so the lines belong to the cloth's structure rather than sitting on
     top of it as a printed stripe. Tied to the fold term for exactly that reason: a
     braid on its own frequency drifts off the crests as the cloth gathers.

     SCREEN-BLENDED, not multiplied. The metal has to GAIN light on dark cloth;
     multiplying a bright thread into a dark fabric only darkens it and the
     result goes muddy — §6 says so and the maths agrees, since multiply can
     never raise a value. Screen is a + b - a*b.

     It fades with the gather, because a braid crushed into a ten-times
     compressed swag would otherwise persist as a bright moire in the folds. */
  float crest = smoothstep(0.86, 1.0, folds);
  float braid = crest * 0.10 * (1.0 - smoothstep(2.0, 5.0, comp)) * (0.35 + 0.65 * free);
  col = col + uRim * braid - col * uRim * braid;

  /* THE PELMET CASTS DOWN. The cloth immediately below the rail is in its
     shadow, and without that the valance reads as stuck on rather than as
     standing in front of the fabric. Short — a pelmet is shallow, so its shadow
     is a band at the very top, not a gradient down the panel. */
  float pelmet = mix(0.62, 1.0, smoothstep(0.0, 0.085, 1.0 - src.y));
  col *= pelmet; lit *= pelmet;

  /* Contact shadow, confined to the bottom few percent. THE HEM POOLS: cloth is
     heavy and darkens into the floor. */
  float contact = mix(0.55, 1.0, smoothstep(0.0, 0.1, src.y));
  col *= contact; lit *= contact;

  /* Gathered cloth traps light between folds. The explicit denominator floor is
     redundant after comp's lower clamp but keeps reciprocal safety local. */
  float aoDenom = max(1.0 + 0.16 * (comp - 1.0), 0.001);
  float ao = max(1.0 / aoDenom, 0.45);
  col *= ao; lit *= ao;

  /* The free edge falls away into shadow, and its hem catches the house light.
     THE RIM IS THE SEPARATION. Against a near-black void a fill can never pull
     the gathered swag off the background — an edge can, which is why stage
     lighting rims performers rather than flooding them. It therefore has to be
     STRONGEST once the curtain has settled open and the swag sits there for the
     rest of the session; an earlier version gated it on draw velocity, so it
     faded out at precisely the moment it was needed. Velocity now only adds a
     flare on top. uRim is accent-derived and warm, against a cold void. */
  float edgeProx = smoothstep(0.86, 1.0, free);
  float rim = smoothstep(0.955, 1.0, free);
  float edgeFall = mix(1.0, 0.55, edgeProx);
  col *= edgeFall; lit *= edgeFall;
  float rimLight = 0.5 + 0.5 * uOpen + 0.3 * clamp(abs(uVel), 0.0, 1.0);
  col += uRim * rim * 0.55 * rimLight;

  /* A real closed curtain has a centre seam; this also masks any half-pixel gap
     at x = 0.5 while both independently rasterised halves still meet. */
  float seam = (1.0 - smoothstep(0.0, 0.012, abs(vUv.x - 0.5)))
             * (1.0 - smoothstep(0.0, 0.06, uOpen));
  /* Narrow. At 0.045 this spanned 9% of the screen and read as a GAP
     between two curtains rather than the join where they meet. */
  col *= 1.0 - seam * 0.22;

  /* THE INK — dyed into the weave, not printed on top of it.
     Applying the active texture matrix to src is essential: the old offset
     shortcut was only valid for rigid translation, not compression. */
  vec2 tex = (uPrintMatrix * vec4(src, 0.0, 1.0)).xy;
  vec4 ink = texture2D(uPrint, tex);

  /* THE WEAVE. Two crossed thread frequencies, sampled in src — the cloth's
     OWN material space, upstream of the gather — so the threads bunch and
     stretch with the fabric exactly as the printing does. Sampling in screen
     space instead would slide the weave across a moving curtain, which is the
     giveaway of a texture painted onto glass in front of the cloth.

     FREQUENCY IS THE WHOLE GAME HERE. The first attempt ran 420 threads across
     the panel: on a 1060px stage that is 2.5px per thread, well past what the
     sampler can resolve, and it aliased into an enormous checkerboard right
     across the photograph. A thread has to be several pixels wide to be a
     thread rather than a beat frequency. 96 x 68 puts one at roughly 11px, which
     reads as woven cloth and cannot alias; the amplitude stays shallow (4%)
     because a weave you can consciously see is a printed pattern, not a weave. */
  float warp = sin(src.x * 96.0);
  float weft = sin(src.y * 68.0);
  float weave = 1.0 + 0.04 * warp * weft;

  /* Crushed print vanishes into the folds rather than persisting as a smeared,
     ten-times-compressed title in the swag for the rest of the session. */
  float inkFade = 1.0 - smoothstep(1.6, 4.0, comp);

  /* THE WELD. lit carries every shading term the cloth received — lambert off the real
     surface normal, the travelling highlight, contact shadow, fold occlusion,
     the fall-off at the free edge. Multiplying the ink by it is what welds the
     two together: the title now darkens as a fold rolls under it and brightens
     as the crest comes back, because it is being lit as part of the same
     surface. A small amount of cloth is left showing through (0.14) so the dye
     never reads as fully opaque paint. Floored at 0.34 — dye in shadow is still
     dye, and letting it go to black loses the copy entirely in a deep crease. */
  vec3 dyed = ink.rgb * max(lit, 0.34) * weave;
  col = mix(col, dyed + col * 0.14, ink.a * inkFade);
  /* The grazing sheen crosses the printing too, but muted: dyed thread is
     flatter than bare thread, which is why lettering on a real banner goes
     matte exactly where the cloth beside it flares. */
  col += uRim * sheen * 0.05 * ink.a * inkFade;

  gl_FragColor = vec4(col, 1.0);
}`

const hexToVec3 = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const s = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [
    parseInt(s.slice(0, 2), 16) / 255,
    parseInt(s.slice(2, 4), 16) / 255,
    parseInt(s.slice(4, 6), 16) / 255,
  ]
}

/** A run of text that shares one colour — a title's accent word is its own run. */
interface Run { text: string; color: string }

/**
 * Rasterise the curtain copy onto a canvas, using the live DOM as the layout
 * engine. Reading computed styles back out means CSS stays the single source of
 * truth for type, colour and position: there is no second layout to keep in sync
 * and a theme change reprints the cloth automatically.
 */
function printCopy(canvas: HTMLCanvasElement, stage: HTMLElement): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = stage.clientWidth
  const h = stage.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const stageBox = stage.getBoundingClientRect()
  const rel = (el: Element) => {
    const r = el.getBoundingClientRect()
    return { x: r.left - stageBox.left, y: r.top - stageBox.top, w: r.width, h: r.height }
  }

  // ── the printed panel ───────────────────────────────────────────────────
  // Lifting the cloth to a properly lit navy fixed the curtain-vs-void problem
  // and immediately created a new one: the copy is printed ON that cloth, and
  // measured against the lit folds the standfirst fell to 1.50:1 and the eyebrow
  // to 1.99:1 — unreadable. A fixed ink colour cannot survive a surface whose
  // brightness varies by design.
  //
  // So the copy gets printed onto a darker panel, exactly as a real screen-
  // printed banner on a stage cloth would be. It is feathered, not a hard
  // rectangle, so it reads as dye soaked into the weave rather than a box pasted
  // on top — and because it travels in the texture, it gathers with the fabric.
  // ONE PLATE PER PANEL. `.curtain-copy` now spans the whole stage — plating it
  // as a single box would dye the entire cloth, including the join the copy was
  // deliberately moved away from. Each side gets its own soft patch instead, so
  // the darkening travels with the half of the curtain it belongs to.
  const css2 = getComputedStyle(document.documentElement)
  // Same rule as the shader's cloth colours: no stale-palette fallback. See the
  // `token` helper below — magenta on sight beats an old brand nobody notices.
  const deepTok = (css2.getPropertyValue('--deep') || '#FF00FF').trim()
  const [pr, pg, pb] = [1, 3, 5].map((i) => parseInt(deepTok.slice(i, i + 2), 16) || 0)
  for (const side of stage.querySelectorAll<HTMLElement>('.curtain-side')) {
    if (!side.textContent?.trim() && !side.querySelector('img')) continue
    const b = rel(side)
    const padX = b.w * 0.18
    const padY = b.h * 0.24
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    // ELLIPTICAL, by squashing the canvas around the block's centre before
    // drawing a circular gradient. A canvas radial gradient is always circular,
    // and a circle sized to a wide, short block never reaches its fade before it
    // runs out of vertical room — so the patch had hard top and bottom edges and
    // read as a painted BAND across the cloth rather than dye soaking outward.
    const rw = b.w / 2 + padX
    const rh = b.h / 2 + padY
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(1, rh / rw)
    const plate = ctx.createRadialGradient(0, 0, 0, 0, 0, rw)
    plate.addColorStop(0, `rgba(${pr},${pg},${pb},0.80)`)
    plate.addColorStop(0.5, `rgba(${pr},${pg},${pb},0.55)`)
    plate.addColorStop(1, `rgba(${pr},${pg},${pb},0)`)
    ctx.fillStyle = plate
    ctx.fillRect(-rw, -rw, rw * 2, rw * 2)
    ctx.restore()
  }

  // ── the photo ───────────────────────────────────────────────────────────
  const frame = stage.querySelector<HTMLElement>('.curtain-photo')
  if (frame) {
    const box = rel(frame)
    const img = frame.querySelector('img')
    const radius = parseFloat(getComputedStyle(frame).borderRadius) || 0
    ctx.save()
    ctx.beginPath()
    // roundRect is not everywhere yet; fall back to a plain rectangle rather
    // than losing the photo entirely on an older engine.
    if (typeof ctx.roundRect === 'function') ctx.roundRect(box.x, box.y, box.w, box.h, radius)
    else ctx.rect(box.x, box.y, box.w, box.h)
    ctx.clip()

    if (img && img.complete && img.naturalWidth > 0) {
      // object-fit: cover, by hand.
      const scale = Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh)
    } else {
      const plate = ctx.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h)
      const css = getComputedStyle(document.documentElement)
      plate.addColorStop(0, (css.getPropertyValue('--surface-alt') || '#FF00FF').trim())
      plate.addColorStop(1, (css.getPropertyValue('--deep') || '#FF00FF').trim())
      ctx.fillStyle = plate
      ctx.fillRect(box.x, box.y, box.w, box.h)
    }

    // FEATHER THE EDGES. A crisp rounded rectangle is the giveaway that the
    // picture is a separate object sitting in front of the curtain. Eating the
    // outermost few percent of its own alpha makes it bleed into the weave, the
    // way a photograph screen-printed onto cloth does — the ink thins at the
    // limit of the screen instead of stopping at a ruled line.
    // Done INSIDE the clip so it can only ever affect the photo.
    ctx.globalCompositeOperation = 'destination-out'
    const fw = box.w * 0.09
    const fh = box.h * 0.09
    // The gradient always runs OUTER EDGE -> INWARD, so each side needs its own
    // start and end point; reusing the rectangle's own corner for both collapses
    // it to a zero-length gradient that paints nothing.
    const eat = (
      x: number, y: number, w: number, h: number,
      gx0: number, gy0: number, gx1: number, gy1: number,
    ) => {
      const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1)
      g.addColorStop(0, 'rgba(0,0,0,0.85)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(x, y, w, h)
    }
    const { x: bx, y: by, w: bw, h: bh } = box
    eat(bx, by, fw, bh, bx, by, bx + fw, by)                       // left
    eat(bx + bw - fw, by, fw, bh, bx + bw, by, bx + bw - fw, by)   // right
    eat(bx, by, bw, fh, bx, by, bx, by + fh)                       // top
    eat(bx, by + bh - fh, bw, fh, bx, by + bh, bx, by + bh - fh)   // bottom
    ctx.restore()
  }

  // ── the type ────────────────────────────────────────────────────────────
  for (const sel of ['.curtain-eyebrow', '.curtain-title', '.curtain-sub']) {
    const el = stage.querySelector<HTMLElement>(sel)
    if (!el) continue
    const cs = getComputedStyle(el)
    // A hidden block still answers getComputedStyle and still has a (zero) box,
    // so without this the standfirst the settled layout switches off was still
    // being wrapped into a 0px-wide column and printed as a column of stray
    // fragments in the top corner of the swag.
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    const rawBox = rel(el)

    // VERTICAL TYPE HAS TO BE ROTATED BY HAND.
    //
    // A canvas 2D context has no `writing-mode`. Setting it in CSS turns the
    // element in the DOM and changes nothing here — the wrapper below simply
    // measured a 103px-wide box and broke "FIELD SAFETY WORKBOOK" into three
    // stacked fragments, which is what the swag was showing.
    //
    // So the CONTEXT is turned instead: rotate a quarter turn about the box's
    // centre and hand the wrapper the box with its sides swapped, so it lays
    // out along the long axis and never wraps. The left panel turns the other
    // way, so both read outward from the stage the way lettering on a real pair
    // of drapes does.
    const vertical = cs.writingMode.startsWith('vertical')
    const box = vertical
      ? { x: rawBox.x + (rawBox.w - rawBox.h) / 2, y: rawBox.y + (rawBox.h - rawBox.w) / 2, w: rawBox.h, h: rawBox.w }
      : rawBox
    ctx.save()
    if (vertical) {
      const cx = rawBox.x + rawBox.w / 2
      const cy = rawBox.y + rawBox.h / 2
      // `rotate(180deg)` in the CSS is what flips the left panel; read it back
      // rather than hard-coding which side is which.
      const flipped = cs.transform !== 'none' && cs.transform.startsWith('matrix(-1')
      ctx.translate(cx, cy)
      ctx.rotate(flipped ? -Math.PI / 2 : Math.PI / 2)
      ctx.translate(-cx, -cy)
    }

    ctx.font = cs.font && cs.font !== '' ? cs.font
      : `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const size = parseFloat(cs.fontSize) || 16
    const lineHeight = cs.lineHeight === 'normal' ? size * 1.2 : (parseFloat(cs.lineHeight) || size * 1.2)

    // Split into colour runs so a title's accent word keeps its own colour.
    const runs: Run[] = []
    el.childNodes.forEach((n) => {
      const text = n.textContent ?? ''
      if (!text.trim()) return
      const color = n.nodeType === 1
        ? getComputedStyle(n as Element).color
        : cs.color
      runs.push({ text, color })
    })
    if (runs.length === 0) continue

    // Word-wrap across runs, preserving each word's colour.
    type Word = { text: string; color: string }
    const words: Word[] = []
    runs.forEach((r, i) => {
      const parts = r.text.split(/\s+/).filter(Boolean)
      parts.forEach((p, j) => {
        // keep the space that separated runs
        words.push({ text: (i > 0 && j === 0 ? ' ' : '') + p, color: r.color })
      })
    })

    // Measure the candidate line EXACTLY, with no trailing space. Measuring
    // `word + " "` overstates every line by one space, which is enough to wrap
    // a single-line heading onto two and throw the whole block out of position
    // against the DOM it is supposed to mirror.
    const join = (ws: Word[]) => ws.map((wd, i) => (i === 0 ? wd.text : ` ${wd.text}`)).join('')
    const lines: Word[][] = [[]]
    for (const word of words) {
      const current = lines.at(-1)!
      if (current.length > 0 && ctx.measureText(join([...current, word])).width > box.w) {
        lines.push([word])
      } else {
        current.push(word)
      }
    }

    const uppercase = cs.textTransform === 'uppercase'
    ctx.textBaseline = 'middle'
    const totalH = lines.length * lineHeight
    let y = box.y + (box.h - totalH) / 2 + lineHeight / 2

    for (const line of lines) {
      const rendered = line.map((wd) => (uppercase ? wd.text.toUpperCase() : wd.text))
      const lineWidth = rendered.reduce((n, t, i) => n + ctx.measureText(i === 0 ? t : ` ${t}`).width, 0)
      // Canvas has no DOM layout pass to honour `text-align`, so position each
      // colour run ourselves. In particular, the left curtain is right-aligned
      // in CSS; treating every non-centred line as left-aligned moved its title
      // visibly toward the opening seam in the WebGL version only.
      const align = cs.textAlign === 'start'
        ? (cs.direction === 'rtl' ? 'right' : 'left')
        : cs.textAlign === 'end'
          ? (cs.direction === 'rtl' ? 'left' : 'right')
          : cs.textAlign
      let x = align === 'center'
        ? box.x + (box.w - lineWidth) / 2
        : align === 'right'
          ? box.x + box.w - lineWidth
          : box.x
      rendered.forEach((t, i) => {
        const piece = i === 0 ? t : ` ${t}`
        ctx.fillStyle = line[i]!.color
        ctx.fillText(piece, x, y)
        x += ctx.measureText(piece).width
      })
      y += lineHeight
    }
    // Pairs with the save() above — the rotation must not leak into the next
    // element, or every block after a vertical one is drawn on its side.
    ctx.restore()
  }
}

/** Wait for every image that will be baked into the cloth texture. */
function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      image.removeEventListener('load', done)
      image.removeEventListener('error', done)
      resolve()
    }
    image.addEventListener('load', done, { once: true })
    image.addEventListener('error', done, { once: true })
    // `decode()` resolves slightly later than `load`, when the pixels are safe
    // for drawImage(). The event listeners remain the compatibility fallback.
    void image.decode?.().then(done, () => {
      if (image.complete) done()
    })
  })
}

async function waitForCurtainAssets(stage: HTMLElement): Promise<void> {
  await document.fonts?.ready
  await Promise.all([...stage.querySelectorAll<HTMLImageElement>('.curtain-photo img')].map(waitForImage))
}

export interface CurtainHandle {
  open(): Promise<void>
  /** Bring the cloth back in. Resolves once it has closed. */
  close(): Promise<void>
  opened: boolean
}

interface CurtainPlane {
  uniforms: Record<string, { value: unknown }>
  onRender(cb: () => void): unknown
  textures?: Array<{ needUpdate?: () => void; resize?: () => void }>
  /** Tear the plane down — used when the device grades too slow for a shader. */
  remove?: () => void
}

export function initCurtain(onOpened: () => void): CurtainHandle | null {
  const found = document.querySelector<HTMLElement>('.curtain')
  if (!found) return null
  const stage: HTMLElement = found

  const panels = [...stage.querySelectorAll<HTMLElement>('.curtain-panel')]
  const handle: CurtainHandle = { opened: false, open: async () => {}, close: async () => {} }
  const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
  const reducedMotion = () => motionPreference?.matches ?? false

  const css = getComputedStyle(document.documentElement)
  // NO COLOUR FALLBACKS. These four used to carry hard-coded hexes from an
  // earlier palette — including an amber rim, which on the current teal arc is
  // precisely the warm-metal-on-cold-cloth combination the design singles out as
  // the one thing that breaks it. A fallback for a token the build always emits
  // is not a safety net; it is a second, stale palette lying in wait for the
  // first time a token fails to resolve, and it would repaint the brand without
  // anything reporting a problem. If the token is missing, that is a build bug
  // and it should be loud.
  // It does NOT throw: the curtain is the first thing on screen, and an
  // exception here would leave the reader looking at a blank stage with a book
  // they cannot open. So a missing token gets a console error and a flat
  // magenta — a colour no palette in this kit can produce, so it reads as a bug
  // on sight rather than passing for a design choice. The real guarantee is the
  // build-time check that these four are always emitted.
  const token = (name: string) => {
    const raw = css.getPropertyValue(name).trim()
    if (raw) return hexToVec3(raw)
    console.error(`curtain: ${name} is not declared — the cloth cannot be coloured correctly`)
    return hexToVec3('#FF00FF')
  }
  const tint = token('--curtain-cloth')
  const tintLit = token('--curtain-cloth-lit')
  const tintDeep = token('--curtain-cloth-deep')
  const rim = token('--curtain-rim')

  let curtains: {
    resize?: () => void
    enableDrawing?: () => void
    disableDrawing?: () => void
    needRender?: () => void
  } | null = null
  let plane: CurtainPlane | null = null
  let webglPending = false
  let idleTimer: ReturnType<typeof setTimeout> | undefined
  /** Drives the settled swag at IDLE_FPS instead of leaving it a still image. */
  let idleTick: ReturnType<typeof setInterval> | undefined
  let drawingPaused = false
  let activeTimeline: ReturnType<typeof gsap.timeline> | null = null
  let completeTransition: (() => void) | null = null
  let activePeakSpeed = OPEN_PEAK_DRAW

  const cancelIdlePause = () => {
    clearTimeout(idleTimer)
    idleTimer = undefined
  }
  const resumeDrawing = () => {
    cancelIdlePause()
    clearInterval(idleTick)
    idleTick = undefined
    if (!curtains || !drawingPaused) return
    drawingPaused = false
    curtains.enableDrawing?.()
    curtains.needRender?.()
  }
  /**
   * SLOW THE SWAG DOWN; DO NOT STOP IT.
   *
   * The cloth behind an open book is the whole reason the page reads as a stage
   * rather than a slide, and a curtain frozen mid-breath is a photograph of a
   * curtain. This used to call `disableDrawing()` and leave it there — measured
   * at 0 draws per second once the book opened, which is a still image.
   *
   * So drawing is disabled (that is what stops curtains.js running its own rAF
   * at display rate) and one frame is requested on a timer instead.
   * `needRender()` is honoured while drawing is disabled, which is exactly the
   * primitive needed. The shader's motion is driven by wall-clock `uTime`, not
   * by a frame counter, so the breathing keeps the same real-world speed — it is
   * simply sampled less often.
   *
   * IDLE_FPS 20 rather than something smoother because the settled motion is
   * genuinely slow (the sweep oscillates at 0.28 rad/s, the breathe at 0.21), and
   * a low sample rate is only visible on fast movement. It is a sixth of the work
   * for animation you can still see.
   *
   * Note what is NOT throttled: the closed curtain, and the draw itself. Those
   * run at full display rate, because that is the part anyone actually watches —
   * the file sits closed on a projector until the session starts.
   */
  const pauseDrawing = () => {
    if (!curtains || drawingPaused) return
    drawingPaused = true
    curtains.disableDrawing?.()
    curtains.needRender?.()
    clearInterval(idleTick)
    idleTick = setInterval(() => {
      // Nothing to draw into a hidden tab; the browser throttles the timer
      // anyway, but skipping keeps it honest on a backgrounded projector.
      if (document.visibilityState === 'visible') curtains?.needRender?.()
    }, Math.round(1000 / IDLE_FPS))
  }
  const queueIdlePause = () => {
    if (!handle.opened || drawingPaused || idleTimer) return
    idleTimer = setTimeout(() => {
      idleTimer = undefined
      if (handle.opened) pauseDrawing()
    }, 280)
  }
  const setFallbackPanels = (open: boolean) => {
    gsap.set(panels, {
      xPercent: 0,
      scaleX: open ? PANEL_SWAG_SCALE : 1,
      skewY: 0,
    })
  }

  async function tryWebGL(): Promise<void> {
    if (reducedMotion() || plane || webglPending) return

    // ── THE CLOTH IS THE FIRST THING TO GO ON A SLOW MACHINE ──────────────
    //
    // The runtime grades the device from its own frame timings and puts
    // perf-full / perf-lite / perf-min on <html>. That grading stripped blurs
    // and shadows and never touched this, which left the single most expensive
    // thing on the page running on exactly the machine that could not afford
    // it: a per-fragment shader over the whole viewport, every frame.
    //
    // Measured on software-rendered WebGL — no GPU, which is what a locked-down
    // corporate laptop hands you, and precisely this kit's audience — a 2.2
    // second curtain took TWENTY-FIVE seconds. The reader's first impression of
    // the whole book is a stuck screen.
    //
    // There is already a complete DOM curtain underneath: it is the fallback
    // for machines with WebGL disabled by policy, it animates on its own, and
    // it is what the design's own notes describe as the plain, well-lit cloth.
    // Falling back to it costs the woven-in printing and the lit folds. Not
    // falling back costs the opening.
    //
    // Checked at the moment of use rather than at load, because the grade
    // arrives a second in and is re-taken on resize.
    if (document.documentElement.classList.contains('perf-min')) {
      stage.classList.add('no-gl')
      return
    }

    webglPending = true
    let host: HTMLDivElement | null = null
    try {
      const { Curtains, Plane } = await import('curtainsjs')
      if (handle.opened) return

      // Fonts and images are both part of a one-shot raster. Re-check after
      // awaiting them: a fast click may have opened the CSS fallback while the
      // assets decoded, in which case a late closed WebGL curtain must never be
      // attached on top of the book.
      await waitForCurtainAssets(stage)
      if (handle.opened || reducedMotion()) return

      // The plane element carries the canvas the shader samples. It is created
      // here rather than in the markup so that a no-WebGL reader never receives
      // a stray empty element.
      host = document.createElement('div')
      host.className = 'curtain-plane'
      const print = document.createElement('canvas')
      print.setAttribute('aria-hidden', 'true')
      host.appendChild(print)
      stage.appendChild(host)
      printCopy(print, stage)

      const instance = new Curtains({
        container: 'curtain-gl',
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        watchScroll: false,
        production: true,
      })
      instance.onError(() => { stage.classList.remove('gl'); stage.classList.add('no-gl') })
      instance.onContextLost(() => { stage.classList.remove('gl'); stage.classList.add('no-gl') })

      // `transparent` is documented in Plane.js and honoured at runtime, but is
      // missing from the shipped types/index.d.ts — same gap as `Vec3`. Without
      // it the discarded strip between the parted halves would not blend.
      const p = new Plane(instance, host, {
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        // 64x28 (1792 verts, up from 960): trivial cost, and it reduces the
        // silhouette faceting that shows near maximum compression.
        widthSegments: 64,
        heightSegments: 28,
        transparent: true,
        texturesOptions: { sampler: 'uPrint' },
        uniforms: {
          uTime: { name: 'uTime', type: '1f', value: 0 },
          uOpen: { name: 'uOpen', type: '1f', value: 0 },
          // uSwag is now the final swag WIDTH, not the old inset into the
          // centre that `shift = uOpen * (0.5 - uSwag)` subtracted. Halving it
          // here, as the translation version did, would leave a 6% swag.
          uSwag: { name: 'uSwag', type: '1f', value: SWAG },
          uVel: { name: 'uVel', type: '1f', value: 0 },
          uWhip: { name: 'uWhip', type: '1f', value: 0 },
          uAccel: { name: 'uAccel', type: '1f', value: 0 },
          uTint: { name: 'uTint', type: '3f', value: tint },
          uTintLit: { name: 'uTintLit', type: '3f', value: tintLit },
          uTintDeep: { name: 'uTintDeep', type: '3f', value: tintDeep },
          uRim: { name: 'uRim', type: '3f', value: rim },
        },
      } as never) as unknown as CurtainPlane

      // uTime must be SECONDS. Incrementing once per frame (the obvious thing,
      // and what the library's examples do) advances the wave by its full
      // coefficient EVERY FRAME: the cloth strobed about six times a second and
      // the whole curtain read as broken. Wall time also keeps the speed equal
      // on a 60Hz laptop and a 120Hz display.
      const t0 = performance.now()
      let lastFrame = t0
      // Seeded from the live uniform, never from a literal 0, so the very first
      // frame differences to zero however uOpen was initialised.
      let lastOpen = p.uniforms.uOpen.value as number
      let whip = 0
      let whipSpeed = 0
      let lastSpeed = 0
      p.onRender(() => {
        const now = performance.now()
        if (!reducedMotion()) p.uniforms.uTime.value = (now - t0) / 1000

        // Clamped at both ends: a backgrounded tab hands back one enormous dt
        // that would blow the spring up, and a 240Hz display hands back one
        // small enough to stall it. Worst case here is dt = 1/20, where
        // omega * dt = 0.45 — comfortably inside semi-implicit Euler's stable
        // range of 2.
        const dt = Math.min(Math.max((now - lastFrame) / 1000, 1 / 240), 1 / 20)
        lastFrame = now

        const open = p.uniforms.uOpen.value as number
        if (reducedMotion()) {
          // System preferences can change while the book is open. Keep the
          // shader static too — not merely the GSAP timeline — or its idle
          // highlight continues moving on the path that promised no motion.
          lastOpen = open
          lastSpeed = 0
          whip = 0
          whipSpeed = 0
          p.uniforms.uVel.value = 0
          p.uniforms.uAccel.value = 0
          p.uniforms.uWhip.value = 0
          queueIdlePause()
          return
        }

        const speed = Math.max(-1.5, Math.min(1.5, (open - lastOpen) / dt / activePeakSpeed))
        lastOpen = open
        p.uniforms.uVel.value = speed

        // Sway follows ACCELERATION, not speed. Fabric lurches when the pull
        // begins and swings when it stops — both moments of high |acceleration|
        // and, in the case of the stop, near-zero speed. Driving billow off
        // velocity meant the cloth was most active mid-draw, when a real curtain
        // is simply travelling.
        p.uniforms.uAccel.value = Math.max(-2, Math.min(2, (speed - lastSpeed) / dt * 0.15))
        lastSpeed = speed

        // A one-degree-of-freedom spring dragged along by the draw speed. It
        // lags going out and rings down AFTER the tween has finished, which is
        // the settle a tween on its own cannot express — the tween stops dead
        // at its final value, cloth does not.
        whipSpeed += ((speed - whip) * WHIP_STIFFNESS - whipSpeed * WHIP_DAMPING) * dt
        whip += whipSpeed * dt
        p.uniforms.uWhip.value = whip

        // The opening keeps a little life while waiting for a click, but once
        // the swag has settled behind the book no pixel changes. Freeze the
        // expensive full-viewport draws only then; close() resumes them first.
        if (handle.opened && open > 0.999 && Math.abs(speed) < 0.003
          && Math.abs(whip) < 0.002 && Math.abs(whipSpeed) < 0.004) queueIdlePause()
        else cancelIdlePause()
      })

      plane = p
      curtains = instance as never
      stage.classList.remove('no-gl')
      stage.classList.add('gl')
    } catch (err) {
      host?.remove()
      console.warn('[curtain] WebGL unavailable, using the CSS curtain:', err)
      stage.classList.add('no-gl')
    } finally {
      webglPending = false
    }
  }

  void tryWebGL()

  // THE GRADE ARRIVES AFTER THE CURTAIN HAS ALREADY STARTED, so the check
  // inside tryWebGL only catches a device that was already known to be slow.
  // The common case is the opposite: the shader starts, the machine turns out
  // to be software-rendering it, and the grading notices a second later — by
  // which point the reader is watching a stuck screen. Watching for the class
  // is what closes that gap, and it is the same one decision either way.
  //
  // The cloth is torn down rather than throttled. Throttling a shader that is
  // already missing frames just makes it miss them in a rhythm.
  new MutationObserver(() => {
    if (!document.documentElement.classList.contains('perf-min')) return
    if (!plane && !webglPending) return
    try {
      curtains?.disableDrawing?.()
      plane?.remove?.()
    } catch { /* a torn-down context throwing is not worth failing the page for */ }
    plane = null
    stage.querySelector('#curtain-gl canvas')?.remove()
    stage.classList.remove('gl')
    stage.classList.add('no-gl')
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  // ── the draw ────────────────────────────────────────────────────────────
  handle.open = () =>
    new Promise<void>((resolve) => {
      if (handle.opened) return resolve()
      handle.opened = true
      document.body.classList.add('curtain-open')
      resumeDrawing()

      const finish = () => {
        activeTimeline = null
        completeTransition = null
        // RE-PRINT THE CLOTH FOR THE SWAG.
        //
        // The copy lives in the texture and gathers with the fabric, so the
        // closed layout — centred in each half — ends up in the part that
        // compresses six times over and `inkFade` correctly erases it. Moving
        // the copy into the outer band and printing again puts it where the
        // cloth stays uncompressed and on screen, so the message survives the
        // opening instead of leaving with it.
        //
        // A class and a re-print, no shader change: `printCopy()` reads the
        // DOM's computed layout, so curtain.css remains the single source of
        // truth for both compositions. Deferred a frame so the settled layout
        // has actually been laid out before it is measured.
        stage.classList.add('settled')
        requestAnimationFrame(() => {
          const print = stage.querySelector<HTMLCanvasElement>('.curtain-plane canvas')
          if (print) {
            printCopy(print, stage)
            plane?.textures?.[0]?.needUpdate?.()
          }
        })
        onOpened()
        resolve()
      }
      completeTransition = finish

      if (reducedMotion()) {
        if (plane) plane.uniforms.uOpen.value = 1
        setFallbackPanels(true)
        finish()
        return
      }

      const tl = gsap.timeline({ onComplete: finish })
      activeTimeline = tl

      if (plane) {
        // The cloth parts entirely inside the shader, so there is nothing to
        // keep in register — one carrier drives fabric, fold lighting and print.
        activePeakSpeed = OPEN_PEAK_DRAW
        tl.to(plane.uniforms.uOpen, { value: 1, duration: DRAW_SECONDS, ease: OPEN_EASE }, 0)
      } else {
        // Scaling around the hung edge compresses the pleats into a believable
        // swag. Plain translation kept both fallback panels as rigid sheets.
        tl.to(panels, { xPercent: 0, scaleX: PANEL_SWAG_SCALE, duration: DRAW_SECONDS, ease: OPEN_EASE }, 0)
          .to(panels[0]!, { skewY: -0.8, duration: DRAW_SECONDS * 0.72, ease: OPEN_EASE }, 0)
          .to(panels[1]!, { skewY: 0.8, duration: DRAW_SECONDS * 0.72, ease: OPEN_EASE }, 0)
          .to(panels, { skewY: 0, duration: DRAW_SECONDS * 0.28, ease: 'sine.out' }, DRAW_SECONDS * 0.72)
          // Only the DOM copy needs fading: the printed copy leaves with the
          // cloth it is printed on.
          .to('.curtain-copy', { opacity: 0, y: -18, duration: 0.5, ease: 'power2.in' }, 0)
      }

      // The hint pulses via CSS keyframes, and a running animation OUTRANKS an
      // inline style: tweening opacity alone left it visibly blinking over the
      // open book at 0.91 while the inline value said 0.
      tl.set('.curtain-hint', { animation: 'none' }, 0)
        .to('.curtain-hint', { opacity: 0, duration: 0.3 }, 0)
    })

  // ── the reverse ─────────────────────────────────────────────────────────
  // Bringing the cloth back in is NOT the open timeline played backwards: the
  // hem spring is integrated forward in real time, so it has to be driven by a
  // genuine forward tween of uOpen towards 0. Reversing a timeline would rewind
  // the tween but not the spring, and the whip would fight the travel.
  handle.close = () =>
    new Promise<void>((resolve) => {
      if (!handle.opened) return resolve()
      handle.opened = false
      resumeDrawing()
      // The curtain takes back the screen: it must intercept clicks again, and
      // the book beneath must stop being reachable through it.
      document.body.classList.remove('curtain-done')

      const finish = () => {
        activeTimeline = null
        completeTransition = null
        document.body.classList.remove('curtain-open')
        resolve()
      }
      completeTransition = finish

      if (reducedMotion()) {
        if (plane) plane.uniforms.uOpen.value = 0
        setFallbackPanels(false)
        gsap.set(['.curtain-copy', '.curtain-hint'], { opacity: 1, y: 0, clearProps: 'animation' })
        finish()
        return
      }

      const tl = gsap.timeline({ onComplete: finish })
      activeTimeline = tl

      if (plane) {
        // Closing takes a fraction longer, takes up speed under its own weight,
        // then brakes before the two leading edges meet. The signed spring keeps
        // moving after the carrier stops, producing the small seam rebound.
        activePeakSpeed = CLOSE_PEAK_DRAW
        tl.to(plane.uniforms.uOpen, {
          value: 0, duration: CLOSE_DRAW_SECONDS, ease: CLOSE_EASE,
        }, 0)
      } else {
        tl.to(panels, { xPercent: 0, scaleX: 1, duration: CLOSE_DRAW_SECONDS, ease: CLOSE_EASE }, 0)
          .to(panels[0]!, { skewY: 0.65, duration: CLOSE_DRAW_SECONDS * 0.7, ease: CLOSE_EASE }, 0)
          .to(panels[1]!, { skewY: -0.65, duration: CLOSE_DRAW_SECONDS * 0.7, ease: CLOSE_EASE }, 0)
          .to(panels, { skewY: 0, duration: CLOSE_DRAW_SECONDS * 0.3, ease: 'sine.out' }, CLOSE_DRAW_SECONDS * 0.7)
          .to('.curtain-copy', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, CLOSE_DRAW_SECONDS * 0.48)
      }

      // Restore the hint, including the pulse the open path had to switch off.
      tl.to('.curtain-hint', { opacity: 1, duration: 0.4 }, 0.8)
        .set('.curtain-hint', { clearProps: 'animation' })
    })

  // `prefers-reduced-motion` is live. A reader can switch it in the operating
  // system while this standalone file is open, so settle an in-flight timeline
  // rather than leaving either the shader or the CSS fallback moving.
  const applyMotionPreference = () => {
    if (!reducedMotion()) {
      if (!plane) void tryWebGL()
      if (!handle.opened) resumeDrawing()
      if (!handle.opened) gsap.set('.curtain-hint', { clearProps: 'animation' })
      return
    }

    activeTimeline?.kill()
    activeTimeline = null
    cancelIdlePause()
    if (plane) {
      plane.uniforms.uOpen.value = handle.opened ? 1 : 0
      plane.uniforms.uVel.value = 0
      plane.uniforms.uAccel.value = 0
      plane.uniforms.uWhip.value = 0
    }
    setFallbackPanels(handle.opened)
    gsap.set('.curtain-copy', { opacity: handle.opened ? 0 : 1, y: 0 })
    gsap.set('.curtain-hint', {
      opacity: handle.opened ? 0 : 1,
      animation: 'none',
    })
    const finish = completeTransition
    completeTransition = null
    finish?.()
    pauseDrawing()
  }
  motionPreference?.addEventListener('change', applyMotionPreference)

  const trigger = (e: Event) => {
    if (handle.opened) return
    e.preventDefault()
    void handle.open()
  }
  stage.addEventListener('click', trigger)
  stage.addEventListener('wheel', trigger, { passive: false })
  stage.addEventListener('touchstart', trigger, { passive: false })
  document.addEventListener('keydown', (e) => {
    if (!handle.opened && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) trigger(e)
  })

  // A resize re-lays-out the DOM copy, so the cloth has to be reprinted from it
  // or the ink keeps the old screen's geometry.
  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  window.addEventListener('resize', () => {
    curtains?.resize?.()
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const print = stage.querySelector<HTMLCanvasElement>('.curtain-plane canvas')
      if (!print) return
      printCopy(print, stage)
      plane?.textures?.[0]?.resize?.()
      plane?.textures?.[0]?.needUpdate?.()
    }, 180)
  })

  return handle
}
