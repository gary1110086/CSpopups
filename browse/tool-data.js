/* Examples are project-owned bitmap artworks, not photographs of documented places. */
window.BROWSE_TOOL_SAMPLES = [
 {id:'city',name:'Rainy city',zh:'雨夜城市',file:'assets/wallpaper-city.png',thumb:'assets/wallpaper-city-thumb.webp',type:'image/png',filename:'rainy-city.png',width:1672,height:941,description:'Detailed city artwork · a useful test for fine texture and reflections',descriptionZh:'细节丰富的城市画面，适合比较纹理和倒影',exercise:'Create a 1280px-wide WebP at 75% quality and compare fine city textures.',exerciseZh:'导出宽1280像素、质量75%的WebP，比较城市纹理细节。',preset:'web'},
 {id:'ridge',name:'Mountain ridge',zh:'山间晨光',file:'assets/wallpaper-ridge.png',thumb:'assets/wallpaper-ridge-thumb.webp',type:'image/png',filename:'mountain-ridge.png',width:1672,height:941,description:'Mountain artwork · sky gradients and fine rock detail',descriptionZh:'山景画面，包含天空渐变和岩石细节',exercise:'Create a 1280px-wide JPEG at 80% quality.',exerciseZh:'导出宽1280像素、质量80%的JPEG。',preset:'photo'},
 {id:'canopy',name:'Forest canopy',zh:'林间树冠',file:'assets/wallpaper-canopy.png',thumb:'assets/wallpaper-canopy-thumb.webp',type:'image/png',filename:'forest-canopy.png',width:1672,height:941,description:'Forest artwork · dense leaves expose compression artefacts',descriptionZh:'森林画面，密集树叶适合观察压缩痕迹',exercise:'Make an 800px-wide WebP for a mobile article.',exerciseZh:'制作一张宽800像素、用于手机文章的WebP。',preset:'mobile'},
 {id:'fluid',name:'Cobalt glass',zh:'钴蓝玻璃',file:'assets/wallpaper-fluid.png',thumb:'assets/wallpaper-fluid-thumb.webp',type:'image/png',filename:'cobalt-glass.png',width:1672,height:941,description:'Opaque glass artwork · dark gradients and bright edges',descriptionZh:'不透明玻璃画面，包含深色渐变和明亮边缘',exercise:'Export an 800px-wide lossless PNG.',exerciseZh:'导出宽800像素的无损PNG。',preset:'lossless'},
 {id:'alpine',name:'Alpine illustration',zh:'山间插画',file:'../wallpapers/assets/alpine-dawn.svg',type:'image/svg+xml',filename:'alpine-dawn.png',width:2560,height:1440,description:'Original vector illustration, rasterised to 2560×1440 for this tool',descriptionZh:'原创矢量插画，在工具中栅格化为2560×1440',exercise:'Prepare a 1920px-wide JPEG cover at 80% quality.',exerciseZh:'制作一张宽1920像素、质量80%的JPEG封面。',preset:'cover'},
 {id:'sunroom',name:'Sunroom illustration',zh:'阳光书房插画',file:'../wallpapers/assets/sunroom-study.svg',type:'image/svg+xml',filename:'sunroom-study.png',width:2560,height:1440,description:'Crisp vector furniture and warm colour blocks, rasterised to 2560×1440',descriptionZh:'轮廓清晰的家具与温暖色块，栅格化为2560×1440',exercise:'Fit a 1280px-wide JPEG below 100KB using target-size mode.',exerciseZh:'使用目标体积模式，将宽1280像素的JPEG压到100KB以下。',preset:'photo'}
];
window.BROWSE_TOOL_PRESETS = [
 {id:'custom',name:'Custom settings',zh:'自定义设置'},
 {id:'web',name:'Web image · WebP 1280',zh:'网页图片 · WebP 1280',format:'image/webp',width:1280,quality:75},
 {id:'photo',name:'Photo · JPEG 1280',zh:'照片 · JPEG 1280',format:'image/jpeg',width:1280,quality:80},
 {id:'mobile',name:'Mobile article · WebP 800',zh:'手机文章 · WebP 800',format:'image/webp',width:800,quality:75},
 {id:'lossless',name:'Lossless · PNG 800',zh:'无损 · PNG 800',format:'image/png',width:800,quality:100},
 {id:'cover',name:'Cover · JPEG 1920',zh:'封面 · JPEG 1920',format:'image/jpeg',width:1920,quality:80}
];
