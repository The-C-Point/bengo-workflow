const { schedule } = require('@netlify/functions');

const SUPA_URL = process.env.SUPA_URL;
const SUPA_KEY = process.env.SUPA_KEY;
const RESEND_KEY = process.env.RESEND_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = 'https://bengo-workflow.netlify.app';

async function supaFetch(table, params = '') {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, {
    headers: {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY,
      'Content-Type': 'application/json'
    }
  });
  return res.json();
}

async function sendEmail(to, subject, html) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html })
  });
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function isDueSoon(dueDate) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const today = new Date(new Date().toDateString());
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

const handler = async () => {
  if (!SUPA_URL || !SUPA_KEY || !RESEND_KEY) {
    console.error('Missing env vars');
    return { statusCode: 500 };
  }

  const [people, tasks, episodes, podcasts] = await Promise.all([
    supaFetch('people', 'active=eq.true&select=*'),
    supaFetch('tasks', 'status=neq.Complete&select=*'),
    supaFetch('episodes', 'select=*'),
    supaFetch('podcasts', 'select=*')
  ]);

  const epById = id => episodes.find(e => e.id === id);
  const podById = id => podcasts.find(p => p.id === id);

  let sent = 0;

  for (const person of people) {
    const prefs = person.email_preferences || {};
    if (prefs.digest === false) continue;
    if (!person.email) continue;

    const myTasks = tasks.filter(t => t.assigned_to === person.id);
    if (myTasks.length === 0) continue;

    // Group tasks by podcast
    const byPodcast = {};
    for (const t of myTasks) {
      const ep = epById(t.episode_id);
      const pod = ep ? podById(ep.podcast_id) : null;
      const key = pod ? pod.id : '__standalone__';
      const label = pod ? pod.name : 'Standalone';
      if (!byPodcast[key]) byPodcast[key] = { label, tasks: [] };
      byPodcast[key].tasks.push({ ...t, ep, pod });
    }

    let taskRows = '';
    for (const group of Object.values(byPodcast)) {
      taskRows += `<tr><td colspan="4" style="padding:10px 12px 4px;font-weight:600;font-size:13px;background:#f8f8f8;border-top:2px solid #e0e0e0">${group.label}</td></tr>`;
      for (const t of group.tasks.sort((a, b) => (a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1)) {
        const epLabel = t.ep ? (t.ep.default_title || 'Episode ' + t.ep.number) : '';
        const od = isOverdue(t.due_date);
        taskRows += `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${t.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;color:#888;font-size:13px">${epLabel}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;color:${od ? '#e05050' : '#888'};font-size:13px">${formatDate(t.due_date)}${od ? ' ⚠' : ''}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;font-size:13px">${t.status}</td>
        </tr>`;
      }
    }

    // EP overdue/due-soon summary
    let epSection = '';
    const isEP = person.role === 'Executive Producer';
    if (isEP) {
      const attention = tasks.filter(t => isOverdue(t.due_date) || isDueSoon(t.due_date));
      if (attention.length > 0) {
        const attRows = attention
          .sort((a, b) => (a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1)
          .map(t => {
            const assignee = people.find(p => p.id === t.assigned_to);
            const ep = epById(t.episode_id);
            const pod = ep ? podById(ep.podcast_id) : null;
            const od = isOverdue(t.due_date);
            return `<tr>
              <td style="padding:6px 12px;border-bottom:1px solid #eee">${t.name}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #eee;font-size:13px">${assignee ? assignee.name : '—'}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #eee;font-size:13px">${pod ? pod.name : ''}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #eee;color:${od ? '#e05050' : '#e08800'};font-size:13px">${formatDate(t.due_date)}${od ? ' ⚠ OVERDUE' : ' — due soon'}</td>
            </tr>`;
          }).join('');
        epSection = `
          <h3 style="font-size:15px;margin:24px 0 8px;color:#c0392b">⚠ Needs attention (${attention.length} task${attention.length !== 1 ? 's' : ''})</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead><tr style="background:#fff0f0">
              <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Task</th>
              <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Assigned To</th>
              <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Podcast</th>
              <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Due</th>
            </tr></thead>
            <tbody>${attRows}</tbody>
          </table>`;
      }
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="font-size:18px;margin-bottom:4px">Good morning, ${person.name} 👋</h2>
        <p style="color:#888;margin-top:0">Here are your open tasks for today.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="background:#f0f0f0">
            <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Task</th>
            <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Episode</th>
            <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Due</th>
            <th style="padding:6px 12px;text-align:left;font-size:12px;color:#888">Status</th>
          </tr></thead>
          <tbody>${taskRows}</tbody>
        </table>
        ${epSection}
        <p style="margin-top:24px"><a href="${APP_URL}" style="background:#f5c800;color:#111;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">Open Bengo Workflow</a></p>
      </div>`;

    await sendEmail(person.email, `Your tasks for today — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`, html);
    sent++;
  }

  console.log(`Digest sent to ${sent} people`);
  return { statusCode: 200 };
};

// 9am UTC Mon–Fri (= 9am GMT in winter, 10am BST in summer)
exports.handler = schedule('0 9 * * 1-5', handler);
