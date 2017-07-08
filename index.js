#!/usr/bin/env node
console.log("*** Merge-PDFs ***");
console.log(" - loading dependencies");
const pdf = require('pdfjs');
const fs = require("fs");

console.log(" - loading font");
console.log(__dirname);
var helvetica = fs.readFileSync(__dirname + '/Helvetica.json');
helvetica = JSON.parse(helvetica);
var helveticaf = new pdf.Font(helvetica);

console.log(" - loading pdfs");
var pdf1 = fs.readFileSync(__dirname + '/pdf1.pdf');
var pdf2 = fs.readFileSync(__dirname + '/pdf2.pdf');
var ext1 =  new pdf.ExternalDocument(pdf1);
var ext2 =  new pdf.ExternalDocument(pdf2);

console.log(" - creating output pdf");
var doc = new pdf.Document({font: helveticaf});

console.log(" - adding pdfs to output pdf");
doc.addPagesOf(ext1);
doc.addPagesOf(ext2);

console.log(" - write output to file");
doc.pipe(fs.createWriteStream('output.pdf'))
doc.end();