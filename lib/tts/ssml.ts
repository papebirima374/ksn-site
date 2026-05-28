/** Pré-traitement du texte avant envoi aux moteurs TTS pour produire
 *  une narration spirituelle premium : pauses naturelles après les
 *  invocations, emphases sur les noms divins, respiration entre paragraphes. */

export type SpiritualSSMLOptions = {
  /** Vitesse relative (0.85 = contemplatif, 1.0 = normal). */
  rate?: number;
  /** Pitch shift en demi-tons (0 = naturel). */
  pitch?: number;
  /** Force globale des pauses (1 = normal, 1.5 = plus lent). */
  pauseScale?: number;
};

/**
 * Transforme un texte brut en SSML enrichi pour un rendu spirituel.
 * Compatible Google Cloud TTS (SSML 1.1) et Edge TTS (MSTTS).
 */
export function toSpiritualSSML(
  text: string,
  options: SpiritualSSMLOptions = {}
): string {
  const { rate = 0.92, pitch = 0, pauseScale = 1 } = options;

  // Échappe les caractères XML d'abord (avant d'ajouter nos balises)
  let body = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const ms = (n: number) => Math.round(n * pauseScale);

  body = body
    // Salutations sur le Prophète : grande respiration
    .replace(/ﷺ/g, `ﷺ <break time="${ms(900)}ms"/>`)
    .replace(/qu'Allah l'agrée/gi, `qu'Allah l'agrée <break time="${ms(700)}ms"/>`)
    .replace(/qu'Allah le bénisse et le salue/gi,
      `qu'Allah le bénisse et le salue <break time="${ms(800)}ms"/>`)

    // Phrases arabes (toutes les séquences arabes consécutives) :
    // marquer une légère pause après pour respect du verset/du dhikr
    .replace(/(\p{Script=Arabic}[\p{Script=Arabic}\s]*\p{Script=Arabic})/gu,
      `<break time="${ms(300)}ms"/>$1<break time="${ms(600)}ms"/>`)

    // Ponctuation : respirations naturelles
    .replace(/\.\.\./g, `<break time="${ms(700)}ms"/>`)
    .replace(/\. /g, `. <break time="${ms(450)}ms"/> `)
    .replace(/\? /g, `? <break time="${ms(500)}ms"/> `)
    .replace(/! /g, `! <break time="${ms(500)}ms"/> `)
    .replace(/; /g, `; <break time="${ms(350)}ms"/> `)
    .replace(/: /g, `: <break time="${ms(350)}ms"/> `)
    .replace(/, /g, `, <break time="${ms(180)}ms"/> `)

    // Paragraphes : respiration longue
    .replace(/\n\n+/g, `<break time="${ms(1300)}ms"/>`)
    .replace(/\n/g, `<break time="${ms(500)}ms"/>`)

    // Emphases sur les noms sacrés (modéré pour ne pas exagérer)
    .replace(/\bAllah\b/g, `<emphasis level="moderate">Allah</emphasis>`)
    .replace(/\bSerigne Touba\b/g,
      `<emphasis level="moderate">Serigne Touba</emphasis>`)
    .replace(/\bCheikh Ahmadou Bamba\b/g,
      `<emphasis level="moderate">Cheikh Ahmadou Bamba</emphasis>`)
    .replace(/\bProph(è|e)te\b/gi,
      `<emphasis level="moderate">Prophète</emphasis>`)
    .replace(/\bSalaatu\b/g,
      `<emphasis level="moderate">Salaatu</emphasis>`);

  // Enveloppe finale avec ratio prosodique
  const pitchAttr = pitch !== 0 ? ` pitch="${pitch > 0 ? "+" : ""}${pitch}st"` : "";
  return `<speak><prosody rate="${rate}"${pitchAttr}>${body}</prosody></speak>`;
}

/** Compte les caractères "billables" du texte d'entrée.
 *  Google Cloud facture le SSML COMPLET (balises incluses), donc on
 *  retourne la longueur après transformation pour estimation honnête. */
export function estimateBillableChars(text: string, options?: SpiritualSSMLOptions): number {
  return toSpiritualSSML(text, options).length;
}

/** Estime la durée approximative en secondes du futur audio,
 *  basée sur ~13 caractères/seconde en français contemplatif. */
export function estimateDurationSeconds(text: string, rate = 0.92): number {
  const cleanText = text.replace(/<[^>]+>/g, "");
  const charsPerSecond = 13 * rate;
  return Math.ceil(cleanText.length / charsPerSecond);
}
