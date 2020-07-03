import {MongoClient,  ObjectId} from 'mongodb';
import { Db } from 'mongodb';
import * as XLSX from 'xlsx';


export class Conteo {
    private app
    private db:Db

    constructor(expressApp: Express.Application, database: Db) {
        this.app = expressApp;
        this.db = database;

        this.mountRoutes();
		
		
		
		
    }
    nuevo = (req, res) => {
        let conteos = this.db.collection('conteos');

        let cont = {
			activo: true,
            usuario: req.body.usuario,
            horainicio: new Date(req.body.horainicio),
            horafinal: new Date(req.body.horafinal),
            productos: req.body.productos,
            categoria: null
        }

        if(req.body.categoria)
            cont.categoria = req.body.categoria;

        conteos.insertOne(cont);
        res.sendStatus(200);
    }
	
	desactivar = (req, res) => {
	
		let conteos = this.db.collection('conteos');
		conteos.updateOne({_id: new ObjectId(req.body.id)}, { $set : {
			activo: false
		}})
		
        res.send("Desactivado");

	}
	obtener = (req:any, res) => {
		
		
		let matchOps = {
		}
		
		matchOps.activo = true;
		
		if(req.query.categoria) matchOps.categoria = req.query.categoria;
		else if(req.query.parcial) matchOps.categoria = null
		
		if(req.query.empleado) matchOps.nombre = req.query.empleado;
		
		let lookup = {
			from: 'usuarios',
			localField: 'usuario',
			foreignField: 'usuario',
			as: 'usuarioDetails'
		}
		
		let project = {
			categoria: true,
			horafinal: true,
			horainicio: true,
			activo: true,
			nombre: { $arrayElemAt: ["$usuarioDetails.nombre", 0]}	
		}
		
		let sort = {
			horainicio: -1
		}
		
		this.db.collection('conteos').aggregate([
			{ "$lookup": lookup }, 
			{ "$project" : project},
			{ "$match": matchOps },
			{ "$sort": sort}
		]).toArray((err, docs) => {
			res.send(JSON.stringify(docs));
		});
		
	}
	
	exportar = (req, res) => {
		
		this.db.collection('conteos').aggregate([
		{ "$match": {
			_id: new ObjectId(req.query.id)
		}},
		{ "$lookup": {
			from: 'productos',
			localField: 'productos.sku',
			foreignField: 'codigo',
			as: 'p'
		  }
		}]).toArray((err, docs) => {
		    
			if(docs[0].categoria != null) {
				
				let prod = this.db.collection('productos');
				
				prod.find({categoria: docs[0].p[0].categoria}).toArray((err, prodcat) => {
					
					for(let i = 0; i<prodcat.length; i++) {
						
						let f = false;
						for(let d = 0; d<docs[0].productos.length; d++) {
							if(prodcat[i].codigo.toString() == docs[0].productos[d].sku.toString()) {
								prodcat[i].cantidad = docs[0].productos[d].cantidad;
								f = true;
								break;
							}
						}
						if(!f) prodcat[i].cantidad = 0;
					}
					
					let wb = {
						SSF: XLSX.SSF.get_table(),
						SheetNames: ["Productos"],
						Sheets: {
							Productos: {}
						}
					}
					wb.Sheets.Productos['A1'] = { v: 'SKU', t: 's' }
					wb.Sheets.Productos['B1'] = { v: 'NOMBRE_PRODUCTO', t: 's' }
					wb.Sheets.Productos['C1'] = { v: 'EXISTENCIA_FISICA', t: 's' }

					for(let i = 0; i<prodcat.length; i++) {
						wb.Sheets.Productos[`A${i+2}`] = { v: '' + prodcat[i].codigo, t: 's' };
						wb.Sheets.Productos[`B${i+2}`] = { v: '' + prodcat[i].desc, t: 's' };
						wb.Sheets.Productos[`C${i+2}`] = { v: '' + prodcat[i].cantidad, t: 's' };
					}
					let file = `xlsx/${req.query.id}.xlsx`
					wb.Sheets.Productos['!ref'] = `A1:C${prodcat.length+1}`;
					XLSX.writeFile(wb, file, {bookSST:true});
 
					res.download(file); 
				});
			}
			else {

				
				for(let d = 0; d<docs[0].productos.length; d++) {
					for(let i = 0; i<docs[0].p.length; i++) {
						if(docs[0].productos[d].sku == docs[0].p[i].codigo) {
							docs[0].productos[d].desc = docs[0].p[i].desc
						}
					}
				}
				
				let wb = {
						SSF: XLSX.SSF.get_table(),
						SheetNames: ["Productos"],
						Sheets: {
							Productos: {}
						}
					}
					wb.Sheets.Productos['A1'] = { v: 'SKU', t: 's' }
					wb.Sheets.Productos['B1'] = { v: 'NOMBRE_PRODUCTO', t: 's' }
					wb.Sheets.Productos['C1'] = { v: 'EXISTENCIA_FISICA', t: 's' }

					for(let i = 0; i<docs[0].productos.length; i++) {
						wb.Sheets.Productos[`A${i+2}`] = { v: '' + docs[0].productos[i].sku, t: 's' };
						wb.Sheets.Productos[`B${i+2}`] = { v: '' + docs[0].productos[i].desc, t: 's' };
						wb.Sheets.Productos[`C${i+2}`] = { v: '' + docs[0].productos[i].cantidad, t: 's' };
						
					}

				
					
					let file = `xlsx/${req.query.id}.xlsx`
					wb.Sheets.Productos['!ref'] = `A1:C${docs[0].productos.length+1}`;
					XLSX.writeFile(wb, file, {bookSST:true});
 
					res.download(file); 
			}
		});

	}


    mountRoutes = () => {
		this.app.post('/conteo/nuevo', this.nuevo.bind(this))
		this.app.post('/conteo/desactivar', this.desactivar.bind(this));
		
		this.app.get('/conteo/obtener', this.obtener.bind(this));
		this.app.get('/conteo/exportar', this.exportar.bind(this));
		
		
    }

}