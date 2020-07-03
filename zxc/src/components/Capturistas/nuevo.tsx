import * as React from "react";
import { Input, Button, Modal, Select } from "antd";

interface NuevoState {
    visible: boolean;
    usuario: string;
    nombre: string;
    contraseña: string;
    confirmacion: string;
	privSelect: number;
}
const Option = Select.Option;

export class Nuevo extends React.Component<any, NuevoState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            usuario: '',
            nombre: '',
            contraseña: '',
            confirmacion: '',
			privSelect: 1
        }

    }

    onCancel = () => {
        this.setState({visible: false})
    }
    onOk = () => {

        if(this.state.usuario == '') {
            Modal.error({content: 'Debes escribir un nombre de usuario'})
            return;
        }
        if(this.state.nombre == '') {
            Modal.error({content: 'Debes escribir el nombre del capturista'})
            return;
        }
        if(this.state.contraseña == '') {
            Modal.error({content: 'Debes escribir una contraseña'})
            return;
        }
        if(this.state.confirmacion == '') {
            Modal.error({content: 'Debes escribir la confirmación de contraseña'})
            return;
        }
        if(this.state.contraseña != this.state.confirmacion) {
            Modal.error({content: 'Las contraseñas no coinciden'});
            return;
        }



        let ops = {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                usuario: this.state.usuario,
                nombre: this.state.nombre,
                contraseña: this.state.contraseña,
				privilegios: this.state.privSelect
            })
        }
        fetch('/usuarios/nuevo', ops).then((r) => r.text()).then((results) => {
            Modal.info({content: 'Capturista registrado correctamente'});

            this.setState({
                visible: false,
                usuario: '',
                nombre: '',
                contraseña: '',
                confirmacion: ''
            })
        })
    }

    mostrar = () => this.setState({visible: true});


    usuarioCambio = (e:any) => this.setState({usuario: e.target.value});
    nombreCambio = (e:any) => this.setState({nombre: e.target.value});
    contraseñaCambio = (e:any) => this.setState({contraseña: e.target.value});
    confirmacionCambio = (e:any) => this.setState({confirmacion: e.target.value});
	
    selectCambio = (e:any) => this.setState({privSelect: e})
    

    render() {
        return (
            <Modal
               visible={this.state.visible}
               onCancel={this.onCancel}
               onOk={this.onOk}
               title="Registrar nuevo capturista">

                   <span style={{fontWeight: 'bold'}}>Usuario</span>
                   <Input onChange={this.usuarioCambio} value={this.state.usuario} />
                   
                   <span style={{fontWeight: 'bold'}}>Nombre</span>
                   <Input onChange={this.nombreCambio} value={this.state.nombre} />
                   
                   <span style={{fontWeight: 'bold'}}>Contraseña</span>
                   <Input onChange={this.contraseñaCambio} value={this.state.contraseña}  type="password" />
                   
                   <span style={{fontWeight: 'bold'}}>Confirmar contraseña</span>
                   <Input onChange={this.confirmacionCambio} value={this.state.confirmacion}  type="password" />
                
				   <span style={{fontWeight: 'bold'}}>Privilegios</span>
                   <Select style={{width: '100%'}} value={this.state.privSelect} onChange={this.selectCambio}>
                        <Option value={1}>Capturista</Option>
						<Option value={2}>Moderador</Option>
						<Option value={3}>Administrador</Option>
                   </Select>
				   
				   
            </Modal>
        )
    }
}
