(() => {
  const $ = (id) => document.getElementById(id);
  const start = $("cv-start");
  if (!start) return;

  const baseQuestions = [
    {id:"name", ar:"ما اسمك الكامل كما تريد ظهوره في السيرة الذاتية؟", en:"What is your full name as you want it shown on your CV?", required:true},
    {id:"contact", ar:"ما بريدك الإلكتروني ورقم التواصل المناسبان للتوظيف؟", en:"What email address and phone number should employers use to contact you?", required:true},
    {id:"city", ar:"في أي مدينة تقيم؟ وهل لديك استعداد للانتقال أو العمل في مدينة أخرى؟", en:"Which city are you based in? Are you open to relocation?", required:false},
    {id:"title", ar:"ما تخصصك أو المسمى الوظيفي الذي تستهدفه؟", en:"What is your field or target job title?", required:true},
    {id:"summary", ar:"عرّفنا بنفسك مهنياً: ما أبرز ما تتميز به وما نوع القيمة التي تقدمها للعمل؟", en:"Give a brief professional introduction. What are your strongest professional qualities?", required:false},
    {id:"degree", ar:"ما مؤهلك الدراسي؟ دبلوم، بكالوريوس، ماجستير أو غير ذلك؟", en:"What is your highest qualification: diploma, bachelor's, master's, or another?", required:false},
    {id:"major", ar:"ما تخصصك الأكاديمي؟", en:"What was your academic major?", required:false},
    {id:"university", ar:"ما اسم الجامعة أو الكلية أو المعهد الذي درست فيه؟", en:"Which university, college, or institute did you attend?", required:false},
    {id:"study", ar:"متى بدأت الدراسة؟ ومتى تخرجت؟ اذكر السنوات بوضوح.", en:"When did you start your studies and when did you graduate? Please provide the years.", required:false},
    {id:"experience", ar:"حدثني عن خبراتك العملية بالترتيب من الأحدث: جهة العمل، المسمى، المدة، وأبرز المسؤوليات.", en:"Describe your work experience, starting with the most recent: employer, title, dates, and key responsibilities.", required:false},
    {id:"achievements", ar:"ما أهم إنجازاتك في العمل؟ هل حسّنت نتيجة أو رفعت مبيعات أو خفضت وقتاً أو قدت فريقاً؟ اذكر أرقاماً إن توفرت.", en:"What are your strongest work achievements? Did you improve results, increase sales, save time, or lead a team? Include figures if available.", required:false},
    {id:"systems", ar:"ما الأنظمة والبرامج التي استخدمتها؟ مثل Excel أو SAP أو Oracle أو CRM أو أنظمة الفنادق. وما مستوى إتقانك لكل منها؟", en:"Which systems and software have you used, such as Excel, SAP, Oracle, CRM, or hotel systems? What is your proficiency level in each?", required:false},
    {id:"skills", ar:"ما أبرز مهاراتك المهنية والشخصية؟ اذكر المهارات التي تستطيع إثباتها من واقع عملك.", en:"What are your strongest technical and soft skills? Mention skills you can demonstrate through your work.", required:false},
    {id:"languages", ar:"ما اللغات التي تتحدثها؟ وما مستوى كل لغة: مبتدئ أو متوسط أو متقدم أو بطلاقة؟", en:"Which languages do you speak, and what is your level in each: beginner, intermediate, advanced, or fluent?", required:false},
    {id:"certificates", ar:"هل لديك دورات تدريبية أو شهادات مهنية أو رخص ذات صلة؟ اذكر اسمها والجهة إن وجدت.", en:"Do you have relevant training courses, professional certificates, or licenses? Please name them and the issuing body.", required:false},
    {id:"target", ar:"ما نوع الوظائف أو القطاعات التي تستهدفها؟ وهل تفضل سيرة ذاتية عربية أم إنجليزية؟", en:"Which roles or industries are you targeting? Would you prefer an Arabic or English CV?", required:false}
  ];

  let language = "ar-SA";
  let questions = [];
  let answers = {};
  let index = 0;
  let recognition = null;
  let listening = false;

  const isEnglish = () => language === "en-US";
  const say = (ar, en) => isEnglish() ? en : ar;
  const setStatus = (message) => { $("cv-voice-status").textContent = message; };
  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      setStatus(say("ميزة قراءة السؤال غير مدعومة في هذا المتصفح. يمكنك قراءة السؤال والكتابة أو التحدث.","Question read-aloud is not supported in this browser. You can read the question and type or dictate."));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  };

  function renderQuestion() {
    const q = questions[index];
    if (!q) return finish();
    $("cv-step").textContent = say("السؤال ","Question ") + (index + 1) + " / " + questions.length;
    $("cv-progress-label").textContent = Math.round(index / questions.length * 100) + "%";
    $("cv-progress-bar").style.width = (index / questions.length * 100) + "%";
    $("cv-question").textContent = isEnglish() ? q.en : q.ar;
    $("cv-answer").value = answers[q.id] || "";
    $("cv-hint").textContent = q.required ? say("هذا السؤال أساسي لإعداد السيرة.","This is an essential question for your CV.") : say("يمكنك الإجابة أو تخطي السؤال إذا لم ينطبق عليك.","Answer this question or skip it if it does not apply.");
    if (q.autoSpeak) speak(isEnglish() ? q.en : q.ar);
  }

  function addFollowUps(q, answer) {
    const text = answer.trim();
    if (q.id === "experience" && text.length > 0 && text.length < 100) {
      questions.splice(index + 1, 0, {
        id:"experience_detail",
        ar:"لنكمل تفاصيل الخبرة: ما أبرز 3 مهام كنت تنفذها؟ وما تاريخ بداية ونهاية آخر وظيفة؟",
        en:"Let's add detail: what were your three main responsibilities, and when did your most recent role start and end?",
        required:false
      });
    }
    if (q.id === "systems" && text.length > 0 && !/(ممتاز|متقدم|متوسط|مبتدئ|أساسي|advanced|intermediate|beginner|proficient|expert)/i.test(text)) {
      questions.splice(index + 1, 0, {
        id:"systems_level",
        ar:"ما مستوى إتقانك لهذه الأنظمة؟ وضّح ما تستطيع تنفيذه بنفسك في كل نظام.",
        en:"How proficient are you with these systems? Explain what tasks you can independently perform in each one.",
        required:false
      });
    }
    if (q.id === "achievements" && text.length > 0 && !/\d/.test(text)) {
      questions.splice(index + 1, 0, {
        id:"achievement_measure",
        ar:"هل تستطيع تقدير نتيجة أحد إنجازاتك برقم أو نسبة أو مدة؟ إذا لم تتوفر أرقام، اشرح الأثر بشكل واضح.",
        en:"Can you quantify one achievement with a number, percentage, or timeframe? If not, describe its impact clearly.",
        required:false
      });
    }
  }

  function next(skip) {
    if (listening && recognition) recognition.stop();
    const q = questions[index];
    const answer = $("cv-answer").value.trim();
    if (!skip && q.required && !answer) {
      setStatus(say("يرجى الإجابة عن هذا السؤال أو تخطيه إذا لم تكن المعلومة متاحة.","Please answer this question or skip it if the information is unavailable."));
      return;
    }
    if (!skip && answer) {
      answers[q.id] = answer;
      addFollowUps(q, answer);
    }
    index += 1;
    renderQuestion();
  }

  function buildCV() {
    const fields = [
      ["name", say("الاسم","Name")],
      ["contact", say("بيانات التواصل","Contact")],
      ["city", say("الموقع","Location")],
      ["title", say("المسمى المستهدف","Target title")],
      ["summary", say("الملخص المهني","Professional summary")],
      ["degree", say("المؤهل العلمي","Education")],
      ["major", say("التخصص الأكاديمي","Major")],
      ["university", say("الجامعة / المعهد","Institution")],
      ["study", say("سنوات الدراسة والتخرج","Study dates")],
      ["experience", say("الخبرات العملية","Work experience")],
      ["experience_detail", say("تفاصيل المسؤوليات","Responsibilities")],
      ["achievements", say("الإنجازات","Achievements")],
      ["achievement_measure", say("أثر الإنجازات","Achievement impact")],
      ["systems", say("الأنظمة والبرامج","Systems & software")],
      ["systems_level", say("مستوى إتقان الأنظمة","Systems proficiency")],
      ["skills", say("المهارات","Skills")],
      ["languages", say("اللغات","Languages")],
      ["certificates", say("الدورات والشهادات","Certifications")],
      ["target", say("التوجه الوظيفي","Career objective")]
    ];
    const title = answers.name || say("السيرة الذاتية","Curriculum Vitae");
    const lines = [title, answers.title || "", answers.contact || "", answers.city || "", ""];
    fields.slice(4).forEach(([id,label]) => {
      if (answers[id]) lines.push(label.toUpperCase(), answers[id], "");
    });
    return lines.join("\n").trim();
  }

  function finish() {
    if (recognition && listening) recognition.stop();
    $("cv-interview").classList.add("cv-hidden");
    $("cv-result").classList.remove("cv-hidden");
    $("cv-progress-bar").style.width = "100%";
    $("cv-progress-label").textContent = "100%";
    $("cv-preview").textContent = buildCV();
    $("cv-preview").setAttribute("contenteditable","true");
    $("cv-preview").setAttribute("role","textbox");
    $("cv-preview").setAttribute("aria-label",say("مسودة السيرة الذاتية، قابلة للتحرير","Editable CV draft"));
    $("cv-result").scrollIntoView({behavior:"smooth",block:"start"});
  }

  start.addEventListener("click", () => {
    language = $("cv-language").value;
    questions = baseQuestions.map(q => ({...q}));
    answers = {};
    index = 0;
    $("cv-intro").classList.add("cv-hidden");
    $("cv-result").classList.add("cv-hidden");
    $("cv-interview").classList.remove("cv-hidden");
    renderQuestion();
    $("cv-interview").scrollIntoView({behavior:"smooth",block:"start"});
  });

  $("cv-speak").addEventListener("click", () => {
    const q = questions[index];
    if (q) speak(isEnglish() ? q.en : q.ar);
  });

  $("cv-listen").addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus(say("التعرف الصوتي غير مدعوم في هذا المتصفح. جرّب Chrome أو استخدم الكتابة في الحقل.","Speech recognition is not supported in this browser. Try Chrome or type your answer."));
      return;
    }
    if (listening && recognition) { recognition.stop(); return; }
    recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let finalText = "";
    recognition.onstart = () => { listening = true; $("cv-listen").textContent = say("إيقاف الاستماع","Stop listening"); setStatus(say("أستمع الآن... تحدث بوضوح.","Listening... please speak clearly.")); };
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript + " ";
        else interim += transcript;
      }
      $("cv-answer").value = (finalText + interim).trim();
    };
    recognition.onerror = (event) => {
      setStatus(say("تعذر التقاط الصوت (" + event.error + "). تحقق من إذن الميكروفون أو اكتب الإجابة.","Could not capture audio (" + event.error + "). Check microphone permission or type your answer."));
    };
    recognition.onend = () => {
      listening = false;
      $("cv-listen").textContent = say("🎙️ ابدأ التحدث","🎙️ Start speaking");
      if (finalText.trim()) setStatus(say("تم تحويل إجابتك إلى نص. راجعها قبل المتابعة.","Your speech was transcribed. Review it before continuing."));
      else setStatus(say("انتهى الاستماع. يمكنك إعادة المحاولة أو كتابة الإجابة.","Listening ended. Try again or type your answer."));
    };
    try { recognition.start(); } catch (e) { setStatus(say("تعذر تشغيل الميكروفون. أعد المحاولة.","Could not start the microphone. Please retry.")); }
  });

  $("cv-next").addEventListener("click", () => next(false));
  $("cv-skip").addEventListener("click", () => next(true));
  $("cv-copy").addEventListener("click", async () => {
    const text = $("cv-preview").innerText;
    try {
      await navigator.clipboard.writeText(text);
      $("cv-copy").textContent = say("تم النسخ","Copied");
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents($("cv-preview"));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      setStatus(say("حدد النص ثم انسخه يدوياً.","Select the text and copy it manually."));
    }
  });

  $("cv-print").addEventListener("click", () => {
    const content = $("cv-preview").innerText;
    const popup = window.open("", "_blank");
    if (!popup) {
      setStatus(say("اسمح بالنوافذ المنبثقة لتحميل السيرة PDF.","Allow pop-ups to print your CV as PDF."));
      return;
    }
    const safe = content.replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
    popup.document.write('<!doctype html><html lang="' + (isEnglish() ? "en" : "ar") + '" dir="' + (isEnglish() ? "ltr" : "rtl") + '"><meta charset="utf-8"><title>CV</title><style>body{font-family:Arial,Tahoma,sans-serif;color:#203047;max-width:850px;margin:40px auto;padding:0 28px;line-height:1.9;white-space:pre-wrap}h1{color:#142b4a} @media print{body{margin:15mm}}</style><body>' + safe + '</body></html>');
    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 400);
  });

  $("cv-restart").addEventListener("click", () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    $("cv-result").classList.add("cv-hidden");
    $("cv-interview").classList.add("cv-hidden");
    $("cv-intro").classList.remove("cv-hidden");
    $("cv-intro").scrollIntoView({behavior:"smooth",block:"start"});
  });
})();