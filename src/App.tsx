import { useMemo, useState } from 'react'
import './App.css'

type Word = {
  text: string
  x: number
  y: number
  weight?: 'soft' | 'mid' | 'strong'
}

type Figure = {
  id: string
  name: string
  dynasty: string
  years: string
  role: string
  quote: string
  summary: string
  curator: string
  palette: {
    accent: string
    accentSoft: string
    paper: string
  }
  tags: string[]
  portraitWords: Word[]
  timeline: { year: string; title: string; detail: string }[]
}

type Version = {
  id: string
  label: string
  name: string
  mood: string
}

const versions: Version[] = [
  { id: 'v1', label: '01', name: 'Museum Dark', mood: '数字展厅 / 庄重 / 戏剧光' },
  { id: 'v2', label: '02', name: 'Paper Atlas', mood: '古籍图录 / 编辑感 / 纸张' },
  { id: 'v3', label: '03', name: 'Orbital Archive', mood: '未来档案 / 环形布局 / 观测' },
  { id: 'v4', label: '04', name: 'Monolith', mood: '极简巨构 / 单主角 / 压迫感' },
  { id: 'v5', label: '05', name: 'Glass Relic', mood: '半透明文物仓 / 冷静 / 精密' },
  { id: 'v6', label: '06', name: 'Scroll Stage', mood: '长卷叙事 / 东方 / 缓慢展开' },
]

const figures: Figure[] = [
  {
    id: 'sushi',
    name: '苏轼',
    dynasty: '北宋',
    years: '1037 — 1101',
    role: '被挫折塑形、却始终保有辽阔感的书写者',
    quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
    summary:
      '苏轼适合成为这个站点的第一位人物，因为他不是单一标签。他身上同时有政治失意、文学高峰、生活智慧、审美能力与精神韧性。把这些词聚成人像，会比普通人物介绍更接近“他被历史记住的方式”。',
    curator:
      '真正值得呈现的，不是苏轼的“成功”，而是他怎样把不断受挫的人生重新写成一种更大尺度的活法。',
    palette: {
      accent: '#d4a060',
      accentSoft: 'rgba(212,160,96,0.18)',
      paper: '#efe1c7',
    },
    tags: ['赤壁', '黄州', '东坡', '诗词', '书画'],
    portraitWords: [
      { text: '东坡', x: 50, y: 14, weight: 'strong' },
      { text: '旷达', x: 34, y: 19, weight: 'mid' },
      { text: '赤壁', x: 66, y: 20, weight: 'mid' },
      { text: '明月', x: 44, y: 28, weight: 'soft' },
      { text: '江流', x: 63, y: 31, weight: 'soft' },
      { text: '黄州', x: 26, y: 36, weight: 'soft' },
      { text: '贬谪', x: 54, y: 37, weight: 'mid' },
      { text: '诗词', x: 72, y: 38, weight: 'mid' },
      { text: '人生如逆旅', x: 31, y: 49, weight: 'soft' },
      { text: '豁达', x: 50, y: 51, weight: 'strong' },
      { text: '风骨', x: 69, y: 52, weight: 'mid' },
      { text: '书画', x: 38, y: 64, weight: 'soft' },
      { text: '自嘲', x: 57, y: 65, weight: 'soft' },
      { text: '千古', x: 50, y: 80, weight: 'mid' },
    ],
    timeline: [
      { year: '1037', title: '生于眉山', detail: '一个后来会同时进入文学史、书法史与人格史的人。' },
      { year: '1079', title: '乌台诗案', detail: '政治风波把他推向黄州，也把苏轼推向东坡。' },
      { year: '1082', title: '赤壁书写', detail: '在时间、江流与个人命运之间，他找到更大的尺度。' },
      { year: '1094', title: '再遭远谪', detail: '从惠州到儋州，人生继续下沉，但文字没有塌。' },
      { year: '1101', title: '北归病逝', detail: '苏轼结束了，东坡作为一种文化人格开始长期存在。' },
    ],
  },
  {
    id: 'wuzetian',
    name: '武则天',
    dynasty: '武周',
    years: '624 — 705',
    role: '被权力、秩序与叙述偏见同时塑造的历史人物',
    quote: '她的形象，常常比她本人更像一场叙述斗争。',
    summary:
      '武则天不是只靠传奇感成立的。她更适合被做成一个“多种评价互相拉扯”的人物样本：功绩、争议、恐惧、制度创新、史官笔法，都应该同时出现在她的轮廓里。',
    curator:
      '这个人物最值得呈现的，不是结论，而是冲突。她是历史文本如何塑造人物的典型案例。',
    palette: {
      accent: '#c26b77',
      accentSoft: 'rgba(194,107,119,0.18)',
      paper: '#f0d8cf',
    },
    tags: ['女皇', '改制', '争议', '史官', '神都'],
    portraitWords: [
      { text: '女皇', x: 50, y: 14, weight: 'strong' },
      { text: '权力', x: 35, y: 19, weight: 'mid' },
      { text: '诏令', x: 67, y: 21, weight: 'soft' },
      { text: '秩序', x: 50, y: 30, weight: 'strong' },
      { text: '改制', x: 27, y: 36, weight: 'soft' },
      { text: '史官', x: 72, y: 36, weight: 'soft' },
      { text: '武周', x: 41, y: 43, weight: 'mid' },
      { text: '争议', x: 60, y: 46, weight: 'mid' },
      { text: '统治', x: 31, y: 55, weight: 'soft' },
      { text: '革新', x: 52, y: 58, weight: 'mid' },
      { text: '帝国', x: 71, y: 58, weight: 'soft' },
      { text: '形象', x: 48, y: 79, weight: 'mid' },
    ],
    timeline: [
      { year: '624', title: '出生', detail: '后来进入唐宫，并逐渐进入权力核心。' },
      { year: '655', title: '立后', detail: '宫廷权力结构因此被重写。' },
      { year: '690', title: '称帝', detail: '建立武周，成为中国历史上唯一正统女皇帝。' },
      { year: '690-705', title: '统治时期', detail: '在制度、用人与国家秩序层面留下可见影响。' },
      { year: '705', title: '退位', detail: '她的政治结束了，但关于她的叙述战争没有结束。' },
    ],
  },
  {
    id: 'caocao',
    name: '曹操',
    dynasty: '东汉末',
    years: '155 — 220',
    role: '被诗歌、军政、雄心与戏剧脸谱共同重塑的复杂人物',
    quote: '对酒当歌，人生几何。',
    summary:
      '曹操最适合做成“标签碰撞型”的文字人像。英雄、权臣、诗人、奸雄、效率机器、制度建设者——这些词必须同时存在，他才会重新复杂起来。',
    curator:
      '曹操不该被一个词盖住。他的价值，恰恰在于多个彼此冲突的评价能同时成立。',
    palette: {
      accent: '#7b8fda',
      accentSoft: 'rgba(123,143,218,0.18)',
      paper: '#dde3f1',
    },
    tags: ['魏武', '短歌行', '军政', '奸雄', '官渡'],
    portraitWords: [
      { text: '魏武', x: 50, y: 14, weight: 'strong' },
      { text: '挟天子', x: 35, y: 20, weight: 'soft' },
      { text: '诗人', x: 66, y: 20, weight: 'soft' },
      { text: '雄才', x: 49, y: 30, weight: 'strong' },
      { text: '北方', x: 28, y: 36, weight: 'soft' },
      { text: '猜忌', x: 71, y: 36, weight: 'mid' },
      { text: '赤壁', x: 33, y: 47, weight: 'mid' },
      { text: '用人', x: 51, y: 50, weight: 'mid' },
      { text: '军政', x: 70, y: 50, weight: 'soft' },
      { text: '短歌行', x: 38, y: 63, weight: 'soft' },
      { text: '多面', x: 58, y: 65, weight: 'mid' },
      { text: '天下', x: 50, y: 80, weight: 'soft' },
    ],
    timeline: [
      { year: '155', title: '出生', detail: '出身沛国谯县，后成为东汉末关键人物。' },
      { year: '196', title: '迎献帝都许', detail: '政治主动权开始被牢牢握住。' },
      { year: '200', title: '官渡之战', detail: '北方格局逐渐定型。' },
      { year: '208', title: '赤壁失利', detail: '遭遇大挫，但并没有从根本上失去结构优势。' },
      { year: '220', title: '病逝', detail: '曹魏政权的基础此时已经形成。' },
    ],
  },
]

function Portrait({ figure, compact = false }: { figure: Figure; compact?: boolean }) {
  return (
    <div className={`portrait ${compact ? 'compact' : ''}`} style={{ ['--accent' as string]: figure.palette.accent }}>
      {figure.portraitWords.map((word, index) => (
        <span
          key={`${figure.id}-${word.text}-${index}`}
          className={`portrait-word ${word.weight ?? 'mid'}`}
          style={{ left: `${word.x}%`, top: `${word.y}%` }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}

function FigurePicker({ selectedId, setSelectedId }: { selectedId: string; setSelectedId: (id: string) => void }) {
  return (
    <div className="figure-picker">
      {figures.map((figure) => (
        <button
          key={figure.id}
          type="button"
          className={`figure-pill ${selectedId === figure.id ? 'active' : ''}`}
          style={{ ['--accent' as string]: figure.palette.accent }}
          onClick={() => setSelectedId(figure.id)}
        >
          <span>{figure.name}</span>
          <small>{figure.dynasty}</small>
        </button>
      ))}
    </div>
  )
}

function VersionTabs({ current, setCurrent }: { current: string; setCurrent: (id: string) => void }) {
  return (
    <div className="version-tabs-wrap">
      <div className="version-tabs">
        {versions.map((version) => (
          <button
            key={version.id}
            type="button"
            className={`version-tab ${current === version.id ? 'active' : ''}`}
            onClick={() => setCurrent(version.id)}
          >
            <span className="version-no">{version.label}</span>
            <span className="version-name">{version.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function MuseumDark({ figure }: { figure: Figure }) {
  return (
    <section className="variant museum-dark" style={{ ['--accent' as string]: figure.palette.accent, ['--accent-soft' as string]: figure.palette.accentSoft }}>
      <div className="variant-hero two-col">
        <div className="variant-copy">
          <p className="eyebrow">Museum dark</p>
          <h1>像走进一个只亮起一位人物的黑色展厅。</h1>
          <p>{figure.summary}</p>
          <blockquote>{figure.quote}</blockquote>
        </div>
        <div className="variant-stage monumental">
          <Portrait figure={figure} />
        </div>
      </div>
      <div className="variant-footer-grid">
        <article>
          <p className="eyebrow">Curator note</p>
          <p>{figure.curator}</p>
        </article>
        <article>
          <p className="eyebrow">Tags</p>
          <div className="chip-row">{figure.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>
      </div>
    </section>
  )
}

function PaperAtlas({ figure }: { figure: Figure }) {
  return (
    <section className="variant paper-atlas" style={{ ['--paper' as string]: figure.palette.paper, ['--accent' as string]: figure.palette.accent }}>
      <div className="paper-frame">
        <header className="paper-head">
          <div>
            <p className="eyebrow dark">Paper atlas</p>
            <h1>像一本被摊开的历史图录。</h1>
          </div>
          <div className="paper-meta">
            <span>{figure.dynasty}</span>
            <span>{figure.years}</span>
          </div>
        </header>
        <div className="paper-grid">
          <div className="paper-portrait-box">
            <Portrait figure={figure} />
          </div>
          <div className="paper-reading-box">
            <h2>{figure.name}</h2>
            <p className="paper-role">{figure.role}</p>
            <p>{figure.summary}</p>
            <div className="timeline-mini">
              {figure.timeline.slice(0, 3).map((item) => (
                <div key={item.year}>
                  <strong>{item.year}</strong>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrbitalArchive({ figure }: { figure: Figure }) {
  return (
    <section className="variant orbital-archive" style={{ ['--accent' as string]: figure.palette.accent }}>
      <div className="orbital-core">
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="orbit orbit-c" />
        <div className="orbital-copy">
          <p className="eyebrow">Orbital archive</p>
          <h1>像一个围绕人物旋转的历史观测系统。</h1>
          <p>{figure.curator}</p>
        </div>
        <Portrait figure={figure} compact />
      </div>
      <div className="orbital-info-grid">
        <article><span>{figure.name}</span><p>{figure.role}</p></article>
        <article><span>Dynasty</span><p>{figure.dynasty}</p></article>
        <article><span>Years</span><p>{figure.years}</p></article>
        <article><span>Keywords</span><p>{figure.tags.join(' / ')}</p></article>
      </div>
    </section>
  )
}

function Monolith({ figure }: { figure: Figure }) {
  return (
    <section className="variant monolith" style={{ ['--accent' as string]: figure.palette.accent }}>
      <div className="monolith-backdrop" />
      <div className="monolith-column">
        <p className="eyebrow">Monolith</p>
        <h1>{figure.name}</h1>
        <p className="monolith-sub">{figure.role}</p>
        <div className="monolith-portrait"><Portrait figure={figure} compact /></div>
        <blockquote>{figure.quote}</blockquote>
      </div>
    </section>
  )
}

function GlassRelic({ figure }: { figure: Figure }) {
  return (
    <section className="variant glass-relic" style={{ ['--accent' as string]: figure.palette.accent, ['--accent-soft' as string]: figure.palette.accentSoft }}>
      <div className="glass-shell">
        <div className="glass-left">
          <p className="eyebrow">Glass relic</p>
          <h1>像把人物封存在一只可透视的冷玻璃容器里。</h1>
          <p>{figure.summary}</p>
        </div>
        <div className="glass-center">
          <Portrait figure={figure} />
        </div>
        <div className="glass-right">
          {figure.timeline.slice(0, 4).map((item) => (
            <article key={item.year}>
              <span>{item.year}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScrollStage({ figure }: { figure: Figure }) {
  return (
    <section className="variant scroll-stage" style={{ ['--accent' as string]: figure.palette.accent, ['--paper' as string]: figure.palette.paper }}>
      <div className="scroll-head">
        <p className="eyebrow dark">Scroll stage</p>
        <h1>像一幅慢慢展开的长卷。</h1>
      </div>
      <div className="scroll-strip">
        <div className="scroll-panel intro">
          <h2>{figure.name}</h2>
          <p>{figure.summary}</p>
        </div>
        <div className="scroll-panel portrait-panel">
          <Portrait figure={figure} compact />
        </div>
        <div className="scroll-panel note">
          <p>{figure.curator}</p>
          <blockquote>{figure.quote}</blockquote>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [currentVersion, setCurrentVersion] = useState('v1')
  const [selectedId, setSelectedId] = useState(figures[0].id)
  const figure = useMemo(() => figures.find((item) => item.id === selectedId) ?? figures[0], [selectedId])
  const version = useMemo(() => versions.find((item) => item.id === currentVersion) ?? versions[0], [currentVersion])

  return (
    <main className="site-shell" style={{ ['--accent' as string]: figure.palette.accent }}>
      <header className="site-header">
        <div>
          <p className="site-kicker">History Text Portraits · design playground</p>
          <h1>首页 6 个版本切换预览</h1>
          <p className="site-intro">
            这次不沿着上一版修修补补，而是直接在首页顶部给你一个切换栏，用六种完全不同的设计语言来重新想这个“文字数字化历史人物”站点。
          </p>
        </div>
        <div className="current-version-card">
          <span>{version.label}</span>
          <strong>{version.name}</strong>
          <p>{version.mood}</p>
        </div>
      </header>

      <VersionTabs current={currentVersion} setCurrent={setCurrentVersion} />
      <FigurePicker selectedId={selectedId} setSelectedId={setSelectedId} />

      {currentVersion === 'v1' && <MuseumDark figure={figure} />}
      {currentVersion === 'v2' && <PaperAtlas figure={figure} />}
      {currentVersion === 'v3' && <OrbitalArchive figure={figure} />}
      {currentVersion === 'v4' && <Monolith figure={figure} />}
      {currentVersion === 'v5' && <GlassRelic figure={figure} />}
      {currentVersion === 'v6' && <ScrollStage figure={figure} />}
    </main>
  )
}

export default App
