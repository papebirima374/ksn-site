/** Helper client : construit l'en-tête Authorization avec le jeton Firebase
 *  de l'utilisateur connecté, pour les appels aux API routes protégées. */
import { getFirebaseAuth } from "./firebase";

export async function authHeader(): Promise<Record<string, string>> {
  try {
    const user = getFirebaseAuth().currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}
