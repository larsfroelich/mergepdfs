#!/usr/bin/env node
console.log("*** Merge-PDFs ***");
const cwd = process.cwd();

// configure program-parameters
var program = require('commander')
    .option('-e, --even', 'Add empty pages to PDFs that end on odd pages (useful for manual duplex printing)')
    .parse(process.argv);

console.log("  - loading dependencies");
const pdfjs = require('pdfjs');
const fs = require("fs");
const readdir = require("recursive-readdir");

console.log("  - loading font");
var helvetica = fs.readFileSync(__dirname + '/Helvetica.json');
helvetica = JSON.parse(helvetica);
var helveticaf = new pdfjs.Font(helvetica);

console.log("  - creating output pdf");
var doc = new pdfjs.Document({font: helveticaf});

var totalCount = 0;
var evenCount = 0;
console.log("  - adding PDFs");
readdir(cwd, ["!*.pdf", "merged.pdf"]).then( // get all pdf-files except previous merges
    function(pdfs) {
        pdfs.forEach(function(pdf){
            console.log("  + adding \"" + pdf.replace(/^.*[\\\/]/, '') + "\"  (" + pdf + ")");
            var file = fs.readFileSync(pdf);
            var ext =  new pdfjs.ExternalDocument(file);
            doc.addPagesOf(ext);
            totalCount += ext.pageCount;
            if(program.even && (ext.pageCount % 2 === 1)){
                doc.text(' . '); // some printers don't "skip" this page if it's entirely empty.
                totalCount ++;
                evenCount ++;
            }
        });
        console.log("  - writing output-file");
        doc.pipe(fs.createWriteStream(cwd + '/merged.pdf'));
        doc.end().then(function () {
            console.log("\n Finished writing PDF (" + totalCount + " pages total).\n Merged output is 'merged.pdf'");
            if(program.even){
                console.log(" " + evenCount + " empty pages have been added to PDFs with odd numbers of pages.");
            }
        });
    },
    function(error) {
        console.error("Unable to search for pdf-files ", error);
    }
);