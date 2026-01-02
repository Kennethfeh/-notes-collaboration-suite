const waitFor = async (url) => {
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (err) {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Timeout waiting for ${url}`);
};

(async () => {
  try {
    await waitFor('http://localhost:8080/api/health');
    const create = await fetch('http://localhost:8080/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'integration' })
    });
    if (!create.ok) throw new Error('Failed to create note');
    const list = await fetch('http://localhost:8080/api/notes');
    const notes = await list.json();
    if (!notes.find((n) => n.text === 'integration')) throw new Error('Missing note');
    const homepage = await fetch('http://localhost:8080');
    const html = await homepage.text();
    if (!html.includes('Notes Collaboration Suite')) throw new Error('Frontend not served');
    console.log('Integration test passed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
