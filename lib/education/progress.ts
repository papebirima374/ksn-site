/** Système de progression séquentielle pour la plateforme Éducation.
 *
 *  Règle : pour accéder à la leçon N, il faut avoir validé toutes les
 *  leçons précédentes (dans le même module ET tous les modules d'avant).
 *
 *  Stockage : localStorage côté client uniquement (gratuit, sans
 *  authentification requise). Clé : "ksn_education_completed_lessons"
 *  contenant un tableau JSON d'IDs de leçons. */

import type { EducationModule, EducationLesson } from "@/lib/admin-types";

export const PROGRESS_STORAGE_KEY = "ksn_education_completed_lessons";

/** Lit la liste des leçons complétées depuis localStorage. */
export function loadCompletedLessonIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === "string");
  } catch {
    // ignore
  }
  return [];
}

/** Marque une leçon comme complétée et persiste dans localStorage.
 *  Retourne la nouvelle liste. */
export function markLessonCompleted(lessonId: string): string[] {
  if (typeof window === "undefined") return [];
  const current = loadCompletedLessonIds();
  if (current.includes(lessonId)) return current;
  const next = [...current, lessonId];
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

/** Réinitialise la progression. */
export function resetProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

/** Trie modules par ordre. */
function sortModules(modules: EducationModule[]): EducationModule[] {
  return [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Trie lessons par ordre dans un module. */
function sortLessonsOfModule(
  lessons: EducationLesson[],
  moduleId: string
): EducationLesson[] {
  return lessons
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Construit la liste ordonnée GLOBALE de toutes les leçons
 *  (module 1 leçon 1, module 1 leçon 2, ..., module 2 leçon 1, etc.). */
export function flattenLessonsInOrder(
  modules: EducationModule[],
  lessons: EducationLesson[]
): EducationLesson[] {
  const result: EducationLesson[] = [];
  for (const m of sortModules(modules)) {
    result.push(...sortLessonsOfModule(lessons, m.id));
  }
  return result;
}

/** Renvoie le Set des IDs de leçons débloquées pour cet utilisateur.
 *
 *  Une leçon est débloquée si TOUTES les leçons qui la précèdent
 *  dans la séquence globale sont complétées. La première leçon est
 *  toujours débloquée. */
export function getUnlockedLessonIds(
  modules: EducationModule[],
  lessons: EducationLesson[],
  completedIds: string[]
): Set<string> {
  const ordered = flattenLessonsInOrder(modules, lessons);
  const completed = new Set(completedIds);
  const unlocked = new Set<string>();
  // La première leçon est toujours débloquée.
  if (ordered.length > 0) {
    unlocked.add(ordered[0].id);
  }
  // Chaque leçon suivante est débloquée si la précédente est complétée.
  for (let i = 1; i < ordered.length; i++) {
    if (completed.has(ordered[i - 1].id)) {
      unlocked.add(ordered[i].id);
    } else {
      // Dès qu'on tombe sur une leçon non complétée, on arrête.
      // Les suivantes restent verrouillées.
      break;
    }
  }
  return unlocked;
}

/** Vérifie si une leçon est accessible. */
export function isLessonUnlocked(
  lessonId: string,
  modules: EducationModule[],
  lessons: EducationLesson[],
  completedIds: string[]
): boolean {
  return getUnlockedLessonIds(modules, lessons, completedIds).has(lessonId);
}

/** Un module est accessible dès que sa PREMIÈRE leçon est débloquée. */
export function isModuleUnlocked(
  moduleId: string,
  modules: EducationModule[],
  lessons: EducationLesson[],
  completedIds: string[]
): boolean {
  const firstLesson = sortLessonsOfModule(lessons, moduleId)[0];
  if (!firstLesson) return true; // module vide considéré comme accessible
  return isLessonUnlocked(firstLesson.id, modules, lessons, completedIds);
}

/** Retourne la prochaine leçon à étudier après celle indiquée
 *  (utilisé pour le bouton "Leçon suivante →"). */
export function getNextLesson(
  currentLessonId: string,
  modules: EducationModule[],
  lessons: EducationLesson[]
): EducationLesson | null {
  const ordered = flattenLessonsInOrder(modules, lessons);
  const idx = ordered.findIndex((l) => l.id === currentLessonId);
  if (idx === -1 || idx === ordered.length - 1) return null;
  return ordered[idx + 1];
}

/** Retourne la leçon précédente (utilisé pour le bouton "← Précédente"). */
export function getPrevLesson(
  currentLessonId: string,
  modules: EducationModule[],
  lessons: EducationLesson[]
): EducationLesson | null {
  const ordered = flattenLessonsInOrder(modules, lessons);
  const idx = ordered.findIndex((l) => l.id === currentLessonId);
  if (idx <= 0) return null;
  return ordered[idx - 1];
}

/** Retourne la première leçon NON complétée et débloquée
 *  (= là où l'utilisateur en est dans son parcours). */
export function getCurrentLesson(
  modules: EducationModule[],
  lessons: EducationLesson[],
  completedIds: string[]
): EducationLesson | null {
  const ordered = flattenLessonsInOrder(modules, lessons);
  const completed = new Set(completedIds);
  for (const l of ordered) {
    if (!completed.has(l.id)) return l;
  }
  // Tout est complété
  return null;
}

/** Statistiques globales de progression. */
export function getProgressStats(
  modules: EducationModule[],
  lessons: EducationLesson[],
  completedIds: string[]
): {
  totalLessons: number;
  completedLessons: number;
  unlockedLessons: number;
  percent: number;
  modulesCompleted: number;
  totalModules: number;
  isFullyComplete: boolean;
} {
  const ordered = flattenLessonsInOrder(modules, lessons);
  const completed = new Set(completedIds);
  const completedCount = ordered.filter((l) => completed.has(l.id)).length;
  const unlockedCount = getUnlockedLessonIds(modules, lessons, completedIds).size;

  // Module complété = toutes ses leçons sont validées
  let modulesCompleted = 0;
  for (const m of modules) {
    const moduleLessons = sortLessonsOfModule(lessons, m.id);
    if (moduleLessons.length === 0) continue;
    if (moduleLessons.every((l) => completed.has(l.id))) {
      modulesCompleted++;
    }
  }

  return {
    totalLessons: ordered.length,
    completedLessons: completedCount,
    unlockedLessons: unlockedCount,
    percent: ordered.length > 0 ? Math.round((completedCount / ordered.length) * 100) : 0,
    modulesCompleted,
    totalModules: modules.length,
    isFullyComplete: ordered.length > 0 && completedCount === ordered.length,
  };
}
