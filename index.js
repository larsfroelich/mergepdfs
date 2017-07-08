#!/usr/bin/env node
console.log("*** Merge-PDFs ***");
const cwd = process.cwd();

console.log("  - loading dependencies");
const pdfjs = require('pdfjs');
const fs = require("fs");
const readdir = require("recursive-readdir")

console.log("  - loading font");
var helvetica = fs.readFileSync(__dirname + '/Helvetica.json');
helvetica = JSON.parse(helvetica);
var helveticaf = new pdfjs.Font(helvetica);

console.log("  - creating output pdf");
var doc = new pdfjs.Document({font: helveticaf});

console.log("  - adding PDFs");
readdir(cwd, ["!*.pdf"]).then( // get all pdf-files
    function(pdfs) {
        pdfs.forEach(function(pdf){
            console.log("  + adding \"" + pdf.replace(/^.*[\\\/]/, '') + "\"  (" + pdf + ")");
            var file = fs.readFileSync(pdf);
            var ext =  new pdfjs.ExternalDocument(file);
            doc.addPagesOf(ext);
        });
        console.log("  - writing output-file");
        doc.pipe(fs.createWriteStream(cwd + '/mergedpdf.pdf'))
        doc.end().then(function () {
            console.log("\n Finished writing PDF! Merged output is 'mergedpdf.pdf'");
        });
    },
    function(error) {
        console.error("Unable to search for pdf-files ", error);
    }
);
/*var pdf1 = fs.readFileSync(cwd + '/pdf1.pdf');
var pdf2 = fs.readFileSync(cwd + '/pdf2.pdf');
var ext1 =  new pdf.ExternalDocument(pdf1);
var ext2 =  new pdf.ExternalDocument(pdf2);

console.log("  - creating output pdf");
var doc = new pdf.Document({font: helveticaf});
doc.addPagesOf(ext1);
doc.addPagesOf(ext2);
*/