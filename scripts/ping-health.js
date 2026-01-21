const target = process.argv[2] || 'http://localhost:7373/health';

async function ping() {
  try {
    const res = await fetch(target, { cache: 'no-store' });
    const body = await res.text();
    console.log(`[${new Date().toISOString()}] ${res.status} ${target} ${body}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERROR ${target}`, err.message);
    process.exitCode = 1;
  }
}

ping();
