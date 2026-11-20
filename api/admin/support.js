const { supabase, verifySession } = require("../../lib/leads");
const clean=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"";
module.exports=async(req,res)=>{
 res.setHeader("Cache-Control","no-store");
 if(!verifySession(req)) return res.status(401).json({error:"Unauthorized"});
 try {
  if(req.method==="GET"){
   const id=clean(req.query&&req.query.id,50);
   if(id){
    const messages=await supabase("support_messages?conversation_id=eq."+encodeURIComponent(id)+"&select=id,sender,body,created_at&order=created_at.asc");
    return res.status(200).json({messages:messages||[]});
   }
   const rows=await supabase("support_conversations?select=id,customer_name,phone,email,status,created_at,last_message_at&order=last_message_at.desc.nullslast&limit=300");
   return res.status(200).json({conversations:rows||[]});
  }
  if(req.method==="POST"){
   const id=clean(req.body&&req.body.id,50), message=clean(req.body&&req.body.message,3000);
   if(!id||!message) return res.status(400).json({error:"المحادثة والرد مطلوبان."});
   await supabase("support_messages",{method:"POST",body:JSON.stringify({conversation_id:id,sender:"admin",body:message})});
   await supabase("support_conversations?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({last_message_at:new Date().toISOString(),status:"open"})});
   return res.status(201).json({ok:true});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){console.error("admin support:",e.message);return res.status(503).json({error:"تعذر تنفيذ طلب الدعم."});}
};
