import * as React from "react";
import { Input, Button, Modal } from "antd";

interface NuevoState {
    visible: boolean;
    nombre: string;
}
export class Nuevo extends React.Component<any, NuevoState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            nombre: '',
        }

    }

    onCancel = () => {
        this.setState({visible: false})
    }
    onOk = () => {

        if(this.state.nombre == '') {
            Modal.error({content: 'Debes escribir un nombre de categoría'})
            return;
        }

        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                nombre: this.state.nombre,
            })
        }
        fetch('/categorias/nuevo', ops).then((r) => r.text()).then((results) => {
            Modal.info({content: 'Categoría registrada correctamente'});

            this.setState({
                visible: false,
                nombre: '',
            })
        })
    }

    mostrar = () => this.setState({visible: true});


   nombreCambio = (e:any) => this.setState({nombre: e.target.value});

    render() {
        return (
            <Modal
               visible={this.state.visible}
               onCancel={this.onCancel}
               onOk={this.onOk}
               title="Registrar nueva categoría">
    
                   <span style={{fontWeight: 'bold'}}>Nombre</span>
                   <Input onChange={this.nombreCambio} value={this.state.nombre} />

            </Modal>
        )
    }
}
