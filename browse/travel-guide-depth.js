/* Original bilingual planning outlines. All RM amounts are editorial budgets,
   not current admission/menu/room prices. No third-party images are implied. */
(() => {
  'use strict';
  const rows = [
    ['kl-jalan-alor','Malaysia','KL','eatery','Jalan Alor: compare before ordering|阿罗街：比较后再点餐',30,1.5,'outdoor','rail','Read three stall menus before choosing one dish and a drink.|比较三家摊位菜单，再选一道菜和一杯饮料。','Use a signed meeting point; ask about ingredients, portions and service charges.|以有标识的位置会合，询问食材、份量和服务费。','https://www.malaysia.travel/'],
    ['putrajaya-alamanda-meal','Malaysia','Putrajaya','eatery','Alamanda: a sheltered meal break|Alamanda：有遮蔽的用餐休息',25,1,'indoor','connection','Compare food-court counters before sitting down; keep the visit to one meal.|入座前比较美食广场柜台，只安排一餐。','Check the pickup entrance and dietary information before ordering.|点餐前确认接车入口和饮食信息。','https://www.alamanda.com.my/'],
    ['putrajaya-lakeside-meal','Malaysia','Putrajaya','eatery','A lakeside café shortlist|湖边咖啡馆备选',45,2,'mixed','connection','Compare cafés around the lake for a relaxed meal with a short outside pause.|比较湖边咖啡馆，吃一餐，再到户外短暂休息。','Choose a currently open café with posted prices; the guide does not name a guaranteed vendor.|选择当时营业、明码标价的咖啡馆，本指南不保证某家商户营业。','https://www.ppj.gov.my/'],
    ['melaka-chicken-rice','Malaysia','Melaka','eatery','Jonker area: a seated chicken-rice lunch|鸡场街一带：坐下来吃鸡饭',25,1,'indoor','connection','Choose a seated restaurant in the Jonker area instead of a second market circuit.|在鸡场街一带选有座位的餐馆，不再绕逛一轮市场。','Ask about the rice portion, ingredients and queue before committing to lunch.|决定午餐前，问清饭量、食材和等位情况。','https://www.melaka.gov.my/'],
    ['penang-state-gallery','Malaysia','Penang','attraction','Penang State Art Gallery: two works closely|槟城州立美术馆：细看两件作品',20,2,'indoor','connection','Choose two works from the exhibition open on the day, then compare their materials and viewpoints.|在当天开放的展览中选两件作品，比较材料与观看角度。','Confirm the current gallery venue with the museum board: exhibitions can move during building works. Keep this as an indoor, two-hour plan.|向博物馆局确认当前展场，建筑工程期间展览可能迁址。此计划限定室内、两小时。','https://penangmuseum.gov.my/gallery/'],
    ['penang-glass-museum','Malaysia','Penang','attraction','Glass Museum: reflections & technique|玻璃博物馆：反射与工艺',45,2,'indoor','connection','Look at glass surfaces and ask which techniques produced the displayed effects.|观察玻璃表面，了解展品效果使用的工艺。','Allow a higher admission budget; verify the actual ticket and any optional workshop charge separately.|预留较高的门票预算，分别核实实际票价与选修工坊费用。','https://mypenang.gov.my/'],
    ['penang-botanic-short','Malaysia','Penang','attraction','Botanic Gardens: a short tree walk|植物园：短程看树',20,2,'outdoor','connection','Follow one permitted outdoor garden loop and compare three leaf shapes.|沿一条允许通行的户外园路，比较三种叶形。','This is an exposed walk, not an indoor wet-weather option; turn back if conditions deteriorate.|这是露天散步，不是室内雨天备选；天气转差就返回。','https://botanicalgardens.penang.gov.my/'],
    ['penang-gallery-long','Malaysia','Penang','attraction','State gallery: a slow sketchbook session|州立美术馆：慢速速写半日',20,4,'indoor','connection','A deliberately longer alternative at the same gallery: observe, sketch where permitted, pause and revisit a work.|同一美术馆的较长备选：观察，在允许处速写，休息后再看一件作品。','Reserve four hours. Confirm the current exhibition venue and sketching rules; this is not the two-hour route.|预留四小时，确认现时展场与速写规定；这条路线不是两小时版本。','https://penangmuseum.gov.my/gallery/'],
    ['ipoh-han-chin','Malaysia','Perak','attraction','Han Chin Pet Soo: read a room|闲真别墅：细看一个展厅',25,2.5,'indoor','connection','Focus on the historical objects in one room rather than rushing through every display.|聚焦一个展厅的历史物件，不赶着看完全部。','Check the visit reservation procedure before departure; this outline does not reserve admission.|出发前核实预约方式，本指南不代为预约入场。','https://www.ipohworld.org/'],
    ['ipoh-concubine-snack','Malaysia','Perak','eatery','Concubine Lane: a small snack stop|二奶巷：小份点心休息',15,1,'outdoor','connection','Walk the available stalls once and choose one small snack within the posted price.|先看一轮开放摊位，再按标价选一小份点心。','Keep clear of shop doors; use a separate meeting point if the lane is crowded.|不要挡住店门；巷内拥挤时另选集合点。','https://www.malaysia.travel/'],
    ['johor-chinese-museum','Malaysia','Johor','attraction','JB Chinese Heritage Museum: objects & stories|新山华族历史文物馆：物件与故事',20,2,'indoor','connection','Select a household object and a document, then compare what each reveals about the city.|选一件生活物品和一份文献，比较它们如何讲述城市。','Check the current visitor entrance, language labels and stairs before travelling.|出发前确认当前访客入口、展签语言和楼梯。','https://www.malaysia.travel/'],
    ['johor-meldrum','Malaysia','Johor','eatery','Meldrum area: an evening stall meal|明里路一带：晚间摊位餐',20,1,'outdoor','connection','Compare a few open stalls for a simple evening meal rather than a large shared banquet.|比较几家开放摊位，选简单晚餐，不安排大型合菜。','Ask about ingredients and the total before ordering; check the return pickup point in daylight.|点餐前问清食材与总价，天亮时先确认返程接车点。','https://www.malaysia.travel/'],
    ['sabah-state-museum','Malaysia','Sabah','attraction','Sabah Museum: one indoor gallery|沙巴博物馆：一间室内展厅',25,2,'indoor','connection','Choose an indoor gallery theme and take notes on two objects.|选择一个室内展厅主题，记录两件物品。','The plan excludes the outdoor heritage grounds. Confirm which gallery is open and the visitor ticket category.|此计划不含户外文化村；确认开放展厅与访客票种。','https://museum.sabah.gov.my/'],
    ['sabah-gaya-breakfast','Malaysia','Sabah','eatery','Gaya Street: a seated breakfast|加雅街：坐下来吃早餐',20,1,'indoor','connection','Choose a currently open coffee shop on Gaya Street for one breakfast and drink.|在加雅街选一家当时营业的茶室，吃一份早餐配饮料。','Compare displayed menus and ask about dietary needs before taking a seat.|入座前比较菜单，并询问饮食要求。','https://sabahtourism.com/'],
    ['sarawak-cultures','Malaysia','Sarawak','attraction','Borneo Cultures Museum: one floor slowly|婆罗洲文化博物馆：慢看一层',50,3,'indoor','connection','Select one floor or theme; compare an object label with the surrounding display.|选择一层或一个主题，对照物件展签和周围陈列。','Avoid promising the whole museum in three hours; confirm ticket eligibility and lift access directly.|不承诺三小时看完整馆，直接核实票种资格与电梯通行。','https://museum.sarawak.gov.my/'],
    ['sarawak-kopitiam','Malaysia','Sarawak','eatery','Kuching old town: a kopitiam lunch|古晋老城：茶室午餐',20,1,'indoor','connection','Pick one old-town coffee shop with a clear menu for a bowl or plate and a drink.|在老城挑一家菜单清楚的茶室，点一份主食和饮料。','Ask about broth, toppings and ordering at separate stalls; the allowance is per person.|问清汤底、配料及各摊点餐方式；预算按每人计算。','https://sarawaktourism.com/'],
    ['taipei-palace-museum','Taiwan','Taipei','attraction','National Palace Museum: three objects|故宫博物院：只选三件藏品',50,3,'indoor','connection','Choose three objects in currently open galleries, using the museum map to limit backtracking.|用馆内地图在开放展厅挑三件藏品，减少折返。','Check entry rules and the onward bus connection; this guide does not imply a direct rail entrance.|确认入场规则与后段巴士接驳，本指南不表示地铁直达门口。','https://www.npm.gov.tw/'],
    ['taipei-yongkang','Taiwan','Taipei','eatery','Yongkang Street: a seated noodle meal|永康街：坐下来吃一碗面',25,1,'indoor','rail','Compare noodle-shop menus for a single-person meal rather than a long food tour.|比较面馆菜单，选一人餐，不安排长距离美食游。','Confirm the shop branch, ingredients and displayed TWD price before ordering.|点餐前确认分店、食材与标示的新台币价格。','https://www.travel.taipei/'],
    ['bangkok-bacc','Thailand','Bangkok','attraction','BACC: one exhibition visit|曼谷艺术文化中心：看一场展览',20,2,'indoor','rail','Choose one currently open exhibition and compare two works at a comfortable pace.|挑一个当时开放的展览，从容比较两件作品。','Check exhibition-specific access and any charge. The budget is an example, not a quoted admission price.|核实具体展览的进入条件与收费；预算为示例，不是门票报价。','https://www.bacc.or.th/'],
    ['bangkok-chinatown-meal','Thailand','Bangkok','eatery','Yaowarat: one evening meal|耀华力路：只安排一餐',25,1.5,'outdoor','rail','Read a few open-stall menus and choose one dish before adding snacks.|先看几家营业摊位菜单，选主食后再决定点心。','Meet away from the kerb; clarify the THB total and return rail service before ordering.|不要在路缘会合，点餐前问清泰铢总价和返程轨道班次。','https://www.tourismthailand.org/'],
    ['taichung-fine-arts','Taiwan','Taichung','attraction','National Taiwan Museum of Fine Arts: two works|国立台湾美术馆：细看两件作品',20,2,'indoor','connection','Compare two works in an open exhibition and leave time for a seated pause.|比较开放展览中的两件作品，再留一段坐下休息的时间。','Confirm the exhibition entrance and return bus; the plan stays inside rather than adding the parkway.|确认展场入口和返程巴士；此计划留在室内，不加绿园道。','https://travel.taichung.gov.tw/en/attractions/listbyclassification'],
    ['taichung-parkway','Taiwan','Taichung','attraction','Art Museum Parkway: a tree-lined walk|美术园道：林荫短走',0,1.5,'outdoor','connection','Follow one short public parkway section and compare the planting and street edges.|沿一段公共园道短走，比较植物与街道边界。','An outdoor alternative with no admission budget; check crossings, rain and return transport.|这条户外备选不预留门票，须核对过街、雨况和返程交通。','https://travel.taichung.gov.tw/en/attractions/nearbyattractions/901'],
    ['taichung-second-market','Taiwan','Taichung','eatery','Second Market: one breakfast counter|第二市场：一处早餐摊',20,1,'mixed','connection','Compare the open food counters, choose a breakfast and keep the remainder optional.|比较开放餐饮摊位，选一份早餐，其余自由决定。','Covered market sections do not make the entire arrival route weatherproof; check queue and ingredients.|有顶市场不代表来程全程防雨，先问排队和食材。','https://travel.taichung.gov.tw/en/attractions/listbyclassification'],
    ['taichung-cafe','Taiwan','Taichung','eatery','West District: a seated café lunch|西区：坐下来吃咖啡馆午餐',45,2,'indoor','connection','Choose a West District café with posted lunch options for a longer seated break.|在西区选一家列有午餐选择的咖啡馆，多留一点坐下休息的时间。','Confirm minimum spend, dietary choices and whether a drink is included.|确认最低消费、饮食选择和是否附带饮料。','https://travel.taichung.gov.tw/en/'],
    ['chiangmai-chedi','Thailand','ChiangMai','attraction','Wat Chedi Luang: an exterior study|契迪龙寺：建筑外观观察',25,2,'outdoor','connection','Observe the chedi from permitted outdoor visitor paths; compare its outline from two points.|沿允许通行的户外访客路线，从两个位置比较塔的轮廓。','Check dress and visitor rules; do not assume unrestricted access to religious interiors.|确认服装和访客规定，不预设宗教建筑内部可自由进入。','https://www.tourismthailand.org/Attraction/wat-chedi-luang-varavihara'],
    ['chiangmai-national-museum','Thailand','ChiangMai','attraction','Chiang Mai National Museum: a gallery pause|清迈国家博物馆：展厅慢看',30,2.5,'indoor','connection','Read one gallery section and compare a label with the object it describes.|细读一个展厅区段，对照展签与实物。','Confirm current opening and ticket category with the museum before arranging a local connection.|先向馆方确认开放情况与票种，再安排本地接驳。','https://www.finearts.go.th/chiangmaimuseum/'],
    ['chiangmai-warorot','Thailand','ChiangMai','eatery','Warorot Market: a snack & a pause|瓦洛洛市场：点心与休息',20,1,'mixed','connection','Walk one available food aisle, read the stall signs and choose a small snack.|走一条开放的餐饮通道，看摊牌，选一小份点心。','Ask about ingredients and portion size; find a permitted resting place away from trading paths.|询问食材和份量，在不挡营业通道的允许区域休息。','https://www.tourismthailand.org/Attraction/warorot-market'],
    ['chiangmai-nimman','Thailand','ChiangMai','eatery','Nimman: a seated lunch break|宁曼：坐下来吃午餐',45,2,'indoor','connection','Compare a few Nimman-area café menus and choose a seated lunch rather than a market walk.|比较宁曼一带咖啡馆菜单，安排有座位的午餐，不走市场路线。','Check the total in THB, service charges and pickup point before ordering.|点餐前核实泰铢总价、服务费和接车点。','https://www.tourismthailand.org/']
  ];
  const pair=s=>s.split('|');
  const guides=rows.map(([id,country,area,kind,title,cost,hours,shelter,transit,focus,check,source])=>({
    id,country,area,kind,name:pair(title),place:pair(title).map(x=>x.split(/[:：]/)[0]),cost,hours,shelter,transit,
    category:kind==='eatery'?'food':'culture',walk:'low',distance:kind==='eatery'?'0.3 km':'0.8 km',
    priceBasis:kind==='eatery'?'meal':'admission',summary:pair(focus),route:pair(check),
    itinerary:[[kind==='eatery'&&/evening|Yaowarat|Meldrum/.test(title)?'18:00':'10:00',...pair(focus)],['—',...pair(check)]],
    bring:['Water, a small notebook and your personal allowance.','水、小本子与个人预算。'],
    transport:[transit==='rail'?'Check the current rail exit and final walk; allow time for the return service.':'Arrange a local bus or taxi connection and agree a clear return pickup point.',transit==='rail'?'确认当前轨道出口和最后步行，预留返程班次时间。':'安排本地巴士或出租车接驳，约定清楚的返程接车点。'],
    rain:shelter==='indoor'?['Keep this visit indoors; wait under permitted shelter if the final connection is exposed.','把此次访问留在室内；末段接驳露天时，在允许的遮蔽处等候。']:['Shorten exposed sections in rain and choose a confirmed indoor alternative.','下雨时缩短露天部分，另选已确认开放的室内备选。'],
    spend:[kind==='eatery'?'Per-person meal reference budget in RM. Verify the actual local-currency menu, portions and extras.':'Admission reference budget in RM. This is an editorial allocation, not a verified ticket price; eligibility and optional activities can change the actual cost.',kind==='eatery'?'以 RM 表示的人均餐饮参考预算，请核实当地货币菜单、份量与附加收费。':'以 RM 表示的门票参考预算。这是编辑设定的预留，并非核实后的票价；资格与选修活动可能影响实际费用。'],
    access:['Reference budget, not a quote. Suggested visit durations are planning examples, not opening hours. Confirm access and current prices before travelling.','参考预算，非报价。建议用时是规划示例，并非开放时间；出发前确认进入条件与当前价格。'],source
  }));
  // Accommodation is a neighbourhood hotel-comparison guide, never a fictitious
  // named property, room availability claim or booking/payment endpoint.
  const stays=[
    ['Malaysia','KL','KL Sentral|吉隆坡中央车站',180,'rail'],['Malaysia','Selangor','Petaling Jaya|八打灵再也',150,'rail'],
    ['Malaysia','Putrajaya','Putrajaya lake district|布城湖区',220,'connection'],['Malaysia','Perak','Ipoh old town|怡保老城',140,'connection'],
    ['Malaysia','Penang','George Town|乔治市',180,'connection'],['Malaysia','Melaka','Melaka old town|马六甲老城',160,'connection'],
    ['Malaysia','Johor','Johor Bahru centre|新山市中心',150,'connection'],['Malaysia','Sabah','Kota Kinabalu centre|亚庇市中心',180,'connection'],
    ['Malaysia','Sarawak','Kuching waterfront area|古晋河滨一带',160,'connection'],['Taiwan','Taipei','Taipei Main Station area|台北车站一带',250,'rail'],
    ['Taiwan','Taichung','Taichung West District|台中西区',220,'connection'],['Thailand','Bangkok','Siam area, Bangkok|曼谷暹罗一带',200,'rail'],
    ['Thailand','ChiangMai','Chiang Mai old city|清迈老城',150,'connection']
  ].map(([country,area,place,cost,transit])=>({
    id:'stay-'+area.toLowerCase(),country,area,kind:'stay',category:'stay',name:[pair(place)[0]+': compare hotels for one night',pair(place)[1]+'：比较一晚酒店住宿'],place:pair(place),cost,hours:1,shelter:'indoor',transit,walk:'low',distance:'0.5 km',priceBasis:'room',
    summary:['A neighbourhood-based hotel shortlist: compare two actual properties before reserving one room for one night. No specific hotel, vacancy or rate is promised.','按地区做酒店备选清单：比较两家实际酒店，再决定一间房住一晚。不指定酒店，不承诺空房或价格。'],
    route:['Check the exact hotel address, arrival route and late check-in arrangements. Compare room occupancy, cancellation deadlines, taxes and deposits with the property directly.','核对酒店准确地址、抵达路线与晚到入住安排。直接向酒店比较入住人数、取消期限、税费与押金。'],
    itinerary:[['1','Compare two hotel policies and total local-currency prices; keep a cancellation option where possible.','预订前比较两家酒店条款与当地货币总价，尽量保留可取消选项。'],['2','Confirm check-in, luggage storage, the return route and any accessibility needs.','抵达前确认入住、行李寄存、返程路线和无障碍需求。']],
    bring:['Your booking confirmation if you make one independently; ask the hotel what documents it requires. Do not enter identity documents on this prototype.','若自行预订，带好确认单，并询问酒店所需证件。本原型不接收身份证件。'],
    transport:['Check the actual hotel entrance and last connection, not just the neighbourhood name. A rail label still requires a final walk.','确认实际酒店入口与末段接驳，不只看地区名称；标为轨道交通仍需末段步行。'],
    rain:['Choose a sheltered arrival point and ask the property about luggage storage if you arrive early.','选择有遮蔽的抵达点，提前到达时向酒店询问行李寄存。'],
    spend:['Illustrative room budget per room per night in RM, not per person. Confirm local-currency total, taxes, deposits, breakfast and cancellation charges. No currency conversion or live quote is supplied.','RM 金额为每间房每晚住宿预算示例，并非每人价。确认当地货币总价、税费、押金、早餐与取消收费。本站不提供汇率换算或实时报价。'],
    access:['The one-hour duration describes hotel comparison and arrival preparation, not the overnight stay. No booking is made here.','一小时用时仅指比较酒店和抵达准备，并非整晚住宿时长。本站不代为预订。'],
    source:country==='Taiwan'?'https://www.taiwanstay.net.tw/':country==='Thailand'?'https://www.tourismthailand.org/':'https://www.malaysia.travel/'
  }));
  // Official property references make each accommodation outline concrete.
  // The selected RM allowance is a user's planning target, never that hotel's rate.
  const hotelReferences={
    KL:['Aloft Kuala Lumpur Sentral','https://www.marriott.com/en-us/hotels/kulal-aloft-kuala-lumpur-sentral/overview/'],
    Selangor:['Hilton Petaling Jaya','https://www.hilton.com/en/hotels/pethitw-hilton-petaling-jaya/'],
    Putrajaya:['DoubleTree by Hilton Putrajaya Lakeside','https://www.hilton.com/en/locations/malaysia/putrajaya/doubletree-by-hilton/'],
    Perak:['WEIL Hotel, Ipoh','https://www.weilhotel.com/'],
    Penang:['Cititel Penang','https://www.cititelpenang.com/'],
    Melaka:['Hatten Hotel Melaka','https://www.hattenhotel.com/'],
    Johor:['Amari Johor Bahru','https://www.amari.com/johor-bahru'],
    Sabah:['Hyatt Regency Kinabalu','https://www.hyatt.com/en-US/hotel/malaysia/hyatt-regency-kinabalu/bkiki'],
    Sarawak:['Grand Margherita Hotel, Kuching','https://grandmargherita.com/'],
    Taipei:['Palais de Chine Hotel Taipei','https://www.palaisdechinehotel.com/en'],
    Taichung:['The Lin Hotel Taichung, Xitun','https://www.taiwanstay.net.tw/TSA/web_page/TSA020200.jsp?hohi_id=6378&lang2=en'],
    Bangkok:['ibis Bangkok Siam','https://all.accor.com/hotel/8016/index.en.shtml'],
    ChiangMai:['POR Thapae Gate','https://www.porthapaegate.com/']
  };
  for(const e of stays){
    const [name,source]=hotelReferences[e.area];e.source=source;
    e.route=[`Start the comparison with ${name}, then a second hotel in the same destination. Read the official property reference below and check the exact address, occupancy, cancellation deadline, taxes and deposit. The RM allowance is your target, not this property's price or a claim that it fits that target.`,
      `可从 ${name} 开始，再比较同一目的地的另一家酒店。阅读下方官方资料，核对准确地址、入住人数、取消期限、税费与押金。RM 预留是你的目标预算，并非这家酒店的价格，也不表示它符合该预算。`];
    if(e.area==='Taichung'){e.place=['Xitun, Taichung','台中西屯'];e.name=['Xitun: compare hotels for one night','台中西屯：比较一晚酒店住宿'];}
  }
  window.BROWSE_GUIDE_OUTINGS.push(...guides,...stays);
})();
