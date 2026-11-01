const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const layout = (body: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#efe6f7;font-family:Arial,Helvetica,sans-serif;color:#24152f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:520px;background:#fffbff;border-radius:14px;padding:24px" cellpadding="0" cellspacing="0"><tr><td>
${body}
<p style="font-size:12px;color:#6b5a7b;margin-top:28px">Projeto X · Você recebeu este e-mail porque comprou um presente. Reembolso integral em até 7 dias.</p>
</td></tr></table></td></tr></table></body></html>`;

export function deliveryEmail(o: { url: string; receiver: string; plan: string; total: string; opensAt?: string }): string {
  const sealed = o.opensAt ? `<p>O presente está lacrado e abre em <b>${esc(new Date(o.opensAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))}</b>. Até lá, quem abrir o link vê a contagem regressiva.</p>` : '';
  const wa = `https://wa.me/?text=${encodeURIComponent('Fiz um presente para você: ' + o.url)}`;
  return layout(`<h1 style="font-size:20px;margin:0 0 12px">Seu presente para ${esc(o.receiver)} está pronto</h1>
<p>Envie o link pelo WhatsApp. Se quiser jogar antes, use o <a href="${esc(o.url)}?teste=1" style="color:#e0457b">link de teste</a>: ele não conta como aberto.</p>
<p style="background:#f4eef9;border-radius:8px;padding:10px;word-break:break-all;font-family:monospace">${esc(o.url)}</p>
<p><a href="${esc(wa)}" style="display:inline-block;background:#e0457b;color:#fff;text-decoration:none;font-weight:bold;padding:12px 18px;border-radius:10px">Enviar pelo WhatsApp</a></p>
${sealed}
<p style="font-size:14px;color:#6b5a7b">Pacote ${esc(o.plan)} · ${esc(o.total)} · pagamento único.</p>`);
}

export function openedEmail(o: { receiver: string; event: 'opened' | 'finished' }): string {
  return layout(o.event === 'opened'
    ? `<h1 style="font-size:20px;margin:0 0 12px">${esc(o.receiver)} abriu seu presente!</h1><p>O console acabou de ligar do outro lado. Avisamos de novo quando chegar ao final.</p>`
    : `<h1 style="font-size:20px;margin:0 0 12px">${esc(o.receiver)} chegou ao final do jogo</h1><p>A mensagem final foi lida. Que tal perguntar o que achou?</p>`);
}
