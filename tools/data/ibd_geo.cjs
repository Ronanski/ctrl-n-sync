// Reads every drawn path of one IBD page (straight pieces, curves as end points, dashed or not) and the words, in 2296-wide page pixels,
// for tools/data/ibd_type.mjs. Runs headless against a local pdf.js viewer that serves the vendor PDF (kept off the repository).
// Usage: PLAYWRIGHT_MODULE=... CHROMIUM=... IBD_VIEWER=http://127.0.0.1:5172/view IBD_PDF="<file name>" node ibd_geo.cjs <page> [out dir]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
(async()=>{const pg=+process.argv[2];const b=await chromium.launch({executablePath:process.env.CHROMIUM,headless:true});const p=await b.newPage();
await p.goto(process.env.IBD_VIEWER || 'http://127.0.0.1:5172/view');await p.waitForFunction(()=>window.show);
const r=await p.evaluate(async ([pg,F])=>{const f=F;const doc=await pdfjsLib.getDocument('/f/'+encodeURIComponent(f)).promise;
 const page=await doc.getPage(pg);const v0=page.getViewport({scale:1});const vp=page.getViewport({scale:2296/v0.width});const T=vp.transform;
 const ol=await page.getOperatorList();const O=pdfjsLib.OPS;let m=[1,0,0,1,0,0];const st=[];let dash=0;const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
 const pt=(x,y)=>{const M=mul(T,m);return [+(M[0]*x+M[2]*y+M[4]).toFixed(1),+(M[1]*x+M[3]*y+M[5]).toFixed(1)]};const paths=[];
 for(let i=0;i<ol.fnArray.length;i++){const fn=ol.fnArray[i],a=ol.argsArray[i];
  if(fn===O.save)st.push([m.slice(),dash]);else if(fn===O.restore){const z=st.pop();if(z){m=z[0];dash=z[1]}}else if(fn===O.transform)m=mul(m,a);
  else if(fn===O.setDash)dash=a[0]&&a[0].length?1:0;
  else if(fn===O.constructPath){const [ops,c]=a;let k=0,cur=null,start=null;const s=[];for(const o of ops){
   if(o===O.moveTo){cur=pt(c[k],c[k+1]);start=cur;k+=2}else if(o===O.lineTo){const n=pt(c[k],c[k+1]);cur&&s.push([...cur,...n,0]);cur=n;k+=2}
   else if(o===O.curveTo){const n=pt(c[k+4],c[k+5]);cur&&s.push([...cur,...n,1]);cur=n;k+=6}else if(o===O.curveTo2||o===O.curveTo3){const n=pt(c[k+2],c[k+3]);cur&&s.push([...cur,...n,1]);cur=n;k+=4}
   else if(o===O.rectangle){const x=c[k],y=c[k+1],w=c[k+2],h=c[k+3];const P=[pt(x,y),pt(x+w,y),pt(x+w,y+h),pt(x,y+h)];for(let j=0;j<4;j++)s.push([...P[j],...P[(j+1)%4],0]);k+=4}
   else if(o===O.closePath){if(cur&&start&&(cur[0]!==start[0]||cur[1]!==start[1]))s.push([...cur,...start,0]);cur=start}}
   if(s.length)paths.push({d:dash,s})}}
 const tc=await page.getTextContent();const words=tc.items.filter(t=>t.str.trim()).map(t=>{const q=pdfjsLib.Util.transform(T,t.transform);return [t.str,+q[4].toFixed(1),+q[5].toFixed(1),+(t.width*T[0]).toFixed(1),t.fontName,Math.round(Math.atan2(q[1],q[0])*180/Math.PI),+Math.hypot(q[2],q[3]).toFixed(1)]});
 return {paths,words}},[pg,process.env.IBD_PDF]);
require('fs').writeFileSync((process.argv[3]||'.')+'/p-'+pg+'.json',JSON.stringify(r));console.log(r.paths.length,r.words.length);await b.close()})();
