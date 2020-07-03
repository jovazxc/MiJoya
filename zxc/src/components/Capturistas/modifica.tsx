import * as React from "react";
import { Input, Modal, Select } from "antd";

interface ModificaState {
    visible: boolean;
    usuario: string;
    usuarioDisabled: boolean;
    nombre: string;
    nombreDisabled: boolean;
    contraseña: string;
    contraseñaDisabled: boolean;
    confirmacion: string;
    confirmacionDisabled: boolean;
	privSelect: number;
}
const Option = Select.Option;
export class Modifica extends React.Component<any, ModificaState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            usuario: '',
            nombre: '',
            contraseña: '',
            confirmacion: '',

            usuarioDisabled: false,
            nombreDisabled: true,
            contraseñaDisabled: true,
            confirmacionDisabled: true,
			privSelect: null
        }

    }

    onCancel = () => {
        this.setState({
            visible: false,
            usuario: '',
            nombre: '',
            contraseña: '',
            confirmacion: '',

            usuarioDisabled: false,
            nombreDisabled: true,
            contraseñaDisabled: true,
            confirmacionDisabled: true
        })
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

        fetch('/usuarios/modificar', ops).then((r) => r.text()).then((results) => {
            Modal.info({content: 'Capturista modificado correctamente'});

            this.setState({
                visible: false,
				usuario: '',
				nombre: '',
				contraseña: '',
				confirmacion: '',

				usuarioDisabled: false,
				nombreDisabled: true,
				contraseñaDisabled: true,
				confirmacionDisabled: true,
				privSelect: null
            })
        })
    }

    mostrar = () => this.setState({visible: true});


    usuarioCambio = (e:any) => this.setState({usuario: e.target.value});
    nombreCambio = (e:any) => this.setState({nombre: e.target.value});
    contraseñaCambio = (e:any) => this.setState({contraseña: e.target.value});
    confirmacionCambio = (e:any) => this.setState({confirmacion: e.target.value});

    usuarioBlur = () => {

    }
  selectCambio = (e:any) => this.setState({privSelect: e})
    

    consultarUsuario = () => {
        fetch(`/usuarios/obtener?usuario=${this.state.usuario}&detalles=1`).then((r) => r.json()).then((emp:any) => {
           
           console.log(emp)
            if(emp.nombre) {
                this.setState({
                    nombre: emp.nombre,
                    contraseña: emp.contraseña,
                    confirmacion: emp.contraseña,
                    usuarioDisabled: true,
                    nombreDisabled: false,
                    contraseñaDisabled: false,
                    confirmacionDisabled: false,
					privSelect: emp.privilegios
                })
            } else {
                Modal.warning({content: 'Nombre de usuario no valido'});
            }
        })
    }
    render() {
        return (
            <Modal
               visible={this.state.visible}
               onCancel={this.onCancel}
               onOk={this.onOk}
               title="Modificar capturista">

                   <span style={{fontWeight: 'bold'}}>Usuario</span>
                   <Input 
                       onBlur={this.consultarUsuario} 
                       onPressEnter={this.consultarUsuario}
                       onChange={this.usuarioCambio} value={this.state.usuario} disabled={this.state.usuarioDisabled}/>
                   
                   <span style={{fontWeight: 'bold'}}>Nombre</span>
                   <Input onChange={this.nombreCambio} value={this.state.nombre} disabled={this.state.nombreDisabled} />
                   
                   <span style={{fontWeight: 'bold'}}>Contraseña</span>
                   <Input onChange={this.contraseñaCambio} value={this.state.contraseña} type="password" disabled={this.state.contraseñaDisabled}/>
                   
                   <span style={{fontWeight: 'bold'}}>Confirmar contraseña</span>
                   <Input onChange={this.confirmacionCambio} value={this.state.confirmacion}  type="password" disabled={this.state.confirmacionDisabled}/>
                
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
