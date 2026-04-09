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
  subtitle: string
  quote: string
  summary: string
  curator: string
  accent: string
  tags: string[]
  portraitWords: Word[]
  timeline: { year: string; title: string; detail: string }[]
}

const figures: Figure[] = [
  {
    id: 'sushi',
    name: '苏轼',
    dynasty: '北宋',
    years: '1037 — 1101',
    subtitle: '被贬谪、月色、江流与旷达共同塑造出来的人。',
    quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
    summary:
      '这个站点不打算把历史人物做成普通卡片，而是把构成他形象的文字本身拿来塑形。苏轼很适合作为第一位人物，因为关于他的描述天然带有温度、景象、挫折与自我修复能力。',
    curator:
      '真正值得呈现的，不是苏轼的“成功”，而是他如何把不断受挫的人生重新写成一种更辽阔的活法。',
    accent: '#d3a164',
    tags: ['赤壁', '黄州', '东坡', '诗词', '书画'],
    portraitWords: [
      { text: '东坡', x: 50, y: 13, weight: 'strong' },
      { text: '旷达', x: 35, y: 19, weight: 'mid' },
      { text: '赤壁', x: 66, y: 20, weight: 'mid' },
      { text: '明月', x: 43, y: 29, weight: 'soft' },
      { text: '江流', x: 61, y: 31, weight: 'soft' },
      { text: '黄州', x: 28, y: 36, weight: 'soft' },
      { text: '贬谪', x: 53, y: 38, weight: 'mid' },
      { text: '诗词', x: 71, y: 38, weight: 'mid' },
      { text: '人生如逆旅', x: 31, y: 49, weight: 'soft' },
      { text: '豁达', x: 51, y: 51, weight: 'strong' },
      { text: '风骨', x: 69, y: 53, weight: 'mid' },
      { text: '书画', x: 38, y: 64, weight: 'soft' },
      { text: '自嘲', x: 58, y: 66, weight: 'soft' },
      { text: '千古', x: 50, y: 80, weight: 'mid' },
    ],
    timeline: [
      { year: '1037', title: '生于眉山', detail: '后来成为北宋最重要的文学与文化人物之一。' },
      { year: '1079', title: '乌台诗案', detail: '政治风波之后，苏轼开始慢慢转化为“东坡”。' },
      { year: '1082', title: '赤壁书写', detail: '时间、江流与命运在他的文字里被重新组织。' },
      { year: '1094', title: '再遭远谪', detail: '人生继续下沉，但文字、审美与气度没有塌。' },
      { year: '1101', title: '北归病逝', detail: '苏轼结束了，东坡作为一种人格持续留下。' },
    ],
  },
  {
    id: 'wuzetian',
    name: '武则天',
    dynasty: '武周',
    years: '624 — 705',
    subtitle: '被制度、诏令、史官与争议共同塑造出来的人。',
    quote: '她的形象，常常比她本人更像一场叙述斗争。',
    summary:
      '武则天不该只被当作一个传奇标签。这个人物最适合被做成“多种评价互相拉扯”的文字人像：功绩、权力、秩序、防御、污名与改制同时在场。',
    curator:
      '对她最好的呈现，不是先下结论，而是让不同叙述同时悬在她的轮廓里。',
    accent: '#c46b76',
    tags: ['女皇', '诏令', '改制', '史官', '神都'],
    portraitWords: [
      { text: '女皇', x: 50, y: 13, weight: 'strong' },
      { text: '权力', x: 34, y: 19, weight: 'mid' },
      { text: '诏令', x: 66, y: 20, weight: 'soft' },
      { text: '秩序', x: 50, y: 30, weight: 'strong' },
      { text: '改制', x: 28, y: 36, weight: 'soft' },
      { text: '史官', x: 71, y: 36, weight: 'soft' },
      { text: '武周', x: 40, y: 44, weight: 'mid' },
      { text: '争议', x: 60, y: 47, weight: 'mid' },
      { text: '统治', x: 31, y: 56, weight: 'soft' },
      { text: '革新', x: 52, y: 58, weight: 'mid' },
      { text: '帝国', x: 71, y: 59, weight: 'soft' },
      { text: '形象', x: 49, y: 80, weight: 'mid' },
    ],
    timeline: [
      { year: '624', title: '出生', detail: '后来进入唐宫，并逐步进入权力核心。' },
      { year: '655', title: '立后', detail: '宫廷权力结构从此出现根本变化。' },
      { year: '690', title: '称帝', detail: '建立武周，成为中国历史上唯一正统女皇帝。' },
      { year: '690-705', title: '统治时期', detail: '制度、用人与国家秩序层面留下可见影响。' },
      { year: '705', title: '退位', detail: '政治结束了，但关于她的叙述战争没有结束。' },
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
      '曹操最适合做“标签碰撞型”的文字人像。英雄、权臣、诗人、奸雄、制度建设者、战争指挥者，这些词必须一起出现，他才会重新复杂起来。',
    curator:
      '这个人物不该被一个词盖住。他的价值，恰恰在于多个彼此冲突的评价可以同时成立。',
    accent: '#7a8fda',
    tags: ['魏武', '短歌行', '官渡', '军政', '奸雄'],
    portraitWords: [
      { text: '魏武', x: 50, y: 13, weight: 'strong' },
      { text: '挟天子', x: 34, y: 20, weight: 'soft' },
      { text: '诗人', x: 66, y: 20, weight: 'soft' },
      { text: '雄才', x: 49, y: 30, weight: 'strong' },
      { text: '北方', x: 28, y: 36, weight: 'soft' },
      { text: '猜忌', x: 71, y: 36, weight: 'mid' },
      { text: '赤壁', x: 33, y: 47, weight: 'mid' },
      { text: '用人', x: 52, y: 50, weight: 'mid' },
      { text: '军政', x: 70, y: 50, weight: 'soft' },
      { text: '短歌行', x: 38, y: 63, weight: 'soft' },
      { text: '多面', x: 58, y: 65, weight: 'mid' },
      { text: '天下', x: 50, y: 80, weight: 'soft' },
    ],
    timeline: [
      { year: '155', title: '出生', detail: '后来成为东汉末最关键的政治军事人物之一。' },
      { year: '196', title: '迎献帝都许', detail: '政治主动权被迅速握住。' },
      { year: '200', title: '官渡之战', detail: '北方格局逐渐定型。' },
      { year: '208', title: '赤壁失利', detail: '遭遇重大挫折，但并未失去根本盘面。' },
      { year: '220', title: '病逝', detail: '曹魏政权基础此时已经形成。' },
    ],
  },
]

function Portrait({ figure }: { figure: Figure }) {
  return (
    <div className="portrait-shell" style={{ ['--accent' as string]: figure.accent }}>
      <div className="portrait-glow" />
      <div className="portrait-frame" />
      <div className="portrait-shape">
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
    </div>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState(figures[0].id)
  const figure = useMemo(() => figures.find((item) => item.id === selectedId) ?? figures[0], [selectedId])

  return (
    <main className="site-shell" style={{ ['--accent' as string]: figure.accent }}>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-block">
          <p className="sys-label">Archive / Portrait / Study</p>
          <a className="brand" href="#hero">History Text Portraits</a>
        </div>
        <nav className="topnav">
          <a href="#hero">Hero</a>
          <a href="#dossier">Dossier</a>
          <a href="#timeline">Timeline</a>
        </nav>
      </header>

      <section id="hero" className="hero-section">
        <div className="hero-frame" />

        <div className="hero-copy">
          <div className="tagline-gears">
            <span className="active">Text-built</span>
            <span>Historical</span>
            <span>Readable object</span>
          </div>

          <h1>把历史人物做成一尊由史料文字聚合而成的可阅读人像。</h1>
          <p className="hero-desc">
            这次我不再做一堆方向给你挑，也不沿着前面那些版式修补。我直接从 reference 里抽可用细节重新拼：
            深背景中的局部光、编辑感 serif 标题、mono 系统标签、极细框线、慢动效、策展式信息排布。
          </p>
        </div>

        <div className="hero-main-grid">
          <aside className="selector-panel">
            <p className="sys-label">Figure selector</p>
            <div className="selector-list">
              {figures.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`selector-item ${item.id === figure.id ? 'active' : ''}`}
                  style={{ ['--accent' as string]: item.accent }}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="selector-meta">{item.dynasty}</span>
                  <strong>{item.name}</strong>
                  <p>{item.subtitle}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="portrait-panel">
            <Portrait figure={figure} />
          </div>
        </div>
      </section>

      <section id="dossier" className="dossier-section">
        <aside className="dossier-sticky">
          <p className="sys-label">Specimen dossier</p>
          <h2>{figure.name}</h2>
          <p className="dossier-years">
            {figure.dynasty} · {figure.years}
          </p>
          <blockquote>{figure.quote}</blockquote>
          <div className="chip-row">
            {figure.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </aside>

        <div className="dossier-log">
          <article className="log-entry emphasis">
            <span className="log-time">01 / WHY THIS FIGURE</span>
            <p>{figure.summary}</p>
          </article>
          <article className="log-entry resolution">
            <span className="log-time">02 / CURATOR NOTE</span>
            <p>{figure.curator}</p>
          </article>
          <article className="log-entry">
            <span className="log-time">03 / FORMAT IDEA</span>
            <p>人物不是先给出画像，再补文字；而是让文字先成为画像，之后再回流成一本可阅读的历史书。</p>
          </article>
        </div>
      </section>

      <section id="timeline" className="timeline-section">
        <div className="section-header">
          <p className="sys-label">Timeline</p>
          <h2>把人物从标签里拉出来，重新放回时间里。</h2>
        </div>

        <div className="timeline-list">
          {figure.timeline.map((item) => (
            <article key={`${figure.id}-${item.year}`} className="timeline-card">
              <div className="timeline-date">
                <span className="date-year">{item.year}</span>
              </div>
              <div className="timeline-body">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
