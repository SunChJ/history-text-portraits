import { useMemo, useState } from 'react'
import './App.css'

type Word = {
  text: string
  x: number
  y: number
  tier?: 'whisper' | 'body' | 'anchor'
}

type Figure = {
  id: string
  name: string
  title: string
  dynasty: string
  period: string
  atmosphere: string
  accent: string
  tags: string[]
  quote: string
  portraitWords: Word[]
  curatorNote: string
  readingIntro: string
  chapters: { index: string; title: string; text: string }[]
  timeline: { year: string; title: string; detail: string }[]
}

const figures: Figure[] = [
  {
    id: 'su-shi',
    name: '苏轼',
    title: '把失意活成旷达的人',
    dynasty: '北宋',
    period: '1037 — 1101',
    atmosphere: '月色、江流、贬谪、酒意与自我修复。',
    accent: '#d8a25f',
    tags: ['诗词', '赤壁', '黄州', '书画'],
    quote: '回首向来萧瑟处，归去，也无风雨也无晴。',
    portraitWords: [
      { text: '东坡', x: 50, y: 12, tier: 'anchor' },
      { text: '旷达', x: 34, y: 18, tier: 'body' },
      { text: '赤壁', x: 65, y: 19, tier: 'body' },
      { text: '明月', x: 42, y: 29, tier: 'whisper' },
      { text: '江流', x: 61, y: 31, tier: 'whisper' },
      { text: '贬谪', x: 26, y: 36, tier: 'body' },
      { text: '诗词', x: 53, y: 37, tier: 'body' },
      { text: '黄州', x: 72, y: 40, tier: 'whisper' },
      { text: '人生如逆旅', x: 32, y: 49, tier: 'whisper' },
      { text: '豁达', x: 53, y: 50, tier: 'anchor' },
      { text: '风骨', x: 72, y: 53, tier: 'body' },
      { text: '书画', x: 36, y: 63, tier: 'whisper' },
      { text: '自嘲', x: 58, y: 66, tier: 'whisper' },
      { text: '千古', x: 49, y: 80, tier: 'body' },
    ],
    curatorNote:
      '苏轼适合做这个项目的起点，因为他不是单一标签人物。他的文字本身就带有空间感、情绪余温与自我调适能力，最容易形成“由文本塑成的人像”。',
    readingIntro:
      '如果把一个历史人物理解成被无数描述共同塑造出来的形象，苏轼几乎是最理想的样本。他既有政治史里的跌宕，也有文学史里的高峰，更重要的是，他留下来的不是苦难本身，而是把苦难重新组织成审美与判断的能力。',
    chapters: [
      {
        index: 'I',
        title: '不是乐观，而是承受力',
        text:
          '苏轼的迷人，不在于他“看得开”，而在于他一次次遭遇现实重压后，依旧能把经验转译成可感、可思、可流传的语言。',
      },
      {
        index: 'II',
        title: '他的文字像一套修复系统',
        text:
          '诗、词、书、画、题跋与散文，在苏轼这里不是分开的门类，而是一整套继续与世界发生关系的方法。',
      },
      {
        index: 'III',
        title: '为什么今天仍然会被需要',
        text:
          '在一个容易被效率和评价压扁的时代，苏轼提供的不是成功学，而是一种更大尺度的活法：把挫折纳入生命，而不是让它定义生命。',
      },
    ],
    timeline: [
      {
        year: '1037',
        title: '出生于眉山',
        detail: '后来成为北宋文坛核心人物之一，作品跨越诗、词、文、书、画。',
      },
      {
        year: '1079',
        title: '乌台诗案',
        detail: '被贬黄州，这段经验改变了他的精神重心，也塑造了后来的东坡形象。',
      },
      {
        year: '1082',
        title: '赤壁书写',
        detail: '《赤壁赋》《念奴娇·赤壁怀古》等作品把个人遭际提升到更大的时间尺度。',
      },
      {
        year: '1094—1097',
        title: '再度远谪',
        detail: '从惠州到儋州，人生继续下沉，但文字与气度没有塌。',
      },
      {
        year: '1101',
        title: '北归病逝',
        detail: '他离开后，东坡成为一种文化人格，持续被后人召回。',
      },
    ],
  },
  {
    id: 'wu-zetian',
    name: '武则天',
    title: '权力、秩序与自我书写',
    dynasty: '武周',
    period: '624 — 705',
    atmosphere: '诏令、史官、制度、争议与权力可见性。',
    accent: '#b96a72',
    tags: ['女皇', '改制', '争议', '史书'],
    quote: '她的形象，常常比她本人更像一场叙述斗争。',
    portraitWords: [
      { text: '女皇', x: 50, y: 12, tier: 'anchor' },
      { text: '权力', x: 33, y: 18, tier: 'body' },
      { text: '诏令', x: 64, y: 18, tier: 'whisper' },
      { text: '武周', x: 49, y: 28, tier: 'body' },
      { text: '改制', x: 27, y: 35, tier: 'whisper' },
      { text: '史官', x: 70, y: 37, tier: 'whisper' },
      { text: '秩序', x: 44, y: 40, tier: 'anchor' },
      { text: '争议', x: 31, y: 50, tier: 'body' },
      { text: '统治', x: 55, y: 52, tier: 'body' },
      { text: '革新', x: 72, y: 54, tier: 'whisper' },
      { text: '神都', x: 39, y: 67, tier: 'whisper' },
      { text: '形象', x: 57, y: 68, tier: 'whisper' },
      { text: '帝国', x: 50, y: 80, tier: 'body' },
    ],
    curatorNote:
      '武则天适合做“历史如何塑造人物”的对照样本。这个人物不是被一种声音定义的，而是被赞誉、恐惧、秩序维护和史学偏见共同拉扯出来的。',
    readingIntro:
      '读武则天，最容易掉进道德标签的捷径。但真正有价值的，不是把她简化成传奇或恶名，而是看到她如何在一个原本不为她准备最高权位的结构里，重新改写制度与可见性。',
    chapters: [
      {
        index: 'I',
        title: '她先是制度问题',
        text:
          '武则天的存在迫使历史回答：最高权力究竟是不是一种被严格限定的身份。她的争议，往往从这里开始。',
      },
      {
        index: 'II',
        title: '史料既在记录，也在防御',
        text:
          '很多叙述并不是中性的，它们也在替某种秩序说话。所以这个人物天然适合用“冲突文字”做视觉呈现。',
      },
      {
        index: 'III',
        title: '她的复杂性值得被重新可视化',
        text:
          '对她的理解不该只剩戏剧性。真正高级的设计，是让多种声音同时在场，而不是让单一结论先入场。',
      },
    ],
    timeline: [
      { year: '624', title: '出生', detail: '后来进入唐宫，逐步进入权力核心。' },
      { year: '655', title: '立为皇后', detail: '宫廷权力格局发生根本变化。' },
      { year: '690', title: '正式称帝', detail: '建立武周，成为中国历史上唯一正统女皇帝。' },
      { year: '690—705', title: '治理时期', detail: '在制度、用人与权力运行上留下持续影响。' },
      { year: '705', title: '退位', detail: '唐朝国号恢复，但她留下的历史形象并未停止争议。' },
    ],
  },
  {
    id: 'cao-cao',
    name: '曹操',
    title: '乱世中的效率、雄心与阴影',
    dynasty: '东汉末',
    period: '155 — 220',
    atmosphere: '军政、诗歌、速度、猜忌与多重标签碰撞。',
    accent: '#7890d8',
    tags: ['魏武', '短歌行', '军政', '奸雄'],
    quote: '对酒当歌，人生几何。',
    portraitWords: [
      { text: '魏武', x: 50, y: 12, tier: 'anchor' },
      { text: '挟天子', x: 34, y: 18, tier: 'whisper' },
      { text: '诗人', x: 65, y: 18, tier: 'whisper' },
      { text: '北方', x: 28, y: 29, tier: 'whisper' },
      { text: '雄才', x: 50, y: 31, tier: 'anchor' },
      { text: '猜忌', x: 71, y: 34, tier: 'body' },
      { text: '赤壁', x: 33, y: 46, tier: 'body' },
      { text: '用人', x: 53, y: 48, tier: 'body' },
      { text: '军政', x: 72, y: 50, tier: 'whisper' },
      { text: '短歌行', x: 37, y: 62, tier: 'whisper' },
      { text: '多面', x: 58, y: 64, tier: 'body' },
      { text: '天下', x: 50, y: 80, tier: 'whisper' },
    ],
    curatorNote:
      '曹操适合用来展示“历史人物不该被一句话概括”。他身上最强的不是单一标签，而是多个身份彼此重叠产生的紧张感。',
    readingIntro:
      '曹操是最容易被戏剧化，也最值得被去戏剧化的人物之一。诗、权谋、军事、制度、个人雄心与后世脸谱，共同构成了一个始终不稳定的复杂形象。',
    chapters: [
      {
        index: 'I',
        title: '他的速度感构成魅力',
        text:
          '曹操不只是会谋划，而是总能把局势迅速转成行动方案。这种高执行密度，是人物气质的重要来源。',
      },
      {
        index: 'II',
        title: '文学性让他无法被脸谱化',
        text:
          '会写《短歌行》的人，不可能只是一个扁平反派。真正的设计，应该允许用户看到这层错位。',
      },
      {
        index: 'III',
        title: '多重标签同时在场才真实',
        text:
          '英雄、权臣、诗人、统帅、奸雄——这些词同时构成人像时，人物才会真正站起来。',
      },
    ],
    timeline: [
      { year: '155', title: '出生', detail: '出身沛国谯县，后成为东汉末最关键的政治军事人物之一。' },
      { year: '196', title: '迎献帝都许', detail: '由此握住政治主动权。' },
      { year: '200', title: '官渡之战', detail: '北方优势逐渐确立。' },
      { year: '208', title: '赤壁失利', detail: '遭遇重大挫折，但并未失去基本盘。' },
      { year: '220', title: '病逝', detail: '曹魏政权的结构基础已经形成。' },
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
    <main className="museum-shell" style={{ ['--accent' as string]: selected.accent }}>
      <section className="hero-stage">
        <div className="ambient-grid" aria-hidden="true" />
        <div className="ambient-noise" aria-hidden="true" />

        <header className="topbar">
          <div>
            <p className="mono-label">Archive / Prototype</p>
            <strong className="brand-name">History Text Portraits</strong>
          </div>
          <div className="topbar-meta">
            <span>Text-built figures</span>
            <span>Curated reading object</span>
          </div>
        </header>

        <div className="hero-layout">
          <aside className="curator-panel">
            <p className="mono-label">Curatorial thesis</p>
            <h1>把历史人物做成一尊由史料文字聚合而成的可阅读人像。</h1>
            <p className="lead">
              不是普通百科页，也不是只会发光的概念稿。这个站点想做的是：先让人物以“被叙述塑造出来的形态”出现，再让这些文字回流、重排，展开成一本可慢慢读的历史书。
            </p>

            <div className="lead-notes">
              <div>
                <span className="mono-label">Method</span>
                <p>先做舞台，再放内容；一个页面只保一个主角。</p>
              </div>
              <div>
                <span className="mono-label">Motion</span>
                <p>动效像呼吸，不像弹窗；文字先失稳，再翻成书页。</p>
              </div>
            </div>

            <div className="tag-row">
              {selected.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>

          <section className="hero-object">
            <div className="specimen-caption">
              <span className="mono-label">Active specimen</span>
              <div>
                <h2>{selected.name}</h2>
                <p>
                  {selected.dynasty} · {selected.period}
                </p>
              </div>
            </div>

            <div className="portrait-chamber">
              <div className="portrait-halo" aria-hidden="true" />
              <div className="portrait-outline">
                {selected.portraitWords.map((word) => (
                  <span
                    key={`${selected.id}-${word.text}-${word.x}-${word.y}`}
                    className={`word-chip ${word.tier ?? 'body'}`}
                    style={{ left: `${word.x}%`, top: `${word.y}%` }}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
              <div className="portrait-footer">
                <p className="mono-label">Atmosphere</p>
                <p>{selected.atmosphere}</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="selection-rail">
        <div className="section-header">
          <div>
            <p className="mono-label">Figure selection</p>
            <h2>先选一个人物，再进入这场文字重组的阅读实验。</h2>
          </div>
          <p className="section-note">
            这些入口不再是普通卡片，而更像封存中的展签、档案与标本盒。
          </p>
        </div>

        <div className="figure-grid">
          {figures.map((figure) => {
            const isActive = figure.id === selected.id
            return (
              <button
                key={figure.id}
                type="button"
                className={`archive-card ${isActive ? 'active' : ''}`}
                style={{ ['--card-accent' as string]: figure.accent }}
                onClick={() => setSelectedId(figure.id)}
              >
                <div className="archive-card-head">
                  <span className="mono-label">{figure.dynasty}</span>
                  <span className="archive-dot" />
                </div>
                <div className="mini-portrait">
                  {figure.portraitWords.slice(0, 8).map((word) => (
                    <span
                      key={`${figure.id}-${word.text}`}
                      className={`mini-word ${word.tier ?? 'body'}`}
                      style={{ left: `${word.x}%`, top: `${word.y}%` }}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
                <div className="archive-card-body">
                  <h3>{figure.name}</h3>
                  <p>{figure.title}</p>
                  <span className="archive-period">{figure.period}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="book-stage">
        <div className="book-stage-head">
          <div>
            <p className="mono-label">Expanded book state</p>
            <h2>当人物被选中，文字开始回流，形象展开为一本历史书。</h2>
          </div>
          <blockquote>{selected.quote}</blockquote>
        </div>

        <div className="book-shell">
          <div className="book-spine" />

          <article className="book-cover-page">
            <p className="mono-label">Specimen cover</p>
            <h3>《{selected.name}》</h3>
            <p className="cover-title">{selected.title}</p>
            <p className="cover-meta">
              {selected.dynasty} · {selected.period}
            </p>
            <div className="cover-note">
              <span className="mono-label">Curator note</span>
              <p>{selected.curatorNote}</p>
            </div>
          </article>

          <article className="book-reading-page">
            <div className="reading-grid">
              <section className="reading-column intro-column">
                <div className="reading-block">
                  <span className="mono-label">Reading entry</span>
                  <p>{selected.readingIntro}</p>
                </div>

                <div className="chapter-stack">
                  {selected.chapters.map((chapter) => (
                    <article key={chapter.index} className="chapter-card">
                      <div className="chapter-index">{chapter.index}</div>
                      <div>
                        <h4>{chapter.title}</h4>
                        <p>{chapter.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="reading-column timeline-column">
                <span className="mono-label">Timeline</span>
                <ol className="timeline-list">
                  {selected.timeline.map((item) => (
                    <li key={`${selected.id}-${item.year}`}>
                      <div className="timeline-year">{item.year}</div>
                      <div className="timeline-copy">
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
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
