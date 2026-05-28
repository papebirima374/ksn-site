import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, name, amount, currency, receiptNumber, matricule, orderNumber, total, items } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY || "mock-key";
    
    // Construct Email Content based on Type
    let subject = "Dahira KSN — Notification";
    let htmlContent = "";

    if (type === "donation") {
      subject = "Merci pour votre don — Dahira KSN";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9e3d5; border-radius: 16px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0F7C55; padding-bottom: 16px;">
            <h1 style="color: #0F7C55; font-size: 24px; margin: 0;">Dahira KSN International</h1>
            <p style="color: #B8860B; font-size: 14px; margin: 4px 0 0 0; font-style: italic;">صلى الله على محمد</p>
          </div>
          
          <h2 style="color: #0F7C55; font-size: 20px;">Assalamou alaykoum ${name},</h2>
          <p style="color: #333333; line-height: 1.6; font-size: 15px;">
            Nous vous remercions chaleureusement pour votre don généreux en soutien aux activités religieuses et solidaires du Dahira KSN.
          </p>
          
          <div style="background-color: #F8F5EF; border: 1px solid #e9e3d5; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #888888; font-weight: bold; letter-spacing: 1px; text-align: center;">Reçu électronique de don</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333;">
              <tr>
                <td style="padding: 6px 0; color: #666666;">Bienfaiteur :</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666666;">Montant :</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0F7C55; font-size: 16px;">${amount.toLocaleString("fr-FR")} ${currency}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666666;">Numéro de Reçu :</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; font-family: monospace; color: #B8860B;">${receiptNumber}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666666;">Date :</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString("fr-FR")}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666666;">Statut :</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0f5132;">Succès (Stripe/PayPal)</td>
              </tr>
            </table>
          </div>

          <p style="color: #666666; font-size: 13px; line-height: 1.6; font-style: italic; text-align: center;">
            « Certes, les aumônes purifient l'âme et multiplient la subsistance. » Que Dieu accepte vos actes d'adoration et vous accorde sa bénédiction (Baraka).
          </p>

          <div style="margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px; text-align: center; color: #999999; font-size: 12px;">
            <p style="margin: 0;">Dahira Kippangog Salaatu 'Alaa Nabii</p>
            <p style="margin: 4px 0 0 0;">Touba, Sénégal · www.salaatualaanabii.com</p>
          </div>
        </div>
      `;
    } else if (type === "membership") {
      subject = "Confirmation de votre adhésion active — Dahira KSN";
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9e3d5; border-radius: 16px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0F7C55; padding-bottom: 16px;">
            <h1 style="color: #0F7C55; font-size: 24px; margin: 0;">Dahira KSN International</h1>
            <p style="color: #B8860B; font-size: 14px; margin: 4px 0 0 0; font-style: italic;">صلى الله على محمد</p>
          </div>
          
          <h2 style="color: #0F7C55; font-size: 20px;">Bienvenue au Dahira, ${name} !</h2>
          <p style="color: #333333; line-height: 1.6; font-size: 15px;">
            Nous sommes honorés de vous compter officiellement parmi les membres actifs du Dahira Kippangog Salaatu 'Alaa Nabii. Votre adhésion a été validée avec succès.
          </p>
          
          <div style="background-color: #0F7C55; color: #ffffff; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; border: 2px solid #D4AF37;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #D4AF37; font-weight: bold; letter-spacing: 1.5px;">Carte de Membre KSN</p>
            <h3 style="margin: 12px 0; font-size: 24px; font-weight: black; letter-spacing: 0.5px;">${name}</h3>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">MATRICULE OFFICIEL</p>
            <p style="margin: 4px 0 0 0; font-size: 22px; font-weight: bold; font-family: monospace; color: #D4AF37; letter-spacing: 2px;">${matricule}</p>
          </div>

          <p style="color: #333333; line-height: 1.6; font-size: 14px;">
            Vous pouvez à tout moment vous connecter à votre <strong>Espace Membre</strong> sur notre site internet pour télécharger votre carte numérique officielle avec QR Code de vérification intégré.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://salaatualaanabii.com/espace-membre" style="background-color: #B8860B; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Accéder à mon espace membre</a>
          </div>

          <div style="margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px; text-align: center; color: #999999; font-size: 12px;">
            <p style="margin: 0;">Dahira Kippangog Salaatu 'Alaa Nabii</p>
            <p style="margin: 4px 0 0 0;">Touba, Sénégal · www.salaatualaanabii.com</p>
          </div>
        </div>
      `;
    } else if (type === "order") {
      subject = `Confirmation de commande #${orderNumber} — Boutique KSN`;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9e3d5; border-radius: 16px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0F7C55; padding-bottom: 16px;">
            <h1 style="color: #0F7C55; font-size: 24px; margin: 0;">Boutique KSN</h1>
            <p style="color: #B8860B; font-size: 14px; margin: 4px 0 0 0; font-style: italic;">صلى الله على محمد</p>
          </div>
          
          <h2 style="color: #0F7C55; font-size: 20px;">Merci pour votre commande, ${name} !</h2>
          <p style="color: #333333; line-height: 1.6; font-size: 15px;">
            Nous vous confirmons la bonne réception de votre commande numéro <strong>#${orderNumber}</strong>. Nos équipes préparent vos articles avec le plus grand soin.
          </p>

          <div style="border: 1px solid #eeeeee; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #0F7C55; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333;">
              <thead>
                <tr style="border-bottom: 1px solid #eee;">
                  <th style="text-align: left; padding: 8px 0; color: #888888; font-weight: normal;">Article</th>
                  <th style="text-align: center; padding: 8px 0; color: #888888; font-weight: normal; width: 60px;">Qté</th>
                  <th style="text-align: right; padding: 8px 0; color: #888888; font-weight: normal; width: 100px;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${(items || []).map((item: any) => `
                  <tr style="border-bottom: 1px solid #f9f9f9;">
                    <td style="padding: 8px 0; font-weight: bold;">${item.title}</td>
                    <td style="padding: 8px 0; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px 0; text-align: right;">${(item.price * item.quantity).toLocaleString("fr-FR")} FCFA</td>
                  </tr>
                `).join("")}
                <tr>
                  <td colspan="2" style="padding: 12px 0 0 0; font-weight: bold; font-size: 16px;">Total :</td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-weight: bold; font-size: 18px; color: #0F7C55;">${total.toLocaleString("fr-FR")} FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style="color: #666666; font-size: 13px; line-height: 1.6;">
            Si votre commande contient des livres numériques en téléchargement PDF, ils seront disponibles dans votre profil ou rattachés aux mails suivants. Pour les produits physiques, nous prendrons contact avec vous très rapidement.
          </p>

          <div style="margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px; text-align: center; color: #999999; font-size: 12px;">
            <p style="margin: 0;">Boutique KSN · Dahira Kippangog Salaatu 'Alaa Nabii</p>
            <p style="margin: 4px 0 0 0;">Touba, Sénégal · www.salaatualaanabii.com</p>
          </div>
        </div>
      `;
    } else {
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Notification KSN</h2>
          <p>Bonjour ${name},</p>
          <p>Ceci est une notification automatique de vos transactions sur le site du Dahira KSN.</p>
        </div>
      `;
    }

    // Determine Sender Domain
    const sender = apiKey === "mock-key" || apiKey === "" 
      ? "onboarding@resend.dev"
      : "Dahira KSN <no-reply@salaatualaanabii.com>";

    // If no API key config, fallback/mock response
    if (apiKey === "mock-key") {
      console.log(`[MOCK EMAIL SENT] To: ${email}, Subject: ${subject}`);
      return NextResponse.json({ success: true, mocked: true });
    }

    // Call Resend REST API natively
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: sender,
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend API returned error:", resData);
      // fallback to mock success to not break user checkout flows in testing/staging
      return NextResponse.json({ success: true, error: resData.message, mockedFallback: true });
    }

    return NextResponse.json({ success: true, id: resData.id });
  } catch (err: any) {
    console.error("send-email API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
