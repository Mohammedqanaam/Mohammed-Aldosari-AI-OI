(() => {
 const $=id=>document.getElementById(id), key="customer_support_ticket_v1";
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch(_){return null}};
 const write=v=>localStorage.setItem(key,JSON.stringify(v));
 const status=m=>{$("support-status").textContent=m||""};
 const esc=v=>String(v||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const render=messages=>{$("support-messages").innerHTML=(messages||[]).map(m=>"<div class='support-msg "+(m.sender==="admin"?"admin":"")+"'><b>"+(m.sender==="admin"?"الدعم":"أنت")+"</b><div>"+esc(m.body)+"</div><small>"+new Date(m.created_at).toLocaleString("ar-SA")+"</small></div>").join("");$("support-messages").scrollTop=$("support-messages").scrollHeight};
 async function refresh(){const t=read();if(!t)return;const r=await fetch("/api/support/conversation?id="+encodeURIComponent(t.id),{headers:{"x-support-token":t.token},cache:"no-store"});const d=await r.json();if(!r.ok)throw Error(d.error||"تعذر تحميل المحادثة");$("support-start").hidden=true;$("support-thread").hidden=false;render(d.messages)}
 $("support-toggle").onclick=()=>{$("support-panel").hidden=!$("support-panel").hidden;$("support-toggle").setAttribute("aria-expanded",String(!$("support-panel").hidden));if(!$("support-panel").hidden)refresh().catch(()=>{})};
 $("support-close").onclick=()=>{$("support-panel").hidden=true};
 $("support-open").onclick=async()=>{status("جارٍ إرسال طلبك...");try{const body={action:"open",name:$("support-name").value,phone:$("support-phone").value,email:$("support-email").value,message:$("support-first-message").value};const r=await fetch("/api/support/conversation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.error||"تعذر إرسال الطلب");write({id:d.id,token:d.token});status("تم فتح محادثتك. يمكنك متابعة الرد هنا.");await refresh()}catch(e){status(e.message)}};
 $("support-send").onclick=async()=>{const t=read(),message=$("support-reply").value.trim();if(!t||!message)return;try{const r=await fetch("/api/support/conversation?id="+encodeURIComponent(t.id),{method:"POST",headers:{"Content-Type":"application/json","x-support-token":t.token},body:JSON.stringify({message})});const d=await r.json();if(!r.ok)throw Error(d.error||"تعذر الإرسال");$("support-reply").value="";await refresh();status("تم إرسال رسالتك.")}catch(e){status(e.message)}};
 if(read()){$("support-start").hidden=true;$("support-thread").hidden=false;}
})();
