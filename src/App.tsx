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
        <p className="page-kicker">history text portraits / live cultural showcase</p>
        <h1>把历史文本变成一眼就能抓住人的实时人物展演。</h1>
        <p className="page-intro">
          这不该只是一个“设计练习站”。它应该像一个可投放、可传播、可商业化的文化科技样板：
          用实时图形把人物、文本与叙事做成能吸引用户、合作方与投资人的 showcase。
        </p>
        <div className="hero-actions">
          <a href="#demo">查看实时演示</a>
          <a href="#thesis" className="ghost">为什么它值得投</a>
        </div>
      </header>

      <section className="signal-strip">
        <article className="signal-card">
          <span className="meta-label">product signal</span>
          <strong>不是静态内容站，而是可扩展的历史人物引擎</strong>
          <p>文本采样、实时肖像、展陈切换都已具备产品雏形，后续可继续接人物库、专题页与授权内容。</p>
        </article>
        <article className="signal-card">
          <span className="meta-label">market signal</span>
          <strong>面向博物馆、教育、文旅、品牌联名与线上展览</strong>
          <p>它既能做馆内互动装置，也能做传播型网页、课程产品与文化 IP 的数字入口。</p>
        </article>
        <article className="signal-card">
          <span className="meta-label">attention signal</span>
          <strong>第一屏就该让人停住，而不是像在看 Figma 线框稿</strong>
          <p>首屏必须先给冲击、再给价值、最后给扩张想象，这才是 showcase，而不是自我说明书。</p>
        </article>
      </section>

      <section id="demo" className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">live demo / {mode.title}</p>
          <h2>{figure.name}</h2>
          <p className="hero-subtitle">{figure.subtitle}</p>
          <p className="hero-summary">{figure.summary}</p>
          <blockquote>{figure.quote}</blockquote>
          <div className="tag-row">
            {figure.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="hero-proof-list">
            <div>
              <span className="meta-label">current mode</span>
              <strong>{mode.english}</strong>
            </div>
            <div>
              <span className="meta-label">experience goal</span>
              <strong>{mode.mood}</strong>
            </div>
          </div>
        </div>

        <div className="hero-stage-shell">
          <div className="stage-topline">
            <span>live portrait engine / {mode.english}</span>
            <span>{figure.dynasty} · {figure.years}</span>
          </div>
          <PortraitScene figure={figure} mode={mode.id} />
          <div className="stage-bottomline">
            <span>{mode.tech}</span>
            <span>reference set / {mode.refs.join(' · ')}</span>
          </div>
        </div>
      </section>

      <section className="control-rail showcase-rail">
        <div className="rail-block">
          <span className="rail-label">experience systems</span>
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
          <span className="rail-label">character lineup</span>
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

      <section className="meta-grid investor-grid">
        <article className="meta-card">
          <span className="meta-label">why users care</span>
          <strong>因为它把“读历史”改成了“进入一个会动的人物现场”。</strong>
          <p>用户不是在看资料卡，而是在看人物如何由诗句、史料与评价被重新生成。</p>
        </article>
        <article className="meta-card">
          <span className="meta-label">why partners care</span>
          <strong>因为它天然适合做活动页、馆展屏、课程封面与文化传播入口。</strong>
          <p>同一套引擎可以切人物、切题材、切视觉语言，适配不同合作场景。</p>
        </article>
        <article className="meta-card">
          <span className="meta-label">why investors care</span>
          <strong>因为这不是单页审美，而是一个可复制到更多内容资产上的展示操作系统。</strong>
          <p>真正有价值的不是某个苏轼页面，而是这套把文本资产转成可观看资产的能力。</p>
        </article>
      </section>

      <section id="thesis" className="essay-grid thesis-grid">
        <article className="essay-card thesis-card">
          <span className="meta-label">investment thesis</span>
          <strong>文化内容网站大多在卖信息，我们要卖的是“值得被围观的观看体验”。</strong>
          <p>
            如果第一屏不能让人停住，就没有传播；如果没有传播，就没有合作想象；如果没有合作想象，
            投资人看到的就只是一页审美练习。这个项目需要首先证明：历史内容也能拥有像科技产品一样强的首屏抓力。
          </p>
        </article>
        <article className="essay-card thesis-card">
          <span className="meta-label">deployment paths</span>
          <strong>馆内互动、线上专题、教育产品、文化 IP 联名</strong>
          <p>
            一套实时肖像引擎，可以往上长出人物系列、主题策展、数据看板、讲解音频与授权衍生页。
            投资逻辑不在“单个网页”，而在这套展示能力能否复制到更多内容场景。
          </p>
        </article>
      </section>

      <section className="collection-section">
        <div className="section-heading">
          <span className="rail-label">launch collection</span>
          <h3>首发阵容不该像菜单，而该像一组可持续扩张的文化 IP 样本。</h3>
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
          <span className="rail-label">engine advantages</span>
          <h3>真正该被看见的，不是“我们会做网页”，而是这套系统的复制能力。</h3>
        </div>
        <div className="method-grid">
          <article className="method-card">
            <span className="meta-label">content to form</span>
            <p>把词语本身变成肖像材料，意味着后续接入新人物、新文本时，不需要重做整套视觉逻辑。</p>
          </article>
          <article className="method-card">
            <span className="meta-label">real-time spectacle</span>
            <p>shader 与点云让首屏具备真正的“停留价值”，而不是依赖营销文案硬撑高级感。</p>
          </article>
          <article className="method-card">
            <span className="meta-label">commercial scaling</span>
            <p>同一底层可以扩到专题馆、品牌联名、教学交互与线下大屏，具备继续产品化的空间。</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
