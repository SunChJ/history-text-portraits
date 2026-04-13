import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './App.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Word = {
  text: string
  x: number
  y: number
  size?: number
}

type Figure = {
  id: string
  name: string
  dynasty: string
  years: string
  subtitle: string
  quote: string
  summary: string
  curator: string
  accent: string
  tags: string[]
  words: Word[]
}

type Mode = {
  id: 'constellation' | 'scanner' | 'vortex'
  no: string
  title: string
  english: string
  subtitle: string
  mood: string
  tech: string
  refs: string[]
}

const modes: Mode[] = [
  {
    id: 'constellation',
    no: '01',
    title: '星图成像',
    english: 'Constellation Body',
    subtitle: '文字点云 / 稳定聚合 / 微呼吸',
    mood: '像人物由词语冷静聚合成一尊点云雕像。',
    tech: 'three.js Points + custom shader + text mask sampling',
    refs: ['74', '29'],
  },
  {
    id: 'scanner',
    no: '02',
    title: '层析遗影',
    english: 'Scanner Reliquary',
    subtitle: '扫描切层 / 垂直错位 / 档案读取',
    mood: '像档案馆里的扫描机正在逐层读取一个历史人物。',
    tech: 'ShaderMaterial + scanline uniforms + GSAP timeline',
    refs: ['28', '43'],
  },
  {
    id: 'vortex',
    no: '03',
    title: '旋汇成形',
    english: 'Vortex Assembly',
    subtitle: '旋涡聚散 / 轨道吸附 / 技术装置感',
    mood: '像漂浮的文字碎片被一台装置重新组装成人像。',
    tech: 'morph uniforms + orbital source positions + GSAP reveal',
    refs: ['28', '74'],
  },
]

const figures: Figure[] = [
  {
    id: 'sushi',
    name: '苏轼',
    dynasty: '北宋',
    years: '1037 — 1101',
    subtitle: '被月色、江流、贬谪与旷达共同塑造出来的人。',
    quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
    summary:
      '这里的人像不该是插图，而应是一个由词语自行聚合的精神体。苏轼的轮廓由“东坡、赤壁、黄州、明月、江流”这些词构成，近看是词，远看是人。',
    curator: '他最动人的地方，是把人生的下降重新组织成一种可供后人借用的尺度。',
    accent: '#d3a164',
    tags: ['东坡', '赤壁', '黄州', '明月', '江流'],
    words: [
      { text: '东坡', x: 50, y: 14, size: 42 },
      { text: '旷达', x: 34, y: 20, size: 30 },
      { text: '赤壁', x: 66, y: 20, size: 30 },
      { text: '明月', x: 42, y: 28, size: 24 },
      { text: '江流', x: 62, y: 31, size: 24 },
      { text: '黄州', x: 27, y: 37, size: 24 },
      { text: '贬谪', x: 53, y: 38, size: 28 },
      { text: '诗词', x: 71, y: 39, size: 28 },
      { text: '人生如逆旅', x: 31, y: 49, size: 22 },
      { text: '豁达', x: 51, y: 51, size: 36 },
      { text: '风骨', x: 69, y: 53, size: 28 },
      { text: '书画', x: 38, y: 64, size: 22 },
      { text: '自嘲', x: 58, y: 66, size: 22 },
      { text: '千古', x: 50, y: 80, size: 28 },
    ],
  },
  {
    id: 'wuzetian',
    name: '武则天',
    dynasty: '武周',
    years: '624 — 705',
    subtitle: '被诏令、秩序、争议与史官同时塑造出来的人。',
    quote: '她的形象，常常比她本人更像一场叙述斗争。',
    summary:
      '这个人像不应该平滑，而应该带着压迫性的秩序感：诏令、帝国、改制、争议同时挂在轮廓里，像扫描层一样彼此叠压。',
    curator: '她不该被单一判断消化掉，最准确的展示方式是让多种叙述同时停留。',
    accent: '#c46b76',
    tags: ['女皇', '诏令', '改制', '帝国', '争议'],
    words: [
      { text: '女皇', x: 50, y: 14, size: 42 },
      { text: '权力', x: 34, y: 20, size: 30 },
      { text: '诏令', x: 66, y: 20, size: 28 },
      { text: '秩序', x: 50, y: 30, size: 38 },
      { text: '改制', x: 28, y: 36, size: 24 },
      { text: '史官', x: 71, y: 36, size: 24 },
      { text: '武周', x: 40, y: 44, size: 30 },
      { text: '争议', x: 60, y: 47, size: 28 },
      { text: '统治', x: 31, y: 56, size: 24 },
      { text: '革新', x: 52, y: 58, size: 28 },
      { text: '帝国', x: 71, y: 59, size: 24 },
      { text: '形象', x: 49, y: 80, size: 28 },
    ],
  },
  {
    id: 'caocao',
    name: '曹操',
    dynasty: '东汉末',
    years: '155 — 220',
    subtitle: '被雄心、军政、诗歌与戏剧脸谱共同塑造出来的人。',
    quote: '对酒当歌，人生几何。',
    summary:
      '曹操适合做成高速聚散的装置：词语像军阵一样排列，又像脸谱一样不断变化，保持其复杂与不稳定。',
    curator: '他的复杂不在于选哪一个判断，而在于多个互相冲突的判断都同时成立。',
    accent: '#7a8fda',
    tags: ['魏武', '官渡', '军政', '短歌行', '多面'],
    words: [
      { text: '魏武', x: 50, y: 14, size: 42 },
      { text: '挟天子', x: 34, y: 20, size: 24 },
      { text: '诗人', x: 66, y: 20, size: 24 },
      { text: '雄才', x: 49, y: 30, size: 38 },
      { text: '北方', x: 28, y: 36, size: 24 },
      { text: '猜忌', x: 71, y: 36, size: 26 },
      { text: '赤壁', x: 33, y: 47, size: 30 },
      { text: '用人', x: 52, y: 50, size: 28 },
      { text: '军政', x: 70, y: 50, size: 24 },
      { text: '短歌行', x: 38, y: 63, size: 22 },
      { text: '多面', x: 58, y: 65, size: 28 },
      { text: '天下', x: 50, y: 80, size: 24 },
    ],
  },
]

function hexToColor(hex: string) {
  return new THREE.Color(hex)
}

function buildTextMask(figure: Figure) {
  const width = 512
  const height = 704
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'

  for (const word of figure.words) {
    const size = word.size ?? 28
    ctx.font = `700 ${size}px "Noto Serif SC", "Songti SC", serif`
    ctx.fillText(word.text, (word.x / 100) * width, (word.y / 100) * height)
  }

  const image = ctx.getImageData(0, 0, width, height).data
  const positions: number[] = []
  const seeds: number[] = []
  const scales: number[] = []
  const sourcePositions: number[] = []

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const alpha = image[(y * width + x) * 4 + 3]
      if (alpha < 20) continue

      const nx = x / width - 0.5
      const ny = 0.5 - y / height
      positions.push(nx * 2.05, ny * 2.78, (Math.random() - 0.5) * 0.22)

      const theta = Math.random() * Math.PI * 2
      const radius = 0.45 + Math.random() * 1.7
      const spiral = (Math.random() - 0.5) * 2.2
      sourcePositions.push(Math.cos(theta) * radius, spiral, Math.sin(theta) * radius)

      seeds.push(Math.random(), Math.random(), Math.random())
      scales.push(Math.random())
    }
  }

  return {
    positions: new Float32Array(positions),
    seeds: new Float32Array(seeds),
    scales: new Float32Array(scales),
    sourcePositions: new Float32Array(sourcePositions),
  }
}

const vertexShader = /* glsl */ `
attribute vec3 aSeed;
attribute float aScale;
attribute vec3 aSource;
uniform float uTime;
uniform float uReveal;
uniform float uMode;
uniform float uPixelRatio;
varying float vAlpha;
varying float vScan;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec3 target = position;
  vec3 source = aSource;
  float t = uTime;
  float reveal = smoothstep(0.0, 1.0, uReveal);

  target.z += sin(t * 0.8 + aSeed.x * 6.2831) * 0.03;

  vec3 displaced = target;
  float scan = 0.0;

  if (uMode < 0.5) {
    displaced.xy += vec2(
      sin(t * 0.9 + aSeed.y * 9.0),
      cos(t * 0.8 + aSeed.x * 7.0)
    ) * 0.012;
  } else if (uMode < 1.5) {
    float band = smoothstep(-0.35, 0.1, target.y - sin(t * 0.8) * 0.15) * (1.0 - smoothstep(0.1, 0.42, target.y - sin(t * 0.8) * 0.15));
    displaced.x += band * (0.18 + aSeed.x * 0.16) * sin(t * 4.0 + target.y * 11.0 + aSeed.z * 5.0);
    displaced.z += band * 0.15;
    scan = band;
  } else {
    float swirl = 1.0 - reveal;
    float angle = (aSeed.x * 6.2831) + t * (0.4 + aSeed.z * 0.8);
    vec3 orbit = vec3(cos(angle), sin(angle * 1.1), sin(angle)) * (0.5 + aSeed.y * 1.8);
    source += orbit * swirl;
    displaced = mix(source, target, reveal);
  }

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = (4.0 + aScale * 7.0 + scan * 8.0) * uPixelRatio;
  gl_PointSize = size * (1.0 / -mvPosition.z);
  vAlpha = 0.45 + aScale * 0.45 + scan * 0.35;
  vScan = scan;
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
varying float vAlpha;
varying float vScan;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  float core = smoothstep(0.42, 0.0, dist);
  float glow = smoothstep(0.5, 0.12, dist);
  vec3 color = mix(uColor, vec3(1.0), vScan * 0.45);
  gl_FragColor = vec4(color, (core * 0.72 + glow * 0.22) * vAlpha);
}
`

function PortraitScene({ figure, mode }: { figure: Figure; mode: Mode['id'] }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const uniformsRef = useRef<{
    uTime: { value: number }
    uReveal: { value: number }
    uMode: { value: number }
    uColor: { value: THREE.Color }
    uPixelRatio: { value: number }
  } | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(root.clientWidth, root.clientHeight)
    renderer.setClearColor(0x000000, 0)
    root.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, root.clientWidth / root.clientHeight, 0.1, 100)
    camera.position.set(0, 0.08, 5.4)

    const group = new THREE.Group()
    scene.add(group)

    const data = buildTextMask(figure)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(data.scales, 1))
    geometry.setAttribute('aSource', new THREE.BufferAttribute(data.sourcePositions, 3))

    const uniforms = {
      uTime: { value: 0 },
      uReveal: { value: mode === 'vortex' ? 0 : 1 },
      uMode: { value: mode === 'constellation' ? 0 : mode === 'scanner' ? 1 : 2 },
      uColor: { value: hexToColor(figure.accent) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }
    uniformsRef.current = uniforms

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    group.add(points)

    const ambient = new THREE.PointLight(figure.accent, 4.2, 12)
    ambient.position.set(0.4, 1.1, 2.6)
    scene.add(ambient)

    const haloGeometry = new THREE.RingGeometry(1.4, 1.55, 96)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: figure.accent,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.position.z = -0.6
    scene.add(halo)

    const clock = new THREE.Clock()
    let raf = 0

    const render = () => {
      raf = requestAnimationFrame(render)
      const t = clock.getElapsedTime()
      uniforms.uTime.value = t
      group.rotation.y = Math.sin(t * 0.2) * 0.24
      group.rotation.x = Math.cos(t * 0.18) * 0.06
      halo.rotation.z = t * 0.12
      renderer.render(scene, camera)
    }

    render()

    const onResize = () => {
      if (!root) return
      camera.aspect = root.clientWidth / root.clientHeight
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(root.clientWidth, root.clientHeight)
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      haloGeometry.dispose()
      haloMaterial.dispose()
      renderer.dispose()
      root.removeChild(renderer.domElement)
    }
  }, [figure])

  useEffect(() => {
    const uniforms = uniformsRef.current
    if (!uniforms) return
    uniforms.uColor.value = hexToColor(figure.accent)
    gsap.killTweensOf(uniforms.uReveal)
    gsap.killTweensOf(uniforms.uMode)

    uniforms.uMode.value = mode === 'constellation' ? 0 : mode === 'scanner' ? 1 : 2
    gsap.fromTo(
      uniforms.uReveal,
      { value: mode === 'vortex' ? 0 : 0.2 },
      { value: 1, duration: mode === 'vortex' ? 1.45 : 0.9, ease: 'power3.out' },
    )
  }, [figure, mode])

  return <div ref={rootRef} className="portrait-scene" />
}

function App() {
  const [modeId, setModeId] = useState<Mode['id']>('constellation')
  const [figureId, setFigureId] = useState<Figure['id']>('sushi')
  const appRef = useRef<HTMLElement | null>(null)

  const mode = useMemo(() => modes.find((item) => item.id === modeId) ?? modes[0], [modeId])
  const figure = useMemo(() => figures.find((item) => item.id === figureId) ?? figures[0], [figureId])

  useGSAP(
    () => {
      gsap.from('.page-header > *', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      })

      gsap.from('.mode-tab, .figure-tab', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.04,
        ease: 'power2.out',
      })

      gsap.from('.hero-copy > *', {
        opacity: 0,
        y: 22,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.08,
      })

      gsap.to('.hero-stage-shell', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-grid',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      ScrollTrigger.batch('.meta-card', {
        start: 'top 84%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
          ),
      })
    },
    { scope: appRef },
  )

  useGSAP(
    () => {
      gsap.fromTo(
        '.hero-copy',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' },
      )

      gsap.fromTo(
        '.hero-stage-shell',
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.95, ease: 'power3.out', clearProps: 'all' },
      )
    },
    { dependencies: [modeId, figureId], scope: appRef, revertOnUpdate: true },
  )

  return (
    <main ref={appRef} className="app-shell" style={{ ['--accent' as string]: figure.accent } as CSSProperties}>
      <header className="page-header">
        <p className="page-kicker">digital museum of history / text portraits archive</p>
        <h1>历史，被重新点亮。</h1>
        <p className="page-intro">
          这不是一个把人物排成卡片的网页，而是一座尝试用文本、算法与交互重新组织历史记忆的数字展馆。
          我们关心的不是“像不像一张插图”，而是史料如何在屏幕里重新聚合成一种可被观看的面容。
        </p>
      </header>

      <section className="control-rail">
        <div className="rail-block">
          <span className="rail-label">展陈单元</span>
          <div className="mode-tabs">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mode-tab ${item.id === modeId ? 'active' : ''}`}
                onClick={() => setModeId(item.id)}
              >
                <span>{item.no}</span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="rail-block">
          <span className="rail-label">馆藏人物</span>
          <div className="figure-tabs">
            {figures.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`figure-tab ${item.id === figureId ? 'active' : ''}`}
                onClick={() => setFigureId(item.id)}
              >
                <span>{item.dynasty}</span>
                <strong>{item.name}</strong>
                <small>{item.years}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">当前展项 / {mode.title}</p>
          <h2>{figure.name}</h2>
          <p className="hero-subtitle">{figure.subtitle}</p>
          <p className="hero-summary">{figure.summary}</p>
          <blockquote>{figure.quote}</blockquote>
          <div className="tag-row">
            {figure.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="hero-stage-shell">
          <div className="stage-topline">
            <span>gallery engine / {mode.english}</span>
            <span>{figure.dynasty} · {figure.years}</span>
          </div>
          <PortraitScene figure={figure} mode={mode.id} />
          <div className="stage-bottomline">
            <span>{mode.tech}</span>
            <span>reference set / {mode.refs.join(' · ')}</span>
          </div>
        </div>
      </section>

      <section className="meta-grid">
        <article className="meta-card">
          <span className="meta-label">展项说明</span>
          <strong>{mode.mood}</strong>
          <p>每个单元都不是换一种皮肤，而是在改变“历史人物如何被读取”的方式。</p>
        </article>
        <article className="meta-card">
          <span className="meta-label">策展注释</span>
          <strong>{figure.curator}</strong>
          <p>页面正文不再充当主角，它只负责给观看提供尺度与注解。</p>
        </article>
        <article className="meta-card">
          <span className="meta-label">动画系统</span>
          <strong>GSAP + ScrollTrigger</strong>
          <p>入场、切换、浮现与停顿共同组成浏览节奏，尽量让它更像走进展厅，而不是切 tab。</p>
        </article>
      </section>

      <section className="essay-grid">
        <article className="essay-card">
          <span className="meta-label">策展说明</span>
          <strong>这座站点真正要做的，不是“展示技术”，而是重构观看关系。</strong>
          <p>
            史料、诗句、诏令、争议和人物评价，本来都分散在不同文本里。我们把它们重新抽样、分层、聚合，
            不是为了把文本变成装饰，而是为了让人物的“被书写方式”直接成为肖像的一部分。
          </p>
        </article>
        <article className="essay-card">
          <span className="meta-label">馆藏方法</span>
          <strong>文本 / 算法 / 肖像</strong>
          <p>
            文本提供颗粒，算法决定组织方式，肖像承担最终可见的情绪与秩序。页面应该像展签与装置并存：
            一部分负责说明，一部分负责让人停下来观看。
          </p>
        </article>
      </section>

      <section className="collection-section">
        <div className="section-heading">
          <span className="rail-label">馆藏目录</span>
          <h3>人物不应只是选项，而应像正在展出的藏品。</h3>
        </div>
        <div className="collection-grid">
          {figures.map((item) => (
            <article key={item.id} className={`collection-card ${item.id === figureId ? 'active' : ''}`}>
              <span className="meta-label">{item.dynasty}</span>
              <strong>{item.name}</strong>
              <p>{item.subtitle}</p>
              <small>{item.tags.join(' / ')}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="method-strip">
        <div className="section-heading">
          <span className="rail-label">method</span>
          <h3>技术不该站在台前，但必须让人感到它确实存在。</h3>
        </div>
        <div className="method-grid">
          <article className="method-card">
            <span className="meta-label">text mask sampling</span>
            <p>先把词语画成可采样的形体，再把它们送入点云，而不是用 CSS 拼出一张假画像。</p>
          </article>
          <article className="method-card">
            <span className="meta-label">shader-led portrait</span>
            <p>扫描、聚散、呼吸和错位都交给实时图形层，让人物保持“还在被组织”的状态。</p>
          </article>
          <article className="method-card">
            <span className="meta-label">scroll narrative</span>
            <p>滚动不是读说明书，而是进入不同的展厅节奏：停顿、靠近、切换、再回看。</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
