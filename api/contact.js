export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  try {
    const { name, email, phone, service, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: "Please complete your name, email and project message." });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email).trim())) return res.status(400).json({ error: "Please enter a valid email address." });
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL || "vulpixdigitalsolutions@gmail.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Vulpix Website <onboarding@resend.dev>";
    if (!apiKey) return res.status(500).json({ error: "Email service is not configured. Please add RESEND_API_KEY in Vercel." });
    const safe = v => String(v || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    const emailHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#20251D"><h2>New Vulpix Website Enquiry</h2><p><strong>Name:</strong> ${safe(name)}</p><p><strong>Email:</strong> ${safe(email)}</p><p><strong>Phone:</strong> ${safe(phone) || "Not provided"}</p><p><strong>Service:</strong> ${safe(service) || "Not selected"}</p><p><strong>Message:</strong></p><p>${safe(message).replace(/
/g,"<br>")}</p></div>`;
    const r = await fetch("https://api.resend.com/emails", { method:"POST", headers:{ Authorization:`Bearer ${apiKey}`, "Content-Type":"application/json" }, body:JSON.stringify({ from:fromEmail, to:[recipient], reply_to:String(email).trim(), subject:`New website enquiry${service ? ` - ${service}` : ""}`, html:emailHtml }) });
    const data = await r.json();
    if (!r.ok) { console.error("Resend error:", data); return res.status(502).json({ error:"We could not send your enquiry right now. Please try again." }); }
    return res.status(200).json({ success:true, id:data.id });
  } catch (error) { console.error("Contact form error:", error); return res.status(500).json({ error:"Something went wrong while sending your enquiry." }); }
}
