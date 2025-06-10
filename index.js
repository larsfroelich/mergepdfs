#!/usr/bin/env node

const pkg = require('./package.json');
const updateNotifier = require('update-notifier').default({ pkg });
const fs = require('fs');
const path = require('path');

async function walkRecursive(dir) {
    const entries = await fs.promises.readdir(dir);
    let files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(await walkRecursive(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

if (updateNotifier.update) {
    updateNotifier.notify({ defer: false }); // display plz-update notification message
    setTimeout(() => {
        main().catch(err => console.error(err));
    }, 5000); // start after 5 seconds
} else {
    main().catch(err => console.error(err)); // up to date - start right away
}

async function main() {
    console.log(`v${pkg.version} - coded Nov17 by Lars Froelich\n`);
    console.log('*** Merge-PDFs ***');
    const cwd = process.cwd();

    // configure program-parameters
    const { program } = require('commander');
    program
        .option('-e, --even', 'Add empty pages to PDFs that end on odd pages (useful for manual duplex printing)')
        .parse(process.argv);

    console.log('  - loading dependencies');
    const pdfjs = require('pdfjs');

    console.log('  - loading font');
    const helveticaf = require('pdfjs/font/Helvetica');

    console.log('  - creating output pdf');
    const doc = new pdfjs.Document({ font: helveticaf });

    let totalCount = 0;
    let evenCount = 0;
    console.log('  - adding PDFs');
    try {
        const pdfs = (await walkRecursive(cwd)).filter(f => path.extname(f).toLowerCase() === '.pdf' && path.basename(f) !== 'merged.pdf');
        for (const pdf of pdfs) {
            console.log(`  + adding "${path.basename(pdf)}"  (${pdf})`);
            const file = await fs.promises.readFile(pdf);
            const ext = new pdfjs.ExternalDocument(file);
            doc.addPagesOf(ext);
            totalCount += ext.pageCount;
            if (program.opts().even && (ext.pageCount % 2 === 1)) {
                doc.text(' . '); // some printers don't "skip" this page if it's entirely empty.
                totalCount++;
                evenCount++;
            }
        }
        console.log('  - writing output-file');
        doc.pipe(fs.createWriteStream(`${cwd}/merged.pdf`));
        await doc.end();
        console.log(`\n Finished writing PDF (${totalCount} pages total).\n Merged output is 'merged.pdf'`);
        if (program.opts().even) {
            console.log(` ${evenCount} empty pages have been added to PDFs with odd numbers of pages.`);
        }
    } catch (error) {
        console.error('Unable to search for pdf-files ', error);
    }
}
