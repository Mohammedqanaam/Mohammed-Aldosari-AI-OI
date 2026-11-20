(function(){
// 1) Customer journey and service routing
const journeyButtons=document.querySelectorAll("[data-journey]");
function openJourney(type){document.querySelectorAll(".journey-section").forEach(s=>s.classList.remove("active"));document.querySelector("#journey-start").classList.add("active");document.querySelectorAll("."+type+"-journey").forEach(s=>s.classList.add("active"));const first=document.querySelector("."+type+"-journey");if(first)first.scrollIntoView({behavior:"smooth",block:"start"});}
journeyButtons.forEach(button=>button.addEventListener("click",()=>openJourney(button.dataset.journey)));
document.querySelectorAll("[data-back]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".journey-section").forEach(s=>s.classList.remove("active"));document.querySelector("#journey-start").scrollIntoView({behavior:"smooth",block:"start"});}));
// 2) Excel template catalogue and descriptions
const categoryTemplates={
 sales:[
  ["customers","متابعة العملاء والطلبات — Customer & Order Tracker","سجل عملاء، حالات طلبات، مبالغ محصلة ومتأخرة، ولوحة مؤشرات أساسية."],
  ["sales","متابعة المبيعات والأهداف — Sales & Targets","المبيعات اليومية والشهرية، الأهداف، نسب الإنجاز، ومقارنة أداء الموظفين."],
  ["leads","إدارة العملاء المحتملين — CRM & Leads","مصدر العميل، مرحلة الفرصة، قيمة الصفقة، المتابعة القادمة ومعدل التحويل."],
  ["commissions","العمولات وأداء الموظفين — Commissions & Team KPIs","مبيعات كل موظف، المستهدف، العمولة، ونسب تحقيق الأهداف."]
 ],
 admin:[
  ["tasks","إدارة المهام والمشاريع — Tasks & Projects","المهام، الأولويات، المسؤوليات، تواريخ الاستحقاق ونسب الإنجاز."],
  ["hr","الموارد البشرية والحضور — HR & Attendance","بيانات الموظفين، الحضور، الغياب، الإجازات وساعات العمل."],
  ["procurement","المشتريات والموردون — Procurement & Vendors","طلبات الشراء، الموردون، عروض الأسعار، حالة التوريد والاستلام."],
  ["documents","متابعة المعاملات — Administrative Log","سجل المعاملات، أرقامها، تواريخها، المسؤول عنها وحالة الإجراء."]
 ],
 finance:[
  ["budget","الميزانية والمصروفات — Budget & Expenses","الإيرادات والمصروفات، التصنيفات، الميزانية والفروقات."],
  ["invoices","الفواتير والتحصيل — Invoices & Collections","الفواتير، تواريخ الاستحقاق، المدفوعات، والمتأخرات."],
  ["cashflow","التدفق النقدي — Cash Flow","حركة النقد الداخلة والخارجة والتوقعات الشهرية."]
 ],
 operations:[
  ["inventory","إدارة المخزون — Inventory Control","الأصناف، الكميات، حد إعادة الطلب، حركات المخزون والتنبيهات."],
  ["maintenance","الصيانة والأصول — Maintenance & Assets","الأصول، بلاغات الصيانة، المسؤول، التكلفة والحالة."],
  ["quality","الجودة والإجراءات — Quality & Operations","قوائم الفحص، الملاحظات، الإجراءات التصحيحية ومؤشرات التشغيل."]
 ],
 hospitality:[
  ["reservations","إدارة الحجوزات الفندقية — Hotel Reservations","متابعة الحجوزات، الوصول والمغادرة، القنوات، حالات الحجز، الإيرادات والتحصيل."],
  ["guestservice","خدمة النزلاء والشكاوى — Guest Service","الشكاوى والطلبات، الأولوية، المسؤول، مهلة SLA، الحل ورضا النزيل."],
  ["callcenter","أداء مركز الاتصال — Call Center KPIs","المكالمات الواردة والمجابة والفائتة، الحجوزات، التحويل وأداء الموظفين."]
 ]
};
// 3) Local workbook selection, preview, and analysis
const cats=document.querySelectorAll(".cat"),type=document.getElementById("templateType"),desc=document.getElementById("templateDesc");
let currentCategory="sales",workbook=null,selectedFile=null,rows=[],headers=[],currentSheet="";
function setCategory(cat){
 currentCategory=cat;cats.forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));
 type.innerHTML="";categoryTemplates[cat].forEach(item=>{const o=document.createElement("option");o.value=item[0];o.textContent=item[1];o.dataset.desc=item[2];type.appendChild(o)});desc.textContent=type.options[0].dataset.desc;
}
cats.forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.cat)));
type.addEventListener("change",()=>desc.textContent=type.selectedOptions[0].dataset.desc||"سيتم إعداد القالب حسب التخصص المحدد.");
const input=document.getElementById("fileInput"),sheetSelect=document.getElementById("sheetSelect"),preview=document.getElementById("preview"),fileStatus=document.getElementById("fileStatus"),rowCount=document.getElementById("rowCount"),analyzeBtn=document.getElementById("analyzeBtn"),analysisStatus=document.getElementById("analysisStatus");
function status(el,msg,kind){el.className="status "+kind;el.textContent=msg}
function renderPreview(data){
 rows=data||[];headers=(rows[0]||[]).map((x,i)=>String(x??"Column "+(i+1)));
 if(!rows.length){preview.textContent="لم يتم العثور على بيانات في ورقة العمل.";return}
 const shown=rows.slice(0,9),table=document.createElement("table"),thead=document.createElement("thead"),tr=document.createElement("tr");
 headers.forEach(h=>{const th=document.createElement("th");th.textContent=h||"—";tr.appendChild(th)});thead.appendChild(tr);table.appendChild(thead);
 const tbody=document.createElement("tbody");shown.slice(1).forEach(row=>{const r=document.createElement("tr");headers.forEach((_,i)=>{const td=document.createElement("td");td.textContent=String(row?.[i]??"");r.appendChild(td)});tbody.appendChild(r)});table.appendChild(tbody);
 preview.innerHTML="";const wrap=document.createElement("div");wrap.className="previewwrap";wrap.appendChild(table);preview.appendChild(wrap);
 rowCount.textContent=Math.max(0,rows.length-1)+" سجل • "+headers.length+" عمود";
}
async function readFile(file){
 if(!file)return;if(file.size>10*1024*1024){status(fileStatus,"حجم الملف يتجاوز 10 MB. اختر ملفاً أصغر.","err");return}
 if(!/\.(xlsx|xls|csv)$/i.test(file.name)){status(fileStatus,"صيغة الملف غير مدعومة. ارفع XLSX أو XLS أو CSV.","err");return}
 selectedFile=file;status(fileStatus,"جارٍ قراءة الملف محلياً داخل المتصفح…","warn");
 try{
  if(!window.XLSX)throw new Error("تعذر تحميل مكتبة قراءة Excel. تحقق من اتصال الإنترنت ثم أعد المحاولة.");
  const buf=await file.arrayBuffer();workbook=XLSX.read(buf,{type:"array",cellDates:true});
  sheetSelect.innerHTML="";workbook.SheetNames.forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;sheetSelect.appendChild(o)});
  sheetSelect.disabled=false;currentSheet=workbook.SheetNames[0];const data=XLSX.utils.sheet_to_json(workbook.Sheets[currentSheet],{header:1,defval:"",blankrows:false});renderPreview(data);analyzeBtn.disabled=false;status(fileStatus,"تمت قراءة الملف بنجاح. اختر ورقة العمل إن رغبت في تغييرها.","ok");analysisStatus.className="status";
 }catch(e){workbook=null;selectedFile=null;status(fileStatus,e.message||"تعذر قراءة الملف.","err")}
}
input.addEventListener("change",e=>readFile(e.target.files[0]));
sheetSelect.addEventListener("change",()=>{if(!workbook)return;currentSheet=sheetSelect.value;renderPreview(XLSX.utils.sheet_to_json(workbook.Sheets[currentSheet],{header:1,defval:"",blankrows:false}))});
analyzeBtn.addEventListener("click",()=>{
 if(!rows.length){status(analysisStatus,"لا توجد بيانات كافية للتحليل.","err");return}
 const norm=headers.map(x=>x.toLowerCase()),groups={
  name:["name","الاسم","العميل","customer","employee","الموظف","guest","النزيل"],
  phone:["phone","mobile","الجوال","الهاتف","رقم التواصل"],
  date:["date","التاريخ","created","تاريخ الطلب","تاريخ الحجز"],
  amount:["amount","price","المبلغ","السعر","الإجمالي","total","revenue","الإيراد"],
  status:["status","الحالة","مرحلة","stage"],
  branch:["branch","الفرع","الفندق","hotel"],
  booking:["booking","reservation","الحجز","رقم الحجز"],
  arrival:["check-in","arrival","الوصول"],
  departure:["check-out","departure","المغادرة"],
  channel:["channel","القناة","المصدر"],
  owner:["owner","agent","المسؤول","الموظف"],
  target:["target","المستهدف","الهدف"]
 };
 const found=[];Object.entries(groups).forEach(([k,terms])=>{const idx=norm.findIndex(h=>terms.some(t=>h.includes(t)));if(idx>=0)found.push(k+" ← "+headers[idx])});
 const body=rows.slice(1).filter(r=>r.some(v=>String(v??"").trim()!==""));
 const blankByColumn=headers.map((h,i)=>({h,count:body.filter(r=>String(r?.[i]??"").trim()==="").length})).filter(x=>x.count>0);
 const rowKeys=body.map(r=>JSON.stringify(r.map(v=>String(v??"").trim().toLowerCase())));
 const duplicates=rowKeys.length-new Set(rowKeys).size;
 const missing=blankByColumn.reduce((n,x)=>n+x.count,0);
 const message=(found.length?"الحقول المكتشفة: "+found.join("، ")+". ":"")+
 "السجلات: "+body.length+" • الأعمدة: "+headers.length+
 " • خلايا فارغة: "+missing+" • صفوف مكررة بالكامل: "+duplicates+
 (blankByColumn.length?" • أكثر الأعمدة نقصاً: "+blankByColumn.sort((a,b)=>b.count-a.count).slice(0,3).map(x=>x.h+" ("+x.count+")").join("، "):"")+
 ". التحليل محلي داخل المتصفح؛ لم يتم رفع محتوى الملف.";
 status(analysisStatus,message,"ok");
});
document.getElementById("clearBtn").addEventListener("click",()=>{input.value="";workbook=null;selectedFile=null;rows=[];headers=[];sheetSelect.innerHTML="<option>ارفع ملفاً أولاً</option>";sheetSelect.disabled=true;analyzeBtn.disabled=true;preview.textContent="ستظهر هنا عينة من أول 8 صفوف بعد رفع الملف.";rowCount.textContent="لا يوجد ملف";fileStatus.className="status";analysisStatus.className="status"});
let verifiedOrderID=null;
async function startCheckout(){
 const email=document.getElementById("email").value.trim();
 if(email&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){status(fileStatus,"تحقق من صحة البريد الإلكتروني.","err");throw new Error("تحقق من صحة البريد الإلكتروني.");}
 status(document.getElementById("paymentStatus"),"جارٍ إنشاء طلب دفع آمن…","warn");
 const response=await fetch("/api/paypal/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({templateId:type.value})});
 const data=await response.json();
 if(!response.ok||!data.id)throw new Error(data.error||"تعذر بدء الدفع.");
 try{sessionStorage.setItem("template_request",JSON.stringify({category:currentCategory,type:type.value,email:email,fileName:selectedFile?.name||"",sheet:currentSheet,createdAt:new Date().toISOString()}))}catch(e){}
 return data.id;
}
async function captureCheckout(orderID){
 const response=await fetch("/api/paypal/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderID,templateId:type.value})});
 const data=await response.json();
 if(!response.ok||!data.paid)throw new Error(data.error||"لم يتم تأكيد الدفع.");
 verifiedOrderID=data.orderID;
 document.getElementById("downloadBtn").disabled=false;
 document.getElementById("downloadBtn").textContent="تحميل القالب المدفوع";
 status(document.getElementById("paymentStatus"),"تم التحقق من الدفع بنجاح. أصبح التحميل متاحاً لهذا القالب.","ok");
}
document.getElementById("downloadBtn").addEventListener("click",async()=>{
 if(!verifiedOrderID)return;
 const btn=document.getElementById("downloadBtn");btn.disabled=true;btn.textContent="جارٍ تجهيز ملفك…";
 try{
  const url="/api/download?orderID="+encodeURIComponent(verifiedOrderID)+"&templateId="+encodeURIComponent(type.value);
  const response=await fetch(url);
  if(!response.ok){const err=await response.json().catch(()=>({}));throw new Error(err.error||"تعذر التحقق من الدفع أو إنشاء الملف.");}
  const blob=await response.blob();const a=document.createElement("a");const objectURL=URL.createObjectURL(blob);
  a.href=objectURL;a.download="Gulf-"+type.value+"-Template.xlsx";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(objectURL);
  btn.textContent="تم تجهيز التحميل";status(document.getElementById("paymentStatus"),"تم تجهيز ملف Excel الخاص بك.","ok");
 }catch(e){btn.disabled=false;btn.textContent="إعادة محاولة التحميل";status(document.getElementById("paymentStatus"),e.message,"err");}
});
async function initializePayPal(){
 const container=document.getElementById("paypal-button-container");
 try{
  const cfgRes=await fetch("/api/paypal/config",{cache:"no-store"});const cfg=await cfgRes.json();
  if(!cfgRes.ok||!cfg.configured)throw new Error("يلزم إعداد بيانات PayPal في إعدادات Vercel قبل استقبال المدفوعات.");
  const sdk=document.createElement("script");sdk.src="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(cfg.clientId)+"&currency=USD&intent=capture";
  sdk.onload=()=>{
   container.innerHTML="";
   paypal.Buttons({
    style:{layout:"vertical",color:"gold",shape:"rect",label:"pay",height:45},
    createOrder:()=>startCheckout(),
    onApprove:async(data)=>{try{await captureCheckout(data.orderID)}catch(e){status(document.getElementById("paymentStatus"),e.message,"err");}},
    onCancel:()=>status(document.getElementById("paymentStatus"),"تم إلغاء عملية الدفع. يمكنك المحاولة مجدداً.","warn"),
    onError:(err)=>{console.error(err);status(document.getElementById("paymentStatus"),"تعذر إكمال الدفع. حاول مرة أخرى أو تواصل مع الدعم.","err");}
   }).render("#paypal-button-container");
   let cvRendered=false;
   const renderCVPayPal=()=>{
    const cvContainer=document.getElementById("cv-paypal-button-container");
    if(cvRendered || !cvContainer || !window.CVResume) return;
    cvRendered=true;
    paypal.Buttons({
     style:{layout:"vertical",color:"gold",shape:"rect",label:"pay",height:45},
     createOrder:async()=>{
      const payload=await window.CVResume.getPaymentPayload();
      const r=await fetch("/api/paypal/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({templateId:"cv",leadId:window.cvLeadId,...payload})});
      const d=await r.json();if(!r.ok||!d.id)throw new Error(d.error||"تعذر إنشاء طلب الدفع.");return d.id;
     },
     onApprove:async(data)=>{
      try{
       const r=await fetch("/api/paypal/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderID:data.orderID,templateId:"cv"})});
       const d=await r.json();if(!r.ok||!d.paid)throw new Error(d.error||"لم يتم تأكيد الدفع.");
       window.CVResume.unlock(d.orderID,d.resumeHash);
      }catch(e){const el=document.getElementById("cv-payment-status");el.textContent=e.message;el.className="status err";}
     },
     onCancel:()=>{const el=document.getElementById("cv-payment-status");el.textContent="تم إلغاء الدفع. يمكنك المحاولة مجدداً.";el.className="status warn";},
     onError:(e)=>{console.error(e);const el=document.getElementById("cv-payment-status");el.textContent="تعذر إكمال الدفع. حاول مجدداً.";el.className="status err";}
    }).render("#cv-paypal-button-container");
   };
   window.addEventListener("cv-resume-ready",renderCVPayPal);
   renderCVPayPal();
  };
  sdk.onerror=()=>status(document.getElementById("paymentStatus"),"تعذر تحميل بوابة PayPal.","err");
  document.head.appendChild(sdk);
 }catch(e){
  container.innerHTML='<button class="btn gold" type="button" disabled style="width:100%">الدفع غير متاح حالياً</button>';
  status(document.getElementById("paymentStatus"),e.message,"warn");
  const cvStatus=document.getElementById("cv-payment-status");if(cvStatus){cvStatus.textContent="بوابة الدفع غير مفعّلة حالياً. لن يتم فتح التنزيل حتى تفعيل PayPal.";cvStatus.className="status warn";}
 }
}
initializePayPal();
})();
