import { useMemo, useState } from 'react'
import './App.css'

type Word = {
  text: string
  x: number
  y: number
  size?: 'sm' | 'md' | 'lg'
}

type Figure = {
  id: string
  name: string
  title: string
  dynasty: string
  tagline: string
  idea: string
  accent: string
  portraitWords: Word[]
  intro: string
  quote: string
  chapters: { title: string; text: string }[]
  timeline: { year: string; event: string }[]
}

const figures: Figure[] = [
  {
    id: 'su-shi',
    name: '苏轼',
    title: '把失意活成旷达的人',
    dynasty: '北宋',
    tagline: '文字先聚成他的肩与面，再翻成一本会呼吸的书。',
    idea: '适合做第一位演示人物：文本丰富、气质鲜明、故事层次足够多。',
    accent: '#f4b66a',
    portraitWords: [
      { text: '东坡', x: 48, y: 18, size: 'lg' },
      { text: '旷达', x: 32, y: 24, size: 'md' },
      { text: '赤壁', x: 63, y: 26, size: 'md' },
      { text: '贬谪', x: 28, y: 40, size: 'sm' },
      { text: '诗词', x: 55, y: 37, size: 'md' },
      { text: '明月', x: 37, y: 49, size: 'sm' },
      { text: '长江', x: 63, y: 48, size: 'sm' },
      { text: '豁达', x: 40, y: 60, size: 'md' },
      { text: '人生如逆旅', x: 57, y: 61, size: 'sm' },
      { text: '黄州', x: 24, y: 58, size: 'sm' },
      { text: '书画', x: 33, y: 73, size: 'sm' },
      { text: '自嘲', x: 52, y: 74, size: 'sm' },
      { text: '风骨', x: 67, y: 71, size: 'sm' },
      { text: '千古', x: 44, y: 84, size: 'md' },
    ],
    intro:
      '苏轼最迷人的地方，不只是写得好，而是他能把政治失意、人生漂泊与精神自由，熬成一种后来人仍然能感到温度的活法。',
    quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
    chapters: [
      {
        title: '第一章 · 他不是“乐观”，而是有承受力',
        text:
          '苏轼的一生并不顺。被贬、流放、政治挫败都是真的。但他留下来的不是抱怨，而是一种把痛苦重新组织成语言、审美与判断的能力。',
      },
      {
        title: '第二章 · 他的文字像一套自我修复系统',
        text:
          '诗、词、书、画、散文、题跋，苏轼几乎把所有文字形式都变成了与世界继续对话的方法。所以读他时会觉得：这个人不是在表演旷达，而是在持续生成自己。',
      },
      {
        title: '第三章 · 为什么今天还值得学他',
        text:
          '因为现代人的困境不是“没有信息”，而是太容易被情绪和评价体系困住。苏轼给出的答案，不是赢，而是把人生转化成更大的尺度。',
      },
    ],
    timeline: [
      { year: '1037', event: '出生于眉山，后来成为北宋文坛核心人物。' },
      { year: '1079', event: '乌台诗案后被贬黄州，人生气质发生关键转折。' },
      { year: '1082', event: '写下《赤壁赋》《念奴娇·赤壁怀古》等代表作。' },
      { year: '1094-1097', event: '再遭贬谪，远赴惠州、儋州。' },
      { year: '1101', event: '北归途中病逝，身后声名愈盛。' },
    ],
  },
  {
    id: 'wu-zetian',
    name: '武则天',
    title: '权力、秩序与自我书写',
    dynasty: '武周',
    tagline: '她的形象不是“传奇标签”，而是历史叙述彼此拉扯后的结果。',
    idea: '适合做“史书如何塑造人物”的对照案例。',
    accent: '#d4687d',
    portraitWords: [
      { text: '女皇', x: 48, y: 18, size: 'lg' },
      { text: '权力', x: 33, y: 24, size: 'md' },
      { text: '诏令', x: 61, y: 24, size: 'sm' },
      { text: '改制', x: 26, y: 39, size: 'sm' },
      { text: '周', x: 53, y: 37, size: 'lg' },
      { text: '秩序', x: 68, y: 40, size: 'sm' },
      { text: '争议', x: 34, y: 52, size: 'md' },
      { text: '史官', x: 58, y: 50, size: 'sm' },
      { text: '统治', x: 28, y: 64, size: 'sm' },
      { text: '革新', x: 46, y: 63, size: 'md' },
      { text: '形象', x: 65, y: 64, size: 'sm' },
      { text: '神都', x: 42, y: 81, size: 'sm' },
    ],
    intro:
      '武则天最值得被重新观看的，不是“她到底狠不狠”，而是她如何在一个根本不为她准备最高权位的位置上，改写制度与叙事。',
    quote: '历史对她的描述，常常比她本人更像一场斗争。',
    chapters: [
      {
        title: '第一章 · 她先是制度问题，不只是人物问题',
        text:
          '武则天的出现让“权力是否只能由某类人拥有”这个问题被强行摆上台面。所以她天然会遭遇巨量道德化描述。',
      },
      {
        title: '第二章 · 史料里有评价，也有防御',
        text:
          '很多关于她的文字，并不只是记录事实，也在维护既有秩序。因此做这个人物页时，很适合把不同叙述源同时可视化。',
      },
      {
        title: '第三章 · 她适合被做成“文字冲突型”肖像',
        text:
          '赞誉、恐惧、污名、功绩，这些互相冲撞的词比单一路线更能形成视觉张力。',
      },
    ],
    timeline: [
      { year: '624', event: '出生。' },
      { year: '690', event: '正式称帝，建立武周。' },
      { year: '690-705', event: '统治期间推动用人和制度层面的调整。' },
      { year: '705', event: '退位，唐朝国号恢复。' },
    ],
  },
  {
    id: 'cao-cao',
    name: '曹操',
    title: '乱世中的效率、雄心与阴影',
    dynasty: '东汉末',
    tagline: '一个被诗、权谋、战争与后世戏剧共同重塑的人。',
    idea: '适合做“人物标签如何遮蔽真实复杂性”的交互版。',
    accent: '#7ca2ff',
    portraitWords: [
      { text: '魏武', x: 50, y: 18, size: 'lg' },
      { text: '挟天子', x: 31, y: 25, size: 'sm' },
      { text: '诗人', x: 64, y: 25, size: 'sm' },
      { text: '北方', x: 29, y: 40, size: 'sm' },
      { text: '雄才', x: 50, y: 38, size: 'md' },
      { text: '猜忌', x: 68, y: 41, size: 'sm' },
      { text: '赤壁', x: 34, y: 55, size: 'sm' },
      { text: '用人', x: 53, y: 53, size: 'md' },
      { text: '军政', x: 70, y: 55, size: 'sm' },
      { text: '短歌行', x: 36, y: 71, size: 'sm' },
      { text: '多面', x: 55, y: 70, size: 'md' },
      { text: '天下', x: 47, y: 84, size: 'sm' },
    ],
    intro:
      '曹操是最容易被一句话概括、也最不该被一句话概括的人物之一。戏剧传统把他脸谱化，但史实里的他显然更复杂。',
    quote: '对酒当歌，人生几何。',
    chapters: [
      {
        title: '第一章 · 他的速度感很强',
        text:
          '曹操的魅力不止在“会算计”，而在于他总能迅速把局势转换成可执行方案。这个人物非常适合做节奏更强的动态文本。',
      },
      {
        title: '第二章 · 他既是政治人物，也是文学人物',
        text:
          '能写《短歌行》的人，和戏曲里那个单一反派，从来不是一回事。交互设计应该允许用户看到这种错位。',
      },
      {
        title: '第三章 · 他最适合做“多重标签碰撞”',
        text:
          '英雄、权臣、诗人、统帅、奸雄，这些词如果同时构成人像，会比静态简介更能呈现他的复杂。',
      },
    ],
    timeline: [
      { year: '155', event: '出生于沛国谯县。' },
      { year: '196', event: '迎献帝都许，掌握政治主动权。' },
      { year: '200', event: '官渡之战后奠定北方优势。' },
      { year: '208', event: '赤壁之战失利，但并未失去根本盘面。' },
      { year: '220', event: '病逝，曹魏政权基础已成。' },
    ],
  },
]

function App() {
  const [selectedId, setSelectedId] = useState(figures[0].id)
  const selected = useMemo(
    () => figures.find((figure) => figure.id === selectedId) ?? figures[0],
    [selectedId],
  )

  return (
    <main className="museum-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">History × Typography × Interaction</p>
          <h1>把历史人物变成一尊由史料文字塑成的会呼吸的人像。</h1>
          <p className="hero-text">
            进入页面先看到人物的上半身轮廓，所有描述他的文字沿着肩、颈、脸与衣纹漂浮聚合；点击后，整个人像折叠、翻页，展开成一本可阅读的历史书。
          </p>
          <div className="hero-tags">
            <span>文字成像</span>
            <span>人物半身像</span>
            <span>翻书转场</span>
            <span>历史学习网页</span>
          </div>
        </div>

        <div className="hero-preview" style={{ ['--accent' as string]: selected.accent }}>
          <div className="glow-ring" />
          <div className="preview-bookmark">概念预演</div>
          <div className="preview-silhouette active">
            {selected.portraitWords.map((word) => (
              <span
                key={`${selected.id}-${word.text}-${word.x}-${word.y}`}
                className={`word-chip ${word.size ?? 'sm'}`}
                style={{ left: `${word.x}%`, top: `${word.y}%` }}
              >
                {word.text}
              </span>
            ))}
          </div>
          <div className="preview-caption">
            <strong>{selected.name}</strong>
            <p>{selected.tagline}</p>
          </div>
        </div>
      </section>

      <section className="gallery-panel">
        <div className="section-heading">
          <p className="eyebrow">人物入口</p>
          <h2>先点一个人物，再把他翻成一本书。</h2>
        </div>

        <div className="figure-grid">
          {figures.map((figure) => {
            const active = figure.id === selected.id

            return (
              <button
                key={figure.id}
                type="button"
                className={`figure-card ${active ? 'active' : ''}`}
                style={{ ['--accent' as string]: figure.accent }}
                onClick={() => setSelectedId(figure.id)}
              >
                <div className="figure-stage">
                  <div className={`text-portrait ${active ? 'active' : ''}`}>
                    {figure.portraitWords.map((word) => (
                      <span
                        key={`${figure.id}-${word.text}-${word.x}-${word.y}`}
                        className={`word-chip ${word.size ?? 'sm'}`}
                        style={{ left: `${word.x}%`, top: `${word.y}%` }}
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="figure-meta">
                  <p className="dynasty">{figure.dynasty}</p>
                  <h3>{figure.name}</h3>
                  <p>{figure.title}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="book-panel" style={{ ['--accent' as string]: selected.accent }}>
        <div className="book-shell">
          <div className="book-spine" />
          <article className="book-page cover-page">
            <p className="eyebrow">点击人物后的展开状态</p>
            <h2>《{selected.name}》</h2>
            <p className="cover-subtitle">{selected.title}</p>
            <blockquote>{selected.quote}</blockquote>
            <p className="cover-idea">{selected.idea}</p>
          </article>

          <article className="book-page content-page">
            <div className="book-columns">
              <section>
                <h3>人物导读</h3>
                <p>{selected.intro}</p>

                <div className="chapter-list">
                  {selected.chapters.map((chapter) => (
                    <div key={chapter.title} className="chapter-card">
                      <h4>{chapter.title}</h4>
                      <p>{chapter.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <aside>
                <h3>生平时间线</h3>
                <ol className="timeline">
                  {selected.timeline.map((item) => (
                    <li key={`${selected.id}-${item.year}`}>
                      <span>{item.year}</span>
                      <p>{item.event}</p>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
