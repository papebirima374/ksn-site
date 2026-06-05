/** Vérification d'authentification côté serveur (API routes) SANS firebase-admin.
 *
 *  On valide le jeton d'identité Firebase (ID token) envoyé par le client
 *  dans l'en-tête `Authorization: Bearer <token>` en appelant l'API Google
 *  Identity Toolkit. Pour le contrôle de rôle admin, on lit le document
 *  users/<uid> via l'API REST Firestore EN PASSANT le jeton (Bearer), donc
 *  les règles Firestore s'appliquent normalement.
 *
 *  Avantage : pas besoin de clé de compte de service. */

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export type VerifiedUser = {
  uid: string;
  email: string | null;
};

/** Extrait le Bearer token de la requête. */
function extractToken(req: Request): string | null {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/** Vérifie le jeton et renvoie l'utilisateur, ou null si invalide. */
export async function verifyRequest(req: Request): Promise<VerifiedUser | null> {
  const token = extractToken(req);
  if (!token || !API_KEY) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const u = data?.users?.[0];
    if (!u?.localId) return null;
    return { uid: u.localId, email: u.email ?? null };
  } catch {
    return null;
  }
}

/** Vérifie que le porteur du jeton est admin (ou possède la permission donnée).
 *  Lit users/<uid> via Firestore REST en passant le jeton (règles appliquées).
 *  Renvoie l'utilisateur si autorisé, sinon null. */
export async function verifyAdmin(
  req: Request,
  requiredPermission?: string
): Promise<VerifiedUser | null> {
  const token = extractToken(req);
  const user = await verifyRequest(req);
  if (!user || !token || !PROJECT_ID) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${user.uid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    const doc = await res.json();
    const fields = doc?.fields ?? {};
    const role = fields.role?.stringValue ?? null;
    if (role === "admin") return user;

    if (requiredPermission) {
      const perms: string[] =
        fields.permissions?.arrayValue?.values?.map(
          (v: { stringValue?: string }) => v.stringValue ?? ""
        ) ?? [];
      if (perms.includes(requiredPermission)) return user;
    }
    return null;
  } catch {
    return null;
  }
}
