const { paypalRequest } = require("../../lib/paypal");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");\nconst crypto = require("crypto");

const LABELS = {
  enName:"English Name", contact:"Contact Details", location:"Location", role:"Target Role",
  summary:"Professional Summary", education:"Education", experience:"Work Experience",
  projects:"Projects / Clinical Training", achievements:"Key Achievements", tools:"Systems & Tools",
  skills:"Core Skills", languages:"Languages", certifications:"Certifications & Licenses",
  domain:"Professional Specialization", technical:"Specialist Knowledge"
};
const clean = (v) => typeof v === "string" ? v.trim().slice(0, 5000) : "";
const isArabic = (s) => /[\u0600-\u06FF]/.test(s);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const orderID = clean(req.body && req.body.orderID);
    const answers = req.body && req.body.answers;
    const language = req.body && req.body.language === "en-US" ? "en-US" : "ar-SA";\n    const resumeHash = clean(req.body && req.body.resumeHash);
    if (!/^[A-Z0-9-]{8,80}$/i.test(orderID) || !answers || typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid CV request." });
    }
    const order = await paypalRequest("/v2/checkout/orders/" + encodeURIComponent(orderID), { method: "GET" });
    const unit = order.purchase_units && order.purchase_units[0];
    const capture = unit && unit.payments && unit.payments.captures && unit.payments.captures[0];
    if (order.status !== "COMPLETED" || !unit || unit.custom_id !== "cv-" + resumeHash || !/^[a-f0-9]{64}$/i.test(resumeHash) || !capture || capture.status !== "COMPLETED" ||
        !capture.amount || capture.amount.currency_code !== "USD" || capture.amount.value !== "5.00") {
      return res.status(403).json({ error: "لم يتم التحقق من دفعة مكتملة بقيمة 5 دولارات لخدمة السيرة الذاتية." });
    }
    const verified = await paypalRequest("/v2/payments/captures/" + encodeURIComponent(capture.id), { method: "GET" });
    if (verified.status !== "COMPLETED" || !verified.amount || verified.amount.currency_code !== "USD" || verified.amount.value !== "5.00") {
      return res.status(403).json({ error: "تعذر التحقق من صلاحية الدفعة." });
    }

    const digest = crypto.createHash("sha256").update(JSON.stringify({ answers, language })).digest("hex");\n    if (digest !== resumeHash.toLowerCase()) return res.status(403).json({ error: "بيانات السيرة تغيرت بعد الدفع. يجب إتمام طلب دفع جديد للنسخة المعدلة." });\n    const nameAr = clean(answers.nameAr);
    const role = clean(answers.role);
    if (!isArabic(nameAr) || nameAr.split(/\s+/).length < 2 || !role) {
      return res.status(400).json({ error: "الاسم العربي الكامل والمسمى المستهدف مطلوبان." });
    }

    const sectionSpecs = [
      ["summary","الملخص المهني","Professional Summary"],
      ["education","التعليم والمؤهلات","Education"],
      ["experience","الخبرات العملية","Work Experience"],
      ["projects","المشاريع والتدريب العملي","Projects & Practical Training"],
      ["achievements","الإنجازات","Key Achievements"],
      ["technical","المعرفة التخصصية","Specialist Knowledge"],
      ["tools","الأنظمة والأدوات","Systems & Tools"],
      ["skills","المهارات","Core Skills"],
      ["certifications","الشهادات والتراخيص","Certifications & Licenses"],
      ["languages","اللغات","Languages"]
    ];
    const english = language === "en-US";
    const title = english ? "PROFESSIONAL RESUME" : "السيرة الذاتية";
    const children = [
      new Paragraph({ text: nameAr, heading: HeadingLevel.TITLE, alignment: english ? AlignmentType.LEFT : AlignmentType.RIGHT, bidirectional: !english }),
      ...(clean(answers.enName) ? [new Paragraph({ text: clean(answers.enName), alignment: AlignmentType.LEFT })] : []),
      new Paragraph({ text: role, heading: HeadingLevel.HEADING_2, alignment: english ? AlignmentType.LEFT : AlignmentType.RIGHT, bidirectional: !english }),
      ...[["contact","بيانات التواصل","Contact"],["location","الموقع","Location"]].filter(([k]) => clean(answers[k])).map(([k,ar,en]) =>
        new Paragraph({ children:[new TextRun({text:(english?en:ar)+": ",bold:true}),new TextRun(clean(answers[k]))], alignment: english?AlignmentType.LEFT:AlignmentType.RIGHT, bidirectional:!english })
      )
    ];
    sectionSpecs.forEach(([key, ar, en]) => {
      const value = clean(answers[key]);
      if (!value) return;
      children.push(new Paragraph({ text: english ? en : ar, heading: HeadingLevel.HEADING_2, alignment: english ? AlignmentType.LEFT : AlignmentType.RIGHT, bidirectional: !english, spacing:{before:240,after:80} }));
      value.split(/\n+/).filter(Boolean).forEach(line => children.push(new Paragraph({
        children:[new TextRun({text:line, font:"Arial", size:21})],
        alignment: english ? AlignmentType.LEFT : AlignmentType.RIGHT,
        bidirectional: !english,
        spacing:{after:80}
      })));
    });
    children.push(new Paragraph({text: english ? "Prepared from candidate-provided information. Please verify dates, titles, licenses and claims before use." : "أُعدت هذه السيرة اعتماداً على المعلومات التي قدمها صاحبها. يرجى مراجعة التواريخ والمسميات والتراخيص والإنجازات قبل التقديم.", style:"Caption", spacing:{before:300}}));
    const doc = new Document({
      creator:"تنظيم أعمالك",
      title:title,
      description:"ATS-friendly resume generated from candidate-confirmed information",
      styles:{default:{document:{run:{font:"Arial",size:22}}}},
      sections:[{properties:{page:{margin:{top:850,right:900,bottom:850,left:900}}},children}]
    });
    const buffer = await Packer.toBuffer(doc);
    const filename = "ATS-Resume-" + Date.now() + ".docx";
    res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition",'attachment; filename="' + filename + '"');
    res.setHeader("Content-Length",buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("CV download:", error.message);
    return res.status(error.statusCode || 500).json({ error: "تعذر إنشاء السيرة الذاتية حالياً. حاول مجدداً." });
  }
};