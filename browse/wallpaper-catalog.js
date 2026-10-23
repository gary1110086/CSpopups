/* Independent Browse additions; the standalone Stillwall catalogue stays unchanged. */
(() => {
  const originals = window.STILLWALL_ITEMS || [];
  const data = [
    ['ridge','ridge-lake','Ridge & lake','雪岭与湖','nature',['#A4CEE0','#56788D','#555F55'],['mountains','lake','snow','landscape','山','湖']],
    ['canopy','forest-path','Forest path','林间小径','nature',['#ACBA76','#59623D','#303B2C'],['forest','green','trees','nature','森林','绿色']],
    ['city','blue-hour-street','Blue hour street','蓝调街道','city',['#2D536A','#D29F5D','#283F4B'],['city','rain','night','street','城市','雨']],
    ['fluid','cobalt-glass','Cobalt glass','钴蓝玻璃','abstract',['#062E60','#10799D','#6EADBA'],['blue','glass','abstract','texture','蓝','抽象']]
  ].map(([file,id,en,zh,category,colors,tags]) => ({id,title:{en,zh},description:{en:'Original generated wallpaper artwork.',zh:'原创生成壁纸作品。'},category,localAsset:`assets/wallpaper-${file}.jpg`,thumbnail:`assets/wallpaper-${file}-thumb.webp`,colors,tags,width:1672,height:941}));
  const order=['ridge-lake','alpine-dawn','blue-hour-street','quiet-tide','forest-path','mistwood','cobalt-glass','blue-current','sunroom-study','after-rain','lunar-drift','sunday-cat'];
  window.BROWSE_WALLPAPERS=[...originals,...data].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
})();
