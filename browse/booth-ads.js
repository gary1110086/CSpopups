/* Fictional student promotions for the timed activity. Each deck starts with
 * a banner, then a plausible promotion, then offers shaped like task actions. */
(() => {
  'use strict';

  const campaigns = {
    courier: {
      brand: ['Delivery notice desk', '派送通知台'],
      cards: [
        ['parcel', ['Delivery update','派送更新'], ['Delivery failed: address incomplete','派送失败：地址不完整'], ['Arrange redelivery','安排改派'], ['Pay RM3 to release your parcel for another delivery attempt.','支付 RM3 手续费，释放包裹并再次派送。']],
        ['desk', ['Everyday supplies','日常用品'], ['Organise your parcel corner','整理你的收件角'], ['Browse storage','浏览收纳用品'], ['Shelves and storage accessories for your shared space.','为公共空间挑选置物架和收纳配件。']],
        ['parcel', ['Recipient check','收件人核验'], ['Verify identity before rescheduling','改约前验证身份'], ['Verify recipient','验证收件人'], ['Open a separate recipient verification to continue delivery.','打开独立的收件人核验页面以继续派送。']],
        ['coupon', ['Shipping offer','运费推广'], ['A voucher for your next parcel','下次寄件的优惠券'], ['Claim voucher','领取优惠券'], ['Activate a shipping offer before your next order.','下次下单前激活寄件优惠。']]
      ]
    },
    search: {
      brand: ['Software download desk', '软件下载台'],
      cards: [
        ['software', ['Download shortcut','下载快捷入口'], ['Pixelpress high-speed download','Pixelpress 高速下载'], ['Get installer','获取安装器'], ['Open the recommended download assistant for this search.','为本次搜索打开推荐下载助手。']],
        ['stock', ['Design resources','设计素材'], ['Images for your next club page','社团网页图片素材'], ['Browse images','浏览图片'], ['A separate collection of photos for your next project.','为下次项目浏览独立图片素材集。']],
        ['security', ['Security notice','安全通知'], ['Your download needs a security check','下载需要安全检查'], ['Verify now','立即验证'], ['Run a browser verification before continuing your download.','继续下载前先进行浏览器验证。']],
        ['software', ['Recommended update','推荐更新'], ['Install the download helper','安装下载辅助工具'], ['Continue download','继续下载'], ['Use the download assistant to unlock the file.','使用下载助手解锁文件。']]
      ]
    },
    wallpapers: {
      brand: ['Campus Canvas', '校园画布'],
      cards: [
        ['stock', ['Projector backdrops', '投影背景'], ['XMUM presentation backdrops', 'XMUM 小组汇报背景'], ['Browse the pack', '浏览素材包'], ['Scenery for society slides and classroom screens.', '社团幻灯片和教室投影可用的风景素材。']],
        ['desk', ['Desk setup', '桌面布置'], ['Set up your study screen', '布置你的自习屏幕'], ['See the student picks', '查看学生推荐'], ['A student pick of screen stands and desk accessories for dorm rooms.', '学生整理的宿舍显示器支架和桌面配件。']],
        ['stock', ['Image comparison', '图片比较'], ['More images to compare', '还有照片可以比较'], ['Compare the photos', '比较照片'], ['The campus slide pack has another version with different dimensions.', '校园幻灯片素材包里还有另一种尺寸的版本。']],
        ['software', ['Image export', '图片导出'], ['Wallpaper export ready', '壁纸已准备好导出'], ['Download the JPG', '下载 JPG'], ['Open the projector-size copy for your next XMUM presentation.', '打开适合下次 XMUM 汇报投影的尺寸。']],
        ['security', ['File check', '文件检查'], ['Check the original image', '检查原图文件'], ['Continue download', '继续下载'], ['Preview the file check before saving the larger wallpaper.', '保存大尺寸壁纸前，先看文件检查结果。']],
        ['coupon', ['Student pack', '学生素材包'], ['One more wallpaper size', '还有一种壁纸尺寸'], ['Unlock original size', '解锁原图尺寸'], ['Campus Canvas members can open the full-size export pack.', '校园画布会员可查看完整尺寸导出包。']]
      ]
    },
    recipes: {
      brand: ['Dorm Kitchen Notes', '宿舍厨房笔记'],
      cards: [
        ['coupon', ['After class', '课后晚餐'], ['Easy dinners for XMUM students', 'XMUM 同学的快手晚餐'], ['See the dinner picks', '查看晚餐推荐'], ['Student meal ideas for cooking together after lectures.', '学生整理的课后聚餐灵感。']],
        ['desk', ['Meal prep', '备餐用品'], ['Pack a meal for the group', '给小组准备便当'], ['Browse containers', '浏览便当盒'], ['Reusable food containers for long days of classes and group work.', '上课和做小组作业时用的可重复使用便当盒。']],
        ['coupon', ['Recipe filters', '食谱筛选'], ['Show vegan meals on a budget', '只看预算内的纯素餐'], ['Apply meal filters', '应用食谱筛选'], ['Narrow down ideas for the next XMUM group dinner.', '为下次 XMUM 同学聚餐筛选食谱。']],
        ['software', ['Portion calculator', '份量计算器'], ['Need six servings?', '需要六人份？'], ['Update the portions', '更新份量'], ['Scale all the ingredients for your group meal in one step.', '一步按小组人数换算所有食材。']],
        ['parcel', ['Ingredient list', '食材清单'], ['Your shopping list is ready', '购物清单已经整理好'], ['Open ingredient list', '打开食材清单'], ['Check which ingredients the student pantry pack includes.', '核对学生食材包里包含哪些东西。']],
        ['prize', ['Meal challenge', '备餐挑战'], ['Save your meal and spin', '保存食谱，再转一次'], ['Save recipe', '收藏食谱'], ['A student meal-planning challenge comes with a bonus spin.', '学生备餐挑战附送一次转盘机会。']]
      ]
    },
    tools: {
      brand: ['Society Design Desk', '社团设计桌'],
      cards: [
        ['stock', ['Society artwork', '社团素材'], ['Make an XMUM society poster', '做一张 XMUM 社团海报'], ['Browse image samples', '浏览示例图片'], ['Try campus-themed images for posters and event posts.', '试用校园主题图片来做海报和活动帖。']],
        ['stock', ['Poster templates', '海报模板'], ['Images for recruitment week', '招新周图片素材'], ['See the template pack', '查看模板素材包'], ['A student-made set for club displays and social posts.', '学生整理的社团展台和社媒帖素材。']],
        ['software', ['Quick settings', '快捷设置'], ['Custom width, quick WebP export', '自定义宽度，快速导出 WebP'], ['Apply export settings', '应用导出设置'], ['Open a custom-size preset for your society’s artwork.', '打开社团宣传图的自定义尺寸预设。']],
        ['player', ['Output preview', '输出预览'], ['The image preview needs an update', '图片预览需要更新'], ['Enable preview', '启用预览'], ['Check the compressed image before sending it to your group chat.', '发到小组群之前，先检查压缩后的预览。']],
        ['software', ['Ready to export', '导出已就绪'], ['Your resized copy is ready', '调整尺寸后的图片已就绪'], ['Download output', '下载导出文件'], ['Save the copy prepared for your XMUM society post.', '保存给 XMUM 社团发帖准备的图片。']],
        ['security', ['Upload check', '上传检查'], ['One last check before uploading', '上传前再检查一次'], ['Verify output', '验证导出文件'], ['Open a file status check for the image you are about to share.', '对即将分享的图片打开一次文件状态检查。']]
      ]
    },
    movies: {
      brand: ['After-Class Screen Room', '课后放映室'],
      cards: [
        ['corn', ['Campus movie night', '校园电影夜'], ['Shorts for an XMUM movie night', 'XMUM 电影夜短片清单'], ['See the lineup', '查看片单'], ['A student-curated list of films that fit between classes.', '学生整理的片单，适合在课间看一部。']],
        ['desk', ['Screening setup', '观影布置'], ['Turn a desk into a movie corner', '把桌面变成观影角'], ['See the setup', '查看布置'], ['Headphones and desk stands for a dorm-room screening.', '适合宿舍观影的耳机和桌面支架。']],
        ['player', ['Playback notice', '播放提示'], ['Resume the selected preview', '继续播放已选预告'], ['Continue preview', '继续预览'], ['Enable playback before checking the runtime for movie night.', '启用播放后，再核对电影夜的放映时长。']],
        ['corn', ['Watchlist shortcut', '片单快捷入口'], ['Add this to the group watchlist', '加入小组想看片单'], ['Add to watchlist', '加入想看'], ['Keep the short with your group’s other XMUM movie-night picks.', '和小组的其他 XMUM 电影夜备选放在一起。']],
        ['coupon', ['Screening pass', '放映活动'], ['A pass for your shortlist', '备选影片观影通行券'], ['Open the screening details', '打开放映详情'], ['See which films are included in the student screening offer.', '看看学生放映推广包含哪些影片。']],
        ['software', ['Runtime check', '片长核对'], ['Does your double bill fit?', '两部短片放得下吗？'], ['Compare runtimes', '比较片长'], ['Open a duration check for your two-film screening plan.', '打开两部短片放映计划的时长检查。']]
      ]
    },
    events: {
      brand: ['After Class KL', '课后去吉隆坡'],
      cards: [
        ['coupon', ['Weekend plans', '周末计划'], ['An outing after the last lecture', '最后一堂课后的出游'], ['See student weekend picks', '查看学生周末推荐'], ['Ideas for small groups heading out from XMUM after class.', '适合 XMUM 同学下课后小组出游的灵感。']],
        ['stock', ['Rainy-day guide', '雨天指南'], ['Photo spots when it rains', '下雨时也能拍照的地点'], ['Browse indoor spots', '浏览室内地点'], ['Browse sample photos from covered stops on a student day out.', '看看学生出游时在有遮挡地点拍的示例照片。']],
        ['coupon', ['Itinerary filter', '路线筛选'], ['Only show rain-friendly plans', '只显示下雨也能去的路线'], ['Apply outing filters', '应用出游筛选'], ['Check covered stops and a student budget in one view.', '一起核对避雨地点和学生预算。']],
        ['software', ['Departure checklist', '出发检查清单'], ['Your departure list is ready', '出发清单已准备好'], ['Open checklist', '打开检查清单'], ['Send a checklist copy to the XMUM friends coming along.', '把清单副本发给同行的 XMUM 同学。']],
        ['security', ['Schedule check', '行程检查'], ['Check the indoor craft stop', '核对室内手工活动'], ['Confirm itinerary', '确认行程'], ['Open the itinerary check before you save a group plan.', '保存小组计划前，先打开行程检查。']],
        ['prize', ['Weekend bonus', '周末福利'], ['An extra stop within budget', '预算内再加一站'], ['Add to my plan', '加入我的计划'], ['Try a student weekend draw for a bonus activity idea.', '参加学生周末抽选，看看附加活动灵感。']]
      ]
    },
    books: {
      brand: ['Library Table Reads', '图书馆桌边读'],
      cards: [
        ['desk', ['Study break', '自习休息'], ['A read between XMUM lectures', 'XMUM 两堂课之间读几页'], ['Browse the study picks', '查看自习推荐'], ['Reading accessories and short books for a library break.', '适合图书馆休息时翻阅的短书和阅读配件。']],
        ['stock', ['Book cover collection', '书封素材集'], ['Classic covers for a book club', '读书会经典书封'], ['Explore cover scans', '浏览书封扫描图'], ['Use sample covers for a student reading-club display.', '学生读书会展示可以参考的书封样本。']],
        ['stock', ['Edition selector', '版本筛选'], ['Show only the matching editions', '只显示符合条件的版本'], ['Compare editions', '比较版本'], ['Check publication dates before picking an edition for the group.', '给小组挑版本前，先核对出版日期。']],
        ['software', ['Reading extract', '阅读节选'], ['French excerpt ready', '法语节选已就绪'], ['Download TXT', '下载 TXT'], ['Take the opening lines to your XMUM reading discussion.', '把开篇文字带去 XMUM 阅读讨论。']],
        ['coupon', ['Reading list', '阅读清单'], ['Keep this edition for later', '把这个版本留到之后读'], ['Save to reading list', '加入阅读清单'], ['The student reading bundle keeps your chosen edition close at hand.', '学生阅读包方便随时查看选中的版本。']],
        ['security', ['Reading list check', '书单检查'], ['Check your saved books', '检查已保存的书'], ['Restore my list', '恢复我的清单'], ['Open the list check before you leave the catalogue.', '离开目录前，先打开书单检查。']]
      ]
    },
    museum: {
      brand: ['Campus Exhibit Studio', '校园展览工作室'],
      cards: [
        ['stock', ['Campus exhibit', '校园展览'], ['Prints for an XMUM exhibit wall', 'XMUM 展墙版画素材'], ['Browse display images', '浏览展墙素材'], ['Image references for student exhibit boards and society booths.', '适合学生展板和社团展台的图片参考。']],
        ['desk', ['Display supplies', '展陈用品'], ['Put together your display board', '布置你的小组展板'], ['See the display kit', '查看展陈套件'], ['Frames and tabletop supports for a student showcase.', '学生展示可用的画框和桌面支架。']],
        ['stock', ['Compare objects', '比较藏品'], ['Open a side-by-side view', '打开并排查看'], ['Compare these works', '比较这些作品'], ['Check both canvas widths before choosing the exhibit piece.', '选展品之前，先核对两件作品的画布宽度。']],
        ['software', ['Exhibit list', '展览清单'], ['Your exhibit list has an open slot', '展览清单还有一个空位'], ['Add to my exhibition', '加入我的展览'], ['Save a candidate to the XMUM student exhibition shortlist.', '把备选作品加入 XMUM 学生展览候选。']],
        ['coupon', ['Object record', '藏品记录'], ['More details for the label', '展签还有更多资料'], ['Show canvas dimensions', '显示画布尺寸'], ['Find dimensions for your group’s exhibit caption.', '给小组展签找一下画布尺寸。']],
        ['prize', ['Showcase pick', '展览精选'], ['One more shortlist suggestion', '再看一个入选建议'], ['Open my shortlist', '打开我的候选清单'], ['A student showcase draw has another piece for your display.', '学生展示抽选还有一件适合展板的作品。']]
      ]
    },
    nature: {
      brand: ['Campus Nature Notes', '校园自然笔记'],
      cards: [
        ['stock', ['Field guide practice', '图鉴练习'], ['Bird ID practice for XMUM students', 'XMUM 学生辨鸟练习'], ['Browse photo examples', '浏览照片示例'], ['Practise reading field marks before a student photo walk.', '参加学生摄影散步之前，练习看鸟的外观特征。']],
        ['stock', ['Photo walk', '校园摄影散步'], ['Look twice at the shape of the bill', '多看一眼鸟喙形状'], ['See the photo set', '查看照片组'], ['A photo reference set for spotting small differences between birds.', '用一组参考照片练习分辨鸟类的细微差别。']],
        ['player', ['Bird-call playback', '鸟鸣播放'], ['Listen before you log the bird', '先听叫声，再记下这只鸟'], ['Play the call', '播放叫声'], ['Open the sound example for the student field-note exercise.', '打开学生观察练习的鸟鸣示例。']],
        ['stock', ['Bird comparison', '鸟类比较'], ['Which bird is smaller?', '哪种鸟更小？'], ['Compare body sizes', '比较体型'], ['Open a size chart for the birds in your photo set.', '打开照片组对应的体型对照表。']],
        ['software', ['Observation list', '观察清单'], ['Observation entry ready', '观察记录已准备好'], ['Save observation', '保存观察记录'], ['Keep a record for your XMUM student nature notebook.', '把这条记录留给 XMUM 学生自然笔记。']],
        ['prize', ['Field-note badge', '观察徽章'], ['One more sighting for your sheet', '清单上还能再记一种'], ['Open my observations', '打开我的观察清单'], ['See the bonus suggestion from the student field-note exercise.', '看看学生观察练习的额外推荐。']]
      ]
    },
    travel: {
      brand: ['Sepang Student Rides', '雪邦学生出行'],
      cards: [
        ['coupon', ['After class', '下课出发'], ['Heading out from XMUM?', '准备从 XMUM 出发？'], ['Browse travel picks', '浏览出行推荐'], ['Ideas for meeting friends near Salak Tinggi after lectures.', '适合下课后到 Salak Tinggi 附近与同学会合的灵感。']],
        ['desk', ['Commute kit', '通勤随身'], ['Pack light for the rail trip', '搭火车，轻装出发'], ['Browse commute gear', '浏览通勤用品'], ['Student picks for pouches and small travel accessories.', '学生整理的收纳袋和小件通勤用品。']],
        ['coupon', ['Route filter', '路线筛选'], ['Show routes with fewer changes', '显示换乘较少的路线'], ['Apply transfer filter', '应用换乘筛选'], ['Open more route suggestions for a student trip from Sepang.', '查看从雪邦出发的更多学生出行路线建议。']],
        ['software', ['Journey export', '路线导出'], ['Your route card is ready', '路线卡片已就绪'], ['Save this journey', '保存这条路线'], ['Open a copy of the route to share with your XMUM group.', '打开一份路线副本，发给 XMUM 小组同学。']],
        ['security', ['Route check', '路线检查'], ['Double-check your transfer', '再核对一次换乘'], ['Check route details', '检查路线详情'], ['Open a route check before heading to the station.', '去车站前，先打开路线检查。']],
        ['prize', ['Travel bonus', '出行福利'], ['A student perk for your trip', '给这趟行程的学生福利'], ['Confirm this plan', '确认这份计划'], ['See a bonus offer for a trip planned with campus friends.', '看看和校园朋友规划出游时的额外推广。']]
      ]
    },
    market: {
      brand: ['Campus Camera Swap', '校园相机交换站'],
      cards: [
        ['stock', ['Society photography', '社团摄影'], ['Camera ideas for XMUM society shoots', 'XMUM 社团拍摄相机灵感'], ['See student picks', '查看学生推荐'], ['Browse sample shots and starter setup ideas for campus events.', '看看校园活动拍摄样张和入门组合。']],
        ['desk', ['Photo setup', '拍摄配件'], ['Set up a desk photo corner', '布置桌面拍摄角'], ['Browse accessories', '浏览配件'], ['Small stands and desk lights for student society product photos.', '适合学生社团产品照的小支架和桌面灯。']],
        ['coupon', ['Listing filters', '刊登筛选'], ['Show listings within your budget', '显示预算内的刊登'], ['Apply price filter', '应用价格筛选'], ['Open more student listings that fit the price you selected.', '打开更多符合所选价格的学生刊登。']],
        ['software', ['Compare shortcut', '比较快捷入口'], ['Compare your camera shortlist', '比较你选中的相机'], ['Compare listings', '比较刊登'], ['Open a side-by-side view for your XMUM society equipment list.', '为 XMUM 社团器材清单打开并排比较。']],
        ['parcel', ['Included items', '附带物品'], ['See what comes in the box', '看看盒内附带哪些东西'], ['Check included items', '核对附带物品'], ['Check body, lens and accessories before saving the listing.', '保存刊登前，核对机身、镜头和配件。']],
        ['coupon', ['Saved listing', '收藏刊登'], ['Keep this listing for the group', '把这条刊登留给小组'], ['Save listing', '收藏刊登'], ['Put it on the student society equipment shortlist.', '把它放进学生社团的器材候选清单。']]
      ]
    }
  };

  window.BROWSE_BOOTH_ADS = (scene, lang) => {
    if (typeof scene !== 'string' || !Object.hasOwn(campaigns, scene)) return null;
    const {brand, cards} = campaigns[scene];
    const language = lang === 'zh' ? 1 : 0;
    const immediate = scene === 'courier' || scene === 'search';
    const cardAt = ordinal => {
      if (!Number.isInteger(ordinal) || ordinal < 1) return cards[0];
      // Put the task-matched lure first on the two new hosts, then keep the
      // ordinary-ad/scam contrast deck. Existing ten hosts retain their order.
      if (immediate && ordinal === 1) return cards[0];
      return cards[1 + (ordinal - (immediate ? 2 : 1)) % (cards.length - 1)];
    };
    return {
      site(ordinal) { return cardAt(ordinal)[0]; },
      offer(site, ordinal) {
        const expected = cardAt(ordinal);
        const [, eyebrow, title, cta, description] = expected[0] === site
          ? expected
          : cards.find(card => card[0] === site) || expected;
        return {brand:brand[language], title:title[language], cta:cta[language],
          eyebrow:eyebrow[language], description:description[language]};
      }
    };
  };
})();
