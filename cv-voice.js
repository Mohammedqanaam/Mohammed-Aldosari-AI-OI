(() => {
  const $ = id => document.getElementById(id);
  const start = $("cv-start");
  if (!start) return;
  const domains = {
    admin: [
      ["technical","ما أنظمة الموارد البشرية أو ERP أو إدارة الوثائق التي استخدمتها؟ اذكر اسم النظام والمهام التي نفذتها بنفسك.","Which HRIS, ERP, or document-management systems have you used? Name the systems and tasks you performed."],
      ["technical2","ما خبرتك في السياسات والإجراءات، التوظيف، الرواتب، إدارة الأداء، أو مؤشرات الإدارة؟ حدد ما ينطبق عليك.","Describe your experience with policies, recruitment, payroll, performance management, or administrative KPIs."],
      ["technical3","هل تعاملت مع أنظمة العمل أو الامتثال أو التدقيق؟ اذكر الدولة أو الإطار النظامي ومستوى مسؤوليتك دون ادعاء خبرة غير مباشرة.","Have you worked with labor regulations, compliance, or audits? Specify jurisdiction and your level of responsibility."]
    ],
    business: [
      ["technical","ما قنوات البيع أو التسويق التي عملت عليها؟ وما المنتجات أو الخدمات أو شرائح العملاء؟","Which sales or marketing channels have you worked with, and what products, services, or customer segments?"],
      ["technical2","ما أنظمة CRM أو أدوات الحملات والتحليل التي استخدمتها؟","Which CRM, campaign, and analytics tools have you used?"],
      ["technical3","ما مؤشرات الأداء التي كنت تتابعها مثل المبيعات والتحويل والاحتفاظ أو ROAS؟ اذكر نتائج موثقة إن وجدت.","Which KPIs did you track, such as revenue, conversion, retention, or ROAS? Include verified results if available."]
    ],
    finance: [
      ["technical","ما الأنشطة المالية التي مارستها: القيود، التسويات، الإقفال، الميزانيات، التدفقات النقدية أو التقارير؟","Which finance activities have you performed: journal entries, reconciliations, closing, budgeting, cash flow, or reporting?"],
      ["technical2","ما الأنظمة المحاسبية أو ERP أو Excel/Power BI التي استخدمتها؟ وما مستوى استخدامك لها؟","Which accounting systems, ERP, Excel, or Power BI tools have you used, and at what level?"],
      ["technical3","هل لديك خبرة في IFRS أو ضريبة القيمة المضافة أو ZATCA أو التدقيق؟ اذكر نطاق التطبيق الفعلي.","Do you have experience with IFRS, VAT, ZATCA, or audits? Describe the actual scope of your work."]
    ],
    it: [
      ["technical","ما لغات البرمجة أو تقنيات التطوير التي استخدمتها؟ اذكر المشاريع ومستوى مساهمتك في كل تقنية.","Which programming languages or development technologies have you used? Name projects and your contribution."],
      ["technical2","ما خبرتك في قواعد البيانات والسحابة والشبكات والأمن السيبراني أو DevOps؟ اذكر الأدوات المحددة.","Describe your experience with databases, cloud, networking, cybersecurity, or DevOps, naming specific tools."],
      ["technical3","ما أدوات إدارة الإصدارات والاختبار والتوثيق ومنهجيات التطوير التي استخدمتها؟","Which version-control, testing, documentation tools, and development methodologies have you used?"]
    ],
    engineering: [
      ["technical","ما تخصصك الهندسي الدقيق؟ وما البرامج الهندسية التي تستخدمها مثل AutoCAD أو Revit أو ETABS أو غيرها؟","What is your engineering discipline, and which engineering tools do you use, such as AutoCAD, Revit, or ETABS?"],
      ["technical2","ما أنواع المشاريع التي شاركت فيها؟ وضح دورك في التصميم أو التنفيذ أو الإشراف أو الاختبارات.","What projects have you worked on? Explain your role in design, execution, supervision, or testing."],
      ["technical3","ما الأكواد والمعايير والتراخيص أو شهادات السلامة التي لديك خبرة فعلية بها؟","Which codes, standards, licenses, or safety certifications have you actually worked with?"]
    ],
    medical: [
      ["technical","ما مؤهلك الصحي وتخصصك الدقيق؟ وهل لديك تصنيف أو تسجيل مهني ساري؟ اذكر الجهة والفئة وتاريخ الانتهاء دون مشاركة رقم الترخيص.","What is your healthcare qualification and specialty? Do you hold an active professional classification or registration? State the authority, category, and expiry date, not the license number."],
      ["technical2","ما المنشآت أو الأقسام التي عملت بها؟ وما طبيعة مسؤولياتك السريرية أو الفنية ضمن نطاق ترخيصك؟ لا تذكر أي بيانات تعريفية للمرضى.","Which facilities or departments have you worked in? Describe clinical or technical duties within your authorized scope. Do not share patient-identifying information."],
      ["technical3","ما الأجهزة أو الأنظمة الطبية أو السجلات الإلكترونية أو البروتوكولات والشهادات مثل BLS أو ACLS التي تدربت عليها؟","Which medical devices, clinical systems, electronic records, protocols, or certifications such as BLS or ACLS have you trained in?"]
    ],
    education: [
      ["technical","ما المواد أو المراحل أو التخصصات التي تستطيع تدريسها؟ وما الفئات العمرية أو المستويات التي تعاملت معها؟","Which subjects, grades, or disciplines can you teach, and what learner levels have you worked with?"],
      ["technical2","ما خبرتك في إعداد الخطط والمناهج والتقييم وإدارة الصف أو التدريب؟","Describe your experience with lesson planning, curriculum, assessment, classroom management, or training."],
      ["technical3","ما أنظمة التعليم الإلكتروني وأدوات التقييم والتقنيات التعليمية التي استخدمتها؟","Which learning-management systems, assessment tools, and educational technologies have you used?"]
    ],
    hospitality: [
      ["technical","ما أنظمة الفنادق والحجوزات التي استخدمتها مثل PMS أو CRS أو Channel Manager أو POS؟ وما مهامك فيها؟","Which hotel systems have you used, such as PMS, CRS, channel managers, or POS, and what tasks did you perform?"],
      ["technical2","ما خبرتك في الحجوزات أو الاستقبال أو الإيرادات أو خدمة النزلاء أو مراكز الاتصال؟ اذكر حجم التشغيل إن توفر.","Describe your experience in reservations, front office, revenue, guest service, or call centers. Include operational scale if known."],
      ["technical3","ما مؤشرات الضيافة التي تابعتها مثل ADR وOccupancy وRevPAR وConversion وSLA؟","Which hospitality KPIs have you tracked, such as ADR, occupancy, RevPAR, conversion, or SLA?"]
    ],
    legal: [
      ["technical","ما مؤهلك القانوني والولاية أو الدولة التي تمارس ضمن أنظمتها؟ وهل لديك ترخيص مهني عند الحاجة؟","What is your legal qualification and jurisdiction? Do you hold any required professional license?"],
      ["technical2","ما خبرتك في العقود أو التقاضي أو الاستشارات أو الحوكمة أو الامتثال؟ حدد دورك الفعلي.","Describe your experience in contracts, litigation, advisory, governance, or compliance, specifying your actual role."],
      ["technical3","ما الأنظمة القانونية أو أدوات إدارة القضايا والوثائق التي استخدمتها؟","Which legal frameworks or case and document-management tools have you used?"]
    ],
    operations: [
      ["technical","ما مجالات التشغيل التي عملت بها: مشتريات، مخزون، لوجستيات، صيانة، جودة أو سلاسل إمداد؟","Which operations areas have you worked in: procurement, inventory, logistics, maintenance, quality, or supply chain?"],
      ["technical2","ما أنظمة ERP أو WMS أو TMS أو أدوات التخطيط التي استخدمتها؟","Which ERP, WMS, TMS, or planning tools have you used?"],
      ["technical3","ما مؤشرات الأداء والإجراءات التي كنت مسؤولاً عنها مثل SLA أو OTIF أو تكلفة الوحدة أو مستويات المخزون؟","Which KPIs or processes did you own, such as SLA, OTIF, unit cost, or inventory levels?"]
    ],
    other: [
      ["technical","ما المهام التخصصية الأساسية في مجالك؟ وما الأدوات أو الأنظمة أو المنهجيات التي تستخدمها؟","What are the core specialist tasks in your field, and which tools, systems, or methodologies do you use?"],
      ["technical2","ما أهم المشاريع أو الحالات العملية التي تثبت خبرتك؟ وضح دورك والنتيجة.","Which projects or practical examples best demonstrate your experience? Explain your role and the outcome."],
      ["technical3","ما المعايير أو التراخيص أو الشهادات أو المتطلبات المهنية الخاصة بمجالك؟","Which professional standards, licenses, certifications, or requirements apply to your field?"]
    ]
  };
  const common = [
    ["enName","هل لديك اسم باللغة الإنجليزية كما يظهر في جواز السفر أو الوثائق الرسمية؟ إن لم يكن، تجاوز السؤال.","Do you use an English name as shown on official documents? If not, skip."],
    ["contact","ما بريدك الإلكتروني ورقم التواصل المهني؟ يمكنك كتابة وسيلة تواصل واحدة على الأقل.","What professional email and phone number should employers use? At least one contact method."],
    ["location","في أي مدينة ودولة تقيم؟ وهل تقبل الانتقال أو العمل عن بُعد؟","Which city and country are you based in? Are you open to relocation or remote work?"],
    ["role","ما المسمى الوظيفي الدقيق الذي تستهدفه؟ اذكر مسمى واحداً أو مسميين قريبين.","What exact job title are you targeting? Give one or two closely related titles."],
    ["summary","كيف تصف نفسك مهنياً؟ اذكر سنوات الخبرة إن وجدت، ومجال قوتك، ونوع الدور الذي تؤديه. لا تضف أرقاماً غير مؤكدة.","How would you describe yourself professionally? Mention years of experience if any, strengths, and role. Do not invent metrics."],
    ["education","اذكر مؤهلاتك من الأحدث: الدرجة، التخصص، المؤسسة التعليمية، المدينة، سنة البداية والتخرج، وأي تقدير ترغب بإضافته.","List education from newest: degree, major, institution, city, start and graduation years, and GPA if you want to include it."],
    ["experience","اذكر خبراتك من الأحدث: جهة العمل، المسمى، المدينة، تاريخ البداية والنهاية، وأبرز المسؤوليات. افصل كل وظيفة عن الأخرى.","List work experience from newest: employer, title, city, start/end dates, and key responsibilities. Separate each role."],
    ["achievements","ما إنجازاتك القابلة للإثبات؟ اذكر النتيجة والأرقام والفترة إن كانت موثقة. إذا لم تتوفر أرقام، اشرح الأثر دون اختلاق.","What verifiable achievements do you have? Include outcomes, figures, and timeframe if documented. If not, describe impact without inventing metrics."],
    ["projects","هل لديك مشاريع أو تدريب تعاوني أو تطوعي أو أعمال مستقلة ذات صلة؟ اذكر اسم المشروع ودورك والنتيجة.","Do you have relevant projects, internships, volunteering, or freelance work? State project, your role, and outcome."],
    ["tools","اذكر البرامج والأنظمة والأجهزة التي تستخدمها، مع مستوى إتقانك لكل منها وما تنفذه بها.","List software, systems, and equipment you use, with proficiency level and tasks you can perform."],
    ["skills","ما مهاراتك الفنية والإدارية والشخصية؟ اختر ما تستطيع دعمه بأمثلة عملية.","What technical, management, and interpersonal skills do you have? Include only skills you can support with examples."],
    ["languages","ما اللغات التي تتحدثها؟ حدد مستوى التحدث والكتابة لكل لغة بشكل منفصل.","Which languages do you speak? Specify speaking and writing proficiency separately."],
    ["certifications","اذكر الشهادات المهنية والدورات والتراخيص، والجهة المانحة وتاريخ الإصدار أو الانتهاء إن وجد.","List professional certificates, courses, and licenses, including issuer and issue or expiry date if applicable."]
  ];
  let lang = "ar-SA", qs = [], answers = {}, idx = 0, recognition = null, listening = false, paid = false, paidOrder = null, pendingHash = null;
  const english = () => lang === "en-US";
  const say = (ar,en) => english() ? en : ar;
  const status = msg => { $("cv-voice-status").textContent = msg; };
  const escapeText = value => String(value || "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function speak(text) {
    if (!("speechSynthesis" in window)) { status(say("قراءة السؤال صوتياً غير مدعومة هنا. يمكنك قراءة السؤال والإجابة كتابة أو صوتاً.","Text-to-speech is not supported. Read the question and type or dictate your answer.")); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = .92; speechSynthesis.speak(u);
  }
  function render() {
    if (!qs[idx]) return finish();
    const q = qs[idx];
    $("cv-step").textContent = say("السؤال ","Question ") + (idx+1) + " / " + qs.length;
    $("cv-progress-label").textContent = Math.round(idx/qs.length*100) + "%";
    $("cv-progress-bar").style.width = (idx/qs.length*100) + "%";
    $("cv-question").textContent = english() ? q.en : q.ar;
    $("cv-answer").value = answers[q.id] || "";
    $("cv-prev").disabled = idx === 0;
  }
  function move(delta) {
    if (listening && recognition) recognition.stop();
    const q = qs[idx];
    if (delta > 0) answers[q.id] = $("cv-answer").value.trim();
    idx = Math.max(0,Math.min(qs.length,idx+delta));
    render();
  }
  function validateBeforeFinish() {
    const missing = [];
    if (!answers.role?.trim()) missing.push(say("المسمى الوظيفي المستهدف","target job title"));
    if (!answers.contact?.trim()) missing.push(say("بيانات التواصل","contact details"));
    if (!answers.education?.trim() && !answers.experience?.trim()) missing.push(say("المؤهل العلمي أو الخبرة العملية","education or work experience"));
    return missing;
  }
  function section(ar,en,value) { return value?.trim() ? (english()?en:ar) + "\n" + value.trim() + "\n\n" : ""; }
  function makePreview() {
    const a = answers;
    const contact = [a.contact,a.location].filter(Boolean).join(" | ");
    let out = [a.nameAr,a.enName,a.role,contact].filter(Boolean).join("\n") + "\n\n";
    out += section("الملخص المهني","PROFESSIONAL SUMMARY",a.summary);
    out += section("الخبرات العملية","WORK EXPERIENCE",a.experience);
    out += section("التعليم والمؤهلات","EDUCATION",a.education);
    out += section("المشاريع والتدريب العملي","PROJECTS & PRACTICAL TRAINING",a.projects);
    out += section("الإنجازات","KEY ACHIEVEMENTS",a.achievements);
    out += section("المعرفة التخصصية","SPECIALIST KNOWLEDGE",[a.technical,a.technical2,a.technical3].filter(Boolean).join("\n"));
    out += section("الأنظمة والأدوات","SYSTEMS & TOOLS",a.tools);
    out += section("المهارات","CORE SKILLS",a.skills);
    out += section("الشهادات والتراخيص","CERTIFICATIONS & LICENSES",a.certifications);
    out += section("اللغات","LANGUAGES",a.languages);
    return out.trim();
  }
  function finish() {
    const missing = validateBeforeFinish();
    if (missing.length) {
      idx = Math.max(0,qs.findIndex(q => (q.id==="role" && !answers.role) || (q.id==="contact" && !answers.contact) || (q.id==="education" && !answers.education && !answers.experience)));
      render();
      status(say("لا يمكن اعتماد المعاينة قبل استكمال: ","Complete before preview: ") + missing.join("، "));
      return;
    }
    $("cv-interview").classList.add("cv-hidden");
    $("cv-result").classList.remove("cv-hidden");
    $("cv-preview").textContent = makePreview();
    $("cv-preview").setAttribute("contenteditable","false");
    $("cv-result").scrollIntoView({behavior:"smooth",block:"start"});
    $("cv-payment-status").textContent = say("المعاينة متاحة. التنزيل مقفل حتى تأكيد الدفع.","Preview is ready. Downloads remain locked until payment is confirmed.");
  }
  function startInterview() {
    const name = $("cv-name-ar").value.trim();
    const domain = $("cv-domain").value;
    if (!/[\u0600-\u06FF]/.test(name) || name.split(/\s+/).length < 2) {
      $("cv-name-ar").focus(); alert("يرجى كتابة الاسم الكامل باللغة العربية (اسمين على الأقل)."); return;
    }
    if (!domain) { $("cv-domain").focus(); alert("يرجى اختيار مجال التخصص أولاً."); return; }
    lang = $("cv-language").value;
    answers = {nameAr:name,role:$("cv-target-role").value.trim()};
    const selected = [...common];
    const specific = domains[domain] || domains.other;
    specific.forEach(([id,ar,en]) => selected.push([id,ar,en]));
    qs = selected.map(([id,ar,en]) => ({id,ar,en}));
    idx = 0; paid = false; paidOrder = null;
    $("cv-intro").classList.add("cv-hidden");
    $("cv-result").classList.add("cv-hidden");
    $("cv-interview").classList.remove("cv-hidden");
    render();
    $("cv-interview").scrollIntoView({behavior:"smooth",block:"start"});
  }
  start.addEventListener("click",startInterview);
  $("cv-speak").addEventListener("click",()=>{const q=qs[idx]; if(q) speak(english()?q.en:q.ar);});
  $("cv-listen").addEventListener("click",()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { status(say("التعرف الصوتي غير مدعوم في هذا المتصفح. استخدم Chrome أو اكتب الإجابة.","Speech recognition unsupported. Use Chrome or type your answer.")); return; }
    if (listening && recognition) { recognition.stop(); return; }
    recognition = new SR(); recognition.lang=lang; recognition.continuous=false; recognition.interimResults=true;
    let finalText="";
    recognition.onstart=()=>{listening=true;$("cv-listen").textContent=say("إيقاف الاستماع","Stop listening");status(say("أستمع الآن...","Listening..."));};
    recognition.onresult=e=>{let interim="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=t+" ";else interim+=t;}$("cv-answer").value=(finalText+interim).trim();};
    recognition.onerror=e=>status(say("تعذر التقاط الصوت: "+e.error,"Speech recognition error: "+e.error));
    recognition.onend=()=>{listening=false;$("cv-listen").textContent=say("🎙️ ابدأ التحدث","🎙️ Start speaking");status(finalText.trim()?say("راجع النص المحول قبل الحفظ.","Review the transcript before saving."):say("انتهى الاستماع. أعد المحاولة أو اكتب الإجابة.","Listening ended. Retry or type your answer."));};
    try{recognition.start();}catch(e){status(say("تعذر تشغيل الميكروفون.","Could not start microphone."));}
  });
  $("cv-next").addEventListener("click",()=>move(1));
  $("cv-prev").addEventListener("click",()=>move(-1));
  $("cv-skip").addEventListener("click",()=>{answers[qs[idx].id]="";move(1);});
  $("cv-edit").addEventListener("click",()=>{$("cv-result").classList.add("cv-hidden");$("cv-interview").classList.remove("cv-hidden");idx=qs.length-1;render();$("cv-interview").scrollIntoView({behavior:"smooth"});});
  $("cv-restart").addEventListener("click",()=>{if(speechSynthesis)speechSynthesis.cancel();$("cv-result").classList.add("cv-hidden");$("cv-interview").classList.add("cv-hidden");$("cv-intro").classList.remove("cv-hidden");paid=false;});
  $("cv-download-docx").addEventListener("click",async()=>{
    if(!paid || !paidOrder) return;
    const btn=$("cv-download-docx");btn.disabled=true;btn.textContent=say("جارٍ التحقق وتجهيز Word...","Verifying and preparing Word...");
    try{
      const payload=await window.CVResume.getPaymentPayload();
      const response=await fetch("/api/cv/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderID:paidOrder,answers,language:lang,resumeHash:payload.resumeHash})});
      if(!response.ok){const e=await response.json().catch(()=>({}));throw new Error(e.error||"تعذر تنزيل الملف.");}
      const blob=await response.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ATS-Resume.docx";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
      btn.textContent=say("تم تنزيل Word","Word downloaded");
    }catch(e){btn.disabled=false;btn.textContent=say("إعادة المحاولة","Retry");$("cv-payment-status").textContent=e.message;}
  });
  $("cv-print-pdf").addEventListener("click",()=>{
    if(!paid)return;
    const popup=window.open("","_blank");
    if(!popup){$("cv-payment-status").textContent=say("اسمح بالنوافذ المنبثقة للطباعة إلى PDF.","Allow pop-ups to print to PDF.");return;}
    const text=makePreview().split("\n").map(line=>"<p>"+escapeText(line)+"</p>").join("");
    popup.document.write('<!doctype html><html lang="'+(english()?"en":"ar")+'" dir="'+(english()?"ltr":"rtl")+'"><meta charset="utf-8"><title>ATS Resume</title><style>body{font:11pt Arial,Tahoma,sans-serif;line-height:1.55;color:#1d2939;max-width:800px;margin:25mm auto;direction:'+(english()?"ltr":"rtl")+';text-align:'+(english()?"left":"right")+'}p{margin:0 0 5px;white-space:pre-wrap}@page{size:A4;margin:18mm}</style><body>'+text+'</body></html>');
    popup.document.close();popup.focus();setTimeout(()=>popup.print(),300);
  });
  window.CVResume = {
    getAnswers:()=>answers,
    getPaymentPayload:async()=>{
      if(!window.crypto || !crypto.subtle) throw new Error("يتطلب الدفع اتصالاً آمناً يدعم التحقق المشفر.");
      const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify({answers,language:lang})));
      pendingHash=Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,"0")).join("");
      return {resumeHash:pendingHash};
    },
    unlock:(orderID,resumeHash)=>{
      if(!pendingHash || resumeHash !== pendingHash) {
        $("cv-payment-status").textContent="تعذر مطابقة دفعة PayPal مع نسخة السيرة الحالية.";
        $("cv-payment-status").className="status err";
        return;
      }
      paid=true;paidOrder=orderID;
      $("cv-edit").disabled=true;
      $("cv-download-docx").disabled=false;$("cv-download-docx").textContent=say("تنزيل السيرة الذاتية Word","Download ATS Resume (Word)");
      $("cv-print-pdf").disabled=false;$("cv-print-pdf").textContent=say("طباعة / حفظ PDF","Print / Save PDF");
      $("cv-payment-status").textContent=say("تم تأكيد الدفع. أصبح تنزيل Word والطباعة إلى PDF متاحين.","Payment verified. Word download and PDF printing are now unlocked.");
      $("cv-payment-status").className="status ok";
    }
  };
  window.dispatchEvent(new Event("cv-resume-ready"));
})();