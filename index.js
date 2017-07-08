const pdf = require('pdfjs');
const fs = require("fs");

var helvetica = fs.readFileSync(__dirname + '/Helvetica.json');
helvetica = JSON.parse(helvetica);
var helveticaf = new pdf.Font(helvetica);

var doc = new pdf.Document({font: helveticaf});

var pdf1 = fs.readFileSync(__dirname + '/pdf1.pdf');
var pdf2 = fs.readFileSync(__dirname + '/pdf2.pdf');
var ext1 =  new pdf.ExternalDocument(pdf1);
var ext2 =  new pdf.ExternalDocument(pdf2);

doc.addPagesOf(ext1);
doc.addPagesOf(ext2);

doc.pipe(fs.createWriteStream('output.pdf'))
doc.end();