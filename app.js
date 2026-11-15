const events = [
 {id:1,title:"Nairobi Creative Festival",category:"Music",date:"2026-12-12",venue:"Nairobi, Kenya",price:1200,icon:"♫",desc:"A full day of live performances, art, food and creative community."},
 {id:2,title:"Kenya Startup & Innovation Forum",category:"Business",date:"2026-12-05",venue:"Westlands, Nairobi",price:2500,icon:"↗",desc:"Meet founders, investors and builders shaping tomorrow's businesses."},
 {id:3,title:"Community Clean-Up Day",category:"Community",date:"2026-11-28",venue:"Karura, Nairobi",price:0,icon:"✿",desc:"Join neighbours for a positive day of environmental action."},
 {id:4,title:"AI & Robotics Workshop",category:"Technology",date:"2026-12-19",venue:"Kilimani, Nairobi",price:800,icon:"⌘",desc:"A practical introduction to AI, robotics and building your first project."},
 {id:5,title:"Acoustic Nights Live",category:"Music",date:"2026-12-22",venue:"Karen, Nairobi",price:1500,icon:"♪",desc:"An intimate evening of acoustic music and local talent."},
 {id:6,title:"Young Entrepreneurs Meetup",category:"Business",date:"2027-01-09",venue:"Nairobi, Kenya",price:500,icon:"◇",desc:"Share ideas, build connections and learn from other entrepreneurs."}
];
const causes = [
 {title:"School Supplies for Every Child",desc:"Help provide learning materials to children in underserved communities.",target:150000,raised:86500,icon:"✎"},
 {title:"Community Food Support",desc:"Support a local food drive for families who need a helping hand.",target:100000,raised:42000,icon:"♡"},
 {title:"Youth Digital Skills",desc:"Help young people access practical digital and technology training.",target:200000,raised:126000,icon:"⌘"}
];
const $ = s => document.querySelector(s);
$("#year").textContent = new Date().getFullYear();
let mode = "login";
const authDialog = $("#authDialog"), detailDialog = $("#detailDialog");
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000);}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderEvents(){
 const query=$("#eventSearch").value.trim().toLowerCase(), category=$("#categoryFilter").value;
 const list=events.filter(e=>(category==="all"||e.category===category)&&(!query||(e.title+" "+e.venue+" "+e.desc).toLowerCase().includes(query)));
 $("#eventsGrid").innerHTML=list.length?list.map(e=>`<article class="event-tile"><div class="tile-image ${e.category.toLowerCase()}">${e.icon}</div><div class="tile-content"><span class="eyebrow">${safe(e.category.toUpperCase())}</span><h3>${safe(e.title)}</h3><div class="meta">${new Date(e.date+"T12:00:00").toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})} · ${safe(e.venue)}</div><p>${safe(e.desc)}</p><div class="tile-bottom"><span class="price">${e.price?"KES "+e.price.toLocaleString():"Free"}</span><button class="small-btn" data-event="${e.id}">View event</button></div></div></article>`).join(""):'<div class="empty">No events match your search. Try another keyword or category.</div>';
}
function renderCauses(){
 $("#causesGrid").innerHTML=causes.map((c,i)=>{const pct=Math.min(100,Math.round(c.raised/c.target*100));return `<article class="cause-tile"><div class="eyebrow">COMMUNITY FUNDRAISER</div><h3>${c.icon} ${safe(c.title)}</h3><p>${safe(c.desc)}</p><div class="progress"><span style="width:${pct}%"></span></div><div class="cause-stats"><b>KES ${c.raised.toLocaleString()} raised</b><span>Goal KES ${c.target.toLocaleString()}</span></div><button class="small-btn donate-btn" data-cause="${i}" style="margin-top:16px">Support this cause</button></article>`}).join("");
}
function openDetail(html){$("#detailContent").innerHTML=html;detailDialog.showModal();}
$("#eventsGrid").addEventListener("click",e=>{const b=e.target.closest("[data-event]");if(!b)return;const ev=events.find(x=>x.id===Number(b.dataset.event));openDetail(`<span class="eyebrow">${safe(ev.category.toUpperCase())}</span><h2>${safe(ev.title)}</h2><p>${safe(ev.desc)}</p><p><b>Date:</b> ${new Date(ev.date+"T12:00:00").toLocaleDateString("en-KE")}<br><b>Venue:</b> ${safe(ev.venue)}<br><b>Ticket:</b> ${ev.price?"KES "+ev.price.toLocaleString():"Free"}</p><label>Number of tickets<select id="ticketQty"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><button class="btn full" id="reserveBtn">Reserve ticket (preview)</button><p class="demo-note">Demo only. No ticket is issued and no payment is collected.</p>`);$("#reserveBtn").onclick=()=>{const qty=Number($("#ticketQty").value);detailDialog.close();toast("Preview reservation: "+qty+" ticket(s). Payments are not active yet.");};});
$("#causesGrid").addEventListener("click",e=>{const b=e.target.closest("[data-cause]");if(!b)return;const c=causes[Number(b.dataset.cause)];openDetail(`<span class="eyebrow">SUPPORT A CAUSE</span><h2>${safe(c.title)}</h2><p>${safe(c.desc)}</p><p><b>KES ${c.raised.toLocaleString()}</b> raised of KES ${c.target.toLocaleString()} goal.</p><label>Donation amount (KES)<input id="donationAmount" type="number" min="10" value="200"></label><button class="btn full" id="donateBtn">Continue (preview)</button><p class="demo-note">Demo only. Donations are not charged or submitted.</p>`);$("#donateBtn").onclick=()=>{const amount=Number($("#donationAmount").value);if(!Number.isFinite(amount)||amount<10){toast("Enter at least KES 10.");return;}detailDialog.close();toast("Donation preview: KES "+amount.toLocaleString()+". No payment collected.");};});
function setMode(next){mode=next;$("#authTitle").textContent=mode==="login"?"Sign in":"Create your account";$("#authSubmit").textContent=mode==="login"?"Continue":"Create account";$("#nameWrap").hidden=mode==="login";$("#roleWrap").hidden=mode==="login";$("#switchAuth").textContent=mode==="login"?"Create an account":"Sign in instead";$(".switch").childNodes[0].textContent=mode==="login"?"New to ZenLipa? ":"Already registered? ";}
$("#accountBtn").onclick=()=>{setMode("login");authDialog.showModal();};
$("#organiserBtn").onclick=()=>{setMode("register");$("#roleWrap").querySelector("select").value="organiser";authDialog.showModal();};
$("#closeDialog").onclick=()=>authDialog.close();$("#closeDetail").onclick=()=>detailDialog.close();
$("#switchAuth").onclick=e=>{e.preventDefault();setMode(mode==="login"?"register":"login");};
$("#authForm").onsubmit=e=>{e.preventDefault();toast("Account creation and sign-in will be enabled when the secure backend is connected.");authDialog.close();};
$("#eventSearch").addEventListener("input",renderEvents);$("#categoryFilter").addEventListener("change",renderEvents);
$("#viewCauses").onclick=()=>$("#causes").scrollIntoView({behavior:"smooth"});
$("#menuBtn").onclick=()=>document.querySelector("nav").classList.toggle("open");
renderEvents();renderCauses();