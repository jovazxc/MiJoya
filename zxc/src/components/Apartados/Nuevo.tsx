import * as React from "react";
import { Input, Modal, Button, Card} from "antd";

interface NuevoState {
    visible: boolean;
    nombre: string;
    apartados: Array<any>;
    sku: string;
    cantidad: string;
}
interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

export class Nuevo extends React.Component<any, NuevoState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            nombre: '',
            apartados: new Array<any>(),
            sku: '',
            cantidad: ''
        }

    }

    onCancel = () => {
        this.setState({
            visible: false,
            nombre: '',
            apartados: new Array<any>(),
            sku: '',
            cantidad: ''
        })
    }
    onOk = () => {

        if(this.state.nombre == '') {
            Modal.error({content: 'Debes escribir un nombre de apartado'})
            return;
        }

        const apartados = this.state.apartados;

        let productos = []
        
        for(let i = 0; i<apartados.length; i++) {
            productos.push({codigo: apartados[i].sku, cantidad: apartados[i].cantidad});
            console.log(apartados[i]);
        }

        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                nombre: this.state.nombre,
                productos: productos
            })
        }

        console.log(productos, apartados);
        fetch('/apartados/nuevo', ops).then((r) => r.text()).then((results) => {
            Modal.info({content: 'Apartado registrado correctamente'});

            this.setState({
                visible: false,
                nombre: '',
                apartados: new Array<any>(),
                sku: '',
                cantidad: ''
            })
        })
    }

    mostrar = () => {
        this.setState({visible: true});
        console.log(this.state.apartados.length);
    }


    nombreCambio = (e:any) => this.setState({nombre: e.target.value});
    skuCambio = (e:any) => this.setState({sku: e.target.value});
    cantidadCambio = (e:any) => this.setState({cantidad: e.target.value});
    
    skuEnter = () => {
        this.cantidad.focus();
    }
    cantEnter = () => {

        if(this.state.sku == '' || this.state.cantidad == '') return;

        fetch(`/productos/descripcion?codigo=${this.state.sku}`).then((r) => r.json()).then((producto)=>{
            
            if(producto.codigo) {
                const apartados = Array.from(this.state.apartados);

                apartados.push({
                    sku: producto.codigo,
                    descripcion: producto.desc,
                    cantidad: this.state.cantidad
                });

                this.setState({apartados: apartados}, () => console.log(this.state.apartados.length));
            }
            this.setState({sku: '', cantidad: ''})
            this.sku.focus();
            
        });
    }
    render() {
        return (
            <Modal
                visible={this.state.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
                title="Registrar nuevo apartado">

                    <span style={{fontWeight: 'bold'}}>Nombre</span>
                    <Input onChange={this.nombreCambio} value={this.state.nombre} />

                    <div style={{marginBottom: 20}}/>

                    <Card title="Agregar Artículos" size="small" extra={[
                        <Button size="small" type="primary" key="aggBtn">AGREGAR</Button> 
                    ]}>

                    <table>
                        <tbody>

                            <tr>
                                <td><span style={{fontWeight: 'bold', fontSize: 12}}>SKU</span></td>
                                <td><Input onPressEnter={this.skuEnter} ref={(inp) => this.sku = inp} value={this.state.sku} onChange={this.skuCambio} size="small" style={{width: 220}} placeholder='SKU' /></td>
                            </tr>

                        
                            <tr>
                                <td><span style={{fontWeight: 'bold', fontSize: 12}}>CANTIDAD</span></td>
                                <td><Input onPressEnter={this.cantEnter} ref={(inp) => this.cantidad = inp} value={this.state.cantidad} onChange={this.cantidadCambio} size="small" style={{width: 170}} placeholder='CANTIDAD' /></td>
                            </tr>
                        </tbody>

                                        
                    </table>
                    </Card>
                    <div style={{marginBottom: 20}}/>

                    <Card size="small" title="Artículos">
                    <table className="detalleApartado" style={{width: '100%'}}>
                        <thead>
                            <tr><th>SKU</th><th>CANTIDAD</th><th>DESCRIPCIÓN</th></tr>
                        </thead>
                        <tbody>
                            {
                                this.state.apartados.map(
                                    (a: any) => <tr key={a.sku + "F"}>
                                        <td>{a.sku}</td>
                                        <td>{a.cantidad}</td>
                                        <td>{a.descripcion}</td>
                                    </tr>
                                )
                            }
                        </tbody>

                    </table>
                    </Card>
                   
                   

            </Modal>
        )
    }
}
