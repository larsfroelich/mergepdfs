const test = require('node:test');
const assert = require('node:assert').strict;
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const pdfjs = require('pdfjs');
const font = require('pdfjs/font/Helvetica');

async function createPdf(filePath, pageCount) {
  const doc = new pdfjs.Document({ font });
  for (let i = 0; i < pageCount; i++) {
    doc.text(`file ${path.basename(filePath)} page ${i+1}`);
    if (i < pageCount - 1) doc.pageBreak();
  }
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  await doc.end();
  await new Promise(resolve => stream.on('finish', resolve));
}

async function runCli(dir, args = []) {
  await new Promise((resolve, reject) => {
    execFile('node', [path.join(__dirname, '..', 'index.js'), ...args], { cwd: dir }, (err, stdout, stderr) => {
      if (err) {
        console.error('stdout:', stdout);
        console.error('stderr:', stderr);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

test('merges pdf files', async () => {
  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'mergepdfs-'));
  const f1 = path.join(tmp, 'one.pdf');
  const f2 = path.join(tmp, 'two.pdf');
  await createPdf(f1, 1);
  await createPdf(f2, 2);

  await runCli(tmp);

  const merged = fs.readFileSync(path.join(tmp, 'merged.pdf'));
  const ext = new pdfjs.ExternalDocument(merged);
  assert.equal(ext.pageCount, 3);
});

test('adds blank pages with --even', async () => {
  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'mergepdfs-even-'));
  const f1 = path.join(tmp, 'odd.pdf');
  const f2 = path.join(tmp, 'two.pdf');
  await createPdf(f1, 1);
  await createPdf(f2, 2);

  await runCli(tmp, ['--even']);

  const merged = fs.readFileSync(path.join(tmp, 'merged.pdf'));
  const ext = new pdfjs.ExternalDocument(merged);
  assert.equal(ext.pageCount, 4);
});

test('respects --output option', async () => {
  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'mergepdfs-output-'));
  const f1 = path.join(tmp, 'one.pdf');
  const sub = path.join(tmp, 'sub');
  await fsp.mkdir(sub);
  const f2 = path.join(sub, 'two.pdf');
  await createPdf(f1, 1);
  await createPdf(f2, 1);

  const outFile = path.join(tmp, 'combined.pdf');
  await runCli(tmp, ['--output', outFile]);

  const merged = fs.readFileSync(outFile);
  const ext = new pdfjs.ExternalDocument(merged);
  assert.equal(ext.pageCount, 2);
});
