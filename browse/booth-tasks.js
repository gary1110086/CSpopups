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
    id: 'minute2-wall-earthrise', scene: 'wallpapers', file: 'wallpaper.html', site: 'Stillwall',
    title: ['A photograph for the space booth', '太空展台选图'],
    brief: ['Find the two Earthrise photographs and add both to Compare. Read their descriptions to find the Apollo 16 photograph, then download that one at 3840 × 2160.', '找到两张「地出」照片，都加入对比。看照片说明，选阿波罗 16 号拍的那张，再下载 3840 × 2160 的 JPG。'],
    hint: ['Search Earthrise in the catalogue search box. The two results have different years. Mission names are in their descriptions.', '先在目录搜索框输入 Earthrise，会看到两个不同年份的候选。阿波罗任务编号在照片说明里。'],
    goals: [['Put both Earthrise photographs in the comparison.', '把两张「地出」都加入对比。'], ['Export the Apollo 16 photograph as a 3840 × 2160 JPG.', '将阿波罗 16 号的照片导出为 3840 × 2160 JPG。']],
    route: [['Search Earthrise and add both results to Compare.', '搜「地出」或 Earthrise，把两张结果都加入对比。'], ['Check the mission in the photograph description. Open the Apollo 16 result.', '在照片说明里核对任务，打开阿波罗 16 号的结果。'], ['Select 3840 × 2160 and download the wallpaper.', '选择 3840 × 2160，下载壁纸。']],
    answer: ['earthrise-1968 (Apollo 8) and earthrise-1972 (Apollo 16). Export only earthrise-1972 at 3840 × 2160.', '对比 earthrise-1968（阿波罗 8 号）和 earthrise-1972（阿波罗 16 号）。只导出后者的 3840 × 2160 JPG。'],
    cover: 'assets/nasa-as08-14-2383-thumb.webp', advanced: false
  },
  {
    id: 'minute2-recipe-budget', scene: 'recipes', file: 'recipe.html', site: 'Pantry & Plate',
    title: ['A budget dinner for six', '六人的省钱晚餐'],
    brief: ['Find the lentil soup with tomatoes, costing RM5 per serving. Open the recipe, set six servings, tick red lentils in the ingredient list and save the recipe.', '找一款每份 RM5、配料有番茄的扁豆汤。打开食谱，设成六人份，在食材清单勾选红扁豆，再收藏食谱。'],
    hint: ['Search lentil. Open the soup result, then use Jump to recipe to reach servings and the ingredient checklist.', '先搜「扁豆」。打开汤的详情，点「跳到食谱」，就能找到份量和食材清单。'],
    goals: [['Save the matching recipe.', '收藏符合条件的食谱。'], ['Set six servings and tick the lentils.', '设成六人份，并勾选扁豆。']],
    route: [['Start with the one-pot or vegan category. Narrow by budget and check the total time.', '从「一锅料理」或纯素筛选入手，核对预算和总用时。'], ['Open the red lentil and tomato soup, jump to its recipe and set six servings.', '打开红扁豆番茄汤，跳到食谱并设为六人份。'], ['Tick red lentils and save the recipe.', '勾选红扁豆并收藏食谱。']],
    answer: ['red-lentil-soup · RM5 per serving, 35 minutes, vegan, one pot. At six servings the checklist shows 420 g of red lentils.', 'red-lentil-soup · 每份 RM5，35 分钟，纯素，一口锅。六人份的食材清单显示 420 g 红扁豆。'],
    cover: 'assets/real-food-red-lentil-soup-thumb.webp', advanced: false
  },
  {
    id: 'minute2-tool-webp', scene: 'tools', file: 'tools.html', site: 'Pixelpress',
    title: ['A portrait photo for the club page', '社团网页的竖版照片'],
    brief: ['Load the Sunroom study example. Export it as WebP, 800 px wide, at 70% quality, and download the result.', '载入「日光书房」示例，设为 WebP、宽 800 px、画质 70%，然后下载结果。'],
    hint: ['The example photos are below the upload area. Choose Sunroom study, then adjust format, width and quality in the settings.', '从上传区下方的示例照片里找「日光书房」。载入后，在设置区改格式、宽度和画质。'],
    goals: [['Export the matching example.', '导出符合描述的示例。'], ['Download the generated WebP at 800 px wide and 70% quality.', '下载生成的 WebP，宽 800 px，画质 70%。']],
    route: [['Look through the example photos and load the sunroom study.', '浏览示例照片，载入日光书房。'], ['Select WebP, width 800 and quality 70%. The settings update the preview automatically.', '设为 WebP、宽 800、画质 70%，预览会自动更新。'], ['Check the result and download it.', '核对结果后下载。']],
    answer: ['sunroom (sunroom-study). The 1558 × 2048 source scales to 800 × 1052. Use custom settings.', 'sunroom（日光书房）。原图 1558 × 2048，按比例生成 800 × 1052。使用自定义设置。'],
    cover: 'assets/real-wall-sunroom-study-thumb.webp', advanced: false
  },
  {
    id: 'minute2-movie-animation', scene: 'movies', file: 'movie.html', site: 'Frame Movies',
    title: ['Two shorts for a club screening', '社团放映的两部短片'],
    brief: ['Find two fantasy shorts: one about looking for a dragon, and one about two men in a strange machine. Both are under 16 minutes. Read their synopses and add just those two films to your watchlist.', '找两部不到 16 分钟的奇幻短片。一部讲寻找龙，另一部讲两个人在古怪机器里。读简介确认后，把这两部加入想看片单。'],
    hint: ['Choose Fantasy under Genre and 15 minutes under Maximum runtime, then Apply filters. Open the remaining film cards to read their synopses.', '先把「类型」选为「奇幻」，「最大片长」选为「15分钟」，点「应用筛选」。打开候选影片卡片，才能看到剧情简介。'],
    goals: [['Use the synopses to identify both films and add them to the watchlist.', '根据剧情简介找出两部影片，并把它们加入想看片单。'], ['Leave just those two films on the watchlist.', '片单只保留这两部。']],
    route: [['Narrow to Fantasy and check the language and running time.', '先筛选奇幻，核对语言和片长。'], ['Check the two story clues against the film descriptions.', '把两条剧情线索与影片简介对应起来。'], ['Add Sintel and Elephants Dream to the watchlist.', '将《辛特尔》和《大象之梦》加入想看片单。']],
    answer: ['sintel (15 min) and elephants-dream (11 min). The catalogue runtimes describe the works, not the embedded preview lengths.', 'sintel（15 分钟）和 elephants-dream（11 分钟）。用目录的正片片长核对，无需播放影片。'],
    cover: 'assets/video-sintel.jpg', advanced: false
  },
  {
    id: 'minute2-outing-craft', scene: 'events', file: 'events.html', site: 'Out There KL',
    title: ['A rainy-afternoon gift hunt', '雨天去找一件手作礼物'],
    brief: ['Find the Central Market craft outing with a RM20 planning budget. Save it to your weekend plan, then tick the return journey and weather items in its departure checklist.', '找中央艺术坊参考预算 RM20 的手作路线。加入周末计划，再在出发清单勾选返程和天气两项。'],
    hint: ['Search Central Market. The matching guide is called Batik, baskets & a sheltered craft browse. Its departure checklist is on the detail page.', '先搜「中央艺术坊」，打开「蜡染、编篮与室内手作慢逛」。出发清单在路线详情里。'],
    goals: [['Save the matching outing to your weekend plan.', '把符合条件的行程加入周末计划。'], ['Tick the return journey and weather entries in its departure checklist.', '在出发清单勾选返程和天气两项。']],
    route: [['Filter for KL, indoor outings and rail access. Check the budget and craft theme.', '筛选 KL、室内和轨道交通，核对预算及手作主题。'], ['Open the Central Market craft outing and check the optional outdoor strip in its rain plan.', '打开中央艺术坊的手作路线，从雨天方案核对可跳过的室外路段。'], ['Save it and tick the return journey and weather entries in the departure checklist.', '收藏，并在出发清单勾选返程和天气。']],
    answer: ['market-craft · Central Market & Kasturi Walk, RM20, 2.5 hours. The outdoor strip is optional. Record the two specified checklist entries.', 'market-craft · 中央艺术坊与 Kasturi Walk，RM20，2.5 小时。室外步行街可跳过，核对指定两项出发检查。'],
    cover: 'assets/real-outing-market-craft-thumb.webp', advanced: false
  },
  {
    id: 'minute2-book-verne', scene: 'books', file: 'book.html', site: 'Folio',
    title: ['Two languages for a reading group', '读书会的双语选本'],
    brief: ['Find Jules Verne’s Around the World in Eighty Days in English and French. Save both editions, then open the French edition and download its opening excerpt as TXT.', '找凡尔纳《八十天环游地球》的英文和法文版。两版都收藏，再打开法文版，下载开篇 TXT。'],
    hint: ['Search Verne to see the two editions. Check the Language field for English and French. The TXT download is in the reading excerpt.', '搜索框输入 Verne，会看到两个版本。看「语言」区分英文和法文；TXT 下载在法文版的阅读片段里。'],
    goals: [['Save both language editions of the work.', '收藏这部作品的两个语言版本。'], ['Download the French opening excerpt as TXT.', '下载法文开篇的 TXT。']],
    route: [['Browse Adventure or search for Jules Verne once identified from an edition.', '浏览「冒险」类别，认出作者后也可以搜 Jules Verne。'], ['Check the language on both 1873 editions and save both.', '核对两个 1873 年版本的语言，并分别收藏。'], ['Download the opening excerpt from the French edition.', '从法文版下载开篇片段。']],
    answer: ['around-world (English) and around-world-fr (French). Correct excerpt: folio-around-world-fr-excerpt.txt.', 'around-world（英文）与 around-world-fr（法文）。正确片段是 folio-around-world-fr-excerpt.txt。'],
    cover: 'assets/culture-book-around-world-thumb.webp', advanced: false
  },
  {
    id: 'minute2-museum-manet', scene: 'museum', file: 'museum.html', site: 'Open Collection',
    title: ['Which canvas fits the display?', '哪幅画能放进展位？'],
    brief: ['Find Manet’s two 1874 paintings of a boat and a family in a garden. Add both to Compare, check their dimensions and save the narrower canvas to My Exhibition.', '找马奈 1874 年画船和花园里一家人的两幅画。都加入对比，查看尺寸，把较窄的一幅加入「我的展览」。'],
    hint: ['Search Manet. Pick the two 1874 results and open Compare. In the dimensions, the second number is the width.', '先在搜索框输入 Manet。找到两件 1874 年的作品，加入后打开「对比」。尺寸第二个数是宽度。'],
    goals: [['Compare both Manet works side by side.', '把两幅马奈作品加入对比。'], ['Add the narrower canvas to My Exhibition.', '把较窄的画布加入「我的展览」。']],
    route: [['Search Manet and check the date and subject.', '搜索 Manet 或马奈，核对年份与题材。'], ['Add Boating and The Monet Family in Their Garden at Argenteuil to Compare.', '把《划船》和《莫奈一家在阿让特伊的花园里》加入对比。'], ['Compare the second measurement in the dimensions and save the narrower work.', '对比尺寸的第二个数值，收藏较窄的作品。']],
    answer: ['436947 Boating: 130.2 cm wide. 436965 The Monet Family in Their Garden at Argenteuil: 99.7 cm wide. Save 436965.', '436947《划船》宽 130.2 cm，436965《莫奈一家在阿让特伊的花园里》宽 99.7 cm。收藏 436965。'],
    cover: 'assets/culture-art-436947-thumb.webp', advanced: false
  },
  {
    id: 'minute2-nature-woodpeckers', scene: 'nature', file: 'nature.html', site: 'Field Guide',
    title: ['Two lookalike woodpeckers', '两种容易混淆的啄木鸟'],
    brief: ['Find the Downy and Red-bellied Woodpeckers and add both to Compare. Check their length ranges and add the smaller species to your observation list.', '找到绒啄木鸟和红腹啄木鸟，都加入对比。看体长范围，把较小的那种加入观察清单。'],
    hint: ['Search woodpecker. Add both results to Compare, open the comparison page and look for Length.', '先搜 woodpecker，会出现两种啄木鸟。都加入后，打开「对比」，看「体长」。'],
    goals: [['Add both matching woodpeckers to Compare.', '把两种符合描述的啄木鸟加入对比。'], ['Add the smaller species to the observation list.', '把较小的种类加入观察清单。']],
    route: [['Search woodpecker or 啄木鸟. Check each candidate’s field marks.', '搜「啄木鸟」或 woodpecker，核对候选的外观特征。'], ['Compare Downy and Red-bellied Woodpecker and check their lengths.', '对比绒啄木鸟和红腹啄木鸟，核对体长。'], ['Add the shorter species to the observation list.', '把较短的一种加入观察清单。']],
    answer: ['downy (14–17 cm, broad white stripe) and red-bellied (23–27 cm, barred back). Observe downy.', 'downy 绒啄木鸟（14–17 cm，宽白纵纹）与 red-bellied 红腹啄木鸟（23–27 cm，背部横纹）。记录绒啄木鸟。'],
    cover: 'assets/journey-red-bellied-0-thumb.webp', advanced: false
  },
  {
    id: 'minute2-travel-interchange', scene: 'travel', file: 'travel.html', site: 'Trackside',
    title: ['Find the right interchange', '分清同名车站再换乘'],
    brief: ['Plan KLCC (KJ) to Bukit Bintang (KG), leaving at 17:20 with Less walking. Open the route details, check the interchange and save the trip.', '从双峰塔（KLCC / KJ）到武吉免登（KG），设为 17:20 出发、较少步行。打开路线详情，核对换乘站并保存行程。'],
    hint: ['Use the From and To selectors in the planner. Bukit Bintang has two entries: choose KG. Set time and preference, then Find a route.', '从左边的出发站、到达站下拉框开始。武吉免登有两项，选 KG。设好时间和偏好后，点「查找路线」。'],
    goals: [['Use the correct Bukit Bintang platform and Less walking.', '选对武吉免登站台，并选择「较少步行」。'], ['Save the 17:20 journey.', '保存 17:20 的行程。']],
    route: [['Choose KLCC (KJ) and Bukit Bintang (KG). Keep the date and set 17:20.', '选 KLCC（KJ）和武吉免登（KG），保留日期并设为 17:20。'], ['Select Less walking and plan.', '选择「较少步行」，规划路线。'], ['Check the connection and save the journey.', '核对换乘站并保存行程。']],
    answer: ['klcc → bukit-kg, 17:20, Less walking. The practice route switches from KJ to KG at Pasar Seni and shows 9 minutes total walking.', 'klcc → bukit-kg，17:20，较少步行。练习路线在中央艺术坊站由 KJ 换乘 KG，全程步行 9 分钟。'],
    cover: 'assets/journey-rail-train-0-thumb.webp', advanced: true
  },
  {
    id: 'minute2-market-lens', scene: 'market', file: 'market.html', site: 'loop',
    title: ['Same camera, different kit', '同款相机，配件不同'],
    brief: ['Find the two Canon EOS 550D listings and add both to Compare. You have RM700 and need a lens included. Check Included items, then save the listing that fits.', '找到两条 Canon EOS 550D 刊登，都加入对比。预算 RM700，必须包含镜头。核对「附带物品」，收藏符合条件的那条。'],
    hint: ['Search EOS 550D. Add the Good and Excellent copies to Compare, open the comparison and read the price and Included items rows.', '先搜 EOS 550D。把「良好」和「极佳」两条加入对比，打开比较页，查看价格和「附带物品」。'],
    goals: [['Compare the Good and Excellent listings.', '对比「良好」与「极佳」的两条刊登。'], ['Save the listing that includes a lens within RM700.', '收藏 RM700 以内包含镜头的那条。']],
    route: [['Filter Canon + DSLR and set the maximum price to RM700.', '筛选 Canon＋单反，最高价设 RM700。'], ['Compare the Good and Excellent copies of the EOS 550D.', '对比 EOS 550D 的良好和极佳两条刊登。'], ['Read the included-items row and save the kit listing.', '核对「附带物品」，收藏包含镜头的一条。']],
    answer: ['canon-good: RM420, body only. canon-excellent: RM680, with EF-S 18–55mm, battery and charger. Save canon-excellent.', 'canon-good：RM420，仅机身。canon-excellent：RM680，附 EF-S 18–55mm 镜头、电池和充电器。收藏 canon-excellent。'],
    cover: 'assets/market-canon-eos-550d.webp', advanced: true
  }
];
