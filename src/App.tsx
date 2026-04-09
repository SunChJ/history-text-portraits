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
}

type Theme = {
  id: string
  no: string
  title: string
  subtitle: string
}

const themes: Theme[] = [
  { id: 'archive-dark', no: '01', title: 'Archive Dark', subtitle: '黑色档案馆 / 戏剧光 / 展签' },
  { id: 'paper-book', no: '02', title: 'Paper Book', subtitle: '古书 / 图录 / 编排' },
  { id: 'poster-wall', no: '03', title: 'Poster Wall', subtitle: '海报墙 / 大字 / 艺术展' },
  { id: 'signal-lab', no: '04', title: 'Signal Lab', subtitle: '信号实验室 / 扫描 / 数据感' },
  { id: 'gallery-light', no: '05', title: 'Gallery Light', subtitle: '浅色美术馆 / 留白 / 雕塑' },
  { id: 'ink-scroll', no: '06', title: 'Ink Scroll', subtitle: '长卷 / 水墨 / 东方叙事' },
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
      '如果这个站点要成立，人物不能只是“内容入口”，而要先成为一个视觉主体。苏轼的词语气质天然适合聚合成像：明月、江流、黄州、赤壁、东坡，这些词本身就带空间与温度。',
    curator:
      '他最迷人的不是天赋，而是把人生的下坠重新组织成一种可以被后人反复使用的精神尺度。',
    accent: '#d3a164',
    tags: ['赤壁', '黄州', '东坡', '诗词', '书画'],
    portraitWords: [
      { text: '东坡', x: 50, y: 14, weight: 'strong' },
      { text: '旷达', x: 34, y: 20, weight: 'mid' },
      { text: '赤壁', x: 66, y: 20, weight: 'mid' },
      { text: '明月', x: 42, y: 28, weight: 'soft' },
      { text: '江流', x: 62, y: 31, weight: 'soft' },
      { text: '黄州', x: 27, y: 37, weight: 'soft' },
      { text: '贬谪', x: 53, y: 38, weight: 'mid' },
      { text: '诗词', x: 71, y: 39, weight: 'mid' },
      { text: '人生如逆旅', x: 31, y: 49, weight: 'soft' },
      { text: '豁达', x: 51, y: 51, weight: 'strong' },
      { text: '风骨', x: 69, y: 53, weight: 'mid' },
      { text: '书画', x: 38, y: 64, weight: 'soft' },
      { text: '自嘲', x: 58, y: 66, weight: 'soft' },
      { text: '千古', x: 50, y: 80, weight: 'mid' },
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
      '武则天最适合做成“冲突型”的文字人像。这个人物身上的关键词不是顺滑流动的，而应该彼此牵扯：权力、改制、统治、恐惧、革新、形象。',
    curator:
      '她不是只能被崇拜或贬斥。更准确的方式，是让多种叙述同时悬停在她的轮廓里。',
    accent: '#c46b76',
    tags: ['女皇', '诏令', '改制', '史官', '神都'],
    portraitWords: [
      { text: '女皇', x: 50, y: 14, weight: 'strong' },
      { text: '权力', x: 34, y: 20, weight: 'mid' },
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
  },
  {
    id: 'caocao',
    name: '曹操',
    dynasty: '东汉末',
    years: '155 — 220',
    subtitle: '被雄心、军政、诗歌与戏剧脸谱共同塑造出来的人。',
    quote: '对酒当歌，人生几何。',
    summary:
      '曹操最适合做成“多重标签碰撞”的人像。英雄、权臣、诗人、奸雄、军事家，这些词不该互相覆盖，而该一起保留。',
    curator:
      '这个人物的复杂性，不在于你选哪一个判断，而在于多个互相冲突的判断都成立。',
    accent: '#7a8fda',
    tags: ['魏武', '短歌行', '官渡', '军政', '奸雄'],
    portraitWords: [
      { text: '魏武', x: 50, y: 14, weight: 'strong' },
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
  },
]

function Portrait({ figure, className = '' }: { figure: Figure; className?: string }) {
  return (
    <div className={`portrait ${className}`} style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
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

function ThemeTabs({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <div className="theme-tabs">
      {themes.map((theme) => (
        <button key={theme.id} type="button" className={`theme-tab ${current === theme.id ? 'active' : ''}`} onClick={() => onChange(theme.id)}>
          <span>{theme.no}</span>
          <strong>{theme.title}</strong>
          <small>{theme.subtitle}</small>
        </button>
      ))}
    </div>
  )
}

function FigureTabs({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <div className="figure-tabs">
      {figures.map((figure) => (
        <button
          key={figure.id}
          type="button"
          className={`figure-tab ${current === figure.id ? 'active' : ''}`}
          style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}
          onClick={() => onChange(figure.id)}
        >
          <span>{figure.dynasty}</span>
          <strong>{figure.name}</strong>
        </button>
      ))}
    </div>
  )
}

function ArchiveDark({ figure }: { figure: Figure }) {
  return (
    <section className="design design-archive-dark" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="design-grid two-col">
        <div className="copy-panel">
          <p className="eyebrow">Archive dark</p>
          <h2>黑色档案馆里的唯一主角</h2>
          <p>{figure.summary}</p>
          <blockquote>{figure.quote}</blockquote>
        </div>
        <div className="hero-object-panel">
          <Portrait figure={figure} />
        </div>
      </div>
      <div className="info-row two-blocks">
        <article><p className="eyebrow">Curator note</p><p>{figure.curator}</p></article>
        <article><p className="eyebrow">Keywords</p><div className="tag-list">{figure.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
      </div>
    </section>
  )
}

function PaperBook({ figure }: { figure: Figure }) {
  return (
    <section className="design design-paper-book" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="paper-book-frame">
        <header className="paper-header">
          <div>
            <p className="eyebrow dark">Paper book</p>
            <h2>像一本摊开的历史图录</h2>
          </div>
          <div className="paper-meta">{figure.dynasty} · {figure.years}</div>
        </header>
        <div className="paper-book-grid">
          <div className="paper-portrait-box"><Portrait figure={figure} className="compact" /></div>
          <div className="paper-reading-box">
            <h3>{figure.name}</h3>
            <p className="paper-subtitle">{figure.subtitle}</p>
            <p>{figure.summary}</p>
            <blockquote>{figure.quote}</blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

function PosterWall({ figure }: { figure: Figure }) {
  return (
    <section className="design design-poster-wall" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="poster-topline">TEXT · HISTORY · FORM · PORTRAIT</div>
      <div className="poster-wall-grid">
        <div className="poster-main-title">
          <h2>{figure.name}</h2>
          <p>{figure.subtitle}</p>
        </div>
        <div className="poster-portrait"><Portrait figure={figure} className="compact" /></div>
        <div className="poster-quote"><blockquote>{figure.quote}</blockquote></div>
        <div className="poster-note"><p>{figure.curator}</p></div>
      </div>
    </section>
  )
}

function SignalLab({ figure }: { figure: Figure }) {
  return (
    <section className="design design-signal-lab" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="scan-line" />
      <div className="lab-grid">
        <div className="lab-panel lab-copy">
          <p className="eyebrow">Signal lab</p>
          <h2>把人物当成一组持续被扫描的叙述信号</h2>
          <p>{figure.summary}</p>
        </div>
        <div className="lab-panel lab-portrait"><Portrait figure={figure} className="compact" /></div>
        <div className="lab-panel lab-data">
          {figure.tags.map((tag, index) => (
            <div key={tag} className="lab-data-row"><span>{String(index + 1).padStart(2, '0')}</span><p>{tag}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryLight({ figure }: { figure: Figure }) {
  return (
    <section className="design design-gallery-light" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="gallery-light-grid">
        <div className="light-copy">
          <p className="eyebrow dark">Gallery light</p>
          <h2>更像美术馆里的浅色雕塑厅</h2>
          <p>{figure.summary}</p>
          <div className="tag-list dark">{figure.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="light-object"><Portrait figure={figure} className="light" /></div>
      </div>
    </section>
  )
}

function InkScroll({ figure }: { figure: Figure }) {
  return (
    <section className="design design-ink-scroll" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <div className="scroll-head">
        <p className="eyebrow dark">Ink scroll</p>
        <h2>像被慢慢展开的东方长卷</h2>
      </div>
      <div className="scroll-layout">
        <div className="scroll-cell intro">
          <h3>{figure.name}</h3>
          <p>{figure.subtitle}</p>
        </div>
        <div className="scroll-cell center"><Portrait figure={figure} className="compact ink" /></div>
        <div className="scroll-cell note">
          <p>{figure.curator}</p>
          <blockquote>{figure.quote}</blockquote>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [themeId, setThemeId] = useState(themes[0].id)
  const [figureId, setFigureId] = useState(figures[0].id)
  const figure = useMemo(() => figures.find((item) => item.id === figureId) ?? figures[0], [figureId])

  return (
    <main className="app-shell" style={{ ['--accent' as string]: figure.accent } as React.CSSProperties}>
      <header className="page-header">
        <div>
          <p className="page-kicker">History Text Portraits</p>
          <h1>6 套完全不同的首页设计</h1>
          <p className="page-intro">这次不再只给一套。顶部可以切换 6 种方向：黑色档案馆、古书图录、海报墙、信号实验室、浅色美术馆、东方长卷。</p>
        </div>
      </header>

      <ThemeTabs current={themeId} onChange={setThemeId} />
      <FigureTabs current={figureId} onChange={setFigureId} />

      {themeId === 'archive-dark' && <ArchiveDark figure={figure} />}
      {themeId === 'paper-book' && <PaperBook figure={figure} />}
      {themeId === 'poster-wall' && <PosterWall figure={figure} />}
      {themeId === 'signal-lab' && <SignalLab figure={figure} />}
      {themeId === 'gallery-light' && <GalleryLight figure={figure} />}
      {themeId === 'ink-scroll' && <InkScroll figure={figure} />}
    </main>
  )
}

export default App
