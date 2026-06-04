
const BASE = process.env.YOUVERIFY_BASE_URL || "https://api.sandbox.youverify.co/v2"
const KEY  = process.env.YOUVERIFY_API_KEY  || ""

async function post(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: KEY },
    body: JSON.stringify(body),
  })
  return res.json()
}

export const verifyBvn = (bvn: string, firstName: string, lastName: string) =>
  post("/identity/bvn", { id: bvn, isSubjectConsent: true, firstName, lastName })

export const verifyNin = (nin: string) =>
  post("/identity/nin", { id: nin, isSubjectConsent: true })
