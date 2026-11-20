const ExcelJS = require("exceljs");
const { paypalRequest } = require("../lib/paypal");

const TEMPLATES = {
  customers: {
    title: "CUSTOMER & ORDER TRACKER | متابعة العملاء والطلبات",
    sheet: "Orders | الطلبات",
    headers: ["Order ID | رقم الطلب","Order Date | تاريخ الطلب","Customer Name | اسم العميل","Phone | الجوال","Order Details | تفاصيل الطلب","Status | الحالة","Total | الإجمالي","Paid | المدفوع","Balance | المتبقي","Due Date | الاستحقاق","Next Follow-up | المتابعة القادمة","Notes | ملاحظات"],
    rows: 500
  },
  sales: {
    title: "SALES & TARGETS | المبيعات والأهداف",
    sheet: "Sales | المبيعات",
    headers: ["Date | التاريخ","Sales Rep | مندوب المبيعات","Customer | العميل","Product | المنتج","Quantity | الكمية","Unit Price | سعر الوحدة","Total Sales | إجمالي البيع","Target | المستهدف","Achievement % | نسبة الإنجاز","Notes | ملاحظات"],
    rows: 500
  },
  leads: {
    title: "CRM & LEADS | العملاء المحتملون",
    sheet: "Leads | الفرص",
    headers: ["Lead ID | رقم الفرصة","Created Date | تاريخ الإنشاء","Customer | العميل","Company | الشركة","Phone | الجوال","Source | المصدر","Stage | المرحلة","Deal Value | قيمة الصفقة","Last Contact | آخر تواصل","Next Follow-up | المتابعة القادمة","Owner | المسؤول","Notes | ملاحظات"],
    rows: 500
  },
  commissions: {
    title: "COMMISSIONS & TEAM KPIs | العمولات والأداء",
    sheet: "Team KPIs | أداء الفريق",
    headers: ["Employee | الموظف","Period | الفترة","Sales Target | المستهدف","Actual Sales | المبيعات الفعلية","Achievement % | الإنجاز","Commission Rate | نسبة العمولة","Commission | العمولة","Notes | ملاحظات"],
    rows: 300
  },
  tasks: {
    title: "TASKS & PROJECTS | المهام والمشاريع",
    sheet: "Tasks | المهام",
    headers: ["Task ID | رقم المهمة","Project | المشروع","Task | المهمة","Owner | المسؤول","Priority | الأولوية","Start Date | البداية","Due Date | الاستحقاق","Status | الحالة","Completion % | الإنجاز","Days Remaining | الأيام المتبقية","Notes | ملاحظات"],
    rows: 500
  },
  hr: {
    title: "HR & ATTENDANCE | الموارد البشرية والحضور",
    sheet: "Employees | الموظفون",
    headers: ["Employee ID | رقم الموظف","Employee Name | اسم الموظف","Department | القسم","Job Title | المسمى","Work Date | التاريخ","Check-in | الحضور","Check-out | الانصراف","Attendance Status | حالة الحضور","Hours | الساعات","Notes | ملاحظات"],
    rows: 300
  },
  procurement: {
    title: "PROCUREMENT TRACKER | متابعة المشتريات",
    sheet: "Purchase Orders | أوامر الشراء",
    headers: ["PO Number | رقم الطلب","Request Date | تاريخ الطلب","Vendor | المورد","Item | الصنف","Quantity | الكمية","Unit Cost | تكلفة الوحدة","Total Cost | الإجمالي","Delivery Date | موعد التسليم","Status | الحالة","Owner | المسؤول","Notes | ملاحظات"],
    rows: 400
  },
  documents: {
    title: "ADMINISTRATIVE LOG | سجل المعاملات الإدارية",
    sheet: "Transactions | المعاملات",
    headers: ["Reference | الرقم المرجعي","Received Date | تاريخ الاستلام","Subject | الموضوع","Department | الإدارة","Assigned To | المسؤول","Priority | الأولوية","Due Date | الاستحقاق","Status | الحالة","Completion Date | الإنجاز","Notes | ملاحظات"],
    rows: 500
  },
  budget: {
    title: "BUDGET & EXPENSES | الميزانية والمصروفات",
    sheet: "Expenses | المصروفات",
    headers: ["Date | التاريخ","Category | التصنيف","Description | الوصف","Vendor | المورد","Budget | الميزانية","Actual | الفعلي","Variance | الفرق","Payment Status | حالة الدفع","Notes | ملاحظات"],
    rows: 500
  },
  invoices: {
    title: "INVOICES & COLLECTIONS | الفواتير والتحصيل",
    sheet: "Invoices | الفواتير",
    headers: ["Invoice No. | رقم الفاتورة","Customer | العميل","Issue Date | تاريخ الإصدار","Due Date | الاستحقاق","Invoice Amount | قيمة الفاتورة","Paid Amount | المدفوع","Balance | المتبقي","Payment Status | حالة الدفع","Notes | ملاحظات"],
    rows: 500
  },
  cashflow: {
    title: "CASH FLOW | التدفق النقدي",
    sheet: "Cash Flow | التدفق النقدي",
    headers: ["Date | التاريخ","Type | النوع","Category | التصنيف","Description | الوصف","Cash In | الداخل","Cash Out | الخارج","Net Cash | صافي التدفق","Account | الحساب","Notes | ملاحظات"],
    rows: 500
  },
  inventory: {
    title: "INVENTORY CONTROL | إدارة المخزون",
    sheet: "Inventory | المخزون",
    headers: ["SKU | رمز الصنف","Item | الصنف","Category | التصنيف","Opening Stock | رصيد أول المدة","Stock In | وارد","Stock Out | منصرف","Current Stock | الرصيد الحالي","Reorder Level | حد الطلب","Unit Cost | تكلفة الوحدة","Stock Value | قيمة المخزون","Notes | ملاحظات"],
    rows: 500
  },
  maintenance: {
    title: "MAINTENANCE & ASSETS | الصيانة والأصول",
    sheet: "Assets | الأصول",
    headers: ["Asset ID | رقم الأصل","Asset Name | اسم الأصل","Location | الموقع","Issue Date | تاريخ البلاغ","Issue | وصف العطل","Priority | الأولوية","Assigned To | المسؤول","Status | الحالة","Cost | التكلفة","Next Maintenance | الصيانة القادمة","Notes | ملاحظات"],
    rows: 400
  },
  quality: {
    title: "QUALITY & OPERATIONS | الجودة والتشغيل",
    sheet: "Quality Log | سجل الجودة",
    headers: ["Audit Date | تاريخ التدقيق","Process | العملية","Checklist Item | بند الفحص","Result | النتيجة","Risk Level | مستوى المخاطر","Finding | الملاحظة","Corrective Action | الإجراء التصحيحي","Owner | المسؤول","Due Date | الاستحقاق","Status | الحالة"],
    rows: 400
  }
};

function styleHeader(row) {
  row.height = 34;
  row.eachCell(cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF203D60" } };
    cell.font = { name: "Aptos", bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: "FFC6A15B" } } };
  });
}

async function buildWorkbook(templateId) {
  const t = TEMPLATES[templateId];
  const wb = new ExcelJS.Workbook();
  wb.creator = "تنظيم أعمالك | Gulf Business Templates";
  wb.subject = t.title;
  wb.created = new Date();
  const dash = wb.addWorksheet("Dashboard | المؤشرات", { views: [{ rightToLeft: true, showGridLines: false }] });
  dash.mergeCells("A1:F1");
  dash.getCell("A1").value = t.title;
  dash.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF142B4A" } };
  dash.getCell("A1").font = { name: "Aptos Display", size: 18, bold: true, color: { argb: "FFFFFFFF" } };
  dash.getRow(1).height = 42;
  dash.mergeCells("A2:F2");
  dash.getCell("A2").value = "قالب ثنائي اللغة | Arabic & English • أدخل بياناتك في ورقة العمل ثم راجع المؤشرات هنا.";
  dash.getCell("A2").font = { name: "Aptos", italic: true, color: { argb: "FF65758B" }, size: 10 };
  const data = wb.addWorksheet(t.sheet, { views: [{ rightToLeft: true, showGridLines: false, state: "frozen", ySplit: 1 }] });
  data.addRow(t.headers);
  styleHeader(data.getRow(1));
  data.autoFilter = { from: { row: 1, column: 1 }, to: { row: t.rows + 1, column: t.headers.length } };
  data.views = [{ rightToLeft: true, state: "frozen", ySplit: 1, showGridLines: false }];
  t.headers.forEach((h,i) => { data.getColumn(i+1).width = Math.min(28, Math.max(17, h.length * 0.8)); });
  for (let r=2; r<=t.rows+1; r++) {
    data.getRow(r).height = 21;
    if (r % 2 === 0) data.getRow(r).eachCell({ includeEmpty: true }, c => { c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FFF6F8FB"} }; });
  }
  const guide = wb.addWorksheet("Guide | دليل الاستخدام", { views: [{ rightToLeft: true, showGridLines: false }] });
  guide.columns = [{width:8},{width:34},{width:88}];
  guide.addRow(["#","Step | الخطوة","Instructions | التعليمات"]);
  styleHeader(guide.getRow(1));
  [
    ["01","Enter data | أدخل البيانات","اكتب بياناتك في ورقة العمل المخصصة، صف واحد لكل سجل."],
    ["02","Use filters | استخدم التصفية","استخدم الفلاتر في عناوين الأعمدة للبحث والترتيب."],
    ["03","Update status | حدّث الحالة","حدّث الحالة والتواريخ باستمرار حتى تكون المؤشرات دقيقة."],
    ["04","Review dashboard | راجع المؤشرات","راجع لوحة المؤشرات بعد إدخال البيانات."],
    ["05","Save a copy | احفظ نسخة","احتفظ بنسخة احتياطية قبل التعديلات الكبيرة."]
  ].forEach(x => guide.addRow(x));
  guide.eachRow((row,n) => { if(n>1){row.height=34;row.eachCell(c=>{c.alignment={vertical:"middle",wrapText:true};c.font={name:"Aptos",size:10,color:{argb:"FF243447"}};});}});
  const lists = wb.addWorksheet("Lists | القوائم", { views: [{ rightToLeft: true, showGridLines: false }] });
  lists.addRow(["Order Status | حالة الطلب","Payment Status | حالة الدفع","Priority | الأولوية","Currency | العملة"]);
  styleHeader(lists.getRow(1));
  [["New / جديد","Unpaid / غير مدفوع","High / عالية","SAR"],["In Progress / قيد التنفيذ","Partially Paid / مدفوع جزئياً","Medium / متوسطة","USD"],["Completed / مكتمل","Paid / مدفوع بالكامل","Low / منخفضة","AED"],["Cancelled / ملغي","Refunded / مسترد","",""]].forEach(x=>lists.addRow(x));
  lists.columns.forEach(c=>c.width=29);
  [dash,data,guide,lists].forEach(ws => {
    ws.pageSetup = { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
    ws.headerFooter.oddFooter.center = "تنظيم أعمالك | Premium Gulf Business Templates";
  });
  dash.columns = [{width:30},{width:22},{width:22},{width:22},{width:22},{width:22}];
  const summary = [
    ["KPI | المؤشر","Value | القيمة"],
    ["Template | القالب",t.title],
    ["Available rows | عدد الصفوف",t.rows],
    ["Data sheet | ورقة البيانات",t.sheet],
    ["Currency note | ملاحظة العملة","اختر عملة واحدة لكل مجموعة تقارير."]
  ];
  summary.forEach((r,i)=>{dash.addRow(r); if(i===0) styleHeader(dash.getRow(dash.rowCount));});
  dash.getColumn(1).width=34; dash.getColumn(2).width=54;
  return wb;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const orderID = String(req.query.orderID || "");
    const templateId = String(req.query.templateId || "");
    if (!/^[A-Z0-9-]{8,80}$/i.test(orderID) || !TEMPLATES[templateId]) {
      return res.status(400).json({ error: "Invalid order or template." });
    }
    const order = await paypalRequest("/v2/checkout/orders/" + encodeURIComponent(orderID), { method: "GET" });
    const unit = order.purchase_units && order.purchase_units[0];
    const capture = unit && unit.payments && unit.payments.captures && unit.payments.captures[0];
    const amount = capture && capture.amount;
    if (
      order.status !== "COMPLETED" ||
      !unit ||
      unit.custom_id !== templateId ||
      !capture ||
      capture.status !== "COMPLETED" ||
      !amount ||
      amount.currency_code !== "USD" ||
      amount.value !== "5.00"
    ) {
      return res.status(403).json({ error: "Payment could not be verified for this template." });
    }
    const wb = await buildWorkbook(templateId);
    const buffer = await wb.xlsx.writeBuffer();
    const filename = "Gulf-" + templateId + "-Template.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="' + filename + '"');
    res.setHeader("Content-Length", buffer.byteLength);
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Secure download:", error.message);
    return res.status(error.statusCode || 500).json({ error: "تعذر تجهيز الملف حالياً. حاول لاحقاً." });
  }
};
