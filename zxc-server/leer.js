var XLSX = require('xlsx');


let libro = XLSX.readFile('auditoria.xlsx');

let c = 0; 
let rows = []
for(let rc in libro.Sheets.ProductosInventario) {
    if(rc[0] === '!') continue;
    if(!rows[rc.substring(1)]) {
		rows[rc.substring(1)] = true;
		c++;
	}
}

for(let i = 2; i<=c; i++) {
	let sku = libro.Sheets.ProductosInventario[`A${i}`].v
	let desc = libro.Sheets.ProductosInventario[`B${i}`].v
	console.log("SKU|", sku, '|', desc)
}