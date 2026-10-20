// Saha haritası animasyonunu MP4'e çevirir: kareleri Playwright ile çizer, ffmpeg ile birleştirir.
// Kullanım: node scripts/render_video.js   →   video/saha-haritasi-en.mp4
const {chromium}=require("playwright");
const {spawn}=require("child_process");
const path=require("path");
const FPS=30;
const root=path.resolve(__dirname,"..");
const out=path.join(root,"video","saha-haritasi-en.mp4");
(async()=>{
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
 await page.goto("file://"+path.join(root,"video","harita.html"));
 await page.evaluate(()=>window.READY);
 const dur=await page.evaluate(()=>window.DURATION),frames=Math.round(dur*FPS);
 const ff=spawn("ffmpeg",["-y","-loglevel","error","-f","image2pipe","-framerate",String(FPS),"-i","-",
  "-c:v","libx264","-preset","slow","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",out],{stdio:["pipe","inherit","inherit"]});
 for(let i=0;i<frames;i++){
  await page.evaluate(t=>window.render(t),i/FPS);
  ff.stdin.write(await page.screenshot({type:"png"}));
  if(i%60===0)process.stdout.write(`\r${i}/${frames}`);
 }
 ff.stdin.end();await new Promise(r=>ff.on("close",r));await browser.close();
 console.log(`\r${frames} kare → ${out}`);
})();
