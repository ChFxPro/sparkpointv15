(()=>{var Ef=Object.create;var Qc=Object.defineProperty;var Tf=Object.getOwnPropertyDescriptor;var Af=Object.getOwnPropertyNames;var Cf=Object.getPrototypeOf,Rf=Object.prototype.hasOwnProperty;var nt=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var If=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Af(e))!Rf.call(i,s)&&s!==t&&Qc(i,s,{get:()=>e[s],enumerable:!(n=Tf(e,s))||n.enumerable});return i};var Pf=(i,e,t)=>(t=i!=null?Ef(Cf(i)):{},If(e||!i||!i.__esModule?Qc(t,"default",{value:i,enumerable:!0}):t,i));var od=nt((p3,rd)=>{rd.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var li=nt(Li=>{var gc,cx=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];Li.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};Li.getSymbolTotalCodewords=function(e){return cx[e]};Li.getBCHDigit=function(i){let e=0;for(;i!==0;)e++,i>>>=1;return e};Li.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');gc=e};Li.isKanjiModeEnabled=function(){return typeof gc<"u"};Li.toSJIS=function(e){return gc(e)}});var Ia=nt(rn=>{rn.L={bit:1};rn.M={bit:0};rn.Q={bit:3};rn.H={bit:2};function hx(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"l":case"low":return rn.L;case"m":case"medium":return rn.M;case"q":case"quartile":return rn.Q;case"h":case"high":return rn.H;default:throw new Error("Unknown EC Level: "+i)}}rn.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4};rn.from=function(e,t){if(rn.isValid(e))return e;try{return hx(e)}catch{return t}}});var cd=nt((x3,ld)=>{function ad(){this.buffer=[],this.length=0}ad.prototype={get:function(i){let e=Math.floor(i/8);return(this.buffer[e]>>>7-i%8&1)===1},put:function(i,e){for(let t=0;t<e;t++)this.putBit((i>>>e-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(i){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),i&&(this.buffer[e]|=128>>>this.length%8),this.length++}};ld.exports=ad});var ud=nt((_3,hd)=>{function fr(i){if(!i||i<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=i,this.data=new Uint8Array(i*i),this.reservedBit=new Uint8Array(i*i)}fr.prototype.set=function(i,e,t,n){let s=i*this.size+e;this.data[s]=t,n&&(this.reservedBit[s]=!0)};fr.prototype.get=function(i,e){return this.data[i*this.size+e]};fr.prototype.xor=function(i,e,t){this.data[i*this.size+e]^=t};fr.prototype.isReserved=function(i,e){return this.reservedBit[i*this.size+e]};hd.exports=fr});var dd=nt(Pa=>{var ux=li().getSymbolSize;Pa.getRowColCoords=function(e){if(e===1)return[];let t=Math.floor(e/7)+2,n=ux(e),s=n===145?26:Math.ceil((n-13)/(2*t-2))*2,r=[n-7];for(let o=1;o<t-1;o++)r[o]=r[o-1]-s;return r.push(6),r.reverse()};Pa.getPositions=function(e){let t=[],n=Pa.getRowColCoords(e),s=n.length;for(let r=0;r<s;r++)for(let o=0;o<s;o++)r===0&&o===0||r===0&&o===s-1||r===s-1&&o===0||t.push([n[r],n[o]]);return t}});var md=nt(pd=>{var dx=li().getSymbolSize,fd=7;pd.getPositions=function(e){let t=dx(e);return[[0,0],[t-fd,0],[0,t-fd]]}});var gd=nt(at=>{at.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var Di={N1:3,N2:3,N3:40,N4:10};at.isValid=function(e){return e!=null&&e!==""&&!isNaN(e)&&e>=0&&e<=7};at.from=function(e){return at.isValid(e)?parseInt(e,10):void 0};at.getPenaltyN1=function(e){let t=e.size,n=0,s=0,r=0,o=null,a=null;for(let l=0;l<t;l++){s=r=0,o=a=null;for(let c=0;c<t;c++){let h=e.get(l,c);h===o?s++:(s>=5&&(n+=Di.N1+(s-5)),o=h,s=1),h=e.get(c,l),h===a?r++:(r>=5&&(n+=Di.N1+(r-5)),a=h,r=1)}s>=5&&(n+=Di.N1+(s-5)),r>=5&&(n+=Di.N1+(r-5))}return n};at.getPenaltyN2=function(e){let t=e.size,n=0;for(let s=0;s<t-1;s++)for(let r=0;r<t-1;r++){let o=e.get(s,r)+e.get(s,r+1)+e.get(s+1,r)+e.get(s+1,r+1);(o===4||o===0)&&n++}return n*Di.N2};at.getPenaltyN3=function(e){let t=e.size,n=0,s=0,r=0;for(let o=0;o<t;o++){s=r=0;for(let a=0;a<t;a++)s=s<<1&2047|e.get(o,a),a>=10&&(s===1488||s===93)&&n++,r=r<<1&2047|e.get(a,o),a>=10&&(r===1488||r===93)&&n++}return n*Di.N3};at.getPenaltyN4=function(e){let t=0,n=e.data.length;for(let r=0;r<n;r++)t+=e.data[r];return Math.abs(Math.ceil(t*100/n/5)-10)*Di.N4};function fx(i,e,t){switch(i){case at.Patterns.PATTERN000:return(e+t)%2===0;case at.Patterns.PATTERN001:return e%2===0;case at.Patterns.PATTERN010:return t%3===0;case at.Patterns.PATTERN011:return(e+t)%3===0;case at.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(t/3))%2===0;case at.Patterns.PATTERN101:return e*t%2+e*t%3===0;case at.Patterns.PATTERN110:return(e*t%2+e*t%3)%2===0;case at.Patterns.PATTERN111:return(e*t%3+(e+t)%2)%2===0;default:throw new Error("bad maskPattern:"+i)}}at.applyMask=function(e,t){let n=t.size;for(let s=0;s<n;s++)for(let r=0;r<n;r++)t.isReserved(r,s)||t.xor(r,s,fx(e,r,s))};at.getBestMask=function(e,t){let n=Object.keys(at.Patterns).length,s=0,r=1/0;for(let o=0;o<n;o++){t(o),at.applyMask(o,e);let a=at.getPenaltyN1(e)+at.getPenaltyN2(e)+at.getPenaltyN3(e)+at.getPenaltyN4(e);at.applyMask(o,e),a<r&&(r=a,s=o)}return s}});var _c=nt(xc=>{var ci=Ia(),La=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],Da=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];xc.getBlocksCount=function(e,t){switch(t){case ci.L:return La[(e-1)*4+0];case ci.M:return La[(e-1)*4+1];case ci.Q:return La[(e-1)*4+2];case ci.H:return La[(e-1)*4+3];default:return}};xc.getTotalCodewordsCount=function(e,t){switch(t){case ci.L:return Da[(e-1)*4+0];case ci.M:return Da[(e-1)*4+1];case ci.Q:return Da[(e-1)*4+2];case ci.H:return Da[(e-1)*4+3];default:return}}});var xd=nt(Na=>{var pr=new Uint8Array(512),Ua=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)pr[t]=e,Ua[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)pr[t]=pr[t-255]})();Na.log=function(e){if(e<1)throw new Error("log("+e+")");return Ua[e]};Na.exp=function(e){return pr[e]};Na.mul=function(e,t){return e===0||t===0?0:pr[Ua[e]+Ua[t]]}});var _d=nt(mr=>{var yc=xd();mr.mul=function(e,t){let n=new Uint8Array(e.length+t.length-1);for(let s=0;s<e.length;s++)for(let r=0;r<t.length;r++)n[s+r]^=yc.mul(e[s],t[r]);return n};mr.mod=function(e,t){let n=new Uint8Array(e);for(;n.length-t.length>=0;){let s=n[0];for(let o=0;o<t.length;o++)n[o]^=yc.mul(t[o],s);let r=0;for(;r<n.length&&n[r]===0;)r++;n=n.slice(r)}return n};mr.generateECPolynomial=function(e){let t=new Uint8Array([1]);for(let n=0;n<e;n++)t=mr.mul(t,new Uint8Array([1,yc.exp(n)]));return t}});var Md=nt((E3,vd)=>{var yd=_d();function vc(i){this.genPoly=void 0,this.degree=i,this.degree&&this.initialize(this.degree)}vc.prototype.initialize=function(e){this.degree=e,this.genPoly=yd.generateECPolynomial(this.degree)};vc.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let n=yd.mod(t,this.genPoly),s=this.degree-n.length;if(s>0){let r=new Uint8Array(this.degree);return r.set(n,s),r}return n};vd.exports=vc});var Mc=nt(bd=>{bd.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}});var bc=nt(Wn=>{var Sd="[0-9]+",px="[A-Z $%*+\\-./:]+",gr="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";gr=gr.replace(/u/g,"\\u");var mx="(?:(?![A-Z0-9 $%*+\\-./:]|"+gr+`)(?:.|[\r
]))+`;Wn.KANJI=new RegExp(gr,"g");Wn.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");Wn.BYTE=new RegExp(mx,"g");Wn.NUMERIC=new RegExp(Sd,"g");Wn.ALPHANUMERIC=new RegExp(px,"g");var gx=new RegExp("^"+gr+"$"),xx=new RegExp("^"+Sd+"$"),_x=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");Wn.testKanji=function(e){return gx.test(e)};Wn.testNumeric=function(e){return xx.test(e)};Wn.testAlphanumeric=function(e){return _x.test(e)}});var hi=nt(xt=>{var yx=Mc(),Sc=bc();xt.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};xt.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};xt.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};xt.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};xt.MIXED={bit:-1};xt.getCharCountIndicator=function(e,t){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!yx.isValid(t))throw new Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]};xt.getBestModeForData=function(e){return Sc.testNumeric(e)?xt.NUMERIC:Sc.testAlphanumeric(e)?xt.ALPHANUMERIC:Sc.testKanji(e)?xt.KANJI:xt.BYTE};xt.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")};xt.isValid=function(e){return e&&e.bit&&e.ccBits};function vx(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"numeric":return xt.NUMERIC;case"alphanumeric":return xt.ALPHANUMERIC;case"kanji":return xt.KANJI;case"byte":return xt.BYTE;default:throw new Error("Unknown mode: "+i)}}xt.from=function(e,t){if(xt.isValid(e))return e;try{return vx(e)}catch{return t}}});var Cd=nt(Ui=>{var Fa=li(),Mx=_c(),wd=Ia(),ui=hi(),wc=Mc(),Td=7973,Ed=Fa.getBCHDigit(Td);function bx(i,e,t){for(let n=1;n<=40;n++)if(e<=Ui.getCapacity(n,t,i))return n}function Ad(i,e){return ui.getCharCountIndicator(i,e)+4}function Sx(i,e){let t=0;return i.forEach(function(n){let s=Ad(n.mode,e);t+=s+n.getBitsLength()}),t}function wx(i,e){for(let t=1;t<=40;t++)if(Sx(i,t)<=Ui.getCapacity(t,e,ui.MIXED))return t}Ui.from=function(e,t){return wc.isValid(e)?parseInt(e,10):t};Ui.getCapacity=function(e,t,n){if(!wc.isValid(e))throw new Error("Invalid QR Code version");typeof n>"u"&&(n=ui.BYTE);let s=Fa.getSymbolTotalCodewords(e),r=Mx.getTotalCodewordsCount(e,t),o=(s-r)*8;if(n===ui.MIXED)return o;let a=o-Ad(n,e);switch(n){case ui.NUMERIC:return Math.floor(a/10*3);case ui.ALPHANUMERIC:return Math.floor(a/11*2);case ui.KANJI:return Math.floor(a/13);case ui.BYTE:default:return Math.floor(a/8)}};Ui.getBestVersionForData=function(e,t){let n,s=wd.from(t,wd.M);if(Array.isArray(e)){if(e.length>1)return wx(e,s);if(e.length===0)return 1;n=e[0]}else n=e;return bx(n.mode,n.getLength(),s)};Ui.getEncodedBits=function(e){if(!wc.isValid(e)||e<7)throw new Error("Invalid QR Code version");let t=e<<12;for(;Fa.getBCHDigit(t)-Ed>=0;)t^=Td<<Fa.getBCHDigit(t)-Ed;return e<<12|t}});var Ld=nt(Pd=>{var Ec=li(),Id=1335,Ex=21522,Rd=Ec.getBCHDigit(Id);Pd.getEncodedBits=function(e,t){let n=e.bit<<3|t,s=n<<10;for(;Ec.getBCHDigit(s)-Rd>=0;)s^=Id<<Ec.getBCHDigit(s)-Rd;return(n<<10|s)^Ex}});var Ud=nt((P3,Dd)=>{var Tx=hi();function vs(i){this.mode=Tx.NUMERIC,this.data=i.toString()}vs.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};vs.prototype.getLength=function(){return this.data.length};vs.prototype.getBitsLength=function(){return vs.getBitsLength(this.data.length)};vs.prototype.write=function(e){let t,n,s;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),s=parseInt(n,10),e.put(s,10);let r=this.data.length-t;r>0&&(n=this.data.substr(t),s=parseInt(n,10),e.put(s,r*3+1))};Dd.exports=vs});var Fd=nt((L3,Nd)=>{var Ax=hi(),Tc=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function Ms(i){this.mode=Ax.ALPHANUMERIC,this.data=i}Ms.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};Ms.prototype.getLength=function(){return this.data.length};Ms.prototype.getBitsLength=function(){return Ms.getBitsLength(this.data.length)};Ms.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let n=Tc.indexOf(this.data[t])*45;n+=Tc.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(Tc.indexOf(this.data[t]),6)};Nd.exports=Ms});var Od=nt((D3,Bd)=>{var Cx=hi();function bs(i){this.mode=Cx.BYTE,typeof i=="string"?this.data=new TextEncoder().encode(i):this.data=new Uint8Array(i)}bs.getBitsLength=function(e){return e*8};bs.prototype.getLength=function(){return this.data.length};bs.prototype.getBitsLength=function(){return bs.getBitsLength(this.data.length)};bs.prototype.write=function(i){for(let e=0,t=this.data.length;e<t;e++)i.put(this.data[e],8)};Bd.exports=bs});var zd=nt((U3,kd)=>{var Rx=hi(),Ix=li();function Ss(i){this.mode=Rx.KANJI,this.data=i}Ss.getBitsLength=function(e){return e*13};Ss.prototype.getLength=function(){return this.data.length};Ss.prototype.getBitsLength=function(){return Ss.getBitsLength(this.data.length)};Ss.prototype.write=function(i){let e;for(e=0;e<this.data.length;e++){let t=Ix.toSJIS(this.data[e]);if(t>=33088&&t<=40956)t-=33088;else if(t>=57408&&t<=60351)t-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);t=(t>>>8&255)*192+(t&255),i.put(t,13)}};kd.exports=Ss});var Vd=nt((N3,Ac)=>{"use strict";var xr={single_source_shortest_paths:function(i,e,t){var n={},s={};s[e]=0;var r=xr.PriorityQueue.make();r.push(e,0);for(var o,a,l,c,h,u,d,p,g;!r.empty();){o=r.pop(),a=o.value,c=o.cost,h=i[a]||{};for(l in h)h.hasOwnProperty(l)&&(u=h[l],d=c+u,p=s[l],g=typeof s[l]>"u",(g||p>d)&&(s[l]=d,r.push(l,d),n[l]=a))}if(typeof t<"u"&&typeof s[t]>"u"){var _=["Could not find a path from ",e," to ",t,"."].join("");throw new Error(_)}return n},extract_shortest_path_from_predecessor_list:function(i,e){for(var t=[],n=e,s;n;)t.push(n),s=i[n],n=i[n];return t.reverse(),t},find_path:function(i,e,t){var n=xr.single_source_shortest_paths(i,e,t);return xr.extract_shortest_path_from_predecessor_list(n,t)},PriorityQueue:{make:function(i){var e=xr.PriorityQueue,t={},n;i=i||{};for(n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t.queue=[],t.sorter=i.sorter||e.default_sorter,t},default_sorter:function(i,e){return i.cost-e.cost},push:function(i,e){var t={value:i,cost:e};this.queue.push(t),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof Ac<"u"&&(Ac.exports=xr)});var Jd=nt(ws=>{var Ke=hi(),Wd=Ud(),Xd=Fd(),qd=Od(),Yd=zd(),_r=bc(),Ba=li(),Px=Vd();function Hd(i){return unescape(encodeURIComponent(i)).length}function yr(i,e,t){let n=[],s;for(;(s=i.exec(t))!==null;)n.push({data:s[0],index:s.index,mode:e,length:s[0].length});return n}function $d(i){let e=yr(_r.NUMERIC,Ke.NUMERIC,i),t=yr(_r.ALPHANUMERIC,Ke.ALPHANUMERIC,i),n,s;return Ba.isKanjiModeEnabled()?(n=yr(_r.BYTE,Ke.BYTE,i),s=yr(_r.KANJI,Ke.KANJI,i)):(n=yr(_r.BYTE_KANJI,Ke.BYTE,i),s=[]),e.concat(t,n,s).sort(function(o,a){return o.index-a.index}).map(function(o){return{data:o.data,mode:o.mode,length:o.length}})}function Cc(i,e){switch(e){case Ke.NUMERIC:return Wd.getBitsLength(i);case Ke.ALPHANUMERIC:return Xd.getBitsLength(i);case Ke.KANJI:return Yd.getBitsLength(i);case Ke.BYTE:return qd.getBitsLength(i)}}function Lx(i){return i.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function Dx(i){let e=[];for(let t=0;t<i.length;t++){let n=i[t];switch(n.mode){case Ke.NUMERIC:e.push([n,{data:n.data,mode:Ke.ALPHANUMERIC,length:n.length},{data:n.data,mode:Ke.BYTE,length:n.length}]);break;case Ke.ALPHANUMERIC:e.push([n,{data:n.data,mode:Ke.BYTE,length:n.length}]);break;case Ke.KANJI:e.push([n,{data:n.data,mode:Ke.BYTE,length:Hd(n.data)}]);break;case Ke.BYTE:e.push([{data:n.data,mode:Ke.BYTE,length:Hd(n.data)}])}}return e}function Ux(i,e){let t={},n={start:{}},s=["start"];for(let r=0;r<i.length;r++){let o=i[r],a=[];for(let l=0;l<o.length;l++){let c=o[l],h=""+r+l;a.push(h),t[h]={node:c,lastCount:0},n[h]={};for(let u=0;u<s.length;u++){let d=s[u];t[d]&&t[d].node.mode===c.mode?(n[d][h]=Cc(t[d].lastCount+c.length,c.mode)-Cc(t[d].lastCount,c.mode),t[d].lastCount+=c.length):(t[d]&&(t[d].lastCount=c.length),n[d][h]=Cc(c.length,c.mode)+4+Ke.getCharCountIndicator(c.mode,e))}}s=a}for(let r=0;r<s.length;r++)n[s[r]].end=0;return{map:n,table:t}}function Gd(i,e){let t,n=Ke.getBestModeForData(i);if(t=Ke.from(e,n),t!==Ke.BYTE&&t.bit<n.bit)throw new Error('"'+i+'" cannot be encoded with mode '+Ke.toString(t)+`.
 Suggested mode is: `+Ke.toString(n));switch(t===Ke.KANJI&&!Ba.isKanjiModeEnabled()&&(t=Ke.BYTE),t){case Ke.NUMERIC:return new Wd(i);case Ke.ALPHANUMERIC:return new Xd(i);case Ke.KANJI:return new Yd(i);case Ke.BYTE:return new qd(i)}}ws.fromArray=function(e){return e.reduce(function(t,n){return typeof n=="string"?t.push(Gd(n,null)):n.data&&t.push(Gd(n.data,n.mode)),t},[])};ws.fromString=function(e,t){let n=$d(e,Ba.isKanjiModeEnabled()),s=Dx(n),r=Ux(s,t),o=Px.find_path(r.map,"start","end"),a=[];for(let l=1;l<o.length-1;l++)a.push(r.table[o[l]].node);return ws.fromArray(Lx(a))};ws.rawSplit=function(e){return ws.fromArray($d(e,Ba.isKanjiModeEnabled()))}});var Kd=nt(Zd=>{var ka=li(),Rc=Ia(),Nx=cd(),Fx=ud(),Bx=dd(),Ox=md(),Lc=gd(),Dc=_c(),kx=Md(),Oa=Cd(),zx=Ld(),Vx=hi(),Ic=Jd();function Hx(i,e){let t=i.size,n=Ox.getPositions(e);for(let s=0;s<n.length;s++){let r=n[s][0],o=n[s][1];for(let a=-1;a<=7;a++)if(!(r+a<=-1||t<=r+a))for(let l=-1;l<=7;l++)o+l<=-1||t<=o+l||(a>=0&&a<=6&&(l===0||l===6)||l>=0&&l<=6&&(a===0||a===6)||a>=2&&a<=4&&l>=2&&l<=4?i.set(r+a,o+l,!0,!0):i.set(r+a,o+l,!1,!0))}}function Gx(i){let e=i.size;for(let t=8;t<e-8;t++){let n=t%2===0;i.set(t,6,n,!0),i.set(6,t,n,!0)}}function Wx(i,e){let t=Bx.getPositions(e);for(let n=0;n<t.length;n++){let s=t[n][0],r=t[n][1];for(let o=-2;o<=2;o++)for(let a=-2;a<=2;a++)o===-2||o===2||a===-2||a===2||o===0&&a===0?i.set(s+o,r+a,!0,!0):i.set(s+o,r+a,!1,!0)}}function Xx(i,e){let t=i.size,n=Oa.getEncodedBits(e),s,r,o;for(let a=0;a<18;a++)s=Math.floor(a/3),r=a%3+t-8-3,o=(n>>a&1)===1,i.set(s,r,o,!0),i.set(r,s,o,!0)}function Pc(i,e,t){let n=i.size,s=zx.getEncodedBits(e,t),r,o;for(r=0;r<15;r++)o=(s>>r&1)===1,r<6?i.set(r,8,o,!0):r<8?i.set(r+1,8,o,!0):i.set(n-15+r,8,o,!0),r<8?i.set(8,n-r-1,o,!0):r<9?i.set(8,15-r-1+1,o,!0):i.set(8,15-r-1,o,!0);i.set(n-8,8,1,!0)}function qx(i,e){let t=i.size,n=-1,s=t-1,r=7,o=0;for(let a=t-1;a>0;a-=2)for(a===6&&a--;;){for(let l=0;l<2;l++)if(!i.isReserved(s,a-l)){let c=!1;o<e.length&&(c=(e[o]>>>r&1)===1),i.set(s,a-l,c),r--,r===-1&&(o++,r=7)}if(s+=n,s<0||t<=s){s-=n,n=-n;break}}}function Yx(i,e,t){let n=new Nx;t.forEach(function(l){n.put(l.mode.bit,4),n.put(l.getLength(),Vx.getCharCountIndicator(l.mode,i)),l.write(n)});let s=ka.getSymbolTotalCodewords(i),r=Dc.getTotalCodewordsCount(i,e),o=(s-r)*8;for(n.getLengthInBits()+4<=o&&n.put(0,4);n.getLengthInBits()%8!==0;)n.putBit(0);let a=(o-n.getLengthInBits())/8;for(let l=0;l<a;l++)n.put(l%2?17:236,8);return $x(n,i,e)}function $x(i,e,t){let n=ka.getSymbolTotalCodewords(e),s=Dc.getTotalCodewordsCount(e,t),r=n-s,o=Dc.getBlocksCount(e,t),a=n%o,l=o-a,c=Math.floor(n/o),h=Math.floor(r/o),u=h+1,d=c-h,p=new kx(d),g=0,_=new Array(o),m=new Array(o),f=0,E=new Uint8Array(i.buffer);for(let R=0;R<o;R++){let F=R<l?h:u;_[R]=E.slice(g,g+F),m[R]=p.encode(_[R]),g+=F,f=Math.max(f,F)}let w=new Uint8Array(n),M=0,C,A;for(C=0;C<f;C++)for(A=0;A<o;A++)C<_[A].length&&(w[M++]=_[A][C]);for(C=0;C<d;C++)for(A=0;A<o;A++)w[M++]=m[A][C];return w}function Jx(i,e,t,n){let s;if(Array.isArray(i))s=Ic.fromArray(i);else if(typeof i=="string"){let c=e;if(!c){let h=Ic.rawSplit(i);c=Oa.getBestVersionForData(h,t)}s=Ic.fromString(i,c||40)}else throw new Error("Invalid data");let r=Oa.getBestVersionForData(s,t);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=r;else if(e<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);let o=Yx(e,t,s),a=ka.getSymbolSize(e),l=new Fx(a);return Hx(l,e),Gx(l),Wx(l,e),Pc(l,t,0),e>=7&&Xx(l,e),qx(l,o),isNaN(n)&&(n=Lc.getBestMask(l,Pc.bind(null,l,t))),Lc.applyMask(n,l),Pc(l,t,n),{modules:l,version:e,errorCorrectionLevel:t,maskPattern:n,segments:s}}Zd.create=function(e,t){if(typeof e>"u"||e==="")throw new Error("No input text");let n=Rc.M,s,r;return typeof t<"u"&&(n=Rc.from(t.errorCorrectionLevel,Rc.M),s=Oa.from(t.version),r=Lc.from(t.maskPattern),t.toSJISFunc&&ka.setToSJISFunction(t.toSJISFunc)),Jx(e,s,n,r)}});var Uc=nt(Ni=>{function jd(i){if(typeof i=="number"&&(i=i.toString()),typeof i!="string")throw new Error("Color should be defined as hex string");let e=i.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+i);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(n){return[n,n]}))),e.length===6&&e.push("F","F");let t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:t&255,hex:"#"+e.slice(0,6).join("")}}Ni.getOptions=function(e){e||(e={}),e.color||(e.color={});let t=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,n=e.width&&e.width>=21?e.width:void 0,s=e.scale||4;return{width:n,scale:n?4:s,margin:t,color:{dark:jd(e.color.dark||"#000000ff"),light:jd(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}};Ni.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale};Ni.getImageWidth=function(e,t){let n=Ni.getScale(e,t);return Math.floor((e+t.margin*2)*n)};Ni.qrToImageData=function(e,t,n){let s=t.modules.size,r=t.modules.data,o=Ni.getScale(s,n),a=Math.floor((s+n.margin*2)*o),l=n.margin*o,c=[n.color.light,n.color.dark];for(let h=0;h<a;h++)for(let u=0;u<a;u++){let d=(h*a+u)*4,p=n.color.light;if(h>=l&&u>=l&&h<a-l&&u<a-l){let g=Math.floor((h-l)/o),_=Math.floor((u-l)/o);p=c[r[g*s+_]?1:0]}e[d++]=p.r,e[d++]=p.g,e[d++]=p.b,e[d]=p.a}}});var Qd=nt(za=>{var Nc=Uc();function Zx(i,e,t){i.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=t,e.width=t,e.style.height=t+"px",e.style.width=t+"px"}function Kx(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}za.render=function(e,t,n){let s=n,r=t;typeof s>"u"&&(!t||!t.getContext)&&(s=t,t=void 0),t||(r=Kx()),s=Nc.getOptions(s);let o=Nc.getImageWidth(e.modules.size,s),a=r.getContext("2d"),l=a.createImageData(o,o);return Nc.qrToImageData(l.data,e,s),Zx(a,r,o),a.putImageData(l,0,0),r};za.renderToDataURL=function(e,t,n){let s=n;typeof s>"u"&&(!t||!t.getContext)&&(s=t,t=void 0),s||(s={});let r=za.render(e,t,s),o=s.type||"image/png",a=s.rendererOpts||{};return r.toDataURL(o,a.quality)}});var nf=nt(tf=>{var jx=Uc();function ef(i,e){let t=i.a/255,n=e+'="'+i.hex+'"';return t<1?n+" "+e+'-opacity="'+t.toFixed(2).slice(1)+'"':n}function Fc(i,e,t){let n=i+e;return typeof t<"u"&&(n+=" "+t),n}function Qx(i,e,t){let n="",s=0,r=!1,o=0;for(let a=0;a<i.length;a++){let l=Math.floor(a%e),c=Math.floor(a/e);!l&&!r&&(r=!0),i[a]?(o++,a>0&&l>0&&i[a-1]||(n+=r?Fc("M",l+t,.5+c+t):Fc("m",s,0),s=0,r=!1),l+1<e&&i[a+1]||(n+=Fc("h",o),o=0)):s++}return n}tf.render=function(e,t,n){let s=jx.getOptions(t),r=e.modules.size,o=e.modules.data,a=r+s.margin*2,l=s.color.light.a?"<path "+ef(s.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",c="<path "+ef(s.color.dark,"stroke")+' d="'+Qx(o,r,s.margin)+'"/>',h='viewBox="0 0 '+a+" "+a+'"',d='<svg xmlns="http://www.w3.org/2000/svg" '+(s.width?'width="'+s.width+'" height="'+s.width+'" ':"")+h+' shape-rendering="crispEdges">'+l+c+`</svg>
`;return typeof n=="function"&&n(null,d),d}});var rf=nt(vr=>{var e_=od(),Bc=Kd(),sf=Qd(),t_=nf();function Oc(i,e,t,n,s){let r=[].slice.call(arguments,1),o=r.length,a=typeof r[o-1]=="function";if(!a&&!e_())throw new Error("Callback required as last argument");if(a){if(o<2)throw new Error("Too few arguments provided");o===2?(s=t,t=e,e=n=void 0):o===3&&(e.getContext&&typeof s>"u"?(s=n,n=void 0):(s=n,n=t,t=e,e=void 0))}else{if(o<1)throw new Error("Too few arguments provided");return o===1?(t=e,e=n=void 0):o===2&&!e.getContext&&(n=t,t=e,e=void 0),new Promise(function(l,c){try{let h=Bc.create(t,n);l(i(h,e,n))}catch(h){c(h)}})}try{let l=Bc.create(t,n);s(null,i(l,e,n))}catch(l){s(l)}}vr.create=Bc.create;vr.toCanvas=Oc.bind(null,sf.render);vr.toDataURL=Oc.bind(null,sf.renderToDataURL);vr.toString=Oc.bind(null,function(i,e,t){return t_.render(i,t)})});var eh="data:font/woff2;base64,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";var th="data:font/woff2;base64,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";function nh(){let i=document.createElement("style");return i.textContent=`
@font-face{font-family:'Josefin Show';src:url(${eh}) format('woff2');font-weight:100 700;font-style:normal;font-display:block}
@font-face{font-family:'Josefin Show';src:url(${th}) format('woff2');font-weight:100 700;font-style:italic;font-display:block}`,document.head.append(i),document.fonts.ready}var Rh=0,Al=1,Ih=2;var Cl=1,Ph=2,Mn=3,Fn=0,wt=1,$t=2,Vn=0,Bn=1,ir=2,Rl=3,Il=4,Lh=5,ti=100,Dh=101,Uh=102,Nh=103,Fh=104,Bh=200,Oh=201,kh=202,zh=203,Kr=204,jr=205,Vh=206,Hh=207,Gh=208,Wh=209,Xh=210,qh=211,Yh=212,$h=213,Jh=214,Ao=0,Co=1,Ro=2,vi=3,Io=4,Po=5,Lo=6,Do=7,Pl=0,Zh=1,Kh=2,Hn=0,jh=1,Qh=2,eu=3,tu=4,nu=5,iu=6,su=7;var Ll=300,wi=301,Ei=302,Uo=303,No=304,sr=306,Qr=1e3,ei=1001,eo=1002,tn=1003,ru=1004;var rr=1005;var un=1006,Fo=1007;var ri=1008;var bn=1009,Dl=1010,Ul=1011,cs=1012,Bo=1013,oi=1014,Sn=1015,hs=1016,Oo=1017,ko=1018,us=1020,Nl=35902,Fl=35899,Bl=1021,Ol=1022,sn=1023,Qi=1026,ds=1027,kl=1028,zo=1029,zl=1030,Vo=1031;var Ho=1033,or=33776,ar=33777,lr=33778,cr=33779,Go=35840,Wo=35841,Xo=35842,qo=35843,Yo=36196,$o=37492,Jo=37496,Zo=37808,Ko=37809,jo=37810,Qo=37811,ea=37812,ta=37813,na=37814,ia=37815,sa=37816,ra=37817,oa=37818,aa=37819,la=37820,ca=37821,ha=36492,ua=36494,da=36495,fa=36283,pa=36284,ma=36285,ga=36286;var Fs=2300,to=2301,Zr=2302,Ml=2400,bl=2401,Sl=2402;var ou=3200,au=3201;var lu=0,cu=1,Gn="",Wt="srgb",Mi="srgb-linear",Bs="linear",et="srgb";var yi=7680;var wl=519,hu=512,uu=513,du=514,Vl=515,fu=516,pu=517,mu=518,gu=519,no=35044;var Hl="300 es",hn=2e3,Os=2001;var On=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ih=1234567,Us=Math.PI/180,es=180/Math.PI;function Un(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]).toLowerCase()}function Oe(i,e,t){return Math.max(e,Math.min(t,i))}function Gl(i,e){return(i%e+e)%e}function Uf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Nf(i,e,t){return i!==e?(t-i)/(e-i):0}function Ns(i,e,t){return(1-t)*i+t*e}function Ff(i,e,t,n){return Ns(i,e,1-Math.exp(-t*n))}function Bf(i,e=1){return e-Math.abs(Gl(i,e*2)-e)}function Of(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function kf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function zf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Vf(i,e){return i+Math.random()*(e-i)}function Hf(i){return i*(.5-Math.random())}function Gf(i){i!==void 0&&(ih=i);let e=ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wf(i){return i*Us}function Xf(i){return i*es}function qf(i){return(i&i-1)===0&&i!==0}function Yf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function $f(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Jf(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qe(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Jt={DEG2RAD:Us,RAD2DEG:es,generateUUID:Un,clamp:Oe,euclideanModulo:Gl,mapLinear:Uf,inverseLerp:Nf,lerp:Ns,damp:Ff,pingpong:Bf,smoothstep:Of,smootherstep:kf,randInt:zf,randFloat:Vf,randFloatSpread:Hf,seededRandom:Gf,degToRad:Wf,radToDeg:Xf,isPowerOfTwo:qf,ceilPowerOfTwo:Yf,floorPowerOfTwo:$f,setQuaternionFromProperEuler:Jf,normalize:Qe,denormalize:cn},$e=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Oe(this.x,e.x,t.x),this.y=Oe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Oe(this.x,e,t),this.y=Oe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},kn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==d||c!==p||h!==g){let m=1-a,f=l*d+c*p+h*g+u*_,E=f>=0?1:-1,w=1-f*f;if(w>Number.EPSILON){let C=Math.sqrt(w),A=Math.atan2(C,f*E);m=Math.sin(m*A)/C,a=Math.sin(a*A)/C}let M=a*E;if(l=l*m+d*M,c=c*m+p*M,h=h*m+g*M,u=u*m+_*M,m===1-a){let C=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=C,c*=C,h*=C,u*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-a*p,e[t+2]=c*g+h*p+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Oe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Oe(this.x,e.x,t.x),this.y=Oe(this.y,e.y,t.y),this.z=Oe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Oe(this.x,e,t),this.y=Oe(this.y,e,t),this.z=Oe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ja.copy(this).projectOnVector(e),this.sub(ja)}reflect(e){return this.sub(ja.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ja=new D,sh=new kn,ke=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],E=s[1],w=s[4],M=s[7],C=s[2],A=s[5],R=s[8];return r[0]=o*_+a*E+l*C,r[3]=o*m+a*w+l*A,r[6]=o*f+a*M+l*R,r[1]=c*_+h*E+u*C,r[4]=c*m+h*w+u*A,r[7]=c*f+h*M+u*R,r[2]=d*_+p*E+g*C,r[5]=d*m+p*w+g*A,r[8]=d*f+p*M+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,g=t*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Qa.makeScale(e,t)),this}rotate(e){return this.premultiply(Qa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Qa=new ke;function Wl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ks(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xu(){let i=ks("canvas");return i.style.display="block",i}var rh={};function ts(i){i in rh||(rh[i]=!0,console.warn(i))}function _u(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var oh=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ah=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Zf(){let i={enabled:!0,workingColorSpace:Mi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===et&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===et&&(s.r=ji(s.r),s.g=ji(s.g),s.b=ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gn?Bs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ts("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ts("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Mi]:{primaries:e,whitePoint:n,transfer:Bs,toXYZ:oh,fromXYZ:ah,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Wt},outputColorSpaceConfig:{drawingBufferColorSpace:Wt}},[Wt]:{primaries:e,whitePoint:n,transfer:et,toXYZ:oh,fromXYZ:ah,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Wt}}}),i}var Ye=Zf();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oi,io=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Oi===void 0&&(Oi=ks("canvas")),Oi.width=e.width,Oi.height=e.height;let s=Oi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Oi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ks("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Nn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Kf=0,ns=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=Un(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(el(s[o].image)):r.push(el(s[o]))}else r=el(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function el(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?io.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var jf=0,tl=new D,Xt=class i extends On{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ei,s=ei,r=un,o=ri,a=sn,l=bn,c=i.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=Un(),this.name="",this.source=new ns(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(tl).x}get height(){return this.source.getSize(tl).y}get depth(){return this.source.getSize(tl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ll)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qr:e.x=e.x-Math.floor(e.x);break;case ei:e.x=e.x<0?0:1;break;case eo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qr:e.y=e.y-Math.floor(e.y);break;case ei:e.y=e.y<0?0:1;break;case eo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Xt.DEFAULT_IMAGE=null;Xt.DEFAULT_MAPPING=Ll;Xt.DEFAULT_ANISOTROPY=1;var st=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(c+1)/2,M=(p+1)/2,C=(f+1)/2,A=(h+d)/4,R=(u+_)/4,F=(g+m)/4;return w>M&&w>C?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=A/n,r=R/n):M>C?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=A/s,r=F/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=R/r,s=F/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-_)/E,this.z=(d-h)/E,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Oe(this.x,e.x,t.x),this.y=Oe(this.y,e.y,t.y),this.z=Oe(this.z,e.z,t.z),this.w=Oe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Oe(this.x,e,t),this.y=Oe(this.y,e,t),this.z=Oe(this.z,e,t),this.w=Oe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},so=class extends On{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Xt(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:un,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ns(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},yn=class extends so{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},zs=class extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ro=class extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qt=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,on):on.fromBufferAttribute(r,o),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ar.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ar.copy(n.boundingBox)),Ar.applyMatrix4(e.matrixWorld),this.union(Ar)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rs),Cr.subVectors(this.max,Rs),ki.subVectors(e.a,Rs),zi.subVectors(e.b,Rs),Vi.subVectors(e.c,Rs),Yn.subVectors(zi,ki),$n.subVectors(Vi,zi),mi.subVectors(ki,Vi);let t=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-mi.z,mi.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,mi.z,0,-mi.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-mi.y,mi.x,0];return!nl(t,ki,zi,Vi,Cr)||(t=[1,0,0,0,1,0,0,0,1],!nl(t,ki,zi,Vi,Cr))?!1:(Rr.crossVectors(Yn,$n),t=[Rr.x,Rr.y,Rr.z],nl(t,ki,zi,Vi,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Rn=[new D,new D,new D,new D,new D,new D,new D,new D],on=new D,Ar=new qt,ki=new D,zi=new D,Vi=new D,Yn=new D,$n=new D,mi=new D,Rs=new D,Cr=new D,Rr=new D,gi=new D;function nl(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){gi.fromArray(i,r);let a=s.x*Math.abs(gi.x)+s.y*Math.abs(gi.y)+s.z*Math.abs(gi.z),l=e.dot(gi),c=t.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Qf=new qt,Is=new D,il=new D,nn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Qf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Is.subVectors(e,this.center);let t=Is.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(il.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Is.copy(e.center).add(il)),this.expandByPoint(Is.copy(e.center).sub(il))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},In=new D,sl=new D,Ir=new D,Jn=new D,rl=new D,Pr=new D,ol=new D,is=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,In)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=In.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(In.copy(this.origin).addScaledVector(this.direction,t),In.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){sl.copy(e).add(t).multiplyScalar(.5),Ir.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(sl);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Ir),a=Jn.dot(this.direction),l=-Jn.dot(Ir),c=Jn.lengthSq(),h=Math.abs(1-o*o),u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(sl).addScaledVector(Ir,d),p}intersectSphere(e,t){In.subVectors(e.center,this.origin);let n=In.dot(this.direction),s=In.dot(In)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,In)!==null}intersectTriangle(e,t,n,s,r){rl.subVectors(t,e),Pr.subVectors(n,e),ol.crossVectors(rl,Pr);let o=this.direction.dot(ol),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Jn.subVectors(this.origin,e);let l=a*this.direction.dot(Pr.crossVectors(Jn,Pr));if(l<0)return null;let c=a*this.direction.dot(rl.cross(Jn));if(c<0||l+c>o)return null;let h=-a*Jn.dot(ol);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,d,p,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,p,g,_,m)}set(e,t,n,s,r,o,a,l,c,h,u,d,p,g,_,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Hi.setFromMatrixColumn(e,0).length(),r=1/Hi.setFromMatrixColumn(e,1).length(),o=1/Hi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ep,e,tp)}lookAt(e,t,n){let s=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),Zn.crossVectors(n,Ht),Zn.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),Zn.crossVectors(n,Ht)),Zn.normalize(),Lr.crossVectors(Ht,Zn),s[0]=Zn.x,s[4]=Lr.x,s[8]=Ht.x,s[1]=Zn.y,s[5]=Lr.y,s[9]=Ht.y,s[2]=Zn.z,s[6]=Lr.z,s[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],E=n[3],w=n[7],M=n[11],C=n[15],A=s[0],R=s[4],F=s[8],b=s[12],v=s[1],I=s[5],z=s[9],q=s[13],J=s[2],K=s[6],$=s[10],j=s[14],G=s[3],se=s[7],O=s[11],W=s[15];return r[0]=o*A+a*v+l*J+c*G,r[4]=o*R+a*I+l*K+c*se,r[8]=o*F+a*z+l*$+c*O,r[12]=o*b+a*q+l*j+c*W,r[1]=h*A+u*v+d*J+p*G,r[5]=h*R+u*I+d*K+p*se,r[9]=h*F+u*z+d*$+p*O,r[13]=h*b+u*q+d*j+p*W,r[2]=g*A+_*v+m*J+f*G,r[6]=g*R+_*I+m*K+f*se,r[10]=g*F+_*z+m*$+f*O,r[14]=g*b+_*q+m*j+f*W,r[3]=E*A+w*v+M*J+C*G,r[7]=E*R+w*I+M*K+C*se,r[11]=E*F+w*z+M*$+C*O,r[15]=E*b+w*q+M*j+C*W,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*p-n*l*p)+_*(+t*l*p-t*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+t*c*u-t*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-t*l*u+t*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],E=u*m*c-_*d*c+_*l*p-a*m*p-u*l*f+a*d*f,w=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,M=h*_*c-g*u*c+g*a*p-o*_*p-h*a*f+o*u*f,C=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,A=t*E+n*w+s*M+r*C;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/A;return e[0]=E*R,e[1]=(_*d*r-u*m*r-_*s*p+n*m*p+u*s*f-n*d*f)*R,e[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*f+n*l*f)*R,e[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*p-n*l*p)*R,e[4]=w*R,e[5]=(h*m*r-g*d*r+g*s*p-t*m*p-h*s*f+t*d*f)*R,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*f-t*l*f)*R,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*p+t*l*p)*R,e[8]=M*R,e[9]=(g*u*r-h*_*r-g*n*p+t*_*p+h*n*f-t*u*f)*R,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*f+t*a*f)*R,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*p-t*a*p)*R,e[12]=C*R,e[13]=(h*_*s-g*u*s+g*n*d-t*_*d-h*n*m+t*u*m)*R,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*m-t*a*m)*R,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*d+t*a*d)*R,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,g=r*u,_=o*h,m=o*u,f=a*u,E=l*c,w=l*h,M=l*u,C=n.x,A=n.y,R=n.z;return s[0]=(1-(_+f))*C,s[1]=(p+M)*C,s[2]=(g-w)*C,s[3]=0,s[4]=(p-M)*A,s[5]=(1-(d+f))*A,s[6]=(m+E)*A,s[7]=0,s[8]=(g+w)*R,s[9]=(m-E)*R,s[10]=(1-(d+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Hi.set(s[0],s[1],s[2]).length(),o=Hi.set(s[4],s[5],s[6]).length(),a=Hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],an.copy(this);let c=1/r,h=1/o,u=1/a;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=u,an.elements[9]*=u,an.elements[10]*=u,t.setFromRotationMatrix(an),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=hn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===hn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Os)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=hn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===hn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Os)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Hi=new D,an=new dt,ep=new D(0,0,0),tp=new D(1,1,1),Zn=new D,Lr=new D,Ht=new D,lh=new dt,ch=new kn,vn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Oe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Oe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Oe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Oe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return lh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(lh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ch.setFromEuler(this),this.setFromQuaternion(ch,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};vn.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},np=0,hh=new D,Gi=new kn,Pn=new dt,Dr=new D,Ps=new D,ip=new D,sp=new kn,uh=new D(1,0,0),dh=new D(0,1,0),fh=new D(0,0,1),ph={type:"added"},rp={type:"removed"},Wi={type:"childadded",child:null},al={type:"childremoved",child:null},Ot=class i extends On{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new vn,n=new kn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new ke}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.premultiply(Gi),this}rotateX(e){return this.rotateOnAxis(uh,e)}rotateY(e){return this.rotateOnAxis(dh,e)}rotateZ(e){return this.rotateOnAxis(fh,e)}translateOnAxis(e,t){return hh.copy(e).applyQuaternion(this.quaternion),this.position.add(hh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(uh,e)}translateY(e){return this.translateOnAxis(dh,e)}translateZ(e){return this.translateOnAxis(fh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Dr.copy(e):Dr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(Ps,Dr,this.up):Pn.lookAt(Dr,Ps,this.up),this.quaternion.setFromRotationMatrix(Pn),s&&(Pn.extractRotation(s.matrixWorld),Gi.setFromRotationMatrix(Pn),this.quaternion.premultiply(Gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ph),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rp),al.child=e,this.dispatchEvent(al),al.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ph),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,e,ip),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,sp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Ot.DEFAULT_UP=new D(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ln=new D,Ln=new D,ll=new D,Dn=new D,Xi=new D,qi=new D,mh=new D,cl=new D,hl=new D,ul=new D,dl=new st,fl=new st,pl=new st,Qn=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ln.subVectors(e,t),s.cross(ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ln.subVectors(s,t),Ln.subVectors(n,t),ll.subVectors(e,t);let o=ln.dot(ln),a=ln.dot(Ln),l=ln.dot(ll),c=Ln.dot(Ln),h=Ln.dot(ll),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Dn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Dn.x),l.addScaledVector(o,Dn.y),l.addScaledVector(a,Dn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return dl.setScalar(0),fl.setScalar(0),pl.setScalar(0),dl.fromBufferAttribute(e,t),fl.fromBufferAttribute(e,n),pl.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(dl,r.x),o.addScaledVector(fl,r.y),o.addScaledVector(pl,r.z),o}static isFrontFacing(e,t,n,s){return ln.subVectors(n,t),Ln.subVectors(e,t),ln.cross(Ln).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),ln.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Xi.subVectors(s,n),qi.subVectors(r,n),cl.subVectors(e,n);let l=Xi.dot(cl),c=qi.dot(cl);if(l<=0&&c<=0)return t.copy(n);hl.subVectors(e,s);let h=Xi.dot(hl),u=qi.dot(hl);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Xi,o);ul.subVectors(e,r);let p=Xi.dot(ul),g=qi.dot(ul);if(g>=0&&p<=g)return t.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(qi,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return mh.subVectors(r,s),a=(u-h)/(u-h+(p-g)),t.copy(s).addScaledVector(mh,a);let f=1/(m+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(Xi,o).addScaledVector(qi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},Ur={h:0,s:0,l:0};function ml(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var We=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=Gl(e,1),t=Oe(t,0,1),n=Oe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ml(o,r,e+1/3),this.g=ml(o,r,e),this.b=ml(o,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=Wt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wt){let n=yu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wt){return Ye.workingToColorSpace(It.copy(this),e),Math.round(Oe(It.r*255,0,255))*65536+Math.round(Oe(It.g*255,0,255))*256+Math.round(Oe(It.b*255,0,255))}getHexString(e=Wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(It.copy(this),t);let n=It.r,s=It.g,r=It.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=Wt){Ye.workingToColorSpace(It.copy(this),e);let t=It.r,n=It.g,s=It.b;return e!==Wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(Ur);let n=Ns(Kn.h,Ur.h,t),s=Ns(Kn.s,Ur.s,t),r=Ns(Kn.l,Ur.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},It=new We;We.NAMES=yu;var op=0,zn=class extends On{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:op++}),this.uuid=Un(),this.name="",this.type="Material",this.blending=Bn,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kr,this.blendDst=jr,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=yi,this.stencilZFail=yi,this.stencilZPass=yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bn&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Kr&&(n.blendSrc=this.blendSrc),this.blendDst!==jr&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},dn=class extends zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var gt=new D,Nr=new $e,ap=0,Bt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ap++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=no,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix3(e),this.setXY(t,Nr.x,Nr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Qe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=cn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=cn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=cn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=cn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array),r=Qe(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==no&&(e.usage=this.usage),e}};var Hs=class extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Gs=class extends Bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var it=class extends Bt{constructor(e,t,n){super(new Float32Array(e),t,n)}},lp=0,Qt=new dt,gl=new Ot,Yi=new D,Gt=new qt,Ls=new qt,Mt=new D,bt=class i extends On{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wl(e)?Gs:Hs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return gl.lookAt(e),gl.updateMatrix(),this.applyMatrix4(gl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new it(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(Mt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Mt),Mt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Mt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Ls.setFromBufferAttribute(a),this.morphTargetsRelative?(Mt.addVectors(Gt.min,Ls.min),Gt.expandByPoint(Mt),Mt.addVectors(Gt.max,Ls.max),Gt.expandByPoint(Mt)):(Gt.expandByPoint(Ls.min),Gt.expandByPoint(Ls.max))}Gt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Mt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Mt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Mt.fromBufferAttribute(a,c),l&&(Yi.fromBufferAttribute(e,c),Mt.add(Yi)),s=Math.max(s,n.distanceToSquared(Mt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let F=0;F<n.count;F++)a[F]=new D,l[F]=new D;let c=new D,h=new D,u=new D,d=new $e,p=new $e,g=new $e,_=new D,m=new D;function f(F,b,v){c.fromBufferAttribute(n,F),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,F),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),p.sub(d),g.sub(d);let I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(I),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(I),a[F].add(_),a[b].add(_),a[v].add(_),l[F].add(m),l[b].add(m),l[v].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let F=0,b=E.length;F<b;++F){let v=E[F],I=v.start,z=v.count;for(let q=I,J=I+z;q<J;q+=3)f(e.getX(q+0),e.getX(q+1),e.getX(q+2))}let w=new D,M=new D,C=new D,A=new D;function R(F){C.fromBufferAttribute(s,F),A.copy(C);let b=a[F];w.copy(b),w.sub(C.multiplyScalar(C.dot(b))).normalize(),M.crossVectors(A,b);let I=M.dot(l[F])<0?-1:1;o.setXYZW(F,w.x,w.y,w.z,I)}for(let F=0,b=E.length;F<b;++F){let v=E[F],I=v.start,z=v.count;for(let q=I,J=I+z;q<J;q+=3)R(e.getX(q+0)),R(e.getX(q+1)),R(e.getX(q+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mt.fromBufferAttribute(e,t),Mt.normalize(),e.setXYZ(t,Mt.x,Mt.y,Mt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Bt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gh=new dt,xi=new is,Fr=new nn,xh=new D,Br=new D,Or=new D,kr=new D,xl=new D,zr=new D,_h=new D,Vr=new D,pt=class extends Ot{constructor(e=new bt,t=new dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){zr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(xl.fromBufferAttribute(u,e),o?zr.addScaledVector(xl,h):zr.addScaledVector(xl.sub(t),h))}t.add(zr)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fr.copy(n.boundingSphere),Fr.applyMatrix4(r),xi.copy(e.ray).recast(e.near),!(Fr.containsPoint(xi.origin)===!1&&(xi.intersectSphere(Fr,xh)===null||xi.origin.distanceToSquared(xh)>(e.far-e.near)**2))&&(gh.copy(r).invert(),xi.copy(e.ray).applyMatrix4(gh),!(n.boundingBox!==null&&xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,xi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),w=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=E,C=w;M<C;M+=3){let A=a.getX(M),R=a.getX(M+1),F=a.getX(M+2);s=Hr(this,f,e,n,c,h,u,A,R,F),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let E=a.getX(m),w=a.getX(m+1),M=a.getX(m+2);s=Hr(this,o,e,n,c,h,u,E,w,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),w=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=E,C=w;M<C;M+=3){let A=M,R=M+1,F=M+2;s=Hr(this,f,e,n,c,h,u,A,R,F),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let E=m,w=m+1,M=m+2;s=Hr(this,o,e,n,c,h,u,E,w,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function cp(i,e,t,n,s,r,o,a){let l;if(e.side===wt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Fn,a),l===null)return null;Vr.copy(a),Vr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Vr);return c<t.near||c>t.far?null:{distance:c,point:Vr.clone(),object:i}}function Hr(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Br),i.getVertexPosition(l,Or),i.getVertexPosition(c,kr);let h=cp(i,e,t,n,Br,Or,kr,_h);if(h){let u=new D;Qn.getBarycoord(_h,Br,Or,kr,u),s&&(h.uv=Qn.getInterpolatedAttribute(s,a,l,c,u,new $e)),r&&(h.uv1=Qn.getInterpolatedAttribute(r,a,l,c,u,new $e)),o&&(h.normal=Qn.getInterpolatedAttribute(o,a,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new D,materialIndex:0};Qn.getNormal(Br,Or,kr,d.normal),h.face=d,h.barycoord=u}return h}var ss=class i extends bt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2));function g(_,m,f,E,w,M,C,A,R,F,b){let v=M/R,I=C/F,z=M/2,q=C/2,J=A/2,K=R+1,$=F+1,j=0,G=0,se=new D;for(let O=0;O<$;O++){let W=O*I-q;for(let ne=0;ne<K;ne++){let Ue=ne*v-z;se[_]=Ue*E,se[m]=W*w,se[f]=J,c.push(se.x,se.y,se.z),se[_]=0,se[m]=0,se[f]=A>0?1:-1,h.push(se.x,se.y,se.z),u.push(ne/R),u.push(1-O/F),j+=1}}for(let O=0;O<F;O++)for(let W=0;W<R;W++){let ne=d+W+K*O,Ue=d+W+K*(O+1),xe=d+(W+1)+K*(O+1),Ae=d+(W+1)+K*O;l.push(ne,Ue,Ae),l.push(Ue,xe,Ae),G+=6}a.addGroup(p,G,b),p+=G,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ti(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Lt(i){let e={};for(let t=0;t<i.length;t++){let n=Ti(i[t]);for(let s in n)e[s]=n[s]}return e}function hp(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Xl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}var hr={clone:Ti,merge:Lt},up=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,St=class extends zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=up,this.fragmentShader=dp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ti(e.uniforms),this.uniformsGroups=hp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ws=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},jn=new D,yh=new $e,vh=new $e,Pt=class extends Ws{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=es*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return es*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,t){return this.getViewBounds(e,yh,vh),t.subVectors(vh,yh)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Us*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$i=-90,Ji=1,oo=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Pt($i,Ji,e,t);s.layers=this.layers,this.add(s);let r=new Pt($i,Ji,e,t);r.layers=this.layers,this.add(r);let o=new Pt($i,Ji,e,t);o.layers=this.layers,this.add(o);let a=new Pt($i,Ji,e,t);a.layers=this.layers,this.add(a);let l=new Pt($i,Ji,e,t);l.layers=this.layers,this.add(l);let c=new Pt($i,Ji,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===hn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Os)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Xs=class extends Xt{constructor(e=[],t=wi,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ao=class extends yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Xs(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ss(5,5,5),r=new St({name:"CubemapFromEquirect",uniforms:Ti(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:wt,blending:Vn});r.uniforms.tEquirect.value=t;let o=new pt(s,r),a=t.minFilter;return t.minFilter===ri&&(t.minFilter=un),new oo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},en=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},fp={type:"move"},rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new en,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new en,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new en,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(fp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new en;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var qs=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},lo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=no,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ut=new D,fn=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Qe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=cn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=cn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=cn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=cn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array),r=Qe(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var _l=new D,pp=new D,mp=new ke,_n=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=_l.subVectors(n,t).cross(pp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(_l),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||mp.getNormalMatrix(e),s=this.coplanarPoint(_l).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},_i=new nn,gp=new $e(.5,.5),Gr=new D,Ys=class{constructor(e=new _n,t=new _n,n=new _n,s=new _n,r=new _n,o=new _n){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=hn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],g=r[8],_=r[9],m=r[10],f=r[11],E=r[12],w=r[13],M=r[14],C=r[15];if(s[0].setComponents(c-o,p-h,f-g,C-E).normalize(),s[1].setComponents(c+o,p+h,f+g,C+E).normalize(),s[2].setComponents(c+a,p+u,f+_,C+w).normalize(),s[3].setComponents(c-a,p-u,f-_,C-w).normalize(),n)s[4].setComponents(l,d,m,M).normalize(),s[5].setComponents(c-l,p-d,f-m,C-M).normalize();else if(s[4].setComponents(c-l,p-d,f-m,C-M).normalize(),t===hn)s[5].setComponents(c+l,p+d,f+m,C+M).normalize();else if(t===Os)s[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(e){_i.center.set(0,0,0);let t=gp.distanceTo(e.center);return _i.radius=.7071067811865476+t,_i.applyMatrix4(e.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Gr.x=s.normal.x>0?e.max.x:e.min.x,Gr.y=s.normal.y>0?e.max.y:e.min.y,Gr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Gr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var os=class extends zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},co=new D,ho=new D,Mh=new dt,Ds=new is,Wr=new nn,yl=new D,bh=new D,uo=class extends Ot{constructor(e=new bt,t=new os){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)co.fromBufferAttribute(t,s-1),ho.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=co.distanceTo(ho);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(s),Wr.radius+=r,e.ray.intersectsSphere(Wr)===!1)return;Mh.copy(s).invert(),Ds.copy(e.ray).applyMatrix4(Mh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){let f=h.getX(_),E=h.getX(_+1),w=Xr(this,e,Ds,l,f,E,_);w&&t.push(w)}if(this.isLineLoop){let _=h.getX(g-1),m=h.getX(p),f=Xr(this,e,Ds,l,_,m,g-1);f&&t.push(f)}}else{let p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){let f=Xr(this,e,Ds,l,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){let _=Xr(this,e,Ds,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Xr(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(co.fromBufferAttribute(a,s),ho.fromBufferAttribute(a,r),t.distanceSqToSegment(co,ho,yl,bh)>n)return;yl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(yl);if(!(c<e.near||c>e.far))return{distance:c,point:bh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Sh=new D,wh=new D,$s=class extends uo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Sh.fromBufferAttribute(t,s),wh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Sh.distanceTo(wh);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var fo=class extends zn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Eh=new dt,El=new is,qr=new nn,Yr=new D,Js=class extends Ot{constructor(e=new bt,t=new fo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;Eh.copy(s).invert(),El.copy(e.ray).applyMatrix4(Eh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=d,_=p;g<_;g++){let m=c.getX(g);Yr.fromBufferAttribute(u,m),Th(Yr,m,l,s,e,t,this)}}else{let d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,_=p;g<_;g++)Yr.fromBufferAttribute(u,g),Th(Yr,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Th(i,e,t,n,s,r,o){let a=El.distanceSqToPoint(i);if(a<t){let l=new D;El.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Zs=class extends Xt{constructor(e,t,n=oi,s,r,o,a=tn,l=tn,c,h=Qi,u=1){if(h!==Qi&&h!==ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ns(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ks=class extends Xt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var as=class i extends bt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new D,h=new $e;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(a,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}};var js=class i extends bt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let E=f*d-o;for(let w=0;w<c;w++){let M=w*u-r;g.push(M,-E,0),_.push(0,0,1),m.push(w/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<a;E++){let w=E+c*f,M=E+c*(f+1),C=E+1+c*(f+1),A=E+1+c*f;p.push(w,M,A),p.push(M,C,A)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(_,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ls=class i extends bt{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=e,d=(t-e)/s,p=new D,g=new $e;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){let f=r+m/n*o;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){let m=_*(n+1);for(let f=0;f<n;f++){let E=f+m,w=E,M=E+n+1,C=E+n+2,A=E+1;a.push(w,M,A),a.push(M,C,A)}}this.setIndex(a),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var bi=class i extends bt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new D,d=new D,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){let E=[],w=f/n,M=0;f===0&&o===0?M=.5/t:f===n&&l===Math.PI&&(M=-.5/t);for(let C=0;C<=t;C++){let A=C/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+w*a),u.y=e*Math.cos(o+w*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+w*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+M,1-w),E.push(c++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){let w=h[f][E+1],M=h[f][E],C=h[f+1][E],A=h[f+1][E+1];(f!==0||o>0)&&p.push(w,M,A),(f!==n-1||l<Math.PI)&&p.push(M,C,A)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(_,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Qs=class extends bt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,s=new D,r=new D;if(e.index!==null){let o=e.attributes.position,a=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start,p=u.count;for(let g=d,_=d+p;g<_;g+=3)for(let m=0;m<3;m++){let f=a.getX(g+m),E=a.getX(g+(m+1)%3);s.fromBufferAttribute(o,f),r.fromBufferAttribute(o,E),Ah(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}}else{let o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,u=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,u),Ah(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new it(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Ah(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(s)===!0?!1:(t.add(n),t.add(s),!0)}var po=class extends zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ou,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},mo=class extends zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function $r(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function xp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Si=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},go=class extends Si{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ml,endingEnd:Ml}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case bl:r=e,a=2*t-n;break;case Sl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case bl:o=e,l=2*n-t;break;case Sl:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,E=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,w=(-1-p)*m+(1.5+p)*_+.5*g,M=p*m-p*_;for(let C=0;C!==a;++C)r[C]=f*o[h+C]+E*o[c+C]+w*o[l+C]+M*o[u+C];return r}},xo=class extends Si{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},_o=class extends Si{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Yt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=$r(t,this.TimeBufferType),this.values=$r(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:$r(e.times,Array),values:$r(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _o(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new xo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new go(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Fs:t=this.InterpolantFactoryMethodDiscrete;break;case to:t=this.InterpolantFactoryMethodLinear;break;case Zr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fs;case this.InterpolantFactoryMethodLinear:return to;case this.InterpolantFactoryMethodSmooth:return Zr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&xp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Zr,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let _=t[u+g];if(_!==t[d+g]||_!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Yt.prototype.ValueTypeName="";Yt.prototype.TimeBufferType=Float32Array;Yt.prototype.ValueBufferType=Float32Array;Yt.prototype.DefaultInterpolation=to;var ni=class extends Yt{constructor(e,t,n){super(e,t,n)}};ni.prototype.ValueTypeName="bool";ni.prototype.ValueBufferType=Array;ni.prototype.DefaultInterpolation=Fs;ni.prototype.InterpolantFactoryMethodLinear=void 0;ni.prototype.InterpolantFactoryMethodSmooth=void 0;var yo=class extends Yt{constructor(e,t,n,s){super(e,t,n,s)}};yo.prototype.ValueTypeName="color";var vo=class extends Yt{constructor(e,t,n,s){super(e,t,n,s)}};vo.prototype.ValueTypeName="number";var Mo=class extends Si{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)kn.slerpFlat(r,0,o,c-a,o,c,l);return r}},er=class extends Yt{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Mo(this.times,this.values,this.getValueSize(),e)}};er.prototype.ValueTypeName="quaternion";er.prototype.InterpolantFactoryMethodSmooth=void 0;var ii=class extends Yt{constructor(e,t,n){super(e,t,n)}};ii.prototype.ValueTypeName="string";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=Fs;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var bo=class extends Yt{constructor(e,t,n,s){super(e,t,n,s)}};bo.prototype.ValueTypeName="vector";var So=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},vu=new So,wo=class{constructor(e){this.manager=e!==void 0?e:vu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};wo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Eo=class extends Ws{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var tr=class extends bt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var To=class extends Pt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var ql="\\[\\]\\.:\\/",_p=new RegExp("["+ql+"]","g"),Yl="[^"+ql+"]",yp="[^"+ql.replace("\\.","")+"]",vp=/((?:WC+[\/:])*)/.source.replace("WC",Yl),Mp=/(WCOD+)?/.source.replace("WCOD",yp),bp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yl),Sp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yl),wp=new RegExp("^"+vp+Mp+bp+Sp+"$"),Ep=["material","materials","bones","map"],Tl=class{constructor(e,t,n){let s=n||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(_p,"")}static parseTrackName(e){let t=wp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ep.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ct.Composite=Tl;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var A_=new Float32Array(1);var si=class extends lo{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var Ch=new D,Jr=new D,Zi=new D,Ki=new D,vl=new D,Tp=new D,Ap=new D,nr=class{constructor(e=new D,t=new D){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Ch.subVectors(e,this.start),Jr.subVectors(this.end,this.start);let n=Jr.dot(Jr),r=Jr.dot(Ch)/n;return t&&(r=Oe(r,0,1)),r}closestPointToPoint(e,t,n){let s=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(e,t=Tp,n=Ap){let s=10000000000000001e-32,r,o,a=this.start,l=e.start,c=this.end,h=e.end;Zi.subVectors(c,a),Ki.subVectors(h,l),vl.subVectors(a,l);let u=Zi.dot(Zi),d=Ki.dot(Ki),p=Ki.dot(vl);if(u<=s&&d<=s)return t.copy(a),n.copy(l),t.sub(n),t.dot(t);if(u<=s)r=0,o=p/d,o=Oe(o,0,1);else{let g=Zi.dot(vl);if(d<=s)o=0,r=Oe(-g/u,0,1);else{let _=Zi.dot(Ki),m=u*d-_*_;m!==0?r=Oe((_*p-g*d)/m,0,1):r=0,o=(_*r+p)/d,o<0?(o=0,r=Oe(-g/u,0,1)):o>1&&(o=1,r=Oe((_-g)/u,0,1))}}return t.copy(a).add(Zi.multiplyScalar(r)),n.copy(l).add(Ki.multiplyScalar(o)),t.sub(n),t.dot(t)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function $l(i,e,t,n){let s=Cp(n);switch(t){case Bl:return i*e;case kl:return i*e/s.components*s.byteLength;case zo:return i*e/s.components*s.byteLength;case zl:return i*e*2/s.components*s.byteLength;case Vo:return i*e*2/s.components*s.byteLength;case Ol:return i*e*3/s.components*s.byteLength;case sn:return i*e*4/s.components*s.byteLength;case Ho:return i*e*4/s.components*s.byteLength;case or:case ar:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case lr:case cr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wo:case qo:return Math.max(i,16)*Math.max(e,8)/4;case Go:case Xo:return Math.max(i,8)*Math.max(e,8)/2;case Yo:case $o:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ko:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case jo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Qo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ea:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ta:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case na:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ia:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case sa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ra:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case oa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case la:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ca:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ha:case ua:case da:return Math.ceil(i/4)*Math.ceil(e/4)*16;case fa:case pa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ma:case ga:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Cp(i){switch(i){case bn:case Dl:return{byteLength:1,components:1};case cs:case Ul:case hs:return{byteLength:2,components:1};case Oo:case ko:return{byteLength:2,components:4};case oi:case Bo:case Sn:return{byteLength:4,components:1};case Nl:case Fl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Wu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ip(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Dp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Up=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Np=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Op=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Wp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Xp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Qp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,em=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,nm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,im=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,om=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,am="gl_FragColor = linearToOutputTexel( gl_FragColor );",lm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,hm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,um=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,pm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_m=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ym=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Sm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Em=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Am=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Im=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Lm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Um=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Om=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,km=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,zm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$m=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,eg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ng=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ig=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,og=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ag=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ug=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,fg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,_g=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,vg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,wg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Eg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ig=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ng=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Og=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$g=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Jg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Kg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,t0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,l0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:Pp,alphahash_pars_fragment:Lp,alphamap_fragment:Dp,alphamap_pars_fragment:Up,alphatest_fragment:Np,alphatest_pars_fragment:Fp,aomap_fragment:Bp,aomap_pars_fragment:Op,batching_pars_vertex:kp,batching_vertex:zp,begin_vertex:Vp,beginnormal_vertex:Hp,bsdfs:Gp,iridescence_fragment:Wp,bumpmap_pars_fragment:Xp,clipping_planes_fragment:qp,clipping_planes_pars_fragment:Yp,clipping_planes_pars_vertex:$p,clipping_planes_vertex:Jp,color_fragment:Zp,color_pars_fragment:Kp,color_pars_vertex:jp,color_vertex:Qp,common:em,cube_uv_reflection_fragment:tm,defaultnormal_vertex:nm,displacementmap_pars_vertex:im,displacementmap_vertex:sm,emissivemap_fragment:rm,emissivemap_pars_fragment:om,colorspace_fragment:am,colorspace_pars_fragment:lm,envmap_fragment:cm,envmap_common_pars_fragment:hm,envmap_pars_fragment:um,envmap_pars_vertex:dm,envmap_physical_pars_fragment:Sm,envmap_vertex:fm,fog_vertex:pm,fog_pars_vertex:mm,fog_fragment:gm,fog_pars_fragment:xm,gradientmap_pars_fragment:_m,lightmap_pars_fragment:ym,lights_lambert_fragment:vm,lights_lambert_pars_fragment:Mm,lights_pars_begin:bm,lights_toon_fragment:wm,lights_toon_pars_fragment:Em,lights_phong_fragment:Tm,lights_phong_pars_fragment:Am,lights_physical_fragment:Cm,lights_physical_pars_fragment:Rm,lights_fragment_begin:Im,lights_fragment_maps:Pm,lights_fragment_end:Lm,logdepthbuf_fragment:Dm,logdepthbuf_pars_fragment:Um,logdepthbuf_pars_vertex:Nm,logdepthbuf_vertex:Fm,map_fragment:Bm,map_pars_fragment:Om,map_particle_fragment:km,map_particle_pars_fragment:zm,metalnessmap_fragment:Vm,metalnessmap_pars_fragment:Hm,morphinstance_vertex:Gm,morphcolor_vertex:Wm,morphnormal_vertex:Xm,morphtarget_pars_vertex:qm,morphtarget_vertex:Ym,normal_fragment_begin:$m,normal_fragment_maps:Jm,normal_pars_fragment:Zm,normal_pars_vertex:Km,normal_vertex:jm,normalmap_pars_fragment:Qm,clearcoat_normal_fragment_begin:eg,clearcoat_normal_fragment_maps:tg,clearcoat_pars_fragment:ng,iridescence_pars_fragment:ig,opaque_fragment:sg,packing:rg,premultiplied_alpha_fragment:og,project_vertex:ag,dithering_fragment:lg,dithering_pars_fragment:cg,roughnessmap_fragment:hg,roughnessmap_pars_fragment:ug,shadowmap_pars_fragment:dg,shadowmap_pars_vertex:fg,shadowmap_vertex:pg,shadowmask_pars_fragment:mg,skinbase_vertex:gg,skinning_pars_vertex:xg,skinning_vertex:_g,skinnormal_vertex:yg,specularmap_fragment:vg,specularmap_pars_fragment:Mg,tonemapping_fragment:bg,tonemapping_pars_fragment:Sg,transmission_fragment:wg,transmission_pars_fragment:Eg,uv_pars_fragment:Tg,uv_pars_vertex:Ag,uv_vertex:Cg,worldpos_vertex:Rg,background_vert:Ig,background_frag:Pg,backgroundCube_vert:Lg,backgroundCube_frag:Dg,cube_vert:Ug,cube_frag:Ng,depth_vert:Fg,depth_frag:Bg,distanceRGBA_vert:Og,distanceRGBA_frag:kg,equirect_vert:zg,equirect_frag:Vg,linedashed_vert:Hg,linedashed_frag:Gg,meshbasic_vert:Wg,meshbasic_frag:Xg,meshlambert_vert:qg,meshlambert_frag:Yg,meshmatcap_vert:$g,meshmatcap_frag:Jg,meshnormal_vert:Zg,meshnormal_frag:Kg,meshphong_vert:jg,meshphong_frag:Qg,meshphysical_vert:e0,meshphysical_frag:t0,meshtoon_vert:n0,meshtoon_frag:i0,points_vert:s0,points_frag:r0,shadow_vert:o0,shadow_frag:a0,sprite_vert:l0,sprite_frag:c0},ce={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Nt={basic:{uniforms:Lt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Lt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new We(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Lt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Lt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Lt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new We(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Lt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Lt([ce.points,ce.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Lt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Lt([ce.common,ce.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Lt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Lt([ce.sprite,ce.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:Lt([ce.common,ce.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:Lt([ce.lights,ce.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};Nt.physical={uniforms:Lt([Nt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};var xa={r:0,b:0,g:0},Ai=new vn,h0=new dt;function u0(i,e,t,n,s,r,o){let a=new We(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?t:e).get(M)),M}function _(w){let M=!1,C=g(w);C===null?f(a,l):C&&C.isColor&&(f(C,1),M=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,M){let C=g(M);C&&(C.isCubeTexture||C.mapping===sr)?(h===void 0&&(h=new pt(new ss(1,1,1),new St({name:"BackgroundCubeMaterial",uniforms:Ti(Nt.backgroundCube.uniforms),vertexShader:Nt.backgroundCube.vertexShader,fragmentShader:Nt.backgroundCube.fragmentShader,side:wt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ai.copy(M.backgroundRotation),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(h0.makeRotationFromEuler(Ai)),h.material.toneMapped=Ye.getTransfer(C.colorSpace)!==et,(u!==C||d!==C.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=C,d=C.version,p=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new pt(new js(2,2),new St({name:"BackgroundMaterial",uniforms:Ti(Nt.background.uniforms),vertexShader:Nt.background.vertexShader,fragmentShader:Nt.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(C.colorSpace)!==et,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||d!==C.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=C,d=C.version,p=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function f(w,M){w.getRGB(xa,Xl(i)),n.buffers.color.setClear(xa.r,xa.g,xa.b,M,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,M=1){a.set(w),l=M,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,f(a,l)},render:_,addToRenderList:m,dispose:E}}function d0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(v,I,z,q,J){let K=!1,$=u(q,z,I);r!==$&&(r=$,c(r.object)),K=p(v,q,z,J),K&&g(v,q,z,J),J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,M(v,I,z,q),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,I,z){let q=z.wireframe===!0,J=n[v.id];J===void 0&&(J={},n[v.id]=J);let K=J[I.id];K===void 0&&(K={},J[I.id]=K);let $=K[q];return $===void 0&&($=d(l()),K[q]=$),$}function d(v){let I=[],z=[],q=[];for(let J=0;J<t;J++)I[J]=0,z[J]=0,q[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:z,attributeDivisors:q,object:v,attributes:{},index:null}}function p(v,I,z,q){let J=r.attributes,K=I.attributes,$=0,j=z.getAttributes();for(let G in j)if(j[G].location>=0){let O=J[G],W=K[G];if(W===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(W=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(W=v.instanceColor)),O===void 0||O.attribute!==W||W&&O.data!==W.data)return!0;$++}return r.attributesNum!==$||r.index!==q}function g(v,I,z,q){let J={},K=I.attributes,$=0,j=z.getAttributes();for(let G in j)if(j[G].location>=0){let O=K[G];O===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(O=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(O=v.instanceColor));let W={};W.attribute=O,O&&O.data&&(W.data=O.data),J[G]=W,$++}r.attributes=J,r.attributesNum=$,r.index=q}function _(){let v=r.newAttributes;for(let I=0,z=v.length;I<z;I++)v[I]=0}function m(v){f(v,0)}function f(v,I){let z=r.newAttributes,q=r.enabledAttributes,J=r.attributeDivisors;z[v]=1,q[v]===0&&(i.enableVertexAttribArray(v),q[v]=1),J[v]!==I&&(i.vertexAttribDivisor(v,I),J[v]=I)}function E(){let v=r.newAttributes,I=r.enabledAttributes;for(let z=0,q=I.length;z<q;z++)I[z]!==v[z]&&(i.disableVertexAttribArray(z),I[z]=0)}function w(v,I,z,q,J,K,$){$===!0?i.vertexAttribIPointer(v,I,z,J,K):i.vertexAttribPointer(v,I,z,q,J,K)}function M(v,I,z,q){_();let J=q.attributes,K=z.getAttributes(),$=I.defaultAttributeValues;for(let j in K){let G=K[j];if(G.location>=0){let se=J[j];if(se===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(se=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(se=v.instanceColor)),se!==void 0){let O=se.normalized,W=se.itemSize,ne=e.get(se);if(ne===void 0)continue;let Ue=ne.buffer,xe=ne.type,Ae=ne.bytesPerElement,V=xe===i.INT||xe===i.UNSIGNED_INT||se.gpuType===Bo;if(se.isInterleavedBufferAttribute){let k=se.data,ee=k.stride,ue=se.offset;if(k.isInstancedInterleavedBuffer){for(let de=0;de<G.locationSize;de++)f(G.location+de,k.meshPerAttribute);v.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let de=0;de<G.locationSize;de++)m(G.location+de);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let de=0;de<G.locationSize;de++)w(G.location+de,W/G.locationSize,xe,O,ee*Ae,(ue+W/G.locationSize*de)*Ae,V)}else{if(se.isInstancedBufferAttribute){for(let k=0;k<G.locationSize;k++)f(G.location+k,se.meshPerAttribute);v.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let k=0;k<G.locationSize;k++)m(G.location+k);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let k=0;k<G.locationSize;k++)w(G.location+k,W/G.locationSize,xe,O,W*Ae,W/G.locationSize*k*Ae,V)}}else if($!==void 0){let O=$[j];if(O!==void 0)switch(O.length){case 2:i.vertexAttrib2fv(G.location,O);break;case 3:i.vertexAttrib3fv(G.location,O);break;case 4:i.vertexAttrib4fv(G.location,O);break;default:i.vertexAttrib1fv(G.location,O)}}}}E()}function C(){F();for(let v in n){let I=n[v];for(let z in I){let q=I[z];for(let J in q)h(q[J].object),delete q[J];delete I[z]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;let I=n[v.id];for(let z in I){let q=I[z];for(let J in q)h(q[J].object),delete q[J];delete I[z]}delete n[v.id]}function R(v){for(let I in n){let z=n[I];if(z[v.id]===void 0)continue;let q=z[v.id];for(let J in q)h(q[J].object),delete q[J];delete z[v.id]}}function F(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:F,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function f0(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function l(c,h,u,d){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function p0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==sn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let F=R===hs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Sn&&!F)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:C,maxSamples:A}}function m0(i){let e=this,t=null,n=0,s=!1,r=!1,o=new _n,a=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let E=r?0:n,w=E*4,M=f.clippingState||null;l.value=M,M=h(g,d,w,p);for(let C=0;C!==w;++C)M[C]=t[C];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let f=p+_*4,E=d.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let w=0,M=p;w!==_;++w,M+=4)o.copy(u[w]).applyMatrix4(E,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function g0(i){let e=new WeakMap;function t(o,a){return a===Uo?o.mapping=wi:a===No&&(o.mapping=Ei),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Uo||a===No)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new ao(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var ps=4,Mu=[.125,.215,.35,.446,.526,.582],Ii=20,Jl=new Eo,bu=new We,Zl=null,Kl=0,jl=0,Ql=!1,Ri=(1+Math.sqrt(5))/2,fs=1/Ri,Su=[new D(-Ri,fs,0),new D(Ri,fs,0),new D(-fs,0,Ri),new D(fs,0,Ri),new D(0,Ri,-fs),new D(0,Ri,fs),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],x0=new D,va=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=x0}=r;Zl=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),jl=this._renderer.getActiveMipmapLevel(),Ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zl,Kl,jl),this._renderer.xr.enabled=Ql,e.scissorTest=!1,_a(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wi||e.mapping===Ei?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zl=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),jl=this._renderer.getActiveMipmapLevel(),Ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:un,minFilter:un,generateMipmaps:!1,type:hs,format:sn,colorSpace:Mi,depthBuffer:!1},s=wu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_0(r)),this._blurMaterial=y0(r,e,t)}return s}_compileMaterial(e){let t=new pt(this._lodPlanes[0],e);this._renderer.compile(t,Jl)}_sceneToCubeUV(e,t,n,s,r){let l=new Pt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(bu),u.toneMapping=Hn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new dn({name:"PMREM.Background",side:wt,depthWrite:!1,depthTest:!1}),m=new pt(new ss,_),f=!1,E=e.background;E?E.isColor&&(_.color.copy(E),e.background=null,f=!0):(_.color.copy(bu),f=!0);for(let w=0;w<6;w++){let M=w%3;M===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):M===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));let C=this._cubeSize;_a(s,M*C,w>2?C:0,C,C),u.setRenderTarget(s),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===wi||e.mapping===Ei;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new pt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;_a(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Jl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Su[(s-r-1)%Su.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new pt(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ii-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ii;m>Ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ii}`);let f=[],E=0;for(let R=0;R<Ii;++R){let F=R/_,b=Math.exp(-F*F/2);f.push(b),R===0?E+=b:R<m&&(E+=2*b)}for(let R=0;R<f.length;R++)f[R]=f[R]/E;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:w}=this;d.dTheta.value=g,d.mipInt.value=w-n;let M=this._sizeLods[s],C=3*M*(s>w-ps?s-w+ps:0),A=4*(this._cubeSize-M);_a(t,C,A,3*M,2*M),l.setRenderTarget(t),l.render(u,Jl)}};function _0(i){let e=[],t=[],n=[],s=i,r=i-ps+1+Mu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-ps?l=Mu[o-i+ps-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,E=new Float32Array(_*g*p),w=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let A=0;A<p;A++){let R=A%3*2/3-1,F=A>2?0:-1,b=[R,F,0,R+2/3,F,0,R+2/3,F+1,0,R,F,0,R+2/3,F+1,0,R,F+1,0];E.set(b,_*g*A),w.set(d,m*g*A);let v=[A,A,A,A,A,A];M.set(v,f*g*A)}let C=new bt;C.setAttribute("position",new Bt(E,_)),C.setAttribute("uv",new Bt(w,m)),C.setAttribute("faceIndex",new Bt(M,f)),e.push(C),s>ps&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function wu(i,e,t){let n=new yn(i,e,t);return n.texture.mapping=sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _a(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function y0(i,e,t){let n=new Float32Array(Ii),s=new D(0,1,0);return new St({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Eu(){return new St({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Tu(){return new St({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function cc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function v0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Uo||l===No,h=l===wi||l===Ei;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new va(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new va(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function M0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ts("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function b0(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)e.update(d[p],i.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let E=p.array;_=p.version;for(let w=0,M=E.length;w<M;w+=3){let C=E[w+0],A=E[w+1],R=E[w+2];d.push(C,A,A,R,R,C)}}else if(g!==void 0){let E=g.array;_=g.version;for(let w=0,M=E.length/3-1;w<M;w+=3){let C=w+0,A=w+1,R=w+2;d.push(C,A,A,R,R,C)}}else return;let m=new(Wl(d)?Gs:Hs)(d,1);m.version=_;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function S0(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),t.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,_,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*_[E];t.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function w0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function E0(i,e,t){let n=new WeakMap,s=new st;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let b=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],w=0;p===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let M=a.attributes.position.count*w,C=1;M>e.maxTextureSize&&(C=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let A=new Float32Array(M*C*4*u),R=new zs(A,M,C,u);R.type=Sn,R.needsUpdate=!0;let F=w*4;for(let v=0;v<u;v++){let I=m[v],z=f[v],q=E[v],J=M*C*4*v;for(let K=0;K<I.count;K++){let $=K*F;p===!0&&(s.fromBufferAttribute(I,K),A[J+$+0]=s.x,A[J+$+1]=s.y,A[J+$+2]=s.z,A[J+$+3]=0),g===!0&&(s.fromBufferAttribute(z,K),A[J+$+4]=s.x,A[J+$+5]=s.y,A[J+$+6]=s.z,A[J+$+7]=0),_===!0&&(s.fromBufferAttribute(q,K),A[J+$+8]=s.x,A[J+$+9]=s.y,A[J+$+10]=s.z,A[J+$+11]=q.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new $e(M,C)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function T0(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Xu=new Xt,Au=new Zs(1,1),qu=new zs,Yu=new ro,$u=new Xs,Cu=[],Ru=[],Iu=new Float32Array(16),Pu=new Float32Array(9),Lu=new Float32Array(4);function gs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Cu[s];if(r===void 0&&(r=new Float32Array(s),Cu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function _t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ba(i,e){let t=Ru[e];t===void 0&&(t=new Int32Array(e),Ru[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function A0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function C0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function R0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function I0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function P0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(_t(t,n))return;Lu.set(n),i.uniformMatrix2fv(this.addr,!1,Lu),yt(t,n)}}function L0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(_t(t,n))return;Pu.set(n),i.uniformMatrix3fv(this.addr,!1,Pu),yt(t,n)}}function D0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(_t(t,n))return;Iu.set(n),i.uniformMatrix4fv(this.addr,!1,Iu),yt(t,n)}}function U0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function N0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function F0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function B0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function O0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function k0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function z0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function V0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function H0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Au.compareFunction=Vl,r=Au):r=Xu,t.setTexture2D(e||r,s)}function G0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Yu,s)}function W0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||$u,s)}function X0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||qu,s)}function q0(i){switch(i){case 5126:return A0;case 35664:return C0;case 35665:return R0;case 35666:return I0;case 35674:return P0;case 35675:return L0;case 35676:return D0;case 5124:case 35670:return U0;case 35667:case 35671:return N0;case 35668:case 35672:return F0;case 35669:case 35673:return B0;case 5125:return O0;case 36294:return k0;case 36295:return z0;case 36296:return V0;case 35678:case 36198:case 36298:case 36306:case 35682:return H0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return W0;case 36289:case 36303:case 36311:case 36292:return X0}}function Y0(i,e){i.uniform1fv(this.addr,e)}function $0(i,e){let t=gs(e,this.size,2);i.uniform2fv(this.addr,t)}function J0(i,e){let t=gs(e,this.size,3);i.uniform3fv(this.addr,t)}function Z0(i,e){let t=gs(e,this.size,4);i.uniform4fv(this.addr,t)}function K0(i,e){let t=gs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function j0(i,e){let t=gs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Q0(i,e){let t=gs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function e1(i,e){i.uniform1iv(this.addr,e)}function t1(i,e){i.uniform2iv(this.addr,e)}function n1(i,e){i.uniform3iv(this.addr,e)}function i1(i,e){i.uniform4iv(this.addr,e)}function s1(i,e){i.uniform1uiv(this.addr,e)}function r1(i,e){i.uniform2uiv(this.addr,e)}function o1(i,e){i.uniform3uiv(this.addr,e)}function a1(i,e){i.uniform4uiv(this.addr,e)}function l1(i,e,t){let n=this.cache,s=e.length,r=ba(t,s);_t(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Xu,r[o])}function c1(i,e,t){let n=this.cache,s=e.length,r=ba(t,s);_t(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Yu,r[o])}function h1(i,e,t){let n=this.cache,s=e.length,r=ba(t,s);_t(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||$u,r[o])}function u1(i,e,t){let n=this.cache,s=e.length,r=ba(t,s);_t(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||qu,r[o])}function d1(i){switch(i){case 5126:return Y0;case 35664:return $0;case 35665:return J0;case 35666:return Z0;case 35674:return K0;case 35675:return j0;case 35676:return Q0;case 5124:case 35670:return e1;case 35667:case 35671:return t1;case 35668:case 35672:return n1;case 35669:case 35673:return i1;case 5125:return s1;case 36294:return r1;case 36295:return o1;case 36296:return a1;case 35678:case 36198:case 36298:case 36306:case 35682:return l1;case 35679:case 36299:case 36307:return c1;case 35680:case 36300:case 36308:case 36293:return h1;case 36289:case 36303:case 36311:case 36292:return u1}}var tc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=q0(t.type)}},nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=d1(t.type)}},ic=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ec=/(\w+)(\])?(\[|\.)?/g;function Du(i,e){i.seq.push(e),i.map[e.id]=e}function f1(i,e,t){let n=i.name,s=n.length;for(ec.lastIndex=0;;){let r=ec.exec(n),o=ec.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Du(t,c===void 0?new tc(a,i,e):new nc(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new ic(a),Du(t,u)),t=u}}}var ms=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);f1(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Uu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var p1=37297,m1=0;function g1(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Nu=new ke;function x1(i){Ye._getMatrix(Nu,Ye.workingColorSpace,i);let e=`mat3( ${Nu.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case Bs:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Fu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+g1(i.getShaderSource(e),a)}else return r}function _1(i,e){let t=x1(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function y1(i,e){let t;switch(e){case jh:t="Linear";break;case Qh:t="Reinhard";break;case eu:t="Cineon";break;case tu:t="ACESFilmic";break;case iu:t="AgX";break;case su:t="Neutral";break;case nu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ya=new D;function v1(){Ye.getLuminanceCoefficients(ya);let i=ya.x.toFixed(4),e=ya.y.toFixed(4),t=ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function M1(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ur).join(`
`)}function b1(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function S1(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function ur(i){return i!==""}function Bu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ou(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var w1=/^[ \t]*#include +<([\w\d./]+)>/gm;function sc(i){return i.replace(w1,T1)}var E1=new Map;function T1(i,e){let t=He[e];if(t===void 0){let n=E1.get(e);if(n!==void 0)t=He[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return sc(t)}var A1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ku(i){return i.replace(A1,C1)}function C1(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function zu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function R1(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Cl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ph?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(e="SHADOWMAP_TYPE_VSM"),e}function I1(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case wi:case Ei:e="ENVMAP_TYPE_CUBE";break;case sr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function P1(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ei&&(e="ENVMAP_MODE_REFRACTION"),e}function L1(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Pl:e="ENVMAP_BLENDING_MULTIPLY";break;case Zh:e="ENVMAP_BLENDING_MIX";break;case Kh:e="ENVMAP_BLENDING_ADD";break}return e}function D1(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function U1(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=R1(t),c=I1(t),h=P1(t),u=L1(t),d=D1(t),p=M1(t),g=b1(r),_=s.createProgram(),m,f,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ur).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ur).join(`
`),f.length>0&&(f+=`
`)):(m=[zu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ur).join(`
`),f=[zu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?He.tonemapping_pars_fragment:"",t.toneMapping!==Hn?y1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,_1("linearToOutputTexel",t.outputColorSpace),v1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ur).join(`
`)),o=sc(o),o=Bu(o,t),o=Ou(o,t),a=sc(a),a=Bu(a,t),a=Ou(a,t),o=ku(o),a=ku(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Hl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let w=E+m+o,M=E+f+a,C=Uu(s,s.VERTEX_SHADER,w),A=Uu(s,s.FRAGMENT_SHADER,M);s.attachShader(_,C),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(I){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(_)||"",q=s.getShaderInfoLog(C)||"",J=s.getShaderInfoLog(A)||"",K=z.trim(),$=q.trim(),j=J.trim(),G=!0,se=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,C,A);else{let O=Fu(s,C,"vertex"),W=Fu(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+K+`
`+O+`
`+W)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):($===""||j==="")&&(se=!1);se&&(I.diagnostics={runnable:G,programLog:K,vertexShader:{log:$,prefix:m},fragmentShader:{log:j,prefix:f}})}s.deleteShader(C),s.deleteShader(A),F=new ms(s,_),b=S1(s,_)}let F;this.getUniforms=function(){return F===void 0&&R(this),F};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,p1)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=m1++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=A,this}var N1=0,rc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new oc(e),t.set(e,n)),n}},oc=class{constructor(e){this.id=N1++,this.code=e,this.usedTimes=0}};function F1(i,e,t,n,s,r,o){let a=new Vs,l=new rc,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,v,I,z,q){let J=z.fog,K=q.geometry,$=b.isMeshStandardMaterial?z.environment:null,j=(b.isMeshStandardMaterial?t:e).get(b.envMap||$),G=j&&j.mapping===sr?j.image.height:null,se=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let O=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,W=O!==void 0?O.length:0,ne=0;K.morphAttributes.position!==void 0&&(ne=1),K.morphAttributes.normal!==void 0&&(ne=2),K.morphAttributes.color!==void 0&&(ne=3);let Ue,xe,Ae,V;if(se){let Ze=Nt[se];Ue=Ze.vertexShader,xe=Ze.fragmentShader}else Ue=b.vertexShader,xe=b.fragmentShader,l.update(b),Ae=l.getVertexShaderID(b),V=l.getFragmentShaderID(b);let k=i.getRenderTarget(),ee=i.state.buffers.depth.getReversed(),ue=q.isInstancedMesh===!0,de=q.isBatchedMesh===!0,Fe=!!b.map,Ge=!!b.matcap,T=!!j,qe=!!b.aoMap,Le=!!b.lightMap,Ce=!!b.bumpMap,_e=!!b.normalMap,je=!!b.displacementMap,be=!!b.emissiveMap,Ve=!!b.metalnessMap,vt=!!b.roughnessMap,mt=b.anisotropy>0,S=b.clearcoat>0,x=b.dispersion>0,B=b.iridescence>0,Z=b.sheen>0,te=b.transmission>0,Y=mt&&!!b.anisotropyMap,Te=S&&!!b.clearcoatMap,le=S&&!!b.clearcoatNormalMap,Se=S&&!!b.clearcoatRoughnessMap,we=B&&!!b.iridescenceMap,oe=B&&!!b.iridescenceThicknessMap,me=Z&&!!b.sheenColorMap,De=Z&&!!b.sheenRoughnessMap,Ee=!!b.specularMap,fe=!!b.specularColorMap,ze=!!b.specularIntensityMap,P=te&&!!b.transmissionMap,ae=te&&!!b.thicknessMap,he=!!b.gradientMap,ye=!!b.alphaMap,ie=b.alphaTest>0,Q=!!b.alphaHash,Me=!!b.extensions,Be=Hn;b.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(Be=i.toneMapping);let ot={shaderID:se,shaderType:b.type,shaderName:b.name,vertexShader:Ue,fragmentShader:xe,defines:b.defines,customVertexShaderID:Ae,customFragmentShaderID:V,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:de,batchingColor:de&&q._colorsTexture!==null,instancing:ue,instancingColor:ue&&q.instanceColor!==null,instancingMorph:ue&&q.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:k===null?i.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Mi,alphaToCoverage:!!b.alphaToCoverage,map:Fe,matcap:Ge,envMap:T,envMapMode:T&&j.mapping,envMapCubeUVHeight:G,aoMap:qe,lightMap:Le,bumpMap:Ce,normalMap:_e,displacementMap:d&&je,emissiveMap:be,normalMapObjectSpace:_e&&b.normalMapType===cu,normalMapTangentSpace:_e&&b.normalMapType===lu,metalnessMap:Ve,roughnessMap:vt,anisotropy:mt,anisotropyMap:Y,clearcoat:S,clearcoatMap:Te,clearcoatNormalMap:le,clearcoatRoughnessMap:Se,dispersion:x,iridescence:B,iridescenceMap:we,iridescenceThicknessMap:oe,sheen:Z,sheenColorMap:me,sheenRoughnessMap:De,specularMap:Ee,specularColorMap:fe,specularIntensityMap:ze,transmission:te,transmissionMap:P,thicknessMap:ae,gradientMap:he,opaque:b.transparent===!1&&b.blending===Bn&&b.alphaToCoverage===!1,alphaMap:ye,alphaTest:ie,alphaHash:Q,combine:b.combine,mapUv:Fe&&_(b.map.channel),aoMapUv:qe&&_(b.aoMap.channel),lightMapUv:Le&&_(b.lightMap.channel),bumpMapUv:Ce&&_(b.bumpMap.channel),normalMapUv:_e&&_(b.normalMap.channel),displacementMapUv:je&&_(b.displacementMap.channel),emissiveMapUv:be&&_(b.emissiveMap.channel),metalnessMapUv:Ve&&_(b.metalnessMap.channel),roughnessMapUv:vt&&_(b.roughnessMap.channel),anisotropyMapUv:Y&&_(b.anisotropyMap.channel),clearcoatMapUv:Te&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:le&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:me&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:De&&_(b.sheenRoughnessMap.channel),specularMapUv:Ee&&_(b.specularMap.channel),specularColorMapUv:fe&&_(b.specularColorMap.channel),specularIntensityMapUv:ze&&_(b.specularIntensityMap.channel),transmissionMapUv:P&&_(b.transmissionMap.channel),thicknessMapUv:ae&&_(b.thicknessMap.channel),alphaMapUv:ye&&_(b.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(_e||mt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!K.attributes.uv&&(Fe||ye),fog:!!J,useFog:b.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ee,skinning:q.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:ne,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Be,decodeVideoTexture:Fe&&b.map.isVideoTexture===!0&&Ye.getTransfer(b.map.colorSpace)===et,decodeVideoTextureEmissive:be&&b.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(b.emissiveMap.colorSpace)===et,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===$t,flipSided:b.side===wt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Me&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&b.extensions.multiDraw===!0||de)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ot.vertexUv1s=c.has(1),ot.vertexUv2s=c.has(2),ot.vertexUv3s=c.has(3),c.clear(),ot}function f(b){let v=[];if(b.shaderID?v.push(b.shaderID):(v.push(b.customVertexShaderID),v.push(b.customFragmentShaderID)),b.defines!==void 0)for(let I in b.defines)v.push(I),v.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(E(v,b),w(v,b),v.push(i.outputColorSpace)),v.push(b.customProgramCacheKey),v.join()}function E(b,v){b.push(v.precision),b.push(v.outputColorSpace),b.push(v.envMapMode),b.push(v.envMapCubeUVHeight),b.push(v.mapUv),b.push(v.alphaMapUv),b.push(v.lightMapUv),b.push(v.aoMapUv),b.push(v.bumpMapUv),b.push(v.normalMapUv),b.push(v.displacementMapUv),b.push(v.emissiveMapUv),b.push(v.metalnessMapUv),b.push(v.roughnessMapUv),b.push(v.anisotropyMapUv),b.push(v.clearcoatMapUv),b.push(v.clearcoatNormalMapUv),b.push(v.clearcoatRoughnessMapUv),b.push(v.iridescenceMapUv),b.push(v.iridescenceThicknessMapUv),b.push(v.sheenColorMapUv),b.push(v.sheenRoughnessMapUv),b.push(v.specularMapUv),b.push(v.specularColorMapUv),b.push(v.specularIntensityMapUv),b.push(v.transmissionMapUv),b.push(v.thicknessMapUv),b.push(v.combine),b.push(v.fogExp2),b.push(v.sizeAttenuation),b.push(v.morphTargetsCount),b.push(v.morphAttributeCount),b.push(v.numDirLights),b.push(v.numPointLights),b.push(v.numSpotLights),b.push(v.numSpotLightMaps),b.push(v.numHemiLights),b.push(v.numRectAreaLights),b.push(v.numDirLightShadows),b.push(v.numPointLightShadows),b.push(v.numSpotLightShadows),b.push(v.numSpotLightShadowsWithMaps),b.push(v.numLightProbes),b.push(v.shadowMapType),b.push(v.toneMapping),b.push(v.numClippingPlanes),b.push(v.numClipIntersection),b.push(v.depthPacking)}function w(b,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),b.push(a.mask)}function M(b){let v=g[b.type],I;if(v){let z=Nt[v];I=hr.clone(z.uniforms)}else I=b.uniforms;return I}function C(b,v){let I;for(let z=0,q=h.length;z<q;z++){let J=h[z];if(J.cacheKey===v){I=J,++I.usedTimes;break}}return I===void 0&&(I=new U1(i,v,b,r),h.push(I)),I}function A(b){if(--b.usedTimes===0){let v=h.indexOf(b);h[v]=h[h.length-1],h.pop(),b.destroy()}}function R(b){l.remove(b)}function F(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:C,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:F}}function B1(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function O1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Vu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Hu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,p,g,_,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),e++,f}function a(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||O1),n.length>1&&n.sort(d||Vu),s.length>1&&s.sort(d||Vu)}function h(){for(let u=e,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function k1(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Hu,i.set(n,[o])):s>=r.length?(o=new Hu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function z1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new We};break;case"SpotLight":t={position:new D,direction:new D,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function V1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var H1=0;function G1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function W1(i){let e=new z1,t=V1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new dt,o=new dt;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,E=0,w=0,M=0,C=0,A=0,R=0;c.sort(G1);for(let b=0,v=c.length;b<v;b++){let I=c[b],z=I.color,q=I.intensity,J=I.distance,K=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=z.r*q,u+=z.g*q,d+=z.b*q;else if(I.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(I.sh.coefficients[$],q);R++}else if(I.isDirectionalLight){let $=e.get(I);if($.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let j=I.shadow,G=t.get(I);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=I.shadow.matrix,E++}n.directional[p]=$,p++}else if(I.isSpotLight){let $=e.get(I);$.position.setFromMatrixPosition(I.matrixWorld),$.color.copy(z).multiplyScalar(q),$.distance=J,$.coneCos=Math.cos(I.angle),$.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),$.decay=I.decay,n.spot[_]=$;let j=I.shadow;if(I.map&&(n.spotLightMap[C]=I.map,C++,j.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=j.matrix,I.castShadow){let G=t.get(I);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=K,M++}_++}else if(I.isRectAreaLight){let $=e.get(I);$.color.copy(z).multiplyScalar(q),$.halfWidth.set(I.width*.5,0,0),$.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=$,m++}else if(I.isPointLight){let $=e.get(I);if($.color.copy(I.color).multiplyScalar(I.intensity),$.distance=I.distance,$.decay=I.decay,I.castShadow){let j=I.shadow,G=t.get(I);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,G.shadowCameraNear=j.camera.near,G.shadowCameraFar=j.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=I.shadow.matrix,w++}n.point[g]=$,g++}else if(I.isHemisphereLight){let $=e.get(I);$.skyColor.copy(I.color).multiplyScalar(q),$.groundColor.copy(I.groundColor).multiplyScalar(q),n.hemi[f]=$,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let F=n.hash;(F.directionalLength!==p||F.pointLength!==g||F.spotLength!==_||F.rectAreaLength!==m||F.hemiLength!==f||F.numDirectionalShadows!==E||F.numPointShadows!==w||F.numSpotShadows!==M||F.numSpotMaps!==C||F.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+C-A,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,F.directionalLength=p,F.pointLength=g,F.spotLength=_,F.rectAreaLength=m,F.hemiLength=f,F.numDirectionalShadows=E,F.numPointShadows=w,F.numSpotShadows=M,F.numSpotMaps=C,F.numLightProbes=R,n.version=H1++)}function l(c,h){let u=0,d=0,p=0,g=0,_=0,m=h.matrixWorldInverse;for(let f=0,E=c.length;f<E;f++){let w=c[f];if(w.isDirectionalLight){let M=n.directional[u];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(w.isSpotLight){let M=n.spot[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let M=n.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){let M=n.point[d];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){let M=n.hemi[_];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Gu(i){let e=new W1(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function X1(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Gu(i),e.set(s,[a])):r>=o.length?(a=new Gu(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var q1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Y1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function $1(i,e,t){let n=new Ys,s=new $e,r=new $e,o=new st,a=new po({depthPacking:au}),l=new mo,c={},h=t.maxTextureSize,u={[Fn]:wt,[wt]:Fn,[$t]:$t},d=new St({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:q1,fragmentShader:Y1}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new bt;g.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new pt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cl;let f=this.type;this.render=function(A,R,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),v=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Vn),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let q=f!==Mn&&this.type===Mn,J=f===Mn&&this.type!==Mn;for(let K=0,$=A.length;K<$;K++){let j=A[K],G=j.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let se=G.getFrameExtents();if(s.multiply(se),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,G.mapSize.y=r.y)),G.map===null||q===!0||J===!0){let W=this.type!==Mn?{minFilter:tn,magFilter:tn}:{};G.map!==null&&G.map.dispose(),G.map=new yn(s.x,s.y,W),G.map.texture.name=j.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let O=G.getViewportCount();for(let W=0;W<O;W++){let ne=G.getViewport(W);o.set(r.x*ne.x,r.y*ne.y,r.x*ne.z,r.y*ne.w),z.viewport(o),G.updateMatrices(j,W),n=G.getFrustum(),M(R,F,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===Mn&&E(G,F),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(b,v,I)};function E(A,R){let F=e.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new yn(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,F,d,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,F,p,_,null)}function w(A,R,F,b){let v=null,I=F.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)v=I;else if(v=F.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let z=v.uuid,q=R.uuid,J=c[z];J===void 0&&(J={},c[z]=J);let K=J[q];K===void 0&&(K=v.clone(),J[q]=K,R.addEventListener("dispose",C)),v=K}if(v.visible=R.visible,v.wireframe=R.wireframe,b===Mn?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:u[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,F.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let z=i.properties.get(v);z.light=F}return v}function M(A,R,F,b,v){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===Mn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,A.matrixWorld);let q=e.update(A),J=A.material;if(Array.isArray(J)){let K=q.groups;for(let $=0,j=K.length;$<j;$++){let G=K[$],se=J[G.materialIndex];if(se&&se.visible){let O=w(A,se,b,v);A.onBeforeShadow(i,A,R,F,q,O,G),i.renderBufferDirect(F,null,q,O,A,G),A.onAfterShadow(i,A,R,F,q,O,G)}}}else if(J.visible){let K=w(A,J,b,v);A.onBeforeShadow(i,A,R,F,q,K,null),i.renderBufferDirect(F,null,q,K,A,null),A.onAfterShadow(i,A,R,F,q,K,null)}}let z=A.children;for(let q=0,J=z.length;q<J;q++)M(z[q],R,F,b,v)}function C(A){A.target.removeEventListener("dispose",C);for(let F in c){let b=c[F],v=A.target.uuid;v in b&&(b[v].dispose(),delete b[v])}}}var J1={[Ao]:Co,[Ro]:Lo,[Io]:Do,[vi]:Po,[Co]:Ao,[Lo]:Ro,[Do]:Io,[Po]:vi};function Z1(i,e){function t(){let P=!1,ae=new st,he=null,ye=new st(0,0,0,0);return{setMask:function(ie){he!==ie&&!P&&(i.colorMask(ie,ie,ie,ie),he=ie)},setLocked:function(ie){P=ie},setClear:function(ie,Q,Me,Be,ot){ot===!0&&(ie*=Be,Q*=Be,Me*=Be),ae.set(ie,Q,Me,Be),ye.equals(ae)===!1&&(i.clearColor(ie,Q,Me,Be),ye.copy(ae))},reset:function(){P=!1,he=null,ye.set(-1,0,0,0)}}}function n(){let P=!1,ae=!1,he=null,ye=null,ie=null;return{setReversed:function(Q){if(ae!==Q){let Me=e.get("EXT_clip_control");Q?Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.ZERO_TO_ONE_EXT):Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.NEGATIVE_ONE_TO_ONE_EXT),ae=Q;let Be=ie;ie=null,this.setClear(Be)}},getReversed:function(){return ae},setTest:function(Q){Q?k(i.DEPTH_TEST):ee(i.DEPTH_TEST)},setMask:function(Q){he!==Q&&!P&&(i.depthMask(Q),he=Q)},setFunc:function(Q){if(ae&&(Q=J1[Q]),ye!==Q){switch(Q){case Ao:i.depthFunc(i.NEVER);break;case Co:i.depthFunc(i.ALWAYS);break;case Ro:i.depthFunc(i.LESS);break;case vi:i.depthFunc(i.LEQUAL);break;case Io:i.depthFunc(i.EQUAL);break;case Po:i.depthFunc(i.GEQUAL);break;case Lo:i.depthFunc(i.GREATER);break;case Do:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ye=Q}},setLocked:function(Q){P=Q},setClear:function(Q){ie!==Q&&(ae&&(Q=1-Q),i.clearDepth(Q),ie=Q)},reset:function(){P=!1,he=null,ye=null,ie=null,ae=!1}}}function s(){let P=!1,ae=null,he=null,ye=null,ie=null,Q=null,Me=null,Be=null,ot=null;return{setTest:function(Ze){P||(Ze?k(i.STENCIL_TEST):ee(i.STENCIL_TEST))},setMask:function(Ze){ae!==Ze&&!P&&(i.stencilMask(Ze),ae=Ze)},setFunc:function(Ze,Cn,xn){(he!==Ze||ye!==Cn||ie!==xn)&&(i.stencilFunc(Ze,Cn,xn),he=Ze,ye=Cn,ie=xn)},setOp:function(Ze,Cn,xn){(Q!==Ze||Me!==Cn||Be!==xn)&&(i.stencilOp(Ze,Cn,xn),Q=Ze,Me=Cn,Be=xn)},setLocked:function(Ze){P=Ze},setClear:function(Ze){ot!==Ze&&(i.clearStencil(Ze),ot=Ze)},reset:function(){P=!1,ae=null,he=null,ye=null,ie=null,Q=null,Me=null,Be=null,ot=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,w=null,M=null,C=null,A=null,R=new We(0,0,0),F=0,b=!1,v=null,I=null,z=null,q=null,J=null,K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,j=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=j>=1):G.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=j>=2);let se=null,O={},W=i.getParameter(i.SCISSOR_BOX),ne=i.getParameter(i.VIEWPORT),Ue=new st().fromArray(W),xe=new st().fromArray(ne);function Ae(P,ae,he,ye){let ie=new Uint8Array(4),Q=i.createTexture();i.bindTexture(P,Q),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Me=0;Me<he;Me++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,ye,0,i.RGBA,i.UNSIGNED_BYTE,ie):i.texImage2D(ae+Me,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ie);return Q}let V={};V[i.TEXTURE_2D]=Ae(i.TEXTURE_2D,i.TEXTURE_2D,1),V[i.TEXTURE_CUBE_MAP]=Ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[i.TEXTURE_2D_ARRAY]=Ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),V[i.TEXTURE_3D]=Ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),k(i.DEPTH_TEST),o.setFunc(vi),Ce(!1),_e(Al),k(i.CULL_FACE),qe(Vn);function k(P){h[P]!==!0&&(i.enable(P),h[P]=!0)}function ee(P){h[P]!==!1&&(i.disable(P),h[P]=!1)}function ue(P,ae){return u[P]!==ae?(i.bindFramebuffer(P,ae),u[P]=ae,P===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ae),P===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function de(P,ae){let he=p,ye=!1;if(P){he=d.get(ae),he===void 0&&(he=[],d.set(ae,he));let ie=P.textures;if(he.length!==ie.length||he[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Me=ie.length;Q<Me;Q++)he[Q]=i.COLOR_ATTACHMENT0+Q;he.length=ie.length,ye=!0}}else he[0]!==i.BACK&&(he[0]=i.BACK,ye=!0);ye&&i.drawBuffers(he)}function Fe(P){return g!==P?(i.useProgram(P),g=P,!0):!1}let Ge={[ti]:i.FUNC_ADD,[Dh]:i.FUNC_SUBTRACT,[Uh]:i.FUNC_REVERSE_SUBTRACT};Ge[Nh]=i.MIN,Ge[Fh]=i.MAX;let T={[Bh]:i.ZERO,[Oh]:i.ONE,[kh]:i.SRC_COLOR,[Kr]:i.SRC_ALPHA,[Xh]:i.SRC_ALPHA_SATURATE,[Gh]:i.DST_COLOR,[Vh]:i.DST_ALPHA,[zh]:i.ONE_MINUS_SRC_COLOR,[jr]:i.ONE_MINUS_SRC_ALPHA,[Wh]:i.ONE_MINUS_DST_COLOR,[Hh]:i.ONE_MINUS_DST_ALPHA,[qh]:i.CONSTANT_COLOR,[Yh]:i.ONE_MINUS_CONSTANT_COLOR,[$h]:i.CONSTANT_ALPHA,[Jh]:i.ONE_MINUS_CONSTANT_ALPHA};function qe(P,ae,he,ye,ie,Q,Me,Be,ot,Ze){if(P===Vn){_===!0&&(ee(i.BLEND),_=!1);return}if(_===!1&&(k(i.BLEND),_=!0),P!==Lh){if(P!==m||Ze!==b){if((f!==ti||M!==ti)&&(i.blendEquation(i.FUNC_ADD),f=ti,M=ti),Ze)switch(P){case Bn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ir:i.blendFunc(i.ONE,i.ONE);break;case Rl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Bn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ir:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Rl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Il:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}E=null,w=null,C=null,A=null,R.set(0,0,0),F=0,m=P,b=Ze}return}ie=ie||ae,Q=Q||he,Me=Me||ye,(ae!==f||ie!==M)&&(i.blendEquationSeparate(Ge[ae],Ge[ie]),f=ae,M=ie),(he!==E||ye!==w||Q!==C||Me!==A)&&(i.blendFuncSeparate(T[he],T[ye],T[Q],T[Me]),E=he,w=ye,C=Q,A=Me),(Be.equals(R)===!1||ot!==F)&&(i.blendColor(Be.r,Be.g,Be.b,ot),R.copy(Be),F=ot),m=P,b=!1}function Le(P,ae){P.side===$t?ee(i.CULL_FACE):k(i.CULL_FACE);let he=P.side===wt;ae&&(he=!he),Ce(he),P.blending===Bn&&P.transparent===!1?qe(Vn):qe(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);let ye=P.stencilWrite;a.setTest(ye),ye&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),be(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?k(i.SAMPLE_ALPHA_TO_COVERAGE):ee(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(P){v!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),v=P)}function _e(P){P!==Rh?(k(i.CULL_FACE),P!==I&&(P===Al?i.cullFace(i.BACK):P===Ih?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ee(i.CULL_FACE),I=P}function je(P){P!==z&&($&&i.lineWidth(P),z=P)}function be(P,ae,he){P?(k(i.POLYGON_OFFSET_FILL),(q!==ae||J!==he)&&(i.polygonOffset(ae,he),q=ae,J=he)):ee(i.POLYGON_OFFSET_FILL)}function Ve(P){P?k(i.SCISSOR_TEST):ee(i.SCISSOR_TEST)}function vt(P){P===void 0&&(P=i.TEXTURE0+K-1),se!==P&&(i.activeTexture(P),se=P)}function mt(P,ae,he){he===void 0&&(se===null?he=i.TEXTURE0+K-1:he=se);let ye=O[he];ye===void 0&&(ye={type:void 0,texture:void 0},O[he]=ye),(ye.type!==P||ye.texture!==ae)&&(se!==he&&(i.activeTexture(he),se=he),i.bindTexture(P,ae||V[P]),ye.type=P,ye.texture=ae)}function S(){let P=O[se];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Z(){try{i.texSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function te(){try{i.texSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Te(){try{i.compressedTexSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function le(){try{i.texStorage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Se(){try{i.texStorage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function we(){try{i.texImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function oe(){try{i.texImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function me(P){Ue.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),Ue.copy(P))}function De(P){xe.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),xe.copy(P))}function Ee(P,ae){let he=c.get(ae);he===void 0&&(he=new WeakMap,c.set(ae,he));let ye=he.get(P);ye===void 0&&(ye=i.getUniformBlockIndex(ae,P.name),he.set(P,ye))}function fe(P,ae){let ye=c.get(ae).get(P);l.get(ae)!==ye&&(i.uniformBlockBinding(ae,ye,P.__bindingPointIndex),l.set(ae,ye))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},se=null,O={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,w=null,M=null,C=null,A=null,R=new We(0,0,0),F=0,b=!1,v=null,I=null,z=null,q=null,J=null,Ue.set(0,0,i.canvas.width,i.canvas.height),xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:k,disable:ee,bindFramebuffer:ue,drawBuffers:de,useProgram:Fe,setBlending:qe,setMaterial:Le,setFlipSided:Ce,setCullFace:_e,setLineWidth:je,setPolygonOffset:be,setScissorTest:Ve,activeTexture:vt,bindTexture:mt,unbindTexture:S,compressedTexImage2D:x,compressedTexImage3D:B,texImage2D:we,texImage3D:oe,updateUBOMapping:Ee,uniformBlockBinding:fe,texStorage2D:le,texStorage3D:Se,texSubImage2D:Z,texSubImage3D:te,compressedTexSubImage2D:Y,compressedTexSubImage3D:Te,scissor:me,viewport:De,reset:ze}}function K1(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $e,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,x){return p?new OffscreenCanvas(S,x):ks("canvas")}function _(S,x,B){let Z=1,te=mt(S);if((te.width>B||te.height>B)&&(Z=B/Math.max(te.width,te.height)),Z<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){let Y=Math.floor(Z*te.width),Te=Math.floor(Z*te.height);u===void 0&&(u=g(Y,Te));let le=x?g(Y,Te):u;return le.width=Y,le.height=Te,le.getContext("2d").drawImage(S,0,0,Y,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+Y+"x"+Te+")."),le}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),S;return S}function m(S){return S.generateMipmaps}function f(S){i.generateMipmap(S)}function E(S){return S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?i.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(S,x,B,Z,te=!1){if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let Y=x;if(x===i.RED&&(B===i.FLOAT&&(Y=i.R32F),B===i.HALF_FLOAT&&(Y=i.R16F),B===i.UNSIGNED_BYTE&&(Y=i.R8)),x===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(Y=i.R8UI),B===i.UNSIGNED_SHORT&&(Y=i.R16UI),B===i.UNSIGNED_INT&&(Y=i.R32UI),B===i.BYTE&&(Y=i.R8I),B===i.SHORT&&(Y=i.R16I),B===i.INT&&(Y=i.R32I)),x===i.RG&&(B===i.FLOAT&&(Y=i.RG32F),B===i.HALF_FLOAT&&(Y=i.RG16F),B===i.UNSIGNED_BYTE&&(Y=i.RG8)),x===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(Y=i.RG8UI),B===i.UNSIGNED_SHORT&&(Y=i.RG16UI),B===i.UNSIGNED_INT&&(Y=i.RG32UI),B===i.BYTE&&(Y=i.RG8I),B===i.SHORT&&(Y=i.RG16I),B===i.INT&&(Y=i.RG32I)),x===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),B===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),B===i.UNSIGNED_INT&&(Y=i.RGB32UI),B===i.BYTE&&(Y=i.RGB8I),B===i.SHORT&&(Y=i.RGB16I),B===i.INT&&(Y=i.RGB32I)),x===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),B===i.UNSIGNED_INT&&(Y=i.RGBA32UI),B===i.BYTE&&(Y=i.RGBA8I),B===i.SHORT&&(Y=i.RGBA16I),B===i.INT&&(Y=i.RGBA32I)),x===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),x===i.RGBA){let Te=te?Bs:Ye.getTransfer(Z);B===i.FLOAT&&(Y=i.RGBA32F),B===i.HALF_FLOAT&&(Y=i.RGBA16F),B===i.UNSIGNED_BYTE&&(Y=Te===et?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function M(S,x){let B;return S?x===null||x===oi||x===us?B=i.DEPTH24_STENCIL8:x===Sn?B=i.DEPTH32F_STENCIL8:x===cs&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===oi||x===us?B=i.DEPTH_COMPONENT24:x===Sn?B=i.DEPTH_COMPONENT32F:x===cs&&(B=i.DEPTH_COMPONENT16),B}function C(S,x){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==tn&&S.minFilter!==un?Math.log2(Math.max(x.width,x.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?x.mipmaps.length:1}function A(S){let x=S.target;x.removeEventListener("dispose",A),F(x),x.isVideoTexture&&h.delete(x)}function R(S){let x=S.target;x.removeEventListener("dispose",R),v(x)}function F(S){let x=n.get(S);if(x.__webglInit===void 0)return;let B=S.source,Z=d.get(B);if(Z){let te=Z[x.__cacheKey];te.usedTimes--,te.usedTimes===0&&b(S),Object.keys(Z).length===0&&d.delete(B)}n.remove(S)}function b(S){let x=n.get(S);i.deleteTexture(x.__webglTexture);let B=S.source,Z=d.get(B);delete Z[x.__cacheKey],o.memory.textures--}function v(S){let x=n.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),n.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let te=0;te<x.__webglFramebuffer[Z].length;te++)i.deleteFramebuffer(x.__webglFramebuffer[Z][te]);else i.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[Z]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let B=S.textures;for(let Z=0,te=B.length;Z<te;Z++){let Y=n.get(B[Z]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(B[Z])}n.remove(S)}let I=0;function z(){I=0}function q(){let S=I;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),I+=1,S}function J(S){let x=[];return x.push(S.wrapS),x.push(S.wrapT),x.push(S.wrapR||0),x.push(S.magFilter),x.push(S.minFilter),x.push(S.anisotropy),x.push(S.internalFormat),x.push(S.format),x.push(S.type),x.push(S.generateMipmaps),x.push(S.premultiplyAlpha),x.push(S.flipY),x.push(S.unpackAlignment),x.push(S.colorSpace),x.join()}function K(S,x){let B=n.get(S);if(S.isVideoTexture&&Ve(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&B.__version!==S.version){let Z=S.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(B,S,x);return}}else S.isExternalTexture&&(B.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+x)}function $(S,x){let B=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&B.__version!==S.version){V(B,S,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+x)}function j(S,x){let B=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&B.__version!==S.version){V(B,S,x);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+x)}function G(S,x){let B=n.get(S);if(S.version>0&&B.__version!==S.version){k(B,S,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+x)}let se={[Qr]:i.REPEAT,[ei]:i.CLAMP_TO_EDGE,[eo]:i.MIRRORED_REPEAT},O={[tn]:i.NEAREST,[ru]:i.NEAREST_MIPMAP_NEAREST,[rr]:i.NEAREST_MIPMAP_LINEAR,[un]:i.LINEAR,[Fo]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},W={[hu]:i.NEVER,[gu]:i.ALWAYS,[uu]:i.LESS,[Vl]:i.LEQUAL,[du]:i.EQUAL,[mu]:i.GEQUAL,[fu]:i.GREATER,[pu]:i.NOTEQUAL};function ne(S,x){if(x.type===Sn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===un||x.magFilter===Fo||x.magFilter===rr||x.magFilter===ri||x.minFilter===un||x.minFilter===Fo||x.minFilter===rr||x.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(S,i.TEXTURE_WRAP_S,se[x.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,se[x.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,se[x.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,O[x.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,O[x.minFilter]),x.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,W[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===tn||x.minFilter!==rr&&x.minFilter!==ri||x.type===Sn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(S,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Ue(S,x){let B=!1;S.__webglInit===void 0&&(S.__webglInit=!0,x.addEventListener("dispose",A));let Z=x.source,te=d.get(Z);te===void 0&&(te={},d.set(Z,te));let Y=J(x);if(Y!==S.__cacheKey){te[Y]===void 0&&(te[Y]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),te[Y].usedTimes++;let Te=te[S.__cacheKey];Te!==void 0&&(te[S.__cacheKey].usedTimes--,Te.usedTimes===0&&b(x)),S.__cacheKey=Y,S.__webglTexture=te[Y].texture}return B}function xe(S,x,B){return Math.floor(Math.floor(S/B)/x)}function Ae(S,x,B,Z){let Y=S.updateRanges;if(Y.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,B,Z,x.data);else{Y.sort((oe,me)=>oe.start-me.start);let Te=0;for(let oe=1;oe<Y.length;oe++){let me=Y[Te],De=Y[oe],Ee=me.start+me.count,fe=xe(De.start,x.width,4),ze=xe(me.start,x.width,4);De.start<=Ee+1&&fe===ze&&xe(De.start+De.count-1,x.width,4)===fe?me.count=Math.max(me.count,De.start+De.count-me.start):(++Te,Y[Te]=De)}Y.length=Te+1;let le=i.getParameter(i.UNPACK_ROW_LENGTH),Se=i.getParameter(i.UNPACK_SKIP_PIXELS),we=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let oe=0,me=Y.length;oe<me;oe++){let De=Y[oe],Ee=Math.floor(De.start/4),fe=Math.ceil(De.count/4),ze=Ee%x.width,P=Math.floor(Ee/x.width),ae=fe,he=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),t.texSubImage2D(i.TEXTURE_2D,0,ze,P,ae,he,B,Z,x.data)}S.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,le),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Se),i.pixelStorei(i.UNPACK_SKIP_ROWS,we)}}function V(S,x,B){let Z=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=i.TEXTURE_3D);let te=Ue(S,x),Y=x.source;t.bindTexture(Z,S.__webglTexture,i.TEXTURE0+B);let Te=n.get(Y);if(Y.version!==Te.__version||te===!0){t.activeTexture(i.TEXTURE0+B);let le=Ye.getPrimaries(Ye.workingColorSpace),Se=x.colorSpace===Gn?null:Ye.getPrimaries(x.colorSpace),we=x.colorSpace===Gn||le===Se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let oe=_(x.image,!1,s.maxTextureSize);oe=vt(x,oe);let me=r.convert(x.format,x.colorSpace),De=r.convert(x.type),Ee=w(x.internalFormat,me,De,x.colorSpace,x.isVideoTexture);ne(Z,x);let fe,ze=x.mipmaps,P=x.isVideoTexture!==!0,ae=Te.__version===void 0||te===!0,he=Y.dataReady,ye=C(x,oe);if(x.isDepthTexture)Ee=M(x.format===ds,x.type),ae&&(P?t.texStorage2D(i.TEXTURE_2D,1,Ee,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Ee,oe.width,oe.height,0,me,De,null));else if(x.isDataTexture)if(ze.length>0){P&&ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ee,ze[0].width,ze[0].height);for(let ie=0,Q=ze.length;ie<Q;ie++)fe=ze[ie],P?he&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,me,De,fe.data):t.texImage2D(i.TEXTURE_2D,ie,Ee,fe.width,fe.height,0,me,De,fe.data);x.generateMipmaps=!1}else P?(ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ee,oe.width,oe.height),he&&Ae(x,oe,me,De)):t.texImage2D(i.TEXTURE_2D,0,Ee,oe.width,oe.height,0,me,De,oe.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){P&&ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ee,ze[0].width,ze[0].height,oe.depth);for(let ie=0,Q=ze.length;ie<Q;ie++)if(fe=ze[ie],x.format!==sn)if(me!==null)if(P){if(he)if(x.layerUpdates.size>0){let Me=$l(fe.width,fe.height,x.format,x.type);for(let Be of x.layerUpdates){let ot=fe.data.subarray(Be*Me/fe.data.BYTES_PER_ELEMENT,(Be+1)*Me/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,Be,fe.width,fe.height,1,me,ot)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,oe.depth,me,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,Ee,fe.width,fe.height,oe.depth,0,fe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?he&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,oe.depth,me,De,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,Ee,fe.width,fe.height,oe.depth,0,me,De,fe.data)}else{P&&ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ee,ze[0].width,ze[0].height);for(let ie=0,Q=ze.length;ie<Q;ie++)fe=ze[ie],x.format!==sn?me!==null?P?he&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,me,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,Ee,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?he&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,me,De,fe.data):t.texImage2D(i.TEXTURE_2D,ie,Ee,fe.width,fe.height,0,me,De,fe.data)}else if(x.isDataArrayTexture)if(P){if(ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ee,oe.width,oe.height,oe.depth),he)if(x.layerUpdates.size>0){let ie=$l(oe.width,oe.height,x.format,x.type);for(let Q of x.layerUpdates){let Me=oe.data.subarray(Q*ie/oe.data.BYTES_PER_ELEMENT,(Q+1)*ie/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,oe.width,oe.height,1,me,De,Me)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,me,De,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,oe.width,oe.height,oe.depth,0,me,De,oe.data);else if(x.isData3DTexture)P?(ae&&t.texStorage3D(i.TEXTURE_3D,ye,Ee,oe.width,oe.height,oe.depth),he&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,me,De,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,oe.width,oe.height,oe.depth,0,me,De,oe.data);else if(x.isFramebufferTexture){if(ae)if(P)t.texStorage2D(i.TEXTURE_2D,ye,Ee,oe.width,oe.height);else{let ie=oe.width,Q=oe.height;for(let Me=0;Me<ye;Me++)t.texImage2D(i.TEXTURE_2D,Me,Ee,ie,Q,0,me,De,null),ie>>=1,Q>>=1}}else if(ze.length>0){if(P&&ae){let ie=mt(ze[0]);t.texStorage2D(i.TEXTURE_2D,ye,Ee,ie.width,ie.height)}for(let ie=0,Q=ze.length;ie<Q;ie++)fe=ze[ie],P?he&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,me,De,fe):t.texImage2D(i.TEXTURE_2D,ie,Ee,me,De,fe);x.generateMipmaps=!1}else if(P){if(ae){let ie=mt(oe);t.texStorage2D(i.TEXTURE_2D,ye,Ee,ie.width,ie.height)}he&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,me,De,oe)}else t.texImage2D(i.TEXTURE_2D,0,Ee,me,De,oe);m(x)&&f(Z),Te.__version=Y.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function k(S,x,B){if(x.image.length!==6)return;let Z=Ue(S,x),te=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+B);let Y=n.get(te);if(te.version!==Y.__version||Z===!0){t.activeTexture(i.TEXTURE0+B);let Te=Ye.getPrimaries(Ye.workingColorSpace),le=x.colorSpace===Gn?null:Ye.getPrimaries(x.colorSpace),Se=x.colorSpace===Gn||Te===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let we=x.isCompressedTexture||x.image[0].isCompressedTexture,oe=x.image[0]&&x.image[0].isDataTexture,me=[];for(let Q=0;Q<6;Q++)!we&&!oe?me[Q]=_(x.image[Q],!0,s.maxCubemapSize):me[Q]=oe?x.image[Q].image:x.image[Q],me[Q]=vt(x,me[Q]);let De=me[0],Ee=r.convert(x.format,x.colorSpace),fe=r.convert(x.type),ze=w(x.internalFormat,Ee,fe,x.colorSpace),P=x.isVideoTexture!==!0,ae=Y.__version===void 0||Z===!0,he=te.dataReady,ye=C(x,De);ne(i.TEXTURE_CUBE_MAP,x);let ie;if(we){P&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,ze,De.width,De.height);for(let Q=0;Q<6;Q++){ie=me[Q].mipmaps;for(let Me=0;Me<ie.length;Me++){let Be=ie[Me];x.format!==sn?Ee!==null?P?he&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me,0,0,Be.width,Be.height,Ee,Be.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me,ze,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me,0,0,Be.width,Be.height,Ee,fe,Be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me,ze,Be.width,Be.height,0,Ee,fe,Be.data)}}}else{if(ie=x.mipmaps,P&&ae){ie.length>0&&ye++;let Q=mt(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,ze,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(oe){P?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,me[Q].width,me[Q].height,Ee,fe,me[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ze,me[Q].width,me[Q].height,0,Ee,fe,me[Q].data);for(let Me=0;Me<ie.length;Me++){let ot=ie[Me].image[Q].image;P?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me+1,0,0,ot.width,ot.height,Ee,fe,ot.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me+1,ze,ot.width,ot.height,0,Ee,fe,ot.data)}}else{P?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ee,fe,me[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ze,Ee,fe,me[Q]);for(let Me=0;Me<ie.length;Me++){let Be=ie[Me];P?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me+1,0,0,Ee,fe,Be.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Me+1,ze,Ee,fe,Be.image[Q])}}}m(x)&&f(i.TEXTURE_CUBE_MAP),Y.__version=te.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function ee(S,x,B,Z,te,Y){let Te=r.convert(B.format,B.colorSpace),le=r.convert(B.type),Se=w(B.internalFormat,Te,le,B.colorSpace),we=n.get(x),oe=n.get(B);if(oe.__renderTarget=x,!we.__hasExternalTextures){let me=Math.max(1,x.width>>Y),De=Math.max(1,x.height>>Y);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,Y,Se,me,De,x.depth,0,Te,le,null):t.texImage2D(te,Y,Se,me,De,0,Te,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,S),be(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,te,oe.__webglTexture,0,je(x)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,te,oe.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(S,x,B){if(i.bindRenderbuffer(i.RENDERBUFFER,S),x.depthBuffer){let Z=x.depthTexture,te=Z&&Z.isDepthTexture?Z.type:null,Y=M(x.stencilBuffer,te),Te=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=je(x);be(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,Y,x.width,x.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,Y,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Y,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,S)}else{let Z=x.textures;for(let te=0;te<Z.length;te++){let Y=Z[te],Te=r.convert(Y.format,Y.colorSpace),le=r.convert(Y.type),Se=w(Y.internalFormat,Te,le,Y.colorSpace),we=je(x);B&&be(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,we,Se,x.width,x.height):be(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we,Se,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Se,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function de(S,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,S),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Z=n.get(x.depthTexture);Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),K(x.depthTexture,0);let te=Z.__webglTexture,Y=je(x);if(x.depthTexture.format===Qi)be(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(x.depthTexture.format===ds)be(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Fe(S){let x=n.get(S),B=S.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==S.depthTexture){let Z=S.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){let te=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",te)};Z.addEventListener("dispose",te),x.__depthDisposeCallback=te}x.__boundDepthTexture=Z}if(S.depthTexture&&!x.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");let Z=S.texture.mipmaps;Z&&Z.length>0?de(x.__webglFramebuffer[0],S):de(x.__webglFramebuffer,S)}else if(B){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=i.createRenderbuffer(),ue(x.__webglDepthbuffer[Z],S,!1);else{let te=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}else{let Z=S.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),ue(x.__webglDepthbuffer,S,!1);else{let te=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(S,x,B){let Z=n.get(S);x!==void 0&&ee(Z.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Fe(S)}function T(S){let x=S.texture,B=n.get(S),Z=n.get(x);S.addEventListener("dispose",R);let te=S.textures,Y=S.isWebGLCubeRenderTarget===!0,Te=te.length>1;if(Te||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=x.version,o.memory.textures++),Y){B.__webglFramebuffer=[];for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[le]=[];for(let Se=0;Se<x.mipmaps.length;Se++)B.__webglFramebuffer[le][Se]=i.createFramebuffer()}else B.__webglFramebuffer[le]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let le=0;le<x.mipmaps.length;le++)B.__webglFramebuffer[le]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Te)for(let le=0,Se=te.length;le<Se;le++){let we=n.get(te[le]);we.__webglTexture===void 0&&(we.__webglTexture=i.createTexture(),o.memory.textures++)}if(S.samples>0&&be(S)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let le=0;le<te.length;le++){let Se=te[le];B.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[le]);let we=r.convert(Se.format,Se.colorSpace),oe=r.convert(Se.type),me=w(Se.internalFormat,we,oe,Se.colorSpace,S.isXRRenderTarget===!0),De=je(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,De,me,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,B.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(B.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),ne(i.TEXTURE_CUBE_MAP,x);for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)ee(B.__webglFramebuffer[le][Se],S,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Se);else ee(B.__webglFramebuffer[le],S,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(x)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let le=0,Se=te.length;le<Se;le++){let we=te[le],oe=n.get(we),me=i.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(me=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,oe.__webglTexture),ne(me,we),ee(B.__webglFramebuffer,S,we,i.COLOR_ATTACHMENT0+le,me,0),m(we)&&f(me)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(le=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,Z.__webglTexture),ne(le,x),x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)ee(B.__webglFramebuffer[Se],S,x,i.COLOR_ATTACHMENT0,le,Se);else ee(B.__webglFramebuffer,S,x,i.COLOR_ATTACHMENT0,le,0);m(x)&&f(le),t.unbindTexture()}S.depthBuffer&&Fe(S)}function qe(S){let x=S.textures;for(let B=0,Z=x.length;B<Z;B++){let te=x[B];if(m(te)){let Y=E(S),Te=n.get(te).__webglTexture;t.bindTexture(Y,Te),f(Y),t.unbindTexture()}}}let Le=[],Ce=[];function _e(S){if(S.samples>0){if(be(S)===!1){let x=S.textures,B=S.width,Z=S.height,te=i.COLOR_BUFFER_BIT,Y=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(S),le=x.length>1;if(le)for(let we=0;we<x.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer);let Se=S.texture.mipmaps;Se&&Se.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let we=0;we<x.length;we++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[we]);let oe=n.get(x[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,oe,0)}i.blitFramebuffer(0,0,B,Z,0,0,B,Z,te,i.NEAREST),l===!0&&(Le.length=0,Ce.length=0,Le.push(i.COLOR_ATTACHMENT0+we),S.depthBuffer&&S.resolveDepthBuffer===!1&&(Le.push(Y),Ce.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ce)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Le))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let we=0;we<x.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,Te.__webglColorRenderbuffer[we]);let oe=n.get(x[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){let x=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function je(S){return Math.min(s.maxSamples,S.samples)}function be(S){let x=n.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Ve(S){let x=o.render.frame;h.get(S)!==x&&(h.set(S,x),S.update())}function vt(S,x){let B=S.colorSpace,Z=S.format,te=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||B!==Mi&&B!==Gn&&(Ye.getTransfer(B)===et?(Z!==sn||te!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),x}function mt(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=z,this.setTexture2D=K,this.setTexture2DArray=$,this.setTexture3D=j,this.setTextureCube=G,this.rebindTextures=Ge,this.setupRenderTarget=T,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=be}function j1(i,e){function t(n,s=Gn){let r,o=Ye.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===Oo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ko)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Fl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Dl)return i.BYTE;if(n===Ul)return i.SHORT;if(n===cs)return i.UNSIGNED_SHORT;if(n===Bo)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===hs)return i.HALF_FLOAT;if(n===Bl)return i.ALPHA;if(n===Ol)return i.RGB;if(n===sn)return i.RGBA;if(n===Qi)return i.DEPTH_COMPONENT;if(n===ds)return i.DEPTH_STENCIL;if(n===kl)return i.RED;if(n===zo)return i.RED_INTEGER;if(n===zl)return i.RG;if(n===Vo)return i.RG_INTEGER;if(n===Ho)return i.RGBA_INTEGER;if(n===or||n===ar||n===lr||n===cr)if(o===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===or)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===or)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===lr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===cr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Go||n===Wo||n===Xo||n===qo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Go)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Xo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===qo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Yo||n===$o||n===Jo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Yo||n===$o)return o===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Jo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Zo||n===Ko||n===jo||n===Qo||n===ea||n===ta||n===na||n===ia||n===sa||n===ra||n===oa||n===aa||n===la||n===ca)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Zo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ko)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===jo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Qo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ea)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ta)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===na)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ia)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===sa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ra)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===oa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===aa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===la)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ca)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ha||n===ua||n===da)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ha)return o===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ua)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===da)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fa||n===pa||n===ma||n===ga)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===fa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===pa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ma)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ga)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===us?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Q1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ex=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ac=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ks(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new St({vertexShader:Q1,fragmentShader:ex,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pt(new js(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lc=class extends On{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,_=typeof XRWebGLBinding<"u",m=new ac,f={},E=t.getContextAttributes(),w=null,M=null,C=[],A=[],R=new $e,F=null,b=new Pt;b.viewport=new st;let v=new Pt;v.viewport=new st;let I=[b,v],z=new To,q=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let k=C[V];return k===void 0&&(k=new rs,C[V]=k),k.getTargetRaySpace()},this.getControllerGrip=function(V){let k=C[V];return k===void 0&&(k=new rs,C[V]=k),k.getGripSpace()},this.getHand=function(V){let k=C[V];return k===void 0&&(k=new rs,C[V]=k),k.getHandSpace()};function K(V){let k=A.indexOf(V.inputSource);if(k===-1)return;let ee=C[k];ee!==void 0&&(ee.update(V.inputSource,V.frame,c||o),ee.dispatchEvent({type:V.type,data:V.inputSource}))}function $(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",j);for(let V=0;V<C.length;V++){let k=A[V];k!==null&&(A[V]=null,C[V].disconnect(k))}q=null,J=null,m.reset();for(let V in f)delete f[V];e.setRenderTarget(w),p=null,d=null,u=null,s=null,M=null,Ae.stop(),n.isPresenting=!1,e.setPixelRatio(F),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",$),s.addEventListener("inputsourceschange",j),E.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,ue=null,de=null;E.depth&&(de=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=E.stencil?ds:Qi,ue=E.stencil?us:oi);let Fe={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Fe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new yn(d.textureWidth,d.textureHeight,{format:sn,type:bn,depthTexture:new Zs(d.textureWidth,d.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let ee={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ee),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new yn(p.framebufferWidth,p.framebufferHeight,{format:sn,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ae.setContext(s),Ae.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j(V){for(let k=0;k<V.removed.length;k++){let ee=V.removed[k],ue=A.indexOf(ee);ue>=0&&(A[ue]=null,C[ue].disconnect(ee))}for(let k=0;k<V.added.length;k++){let ee=V.added[k],ue=A.indexOf(ee);if(ue===-1){for(let Fe=0;Fe<C.length;Fe++)if(Fe>=A.length){A.push(ee),ue=Fe;break}else if(A[Fe]===null){A[Fe]=ee,ue=Fe;break}if(ue===-1)break}let de=C[ue];de&&de.connect(ee)}}let G=new D,se=new D;function O(V,k,ee){G.setFromMatrixPosition(k.matrixWorld),se.setFromMatrixPosition(ee.matrixWorld);let ue=G.distanceTo(se),de=k.projectionMatrix.elements,Fe=ee.projectionMatrix.elements,Ge=de[14]/(de[10]-1),T=de[14]/(de[10]+1),qe=(de[9]+1)/de[5],Le=(de[9]-1)/de[5],Ce=(de[8]-1)/de[0],_e=(Fe[8]+1)/Fe[0],je=Ge*Ce,be=Ge*_e,Ve=ue/(-Ce+_e),vt=Ve*-Ce;if(k.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(vt),V.translateZ(Ve),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),de[10]===-1)V.projectionMatrix.copy(k.projectionMatrix),V.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{let mt=Ge+Ve,S=T+Ve,x=je-vt,B=be+(ue-vt),Z=qe*T/S*mt,te=Le*T/S*mt;V.projectionMatrix.makePerspective(x,B,Z,te,mt,S),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function W(V,k){k===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(k.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let k=V.near,ee=V.far;m.texture!==null&&(m.depthNear>0&&(k=m.depthNear),m.depthFar>0&&(ee=m.depthFar)),z.near=v.near=b.near=k,z.far=v.far=b.far=ee,(q!==z.near||J!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),q=z.near,J=z.far),z.layers.mask=V.layers.mask|6,b.layers.mask=z.layers.mask&3,v.layers.mask=z.layers.mask&5;let ue=V.parent,de=z.cameras;W(z,ue);for(let Fe=0;Fe<de.length;Fe++)W(de[Fe],ue);de.length===2?O(z,b,v):z.projectionMatrix.copy(b.projectionMatrix),ne(V,z,ue)};function ne(V,k,ee){ee===null?V.matrix.copy(k.matrixWorld):(V.matrix.copy(ee.matrixWorld),V.matrix.invert(),V.matrix.multiply(k.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(k.projectionMatrix),V.projectionMatrixInverse.copy(k.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=es*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(V){return f[V]};let Ue=null;function xe(V,k){if(h=k.getViewerPose(c||o),g=k,h!==null){let ee=h.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let ue=!1;ee.length!==z.cameras.length&&(z.cameras.length=0,ue=!0);for(let T=0;T<ee.length;T++){let qe=ee[T],Le=null;if(p!==null)Le=p.getViewport(qe);else{let _e=u.getViewSubImage(d,qe);Le=_e.viewport,T===0&&(e.setRenderTargetTextures(M,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(M))}let Ce=I[T];Ce===void 0&&(Ce=new Pt,Ce.layers.enable(T),Ce.viewport=new st,I[T]=Ce),Ce.matrix.fromArray(qe.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(qe.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(Le.x,Le.y,Le.width,Le.height),T===0&&(z.matrix.copy(Ce.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),ue===!0&&z.cameras.push(Ce)}let de=s.enabledFeatures;if(de&&de.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let T=u.getDepthInformation(ee[0]);T&&T.isValid&&T.texture&&m.init(T,s.renderState)}if(de&&de.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let T=0;T<ee.length;T++){let qe=ee[T].camera;if(qe){let Le=f[qe];Le||(Le=new Ks,f[qe]=Le);let Ce=u.getCameraImage(qe);Le.sourceTexture=Ce}}}}for(let ee=0;ee<C.length;ee++){let ue=A[ee],de=C[ee];ue!==null&&de!==void 0&&de.update(ue,k,c||o)}Ue&&Ue(V,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),g=null}let Ae=new Wu;Ae.setAnimationLoop(xe),this.setAnimationLoop=function(V){Ue=V},this.dispose=function(){}}},Ci=new vn,tx=new dt;function nx(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Xl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,E,w,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,E,w):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===wt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===wt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let E=e.get(f),w=E.envMap,M=E.envMapRotation;w&&(m.envMap.value=w,Ci.copy(M),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),m.envMapRotation.value.setFromMatrix4(tx.makeRotationFromEuler(Ci)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,E,w){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=w*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===wt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let E=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ix(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,w){let M=w.program;n.uniformBlockBinding(E,M)}function c(E,w){let M=s[E.id];M===void 0&&(g(E),M=h(E),s[E.id]=M,E.addEventListener("dispose",m));let C=w.program;n.updateUBOMapping(E,C);let A=e.render.frame;r[E.id]!==A&&(d(E),r[E.id]=A)}function h(E){let w=u();E.__bindingPointIndex=w;let M=i.createBuffer(),C=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,M),M}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){let w=s[E.id],M=E.uniforms,C=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let A=0,R=M.length;A<R;A++){let F=Array.isArray(M[A])?M[A]:[M[A]];for(let b=0,v=F.length;b<v;b++){let I=F[b];if(p(I,A,b,C)===!0){let z=I.__offset,q=Array.isArray(I.value)?I.value:[I.value],J=0;for(let K=0;K<q.length;K++){let $=q[K],j=_($);typeof $=="number"||typeof $=="boolean"?(I.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,z+J,I.__data)):$.isMatrix3?(I.__data[0]=$.elements[0],I.__data[1]=$.elements[1],I.__data[2]=$.elements[2],I.__data[3]=0,I.__data[4]=$.elements[3],I.__data[5]=$.elements[4],I.__data[6]=$.elements[5],I.__data[7]=0,I.__data[8]=$.elements[6],I.__data[9]=$.elements[7],I.__data[10]=$.elements[8],I.__data[11]=0):($.toArray(I.__data,J),J+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,w,M,C){let A=E.value,R=w+"_"+M;if(C[R]===void 0)return typeof A=="number"||typeof A=="boolean"?C[R]=A:C[R]=A.clone(),!0;{let F=C[R];if(typeof A=="number"||typeof A=="boolean"){if(F!==A)return C[R]=A,!0}else if(F.equals(A)===!1)return F.copy(A),!0}return!1}function g(E){let w=E.uniforms,M=0,C=16;for(let R=0,F=w.length;R<F;R++){let b=Array.isArray(w[R])?w[R]:[w[R]];for(let v=0,I=b.length;v<I;v++){let z=b[v],q=Array.isArray(z.value)?z.value:[z.value];for(let J=0,K=q.length;J<K;J++){let $=q[J],j=_($),G=M%C,se=G%j.boundary,O=G+se;M+=se,O!==0&&C-O<j.storage&&(M+=C-O),z.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=M,M+=j.storage}}}let A=M%C;return A>0&&(M+=C-A),E.__size=M,E.__cache={},this}function _(E){let w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),w}function m(E){let w=E.target;w.removeEventListener("dispose",m);let M=o.indexOf(w.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function f(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Ma=class{constructor(e={}){let{canvas:t=xu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,f=null,E=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,C=!1;this._outputColorSpace=Wt;let A=0,R=0,F=null,b=-1,v=null,I=new st,z=new st,q=null,J=new We(0),K=0,$=t.width,j=t.height,G=1,se=null,O=null,W=new st(0,0,$,j),ne=new st(0,0,$,j),Ue=!1,xe=new Ys,Ae=!1,V=!1,k=new dt,ee=new D,ue=new st,de={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Fe=!1;function Ge(){return F===null?G:1}let T=n;function qe(y,U){return t.getContext(y,U)}try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",ie,!1),T===null){let U="webgl2";if(T=qe(U,y),T===null)throw qe(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Le,Ce,_e,je,be,Ve,vt,mt,S,x,B,Z,te,Y,Te,le,Se,we,oe,me,De,Ee,fe,ze;function P(){Le=new M0(T),Le.init(),Ee=new j1(T,Le),Ce=new p0(T,Le,e,Ee),_e=new Z1(T,Le),Ce.reversedDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),je=new w0(T),be=new B1,Ve=new K1(T,Le,_e,be,Ce,Ee,je),vt=new g0(M),mt=new v0(M),S=new Ip(T),fe=new d0(T,S),x=new b0(T,S,je,fe),B=new T0(T,x,S,je),oe=new E0(T,Ce,Ve),le=new m0(be),Z=new F1(M,vt,mt,Le,Ce,fe,le),te=new nx(M,be),Y=new k1,Te=new X1(Le),we=new u0(M,vt,mt,_e,B,p,l),Se=new $1(M,B,Ce),ze=new ix(T,je,Ce,_e),me=new f0(T,Le,je),De=new S0(T,Le,je),je.programs=Z.programs,M.capabilities=Ce,M.extensions=Le,M.properties=be,M.renderLists=Y,M.shadowMap=Se,M.state=_e,M.info=je}P();let ae=new lc(M,T);this.xr=ae,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){let y=Le.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=Le.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(y){y!==void 0&&(G=y,this.setSize($,j,!1))},this.getSize=function(y){return y.set($,j)},this.setSize=function(y,U,H=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=y,j=U,t.width=Math.floor(y*G),t.height=Math.floor(U*G),H===!0&&(t.style.width=y+"px",t.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set($*G,j*G).floor()},this.setDrawingBufferSize=function(y,U,H){$=y,j=U,G=H,t.width=Math.floor(y*H),t.height=Math.floor(U*H),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(I)},this.getViewport=function(y){return y.copy(W)},this.setViewport=function(y,U,H,X){y.isVector4?W.set(y.x,y.y,y.z,y.w):W.set(y,U,H,X),_e.viewport(I.copy(W).multiplyScalar(G).round())},this.getScissor=function(y){return y.copy(ne)},this.setScissor=function(y,U,H,X){y.isVector4?ne.set(y.x,y.y,y.z,y.w):ne.set(y,U,H,X),_e.scissor(z.copy(ne).multiplyScalar(G).round())},this.getScissorTest=function(){return Ue},this.setScissorTest=function(y){_e.setScissorTest(Ue=y)},this.setOpaqueSort=function(y){se=y},this.setTransparentSort=function(y){O=y},this.getClearColor=function(y){return y.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(y=!0,U=!0,H=!0){let X=0;if(y){let N=!1;if(F!==null){let re=F.texture.format;N=re===Ho||re===Vo||re===zo}if(N){let re=F.texture.type,pe=re===bn||re===oi||re===cs||re===us||re===Oo||re===ko,ve=we.getClearColor(),ge=we.getClearAlpha(),Pe=ve.r,Ne=ve.g,Re=ve.b;pe?(g[0]=Pe,g[1]=Ne,g[2]=Re,g[3]=ge,T.clearBufferuiv(T.COLOR,0,g)):(_[0]=Pe,_[1]=Ne,_[2]=Re,_[3]=ge,T.clearBufferiv(T.COLOR,0,_))}else X|=T.COLOR_BUFFER_BIT}U&&(X|=T.DEPTH_BUFFER_BIT),H&&(X|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",ie,!1),we.dispose(),Y.dispose(),Te.dispose(),be.dispose(),vt.dispose(),mt.dispose(),B.dispose(),fe.dispose(),ze.dispose(),Z.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",xn),ae.removeEventListener("sessionend",Yc),fi.stop()};function he(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let y=je.autoReset,U=Se.enabled,H=Se.autoUpdate,X=Se.needsUpdate,N=Se.type;P(),je.autoReset=y,Se.enabled=U,Se.autoUpdate=H,Se.needsUpdate=X,Se.type=N}function ie(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Q(y){let U=y.target;U.removeEventListener("dispose",Q),Me(U)}function Me(y){Be(y),be.remove(y)}function Be(y){let U=be.get(y).programs;U!==void 0&&(U.forEach(function(H){Z.releaseProgram(H)}),y.isShaderMaterial&&Z.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,H,X,N,re){U===null&&(U=de);let pe=N.isMesh&&N.matrixWorld.determinant()<0,ve=yf(y,U,H,X,N);_e.setMaterial(X,pe);let ge=H.index,Pe=1;if(X.wireframe===!0){if(ge=x.getWireframeAttribute(H),ge===void 0)return;Pe=2}let Ne=H.drawRange,Re=H.attributes.position,Xe=Ne.start*Pe,tt=(Ne.start+Ne.count)*Pe;re!==null&&(Xe=Math.max(Xe,re.start*Pe),tt=Math.min(tt,(re.start+re.count)*Pe)),ge!==null?(Xe=Math.max(Xe,0),tt=Math.min(tt,ge.count)):Re!=null&&(Xe=Math.max(Xe,0),tt=Math.min(tt,Re.count));let ft=tt-Xe;if(ft<0||ft===1/0)return;fe.setup(N,X,ve,H,ge);let lt,rt=me;if(ge!==null&&(lt=S.get(ge),rt=De,rt.setIndex(lt)),N.isMesh)X.wireframe===!0?(_e.setLineWidth(X.wireframeLinewidth*Ge()),rt.setMode(T.LINES)):rt.setMode(T.TRIANGLES);else if(N.isLine){let Ie=X.linewidth;Ie===void 0&&(Ie=1),_e.setLineWidth(Ie*Ge()),N.isLineSegments?rt.setMode(T.LINES):N.isLineLoop?rt.setMode(T.LINE_LOOP):rt.setMode(T.LINE_STRIP)}else N.isPoints?rt.setMode(T.POINTS):N.isSprite&&rt.setMode(T.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)ts("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),rt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Le.get("WEBGL_multi_draw"))rt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let Ie=N._multiDrawStarts,ht=N._multiDrawCounts,Je=N._multiDrawCount,zt=ge?S.get(ge).bytesPerElement:1,Bi=be.get(X).currentProgram.getUniforms();for(let Vt=0;Vt<Je;Vt++)Bi.setValue(T,"_gl_DrawID",Vt),rt.render(Ie[Vt]/zt,ht[Vt])}else if(N.isInstancedMesh)rt.renderInstances(Xe,ft,N.count);else if(H.isInstancedBufferGeometry){let Ie=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,ht=Math.min(H.instanceCount,Ie);rt.renderInstances(Xe,ft,ht)}else rt.render(Xe,ft)};function ot(y,U,H){y.transparent===!0&&y.side===$t&&y.forceSinglePass===!1?(y.side=wt,y.needsUpdate=!0,Tr(y,U,H),y.side=Fn,y.needsUpdate=!0,Tr(y,U,H),y.side=$t):Tr(y,U,H)}this.compile=function(y,U,H=null){H===null&&(H=y),f=Te.get(H),f.init(U),w.push(f),H.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),y!==H&&y.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();let X=new Set;return y.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let re=N.material;if(re)if(Array.isArray(re))for(let pe=0;pe<re.length;pe++){let ve=re[pe];ot(ve,H,N),X.add(ve)}else ot(re,H,N),X.add(re)}),f=w.pop(),X},this.compileAsync=function(y,U,H=null){let X=this.compile(y,U,H);return new Promise(N=>{function re(){if(X.forEach(function(pe){be.get(pe).currentProgram.isReady()&&X.delete(pe)}),X.size===0){N(y);return}setTimeout(re,10)}Le.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Ze=null;function Cn(y){Ze&&Ze(y)}function xn(){fi.stop()}function Yc(){fi.start()}let fi=new Wu;fi.setAnimationLoop(Cn),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(y){Ze=y,ae.setAnimationLoop(y),y===null?fi.stop():fi.start()},ae.addEventListener("sessionstart",xn),ae.addEventListener("sessionend",Yc),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(U),U=ae.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,U,F),f=Te.get(y,w.length),f.init(U),w.push(f),k.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),xe.setFromProjectionMatrix(k,hn,U.reversedDepth),V=this.localClippingEnabled,Ae=le.init(this.clippingPlanes,V),m=Y.get(y,E.length),m.init(),E.push(m),ae.enabled===!0&&ae.isPresenting===!0){let re=M.xr.getDepthSensingMesh();re!==null&&Za(re,U,-1/0,M.sortObjects)}Za(y,U,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(se,O),Fe=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Fe&&we.addToRenderList(m,y),this.info.render.frame++,Ae===!0&&le.beginShadows();let H=f.state.shadowsArray;Se.render(H,y,U),Ae===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){let re=U.cameras;if(N.length>0)for(let pe=0,ve=re.length;pe<ve;pe++){let ge=re[pe];Jc(X,N,y,ge)}Fe&&we.render(y);for(let pe=0,ve=re.length;pe<ve;pe++){let ge=re[pe];$c(m,y,ge,ge.viewport)}}else N.length>0&&Jc(X,N,y,U),Fe&&we.render(y),$c(m,y,U);F!==null&&R===0&&(Ve.updateMultisampleRenderTarget(F),Ve.updateRenderTargetMipmap(F)),y.isScene===!0&&y.onAfterRender(M,y,U),fe.resetDefaultState(),b=-1,v=null,w.pop(),w.length>0?(f=w[w.length-1],Ae===!0&&le.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Za(y,U,H,X){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)H=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)f.pushLight(y),y.castShadow&&f.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||xe.intersectsSprite(y)){X&&ue.setFromMatrixPosition(y.matrixWorld).applyMatrix4(k);let pe=B.update(y),ve=y.material;ve.visible&&m.push(y,pe,ve,H,ue.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||xe.intersectsObject(y))){let pe=B.update(y),ve=y.material;if(X&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ue.copy(y.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),ue.copy(pe.boundingSphere.center)),ue.applyMatrix4(y.matrixWorld).applyMatrix4(k)),Array.isArray(ve)){let ge=pe.groups;for(let Pe=0,Ne=ge.length;Pe<Ne;Pe++){let Re=ge[Pe],Xe=ve[Re.materialIndex];Xe&&Xe.visible&&m.push(y,pe,Xe,H,ue.z,Re)}}else ve.visible&&m.push(y,pe,ve,H,ue.z,null)}}let re=y.children;for(let pe=0,ve=re.length;pe<ve;pe++)Za(re[pe],U,H,X)}function $c(y,U,H,X){let N=y.opaque,re=y.transmissive,pe=y.transparent;f.setupLightsView(H),Ae===!0&&le.setGlobalState(M.clippingPlanes,H),X&&_e.viewport(I.copy(X)),N.length>0&&Er(N,U,H),re.length>0&&Er(re,U,H),pe.length>0&&Er(pe,U,H),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function Jc(y,U,H,X){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new yn(1,1,{generateMipmaps:!0,type:Le.has("EXT_color_buffer_half_float")||Le.has("EXT_color_buffer_float")?hs:bn,minFilter:ri,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));let re=f.state.transmissionRenderTarget[X.id],pe=X.viewport||I;re.setSize(pe.z*M.transmissionResolutionScale,pe.w*M.transmissionResolutionScale);let ve=M.getRenderTarget(),ge=M.getActiveCubeFace(),Pe=M.getActiveMipmapLevel();M.setRenderTarget(re),M.getClearColor(J),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),Fe&&we.render(H);let Ne=M.toneMapping;M.toneMapping=Hn;let Re=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),Ae===!0&&le.setGlobalState(M.clippingPlanes,X),Er(y,H,X),Ve.updateMultisampleRenderTarget(re),Ve.updateRenderTargetMipmap(re),Le.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let tt=0,ft=U.length;tt<ft;tt++){let lt=U[tt],rt=lt.object,Ie=lt.geometry,ht=lt.material,Je=lt.group;if(ht.side===$t&&rt.layers.test(X.layers)){let zt=ht.side;ht.side=wt,ht.needsUpdate=!0,Zc(rt,H,X,Ie,ht,Je),ht.side=zt,ht.needsUpdate=!0,Xe=!0}}Xe===!0&&(Ve.updateMultisampleRenderTarget(re),Ve.updateRenderTargetMipmap(re))}M.setRenderTarget(ve,ge,Pe),M.setClearColor(J,K),Re!==void 0&&(X.viewport=Re),M.toneMapping=Ne}function Er(y,U,H){let X=U.isScene===!0?U.overrideMaterial:null;for(let N=0,re=y.length;N<re;N++){let pe=y[N],ve=pe.object,ge=pe.geometry,Pe=pe.group,Ne=pe.material;Ne.allowOverride===!0&&X!==null&&(Ne=X),ve.layers.test(H.layers)&&Zc(ve,U,H,ge,Ne,Pe)}}function Zc(y,U,H,X,N,re){y.onBeforeRender(M,U,H,X,N,re),y.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),N.onBeforeRender(M,U,H,X,y,re),N.transparent===!0&&N.side===$t&&N.forceSinglePass===!1?(N.side=wt,N.needsUpdate=!0,M.renderBufferDirect(H,U,X,N,y,re),N.side=Fn,N.needsUpdate=!0,M.renderBufferDirect(H,U,X,N,y,re),N.side=$t):M.renderBufferDirect(H,U,X,N,y,re),y.onAfterRender(M,U,H,X,N,re)}function Tr(y,U,H){U.isScene!==!0&&(U=de);let X=be.get(y),N=f.state.lights,re=f.state.shadowsArray,pe=N.state.version,ve=Z.getParameters(y,N.state,re,U,H),ge=Z.getProgramCacheKey(ve),Pe=X.programs;X.environment=y.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(y.isMeshStandardMaterial?mt:vt).get(y.envMap||X.environment),X.envMapRotation=X.environment!==null&&y.envMap===null?U.environmentRotation:y.envMapRotation,Pe===void 0&&(y.addEventListener("dispose",Q),Pe=new Map,X.programs=Pe);let Ne=Pe.get(ge);if(Ne!==void 0){if(X.currentProgram===Ne&&X.lightsStateVersion===pe)return jc(y,ve),Ne}else ve.uniforms=Z.getUniforms(y),y.onBeforeCompile(ve,M),Ne=Z.acquireProgram(ve,ge),Pe.set(ge,Ne),X.uniforms=ve.uniforms;let Re=X.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Re.clippingPlanes=le.uniform),jc(y,ve),X.needsLights=Mf(y),X.lightsStateVersion=pe,X.needsLights&&(Re.ambientLightColor.value=N.state.ambient,Re.lightProbe.value=N.state.probe,Re.directionalLights.value=N.state.directional,Re.directionalLightShadows.value=N.state.directionalShadow,Re.spotLights.value=N.state.spot,Re.spotLightShadows.value=N.state.spotShadow,Re.rectAreaLights.value=N.state.rectArea,Re.ltc_1.value=N.state.rectAreaLTC1,Re.ltc_2.value=N.state.rectAreaLTC2,Re.pointLights.value=N.state.point,Re.pointLightShadows.value=N.state.pointShadow,Re.hemisphereLights.value=N.state.hemi,Re.directionalShadowMap.value=N.state.directionalShadowMap,Re.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Re.spotShadowMap.value=N.state.spotShadowMap,Re.spotLightMatrix.value=N.state.spotLightMatrix,Re.spotLightMap.value=N.state.spotLightMap,Re.pointShadowMap.value=N.state.pointShadowMap,Re.pointShadowMatrix.value=N.state.pointShadowMatrix),X.currentProgram=Ne,X.uniformsList=null,Ne}function Kc(y){if(y.uniformsList===null){let U=y.currentProgram.getUniforms();y.uniformsList=ms.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function jc(y,U){let H=be.get(y);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.batchingColor=U.batchingColor,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.instancingMorph=U.instancingMorph,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function yf(y,U,H,X,N){U.isScene!==!0&&(U=de),Ve.resetTextureUnits();let re=U.fog,pe=X.isMeshStandardMaterial?U.environment:null,ve=F===null?M.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Mi,ge=(X.isMeshStandardMaterial?mt:vt).get(X.envMap||pe),Pe=X.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ne=!!H.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Re=!!H.morphAttributes.position,Xe=!!H.morphAttributes.normal,tt=!!H.morphAttributes.color,ft=Hn;X.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(ft=M.toneMapping);let lt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,rt=lt!==void 0?lt.length:0,Ie=be.get(X),ht=f.state.lights;if(Ae===!0&&(V===!0||y!==v)){let Dt=y===v&&X.id===b;le.setState(X,y,Dt)}let Je=!1;X.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==ht.state.version||Ie.outputColorSpace!==ve||N.isBatchedMesh&&Ie.batching===!1||!N.isBatchedMesh&&Ie.batching===!0||N.isBatchedMesh&&Ie.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ie.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ie.instancing===!1||!N.isInstancedMesh&&Ie.instancing===!0||N.isSkinnedMesh&&Ie.skinning===!1||!N.isSkinnedMesh&&Ie.skinning===!0||N.isInstancedMesh&&Ie.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ie.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ie.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ie.instancingMorph===!1&&N.morphTexture!==null||Ie.envMap!==ge||X.fog===!0&&Ie.fog!==re||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==le.numPlanes||Ie.numIntersection!==le.numIntersection)||Ie.vertexAlphas!==Pe||Ie.vertexTangents!==Ne||Ie.morphTargets!==Re||Ie.morphNormals!==Xe||Ie.morphColors!==tt||Ie.toneMapping!==ft||Ie.morphTargetsCount!==rt)&&(Je=!0):(Je=!0,Ie.__version=X.version);let zt=Ie.currentProgram;Je===!0&&(zt=Tr(X,U,N));let Bi=!1,Vt=!1,Cs=!1,ut=zt.getUniforms(),Kt=Ie.uniforms;if(_e.useProgram(zt.program)&&(Bi=!0,Vt=!0,Cs=!0),X.id!==b&&(b=X.id,Vt=!0),Bi||v!==y){_e.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ut.setValue(T,"projectionMatrix",y.projectionMatrix),ut.setValue(T,"viewMatrix",y.matrixWorldInverse);let Ft=ut.map.cameraPosition;Ft!==void 0&&Ft.setValue(T,ee.setFromMatrixPosition(y.matrixWorld)),Ce.logarithmicDepthBuffer&&ut.setValue(T,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ut.setValue(T,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,Vt=!0,Cs=!0)}if(N.isSkinnedMesh){ut.setOptional(T,N,"bindMatrix"),ut.setOptional(T,N,"bindMatrixInverse");let Dt=N.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),ut.setValue(T,"boneTexture",Dt.boneTexture,Ve))}N.isBatchedMesh&&(ut.setOptional(T,N,"batchingTexture"),ut.setValue(T,"batchingTexture",N._matricesTexture,Ve),ut.setOptional(T,N,"batchingIdTexture"),ut.setValue(T,"batchingIdTexture",N._indirectTexture,Ve),ut.setOptional(T,N,"batchingColorTexture"),N._colorsTexture!==null&&ut.setValue(T,"batchingColorTexture",N._colorsTexture,Ve));let jt=H.morphAttributes;if((jt.position!==void 0||jt.normal!==void 0||jt.color!==void 0)&&oe.update(N,H,zt),(Vt||Ie.receiveShadow!==N.receiveShadow)&&(Ie.receiveShadow=N.receiveShadow,ut.setValue(T,"receiveShadow",N.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Kt.envMap.value=ge,Kt.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(Kt.envMapIntensity.value=U.environmentIntensity),Vt&&(ut.setValue(T,"toneMappingExposure",M.toneMappingExposure),Ie.needsLights&&vf(Kt,Cs),re&&X.fog===!0&&te.refreshFogUniforms(Kt,re),te.refreshMaterialUniforms(Kt,X,G,j,f.state.transmissionRenderTarget[y.id]),ms.upload(T,Kc(Ie),Kt,Ve)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ms.upload(T,Kc(Ie),Kt,Ve),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ut.setValue(T,"center",N.center),ut.setValue(T,"modelViewMatrix",N.modelViewMatrix),ut.setValue(T,"normalMatrix",N.normalMatrix),ut.setValue(T,"modelMatrix",N.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let Dt=X.uniformsGroups;for(let Ft=0,Ka=Dt.length;Ft<Ka;Ft++){let pi=Dt[Ft];ze.update(pi,zt),ze.bind(pi,zt)}}return zt}function vf(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function Mf(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(y,U,H){let X=be.get(y);X.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),be.get(y.texture).__webglTexture=U,be.get(y.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:H,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,U){let H=be.get(y);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0};let bf=T.createFramebuffer();this.setRenderTarget=function(y,U=0,H=0){F=y,A=U,R=H;let X=!0,N=null,re=!1,pe=!1;if(y){let ge=be.get(y);if(ge.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(T.FRAMEBUFFER,null),X=!1;else if(ge.__webglFramebuffer===void 0)Ve.setupRenderTarget(y);else if(ge.__hasExternalTextures)Ve.rebindTextures(y,be.get(y.texture).__webglTexture,be.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let Re=y.depthTexture;if(ge.__boundDepthTexture!==Re){if(Re!==null&&be.has(Re)&&(y.width!==Re.image.width||y.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ve.setupDepthRenderbuffer(y)}}let Pe=y.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(pe=!0);let Ne=be.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ne[U])?N=Ne[U][H]:N=Ne[U],re=!0):y.samples>0&&Ve.useMultisampledRTT(y)===!1?N=be.get(y).__webglMultisampledFramebuffer:Array.isArray(Ne)?N=Ne[H]:N=Ne,I.copy(y.viewport),z.copy(y.scissor),q=y.scissorTest}else I.copy(W).multiplyScalar(G).floor(),z.copy(ne).multiplyScalar(G).floor(),q=Ue;if(H!==0&&(N=bf),_e.bindFramebuffer(T.FRAMEBUFFER,N)&&X&&_e.drawBuffers(y,N),_e.viewport(I),_e.scissor(z),_e.setScissorTest(q),re){let ge=be.get(y.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,H)}else if(pe){let ge=U;for(let Pe=0;Pe<y.textures.length;Pe++){let Ne=be.get(y.textures[Pe]);T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0+Pe,Ne.__webglTexture,H,ge)}}else if(y!==null&&H!==0){let ge=be.get(y.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,ge.__webglTexture,H)}b=-1},this.readRenderTargetPixels=function(y,U,H,X,N,re,pe,ve=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge){_e.bindFramebuffer(T.FRAMEBUFFER,ge);try{let Pe=y.textures[ve],Ne=Pe.format,Re=Pe.type;if(!Ce.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ce.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-X&&H>=0&&H<=y.height-N&&(y.textures.length>1&&T.readBuffer(T.COLOR_ATTACHMENT0+ve),T.readPixels(U,H,X,N,Ee.convert(Ne),Ee.convert(Re),re))}finally{let Pe=F!==null?be.get(F).__webglFramebuffer:null;_e.bindFramebuffer(T.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(y,U,H,X,N,re,pe,ve=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge)if(U>=0&&U<=y.width-X&&H>=0&&H<=y.height-N){_e.bindFramebuffer(T.FRAMEBUFFER,ge);let Pe=y.textures[ve],Ne=Pe.format,Re=Pe.type;if(!Ce.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ce.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Xe=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,Xe),T.bufferData(T.PIXEL_PACK_BUFFER,re.byteLength,T.STREAM_READ),y.textures.length>1&&T.readBuffer(T.COLOR_ATTACHMENT0+ve),T.readPixels(U,H,X,N,Ee.convert(Ne),Ee.convert(Re),0);let tt=F!==null?be.get(F).__webglFramebuffer:null;_e.bindFramebuffer(T.FRAMEBUFFER,tt);let ft=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await _u(T,ft,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,Xe),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,re),T.deleteBuffer(Xe),T.deleteSync(ft),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,U=null,H=0){let X=Math.pow(2,-H),N=Math.floor(y.image.width*X),re=Math.floor(y.image.height*X),pe=U!==null?U.x:0,ve=U!==null?U.y:0;Ve.setTexture2D(y,0),T.copyTexSubImage2D(T.TEXTURE_2D,H,0,0,pe,ve,N,re),_e.unbindTexture()};let Sf=T.createFramebuffer(),wf=T.createFramebuffer();this.copyTextureToTexture=function(y,U,H=null,X=null,N=0,re=null){re===null&&(N!==0?(ts("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=N,N=0):re=0);let pe,ve,ge,Pe,Ne,Re,Xe,tt,ft,lt=y.isCompressedTexture?y.mipmaps[re]:y.image;if(H!==null)pe=H.max.x-H.min.x,ve=H.max.y-H.min.y,ge=H.isBox3?H.max.z-H.min.z:1,Pe=H.min.x,Ne=H.min.y,Re=H.isBox3?H.min.z:0;else{let jt=Math.pow(2,-N);pe=Math.floor(lt.width*jt),ve=Math.floor(lt.height*jt),y.isDataArrayTexture?ge=lt.depth:y.isData3DTexture?ge=Math.floor(lt.depth*jt):ge=1,Pe=0,Ne=0,Re=0}X!==null?(Xe=X.x,tt=X.y,ft=X.z):(Xe=0,tt=0,ft=0);let rt=Ee.convert(U.format),Ie=Ee.convert(U.type),ht;U.isData3DTexture?(Ve.setTexture3D(U,0),ht=T.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Ve.setTexture2DArray(U,0),ht=T.TEXTURE_2D_ARRAY):(Ve.setTexture2D(U,0),ht=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,U.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,U.unpackAlignment);let Je=T.getParameter(T.UNPACK_ROW_LENGTH),zt=T.getParameter(T.UNPACK_IMAGE_HEIGHT),Bi=T.getParameter(T.UNPACK_SKIP_PIXELS),Vt=T.getParameter(T.UNPACK_SKIP_ROWS),Cs=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,lt.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,lt.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Pe),T.pixelStorei(T.UNPACK_SKIP_ROWS,Ne),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Re);let ut=y.isDataArrayTexture||y.isData3DTexture,Kt=U.isDataArrayTexture||U.isData3DTexture;if(y.isDepthTexture){let jt=be.get(y),Dt=be.get(U),Ft=be.get(jt.__renderTarget),Ka=be.get(Dt.__renderTarget);_e.bindFramebuffer(T.READ_FRAMEBUFFER,Ft.__webglFramebuffer),_e.bindFramebuffer(T.DRAW_FRAMEBUFFER,Ka.__webglFramebuffer);for(let pi=0;pi<ge;pi++)ut&&(T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,be.get(y).__webglTexture,N,Re+pi),T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,be.get(U).__webglTexture,re,ft+pi)),T.blitFramebuffer(Pe,Ne,pe,ve,Xe,tt,pe,ve,T.DEPTH_BUFFER_BIT,T.NEAREST);_e.bindFramebuffer(T.READ_FRAMEBUFFER,null),_e.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else if(N!==0||y.isRenderTargetTexture||be.has(y)){let jt=be.get(y),Dt=be.get(U);_e.bindFramebuffer(T.READ_FRAMEBUFFER,Sf),_e.bindFramebuffer(T.DRAW_FRAMEBUFFER,wf);for(let Ft=0;Ft<ge;Ft++)ut?T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,jt.__webglTexture,N,Re+Ft):T.framebufferTexture2D(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,jt.__webglTexture,N),Kt?T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,Dt.__webglTexture,re,ft+Ft):T.framebufferTexture2D(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,Dt.__webglTexture,re),N!==0?T.blitFramebuffer(Pe,Ne,pe,ve,Xe,tt,pe,ve,T.COLOR_BUFFER_BIT,T.NEAREST):Kt?T.copyTexSubImage3D(ht,re,Xe,tt,ft+Ft,Pe,Ne,pe,ve):T.copyTexSubImage2D(ht,re,Xe,tt,Pe,Ne,pe,ve);_e.bindFramebuffer(T.READ_FRAMEBUFFER,null),_e.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else Kt?y.isDataTexture||y.isData3DTexture?T.texSubImage3D(ht,re,Xe,tt,ft,pe,ve,ge,rt,Ie,lt.data):U.isCompressedArrayTexture?T.compressedTexSubImage3D(ht,re,Xe,tt,ft,pe,ve,ge,rt,lt.data):T.texSubImage3D(ht,re,Xe,tt,ft,pe,ve,ge,rt,Ie,lt):y.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,re,Xe,tt,pe,ve,rt,Ie,lt.data):y.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,re,Xe,tt,lt.width,lt.height,rt,lt.data):T.texSubImage2D(T.TEXTURE_2D,re,Xe,tt,pe,ve,rt,Ie,lt);T.pixelStorei(T.UNPACK_ROW_LENGTH,Je),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,zt),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Bi),T.pixelStorei(T.UNPACK_SKIP_ROWS,Vt),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Cs),re===0&&U.generateMipmaps&&T.generateMipmap(ht),_e.unbindTexture()},this.initRenderTarget=function(y){be.get(y).__webglFramebuffer===void 0&&Ve.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Ve.setTextureCube(y,0):y.isData3DTexture?Ve.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Ve.setTexture2DArray(y,0):Ve.setTexture2D(y,0),_e.unbindTexture()},this.resetState=function(){A=0,R=0,F=null,_e.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}};var Ju=new qt,Sa=new D,xs=class extends tr{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new it(e,3)),this.setAttribute("uv",new it(t,2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new si(t,6,1);return this.setAttribute("instanceStart",new fn(n,3,0)),this.setAttribute("instanceEnd",new fn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new si(t,6,1);return this.setAttribute("instanceColorStart",new fn(n,3,0)),this.setAttribute("instanceColorEnd",new fn(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Qs(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qt);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Ju.setFromBufferAttribute(t),this.boundingBox.union(Ju))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nn),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Sa.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Sa)),Sa.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Sa));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}};ce.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new $e(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Nt.line={uniforms:hr.merge([ce.common,ce.fog,ce.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var ai=class extends St{constructor(e){super({type:"LineMaterial",uniforms:hr.clone(Nt.line.uniforms),vertexShader:Nt.line.vertexShader,fragmentShader:Nt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}};var hc=new st,Zu=new D,Ku=new D,Et=new st,Tt=new st,wn=new st,uc=new D,dc=new dt,At=new nr,ju=new D,wa=new qt,Ea=new nn,En=new st,Tn,Pi;function Qu(i,e,t){return En.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),En.multiplyScalar(1/En.w),En.x=Pi/t.width,En.y=Pi/t.height,En.applyMatrix4(i.projectionMatrixInverse),En.multiplyScalar(1/En.w),Math.abs(Math.max(En.x,En.y))}function rx(i,e){let t=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){At.start.fromBufferAttribute(s,a),At.end.fromBufferAttribute(r,a),At.applyMatrix4(t);let c=new D,h=new D;Tn.distanceSqToSegment(At.start,At.end,h,c),h.distanceTo(c)<Pi*.5&&e.push({point:h,pointOnLine:c,distance:Tn.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function ox(i,e,t){let n=e.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),u=-e.near;Tn.at(1,wn),wn.w=1,wn.applyMatrix4(e.matrixWorldInverse),wn.applyMatrix4(n),wn.multiplyScalar(1/wn.w),wn.x*=r.x/2,wn.y*=r.y/2,wn.z=0,uc.copy(wn),dc.multiplyMatrices(e.matrixWorldInverse,o);for(let d=0,p=h;d<p;d++){if(Et.fromBufferAttribute(l,d),Tt.fromBufferAttribute(c,d),Et.w=1,Tt.w=1,Et.applyMatrix4(dc),Tt.applyMatrix4(dc),Et.z>u&&Tt.z>u)continue;if(Et.z>u){let w=Et.z-Tt.z,M=(Et.z-u)/w;Et.lerp(Tt,M)}else if(Tt.z>u){let w=Tt.z-Et.z,M=(Tt.z-u)/w;Tt.lerp(Et,M)}Et.applyMatrix4(n),Tt.applyMatrix4(n),Et.multiplyScalar(1/Et.w),Tt.multiplyScalar(1/Tt.w),Et.x*=r.x/2,Et.y*=r.y/2,Tt.x*=r.x/2,Tt.y*=r.y/2,At.start.copy(Et),At.start.z=0,At.end.copy(Tt),At.end.z=0;let _=At.closestPointToPointParameter(uc,!0);At.at(_,ju);let m=Jt.lerp(Et.z,Tt.z,_),f=m>=-1&&m<=1,E=uc.distanceTo(ju)<Pi*.5;if(f&&E){At.start.fromBufferAttribute(l,d),At.end.fromBufferAttribute(c,d),At.start.applyMatrix4(o),At.end.applyMatrix4(o);let w=new D,M=new D;Tn.distanceSqToSegment(At.start,At.end,M,w),t.push({point:M,pointOnLine:w,distance:Tn.origin.distanceTo(M),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}var Ta=class extends pt{constructor(e=new xs,t=new ai({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let o=0,a=0,l=t.count;o<l;o++,a+=2)Zu.fromBufferAttribute(t,o),Ku.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Zu.distanceTo(Ku);let r=new si(s,2,1);return e.setAttribute("instanceDistanceStart",new fn(r,1,0)),e.setAttribute("instanceDistanceEnd",new fn(r,1,1)),this}raycast(e,t){let n=this.material.worldUnits,s=e.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Tn=e.ray;let o=this.matrixWorld,a=this.geometry,l=this.material;Pi=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),Ea.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=Pi*.5;else{let u=Math.max(s.near,Ea.distanceToPoint(Tn.origin));c=Qu(s,u,l.resolution)}if(Ea.radius+=c,Tn.intersectsSphere(Ea)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),wa.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=Pi*.5;else{let u=Math.max(s.near,wa.distanceToPoint(Tn.origin));h=Qu(s,u,l.resolution)}wa.expandByScalar(h),Tn.intersectsBox(wa)!==!1&&(n?rx(this,t):ox(this,s,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(hc),this.material.uniforms.resolution.value.set(hc.z,hc.w))}};var _s=class extends xs{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setPositions(n),this}setColors(e){let t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setColors(n),this}setFromPoints(e){let t=e.length-1,n=new Float32Array(6*t);for(let s=0;s<t;s++)n[6*s]=e[s].x,n[6*s+1]=e[s].y,n[6*s+2]=e[s].z||0,n[6*s+3]=e[s+1].x,n[6*s+4]=e[s+1].y,n[6*s+5]=e[s+1].z||0;return super.setPositions(n),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}};var Aa=class extends Ta{constructor(e=new _s,t=new ai({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}};var Ca=new Float32Array([-120.1,77.1,-118.2,77.1,-116.4,77.1,-95.8,77.1,-88.3,77.1,-86.4,77.1,-84.5,77.1,-82.7,77.1,-80.8,77.1,-69.6,77.1,-67.7,77.1,-65.8,77.1,-63.9,77.1,-62.1,77.1,-60.2,77.1,-58.3,77.1,-56.4,77.1,-54.6,77.1,-52.7,77.1,-50.8,77.1,-49,77.1,-47.1,77.1,-45.2,77.1,-43.3,77.1,-41.5,77.1,-39.6,77.1,-37.7,77.1,-35.9,77.1,-34,77.1,-32.1,77.1,-30.2,77.1,-28.4,77.1,-26.5,77.1,-24.6,77.1,-22.8,77.1,-20.9,77.1,-19,77.1,16.6,77.1,102.7,77.1,104.5,77.1,-117.3,75.2,-115.4,75.2,-113.5,75.2,-111.7,75.2,-109.8,75.2,-107.9,75.2,-100.4,75.2,-98.6,75.2,-94.8,75.2,-91.1,75.2,-89.2,75.2,-87.3,75.2,-85.5,75.2,-83.6,75.2,-81.7,75.2,-57.4,75.2,-55.5,75.2,-53.6,75.2,-51.8,75.2,-49.9,75.2,-48,75.2,-46.2,75.2,-44.3,75.2,-42.4,75.2,-40.5,75.2,-38.7,75.2,-36.8,75.2,-34.9,75.2,-33,75.2,-31.2,75.2,-29.3,75.2,-27.4,75.2,-25.6,75.2,-23.7,75.2,-21.8,75.2,56.8,75.2,58.7,75.2,60.6,75.2,88.6,75.2,90.5,75.2,92.4,75.2,94.2,75.2,96.1,75.2,98,75.2,99.9,75.2,101.7,75.2,103.6,75.2,105.5,75.2,107.4,75.2,109.2,75.2,111.1,75.2,113,75.2,137.3,75.2,139.2,75.2,141,75.2,142.9,75.2,146.7,75.2,148.5,75.2,-123.8,73.3,-122,73.3,-120.1,73.3,-118.2,73.3,-116.4,73.3,-105.1,73.3,-101.4,73.3,-99.5,73.3,-97.6,73.3,-95.8,73.3,-93.9,73.3,-92,73.3,-88.3,73.3,-86.4,73.3,-84.5,73.3,-82.7,73.3,-80.8,73.3,-78.9,73.3,-77,73.3,-54.6,73.3,-52.7,73.3,-50.8,73.3,-49,73.3,-47.1,73.3,-45.2,73.3,-43.3,73.3,-41.5,73.3,-39.6,73.3,-37.7,73.3,-35.9,73.3,-34,73.3,-32.1,73.3,-30.2,73.3,-28.4,73.3,-26.5,73.3,-24.6,73.3,-22.8,73.3,54,73.3,55.9,73.3,82.1,73.3,84,73.3,85.8,73.3,87.7,73.3,89.6,73.3,91.4,73.3,93.3,73.3,95.2,73.3,97.1,73.3,98.9,73.3,100.8,73.3,102.7,73.3,104.5,73.3,106.4,73.3,108.3,73.3,110.2,73.3,112,73.3,113.9,73.3,115.8,73.3,117.6,73.3,123.3,73.3,125.1,73.3,127,73.3,140.1,73.3,142,73.3,-123.8,71.4,-122,71.4,-118.2,71.4,-116.4,71.4,-114.5,71.4,-112.6,71.4,-110.7,71.4,-108.9,71.4,-107,71.4,-105.1,71.4,-97.6,71.4,-95.8,71.4,-93.9,71.4,-88.3,71.4,-86.4,71.4,-84.5,71.4,-82.7,71.4,-80.8,71.4,-78.9,71.4,-77,71.4,-75.2,71.4,-52.7,71.4,-50.8,71.4,-49,71.4,-47.1,71.4,-45.2,71.4,-43.3,71.4,-41.5,71.4,-39.6,71.4,-37.7,71.4,-35.9,71.4,-34,71.4,-32.1,71.4,-30.2,71.4,-28.4,71.4,-26.5,71.4,-24.6,71.4,-22.8,71.4,52.1,71.4,54,71.4,69,71.4,70.8,71.4,74.6,71.4,76.5,71.4,78.3,71.4,80.2,71.4,82.1,71.4,84,71.4,85.8,71.4,87.7,71.4,89.6,71.4,91.4,71.4,93.3,71.4,95.2,71.4,97.1,71.4,98.9,71.4,100.8,71.4,102.7,71.4,104.5,71.4,106.4,71.4,108.3,71.4,110.2,71.4,112,71.4,113.9,71.4,115.8,71.4,117.6,71.4,119.5,71.4,121.4,71.4,123.3,71.4,125.1,71.4,127,71.4,128.9,71.4,132.6,71.4,134.5,71.4,136.4,71.4,138.2,71.4,140.1,71.4,142,71.4,143.9,71.4,145.7,71.4,147.6,71.4,149.5,71.4,-161.3,69.6,-159.4,69.6,-157.5,69.6,-155.7,69.6,-153.8,69.6,-151.9,69.6,-150,69.6,-148.2,69.6,-146.3,69.6,-144.4,69.6,-142.6,69.6,-140.7,69.6,-131.3,69.6,-129.5,69.6,-127.6,69.6,-122,69.6,-116.4,69.6,-114.5,69.6,-112.6,69.6,-110.7,69.6,-108.9,69.6,-107,69.6,-105.1,69.6,-103.2,69.6,-101.4,69.6,-97.6,69.6,-93.9,69.6,-92,69.6,-84.5,69.6,-82.7,69.6,-75.2,69.6,-73.3,69.6,-71.4,69.6,-69.6,69.6,-67.7,69.6,-52.7,69.6,-50.8,69.6,-49,69.6,-47.1,69.6,-45.2,69.6,-43.3,69.6,-41.5,69.6,-39.6,69.6,-37.7,69.6,-35.9,69.6,-34,69.6,-32.1,69.6,-30.2,69.6,-28.4,69.6,-26.5,69.6,-24.6,69.6,20.3,69.6,22.2,69.6,24,69.6,25.9,69.6,27.8,69.6,29.7,69.6,31.5,69.6,61.5,69.6,67.1,69.6,69,69.6,70.8,69.6,74.6,69.6,76.5,69.6,78.3,69.6,80.2,69.6,82.1,69.6,84,69.6,85.8,69.6,87.7,69.6,89.6,69.6,91.4,69.6,93.3,69.6,95.2,69.6,97.1,69.6,98.9,69.6,100.8,69.6,102.7,69.6,104.5,69.6,106.4,69.6,108.3,69.6,110.2,69.6,112,69.6,113.9,69.6,115.8,69.6,117.6,69.6,119.5,69.6,121.4,69.6,123.3,69.6,125.1,69.6,127,69.6,128.9,69.6,130.8,69.6,132.6,69.6,134.5,69.6,136.4,69.6,138.2,69.6,140.1,69.6,142,69.6,143.9,69.6,145.7,69.6,147.6,69.6,149.5,69.6,151.3,69.6,153.2,69.6,155.1,69.6,157,69.6,158.8,69.6,162.6,69.6,164.4,69.6,171.9,69.6,173.8,69.6,175.7,69.6,177.6,69.6,-178.1,67.7,-176.3,67.7,-163.2,67.7,-161.3,67.7,-159.4,67.7,-157.5,67.7,-155.7,67.7,-153.8,67.7,-151.9,67.7,-150,67.7,-148.2,67.7,-146.3,67.7,-144.4,67.7,-142.6,67.7,-140.7,67.7,-138.8,67.7,-136.9,67.7,-135.1,67.7,-133.2,67.7,-131.3,67.7,-129.5,67.7,-127.6,67.7,-125.7,67.7,-123.8,67.7,-122,67.7,-120.1,67.7,-118.2,67.7,-116.4,67.7,-114.5,67.7,-112.6,67.7,-110.7,67.7,-107,67.7,-105.1,67.7,-103.2,67.7,-99.5,67.7,-97.6,67.7,-95.8,67.7,-93.9,67.7,-92,67.7,-90.1,67.7,-88.3,67.7,-86.4,67.7,-84.5,67.7,-82.7,67.7,-77,67.7,-75.2,67.7,-71.4,67.7,-69.6,67.7,-67.7,67.7,-65.8,67.7,-52.7,67.7,-50.8,67.7,-49,67.7,-47.1,67.7,-45.2,67.7,-43.3,67.7,-41.5,67.7,-39.6,67.7,-37.7,67.7,-35.9,67.7,-34,67.7,14.7,67.7,16.6,67.7,18.4,67.7,20.3,67.7,22.2,67.7,24,67.7,25.9,67.7,27.8,67.7,29.7,67.7,31.5,67.7,33.4,67.7,35.3,67.7,37.2,67.7,39,67.7,44.6,67.7,46.5,67.7,50.3,67.7,52.1,67.7,54,67.7,55.9,67.7,57.7,67.7,59.6,67.7,61.5,67.7,63.4,67.7,65.2,67.7,67.1,67.7,69,67.7,70.8,67.7,72.7,67.7,76.5,67.7,78.3,67.7,80.2,67.7,82.1,67.7,84,67.7,85.8,67.7,87.7,67.7,89.6,67.7,91.4,67.7,93.3,67.7,95.2,67.7,97.1,67.7,98.9,67.7,100.8,67.7,102.7,67.7,104.5,67.7,106.4,67.7,108.3,67.7,110.2,67.7,112,67.7,113.9,67.7,115.8,67.7,117.6,67.7,119.5,67.7,121.4,67.7,123.3,67.7,125.1,67.7,127,67.7,128.9,67.7,130.8,67.7,132.6,67.7,134.5,67.7,136.4,67.7,138.2,67.7,140.1,67.7,142,67.7,143.9,67.7,145.7,67.7,147.6,67.7,149.5,67.7,151.3,67.7,153.2,67.7,155.1,67.7,157,67.7,158.8,67.7,160.7,67.7,162.6,67.7,164.4,67.7,166.3,67.7,168.2,67.7,170.1,67.7,171.9,67.7,173.8,67.7,175.7,67.7,177.6,67.7,179.4,67.7,-177.2,65.8,-175.3,65.8,-173.4,65.8,-171.6,65.8,-166,65.8,-164.1,65.8,-162.2,65.8,-160.3,65.8,-158.5,65.8,-156.6,65.8,-154.7,65.8,-152.9,65.8,-151,65.8,-149.1,65.8,-147.2,65.8,-145.4,65.8,-143.5,65.8,-141.6,65.8,-139.8,65.8,-137.9,65.8,-136,65.8,-134.1,65.8,-132.3,65.8,-130.4,65.8,-128.5,65.8,-126.6,65.8,-124.8,65.8,-122.9,65.8,-121,65.8,-119.2,65.8,-117.3,65.8,-115.4,65.8,-113.5,65.8,-111.7,65.8,-109.8,65.8,-107.9,65.8,-106.1,65.8,-104.2,65.8,-102.3,65.8,-100.4,65.8,-98.6,65.8,-96.7,65.8,-94.8,65.8,-93,65.8,-91.1,65.8,-89.2,65.8,-87.3,65.8,-74.2,65.8,-72.4,65.8,-70.5,65.8,-68.6,65.8,-64.9,65.8,-63,65.8,-51.8,65.8,-49.9,65.8,-48,65.8,-46.2,65.8,-44.3,65.8,-42.4,65.8,-40.5,65.8,-38.7,65.8,-23.7,65.8,-21.8,65.8,-19.9,65.8,-18.1,65.8,-16.2,65.8,13.8,65.8,15.6,65.8,17.5,65.8,19.4,65.8,21.2,65.8,25,65.8,26.9,65.8,28.7,65.8,30.6,65.8,32.5,65.8,34.3,65.8,41.8,65.8,43.7,65.8,45.6,65.8,47.4,65.8,49.3,65.8,51.2,65.8,53.1,65.8,54.9,65.8,56.8,65.8,58.7,65.8,60.6,65.8,62.4,65.8,64.3,65.8,66.2,65.8,68,65.8,69.9,65.8,71.8,65.8,73.7,65.8,75.5,65.8,77.4,65.8,79.3,65.8,81.1,65.8,83,65.8,84.9,65.8,86.8,65.8,88.6,65.8,90.5,65.8,92.4,65.8,94.2,65.8,96.1,65.8,98,65.8,99.9,65.8,101.7,65.8,103.6,65.8,105.5,65.8,107.4,65.8,109.2,65.8,111.1,65.8,113,65.8,114.8,65.8,116.7,65.8,118.6,65.8,120.5,65.8,122.3,65.8,124.2,65.8,126.1,65.8,127.9,65.8,129.8,65.8,131.7,65.8,133.6,65.8,135.4,65.8,137.3,65.8,139.2,65.8,141,65.8,142.9,65.8,144.8,65.8,146.7,65.8,148.5,65.8,150.4,65.8,152.3,65.8,154.2,65.8,156,65.8,157.9,65.8,159.8,65.8,161.6,65.8,163.5,65.8,165.4,65.8,167.3,65.8,169.1,65.8,171,65.8,172.9,65.8,174.7,65.8,176.6,65.8,178.5,65.8,-160.3,64,-158.5,64,-156.6,64,-154.7,64,-152.9,64,-151,64,-149.1,64,-147.2,64,-145.4,64,-143.5,64,-141.6,64,-139.8,64,-137.9,64,-136,64,-134.1,64,-132.3,64,-130.4,64,-128.5,64,-126.6,64,-124.8,64,-122.9,64,-121,64,-119.2,64,-117.3,64,-115.4,64,-113.5,64,-111.7,64,-109.8,64,-107.9,64,-106.1,64,-104.2,64,-102.3,64,-100.4,64,-98.6,64,-96.7,64,-94.8,64,-93,64,-91.1,64,-85.5,64,-83.6,64,-81.7,64,-72.4,64,-70.5,64,-68.6,64,-66.7,64,-51.8,64,-49.9,64,-48,64,-46.2,64,-44.3,64,-42.4,64,-21.8,64,-19.9,64,-18.1,64,10,64,11.9,64,13.8,64,15.6,64,17.5,64,19.4,64,23.1,64,25,64,26.9,64,28.7,64,30.6,64,32.5,64,34.3,64,36.2,64,38.1,64,40,64,41.8,64,43.7,64,45.6,64,47.4,64,49.3,64,51.2,64,53.1,64,54.9,64,56.8,64,58.7,64,60.6,64,62.4,64,64.3,64,66.2,64,68,64,69.9,64,71.8,64,73.7,64,75.5,64,77.4,64,79.3,64,81.1,64,83,64,84.9,64,86.8,64,88.6,64,90.5,64,92.4,64,94.2,64,96.1,64,98,64,99.9,64,101.7,64,103.6,64,105.5,64,107.4,64,109.2,64,111.1,64,113,64,114.8,64,116.7,64,118.6,64,120.5,64,122.3,64,124.2,64,126.1,64,127.9,64,129.8,64,131.7,64,133.6,64,135.4,64,137.3,64,139.2,64,141,64,142.9,64,144.8,64,146.7,64,148.5,64,150.4,64,152.3,64,154.2,64,156,64,157.9,64,159.8,64,161.6,64,163.5,64,165.4,64,167.3,64,169.1,64,171,64,172.9,64,174.7,64,176.6,64,-165,62.1,-163.2,62.1,-161.3,62.1,-159.4,62.1,-157.5,62.1,-155.7,62.1,-153.8,62.1,-151.9,62.1,-150,62.1,-148.2,62.1,-146.3,62.1,-144.4,62.1,-142.6,62.1,-140.7,62.1,-138.8,62.1,-136.9,62.1,-135.1,62.1,-133.2,62.1,-131.3,62.1,-129.5,62.1,-127.6,62.1,-125.7,62.1,-123.8,62.1,-122,62.1,-120.1,62.1,-118.2,62.1,-116.4,62.1,-114.5,62.1,-112.6,62.1,-110.7,62.1,-108.9,62.1,-107,62.1,-105.1,62.1,-103.2,62.1,-101.4,62.1,-99.5,62.1,-97.6,62.1,-95.8,62.1,-93.9,62.1,-77,62.1,-75.2,62.1,-73.3,62.1,-49,62.1,-47.1,62.1,-45.2,62.1,-43.3,62.1,5.3,62.1,7.2,62.1,9.1,62.1,10.9,62.1,12.8,62.1,14.7,62.1,16.6,62.1,22.2,62.1,24,62.1,25.9,62.1,27.8,62.1,29.7,62.1,31.5,62.1,33.4,62.1,35.3,62.1,37.2,62.1,39,62.1,40.9,62.1,42.8,62.1,44.6,62.1,46.5,62.1,48.4,62.1,50.3,62.1,52.1,62.1,54,62.1,55.9,62.1,57.7,62.1,59.6,62.1,61.5,62.1,63.4,62.1,65.2,62.1,67.1,62.1,69,62.1,70.8,62.1,72.7,62.1,74.6,62.1,76.5,62.1,78.3,62.1,80.2,62.1,82.1,62.1,84,62.1,85.8,62.1,87.7,62.1,89.6,62.1,91.4,62.1,93.3,62.1,95.2,62.1,97.1,62.1,98.9,62.1,100.8,62.1,102.7,62.1,104.5,62.1,106.4,62.1,108.3,62.1,110.2,62.1,112,62.1,113.9,62.1,115.8,62.1,117.6,62.1,119.5,62.1,121.4,62.1,123.3,62.1,125.1,62.1,127,62.1,128.9,62.1,130.8,62.1,132.6,62.1,134.5,62.1,136.4,62.1,138.2,62.1,140.1,62.1,142,62.1,143.9,62.1,145.7,62.1,147.6,62.1,149.5,62.1,151.3,62.1,153.2,62.1,155.1,62.1,157,62.1,158.8,62.1,160.7,62.1,162.6,62.1,164.4,62.1,166.3,62.1,168.2,62.1,170.1,62.1,171.9,62.1,173.8,62.1,175.7,62.1,-166,60.2,-164.1,60.2,-162.2,60.2,-160.3,60.2,-158.5,60.2,-156.6,60.2,-154.7,60.2,-152.9,60.2,-151,60.2,-149.1,60.2,-143.5,60.2,-141.6,60.2,-139.8,60.2,-137.9,60.2,-136,60.2,-134.1,60.2,-132.3,60.2,-130.4,60.2,-128.5,60.2,-126.6,60.2,-124.8,60.2,-122.9,60.2,-121,60.2,-119.2,60.2,-117.3,60.2,-115.4,60.2,-113.5,60.2,-111.7,60.2,-109.8,60.2,-107.9,60.2,-106.1,60.2,-104.2,60.2,-102.3,60.2,-100.4,60.2,-98.6,60.2,-96.7,60.2,-94.8,60.2,-76.1,60.2,-74.2,60.2,-72.4,60.2,-70.5,60.2,-44.3,60.2,6.3,60.2,8.1,60.2,10,60.2,11.9,60.2,13.8,60.2,15.6,60.2,17.5,60.2,23.1,60.2,25,60.2,28.7,60.2,30.6,60.2,32.5,60.2,34.3,60.2,36.2,60.2,38.1,60.2,40,60.2,41.8,60.2,43.7,60.2,45.6,60.2,47.4,60.2,49.3,60.2,51.2,60.2,53.1,60.2,54.9,60.2,56.8,60.2,58.7,60.2,60.6,60.2,62.4,60.2,64.3,60.2,66.2,60.2,68,60.2,69.9,60.2,71.8,60.2,73.7,60.2,75.5,60.2,77.4,60.2,79.3,60.2,81.1,60.2,83,60.2,84.9,60.2,86.8,60.2,88.6,60.2,90.5,60.2,92.4,60.2,94.2,60.2,96.1,60.2,98,60.2,99.9,60.2,101.7,60.2,103.6,60.2,105.5,60.2,107.4,60.2,109.2,60.2,111.1,60.2,113,60.2,114.8,60.2,116.7,60.2,118.6,60.2,120.5,60.2,122.3,60.2,124.2,60.2,126.1,60.2,127.9,60.2,129.8,60.2,131.7,60.2,133.6,60.2,135.4,60.2,137.3,60.2,139.2,60.2,141,60.2,142.9,60.2,144.8,60.2,146.7,60.2,148.5,60.2,150.4,60.2,152.3,60.2,154.2,60.2,163.5,60.2,165.4,60.2,167.3,60.2,-155.7,58.3,-136.9,58.3,-135.1,58.3,-133.2,58.3,-131.3,58.3,-129.5,58.3,-127.6,58.3,-125.7,58.3,-123.8,58.3,-122,58.3,-120.1,58.3,-118.2,58.3,-116.4,58.3,-114.5,58.3,-112.6,58.3,-110.7,58.3,-108.9,58.3,-107,58.3,-105.1,58.3,-103.2,58.3,-101.4,58.3,-99.5,58.3,-97.6,58.3,-95.8,58.3,-93.9,58.3,-77,58.3,-75.2,58.3,-73.3,58.3,-71.4,58.3,-69.6,58.3,-65.8,58.3,-63.9,58.3,-4,58.3,7.2,58.3,12.8,58.3,14.7,58.3,16.6,58.3,24,58.3,25.9,58.3,27.8,58.3,29.7,58.3,31.5,58.3,33.4,58.3,35.3,58.3,37.2,58.3,39,58.3,40.9,58.3,42.8,58.3,44.6,58.3,46.5,58.3,48.4,58.3,50.3,58.3,52.1,58.3,54,58.3,55.9,58.3,57.7,58.3,59.6,58.3,61.5,58.3,63.4,58.3,65.2,58.3,67.1,58.3,69,58.3,70.8,58.3,72.7,58.3,74.6,58.3,76.5,58.3,78.3,58.3,80.2,58.3,82.1,58.3,84,58.3,85.8,58.3,87.7,58.3,89.6,58.3,91.4,58.3,93.3,58.3,95.2,58.3,97.1,58.3,98.9,58.3,100.8,58.3,102.7,58.3,104.5,58.3,106.4,58.3,108.3,58.3,110.2,58.3,112,58.3,113.9,58.3,115.8,58.3,117.6,58.3,119.5,58.3,121.4,58.3,123.3,58.3,125.1,58.3,127,58.3,128.9,58.3,130.8,58.3,132.6,58.3,134.5,58.3,136.4,58.3,138.2,58.3,140.1,58.3,158.8,58.3,160.7,58.3,-158.5,56.5,-132.3,56.5,-130.4,56.5,-128.5,56.5,-126.6,56.5,-124.8,56.5,-122.9,56.5,-121,56.5,-119.2,56.5,-117.3,56.5,-115.4,56.5,-113.5,56.5,-111.7,56.5,-109.8,56.5,-107.9,56.5,-106.1,56.5,-104.2,56.5,-102.3,56.5,-100.4,56.5,-98.6,56.5,-96.7,56.5,-94.8,56.5,-93,56.5,-91.1,56.5,-89.2,56.5,-76.1,56.5,-74.2,56.5,-72.4,56.5,-70.5,56.5,-68.6,56.5,-66.7,56.5,-64.9,56.5,-63,56.5,-5,56.5,-3.1,56.5,8.1,56.5,10,56.5,13.8,56.5,15.6,56.5,21.2,56.5,23.1,56.5,25,56.5,26.9,56.5,28.7,56.5,30.6,56.5,32.5,56.5,34.3,56.5,36.2,56.5,38.1,56.5,40,56.5,41.8,56.5,43.7,56.5,45.6,56.5,47.4,56.5,49.3,56.5,51.2,56.5,53.1,56.5,54.9,56.5,56.8,56.5,58.7,56.5,60.6,56.5,62.4,56.5,64.3,56.5,66.2,56.5,68,56.5,69.9,56.5,71.8,56.5,73.7,56.5,75.5,56.5,77.4,56.5,79.3,56.5,81.1,56.5,83,56.5,84.9,56.5,86.8,56.5,88.6,56.5,90.5,56.5,92.4,56.5,94.2,56.5,96.1,56.5,98,56.5,99.9,56.5,101.7,56.5,103.6,56.5,105.5,56.5,107.4,56.5,109.2,56.5,111.1,56.5,113,56.5,114.8,56.5,116.7,56.5,118.6,56.5,120.5,56.5,122.3,56.5,124.2,56.5,126.1,56.5,127.9,56.5,129.8,56.5,131.7,56.5,133.6,56.5,135.4,56.5,137.3,56.5,156,56.5,157.9,56.5,159.8,56.5,161.6,56.5,-129.5,54.6,-127.6,54.6,-125.7,54.6,-123.8,54.6,-122,54.6,-120.1,54.6,-118.2,54.6,-116.4,54.6,-114.5,54.6,-112.6,54.6,-110.7,54.6,-108.9,54.6,-107,54.6,-105.1,54.6,-103.2,54.6,-101.4,54.6,-99.5,54.6,-97.6,54.6,-95.8,54.6,-93.9,54.6,-92,54.6,-90.1,54.6,-88.3,54.6,-86.4,54.6,-84.5,54.6,-82.7,54.6,-78.9,54.6,-77,54.6,-75.2,54.6,-73.3,54.6,-71.4,54.6,-69.6,54.6,-67.7,54.6,-65.8,54.6,-63.9,54.6,-62.1,54.6,-60.2,54.6,-58.3,54.6,-7.8,54.6,-5.9,54.6,-2.2,54.6,9.1,54.6,18.4,54.6,20.3,54.6,22.2,54.6,24,54.6,25.9,54.6,27.8,54.6,29.7,54.6,31.5,54.6,33.4,54.6,35.3,54.6,37.2,54.6,39,54.6,40.9,54.6,42.8,54.6,44.6,54.6,46.5,54.6,48.4,54.6,50.3,54.6,52.1,54.6,54,54.6,55.9,54.6,57.7,54.6,59.6,54.6,61.5,54.6,63.4,54.6,65.2,54.6,67.1,54.6,69,54.6,70.8,54.6,72.7,54.6,74.6,54.6,76.5,54.6,78.3,54.6,80.2,54.6,82.1,54.6,84,54.6,85.8,54.6,87.7,54.6,89.6,54.6,91.4,54.6,93.3,54.6,95.2,54.6,97.1,54.6,98.9,54.6,100.8,54.6,102.7,54.6,104.5,54.6,106.4,54.6,108.3,54.6,110.2,54.6,112,54.6,113.9,54.6,115.8,54.6,117.6,54.6,119.5,54.6,121.4,54.6,123.3,54.6,125.1,54.6,127,54.6,128.9,54.6,130.8,54.6,132.6,54.6,134.5,54.6,136.4,54.6,157,54.6,158.8,54.6,160.7,54.6,-128.5,52.7,-126.6,52.7,-124.8,52.7,-122.9,52.7,-121,52.7,-119.2,52.7,-117.3,52.7,-115.4,52.7,-113.5,52.7,-111.7,52.7,-109.8,52.7,-107.9,52.7,-106.1,52.7,-104.2,52.7,-102.3,52.7,-100.4,52.7,-98.6,52.7,-96.7,52.7,-94.8,52.7,-93,52.7,-91.1,52.7,-89.2,52.7,-87.3,52.7,-85.5,52.7,-83.6,52.7,-78,52.7,-76.1,52.7,-74.2,52.7,-72.4,52.7,-70.5,52.7,-68.6,52.7,-66.7,52.7,-64.9,52.7,-63,52.7,-61.1,52.7,-59.3,52.7,-57.4,52.7,-8.7,52.7,-6.8,52.7,-3.1,52.7,-1.2,52.7,.6,52.7,6.3,52.7,8.1,52.7,10,52.7,11.9,52.7,13.8,52.7,15.6,52.7,17.5,52.7,19.4,52.7,21.2,52.7,23.1,52.7,25,52.7,26.9,52.7,28.7,52.7,30.6,52.7,32.5,52.7,34.3,52.7,36.2,52.7,38.1,52.7,40,52.7,41.8,52.7,43.7,52.7,45.6,52.7,47.4,52.7,49.3,52.7,51.2,52.7,53.1,52.7,54.9,52.7,56.8,52.7,58.7,52.7,60.6,52.7,62.4,52.7,64.3,52.7,66.2,52.7,68,52.7,69.9,52.7,71.8,52.7,73.7,52.7,75.5,52.7,77.4,52.7,79.3,52.7,81.1,52.7,83,52.7,84.9,52.7,86.8,52.7,88.6,52.7,90.5,52.7,92.4,52.7,94.2,52.7,96.1,52.7,98,52.7,99.9,52.7,101.7,52.7,103.6,52.7,105.5,52.7,107.4,52.7,109.2,52.7,111.1,52.7,113,52.7,114.8,52.7,116.7,52.7,118.6,52.7,120.5,52.7,122.3,52.7,124.2,52.7,126.1,52.7,127.9,52.7,129.8,52.7,131.7,52.7,133.6,52.7,135.4,52.7,137.3,52.7,139.2,52.7,141,52.7,142.9,52.7,157.9,52.7,-125.7,50.9,-123.8,50.9,-122,50.9,-120.1,50.9,-118.2,50.9,-116.4,50.9,-114.5,50.9,-112.6,50.9,-110.7,50.9,-108.9,50.9,-107,50.9,-105.1,50.9,-103.2,50.9,-101.4,50.9,-99.5,50.9,-97.6,50.9,-95.8,50.9,-93.9,50.9,-92,50.9,-90.1,50.9,-88.3,50.9,-86.4,50.9,-84.5,50.9,-82.7,50.9,-80.8,50.9,-78.9,50.9,-77,50.9,-75.2,50.9,-73.3,50.9,-71.4,50.9,-69.6,50.9,-67.7,50.9,-65.8,50.9,-63.9,50.9,-62.1,50.9,-60.2,50.9,-56.4,50.9,-4,50.9,-2.2,50.9,-.3,50.9,3.5,50.9,5.3,50.9,7.2,50.9,9.1,50.9,10.9,50.9,12.8,50.9,14.7,50.9,16.6,50.9,18.4,50.9,20.3,50.9,22.2,50.9,24,50.9,25.9,50.9,27.8,50.9,29.7,50.9,31.5,50.9,33.4,50.9,35.3,50.9,37.2,50.9,39,50.9,40.9,50.9,42.8,50.9,44.6,50.9,46.5,50.9,48.4,50.9,50.3,50.9,52.1,50.9,54,50.9,55.9,50.9,57.7,50.9,59.6,50.9,61.5,50.9,63.4,50.9,65.2,50.9,67.1,50.9,69,50.9,70.8,50.9,72.7,50.9,74.6,50.9,76.5,50.9,78.3,50.9,80.2,50.9,82.1,50.9,84,50.9,85.8,50.9,87.7,50.9,89.6,50.9,91.4,50.9,93.3,50.9,95.2,50.9,97.1,50.9,98.9,50.9,100.8,50.9,102.7,50.9,104.5,50.9,106.4,50.9,108.3,50.9,110.2,50.9,112,50.9,113.9,50.9,115.8,50.9,117.6,50.9,119.5,50.9,121.4,50.9,123.3,50.9,125.1,50.9,127,50.9,128.9,50.9,130.8,50.9,132.6,50.9,134.5,50.9,136.4,50.9,138.2,50.9,140.1,50.9,-124.8,49,-122.9,49,-121,49,-119.2,49,-117.3,49,-115.4,49,-113.5,49,-111.7,49,-109.8,49,-107.9,49,-106.1,49,-104.2,49,-102.3,49,-100.4,49,-98.6,49,-96.7,49,-94.8,49,-93,49,-91.1,49,-89.2,49,-87.3,49,-85.5,49,-83.6,49,-81.7,49,-79.8,49,-78,49,-76.1,49,-74.2,49,-72.4,49,-70.5,49,-68.6,49,-66.7,49,-64.9,49,-57.4,49,-55.5,49,-53.6,49,-1.2,49,.6,49,2.5,49,4.4,49,6.3,49,8.1,49,10,49,11.9,49,13.8,49,15.6,49,17.5,49,19.4,49,21.2,49,23.1,49,25,49,26.9,49,28.7,49,30.6,49,32.5,49,34.3,49,36.2,49,38.1,49,40,49,41.8,49,43.7,49,45.6,49,47.4,49,49.3,49,51.2,49,53.1,49,54.9,49,56.8,49,58.7,49,60.6,49,62.4,49,64.3,49,66.2,49,68,49,69.9,49,71.8,49,73.7,49,75.5,49,77.4,49,79.3,49,81.1,49,83,49,84.9,49,86.8,49,88.6,49,90.5,49,92.4,49,94.2,49,96.1,49,98,49,99.9,49,101.7,49,103.6,49,105.5,49,107.4,49,109.2,49,111.1,49,113,49,114.8,49,116.7,49,118.6,49,120.5,49,122.3,49,124.2,49,126.1,49,127.9,49,129.8,49,131.7,49,133.6,49,135.4,49,137.3,49,139.2,49,142.9,49,-123.8,47.1,-122,47.1,-120.1,47.1,-118.2,47.1,-116.4,47.1,-114.5,47.1,-112.6,47.1,-110.7,47.1,-108.9,47.1,-107,47.1,-105.1,47.1,-103.2,47.1,-101.4,47.1,-99.5,47.1,-97.6,47.1,-95.8,47.1,-93.9,47.1,-92,47.1,-90.1,47.1,-88.3,47.1,-86.4,47.1,-84.5,47.1,-82.7,47.1,-80.8,47.1,-78.9,47.1,-77,47.1,-75.2,47.1,-73.3,47.1,-71.4,47.1,-69.6,47.1,-67.7,47.1,-65.8,47.1,-2.2,47.1,-.3,47.1,1.6,47.1,3.5,47.1,5.3,47.1,7.2,47.1,9.1,47.1,10.9,47.1,12.8,47.1,14.7,47.1,16.6,47.1,18.4,47.1,20.3,47.1,22.2,47.1,24,47.1,25.9,47.1,27.8,47.1,29.7,47.1,31.5,47.1,33.4,47.1,35.3,47.1,37.2,47.1,40.9,47.1,42.8,47.1,44.6,47.1,46.5,47.1,48.4,47.1,50.3,47.1,52.1,47.1,54,47.1,55.9,47.1,57.7,47.1,59.6,47.1,61.5,47.1,63.4,47.1,65.2,47.1,67.1,47.1,69,47.1,70.8,47.1,72.7,47.1,74.6,47.1,76.5,47.1,78.3,47.1,80.2,47.1,82.1,47.1,84,47.1,85.8,47.1,87.7,47.1,89.6,47.1,91.4,47.1,93.3,47.1,95.2,47.1,97.1,47.1,98.9,47.1,100.8,47.1,102.7,47.1,104.5,47.1,106.4,47.1,108.3,47.1,110.2,47.1,112,47.1,113.9,47.1,115.8,47.1,117.6,47.1,119.5,47.1,121.4,47.1,123.3,47.1,125.1,47.1,127,47.1,128.9,47.1,130.8,47.1,132.6,47.1,134.5,47.1,136.4,47.1,138.2,47.1,142,47.1,-122.9,45.2,-121,45.2,-119.2,45.2,-117.3,45.2,-115.4,45.2,-113.5,45.2,-111.7,45.2,-109.8,45.2,-107.9,45.2,-106.1,45.2,-104.2,45.2,-102.3,45.2,-100.4,45.2,-98.6,45.2,-96.7,45.2,-94.8,45.2,-93,45.2,-91.1,45.2,-89.2,45.2,-87.3,45.2,-85.5,45.2,-83.6,45.2,-81.7,45.2,-79.8,45.2,-78,45.2,-76.1,45.2,-74.2,45.2,-72.4,45.2,-70.5,45.2,-68.6,45.2,-66.7,45.2,-63,45.2,-61.1,45.2,-1.2,45.2,.6,45.2,2.5,45.2,4.4,45.2,6.3,45.2,8.1,45.2,10,45.2,11.9,45.2,13.8,45.2,15.6,45.2,17.5,45.2,19.4,45.2,21.2,45.2,23.1,45.2,25,45.2,26.9,45.2,28.7,45.2,34.3,45.2,36.2,45.2,38.1,45.2,40,45.2,41.8,45.2,43.7,45.2,45.6,45.2,53.1,45.2,54.9,45.2,56.8,45.2,58.7,45.2,60.6,45.2,62.4,45.2,64.3,45.2,66.2,45.2,68,45.2,69.9,45.2,71.8,45.2,73.7,45.2,75.5,45.2,77.4,45.2,79.3,45.2,81.1,45.2,83,45.2,84.9,45.2,86.8,45.2,88.6,45.2,90.5,45.2,92.4,45.2,94.2,45.2,96.1,45.2,98,45.2,99.9,45.2,101.7,45.2,103.6,45.2,105.5,45.2,107.4,45.2,109.2,45.2,111.1,45.2,113,45.2,114.8,45.2,116.7,45.2,118.6,45.2,120.5,45.2,122.3,45.2,124.2,45.2,126.1,45.2,127.9,45.2,129.8,45.2,131.7,45.2,133.6,45.2,135.4,45.2,-123.8,43.4,-122,43.4,-120.1,43.4,-118.2,43.4,-116.4,43.4,-114.5,43.4,-112.6,43.4,-110.7,43.4,-108.9,43.4,-107,43.4,-105.1,43.4,-103.2,43.4,-101.4,43.4,-99.5,43.4,-97.6,43.4,-95.8,43.4,-93.9,43.4,-92,43.4,-90.1,43.4,-88.3,43.4,-86.4,43.4,-84.5,43.4,-82.7,43.4,-80.8,43.4,-78.9,43.4,-77,43.4,-75.2,43.4,-73.3,43.4,-71.4,43.4,-7.8,43.4,-5.9,43.4,-4,43.4,-2.2,43.4,-.3,43.4,1.6,43.4,3.5,43.4,5.3,43.4,10.9,43.4,12.8,43.4,16.6,43.4,18.4,43.4,20.3,43.4,22.2,43.4,24,43.4,25.9,43.4,27.8,43.4,40.9,43.4,42.8,43.4,44.6,43.4,46.5,43.4,52.1,43.4,54,43.4,55.9,43.4,57.7,43.4,59.6,43.4,61.5,43.4,63.4,43.4,65.2,43.4,67.1,43.4,69,43.4,70.8,43.4,72.7,43.4,74.6,43.4,76.5,43.4,78.3,43.4,80.2,43.4,82.1,43.4,84,43.4,85.8,43.4,87.7,43.4,89.6,43.4,91.4,43.4,93.3,43.4,95.2,43.4,97.1,43.4,98.9,43.4,100.8,43.4,102.7,43.4,104.5,43.4,106.4,43.4,108.3,43.4,110.2,43.4,112,43.4,113.9,43.4,115.8,43.4,117.6,43.4,119.5,43.4,121.4,43.4,123.3,43.4,125.1,43.4,127,43.4,128.9,43.4,130.8,43.4,132.6,43.4,134.5,43.4,142,43.4,143.9,43.4,-122.9,41.5,-121,41.5,-119.2,41.5,-117.3,41.5,-115.4,41.5,-113.5,41.5,-111.7,41.5,-109.8,41.5,-107.9,41.5,-106.1,41.5,-104.2,41.5,-102.3,41.5,-100.4,41.5,-98.6,41.5,-96.7,41.5,-94.8,41.5,-93,41.5,-91.1,41.5,-89.2,41.5,-87.3,41.5,-85.5,41.5,-83.6,41.5,-81.7,41.5,-79.8,41.5,-78,41.5,-76.1,41.5,-74.2,41.5,-72.4,41.5,-70.5,41.5,-8.7,41.5,-6.8,41.5,-5,41.5,-3.1,41.5,-1.2,41.5,.6,41.5,13.8,41.5,15.6,41.5,21.2,41.5,23.1,41.5,25,41.5,26.9,41.5,32.5,41.5,34.3,41.5,36.2,41.5,41.8,41.5,43.7,41.5,45.6,41.5,47.4,41.5,54.9,41.5,56.8,41.5,58.7,41.5,60.6,41.5,62.4,41.5,64.3,41.5,66.2,41.5,68,41.5,69.9,41.5,71.8,41.5,73.7,41.5,75.5,41.5,77.4,41.5,79.3,41.5,81.1,41.5,83,41.5,84.9,41.5,86.8,41.5,88.6,41.5,90.5,41.5,92.4,41.5,94.2,41.5,96.1,41.5,98,41.5,99.9,41.5,101.7,41.5,103.6,41.5,105.5,41.5,107.4,41.5,109.2,41.5,111.1,41.5,113,41.5,114.8,41.5,116.7,41.5,118.6,41.5,120.5,41.5,122.3,41.5,124.2,41.5,126.1,41.5,127.9,41.5,-123.8,39.6,-122,39.6,-120.1,39.6,-118.2,39.6,-116.4,39.6,-114.5,39.6,-112.6,39.6,-110.7,39.6,-108.9,39.6,-107,39.6,-105.1,39.6,-103.2,39.6,-101.4,39.6,-99.5,39.6,-97.6,39.6,-95.8,39.6,-93.9,39.6,-92,39.6,-90.1,39.6,-88.3,39.6,-86.4,39.6,-84.5,39.6,-82.7,39.6,-80.8,39.6,-78.9,39.6,-77,39.6,-75.2,39.6,-7.8,39.6,-5.9,39.6,-4,39.6,-2.2,39.6,-.3,39.6,9.1,39.6,16.6,39.6,20.3,39.6,22.2,39.6,27.8,39.6,29.7,39.6,31.5,39.6,33.4,39.6,35.3,39.6,37.2,39.6,39,39.6,40.9,39.6,42.8,39.6,44.6,39.6,46.5,39.6,48.4,39.6,54,39.6,55.9,39.6,57.7,39.6,59.6,39.6,61.5,39.6,63.4,39.6,65.2,39.6,67.1,39.6,69,39.6,70.8,39.6,72.7,39.6,74.6,39.6,76.5,39.6,78.3,39.6,80.2,39.6,82.1,39.6,84,39.6,85.8,39.6,87.7,39.6,89.6,39.6,91.4,39.6,93.3,39.6,95.2,39.6,97.1,39.6,98.9,39.6,100.8,39.6,102.7,39.6,104.5,39.6,106.4,39.6,108.3,39.6,110.2,39.6,112,39.6,113.9,39.6,115.8,39.6,117.6,39.6,125.1,39.6,127,39.6,140.1,39.6,-121,37.8,-119.2,37.8,-117.3,37.8,-115.4,37.8,-113.5,37.8,-111.7,37.8,-109.8,37.8,-107.9,37.8,-106.1,37.8,-104.2,37.8,-102.3,37.8,-100.4,37.8,-98.6,37.8,-96.7,37.8,-94.8,37.8,-93,37.8,-91.1,37.8,-89.2,37.8,-87.3,37.8,-85.5,37.8,-83.6,37.8,-81.7,37.8,-79.8,37.8,-78,37.8,-8.7,37.8,-6.8,37.8,-5,37.8,-3.1,37.8,-1.2,37.8,13.8,37.8,23.1,37.8,28.7,37.8,30.6,37.8,32.5,37.8,34.3,37.8,36.2,37.8,38.1,37.8,40,37.8,41.8,37.8,43.7,37.8,45.6,37.8,47.4,37.8,54.9,37.8,56.8,37.8,58.7,37.8,60.6,37.8,62.4,37.8,64.3,37.8,66.2,37.8,68,37.8,69.9,37.8,71.8,37.8,73.7,37.8,75.5,37.8,77.4,37.8,79.3,37.8,81.1,37.8,83,37.8,84.9,37.8,86.8,37.8,88.6,37.8,90.5,37.8,92.4,37.8,94.2,37.8,96.1,37.8,98,37.8,99.9,37.8,101.7,37.8,103.6,37.8,105.5,37.8,107.4,37.8,109.2,37.8,111.1,37.8,113,37.8,114.8,37.8,116.7,37.8,118.6,37.8,127.9,37.8,139.2,37.8,-120.1,35.9,-118.2,35.9,-116.4,35.9,-114.5,35.9,-112.6,35.9,-110.7,35.9,-108.9,35.9,-107,35.9,-105.1,35.9,-103.2,35.9,-101.4,35.9,-99.5,35.9,-97.6,35.9,-95.8,35.9,-93.9,35.9,-92,35.9,-90.1,35.9,-88.3,35.9,-86.4,35.9,-84.5,35.9,-82.7,35.9,-80.8,35.9,-78.9,35.9,-77,35.9,1.6,35.9,3.5,35.9,5.3,35.9,7.2,35.9,9.1,35.9,37.2,35.9,39,35.9,40.9,35.9,42.8,35.9,44.6,35.9,46.5,35.9,48.4,35.9,50.3,35.9,52.1,35.9,54,35.9,55.9,35.9,57.7,35.9,59.6,35.9,61.5,35.9,63.4,35.9,65.2,35.9,67.1,35.9,69,35.9,70.8,35.9,72.7,35.9,74.6,35.9,76.5,35.9,78.3,35.9,80.2,35.9,82.1,35.9,84,35.9,85.8,35.9,87.7,35.9,89.6,35.9,91.4,35.9,93.3,35.9,95.2,35.9,97.1,35.9,98.9,35.9,100.8,35.9,102.7,35.9,104.5,35.9,106.4,35.9,108.3,35.9,110.2,35.9,112,35.9,113.9,35.9,115.8,35.9,117.6,35.9,119.5,35.9,127,35.9,128.9,35.9,136.4,35.9,138.2,35.9,140.1,35.9,-117.3,34,-115.4,34,-113.5,34,-111.7,34,-109.8,34,-107.9,34,-106.1,34,-104.2,34,-102.3,34,-100.4,34,-98.6,34,-96.7,34,-94.8,34,-93,34,-91.1,34,-89.2,34,-87.3,34,-85.5,34,-83.6,34,-81.7,34,-79.8,34,-78,34,-6.8,34,-5,34,-3.1,34,-1.2,34,.6,34,2.5,34,4.4,34,6.3,34,8.1,34,10,34,36.2,34,38.1,34,40,34,41.8,34,43.7,34,45.6,34,47.4,34,49.3,34,51.2,34,53.1,34,54.9,34,56.8,34,58.7,34,60.6,34,62.4,34,64.3,34,66.2,34,68,34,69.9,34,71.8,34,73.7,34,75.5,34,77.4,34,79.3,34,81.1,34,83,34,84.9,34,86.8,34,88.6,34,90.5,34,92.4,34,94.2,34,96.1,34,98,34,99.9,34,101.7,34,103.6,34,105.5,34,107.4,34,109.2,34,111.1,34,113,34,114.8,34,116.7,34,118.6,34,131.7,34,135.4,34,-116.4,32.1,-114.5,32.1,-112.6,32.1,-110.7,32.1,-108.9,32.1,-107,32.1,-105.1,32.1,-103.2,32.1,-101.4,32.1,-99.5,32.1,-97.6,32.1,-95.8,32.1,-93.9,32.1,-92,32.1,-90.1,32.1,-88.3,32.1,-86.4,32.1,-84.5,32.1,-82.7,32.1,-80.8,32.1,-7.8,32.1,-5.9,32.1,-4,32.1,-2.2,32.1,-.3,32.1,1.6,32.1,3.5,32.1,5.3,32.1,7.2,32.1,9.1,32.1,10.9,32.1,12.8,32.1,14.7,32.1,20.3,32.1,22.2,32.1,35.3,32.1,37.2,32.1,39,32.1,40.9,32.1,42.8,32.1,44.6,32.1,46.5,32.1,48.4,32.1,50.3,32.1,52.1,32.1,54,32.1,55.9,32.1,57.7,32.1,59.6,32.1,61.5,32.1,63.4,32.1,65.2,32.1,67.1,32.1,69,32.1,70.8,32.1,72.7,32.1,74.6,32.1,76.5,32.1,78.3,32.1,80.2,32.1,82.1,32.1,84,32.1,85.8,32.1,87.7,32.1,89.6,32.1,91.4,32.1,93.3,32.1,95.2,32.1,97.1,32.1,98.9,32.1,100.8,32.1,102.7,32.1,104.5,32.1,106.4,32.1,108.3,32.1,110.2,32.1,112,32.1,113.9,32.1,115.8,32.1,117.6,32.1,119.5,32.1,121.4,32.1,130.8,32.1,-115.4,30.3,-111.7,30.3,-109.8,30.3,-107.9,30.3,-106.1,30.3,-104.2,30.3,-102.3,30.3,-100.4,30.3,-98.6,30.3,-96.7,30.3,-94.8,30.3,-93,30.3,-91.1,30.3,-85.5,30.3,-83.6,30.3,-81.7,30.3,-8.7,30.3,-6.8,30.3,-5,30.3,-3.1,30.3,-1.2,30.3,.6,30.3,2.5,30.3,4.4,30.3,6.3,30.3,8.1,30.3,10,30.3,11.9,30.3,13.8,30.3,15.6,30.3,17.5,30.3,19.4,30.3,21.2,30.3,23.1,30.3,25,30.3,26.9,30.3,28.7,30.3,30.6,30.3,32.5,30.3,34.3,30.3,36.2,30.3,38.1,30.3,40,30.3,41.8,30.3,43.7,30.3,45.6,30.3,47.4,30.3,49.3,30.3,51.2,30.3,53.1,30.3,54.9,30.3,56.8,30.3,58.7,30.3,60.6,30.3,62.4,30.3,64.3,30.3,66.2,30.3,68,30.3,69.9,30.3,71.8,30.3,73.7,30.3,75.5,30.3,77.4,30.3,79.3,30.3,81.1,30.3,83,30.3,84.9,30.3,86.8,30.3,88.6,30.3,90.5,30.3,92.4,30.3,94.2,30.3,96.1,30.3,98,30.3,99.9,30.3,101.7,30.3,103.6,30.3,105.5,30.3,107.4,30.3,109.2,30.3,111.1,30.3,113,30.3,114.8,30.3,116.7,30.3,118.6,30.3,120.5,30.3,-110.7,28.4,-108.9,28.4,-107,28.4,-105.1,28.4,-103.2,28.4,-101.4,28.4,-99.5,28.4,-97.6,28.4,-82.7,28.4,-80.8,28.4,-9.6,28.4,-7.8,28.4,-5.9,28.4,-4,28.4,-2.2,28.4,-.3,28.4,1.6,28.4,3.5,28.4,5.3,28.4,7.2,28.4,9.1,28.4,10.9,28.4,12.8,28.4,14.7,28.4,16.6,28.4,18.4,28.4,20.3,28.4,22.2,28.4,24,28.4,25.9,28.4,27.8,28.4,29.7,28.4,31.5,28.4,33.4,28.4,35.3,28.4,37.2,28.4,39,28.4,40.9,28.4,42.8,28.4,44.6,28.4,46.5,28.4,48.4,28.4,52.1,28.4,54,28.4,55.9,28.4,57.7,28.4,59.6,28.4,61.5,28.4,63.4,28.4,65.2,28.4,67.1,28.4,69,28.4,70.8,28.4,72.7,28.4,74.6,28.4,76.5,28.4,78.3,28.4,80.2,28.4,82.1,28.4,84,28.4,85.8,28.4,87.7,28.4,89.6,28.4,91.4,28.4,93.3,28.4,95.2,28.4,97.1,28.4,98.9,28.4,100.8,28.4,102.7,28.4,104.5,28.4,106.4,28.4,108.3,28.4,110.2,28.4,112,28.4,113.9,28.4,115.8,28.4,117.6,28.4,119.5,28.4,121.4,28.4,-111.7,26.5,-107.9,26.5,-106.1,26.5,-104.2,26.5,-102.3,26.5,-100.4,26.5,-98.6,26.5,-81.7,26.5,-12.5,26.5,-10.6,26.5,-8.7,26.5,-6.8,26.5,-5,26.5,-3.1,26.5,-1.2,26.5,.6,26.5,2.5,26.5,4.4,26.5,6.3,26.5,8.1,26.5,10,26.5,11.9,26.5,13.8,26.5,15.6,26.5,17.5,26.5,19.4,26.5,21.2,26.5,23.1,26.5,25,26.5,26.9,26.5,28.7,26.5,30.6,26.5,32.5,26.5,38.1,26.5,40,26.5,41.8,26.5,43.7,26.5,45.6,26.5,47.4,26.5,49.3,26.5,58.7,26.5,60.6,26.5,62.4,26.5,64.3,26.5,66.2,26.5,68,26.5,69.9,26.5,71.8,26.5,73.7,26.5,75.5,26.5,77.4,26.5,79.3,26.5,81.1,26.5,83,26.5,84.9,26.5,86.8,26.5,88.6,26.5,90.5,26.5,92.4,26.5,94.2,26.5,96.1,26.5,98,26.5,99.9,26.5,101.7,26.5,103.6,26.5,105.5,26.5,107.4,26.5,109.2,26.5,111.1,26.5,113,26.5,114.8,26.5,116.7,26.5,118.6,26.5,-110.7,24.6,-107,24.6,-105.1,24.6,-103.2,24.6,-101.4,24.6,-99.5,24.6,-97.6,24.6,-13.4,24.6,-11.5,24.6,-9.6,24.6,-7.8,24.6,-5.9,24.6,-4,24.6,-2.2,24.6,-.3,24.6,1.6,24.6,3.5,24.6,5.3,24.6,7.2,24.6,9.1,24.6,10.9,24.6,12.8,24.6,14.7,24.6,16.6,24.6,18.4,24.6,20.3,24.6,22.2,24.6,24,24.6,25.9,24.6,27.8,24.6,29.7,24.6,31.5,24.6,33.4,24.6,39,24.6,40.9,24.6,42.8,24.6,44.6,24.6,46.5,24.6,48.4,24.6,50.3,24.6,55.9,24.6,69,24.6,70.8,24.6,72.7,24.6,74.6,24.6,76.5,24.6,78.3,24.6,80.2,24.6,82.1,24.6,84,24.6,85.8,24.6,87.7,24.6,89.6,24.6,91.4,24.6,93.3,24.6,95.2,24.6,97.1,24.6,98.9,24.6,100.8,24.6,102.7,24.6,104.5,24.6,106.4,24.6,108.3,24.6,110.2,24.6,112,24.6,113.9,24.6,115.8,24.6,117.6,24.6,121.4,24.6,-106.1,22.8,-104.2,22.8,-102.3,22.8,-100.4,22.8,-98.6,22.8,-83.6,22.8,-81.7,22.8,-79.8,22.8,-16.2,22.8,-14.3,22.8,-12.5,22.8,-10.6,22.8,-8.7,22.8,-6.8,22.8,-5,22.8,-3.1,22.8,-1.2,22.8,.6,22.8,2.5,22.8,4.4,22.8,6.3,22.8,8.1,22.8,10,22.8,11.9,22.8,13.8,22.8,15.6,22.8,17.5,22.8,19.4,22.8,21.2,22.8,23.1,22.8,25,22.8,26.9,22.8,28.7,22.8,30.6,22.8,32.5,22.8,34.3,22.8,40,22.8,41.8,22.8,43.7,22.8,45.6,22.8,47.4,22.8,49.3,22.8,51.2,22.8,53.1,22.8,54.9,22.8,56.8,22.8,58.7,22.8,69.9,22.8,71.8,22.8,73.7,22.8,75.5,22.8,77.4,22.8,79.3,22.8,81.1,22.8,83,22.8,84.9,22.8,86.8,22.8,88.6,22.8,90.5,22.8,92.4,22.8,94.2,22.8,96.1,22.8,98,22.8,99.9,22.8,101.7,22.8,103.6,22.8,105.5,22.8,107.4,22.8,109.2,22.8,111.1,22.8,113,22.8,114.8,22.8,120.5,22.8,-156.6,20.9,-104.2,20.9,-102.3,20.9,-100.4,20.9,-98.6,20.9,-89.2,20.9,-87.3,20.9,-78,20.9,-76.1,20.9,-16.2,20.9,-14.3,20.9,-12.5,20.9,-10.6,20.9,-8.7,20.9,-6.8,20.9,-5,20.9,-3.1,20.9,-1.2,20.9,.6,20.9,2.5,20.9,4.4,20.9,6.3,20.9,8.1,20.9,10,20.9,11.9,20.9,13.8,20.9,15.6,20.9,17.5,20.9,19.4,20.9,21.2,20.9,23.1,20.9,25,20.9,26.9,20.9,28.7,20.9,30.6,20.9,32.5,20.9,34.3,20.9,36.2,20.9,40,20.9,41.8,20.9,43.7,20.9,45.6,20.9,47.4,20.9,49.3,20.9,51.2,20.9,53.1,20.9,54.9,20.9,56.8,20.9,58.7,20.9,73.7,20.9,75.5,20.9,77.4,20.9,79.3,20.9,81.1,20.9,83,20.9,84.9,20.9,86.8,20.9,92.4,20.9,94.2,20.9,96.1,20.9,98,20.9,99.9,20.9,101.7,20.9,103.6,20.9,105.5,20.9,-155.7,19,-103.2,19,-101.4,19,-99.5,19,-97.6,19,-90.1,19,-88.3,19,-71.4,19,-69.6,19,-15.3,19,-13.4,19,-11.5,19,-9.6,19,-7.8,19,-5.9,19,-4,19,-2.2,19,-.3,19,1.6,19,3.5,19,5.3,19,7.2,19,9.1,19,10.9,19,12.8,19,14.7,19,16.6,19,18.4,19,20.3,19,22.2,19,24,19,25.9,19,27.8,19,29.7,19,31.5,19,33.4,19,35.3,19,37.2,19,42.8,19,44.6,19,46.5,19,48.4,19,50.3,19,52.1,19,54,19,55.9,19,57.7,19,74.6,19,76.5,19,78.3,19,80.2,19,82.1,19,84,19,95.2,19,97.1,19,98.9,19,100.8,19,102.7,19,104.5,19,110.2,19,-100.4,17.2,-98.6,17.2,-96.7,17.2,-94.8,17.2,-93,17.2,-91.1,17.2,-89.2,17.2,-16.2,17.2,-14.3,17.2,-12.5,17.2,-10.6,17.2,-8.7,17.2,-6.8,17.2,-5,17.2,-3.1,17.2,-1.2,17.2,.6,17.2,2.5,17.2,4.4,17.2,6.3,17.2,8.1,17.2,10,17.2,11.9,17.2,13.8,17.2,15.6,17.2,17.5,17.2,19.4,17.2,21.2,17.2,23.1,17.2,25,17.2,26.9,17.2,28.7,17.2,30.6,17.2,32.5,17.2,34.3,17.2,36.2,17.2,38.1,17.2,43.7,17.2,45.6,17.2,47.4,17.2,49.3,17.2,51.2,17.2,53.1,17.2,54.9,17.2,73.7,17.2,75.5,17.2,77.4,17.2,79.3,17.2,81.1,17.2,96.1,17.2,98,17.2,99.9,17.2,101.7,17.2,103.6,17.2,105.5,17.2,120.5,17.2,122.3,17.2,-92,15.3,-90.1,15.3,-88.3,15.3,-86.4,15.3,-84.5,15.3,-15.3,15.3,-13.4,15.3,-11.5,15.3,-9.6,15.3,-7.8,15.3,-5.9,15.3,-4,15.3,-2.2,15.3,-.3,15.3,1.6,15.3,3.5,15.3,5.3,15.3,7.2,15.3,9.1,15.3,10.9,15.3,12.8,15.3,14.7,15.3,16.6,15.3,18.4,15.3,20.3,15.3,22.2,15.3,24,15.3,25.9,15.3,27.8,15.3,29.7,15.3,31.5,15.3,33.4,15.3,35.3,15.3,37.2,15.3,39,15.3,44.6,15.3,46.5,15.3,48.4,15.3,50.3,15.3,74.6,15.3,76.5,15.3,78.3,15.3,98.9,15.3,100.8,15.3,102.7,15.3,104.5,15.3,106.4,15.3,108.3,15.3,121.4,15.3,-89.2,13.4,-87.3,13.4,-85.5,13.4,-83.6,13.4,-16.2,13.4,-14.3,13.4,-12.5,13.4,-10.6,13.4,-8.7,13.4,-6.8,13.4,-5,13.4,-3.1,13.4,-1.2,13.4,.6,13.4,2.5,13.4,4.4,13.4,6.3,13.4,8.1,13.4,10,13.4,11.9,13.4,13.8,13.4,15.6,13.4,17.5,13.4,19.4,13.4,21.2,13.4,23.1,13.4,25,13.4,26.9,13.4,28.7,13.4,30.6,13.4,32.5,13.4,34.3,13.4,36.2,13.4,38.1,13.4,40,13.4,41.8,13.4,43.7,13.4,45.6,13.4,75.5,13.4,77.4,13.4,79.3,13.4,99.9,13.4,101.7,13.4,103.6,13.4,105.5,13.4,107.4,13.4,109.2,13.4,120.5,13.4,-84.5,11.5,-71.4,11.5,-15.3,11.5,-13.4,11.5,-11.5,11.5,-9.6,11.5,-7.8,11.5,-5.9,11.5,-4,11.5,-2.2,11.5,-.3,11.5,1.6,11.5,3.5,11.5,5.3,11.5,7.2,11.5,9.1,11.5,10.9,11.5,12.8,11.5,14.7,11.5,16.6,11.5,18.4,11.5,20.3,11.5,22.2,11.5,24,11.5,25.9,11.5,27.8,11.5,29.7,11.5,31.5,11.5,33.4,11.5,35.3,11.5,37.2,11.5,39,11.5,40.9,11.5,42.8,11.5,50.3,11.5,76.5,11.5,78.3,11.5,98.9,11.5,104.5,11.5,106.4,11.5,108.3,11.5,125.1,11.5,-83.6,9.7,-74.2,9.7,-72.4,9.7,-70.5,9.7,-68.6,9.7,-66.7,9.7,-64.9,9.7,-63,9.7,-12.5,9.7,-10.6,9.7,-8.7,9.7,-6.8,9.7,-5,9.7,-3.1,9.7,-1.2,9.7,.6,9.7,2.5,9.7,4.4,9.7,6.3,9.7,8.1,9.7,10,9.7,11.9,9.7,13.8,9.7,15.6,9.7,17.5,9.7,19.4,9.7,21.2,9.7,23.1,9.7,25,9.7,26.9,9.7,28.7,9.7,30.6,9.7,32.5,9.7,34.3,9.7,36.2,9.7,38.1,9.7,40,9.7,41.8,9.7,43.7,9.7,45.6,9.7,47.4,9.7,49.3,9.7,77.4,9.7,105.5,9.7,118.6,9.7,-80.8,7.8,-77,7.8,-75.2,7.8,-73.3,7.8,-71.4,7.8,-69.6,7.8,-67.7,7.8,-65.8,7.8,-63.9,7.8,-62.1,7.8,-60.2,7.8,-11.5,7.8,-9.6,7.8,-7.8,7.8,-5.9,7.8,-4,7.8,-2.2,7.8,-.3,7.8,1.6,7.8,3.5,7.8,5.3,7.8,7.2,7.8,9.1,7.8,10.9,7.8,12.8,7.8,14.7,7.8,16.6,7.8,18.4,7.8,20.3,7.8,22.2,7.8,24,7.8,25.9,7.8,27.8,7.8,29.7,7.8,31.5,7.8,33.4,7.8,35.3,7.8,37.2,7.8,39,7.8,40.9,7.8,42.8,7.8,44.6,7.8,46.5,7.8,48.4,7.8,80.2,7.8,123.3,7.8,125.1,7.8,-76.1,5.9,-74.2,5.9,-72.4,5.9,-70.5,5.9,-68.6,5.9,-66.7,5.9,-64.9,5.9,-63,5.9,-61.1,5.9,-59.3,5.9,-57.4,5.9,-55.5,5.9,-8.7,5.9,-6.8,5.9,-5,5.9,-3.1,5.9,-1.2,5.9,.6,5.9,6.3,5.9,8.1,5.9,10,5.9,11.9,5.9,13.8,5.9,15.6,5.9,17.5,5.9,19.4,5.9,21.2,5.9,23.1,5.9,25,5.9,26.9,5.9,28.7,5.9,30.6,5.9,32.5,5.9,34.3,5.9,36.2,5.9,38.1,5.9,40,5.9,41.8,5.9,43.7,5.9,45.6,5.9,47.4,5.9,101.7,5.9,116.7,5.9,-77,4.1,-75.2,4.1,-73.3,4.1,-71.4,4.1,-69.6,4.1,-67.7,4.1,-65.8,4.1,-63.9,4.1,-62.1,4.1,-60.2,4.1,-58.3,4.1,-56.4,4.1,-54.6,4.1,-52.7,4.1,9.1,4.1,10.9,4.1,12.8,4.1,14.7,4.1,16.6,4.1,18.4,4.1,20.3,4.1,22.2,4.1,24,4.1,25.9,4.1,27.8,4.1,29.7,4.1,31.5,4.1,33.4,4.1,35.3,4.1,37.2,4.1,39,4.1,40.9,4.1,42.8,4.1,44.6,4.1,46.5,4.1,97.1,4.1,100.8,4.1,102.7,4.1,113.9,4.1,115.8,4.1,117.6,4.1,-78,2.2,-76.1,2.2,-74.2,2.2,-72.4,2.2,-70.5,2.2,-68.6,2.2,-66.7,2.2,-64.9,2.2,-63,2.2,-61.1,2.2,-59.3,2.2,-57.4,2.2,-55.5,2.2,-53.6,2.2,-51.8,2.2,10,2.2,11.9,2.2,13.8,2.2,15.6,2.2,17.5,2.2,19.4,2.2,21.2,2.2,23.1,2.2,25,2.2,26.9,2.2,28.7,2.2,30.6,2.2,32.5,2.2,34.3,2.2,36.2,2.2,38.1,2.2,40,2.2,41.8,2.2,43.7,2.2,45.6,2.2,99.9,2.2,103.6,2.2,113,2.2,114.8,2.2,116.7,2.2,-78.9,.3,-77,.3,-75.2,.3,-73.3,.3,-71.4,.3,-69.6,.3,-67.7,.3,-65.8,.3,-63.9,.3,-62.1,.3,-60.2,.3,-58.3,.3,-56.4,.3,-54.6,.3,-52.7,.3,-50.8,.3,10.9,.3,12.8,.3,14.7,.3,16.6,.3,18.4,.3,20.3,.3,22.2,.3,24,.3,25.9,.3,27.8,.3,29.7,.3,31.5,.3,33.4,.3,35.3,.3,37.2,.3,39,.3,40.9,.3,42.8,.3,100.8,.3,102.7,.3,110.2,.3,112,.3,113.9,.3,115.8,.3,123.3,.3,-79.8,-1.6,-78,-1.6,-76.1,-1.6,-74.2,-1.6,-72.4,-1.6,-70.5,-1.6,-68.6,-1.6,-66.7,-1.6,-64.9,-1.6,-63,-1.6,-61.1,-1.6,-59.3,-1.6,-57.4,-1.6,-55.5,-1.6,-53.6,-1.6,-51.8,-1.6,-49.9,-1.6,-48,-1.6,-46.2,-1.6,10,-1.6,11.9,-1.6,13.8,-1.6,15.6,-1.6,17.5,-1.6,19.4,-1.6,21.2,-1.6,23.1,-1.6,25,-1.6,26.9,-1.6,28.7,-1.6,30.6,-1.6,32.5,-1.6,34.3,-1.6,36.2,-1.6,38.1,-1.6,40,-1.6,101.7,-1.6,103.6,-1.6,111.1,-1.6,113,-1.6,114.8,-1.6,120.5,-1.6,122.3,-1.6,131.7,-1.6,133.6,-1.6,-78.9,-3.4,-77,-3.4,-75.2,-3.4,-73.3,-3.4,-71.4,-3.4,-69.6,-3.4,-67.7,-3.4,-65.8,-3.4,-63.9,-3.4,-62.1,-3.4,-60.2,-3.4,-58.3,-3.4,-56.4,-3.4,-54.6,-3.4,-52.7,-3.4,-50.8,-3.4,-49,-3.4,-47.1,-3.4,-45.2,-3.4,-43.3,-3.4,-41.5,-3.4,-39.6,-3.4,10.9,-3.4,12.8,-3.4,14.7,-3.4,16.6,-3.4,18.4,-3.4,20.3,-3.4,22.2,-3.4,24,-3.4,25.9,-3.4,27.8,-3.4,29.7,-3.4,31.5,-3.4,33.4,-3.4,35.3,-3.4,37.2,-3.4,39,-3.4,102.7,-3.4,104.5,-3.4,112,-3.4,113.9,-3.4,115.8,-3.4,119.5,-3.4,121.4,-3.4,127,-3.4,128.9,-3.4,134.5,-3.4,136.4,-3.4,138.2,-3.4,140.1,-3.4,142,-3.4,-79.8,-5.3,-78,-5.3,-76.1,-5.3,-74.2,-5.3,-72.4,-5.3,-70.5,-5.3,-68.6,-5.3,-66.7,-5.3,-64.9,-5.3,-63,-5.3,-61.1,-5.3,-59.3,-5.3,-57.4,-5.3,-55.5,-5.3,-53.6,-5.3,-51.8,-5.3,-49.9,-5.3,-48,-5.3,-46.2,-5.3,-44.3,-5.3,-42.4,-5.3,-40.5,-5.3,-38.7,-5.3,-36.8,-5.3,13.8,-5.3,15.6,-5.3,17.5,-5.3,19.4,-5.3,21.2,-5.3,23.1,-5.3,25,-5.3,26.9,-5.3,28.7,-5.3,30.6,-5.3,32.5,-5.3,34.3,-5.3,36.2,-5.3,38.1,-5.3,105.5,-5.3,122.3,-5.3,139.2,-5.3,141,-5.3,142.9,-5.3,144.8,-5.3,-78.9,-7.2,-77,-7.2,-75.2,-7.2,-73.3,-7.2,-71.4,-7.2,-69.6,-7.2,-67.7,-7.2,-65.8,-7.2,-63.9,-7.2,-62.1,-7.2,-60.2,-7.2,-58.3,-7.2,-56.4,-7.2,-54.6,-7.2,-52.7,-7.2,-50.8,-7.2,-49,-7.2,-47.1,-7.2,-45.2,-7.2,-43.3,-7.2,-41.5,-7.2,-39.6,-7.2,-37.7,-7.2,-35.9,-7.2,12.8,-7.2,14.7,-7.2,16.6,-7.2,18.4,-7.2,20.3,-7.2,22.2,-7.2,24,-7.2,25.9,-7.2,27.8,-7.2,29.7,-7.2,31.5,-7.2,33.4,-7.2,35.3,-7.2,37.2,-7.2,39,-7.2,106.4,-7.2,108.3,-7.2,110.2,-7.2,112,-7.2,140.1,-7.2,142,-7.2,143.9,-7.2,145.7,-7.2,157,-7.2,-78,-9,-76.1,-9,-74.2,-9,-72.4,-9,-70.5,-9,-68.6,-9,-66.7,-9,-64.9,-9,-63,-9,-61.1,-9,-59.3,-9,-57.4,-9,-55.5,-9,-53.6,-9,-51.8,-9,-49.9,-9,-48,-9,-46.2,-9,-44.3,-9,-42.4,-9,-40.5,-9,-38.7,-9,-36.8,-9,13.8,-9,15.6,-9,17.5,-9,19.4,-9,21.2,-9,23.1,-9,25,-9,26.9,-9,28.7,-9,30.6,-9,32.5,-9,34.3,-9,36.2,-9,38.1,-9,126.1,-9,141,-9,142.9,-9,146.7,-9,148.5,-9,-77,-10.9,-75.2,-10.9,-73.3,-10.9,-71.4,-10.9,-69.6,-10.9,-67.7,-10.9,-65.8,-10.9,-63.9,-10.9,-62.1,-10.9,-60.2,-10.9,-58.3,-10.9,-56.4,-10.9,-54.6,-10.9,-52.7,-10.9,-50.8,-10.9,-49,-10.9,-47.1,-10.9,-45.2,-10.9,-43.3,-10.9,-41.5,-10.9,-39.6,-10.9,-37.7,-10.9,14.7,-10.9,16.6,-10.9,18.4,-10.9,20.3,-10.9,22.2,-10.9,24,-10.9,25.9,-10.9,27.8,-10.9,29.7,-10.9,31.5,-10.9,33.4,-10.9,35.3,-10.9,37.2,-10.9,39,-10.9,-76.1,-12.8,-74.2,-12.8,-72.4,-12.8,-70.5,-12.8,-68.6,-12.8,-66.7,-12.8,-64.9,-12.8,-63,-12.8,-61.1,-12.8,-59.3,-12.8,-57.4,-12.8,-55.5,-12.8,-53.6,-12.8,-51.8,-12.8,-49.9,-12.8,-48,-12.8,-46.2,-12.8,-44.3,-12.8,-42.4,-12.8,-40.5,-12.8,-38.7,-12.8,13.8,-12.8,15.6,-12.8,17.5,-12.8,19.4,-12.8,21.2,-12.8,23.1,-12.8,25,-12.8,26.9,-12.8,28.7,-12.8,30.6,-12.8,32.5,-12.8,34.3,-12.8,36.2,-12.8,38.1,-12.8,40,-12.8,49.3,-12.8,131.7,-12.8,133.6,-12.8,135.4,-12.8,142.9,-12.8,-75.2,-14.7,-73.3,-14.7,-71.4,-14.7,-69.6,-14.7,-67.7,-14.7,-65.8,-14.7,-63.9,-14.7,-62.1,-14.7,-60.2,-14.7,-58.3,-14.7,-56.4,-14.7,-54.6,-14.7,-52.7,-14.7,-50.8,-14.7,-49,-14.7,-47.1,-14.7,-45.2,-14.7,-43.3,-14.7,-41.5,-14.7,-39.6,-14.7,12.8,-14.7,14.7,-14.7,16.6,-14.7,18.4,-14.7,20.3,-14.7,22.2,-14.7,24,-14.7,25.9,-14.7,27.8,-14.7,29.7,-14.7,31.5,-14.7,33.4,-14.7,35.3,-14.7,37.2,-14.7,39,-14.7,48.4,-14.7,127,-14.7,130.8,-14.7,132.6,-14.7,134.5,-14.7,142,-14.7,143.9,-14.7,-72.4,-16.5,-70.5,-16.5,-68.6,-16.5,-66.7,-16.5,-64.9,-16.5,-63,-16.5,-61.1,-16.5,-59.3,-16.5,-57.4,-16.5,-55.5,-16.5,-53.6,-16.5,-51.8,-16.5,-49.9,-16.5,-48,-16.5,-46.2,-16.5,-44.3,-16.5,-42.4,-16.5,-40.5,-16.5,11.9,-16.5,13.8,-16.5,15.6,-16.5,17.5,-16.5,19.4,-16.5,21.2,-16.5,23.1,-16.5,25,-16.5,26.9,-16.5,28.7,-16.5,30.6,-16.5,32.5,-16.5,34.3,-16.5,36.2,-16.5,38.1,-16.5,45.6,-16.5,47.4,-16.5,49.3,-16.5,124.2,-16.5,126.1,-16.5,127.9,-16.5,129.8,-16.5,131.7,-16.5,133.6,-16.5,135.4,-16.5,137.3,-16.5,142.9,-16.5,144.8,-16.5,-69.6,-18.4,-67.7,-18.4,-65.8,-18.4,-63.9,-18.4,-62.1,-18.4,-60.2,-18.4,-58.3,-18.4,-56.4,-18.4,-54.6,-18.4,-52.7,-18.4,-50.8,-18.4,-49,-18.4,-47.1,-18.4,-45.2,-18.4,-43.3,-18.4,-41.5,-18.4,-39.6,-18.4,12.8,-18.4,14.7,-18.4,16.6,-18.4,18.4,-18.4,20.3,-18.4,22.2,-18.4,24,-18.4,25.9,-18.4,27.8,-18.4,29.7,-18.4,31.5,-18.4,33.4,-18.4,35.3,-18.4,44.6,-18.4,46.5,-18.4,48.4,-18.4,123.3,-18.4,125.1,-18.4,127,-18.4,128.9,-18.4,130.8,-18.4,132.6,-18.4,134.5,-18.4,136.4,-18.4,138.2,-18.4,140.1,-18.4,142,-18.4,143.9,-18.4,145.7,-18.4,-68.6,-20.3,-66.7,-20.3,-64.9,-20.3,-63,-20.3,-61.1,-20.3,-59.3,-20.3,-57.4,-20.3,-55.5,-20.3,-53.6,-20.3,-51.8,-20.3,-49.9,-20.3,-48,-20.3,-46.2,-20.3,-44.3,-20.3,-42.4,-20.3,-40.5,-20.3,13.8,-20.3,15.6,-20.3,17.5,-20.3,19.4,-20.3,21.2,-20.3,23.1,-20.3,25,-20.3,26.9,-20.3,28.7,-20.3,30.6,-20.3,32.5,-20.3,34.3,-20.3,45.6,-20.3,47.4,-20.3,120.5,-20.3,122.3,-20.3,124.2,-20.3,126.1,-20.3,127.9,-20.3,129.8,-20.3,131.7,-20.3,133.6,-20.3,135.4,-20.3,137.3,-20.3,139.2,-20.3,141,-20.3,142.9,-20.3,144.8,-20.3,146.7,-20.3,148.5,-20.3,-69.6,-22.2,-67.7,-22.2,-65.8,-22.2,-63.9,-22.2,-62.1,-22.2,-60.2,-22.2,-58.3,-22.2,-56.4,-22.2,-54.6,-22.2,-52.7,-22.2,-50.8,-22.2,-49,-22.2,-47.1,-22.2,-45.2,-22.2,-43.3,-22.2,-41.5,-22.2,14.7,-22.2,16.6,-22.2,18.4,-22.2,20.3,-22.2,22.2,-22.2,24,-22.2,25.9,-22.2,27.8,-22.2,29.7,-22.2,31.5,-22.2,33.4,-22.2,35.3,-22.2,44.6,-22.2,46.5,-22.2,115.8,-22.2,117.6,-22.2,119.5,-22.2,121.4,-22.2,123.3,-22.2,125.1,-22.2,127,-22.2,128.9,-22.2,130.8,-22.2,132.6,-22.2,134.5,-22.2,136.4,-22.2,138.2,-22.2,140.1,-22.2,142,-22.2,143.9,-22.2,145.7,-22.2,147.6,-22.2,149.5,-22.2,166.3,-22.2,-68.6,-24,-66.7,-24,-64.9,-24,-63,-24,-61.1,-24,-59.3,-24,-57.4,-24,-55.5,-24,-53.6,-24,-51.8,-24,-49.9,-24,-48,-24,-46.2,-24,15.6,-24,17.5,-24,19.4,-24,21.2,-24,23.1,-24,25,-24,26.9,-24,28.7,-24,30.6,-24,32.5,-24,34.3,-24,45.6,-24,47.4,-24,114.8,-24,116.7,-24,118.6,-24,120.5,-24,122.3,-24,124.2,-24,126.1,-24,127.9,-24,129.8,-24,131.7,-24,133.6,-24,135.4,-24,137.3,-24,139.2,-24,141,-24,142.9,-24,144.8,-24,146.7,-24,148.5,-24,150.4,-24,-69.6,-25.9,-67.7,-25.9,-65.8,-25.9,-63.9,-25.9,-62.1,-25.9,-60.2,-25.9,-58.3,-25.9,-56.4,-25.9,-54.6,-25.9,-52.7,-25.9,-50.8,-25.9,-49,-25.9,16.6,-25.9,18.4,-25.9,20.3,-25.9,22.2,-25.9,24,-25.9,25.9,-25.9,27.8,-25.9,29.7,-25.9,31.5,-25.9,115.8,-25.9,117.6,-25.9,119.5,-25.9,121.4,-25.9,123.3,-25.9,125.1,-25.9,127,-25.9,128.9,-25.9,130.8,-25.9,132.6,-25.9,134.5,-25.9,136.4,-25.9,138.2,-25.9,140.1,-25.9,142,-25.9,143.9,-25.9,145.7,-25.9,147.6,-25.9,149.5,-25.9,151.3,-25.9,-70.5,-27.8,-68.6,-27.8,-66.7,-27.8,-64.9,-27.8,-63,-27.8,-61.1,-27.8,-59.3,-27.8,-57.4,-27.8,-55.5,-27.8,-53.6,-27.8,-51.8,-27.8,-49.9,-27.8,15.6,-27.8,17.5,-27.8,19.4,-27.8,21.2,-27.8,23.1,-27.8,25,-27.8,26.9,-27.8,28.7,-27.8,30.6,-27.8,32.5,-27.8,114.8,-27.8,116.7,-27.8,118.6,-27.8,120.5,-27.8,122.3,-27.8,124.2,-27.8,126.1,-27.8,127.9,-27.8,129.8,-27.8,131.7,-27.8,133.6,-27.8,135.4,-27.8,137.3,-27.8,139.2,-27.8,141,-27.8,142.9,-27.8,144.8,-27.8,146.7,-27.8,148.5,-27.8,150.4,-27.8,152.3,-27.8,-69.6,-29.6,-67.7,-29.6,-65.8,-29.6,-63.9,-29.6,-62.1,-29.6,-60.2,-29.6,-58.3,-29.6,-56.4,-29.6,-54.6,-29.6,-52.7,-29.6,-50.8,-29.6,18.4,-29.6,20.3,-29.6,22.2,-29.6,24,-29.6,25.9,-29.6,27.8,-29.6,29.7,-29.6,115.8,-29.6,117.6,-29.6,119.5,-29.6,121.4,-29.6,123.3,-29.6,125.1,-29.6,127,-29.6,128.9,-29.6,130.8,-29.6,132.6,-29.6,134.5,-29.6,136.4,-29.6,138.2,-29.6,140.1,-29.6,142,-29.6,143.9,-29.6,145.7,-29.6,147.6,-29.6,149.5,-29.6,151.3,-29.6,153.2,-29.6,-70.5,-31.5,-68.6,-31.5,-66.7,-31.5,-64.9,-31.5,-63,-31.5,-61.1,-31.5,-59.3,-31.5,-57.4,-31.5,-55.5,-31.5,-53.6,-31.5,-51.8,-31.5,19.4,-31.5,21.2,-31.5,23.1,-31.5,25,-31.5,26.9,-31.5,28.7,-31.5,116.7,-31.5,118.6,-31.5,120.5,-31.5,122.3,-31.5,124.2,-31.5,126.1,-31.5,127.9,-31.5,129.8,-31.5,131.7,-31.5,133.6,-31.5,135.4,-31.5,137.3,-31.5,139.2,-31.5,141,-31.5,142.9,-31.5,144.8,-31.5,146.7,-31.5,148.5,-31.5,150.4,-31.5,152.3,-31.5,-71.4,-33.4,-69.6,-33.4,-67.7,-33.4,-65.8,-33.4,-63.9,-33.4,-62.1,-33.4,-60.2,-33.4,-58.3,-33.4,-56.4,-33.4,-54.6,-33.4,18.4,-33.4,20.3,-33.4,22.2,-33.4,24,-33.4,25.9,-33.4,115.8,-33.4,117.6,-33.4,119.5,-33.4,121.4,-33.4,123.3,-33.4,136.4,-33.4,138.2,-33.4,140.1,-33.4,142,-33.4,143.9,-33.4,145.7,-33.4,147.6,-33.4,149.5,-33.4,151.3,-33.4,-72.4,-35.3,-70.5,-35.3,-68.6,-35.3,-66.7,-35.3,-64.9,-35.3,-63,-35.3,-61.1,-35.3,-59.3,-35.3,-57.4,-35.3,139.2,-35.3,141,-35.3,142.9,-35.3,144.8,-35.3,146.7,-35.3,148.5,-35.3,150.4,-35.3,-71.4,-37.1,-69.6,-37.1,-67.7,-37.1,-65.8,-37.1,-63.9,-37.1,-62.1,-37.1,-60.2,-37.1,-58.3,-37.1,140.1,-37.1,142,-37.1,143.9,-37.1,145.7,-37.1,147.6,-37.1,149.5,-37.1,175.7,-37.1,-72.4,-39,-70.5,-39,-68.6,-39,-66.7,-39,-64.9,-39,-63,-39,174.7,-39,176.6,-39,-73.3,-40.9,-71.4,-40.9,-69.6,-40.9,-67.7,-40.9,-65.8,-40.9,-63.9,-40.9,175.7,-40.9,-72.4,-42.7,-70.5,-42.7,-68.6,-42.7,-66.7,-42.7,-64.9,-42.7,146.7,-42.7,171,-42.7,172.9,-42.7,-73.3,-44.6,-71.4,-44.6,-69.6,-44.6,-67.7,-44.6,-65.8,-44.6,168.2,-44.6,170.1,-44.6,-74.2,-46.5,-72.4,-46.5,-70.5,-46.5,-68.6,-46.5,169.1,-46.5,-75.2,-48.4,-73.3,-48.4,-71.4,-48.4,-69.6,-48.4,-67.7,-48.4,-74.2,-50.2,-72.4,-50.2,-70.5,-50.2,-68.6,-50.2,-73.3,-52.1,-71.4,-52.1,-69.6,-52.1,-60.2,-52.1,-72.4,-54,-70.5,-54,-68.6,-54]);var ys={lat:35.23,lon:-82.73},fc=new We("#d9b56a"),Ra=new We("#f1d9a0"),ed=new We("#e03694"),pc=1920,dr=1080,nd=8,id=40,mc=2*id*Math.tan(Jt.degToRad(nd/2))/dr;function pn(i,e,t=1){let n=Jt.degToRad(i),s=Jt.degToRad(e);return new D(t*Math.cos(n)*Math.sin(s),t*Math.sin(n),t*Math.cos(n)*Math.cos(s))}function ax(i){let e=i.clone().normalize();return{lat:Jt.radToDeg(Math.asin(e.y)),lon:Jt.radToDeg(Math.atan2(e.x,e.z))}}var td=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,lx=i=>((i+180)%360+360)%360-180;function sd(i,{reducedMotion:e=!1,clear:t=!1}={}){let n=new Ma({canvas:i,antialias:!0,alpha:!0});n.setClearColor(0,0);let s=new qs,r=new Pt(nd,pc/dr,1,200);r.position.set(0,0,id);let o=new en,a=new en;a.rotation.order="XYZ",o.add(a),s.add(o);let l=[],c=(k,ee)=>(k.transparent=!0,l.push([k,ee]),k),h=new pt(new bi(.995,96,64),c(new St({uniforms:{uOpacity:{value:1},uRim:{value:fc}},vertexShader:`varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,fragmentShader:`uniform float uOpacity; uniform vec3 uRim; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
            vec3 base = mix(vec3(0.035,0.06,0.11), vec3(0.06,0.09,0.16), vN.y*0.5+0.5);
            gl_FragColor = vec4(base + uRim*f*0.55, uOpacity*0.92); }`}),1));a.add(h),h.renderOrder=0;let u=new pt(new bi(1.18,64,48),c(new St({uniforms:{uOpacity:{value:1},uColor:{value:fc}},side:wt,depthWrite:!1,blending:t?Bn:ir,vertexShader:`varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,fragmentShader:`uniform float uOpacity; uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main(){ float d = dot(vN, vV); float g = smoothstep(0.0, 0.55, -d) * smoothstep(1.0, 0.35, -d);
            gl_FragColor = vec4(uColor, g*0.32*uOpacity); }`}),1));u.renderOrder=-1,o.add(u);let d=[],p=128;for(let k=-60;k<=60;k+=30)for(let ee=0;ee<p;ee++){let ue=pn(k,ee/p*360-180,1.002),de=pn(k,(ee+1)/p*360-180,1.002);d.push(ue.x,ue.y,ue.z,de.x,de.y,de.z)}for(let k=-180;k<180;k+=30)for(let ee=0;ee<p/2;ee++){let ue=pn(ee/(p/2)*180-90,k,1.002),de=pn((ee+1)/(p/2)*180-90,k,1.002);d.push(ue.x,ue.y,ue.z,de.x,de.y,de.z)}let g=new bt;g.setAttribute("position",new it(d,3));let _=new $s(g,c(new os({color:fc,depthWrite:!1}),.16));_.renderOrder=1,a.add(_);let m=[];for(let k=0;k<Ca.length;k+=2){let ee=pn(Ca[k+1],Ca[k],1.004);m.push(ee.x,ee.y,ee.z)}let f=new bt;f.setAttribute("position",new it(m,3));let E=c(new St({uniforms:{uOpacity:{value:1},uColor:{value:Ra},uSize:{value:4}},depthWrite:!1,vertexShader:`uniform float uSize; varying float vFace;
        void main(){ vec4 mv = modelViewMatrix*vec4(position,1.);
          vec3 n = normalize(normalMatrix*normalize(position)); vFace = dot(n, normalize(-mv.xyz));
          gl_PointSize = uSize; gl_Position = projectionMatrix*mv; }`,fragmentShader:`uniform float uOpacity; uniform vec3 uColor; varying float vFace;
        void main(){ if (vFace < 0.0) discard; vec2 c = gl_PointCoord-0.5; float d = length(c); if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.3, d) * (0.35 + 0.65*smoothstep(0.0, 0.5, vFace));
          gl_FragColor = vec4(uColor, a*uOpacity*0.9); }`}),1),w=new Js(f,E);w.renderOrder=2,a.add(w);let M=new en,C=pn(ys.lat,ys.lon,1.006);M.position.copy(C),M.lookAt(C.clone().multiplyScalar(2));let A=new pt(new as(.014,24),c(new dn({color:ed,depthWrite:!1}),1)),R=new pt(new ls(.02,.026,48),c(new dn({color:ed,depthWrite:!1,side:$t}),.8));M.add(A,R),A.renderOrder=R.renderOrder=5,a.add(M);let F=new ai({color:Ra,linewidth:3,transparent:!0,depthWrite:!1,worldUnits:!1});F.resolution.set(pc,dr);let b=null,v=[],I=new pt(new bi(.014,16,12),new dn({color:16777215,transparent:!0})),z=new en,q=new pt(new ls(.03,.038,48),new dn({color:Ra,transparent:!0,depthWrite:!1,side:$t})),J=new pt(new as(.016,24),new dn({color:Ra,transparent:!0,depthWrite:!1}));z.add(q,J),q.renderOrder=J.renderOrder=5,I.renderOrder=6,a.add(I,z),I.visible=!1,z.visible=!1;function K(k){if(b&&(a.remove(b),b.geometry.dispose(),b=null),!k){v=[];return}let ee=pn(ys.lat,ys.lon),ue=pn(k.lat,k.lon),Fe=.08+.2*(ee.angleTo(ue)/Math.PI),Ge=160;v=[];let T=[];for(let Ce=0;Ce<=Ge;Ce++){let _e=Ce/Ge,je=$(ee,ue,_e).multiplyScalar(1.006+Fe*Math.sin(Math.PI*_e));v.push(je),T.push(je.x,je.y,je.z)}let qe=new _s;qe.setPositions(T),b=new Aa(qe,F),b.renderOrder=4,b.computeLineDistances(),qe.instanceCount=0,a.add(b);let Le=pn(k.lat,k.lon,1.007);z.position.copy(Le),z.lookAt(Le.clone().multiplyScalar(2))}function $(k,ee,ue){let de=k.angleTo(ee);if(de<1e-5)return k.clone();let Fe=Math.sin(de);return k.clone().multiplyScalar(Math.sin((1-ue)*de)/Fe).add(ee.clone().multiplyScalar(Math.sin(ue*de)/Fe))}let j={x:960,y:540,r:380,opacity:0,lat:20,lon:-40,spin:4},G={...j},se={...j},O=0,W=1,ne=null,Ue=performance.now();function xe(k,{instant:ee=!1,route:ue=null}={}){if(G={...j},se={...j,...k},ue){let Fe=pn(ys.lat,ys.lon),Ge=pn(ue.lat,ue.lon),T=Fe.angleTo(Ge)>Jt.degToRad(140),qe=ax($(Fe,Ge,T?.75:.55));se.lat=Jt.clamp(qe.lat-4,-50,60),se.lon=qe.lon,se.spin=0}se.lon=G.lon+lx(se.lon-G.lon),O=performance.now(),W=ee||e?0:1700,ne&&ue&&ne.dest.lat===ue.lat&&ne.dest.lon===ue.lon||(K(ue),ne=ue?{dest:ue,start:O+(ee||e?0:W*.8)}:null)}function Ae(k,ee){n.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),n.setSize(k,ee,!1),F.resolution.set(k,ee),E.uniforms.uSize.value=Math.max(2,4.2*(ee/dr)*Math.min(window.devicePixelRatio||1,2))}function V(k){let ee=Math.min(.1,(k-Ue)/1e3);Ue=k;let ue=W===0?1:Math.min(1,(k-O)/W),de=td(ue);for(let Ge of["x","y","r","opacity","lat","spin"])j[Ge]=G[Ge]+(se[Ge]-G[Ge])*de;!e&&se.spin&&(se.lon-=se.spin*ee,G.lon-=se.spin*ee),j.lon=G.lon+(se.lon-G.lon)*de,o.position.set((j.x-pc/2)*mc,(dr/2-j.y)*mc,0),o.scale.setScalar(Math.max(j.r,.001)*mc),a.rotation.set(Jt.degToRad(j.lat),Jt.degToRad(-j.lon),0);for(let[Ge,T]of l)Ge.uniforms&&Ge.uniforms.uOpacity?Ge.uniforms.uOpacity.value=j.opacity:Ge.opacity=T*j.opacity;let Fe=e?.5:k/2200%1;if(R.scale.setScalar(1+Fe*1.6),R.material.opacity=.8*(1-Fe)*j.opacity,ne&&b){let Ge=Math.max(0,Math.min(1,(k-ne.start)/(e?1:2600))),T=td(Ge),qe=Math.round(T*(v.length-1));if(b.geometry.instanceCount=qe,F.opacity=j.opacity,I.visible=Ge>0&&Ge<1,I.visible&&I.position.copy(v[Math.max(0,qe)]),I.material.opacity=j.opacity,z.visible=Ge>=1,z.visible){let Le=(k-ne.start-2600)/1e3,Ce=e?1:Math.min(1,Le*3),_e=e?1:1+.12*Math.sin(Le*2.4);z.scale.setScalar(Ce*_e),q.material.opacity=J.material.opacity=j.opacity}}else I.visible=!1,z.visible=!1;i.style.visibility=j.opacity<.005?"hidden":"visible",j.opacity>=.005&&n.render(s,r),requestAnimationFrame(V)}return requestAnimationFrame(V),{setPose:xe,resize:Ae}}var af=Pf(rf(),1);var kc="data:image/webp;base64,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";var mn={loop:{label:"Holding loop",help:"Plays the Gala loop while people arrive or during a break. Build-in plays once first; build-out plays when you move on. The current loop files still show the old name, An Atlas of Wonders: swap in the World of Connections files once they are rendered.",fields:[{key:"video",label:"Loop video",kind:"media"},{key:"intro",label:"Build-in video (plays once, optional)",kind:"media"},{key:"outro",label:"Build-out video (plays when you move on, optional)",kind:"media"},{key:"caption",label:"Caption along the bottom (optional)",kind:"text"}],globe:{opacity:0}},title:{label:"Title",help:"The A World of Connections lockup over the globe. Put *stars* around words in the tagline to set them in brass.",fields:[{key:"kicker",label:"Line above (optional)",kind:"text"},{key:"tagline",label:"Tagline",kind:"text"},{key:"footer",label:"Line along the bottom (optional)",kind:"text"}],globe:{x:960,y:520,r:470,opacity:.42,lat:18,spin:3}},divider:{label:"Section divider",help:"A section title beside the globe.",fields:[{key:"number",label:"Section number (optional)",kind:"text"},{key:"title",label:"Title",kind:"text"},{key:"subtitle",label:"Subtitle (optional)",kind:"area"}],globe:{x:1400,y:560,r:430,opacity:1,lat:22,spin:5}},programme:{label:"Programme",help:"The evening at a glance. One item per line: time | what happens.",fields:[{key:"title",label:"Title",kind:"text"},{key:"items",label:"Items (time | what happens)",kind:"lines",parts:["Time","What happens"]}],globe:{x:1560,y:820,r:520,opacity:.55,lat:30,spin:3}},video:{label:"Video",help:"Plays full screen with sound as soon as the page opens. Press \u2192 again to move on.",fields:[{key:"title",label:"Title (shows if the file is missing, and in the overview)",kind:"text"},{key:"video",label:"Video file",kind:"media"},{key:"autoAdvance",label:"Move on by itself when the video ends",kind:"check"}],globe:{opacity:0}},numbers:{label:"Year in numbers",help:"Up to six figures. One per line: number | what it counts.",fields:[{key:"title",label:"Title",kind:"text"},{key:"stats",label:"Figures (number | what it counts)",kind:"lines",parts:["Number","Label"]},{key:"note",label:"Footnote (optional)",kind:"text"}],globe:{x:960,y:1180,r:620,opacity:.5,lat:40,spin:3}},people:{label:"People",help:"Staff or board recognition. One person per line: name | role.",fields:[{key:"title",label:"Title",kind:"text"},{key:"subtitle",label:"Line under the title (optional)",kind:"text"},{key:"people",label:"People (name | role)",kind:"lines",parts:["Name","Role"]}],globe:{x:960,y:1240,r:640,opacity:.4,lat:40,spin:2}},sponsors:{label:"Sponsors",help:"One sponsor per line: name | logo file in show/media (optional). Hidden until sponsors are confirmed.",fields:[{key:"title",label:"Title",kind:"text"},{key:"subtitle",label:"Line under the title (optional)",kind:"text"},{key:"sponsors",label:"Sponsors (name | logo file)",kind:"lines",parts:["Name","Logo file"]}],globe:{x:960,y:1240,r:640,opacity:.35,lat:40,spin:2}},auction:{label:"Auction opener",help:"Introduces the live travel auction.",fields:[{key:"title",label:"Title",kind:"text"},{key:"body",label:"Text",kind:"area"},{key:"footer",label:"Line along the bottom (optional)",kind:"text"}],globe:{x:960,y:540,r:470,opacity:.5,lat:15,spin:9}},trip:{label:"Trip",help:"One auction lot, numbered as a connection (Connection 01). The globe turns to the destination and draws the route from Brevard. Press S during the show to stamp it SOLD.",fields:[{key:"lot",label:"Connection number (the lot number, e.g. 1)",kind:"text"},{key:"title",label:"Trip name",kind:"text"},{key:"place",label:"Destination (as it should read)",kind:"text"},{key:"lat",label:"Latitude (e.g. 41.9 for Rome)",kind:"number"},{key:"lon",label:"Longitude (west is negative, e.g. -70.7)",kind:"number"},{key:"blurb",label:"Short description",kind:"area"},{key:"details",label:"What\u2019s included (one per line)",kind:"lines"},{key:"value",label:"Value (optional)",kind:"text"},{key:"opening",label:"Opening bid (optional)",kind:"text"},{key:"photo",label:"Photo (optional)",kind:"media"},{key:"donor",label:"Donated by (optional)",kind:"text"},{key:"sold",label:"Sold",kind:"check"},{key:"soldFor",label:"Sold for (optional, shows on the stamp)",kind:"text"}],globe:{x:1390,y:560,r:420,opacity:1}},text:{label:"Words",help:"A heading and a few lines \u2014 intermission, a quote, an announcement.",fields:[{key:"title",label:"Heading",kind:"text"},{key:"body",label:"Text (optional)",kind:"area"},{key:"attribution",label:"Attribution (optional, for a quote)",kind:"text"}],globe:{x:960,y:1300,r:700,opacity:.35,lat:45,spin:2}},thanks:{label:"Thank you",help:"Closing page with a QR code for giving.",fields:[{key:"title",label:"Title",kind:"text"},{key:"body",label:"Text",kind:"area"},{key:"qrUrl",label:"QR code link",kind:"text"},{key:"qrLabel",label:"Address shown under the QR code",kind:"text"}],globe:{x:520,y:560,r:360,opacity:.9,lat:25,spin:4}}};function of(i){let e={id:zc(),type:i};for(let t of mn[i].fields)e[t.key]=t.kind==="check"?!1:t.kind==="lines"?[]:"";return i==="loop"&&(e.video="Atlas-of-Wonders-Loop-1440p30.mp4"),i==="sponsors"&&(e.hidden=!0),e}function zc(){return Math.random().toString(36).slice(2,9)}function Mr(i){let e=mn[i.type];return i.type==="trip"?[i.lot&&`Connection ${/^\d$/.test(String(i.lot))?`0${i.lot}`:i.lot}`,i.title||i.place||"Untitled trip"].filter(Boolean).join(" \xB7 "):i.type==="loop"?i.caption?`Loop \xB7 ${i.caption}`:"Holding loop":i.type==="title"?"Title":i.title||(e?e.label:i.type)}function br(i){return String(i).split("|").map(e=>e.trim())}var lf=kc,Vc=i=>i?`media/${encodeURI(String(i).trim())}`:"";function L(i,e={},...t){let n=document.createElement(i);for(let[s,r]of Object.entries(e))r==null||r===!1||(s==="class"?n.className=r:s==="style"?n.style.cssText=r:s.startsWith("on")?n.addEventListener(s.slice(2),r):n.setAttribute(s,r===!0?"":r));for(let s of t.flat())s==null||s===!1||s===""||n.append(s instanceof Node?s:document.createTextNode(String(s)));return n}function Sr(i,e){return String(i||"").split(/\n\s*\n|\n/).map(t=>t.trim()).filter(Boolean).map(t=>L("p",{class:e},t))}var wr=i=>(Array.isArray(i)?i:String(i||"").split(`
`)).map(e=>String(e).trim()).filter(Boolean);function di(i,e=24){if(!i||!i.isConnected)return;i.style.fontSize="";let t=parseFloat(getComputedStyle(i).fontSize),n=60,s=()=>i.scrollHeight>i.clientHeight+t*.25||i.scrollWidth>i.clientWidth+1;for(;n-- >0&&t>e&&s();)t*=.94,i.style.fontSize=`${t}px`}function gn(){return L("div",{class:"rule"},L("i"),L("b"),L("img",{src:kc,alt:""}),L("b"),L("i"))}var i_="http://www.w3.org/2000/svg";function Ct(i,e={}){let t=document.createElementNS(i_,i);for(let[n,s]of Object.entries(e))t.setAttribute(n,s);return t}function s_(){let i=Ct("svg",{class:"lk-art",viewBox:"0 0 200 200","aria-hidden":"true"}),e=Ct("g",{class:"rays"});for(let n=0;n<=24;n++){let s=Math.PI*(n/24),r=n%2?98:112;e.append(Ct("line",{x1:100-Math.cos(s)*20,y1:132-Math.sin(s)*20,x2:100-Math.cos(s)*r,y2:132-Math.sin(s)*r}))}let t=Ct("g",{class:"globe"});return t.append(Ct("circle",{cx:100,cy:100,r:78}),Ct("ellipse",{cx:100,cy:100,rx:52,ry:78}),Ct("ellipse",{cx:100,cy:100,rx:24,ry:78}),Ct("ellipse",{cx:100,cy:100,rx:78,ry:32}),Ct("path",{d:"M100 22v156M22 100h156"})),i.append(e,t,Ct("path",{class:"route",d:"M38 62 Q 62 32 100 30"}),Ct("path",{class:"route",d:"M100 30 Q 138 32 162 62"}),Ct("path",{class:"route",d:"M100 30 Q 124 16 142 40"}),Ct("circle",{class:"node",cx:38,cy:62,r:1.8}),Ct("circle",{class:"node",cx:162,cy:62,r:1.8}),Ct("circle",{class:"node",cx:142,cy:40,r:1.8}),Ct("circle",{class:"home",cx:100,cy:30,r:3.6}),Ct("circle",{class:"node",cx:100,cy:30,r:1.6})),i}function cf(i=""){return L("div",{class:`lockup ${i}`,role:"img","aria-label":"A World of Connections, the SparkPoint Gala"},s_(),L("span",{class:"lk-a","aria-hidden":"true"},"A"),L("span",{class:"lk-world","aria-hidden":"true"},"World"),L("span",{class:"lk-conn","aria-hidden":"true"},"of Connections"),gn(),L("span",{class:"lk-by","aria-hidden":"true"},"The SparkPoint Gala"),L("span",{class:"lk-by2","aria-hidden":"true"},"Live travel auction"))}var r_=70/78;function hf(i,e){let t=i.offsetLeft,n=i.offsetTop;for(let r=i.offsetParent;r&&!r.classList.contains("page");r=r.offsetParent)t+=r.offsetLeft,n+=r.offsetTop;let s=1.5*i.offsetHeight;return i.classList.add("on-globe"),{x:t+i.offsetWidth/2,y:n+.44*i.offsetHeight,r:78/200*s,opacity:e,lat:35.23-Math.asin(r_)*180/Math.PI,lon:-82.73,spin:0}}function o_(i){return String(i).split(/\*([^*]+)\*/).map((e,t)=>t%2?L("em",{},e):e)}function a_(i){let e=String(i??"").trim();return e?`Connection ${/^\d$/.test(e)?`0${e}`:e}`:"Connection"}function l_(i,e){return L("div",{class:"missing"},L("p",{},i),L("code",{},`media/${e||"(no file chosen)"}`))}function Va(i,{loop:e=!1,muted:t=!1}={}){let n=L("video",{src:Vc(i),preload:"auto",playsinline:!0});return n.loop=e,n.muted=t,n}var Zt={};Zt.loop=(i,e)=>{let t=L("section",{class:"page page-loop"}),n=Va(i.video,{loop:!0,muted:!0}),s=i.intro?Va(i.intro,{muted:!0}):null,r=i.outro?Va(i.outro,{muted:!0}):null,o=cf("lockup-loop"),a=L("div",{class:"loop-fallback"},o),l=L("div",{class:"loop-stack"},n,s,r);t.append(a,l),i.caption&&t.append(L("p",{class:"loop-caption"},i.caption));let c="idle",h=!1;n.addEventListener("error",()=>{h=!0,t.classList.add("is-fallback"),requestAnimationFrame(()=>e.setGlobe(hf(o,.55)))});let u=p=>[n,s,r].forEach(g=>g&&(g.style.opacity=g===p?1:0));function d(){c="loop",u(n),n.currentTime=0,n.play().catch(()=>{})}return{root:t,enter({fromBack:p}={}){h||(s&&!p?(c="intro",u(s),s.currentTime=0,s.onended=d,s.onerror=d,s.play().catch(d)):d())},leave(){[n,s,r].forEach(p=>p&&p.pause()),c="idle"},next(p){return r&&!h&&c!=="outro"?(c="outro",n.pause(),u(r),r.currentTime=0,r.onended=p,r.onerror=p,r.play().catch(p),!0):!1}}};Zt.title=(i,e)=>{let t=cf("lockup-title");return{root:L("section",{class:"page page-cover"},i.kicker&&L("p",{class:"title-kicker"},i.kicker),t,i.tagline&&L("p",{class:"title-tagline"},o_(i.tagline)),i.footer&&L("p",{class:"page-footer"},i.footer)),enter:()=>e.setGlobe(hf(t,.55))}};Zt.divider=i=>{let e=L("h2",{class:"divider-title"},i.title);return{root:L("section",{class:"page page-divider"},L("div",{class:"divider-copy"},i.number&&L("p",{class:"divider-number"},i.number),e,gn(),i.subtitle&&L("div",{class:"divider-sub"},Sr(i.subtitle)))),enter:()=>di(e,60)}};Zt.programme=i=>{let e=L("ol",{class:"prog-list"},wr(i.items).map(n=>{let[s,r]=br(n);return L("li",{},L("span",{class:"prog-time"},r===void 0?"":s),L("span",{class:"prog-what"},r===void 0?s:r))}));return{root:L("section",{class:"page page-programme"},L("h2",{class:"page-title"},i.title),gn(),e),enter:()=>di(e,22)}};Zt.video=(i,e)=>{let t=Va(i.video),n=L("div",{class:"video-card"},L("h2",{class:"page-title"},i.title||"Video"),gn(),e.editing?l_("This video isn\u2019t in the media folder yet",i.video):null),s=L("section",{class:"page page-video"},n,t),r=!0;return t.addEventListener("error",()=>{r=!1,s.classList.add("is-missing")}),t.addEventListener("ended",()=>{i.autoAdvance&&e.advance()}),{root:s,enter(){r&&(t.currentTime=0,t.play().catch(()=>{}))},leave(){t.pause()}}};Zt.numbers=i=>{let e=wr(i.stats).slice(0,6),t=L("div",{class:`stats stats-${e.length}`},e.map(s=>{let[r,o]=br(s);return L("div",{class:"stat"},L("p",{class:"stat-num","data-count":r},r),L("p",{class:"stat-label"},o||""))}));return{root:L("section",{class:"page page-numbers"},L("h2",{class:"page-title"},i.title),gn(),t,i.note&&L("p",{class:"page-footer"},i.note)),enter({reducedMotion:s}={}){s||t.querySelectorAll(".stat-num").forEach((r,o)=>{let a=r.dataset.count,l=a.match(/^(\D*)([\d,]+(?:\.\d+)?)(\D*)$/);if(!l)return;let c=Number(l[2].replace(/,/g,"")),h=(l[2].split(".")[1]||"").length,u=performance.now()+o*140,d=p=>{let g=Math.max(0,Math.min(1,(p-u)/1600)),_=1-Math.pow(1-g,3);r.textContent=l[1]+(c*_).toLocaleString("en-US",{minimumFractionDigits:h,maximumFractionDigits:h})+l[3],g<1&&r.isConnected?requestAnimationFrame(d):r.textContent=a};requestAnimationFrame(d)})}}};Zt.people=i=>{let e=wr(i.people),t=e.length>12?4:e.length>6?3:e.length>3?2:1,n=L("ul",{class:"people",style:`--cols:${t}`},e.map(r=>{let[o,a]=br(r);return L("li",{},L("p",{class:"person-name"},o),a&&L("p",{class:"person-role"},a))}));return{root:L("section",{class:"page page-people"},L("h2",{class:"page-title"},i.title),i.subtitle&&L("p",{class:"page-sub"},i.subtitle),gn(),n),enter:()=>di(n,18)}};Zt.sponsors=i=>{let e=wr(i.sponsors),t=L("ul",{class:`sponsors ${e.length>8?"sponsors-many":""}`},e.map(s=>{let[r,o]=br(s),a=L("p",{class:"sponsor-name"},r);if(!o)return L("li",{},a);let l=L("img",{src:Vc(o),alt:r});return l.addEventListener("error",()=>l.replaceWith(a)),L("li",{class:"has-logo"},L("div",{class:"sponsor-plate"},l))}));return{root:L("section",{class:"page page-sponsors"},L("h2",{class:"page-title"},i.title),i.subtitle&&L("p",{class:"page-sub"},i.subtitle),gn(),t),enter:()=>di(t,18)}};Zt.auction=i=>{let e=L("section",{class:"page page-auction"},L("h2",{class:"auction-title"},i.title),gn(),L("div",{class:"auction-body"},Sr(i.body)),i.footer&&L("p",{class:"page-footer"},i.footer));return{root:e,enter:()=>di(e.querySelector(".auction-title"),60)}};Zt.trip=(i,e)=>{let t=wr(i.details),n=[i.value&&["Value",i.value],i.opening&&["Opening bid",i.opening]].filter(Boolean),s=i.photo?L("img",{class:"trip-photo",src:Vc(i.photo),alt:""}):null;s&&s.addEventListener("error",()=>s.remove());let r=L("div",{class:"stamp","aria-hidden":"true"},L("span",{class:"stamp-word"},"Sold"),L("span",{class:"stamp-amt"},i.soldFor||"")),o=L("h2",{class:"trip-title"},i.title||"Trip to be announced"),a=L("div",{class:"trip-copy"},L("p",{class:"trip-lot"},a_(i.lot),i.place&&L("span",{class:"trip-place"},i.place)),o,gn(),i.blurb&&L("div",{class:"trip-blurb"},Sr(i.blurb)),t.length>0&&L("ul",{class:"trip-details"},t.map(h=>L("li",{},h))),n.length>0&&L("dl",{class:"trip-meta"},n.map(([h,u])=>L("div",{},L("dt",{},h),L("dd",{},u)))),i.donor&&L("p",{class:"trip-donor"},`Donated by ${i.donor}`)),l=L("section",{class:`page page-trip ${s?"has-photo":""} ${i.sold?"is-sold":""}`},s,a,r),c=i.lat!==""&&i.lon!==""&&Number.isFinite(Number(i.lat))&&Number.isFinite(Number(i.lon));return{root:l,route:c?{lat:Number(i.lat),lon:Number(i.lon)}:null,enter(){di(o,56),di(a,16)},toggleSold(){i.sold=!i.sold,l.classList.toggle("is-sold",i.sold),e.changed()}}};Zt.text=i=>{let e=L("section",{class:`page page-text ${i.attribution?"is-quote":""}`},L("h2",{class:"text-title"},i.title),gn(),i.body&&L("div",{class:"text-body"},Sr(i.body)),i.attribution&&L("p",{class:"text-attr"},i.attribution));return{root:e,enter:()=>di(e.querySelector(".text-title"),50)}};function c_(i){return String(i).split(/(?<=[/.])/).flatMap((e,t)=>t?[L("wbr"),e]:[e])}Zt.thanks=i=>{let e=L("div",{class:"qr"});return i.qrUrl&&af.default.toString(i.qrUrl,{type:"svg",margin:0,errorCorrectionLevel:"M",color:{dark:"#0b1322",light:"#00000000"}}).then(n=>e.innerHTML=n).catch(()=>{}),{root:L("section",{class:"page page-thanks"},L("div",{class:"thanks-copy"},L("h2",{class:"thanks-title"},i.title),gn(),L("div",{class:"thanks-body"},Sr(i.body)),i.qrUrl&&L("div",{class:"qr-card"},e,L("p",{class:"qr-label"},c_(i.qrLabel||i.qrUrl)))))}};function uf(i,e){let t=Zt[i.type],n=t?t(i,e):{root:L("section",{class:"page"},`Unknown page type: ${i.type}`)},s={...mn[i.type]?.globe||{opacity:0}};return{enter(){},leave(){},next:()=>!1,route:null,...n,pose:s}}var h_="gala-show";function ff(i,e){return new Promise((t,n)=>{let s=indexedDB.open(h_,1);s.onupgradeneeded=()=>s.result.createObjectStore("kv"),s.onerror=()=>n(s.error),s.onsuccess=()=>{let r=s.result.transaction("kv",i),o=e(r.objectStore("kv"));r.oncomplete=()=>t(o&&o.result),r.onerror=()=>n(r.error)}})}var u_=i=>ff("readwrite",e=>e.put(i,"folder")).catch(()=>{}),df=()=>ff("readonly",i=>i.get("folder")).catch(()=>null);function d_(){let i=new Date,e=t=>String(t).padStart(2,"0");return`${i.getFullYear()}-${e(i.getMonth()+1)}-${e(i.getDate())}_${e(i.getHours())}${e(i.getMinutes())}${e(i.getSeconds())}`}function f_(i){return`// The show's content. Edit it in the deck (open index.html, press E), which saves this file.
// Hand edits are fine too: keep it valid JavaScript.
window.SHOW = ${JSON.stringify(i,null,2)};
`}function pf({show:i,getIndex:e,go:t,rerender:n,relayout:s,flash:r}){let o=!1,a=!1,l=null,c=typeof window.showDirectoryPicker=="function",h=L("aside",{class:"editor","aria-label":"Show editor"});document.body.append(h);let u=L("p",{class:"ed-status"}),d=L("ol",{class:"ed-list"}),p=L("div",{class:"ed-form"}),g=L("div",{class:"ed-report"}),_=L("select",{class:"ed-add","aria-label":"Add a page"},L("option",{value:""},"+ Add a page after this one\u2026"),Object.entries(mn).map(([O,W])=>L("option",{value:O},W.label)));_.addEventListener("change",()=>{let O=_.value;if(_.value="",!O)return;let W=e()+1;i.slides.splice(W,0,of(O)),w(),t(W,{instant:!0})});let m=L("button",{class:"ed-btn ed-primary",onclick:()=>F()},"Save"),f=L("button",{class:"ed-btn",onclick:()=>C()},"Choose show folder");h.append(L("header",{class:"ed-head"},L("div",{},L("h2",{},"Edit the show"),u),L("div",{class:"ed-actions"},m,L("button",{class:"ed-btn",onclick:()=>se(!1),title:"Close (E)"},"Close"))),L("section",{class:"ed-sec"},L("h3",{},"Pages"),d,_),p,L("section",{class:"ed-sec ed-tools"},L("h3",{},"Before the show"),L("div",{class:"ed-row"},L("button",{class:"ed-btn",onclick:()=>I()},"Check media files"),c?f:null),g));function E(){let O=l?`Saving to \u201C${l.name}\u201D`:c?"Save asks for the show folder the first time":"Save downloads content.js";u.textContent=a?`Unsaved changes \xB7 ${O}`:O,u.classList.toggle("is-dirty",a),m.disabled=!a}function w(){a=!0,E(),q()}window.addEventListener("beforeunload",O=>{a&&(O.preventDefault(),O.returnValue="")});async function M(O){let W={mode:"readwrite"};return await O.queryPermission(W)==="granted"?!0:await O.requestPermission(W)==="granted"}async function C(){try{let O=await window.showDirectoryPicker({id:"gala-show",mode:"readwrite"});try{await O.getFileHandle("index.html"),await O.getFileHandle("content.js")}catch{return r("That folder isn\u2019t the show folder \u2014 pick the one with index.html in it"),null}return l=O,await u_(O),E(),O}catch{return null}}async function A(){if(l&&await M(l))return l;let O=await df();return O&&await M(O).catch(()=>!1)?(l=O,E(),l):C()}async function R(O,W,ne){let xe=await(await O.getFileHandle(W,{create:!0})).createWritable();await xe.write(ne),await xe.close()}async function F(){let O=f_(i);if(c){let ne=await A();if(ne)try{let Ue=await(await(await ne.getFileHandle("content.js")).getFile()).text(),xe=await ne.getDirectoryHandle("backups",{create:!0});await R(xe,`content-${d_()}.js`,Ue),await R(ne,"content.js",O),a=!1,E(),r("Saved");return}catch(Ue){r(`Couldn\u2019t save to the folder (${Ue.message}) \u2014 downloading instead`)}}L("a",{href:URL.createObjectURL(new Blob([O],{type:"text/javascript"})),download:"content.js"}).click(),a=!1,E(),r("Downloaded content.js \u2014 put it in the show folder, replacing the old one")}async function b(O){if(c){let W=await A();if(W)try{let ne=await W.getDirectoryHandle("media",{create:!0}),Ue=!1;try{await ne.getFileHandle(O.name),Ue=!0}catch{}return Ue||(r(`Copying ${O.name} into media\u2026`),await R(ne,O.name,O)),r(Ue?`Using ${O.name} (already in media)`:`Copied ${O.name} into media`),O.name}catch(ne){r(`Couldn\u2019t copy the file (${ne.message})`)}}return r(`Put ${O.name} in the show\u2019s media folder`),O.name}function v(O,W){return new Promise(ne=>{let Ue=`media/${encodeURI(O)}`,xe=W==="image"?new Image:document.createElement("video"),Ae=k=>{clearTimeout(V),ne(k),xe.removeAttribute&&xe.removeAttribute("src")},V=setTimeout(()=>Ae(!1),8e3);W==="image"?(xe.onload=()=>Ae(!0),xe.onerror=()=>Ae(!1)):(xe.preload="metadata",xe.onloadedmetadata=()=>Ae(!0),xe.onerror=()=>Ae(!1)),xe.src=Ue})}async function I(){g.replaceChildren(L("p",{},"Checking\u2026"));let O=[];for(let[V,k]of i.slides.entries()){for(let ee of mn[k.type]?.fields||[])ee.kind==="media"&&k[ee.key]&&O.push({i:V,s:k,file:k[ee.key],kind:ee.key==="photo"?"image":"video"});if(k.type==="sponsors")for(let ee of k.sponsors||[]){let ue=String(ee).split("|")[1]?.trim();ue&&O.push({i:V,s:k,file:ue,kind:"image"})}}let W=await Promise.all(O.map(async V=>({...V,ok:await v(V.file,V.kind)}))),ne=W.filter(V=>!V.ok),Ue=W.filter(V=>V.ok&&/atlas-of-wonders/i.test(V.file)),Ae=i.slides.filter(V=>V.type==="trip"&&!V.hidden).filter(V=>!Number.isFinite(parseFloat(V.lat))||!Number.isFinite(parseFloat(V.lon)));g.replaceChildren(L("p",{class:ne.length?"is-bad":"is-ok"},ne.length?`${ne.length} of ${W.length} files missing from media:`:`All ${W.length} media files found.`),ne.length>0&&L("ul",{},ne.map(V=>L("li",{},L("button",{class:"ed-link",onclick:()=>t(V.i,{instant:!0})},`Page ${V.i+1}`),` ${V.file}`))),Ue.length>0&&L("p",{class:"is-bad"},`${Ue.length} loop file(s) still show the old name, An Atlas of Wonders. Swap in the World of Connections renders when they land.`),Ae.length>0&&L("p",{class:"is-bad"},`${Ae.length} trip page(s) have no map location yet, so the globe won\u2019t draw a route.`))}function z(O,W){let ne=O+W;ne<0||ne>=i.slides.length||([i.slides[O],i.slides[ne]]=[i.slides[ne],i.slides[O]],w(),t(ne,{instant:!0}))}function q(){if(!o)return;let O=e();d.replaceChildren(...i.slides.map((W,ne)=>L("li",{class:`ed-item ${ne===O?"is-current":""} ${W.hidden?"is-hidden":""}`},L("button",{class:"ed-pick",onclick:()=>t(ne,{instant:!0})},L("span",{class:"ed-num"},String(ne+1)),L("span",{class:"ed-name"},Mr(W)),L("span",{class:"ed-type"},(W.hidden?"Hidden \xB7 ":"")+(W.type==="trip"&&W.sold?"Sold \xB7 ":"")+(mn[W.type]?.label||W.type))),ne===O&&L("span",{class:"ed-tools-row"},L("button",{class:"ed-icon",title:"Move up",onclick:()=>z(ne,-1)},"\u2191"),L("button",{class:"ed-icon",title:"Move down",onclick:()=>z(ne,1)},"\u2193"),L("button",{class:"ed-icon",title:"Duplicate",onclick:()=>{i.slides.splice(ne+1,0,{...structuredClone(W),id:zc(),sold:!1,soldFor:""}),w(),t(ne+1,{instant:!0})}},"\u29C9"),L("button",{class:"ed-icon",title:W.hidden?"Show in the show":"Hide from the show (keeps it here)",onclick:()=>{W.hidden=!W.hidden,w()}},W.hidden?"Unhide":"Hide"),L("button",{class:"ed-icon ed-danger",title:"Delete",onclick:()=>{confirm(`Delete page ${ne+1}, \u201C${Mr(W)}\u201D? (Save keeps a backup of the old file.)`)&&(i.slides.splice(ne,1),w(),t(Math.min(ne,i.slides.length-1),{instant:!0}))}},"Delete"))))),d.querySelector(".is-current")?.scrollIntoView({block:"nearest"})}let J=0;function K(O,W,ne){O[W]=ne,w(),clearTimeout(J),J=setTimeout(n,250)}function $(O,W){let ne=`f-${O.id}-${W.key}`,Ue=L("label",{for:ne},W.label),xe;if(W.kind==="area"||W.kind==="lines"){let Ae=W.kind==="lines"?(O[W.key]||[]).join(`
`):O[W.key]||"";xe=L("textarea",{id:ne,rows:W.kind==="lines"?6:4,spellcheck:!0},Ae),xe.value=Ae,xe.addEventListener("input",()=>K(O,W.key,W.kind==="lines"?xe.value.split(`
`).map(V=>V.trimEnd()).filter((V,k,ee)=>V||k<ee.length-1):xe.value))}else{if(W.kind==="check")return xe=L("input",{id:ne,type:"checkbox"}),xe.checked=!!O[W.key],xe.addEventListener("change",()=>K(O,W.key,xe.checked)),L("div",{class:"ed-field ed-check"},xe,Ue);if(W.kind==="media"){xe=L("input",{id:ne,type:"text",placeholder:"file name in media/"}),xe.value=O[W.key]||"",xe.addEventListener("input",()=>K(O,W.key,xe.value.trim()));let Ae=L("input",{type:"file",accept:W.key==="photo"?"image/*":"video/*",hidden:!0});return Ae.addEventListener("change",async()=>{let V=Ae.files&&Ae.files[0];if(!V)return;let k=await b(V);xe.value=k,K(O,W.key,k)}),L("div",{class:"ed-field"},Ue,L("div",{class:"ed-row"},xe,L("button",{class:"ed-btn",onclick:()=>Ae.click()},"Choose\u2026"),Ae))}else xe=L("input",{id:ne,type:"text",inputmode:W.kind==="number"?"decimal":null}),xe.value=O[W.key]??"",xe.addEventListener("input",()=>{let Ae=xe.value.trim();K(O,W.key,W.kind==="number"?Ae===""||Number.isNaN(Number(Ae))?Ae:Number(Ae):xe.value)})}return L("div",{class:"ed-field"},Ue,xe)}let j=null;function G(){if(!o)return;let O=i.slides[e()];if(j=O||null,!O){p.replaceChildren();return}let W=mn[O.type];p.replaceChildren(L("section",{class:"ed-sec"},L("h3",{},`Page ${e()+1} \xB7 ${W?W.label:O.type}`),W&&L("p",{class:"ed-help"},W.help),O.type==="trip"&&L("p",{class:"ed-help"},"To find a latitude and longitude: in Google Maps, right-click the place and click the numbers at the top of the menu to copy them (latitude first)."),(W?W.fields:[]).map(ne=>$(O,ne))))}function se(O){o=O??!o,document.body.classList.toggle("editing",o),s(),o&&(E(),q(),G(),df().then(W=>{W&&!l&&(l=W,E())})),j=null,n()}return{isOpen:()=>o,toggle:se,changed:w,selected(){q(),i.slides[e()]!==j&&G()},ownsKey(O){if(!o)return!1;if((O.metaKey||O.ctrlKey)&&O.key.toLowerCase()==="s")return O.preventDefault(),F(),!0;let W=document.activeElement;return W&&h.contains(W)&&/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(W.tagName)?(O.key==="Escape"&&W.blur(),!(W.tagName==="BUTTON"&&!(O.key===" "||O.key==="Enter"))):!1}}}nh();var p_=L("link",{rel:"icon",href:lf});document.head.append(p_);var Hc=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Xn=window.SHOW=window.SHOW||{slides:[]};Xn.slides=Xn.slides||[];var gf=L("div",{class:"viewport"}),$a=L("div",{class:"stage"}),Xa=L("canvas",{class:"globe"}),qa=L("div",{class:"pages"}),Ya=L("div",{class:"blackout"}),Ga=L("div",{class:"hint"}),m_=L("div",{class:"frame"});$a.append(Xa,qa,m_);gf.append($a,Ya,Ga);document.body.append(gf);var Wa=sd(Xa,{reducedMotion:Hc});function Ja(){let i=document.body.classList.contains("editing")?__():0,e=window.innerWidth-i,t=window.innerHeight,n=Math.min(e/1920,t/1080);$a.style.transform=`translate(${(e-1920*n)/2}px, ${(t-1080*n)/2}px) scale(${n})`,Xa.style.width="1920px",Xa.style.height="1080px",Wa.resize(Math.round(1920*n),Math.round(1080*n))}window.addEventListener("resize",Ja);new ResizeObserver(()=>Ja()).observe(document.documentElement);var qn=0,kt=null,Ha=null,Gc=()=>Xn.slides.map((i,e)=>[i,e]).filter(([i])=>!i.hidden||Fi.isOpen());function An(i,{fromBack:e=!1,instant:t=!1}={}){if(!Xn.slides.length){qa.replaceChildren(L("section",{class:"page page-empty"},L("p",{},"No pages yet. Press E to open the editor."))),Wa.setPose({x:960,y:540,r:380,opacity:.6});return}i=Math.max(0,Math.min(Xn.slides.length-1,i));let n=kt;qn=i;let s=Xn.slides[i],r={editing:Fi.isOpen(),advance:()=>kt&&kt.slide===s&&qc(),changed:()=>Fi.changed(),setGlobe:a=>kt&&kt.slide===s&&Wa.setPose(a)},o=uf(s,r);if(kt={slide:s,page:o},n){n.page.leave();let a=n.page.root;a.classList.add("is-leaving"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),t||Hc?0:700)}qa.append(o.root),requestAnimationFrame(()=>{o.root.classList.add("is-in"),o.enter({fromBack:e,reducedMotion:Hc})}),Wa.setPose(o.pose,{instant:t,route:o.route}),$a.classList.toggle("bare",s.type==="loop"||s.type==="video"),Fi.selected(i);try{sessionStorage.setItem("gala-show-index",String(i))}catch{}}function Wc(i){let e=Gc().map(([,s])=>s);if(!e.length)return;let t=e.indexOf(qn),n=t===-1?e.find(s=>i>0?s>qn:s<qn):e[t+i];n!==void 0&&An(n,{fromBack:i<0})}function qc(){kt&&kt.page.next(()=>Wc(1))||Wc(1)}function g_(){let i=Xn.slides.map((e,t)=>[e,t]).filter(([e])=>e.type==="loop"&&!e.hidden);if(i.length)if(kt&&kt.slide.type==="loop"&&Ha!==null){let e=Ha;Ha=null,An(e)}else{Ha=qn;let e=i.filter(([,t])=>t<=qn).pop();An((e||i[0])[1])}}function mf(i){Ya.classList.toggle("on",i??!Ya.classList.contains("on"))}function As(i){Ga.textContent=i,Ga.classList.add("on"),clearTimeout(As.t),As.t=setTimeout(()=>Ga.classList.remove("on"),1600)}var Ts=L("div",{class:"overview"});document.body.append(Ts);function x_(){Ts.replaceChildren(L("div",{class:"ov-head"},L("p",{},"All pages"),L("p",{class:"ov-keys"},"Click a page to go to it \xB7 Esc to close")),L("ol",{class:"ov-grid"},Xn.slides.map((i,e)=>L("li",{class:`ov-card ov-${i.type} ${e===qn?"is-current":""} ${i.hidden?"is-hidden":""}`,onclick:()=>{xf(),An(e)}},L("span",{class:"ov-num"},String(e+1)),L("span",{class:"ov-type"},mn[i.type]?.label||i.type),L("span",{class:"ov-name"},Mr(i)),i.hidden&&L("span",{class:"ov-flag"},"Hidden"),i.type==="trip"&&i.sold&&L("span",{class:"ov-flag ov-sold"},"Sold"))))),Ts.classList.add("on"),Ts.querySelector(".is-current")?.scrollIntoView({block:"center"})}function xf(){Ts.classList.remove("on")}var Es="";window.addEventListener("keydown",i=>{if(Fi.ownsKey(i))return;let e=i.key;if(Ts.classList.contains("on")){(e==="Escape"||e==="o"||e==="O"||e==="g"||e==="G")&&xf();return}if(Ya.classList.contains("on")&&!["b","B",".","w","W",","].includes(e)){mf(!1);return}if(/^\d$/.test(e)){Es+=e,As(`Go to page ${Es} \u2014 press Enter`);return}if(e==="Enter"&&Es){An(Number(Es)-1),Es="";return}switch(Es="",e){case"ArrowRight":case"ArrowDown":case"PageDown":case" ":case"Enter":i.preventDefault(),qc();break;case"ArrowLeft":case"ArrowUp":case"PageUp":case"Backspace":i.preventDefault(),Wc(-1);break;case"Home":An(Gc()[0]?.[1]??0);break;case"End":An(Gc().at(-1)?.[1]??0);break;case"b":case"B":case".":case"w":case"W":case",":mf();break;case"l":case"L":g_();break;case"o":case"O":case"g":case"G":x_();break;case"s":case"S":kt&&kt.page.toggleSold&&(kt.page.toggleSold(),As(kt.slide.sold?"Marked sold":"Sold mark removed"));break;case"f":case"F":case"F5":i.preventDefault(),document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});break;case"e":case"E":Fi.toggle();break;case"?":case"h":case"H":Xc.classList.toggle("on");break;case"Escape":Xc.classList.remove("on");break}});qa.addEventListener("click",()=>{Fi.isOpen()||qc()});var Xc=L("div",{class:"help"},L("h2",{},"Show keys"),L("dl",{},[["\u2192  Space  Page Down","Next (clickers send these)"],["\u2190  Page Up","Back"],["B  or  .","Black screen (any key brings it back)"],["L","Jump to the holding loop, and back again"],["S","Stamp a trip SOLD (again to remove)"],["O","All pages"],["12 then Enter","Go to page 12"],["F","Full screen"],["E","Edit the show"],["H","This list"]].map(([i,e])=>L("div",{},L("dt",{},i),L("dd",{},e)))));document.body.append(Xc);var Fi=pf({show:Xn,getIndex:()=>qn,go:(i,e)=>An(i,e),rerender:()=>An(qn,{instant:!0}),relayout:()=>Ja(),flash:As});function __(){return Math.min(520,Math.max(380,window.innerWidth*.32))}Ja();var _f=0;try{_f=Number(sessionStorage.getItem("gala-show-index")||0)}catch{}An(_f,{instant:!0});if(!sessionStorage.getItem("gala-show-hinted")){As("Press H for the show keys");try{sessionStorage.setItem("gala-show-hinted","1")}catch{}}})();
