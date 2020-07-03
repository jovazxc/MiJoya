import * as React from "react";
import { Input, Button, Modal } from "antd";

export interface Empleado {
    nombre: string;
    usuario: string;
	privilegios: number;
}
export interface Props {
    loginSuccess: (empleado: Empleado) => void;
}
export interface MainState {
    usuario: string;
    contraseña: string;
}

export class Login extends React.Component<Props, MainState> {

    constructor(props: any) {
        super(props);
        this.state = {
            usuario: '',
            contraseña: ''
        };
    }
    cancelarClick = () => {
        this.setState({ usuario: '', contraseña: '' });
    }

    ingresarClick = () => {


        let ops = {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify({usuario: this.state.usuario, contraseña: this.state.contraseña})
		}


        fetch('/usuarios/comprobar', ops).then(r => r.json()).then((res) => {

            if(res.nombre) {
                const c = Modal.info({title: `Bienvenido ${res.nombre}`})
                let emp = {} as Empleado;
                emp.nombre = res.nombre;
                emp.usuario = this.state.usuario;
				emp.privilegios = res.privilegios;
                
                this.props.loginSuccess(emp);
            } else {
                Modal.error({title: `Usuario o contraseña incorrectos`})
            }
           

            
        });
        
    }

    usuarioCambio = (e: any) => this.setState({usuario: e.target.value});
    contraseñaCambio = (e: any) => this.setState({contraseña: e.target.value});

    render() {
        return (
            <div className="login-form">

                <span className="login-header">INICIAR SESIÓN</span>
                <span style={{fontWeight: 'bold'}}>Usuario</span>
                <Input value={this.state.usuario} onChange={this.usuarioCambio}></Input>

                <span style={{fontWeight: 'bold'}}>Contraseña</span>
                <Input value={this.state.contraseña} onChange={this.contraseñaCambio} type="password"></Input>
            
                <Button type="primary" onClick={this.ingresarClick}>Ingresar</Button>
                <Button type="danger" onClick={this.cancelarClick}>Cancelar</Button>
            </div>
        );
    }   
}
