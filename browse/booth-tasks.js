/* Presentation only: emphasize existing task words without changing plain-text records. */
(() => {
  const actions = [
    ['search', 'find', 'compare', 'choose', 'select', 'set', 'tick', 'save', 'download', 'add', 'keep', 'check', 'open', 'avoid', 'track', 'plan'],
    ['搜索', '搜', '找到', '查询', '对比', '比较', '选择', '设为', '勾选', '勾', '收藏', '下载', '加入', '保存', '保留', '核对', '检查', '打开', '避开', '不要从赞助结果进入']
  ];
  const keywords = {
    'minute2-wall-earthrise': [
      ['Earthrise', '1972', '3840 × 2160', 'JPG', 'two versions', 'both'],
      ['Earthrise', '1972 年', '3840 × 2160', 'JPG', '两张']
    ],
    'minute2-recipe-budget': [
      ['Red lentil & tomato soup', 'RM5 per serving', 'six servings', 'red lentils', 'shopping list'],
      ['红扁豆番茄汤', 'RM5', '六人份', '红扁豆', '采购清单']
    ],
    'minute2-tool-webp': [
      ['La Trobe Reading Room', 'WebP', 'width 800 px', '800 px', 'width 800', '70%', 'export settings'],
      ['拉筹伯阅览室', '选 WebP', 'WebP', '宽 800 px', '800 px', '宽 800', '70%', '导出设置']
    ],
    'minute2-movie-animation': [
      ['Sintel', 'Elephants Dream', 'watchlist', 'only these two films'],
      ['辛特尔', '大象之梦', '想看片单', '只留这两部']
    ],
    'minute2-outing-craft': [
      ['Central Market', 'RM20', 'return journey', 'weather', 'departure list', 'departure checklist', 'indoors'],
      ['中央艺术坊', 'RM20', '返程', '天气', '出发清单', '室内']
    ],
    'minute2-book-verne': [
      ['Around the World in Eighty Days', 'English', 'French', 'both editions', 'TXT', 'opening excerpt'],
      ['八十天环游地球', '英文', '法文', '两个版本', 'TXT', '开篇']
    ],
    'minute2-museum-manet': [
      ['Manet', 'Boating', 'The Monet Family in Their Garden at Argenteuil', 'under 100 cm', 'narrower than 100 cm', '100 cm', 'My Exhibition', 'width'],
      ['Manet', '划船', '莫奈一家在阿让特伊的花园里', '宽度不到 100 cm', '100 cm', '我的展览', '较窄']
    ],
    'minute2-nature-woodpeckers': [
      ['woodpecker', 'Downy', 'Red-bellied Woodpecker', 'shorter', 'observation list', 'Length'],
      ['woodpecker', '绒啄木鸟', '红腹啄木鸟', '体长较短', '较短者', '观察清单', '体长']
    ],
    'minute2-travel-interchange': [
      ['KLCC', 'KJ', 'Bukit Bintang', '17:20', 'Less walking', 'KG'],
      ['KLCC', 'KJ', '武吉免登', '17:20', '较少步行', 'KG']
    ],
    'minute2-market-lens': [
      ['RM700', 'EOS 550D', 'Good', 'Excellent', 'camera and lens', 'lens included', 'body and lens included', 'Included items', 'kit listing'],
      ['RM700', 'EOS 550D', '良好', '极佳', '机身和镜头', '含机身和镜头', '附带物品', '套机刊登']
    ],
    'minute3-courier-redelivery': [
      ['TM24081301', 'tomorrow afternoon', 'Tomorrow', '14:00–18:00', 'campus parcel desk address', 'free redelivery'],
      ['TM24081301', '明天下午', '明天', '14:00–18:00', '校园收件处地址', '免费改约']
    ],
    'minute3-search-official': [
      ['Pixelpress', 'official', 'free', 'getting-started TXT', 'TXT', 'sponsored results', 'pixelpress.example'],
      ['Pixelpress', '官方站点', '官方结果', '免费', '入门说明 TXT', 'TXT', '赞助结果', 'pixelpress.example']
    ],
    'minute4-penang-indoor': [
      ['Malaysia', 'Penang', 'indoor attraction', 'at most 3 hours', '3 hours', 'RM30', '≤3h', '≤RM30'],
      ['马来西亚', '槟城', '室内景点', '不超过3小时', '≤3小时', '不超过RM30', '≤RM30', 'RM30']
    ]
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const pattern = term => {
    const literal = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (/^[a-z0-9]/i.test(term) ? '\\b' : '') + literal + (/[a-z0-9]$/i.test(term) ? '\\b' : '');
  };
  window.BROWSE_BOOTH_TASK_TEXT = (value, task, lang) => {
    const text = String(value ?? ''), index = lang === 'en' ? 0 : 1;
    const terms = [...new Set([...actions[index], ...(keywords[task?.id]?.[index] || [])])].sort((a,b) => b.length-a.length);
    const matches = new RegExp(terms.map(pattern).join('|'), 'gi');
    let html = '', end = 0;
    for (const match of text.matchAll(matches)) {
      html += escape(text.slice(end, match.index)) + '<strong class="br-task-key">' + escape(match[0]) + '</strong>';
      end = match.index + match[0].length;
    }
    return html + escape(text.slice(end));
  };
})();

/* Earlier round records still resolve their original briefs and answers. */
window.BROWSE_BOOTH_LEGACY_TASKS = [
  {
    id: 'minute-wall-aurora', scene: 'wallpapers', file: 'wallpaper.html', site: 'Stillwall',
    title: ['Green light from orbit', '绿色轨道壁纸'],
    brief: ['Find a NASA photograph of a green aurora taken from orbit in 2012. Save it and download a 2560 × 1440 wallpaper.', '找一张2012年从轨道拍摄的NASA绿色极光照片，收藏，并下载2560 × 1440壁纸。'],
    goals: [['Save the correct photograph.', '收藏正确的照片。'], ['Export its wallpaper at 2560 × 1440.', '为它导出2560 × 1440壁纸。']],
    route: [['Search “aurora”, or filter NASA + green.', '搜索 aurora 或“极光”，也可筛选NASA＋绿色。'], ['Open “Orbital aurora” and check the date: 2012-03-03.', '打开“轨道极光”，核对日期2012-03-03。'], ['Save it, select 2560 × 1440 and download.', '加入收藏，选2560 × 1440，再下载壁纸。']],
    answer: ['Orbital aurora · orbital-aurora · NASA iss030e119777. Check the export record and, where possible, the downloaded file; a button click alone does not prove a file was saved.', '轨道极光 · orbital-aurora · NASA iss030e119777。核对导出记录；可行时检查下载文件。只点下载按钮不代表文件已保存。'],
    cover: 'assets/nasa-iss030e119777-thumb.webp', advanced: false
  },
  {
    id: 'minute-recipe-lunch', scene: 'recipes', file: 'recipe.html', site: 'Pantry & Plate',
    title: ['Lunch for four', '四人份午餐'],
    brief: ['Find a no-cook vegan chickpea lunch ready within 15 minutes. Set it to four servings and save the recipe.', '找一道不用开火、15分钟内能做好的鹰嘴豆纯素午餐，将份量改为4人，并收藏。'],
    goals: [['Save the correct recipe.', '收藏正确的食谱。'], ['Set the servings to 4.', '把份量设为4人。']],
    route: [['Search “chickpea”.', '搜索 chickpea 或“鹰嘴豆”。'], ['Open “Lemon chickpea & cucumber salad”; check vegan, no-cook and 10 minutes.', '打开“柠檬鹰嘴豆黄瓜沙拉”，核对纯素、无需烹饪和10分钟。'], ['Set 4 servings and save.', '选择4人份，再收藏。']],
    answer: ['chickpea-salad. The two-serving recipe uses 240 g chickpeas; four servings show 480 g. Asking this is an optional spoken check.', 'chickpea-salad。原配方2人份用240 g鹰嘴豆，4人份显示480 g；可口头询问，作为额外核对。'],
    cover: 'assets/real-food-chickpea-salad-thumb.webp', advanced: false
  },
  {
    id: 'minute-tool-webp', scene: 'tools', file: 'tools.html', site: 'Pixelpress',
    title: ['An image made for the web', '导出网页图片'],
    brief: ['Use the “Chinatown after dark” sample to export a WebP image, 1280 pixels wide, at 75% quality.', '使用“唐人街入夜”示例，导出宽1280像素、质量75%的WebP图片。'],
    goals: [['Use “Chinatown after dark”.', '使用“唐人街入夜”示例。'], ['Choose WebP, width 1280 and quality 75%.', '选择WebP、宽1280、质量75%。'], ['Generate the result and download it.', '生成结果，并下载图片。']],
    route: [['Load “Chinatown after dark”.', '加载“唐人街入夜 / Chinatown after dark”。'], ['Choose WebP, width 1280, quality 75%.', '格式选WebP、宽1280、质量75%。'], ['Generate, inspect the result and download.', '生成并检查结果，再下载。']],
    answer: ['Sample city · blue-hour-street. The 2400 × 1600 source becomes 1280 × 853 with its aspect ratio kept. Output bytes vary by browser.', '示例city，对应blue-hour-street。源图2400 × 1600，保持比例后为1280 × 853。不同浏览器的文件字节数可能不同。'],
    cover: 'assets/real-wall-blue-hour-street-thumb.webp', advanced: false
  },
  {
    id: 'minute-movie-steel', scene: 'movies', file: 'movie.html', site: 'Frame Movies',
    title: ['A short science-fiction find', '找到科幻短片'],
    brief: ['Find an English-language science-fiction short released in 2012, directed by Ian Hubert and under 15 minutes. Add it to your watchlist.', '找一部2012年、Ian Hubert执导、片长不到15分钟的英语科幻短片，并加入想看片单。'],
    goals: [['Add the correct film to your watchlist.', '把正确电影加入想看片单。']],
    route: [['Filter by year, language and running time, or search “Ian Hubert”.', '使用年份、语言、片长筛选，或搜索 Ian Hubert。'], ['Open “Tears of Steel”; check 2012, Ian Hubert and about 12 minutes.', '打开“Tears of Steel”，核对2012、Ian Hubert和约12分钟。'], ['Add it to your watchlist.', '加入想看片单。']],
    answer: ['steel · Tears of Steel. Watching the whole film or local preview is not required; their running times differ.', 'steel · Tears of Steel。无需看完整影片或当地预览片段；两者时长不同。'],
    cover: 'assets/video-steel.jpg', advanced: false
  },
  {
    id: 'minute-outing-museum', scene: 'events', file: 'events.html', site: 'Out There KL',
    title: ['A museum for a rainy day', '雨天去博物馆'],
    brief: ['Find an indoor history-museum outing in Kuala Lumpur, reachable by rail, taking at most 3 hours with a planning budget no higher than RM30. Add it to your weekend plan.', '寻找吉隆坡一条室内历史博物馆路线，能够搭轨道交通到达、最多3小时、参考预算不超过RM30，并加入周末计划。'],
    goals: [['Add the correct outing to your weekend plan.', '把正确路线加入周末计划。']],
    route: [['Search “museum”.', '搜索 museum 或“博物馆”。'], ['Check indoor, rail access, 3 hours and RM30.', '核对室内、轨道交通、3小时和RM30。'], ['Open “A slow walk through the museum timeline”, check the National Museum and add it to your plan.', '打开“沿博物馆时间线慢慢看”，核对国家博物馆，再加入周末计划。']],
    answer: ['museum-four-galleries. RM30 is a planning allowance in the practice website, not a live ticket quote.', 'museum-four-galleries。RM30是练习网页的规划预留，并非实时门票报价。'],
    cover: 'assets/real-outing-museum-four-galleries-thumb.webp', advanced: false
  },
  {
    id: 'minute-book-alice', scene: 'books', file: 'book.html', site: 'Folio',
    title: ['Follow the White Rabbit', '追随白兔'],
    brief: ['Find an English fantasy first published in 1865, in which a girl follows a white rabbit. Save the book and download its opening excerpt as a TXT file.', '找一本1865年首次出版、女孩追随白兔的英语奇幻作品，加入阅读清单，并下载开篇片段TXT。'],
    goals: [['Add the correct book to your reading list.', '把正确书籍加入阅读清单。'], ['Download its opening excerpt as TXT.', '下载它的开篇片段TXT。']],
    route: [['Filter Fantasy + English, or search “rabbit”.', '筛选奇幻＋英语，或搜索 rabbit。'], ['Open “Alice’s Adventures in Wonderland”; check Lewis Carroll and 1865, then save.', '打开“Alice’s Adventures in Wonderland”，核对Lewis Carroll和1865，再加入清单。'], ['Open the reading excerpt and choose “Download this excerpt”.', '打开阅读片段，点击“下载此片段”。']],
    answer: ['alice · Alice’s Adventures in Wonderland. Reading view: book.html?id=alice&view=read. File: folio-alice-excerpt.txt. Marking it read is not required.', 'alice ·《爱丽丝梦游仙境》。片段路由book.html?id=alice&view=read；文件folio-alice-excerpt.txt。无需标记已读。'],
    cover: 'assets/culture-book-alice-thumb.webp', advanced: false
  },
  {
    id: 'minute-museum-wave', scene: 'museum', file: 'museum.html', site: 'Open Collection',
    title: ['A great wave, a distant mountain', '寻找巨浪与富士山'],
    brief: ['Find a Japanese woodblock print from about 1830–1832, with a great wave surrounding a small mountain in the distance. Add it to “My exhibition”.', '找一幅约1830—1832年的日本木版画，画中巨浪围绕远处的小山，将它加入“我的展览”。'],
    goals: [['Add the correct artwork to “My exhibition”.', '把正确作品加入“我的展览”。']],
    route: [['Filter Woodblock print + Japan, or use search.', '筛选木版画＋Japan，也可使用搜索。'], ['Open “Under the Wave off Kanagawa / The Great Wave”; check Katsushika Hokusai and about 1830–32.', '打开“Under the Wave off Kanagawa / The Great Wave”，核对Katsushika Hokusai和约1830–32。'], ['Add it to “My exhibition”.', '加入“我的展览”。']],
    answer: ['56353 · Katsushika Hokusai, Under the Wave off Kanagawa (The Great Wave). Other valid search and browsing routes are equally acceptable.', '56353 · 葛饰北斋《神奈川冲浪里》。其他有效的搜索或目录路线同样可以。'],
    cover: 'assets/culture-art-56353-thumb.webp', advanced: false
  },
  {
    id: 'minute-nature-cardinal', scene: 'nature', file: 'nature.html', site: 'Field Guide',
    title: ['Name the red garden bird', '识别花园红鸟'],
    brief: ['In the North American bird guide, identify a red garden bird with a pointed crest and a thick orange-red bill. Add it to your observation list.', '在北美鸟类资料中，找出花园里有尖羽冠、橙红色粗喙的红色鸟，并加入观察清单。'],
    goals: [['Add the correct bird to your observation list.', '把正确鸟类加入观察清单。'], ['Show the crest and bill field marks to the staff.', '向工作人员核对尖羽冠和喙的特征。']],
    route: [['Filter Red + Garden.', '筛选红色＋花园。'], ['Open “Northern Cardinal”; check the pointed crest and thick bill.', '打开“Northern Cardinal / 北美红雀”，核对尖羽冠和粗喙。'], ['Add it using the existing default observation fields.', '使用页面已有默认观察字段加入清单。']],
    answer: ['cardinal · Northern Cardinal. Red colour alone is not enough: House Finch is not the target. Field-mark recognition is a staff check.', 'cardinal · 北美红雀。不能只凭红色选House Finch；外观特征由工作人员核对。'],
    cover: 'assets/journey-cardinal-0-thumb.webp', advanced: false
  },
  {
    id: 'minute-travel-klcc', scene: 'travel', file: 'travel.html', site: 'Trackside',
    title: ['From Sentral to KLCC', '从中央车站去KLCC'],
    brief: ['Plan and save a journey leaving at 10:00 from KL Sentral on the Kelana Jaya line to KLCC.', '规划10:00从KL Sentral的Kelana Jaya线站点到KLCC的行程，并保存路线。'],
    goals: [['Set KL Sentral (KJ) → KLCC (KJ), at 10:00.', '设置KL Sentral（KJ）→ KLCC（KJ），时间10:00。'], ['Save the journey with 0 interchanges.', '保存0次换乘的行程。']],
    route: [['Set departure to KL Sentral (KJ), arrival to KLCC (KJ).', '出发选KL Sentral（KJ），到达选KLCC（KJ）。'], ['Keep the default date, set 10:00 and plan the journey.', '保留默认日期，时间设10:00，再规划。'], ['Inspect the recommendation and save it.', '查看推荐路线，再保存行程。']],
    answer: ['From sentral-kj to klcc, 10:00, 0 interchanges. The practice timetable gives boarding 10:06, arrival 10:19 and exit 10:21. No ICS export is required.', 'sentral-kj → klcc，10:00，0次换乘。练习时刻表为10:06上车、10:19到站、10:21出站。无需导出ICS。'],
    cover: 'assets/journey-rail-train-0-thumb.webp', advanced: true
  },
  {
    id: 'minute-market-starter', scene: 'market', file: 'market.html', site: 'loop',
    title: ['A camera body under RM500', 'RM500内的相机机身'],
    brief: ['Find a Canon DSLR body in Kuala Lumpur, in Good condition, for no more than RM500. Save the listing and check whether a lens is included.', '寻找位于吉隆坡、状态Good、RM500以内的Canon单反机身，收藏，并核对是否包含镜头。'],
    goals: [['Save the correct listing.', '收藏正确的刊登。'], ['Tell the staff whether a lens is included.', '向工作人员说明是否包含镜头。']],
    route: [['Filter Canon + Good + maximum RM500 + Kuala Lumpur.', '筛选Canon＋Good＋最高价500＋Kuala Lumpur。'], ['Open the RM420 Canon EOS 550D and read what is included.', '打开RM420的Canon EOS 550D，阅读附带物品。'], ['Save the listing and confirm it is body only.', '收藏，并核对是body only。']],
    answer: ['canon-good · RM420. Body, battery, charger and body cap; no lens. This is a fictional practice listing; the reference photograph is illustrative.', 'canon-good · RM420。包含机身、电池、充电器、机身盖，不含镜头。这是练习用虚构刊登，参考照片仅作展示。'],
    cover: 'assets/market-canon-eos-550d.webp', advanced: true
  }
];

/* Current booth briefs. Cover images illustrate each site without revealing its answer. */
window.BROWSE_BOOTH_TASKS = [
  {
    id: "minute2-wall-earthrise",
    scene: "wallpapers",
    file: "wallpaper.html",
    site: "Stillwall",
    title: ["A 4K backdrop for the club booth","给社团展台下载高清背景"],
    brief: ["Your club needs the 1972 Earthrise photo for its screen. Search Earthrise, compare the two versions, then download the 1972 photo as a 3840 × 2160 JPG.","社团展台缺一张高清地球背景。搜 Earthrise，把两张照片加入对比，再下载标为 1972 年的那张，尺寸 3840 × 2160 JPG。"],
    hint: ["Use the catalogue search and comparison controls; check the dated photo descriptions.","从目录搜索和对比控件入手，核对照片说明里的年份。"],
    goals: [["Compare the two available versions.","对比两个版本。"],["Download the 1972 photograph at 3840 × 2160.","下载 1972 年照片的 3840 × 2160 JPG。"]],
    route: [["Search Earthrise and add both results to Compare.","搜「地出」或 Earthrise，把两张结果都加入对比。"],["Check the mission in the photograph description. Open the Apollo 16 result.","在照片说明里核对任务，打开阿波罗 16 号的结果。"],["Select 3840 × 2160 and download the wallpaper.","选择 3840 × 2160，下载壁纸。"]],
    answer: ["earthrise-1968 (Apollo 8) and earthrise-1972 (Apollo 16). Export only earthrise-1972 at 3840 × 2160.","对比 earthrise-1968（阿波罗 8 号）和 earthrise-1972（阿波罗 16 号）。只导出后者的 3840 × 2160 JPG。"],
    cover: "assets/nasa-as08-14-2383-thumb.webp",
    advanced: false,
    badge: ["Earthrise·1972","Earthrise·1972"],
    steps: [["Compare both Earthrise photographs","对比两张 Earthrise 照片"],["Choose the 1972 photograph","选择 1972 年照片"],["Download 3840 × 2160 JPG","下载 3840 × 2160 JPG"]],
    hint2: ["Use Earthrise to find both versions; choose the 1972 photo and the 3840 × 2160 export.","搜索 Earthrise 找到两个版本；选 1972 年照片和 3840 × 2160 导出。"]
  },
  {
    id: "minute2-recipe-budget",
    scene: "recipes",
    file: "recipe.html",
    site: "Pantry & Plate",
    title: ["Plan dinner for six","安排六人份晚餐"],
    brief: ["Six friends are cooking together tonight. Find Red lentil & tomato soup (RM5 per serving), set six servings, tick red lentils on the shopping list and save the recipe.","今晚六个朋友一起做饭。找到每份 RM5 的「红扁豆番茄汤」，设为六人份，在采购清单勾选红扁豆，再收藏食谱。"],
    hint: ["Use the recipe search, then look for servings and the shopping checklist on the detail page.","从食谱搜索入手，再到详情页找份量和采购清单。"],
    goals: [["Save the matching recipe.","收藏符合条件的食谱。"],["Set six servings and tick the lentils.","设成六人份，并勾选扁豆。"]],
    route: [["Start with the one-pot or vegan category. Narrow by budget and check the total time.","从「一锅料理」或纯素筛选入手，核对预算和总用时。"],["Open the red lentil and tomato soup, jump to its recipe and set six servings.","打开红扁豆番茄汤，跳到食谱并设为六人份。"],["Tick red lentils and save the recipe.","勾选红扁豆并收藏食谱。"]],
    answer: ["red-lentil-soup · RM5 per serving, 35 minutes, vegan, one pot. At six servings the checklist shows 420 g of red lentils.","red-lentil-soup · 每份 RM5，35 分钟，纯素，一口锅。六人份的食材清单显示 420 g 红扁豆。"],
    cover: "assets/real-food-red-lentil-soup-thumb.webp",
    advanced: false,
    badge: ["6 servings·RM5","红扁豆汤·6人·RM5/份"],
    steps: [["Red lentil & tomato soup · RM5 per serving","红扁豆番茄汤 · RM5/份"],["Set six servings","设为六人份"],["Tick red lentils","勾选红扁豆"],["Save the recipe","收藏食谱"]],
    hint2: ["Search lentil, open the soup and use Jump to recipe to find servings and red lentils.","搜扁豆，打开汤后用「跳到食谱」寻找份量和红扁豆。"]
  },
  {
    id: "minute2-tool-webp",
    scene: "tools",
    file: "tools.html",
    site: "Pixelpress",
    title: ["A portrait photo for the club page","社团网页的竖版照片"],
    brief: ["Your club page needs a smaller photo. Use the La Trobe Reading Room example, set WebP, width 800 px and quality 70%, then download it. You do not need to upload your own photo.","社团网页需要一张小一点的照片。使用「拉筹伯阅览室」示例，选 WebP、宽 800 px、画质 70%，再下载。不用上传自己的照片。"],
    hint: ["Start with the sample gallery, then use the export settings beside the preview.","从示例图库开始，再使用预览旁的导出设置。"],
    goals: [["Export the matching example.","导出符合描述的示例。"],["Download the generated WebP at 800 px wide and 70% quality.","下载生成的 WebP，宽 800 px，画质 70%。"]],
    route: [["Look through the example photos and load the La Trobe Reading Room.","浏览示例照片，载入拉筹伯阅览室。"],["Select WebP, width 800 and quality 70%. The settings update the preview automatically.","设为 WebP、宽 800、画质 70%，预览会自动更新。"],["Check the result and download it.","核对结果后下载。"]],
    answer: ["sunroom (sunroom-study). The 1558 × 2048 source scales to 800 × 1052. Use custom settings.","sunroom（拉筹伯阅览室）。原图 1558 × 2048，按比例生成 800 × 1052。使用自定义设置。"],
    cover: "assets/real-wall-sunroom-study-thumb.webp",
    advanced: false,
    badge: ["WebP·800px·70%","WebP·800px·70%"],
    steps: [["Use the La Trobe Reading Room sample","使用拉筹伯阅览室示例"],["WebP · 800 px · quality 70%","WebP · 宽 800 px · 画质 70%"],["Download the generated image","下载生成图片"]],
    hint2: ["Choose La Trobe Reading Room from the samples. Use custom settings: WebP, width 800 and quality 70%.","示例选拉筹伯阅览室；自定义设为 WebP、宽 800、画质 70%。"]
  },
  {
    id: "minute2-movie-animation",
    scene: "movies",
    file: "movie.html",
    site: "Frame Movies",
    title: ["Save two films for movie night","为电影夜存好两部短片"],
    brief: ["Movie night needs Sintel and Elephants Dream. Add both to your watchlist and keep only these two films there.","电影夜看《辛特尔》和《大象之梦》。把这两部加入想看片单，并且片单里只留这两部。"],
    hint: ["Use the catalogue search, then check your saved selection in Watchlist.","从目录搜索入手，最后到想看片单核对收藏。"],
    goals: [["Save Sintel and Elephants Dream.","收藏《辛特尔》和《大象之梦》。"],["Keep only these two in the watchlist.","想看片单只保留这两部。"]],
    route: [["Narrow to Fantasy and check the language and running time.","先筛选奇幻，核对语言和片长。"],["Search Sintel and Elephants Dream by name.","分别搜索 Sintel 和 Elephants Dream。"],["Add Sintel and Elephants Dream to the watchlist.","将《辛特尔》和《大象之梦》加入想看片单。"]],
    answer: ["sintel (15 min) and elephants-dream (11 min). The catalogue runtimes describe the works, not the embedded preview lengths.","sintel（15 分钟）和 elephants-dream（11 分钟）。用目录的正片片长核对，无需播放影片。"],
    cover: "assets/open-film-elephants-dream.jpg",
    coverNote: ["Elephants Dream · official film still · (CC) Blender Foundation | studio.blender.org","大象之梦 · 官方剧照 · (CC) Blender Foundation | studio.blender.org"],
    advanced: false,
    badge: ["Sintel·2 films","辛特尔·大象之梦·仅两部"],
    steps: [["Add Sintel to the watchlist","把辛特尔加入想看"],["Add Elephants Dream to the watchlist","把大象之梦加入想看"],["Keep only these two films","片单只留这两部"]],
    hint2: ["Search Sintel and Elephants Dream separately; check Watchlist after saving both.","分别搜 Sintel 和 Elephants Dream；都收藏后打开想看片单检查。"]
  },
  {
    id: "minute2-outing-craft",
    scene: "events",
    file: "events.html",
    site: "Out There KL",
    title: ["A rainy-afternoon gift hunt","雨天去找一件手作礼物"],
    brief: ["You want to buy a handmade gift this weekend without getting caught in the rain. Find the Central Market craft guide (RM20 planning budget), save it, and tick return journey and weather on its departure list.","周末想去买一件手作礼物，又怕下雨。找到中央艺术坊的手作路线（参考预算 RM20），加入周末计划，并在出发清单勾选返程和天气。"],
    hint: ["Look for a sheltered shopping guide, then inspect its plan and departure checklist.","寻找有遮蔽的购物指南，再检查计划和出发清单。"],
    goals: [["Save the matching outing to your weekend plan.","把符合条件的行程加入周末计划。"],["Tick the return journey and weather entries in its departure checklist.","在出发清单勾选返程和天气两项。"]],
    route: [["Choose Malaysia → Kuala Lumpur, then filter for indoor outings and rail access. Check the budget and craft theme.","先选马来西亚 → 吉隆坡，再筛选室内和轨道交通，核对预算及手作主题。"],["Open the Central Market craft outing and check the optional outdoor strip in its rain plan.","打开中央艺术坊的手作路线，从雨天方案核对可跳过的室外路段。"],["Save it and tick the return journey and weather entries in the departure checklist.","收藏，并在出发清单勾选返程和天气。"]],
    answer: ["market-craft · Central Market & Kasturi Walk, RM20, 2.5 hours. The outdoor strip is optional. Record the two specified checklist entries.","market-craft · 中央艺术坊与 Kasturi Walk，RM20，2.5 小时。室外步行街可跳过，核对指定两项出发检查。"],
    cover: "assets/real-outing-market-craft-thumb.webp",
    advanced: false,
    badge: ["RM20·indoor","中央艺术坊·室内·RM20"],
    steps: [["Central Market · indoors · RM20","中央艺术坊 · 室内 · RM20"],["Save the craft guide to your plan","把手作指南加入计划"],["Tick return journey and weather","勾选返程和天气"]],
    hint2: ["Search Central Market. Open Batik, baskets & a sheltered craft browse; tick return journey and weather in its departure list.","搜中央艺术坊，打开「蜡染、编篮与室内手作慢逛」；在出发清单勾返程和天气。"]
  },
  {
    id: "minute2-book-verne",
    scene: "books",
    file: "book.html",
    site: "Folio",
    title: ["Two languages for a reading group","读书会的双语选本"],
    brief: ["Your reading group needs English and French copies of Around the World in Eighty Days. Save both editions, then download the French opening excerpt as TXT to bring to the meeting.","读书会要用《八十天环游地球》的英文和法文版。收藏两个版本，再下载法文开篇 TXT，带去讨论。"],
    hint: ["Use the catalogue search and edition language labels; the reading view contains the excerpt export.","使用目录搜索和版本语言标签；片段导出在阅读页。"],
    goals: [["Save both language editions of the work.","收藏这部作品的两个语言版本。"],["Download the French opening excerpt as TXT.","下载法文开篇的 TXT。"]],
    route: [["Browse Adventure or search for Jules Verne once identified from an edition.","浏览「冒险」类别，认出作者后也可以搜 Jules Verne。"],["Check the language on both 1873 editions and save both.","核对两个 1873 年版本的语言，并分别收藏。"],["Download the opening excerpt from the French edition.","从法文版下载开篇片段。"]],
    answer: ["around-world (English) and around-world-fr (French). Correct excerpt: folio-around-world-fr-excerpt.txt.","around-world（英文）与 around-world-fr（法文）。正确片段是 folio-around-world-fr-excerpt.txt。"],
    cover: "assets/culture-book-around-world-thumb.webp",
    advanced: false,
    badge: ["English·French","八十天·英法·法文TXT"],
    steps: [["Save the English edition of Around the World in Eighty Days","收藏八十天环游地球英文版"],["Save the French edition","收藏法文版"],["Download the French opening excerpt TXT","下载法文开篇 TXT"]],
    hint2: ["Search Verne. Check Language to distinguish the editions; open the French reading excerpt for its TXT download.","搜 Verne，用语言区分两个版本；打开法文阅读片段下载 TXT。"]
  },
  {
    id: "minute2-museum-manet",
    scene: "museum",
    file: "museum.html",
    site: "Open Collection",
    title: ["Choose a picture for a one-metre wall","给一米宽展墙选一幅画"],
    brief: ["Your display wall is only one metre wide. Search Manet, compare Boating and The Monet Family in Their Garden at Argenteuil, then save the canvas under 100 cm wide to My Exhibition.","展墙只有一米宽。搜索 Manet，把《划船》和《莫奈一家在阿让特伊的花园里》加入对比，再把宽度不到 100 cm 的那幅加入「我的展览」。"],
    hint: ["Use the artist search and comparison view to inspect dimensions before saving.","使用艺术家搜索和对比页，收藏前核对尺寸。"],
    goals: [["Compare the two named works.","对比题目指定的两幅画。"],["Save the work that fits the one-metre wall.","收藏能放进一米展墙的作品。"]],
    route: [["Search Manet and check the date and subject.","搜索 Manet 或马奈，核对年份与题材。"],["Add Boating and The Monet Family in Their Garden at Argenteuil to Compare.","把《划船》和《莫奈一家在阿让特伊的花园里》加入对比。"],["Compare the second measurement in the dimensions and save the narrower work.","对比尺寸的第二个数值，收藏较窄的作品。"]],
    answer: ["436947 Boating: 130.2 cm wide. 436965 The Monet Family in Their Garden at Argenteuil: 99.7 cm wide. Save 436965.","436947《划船》宽 130.2 cm，436965《莫奈一家在阿让特伊的花园里》宽 99.7 cm。收藏 436965。"],
    cover: "assets/culture-art-436947-thumb.webp",
    advanced: false,
    badge: ["Manet·<100cm","Manet·对比·<100cm"],
    steps: [["Compare Boating and The Monet Family in Their Garden at Argenteuil","对比划船与莫奈一家在阿让特伊的花园里"],["Check which canvas is narrower than 100 cm","核对哪幅宽度不到 100 cm"],["Save the narrower work to My Exhibition","把较窄作品加入我的展览"]],
    hint2: ["Search Manet. The second number in Dimensions is width. Compare it with 100 cm.","搜 Manet；尺寸第二个数是宽度，与 100 cm 比较。"]
  },
  {
    id: "minute2-nature-woodpeckers",
    scene: "nature",
    file: "nature.html",
    site: "Field Guide",
    title: ["Prepare a bird-walk reference","准备散步时用的辨鸟清单"],
    brief: ["A friend recommends a reference for small birds on your walk. Search woodpecker, compare Downy and Red-bellied Woodpecker, and add the shorter bird to your observation list. All sizes are listed on the site.","朋友建议散步前备一份小型鸟类参考。搜索 woodpecker，对比绒啄木鸟和红腹啄木鸟，把体长较短的加入观察清单。尺寸都在网站里，无需认鸟经验。"],
    hint: ["Use the bird search and compare the measurements shown in the guide.","使用鸟类搜索，比较图鉴列出的尺寸。"],
    goals: [["Add both matching woodpeckers to Compare.","把两种符合描述的啄木鸟加入对比。"],["Add the smaller species to the observation list.","把较小的种类加入观察清单。"]],
    route: [["Search woodpecker or 啄木鸟. Check each candidate’s field marks.","搜「啄木鸟」或 woodpecker，核对候选的外观特征。"],["Compare Downy and Red-bellied Woodpecker and check their lengths.","对比绒啄木鸟和红腹啄木鸟，核对体长。"],["Add the shorter species to the observation list.","把较短的一种加入观察清单。"]],
    answer: ["downy (14–17 cm, broad white stripe) and red-bellied (23–27 cm, barred back). Observe downy.","downy 绒啄木鸟（14–17 cm，宽白纵纹）与 red-bellied 红腹啄木鸟（23–27 cm，背部横纹）。记录绒啄木鸟。"],
    cover: "assets/journey-red-bellied-0-thumb.webp",
    briefCover: "assets/journey-red-bellied-0.webp",
    advanced: false,
    badge: ["woodpecker","woodpecker·较短者"],
    steps: [["Compare Downy and Red-bellied Woodpecker","对比绒啄木鸟和红腹啄木鸟"],["Check which bird has the shorter length","核对哪种体长较短"],["Add the shorter bird to your observation list","把较短者加入观察清单"]],
    hint2: ["Search woodpecker. Add both birds to Compare and read Length before adding the shorter bird.","搜 woodpecker；两种都加入对比，阅读体长再收藏较短者。"]
  },
  {
    id: "minute2-travel-interchange",
    scene: "travel",
    file: "travel.html",
    site: "Trackside",
    title: ["Save the route to meet your friends","存好去见朋友的路线"],
    brief: ["Meet friends at Bukit Bintang after class. Plan KLCC (KJ) to Bukit Bintang, departing 17:20 with Less walking, then save the route.","下课后去武吉免登见朋友。规划 KLCC（KJ）到武吉免登，17:20 出发、较少步行，保存行程。"],
    hint: ["Begin with the planner’s station selectors, then inspect time, preference and the proposed route.","从规划器的站点下拉框开始，再检查时间、偏好和推荐路线。"],
    goals: [["Use the correct Bukit Bintang platform and Less walking.","选对武吉免登站台，并选择「较少步行」。"],["Save the 17:20 journey.","保存 17:20 的行程。"]],
    route: [["Choose KLCC (KJ) and Bukit Bintang (KG). Keep the date and set 17:20.","选 KLCC（KJ）和武吉免登（KG），保留日期并设为 17:20。"],["Select Less walking and plan. Inspect the highlighted connection on the network map.","选择「较少步行」并规划，在网络图查看高亮换乘段。"],["Check the interchange and line codes, then save the journey.","核对换乘站与线路代号，再保存行程。"]],
    answer: ["klcc → bukit-kg, 17:20, Less walking. The practice route switches from KJ to KG at Pasar Seni and shows 9 minutes total walking.","klcc → bukit-kg，17:20，较少步行。练习路线在中央艺术坊站由 KJ 换乘 KG，全程步行 9 分钟。"],
    cover: "assets/journey-rail-train-0-thumb.webp",
    advanced: true,
    badge: ["17:20","17:20·较少步行·保存行程"],
    steps: [["KLCC (KJ) → Bukit Bintang","KLCC（KJ）→ 武吉免登"],["Depart at 17:20","17:20 出发"],["Choose Less walking","选择较少步行"],["Save the journey","保存行程"]],
    hint2: ["Bukit Bintang has two platforms. Check the line code and choose KG.","武吉免登有两个站台，核对线路代号并选 KG。"]
  },
  {
    id: "minute2-market-lens",
    scene: "market",
    file: "market.html",
    site: "loop",
    title: ["Buy a camera within RM700","用 RM700 挑一套相机"],
    brief: ["You have RM700 for a club camera and need a lens included. Search EOS 550D, compare the Good and Excellent listings, and save the one whose included items cover both camera and lens.","社团买相机的预算是 RM700，还需要镜头。搜 EOS 550D，对比「良好」和「极佳」两条刊登，检查附带物品，收藏预算内含机身和镜头的那套。"],
    hint: ["Use the listing search and comparison view; inspect price and included items before saving.","使用刊登搜索和比较页，收藏前检查价格与附带物品。"],
    goals: [["Compare the Good and Excellent listings.","对比「良好」与「极佳」的两条刊登。"],["Save the listing that includes a lens within RM700.","收藏 RM700 以内包含镜头的那条。"]],
    route: [["Filter Canon + DSLR and set the maximum price to RM700.","筛选 Canon＋单反，最高价设 RM700。"],["Compare the Good and Excellent copies of the EOS 550D.","对比 EOS 550D 的良好和极佳两条刊登。"],["Read the included-items row and save the kit listing.","核对「附带物品」，收藏包含镜头的一条。"]],
    answer: ["canon-good: RM420, body only. canon-excellent: RM680, with EF-S 18–55mm, battery and charger. Save canon-excellent.","canon-good：RM420，仅机身。canon-excellent：RM680，附 EF-S 18–55mm 镜头、电池和充电器。收藏 canon-excellent。"],
    cover: "assets/market-canon-eos-550d.webp",
    advanced: true,
    badge: ["EOS 550D·RM700","EOS 550D·RM700"],
    steps: [["Compare the Good and Excellent EOS 550D listings","对比 EOS 550D 良好和极佳刊登"],["Budget ≤RM700 · body and lens included","预算 ≤RM700 · 含机身和镜头"],["Save the kit listing","收藏套机刊登"]],
    hint2: ["Search EOS 550D; compare price and Included items. The RM680 kit includes the EF-S 18–55mm lens.","搜 EOS 550D；比较价格和附带物品，RM680 套机含 EF-S 18–55mm 镜头。"]
  },
  {
    id: "minute3-courier-redelivery",
    scene: "courier",
    file: "courier.html",
    site: "TrackMY",
    title: ["Reschedule your parcel","把包裹改约到明天下午"],
    brief: ["Your parcel TM24081301 could not be delivered today. Track it and save a free redelivery for tomorrow afternoon (14:00–18:00), keeping the campus parcel desk address.","包裹 TM24081301 今天未能派送。查到包裹，把派送改为明天下午（14:00–18:00），保留校园收件处地址并保存。"],
    hint: ["Start with parcel tracking, then look for delivery options in the tracking details.","从包裹查询开始，再在物流详情里寻找派送选项。"],
    goals: [["Save tomorrow afternoon at the existing address.","保存明天下午、原地址的免费改约。"]],
    route: [["Track TM24081301, then open Reschedule delivery.","查询 TM24081301，再打开改约派送。"],["Choose tomorrow, 14:00–18:00. Keep the address and save.","选择明天、14:00–18:00，保留地址并保存。"]],
    answer: ["TM24081301, tomorrow, afternoon, Campus parcel desk, Sepang. Confirm the saved TrackMY status. NorthPost RM3 / identity popups are a separate simulated advertiser and do not reschedule this parcel.","TM24081301，明天、下午、Campus parcel desk, Sepang。核对 TrackMY 保存状态。NorthPost 的 RM3／身份验证弹窗是独立模拟广告，不会改约本包裹。"],
    cover: "assets/courier-route.svg",
    advanced: false,
    badge: ["TM24081301·14–18","TM24081301·明天下午"],
    steps: [["Track TM24081301","查询 TM24081301"],["Tomorrow · 14:00–18:00","明天 · 14:00–18:00"],["Keep the campus parcel desk address and save free redelivery","保留校园收件处地址，保存免费改约"]],
    hint2: ["Enter TM24081301, open Reschedule delivery, choose tomorrow and Afternoon (14:00–18:00), then save.","输入 TM24081301，打开改约派送，选明天和下午（14:00–18:00）后保存。"]
  },
  {
    id: "minute3-search-official",
    scene: "search",
    file: "search.html",
    site: "Findline",
    title: ["Find the official download","找到软件的官方来源"],
    brief: ["Your club needs Pixelpress image tools. Find its official site in the search results and download the free getting-started TXT. Avoid sponsored results.","社团需要 Pixelpress 图片工具。在搜索结果里找到官方站点，下载免费的入门说明 TXT。不要从赞助结果进入。"],
    hint: ["Compare result domains and sponsored labels before opening a result.","打开结果前，比较域名和赞助标记。"],
    goals: [["Open the official Pixelpress result.","打开 Pixelpress 的官方结果。"],["Download the getting-started TXT from the normal page.","从正常页面下载入门说明 TXT。"]],
    route: [["Search Pixelpress; inspect domains and sponsored labels.","搜索 Pixelpress，核对域名与赞助标记。"],["Open pixelpress.example and download the TXT guide.","打开 pixelpress.example，下载 TXT 入门说明。"]],
    answer: ["Organic Pixelpress result: pixelpress.example. The normal local page downloads a harmless TXT, not executable software. AppHarbor / SecureLane sponsored links lead to separate demonstration pages and never count as completing this task. A download event proves dispatch, not a file saved on disk.","自然结果 Pixelpress，参考域名 pixelpress.example。正常本地页面下载无害 TXT，不是可执行软件。AppHarbor／SecureLane 赞助链接进入独立演示页，不计完成。下载事件只证明发起下载，需工作人员核对磁盘文件。"],
    cover: "assets/search-software.svg",
    advanced: false,
    badge: ["Pixelpress·TXT","Pixelpress·TXT"],
    steps: [["Open the official Pixelpress result","打开 Pixelpress 官方结果"],["Download the free getting-started TXT","下载免费入门说明 TXT"],["Avoid sponsored results","避开赞助结果"]],
    hint2: ["The official domain is pixelpress.example. Look at the small domain line beneath each result.","官方域名是 pixelpress.example，注意各结果下方的小字域名。"]
  },
  {
    id: "minute4-penang-indoor",
    scene: "events",
    file: "events.html",
    site: "Out There",
    title: ["A short indoor visit in Penang","槟城室内短程参观"],
    brief: ["In Malaysia → Penang, find an indoor attraction taking at most 3 hours with a reference budget up to RM30. Save the matching guide to your plan.","在马来西亚 → 槟城，找一处室内景点：用时不超过3小时、参考预算不超过RM30。把符合条件的指南存入计划。"],
    hint: ["Start with destination and visit filters; check the matching guide before saving.","从目的地和参观条件筛选入手，保存前核对指南。"],
    goals: [["Save the matching two-hour guide.","保存符合条件的两小时指南。"]],
    route: [["Choose Malaysia → Penang, attraction, indoors, budget ≤RM30 and time ≤3h.","选择马来西亚 → 槟城、景点、室内、预算≤RM30、用时≤3小时。"],["Open the sole result and save it.","打开唯一结果，并加入收藏。"]],
    answer: ["penang-state-gallery: Malaysia / Penang / attraction / indoor / RM20 / 2h. The glass museum exceeds the budget, the garden is outdoors, and the long gallery guide takes 4h. These are editorial budgets, not ticket quotes. Assessment checks the actual saved selection and its planning fields.","penang-state-gallery：马来西亚／槟城／景点／室内／RM20／2小时。玻璃博物馆超预算，植物园在户外，半日美术馆需4小时。金额为编辑参考预算，并非门票报价。判定核对实际收藏和保存的规划字段。"],
    cover: "assets/guide-gallery.svg",
    advanced: false,
    badge: ["Penang·≤3h·≤RM30","槟城·室内·≤3h≤RM30"],
    steps: [["Malaysia → Penang · indoor attraction","马来西亚 → 槟城 · 室内景点"],["At most 3 hours · budget ≤RM30","用时 ≤3小时 · 预算 ≤RM30"],["Open the matching guide and save it","打开符合条件的指南并加入计划"]],
    hint2: ["Choose Malaysia → Penang, attraction, indoors, ≤3h and ≤RM30. Open the sole result.","选马来西亚 → 槟城、景点、室内、≤3小时和≤RM30，再打开唯一结果。"]
  }
];
