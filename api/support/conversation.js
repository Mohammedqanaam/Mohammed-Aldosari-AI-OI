const crypto = require("crypto");
const { supabase } = require("../../lib/leads");
const clean = (v,n) => typeof v === "string" ? v.trim().slice(0,n) : "";
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
module.exports = async (req,res) => {
  res.setHeader("Cache-Control","no-store");
  if (req.method === "POST" && req.body && req.body.action === "open") {
    try {
      const name=clean(req.body.name,90), phone=clean(req.body.phone,20), email=clean(req.body.email,160).toLowerCase(), message=clean(req.body.message,3000);
      if(!name||!phone||!email||!message) return res.status(400).json({error:"الاسم والجوال والبريد والرسالة مطلوبة."});
      if(!/^\+?[0-9\s()-]{8,20}$/.test(phone)||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:"تحقق من رقم الجوال والبريد الإلكتروني."});
      const token=crypto.randomBytes(32).toString("hex");
      const rows=await supabase("support_conversations",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({customer_name:name,phone,email,access_token_hash:hash(token),status:"open"})});
      const id=rows&&rows[0]&&rows[0].id;
      if(!id) throw new Error("Ticket was not created");
      await supabase("support_messages",{method:"POST",body:JSON.stringify({conversation_id:id,sender:"customer",body:message})});
      return res.status(201).json({id,token});
    } catch(e) { console.error("support open:",e.message); return res.status(503).json({error:"خدمة الدعم غير مفعّلة حالياً. يرجى المحاولة لاحقاً."}); }
  }
  const id=clean(req.query&&req.query.id,50), token=clean(req.headers["x-support-token"],100);
  if(!id||!token) return res.status(401).json({error:"بيانات متابعة المحادثة غير مكتملة."});
  try {
    const rows=await supabase("support_conversations?id=eq."+encodeURIComponent(id)+"&select=id,access_token_hash,status&limit=1");
    if(!rows||!rows[0]||rows[0].access_token_hash!==hash(token)) return res.status(403).json({error:"رابط المحادثة غير صالح."});
    if(req.method==="GET") {
      const messages=await supabase("support_messages?conversation_id=eq."+encodeURIComponent(id)+"&select=id,sender,body,created_at&order=created_at.asc");
      return res.status(200).json({status:rows[0].status,messages});
    }
    if(req.method==="POST") {
      const body=clean(req.body&&req.body.message,3000);
      if(!body) return res.status(400).json({error:"اكتب رسالتك أولاً."});
      await supabase("support_messages",{method:"POST",body:JSON.stringify({conversation_id:id,sender:"customer",body})});
      await supabase("support_conversations?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({last_message_at:new Date().toISOString(),status:"open"})});
      return res.status(201).json({ok:true});
    }
    return res.status(405).json({error:"Method not allowed"});
  } catch(e) { console.error("support conversation:",e.message); return res.status(503).json({error:"تعذر تحميل المحادثة حالياً."}); }
};
