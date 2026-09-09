module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) {
    return response.status(501).json({ ok: false, error: "missing_google_apps_script_url" });
  }

  const lead = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  const payload = {
    submittedAt: lead.submittedAt || new Date().toISOString(),
    name: String(lead.name || "").trim(),
    phone: String(lead.phone || "").trim(),
    email: String(lead.email || "").trim(),
    source: lead.source || "phat-digital-landing",
    thankYouPage: lead.thankYouPage || "thank-you.html"
  };

  if (!payload.name || !payload.phone || !payload.email) {
    return response.status(400).json({ ok: false, error: "missing_required_fields" });
  }

  const sheetResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!sheetResponse.ok) {
    const detail = await sheetResponse.text().catch(() => "");
    return response.status(502).json({ ok: false, error: "sheet_write_failed", detail });
  }

  return response.status(200).json({ ok: true });
};
