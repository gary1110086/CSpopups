/* The activity has its own short briefs. Answers are for the staff disclosure only. */
window.BROWSE_BOOTH_TASKS = [
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
