import * as React from "react";

import {Nuevo} from "./nuevo"
import {Concluir} from "./concluir"


export class Apartados extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            nuevo_visible: false
        };
    }

    nuevo:any
    concluir:any
    
    mostrarNuevo = () => {
        this.nuevo.mostrar();
    }

    mostrarConcluir = () => {
        this.concluir.mostrar();
    }

    


    render() {
        return (
            <div>
                <Nuevo ref={(input) => this.nuevo = input} />
				<Concluir ref={(input) => this.concluir = input} />
                
            </div>
        )
    }
}