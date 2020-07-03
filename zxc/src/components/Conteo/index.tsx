import * as React from "react";
import * as moment from "moment";

import {Input, Button, Select, Checkbox, Collapse, Icon, Modal} from "antd";
const Option = Select.Option;
const Panel = Collapse.Panel;

interface MainState {
    sku: string;
    catSelect: string;
    productos: Array<any>;
    categorias: Array<any>;
    parcialChecked: boolean;
    horainicio: any;
	cant: string;
}
interface Props {
    empleado: string;
	onClose: any;
	k: any;
}
interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

export class Conteo extends React.Component<Props, MainState> {

    constructor(props: any) {
        super(props);

        this.state = {
            sku: '',
            catSelect: '',
            productos: new Array<any>(),
            categorias: new Array<any>(),
            parcialChecked: false,
            horainicio: Date.now(),
			cant: '1'
        };
    }

    componentDidMount () {
        fetch('/categorias/obtener').then((r) => r.json()).then((cats) => {
            this.setState({categorias: cats});
        })
    }
   
    
    skuCambio = (e: any) => this.setState({sku: e.target.value});
	cantCambio = (e: any) => this.setState({cant: e.target.value});
	
    agregar = () => {
		
		
        fetch(`/productos/descripcion?codigo=${this.state.sku.toUpperCase()}`).then((r) => r.json()).then((producto)=>{
            if(producto.codigo) {
				
                const productos = Array.from(this.state.productos);
                let e:boolean = false;
				let cant = this.state.cant == '' ? 1 : parseInt(this.state.cant);
				
				if(isNaN(cant)) cant = 1;
				
                for(let i = 0; i<productos.length; i++) {
                    if(productos[i].sku == producto.codigo) {
                        productos[i].cantidad += cant;
                        e = true;
                    }
                }

                if(!e) productos.push({sku: producto.codigo, descripcion: producto.desc, cantidad: cant});
                this.setState({productos: productos});
            }
            this.setState({sku: '', cant: 1})
            
        });


    }

    selectCambio = (e:string) => this.setState({catSelect: e});
    parcialCambio = (e:boolean) => this.setState({parcialChecked: e.target.checked});



    guardar = () => {
		
		if(!this.state.parcialChecked) {			
			if(this.state.catSelect == '')
			{
				Modal.error({title: 'Conteo', content: 'No seleccionaste ninguna categoria'});
				return;
			}
		}
        if(this.state.productos.length == 0) {
			Modal.error({title: 'Conteo', content: 'Agrega minimo un producto al conteo'});
			return;
		}
		
		
        let productos:any = [];
        const prod = Array.from(this.state.productos)
		
		for(let i = 0; i<prod.length; i++) {
            productos.push({sku: prod[i].sku, cantidad: prod[i].cantidad});
        }
		
		let body = {
			horainicio: this.state.horainicio,
			horafinal: Date.now(),
			productos: productos,
			usuario: this.props.empleado
		}
		
		if(!this.state.parcialChecked) body.categoria = this.state.catSelect;
		
		
        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify(body)
        }

        fetch('/conteo/nuevo', ops).then((r) => r.text()).then((results) => {
			Modal.info({title: 'Conteo', content: 'Conteo registrado'});
			this.props.onClose(this.props.k);
        });
           
    }
	eliminar = (sku) => {
		
		let prod = Array.from(this.state.productos);
		
		for(let i = 0; i<prod.length; i++) {
			if(prod[i].sku == sku) {
				prod.splice(i, 1);
				break;
			}
			
		}
	
		this.setState({productos: prod});
	}
	
	

	
    render() {
        return (
            <div>
                <Collapse >
                <Panel key="pnl1" header={[<span key="span1"> <Icon type="setting" spin /> Opciones</span>]} size="small">
                    <Checkbox checked={this.state.parcialChecked} onChange={this.parcialCambio}>CONTEO PARCIAL</Checkbox>
                    
                    <span style={{fontWeight: 'bold', display: 'block'}}>Categoría</span>
                    <Select style={{width: '100%'}}  value={this.state.catSelect} onChange={this.selectCambio} disabled={this.state.parcialChecked}>
                    {
                        this.state.categorias.map((categoria:any) => 
                            <Option value={categoria.nombre} key={categoria.nombre}>{categoria.nombre}</Option>
                        )
                    }
                    </Select>
                </Panel>
                    
                </Collapse>

                <div >
                    
                    <div style={{width: 400}}>
						<Input style={{width: '20%'}} onPressEnter={this.asd} size="small" value={this.state.cant} onChange={this.cantCambio}  placeholder="CANT." />
                        <Input style={{width: '60%'}} onPressEnter={this.agregar} size="small" value={this.state.sku} onChange={this.skuCambio} placeholder="SKU"/>
						<Button style={{width: '20%'}}key="bt1" size="small" onClick={this.agregar}>AGREGAR</Button>
					</div>
                    
                   
                    
                </div>

                
                <table className="detalleApartado" style={{width: '100%'}}>
                    <thead>
                        <tr><th><Icon type="delete" /></th><th>SKU</th><th>CANTIDAD</th><th>DESCRIPCIÓN</th></tr>
                    </thead>
                    <tbody>
                        {
                            this.state.productos.map(
						(a: any) => <tr style={{background: 'white'}}key={a.sku + "FXS"}>
                                    <td><a href="#" onClick={() => this.eliminar(a.sku)}><Icon type="delete" /></a></td>
									<td>{a.sku}</td>
                                    <td>{a.cantidad}</td>
                                    <td>{a.descripcion}</td>
									
                                </tr>
                            )
                        }
                    </tbody>
                </table>   
                <Button onClick={this.guardar} type="primary" size="small"><Icon type="save" /> Guardar</Button>
             
            </div>
        )
    }
}