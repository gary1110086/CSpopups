/* Real reusable photographic examples. Credits and source licences remain attached. */
window.BROWSE_TOOL_SAMPLES=[
 ['city','blue-hour-street','web'],['ridge','ridge-lake','photo'],['canopy','forest-path','mobile'],['fluid','cobalt-glass','lossless'],['alpine','alpine-dawn','cover'],['sunroom','sunroom-study','photo']
].map(([id,key,preset])=>{const x=window.BROWSE_WALLPAPERS.find(x=>x.id===key),m=window.BROWSE_REAL_MEDIA.wall[key];return {id,name:x.title.en,zh:x.title.zh,file:m.file,thumb:m.thumb,type:'image/jpeg',filename:key+'.jpg',width:m.width,height:m.height,description:x.description.en,descriptionZh:x.description.zh,exercise:'Choose a format, compare the pixels and download your result.',exerciseZh:'选择格式，对比像素并下载结果。',preset,credit:m.credit,license:m.license,licenseUrl:m.licenseUrl,sourceUrl:m.sourceUrl};});
window.BROWSE_TOOL_PRESETS = [
 {id:'custom',name:'Custom settings',zh:'自定义设置'},
 {id:'web',name:'Web image · WebP 1280',zh:'网页图片 · WebP 1280',format:'image/webp',width:1280,quality:75},
 {id:'photo',name:'Photo · JPEG 1280',zh:'照片 · JPEG 1280',format:'image/jpeg',width:1280,quality:80},
 {id:'mobile',name:'Mobile article · WebP 800',zh:'手机文章 · WebP 800',format:'image/webp',width:800,quality:75},
 {id:'lossless',name:'Lossless · PNG 800',zh:'无损 · PNG 800',format:'image/png',width:800,quality:100},
 {id:'cover',name:'Cover · JPEG 1920',zh:'封面 · JPEG 1920',format:'image/jpeg',width:1920,quality:80}
];
