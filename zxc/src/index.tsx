import * as React from "react";
import * as ReactDOM from "react-dom";

import './App.css';

import {Menu, LocaleProvider, Layout, Tabs} from "antd";
import { Login, Empleado } from "./components/Login/";
import {Capturistas} from "./components/Capturistas/";
import {Categorias} from "./components/Categorias/";
import {Apartados} from "./components/Apartados/";
import {Conteo} from "./components/Conteo/";
import {Consultar} from "./components/Conteo/Consultar"
import {Comparar} from "./components/Conteo/Comparar" 

import esES from "antd/lib/locale-provider/es_ES";

const { Header, Content, Footer } = Layout;


interface MainState {
    usuarioIdentificado: boolean;
    nombreUsuario: string;
    tabs: any;
    activeKey: number;
    usuario: string;
	privilegios: number;
}
interface ArrayConstructor {
	from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

class App extends React.Component<any, MainState> {

    constructor(props: any) {
        super(props);

        this.state = {
            usuarioIdentificado: false,
            nombreUsuario: '',
            activeKey: 0,
            usuario: '',
            tabs: [],
			privilegios: 0
        }
    }
    tabsKeys = 0
    capturistas: Capturistas
    categorias: Categorias
    apartados: Apartados

    onLogin = (empleado: Empleado) => {
        this.setState({usuarioIdentificado: true, nombreUsuario: empleado.nombre, usuario: empleado.usuario, privilegios: empleado.privilegios});
    }

    onMenuClick = (e: any) => {

        let m = e.key.split(':')[0]
        let o = e.key.split(':')[1]

        if(m == 'conteos') {
            if(o == 'nuevo') {
                const t = Array.from(this.state.tabs);

				t.push({componente: <Conteo k={this.tabsKeys} onClose={this.pestañaExit} empleado={this.state.usuario} />, titulo: 'CONTEO', key: this.tabsKeys })
				
                this.setState({tabs: t, activeKey: this.tabsKeys});
                this.tabsKeys++;
            } else if(o == 'consultar') {
				const t = Array.from(this.state.tabs);

				t.push({componente: <Consultar k={this.tabsKeys} onClose={this.pestañaExit} empleado={this.state.usuario} />, titulo: 'Consultar', key: this.tabsKeys })
				
                this.setState({tabs: t, activeKey: this.tabsKeys});
                this.tabsKeys++;
			}
			else if(o == 'comparar') {
				const t = Array.from(this.state.tabs);

				t.push({componente: <Comparar k={this.tabsKeys} onClose={this.pestañaExit} empleado={this.state.usuario} />, titulo: 'Comparar', key: this.tabsKeys })
				
                this.setState({tabs: t, activeKey: this.tabsKeys});
                this.tabsKeys++;
			}
        } else if(m == 'capturista') {
            if(o == 'nuevo') {

                this.capturistas.mostrarNuevo();
                /*let div = document.createElement('div');
                document.body.appendChild(div);

                ReactDOM.render(<Modal title="Hola" visible={true}></Modal>, div);*/
            }
            else if(o == 'modifica') {
                this.capturistas.mostrarModifica();
            }
        }
        else if(m == 'categorias') {
            if(o == 'nueva') this.categorias.mostrarNuevo();
            else if(o == 'modifica') this.categorias.mostrarModifica();
            else if(o == 'importarArticulos') this.categorias.mostrarImporta();
        }
        else if(m == 'apartados') {
            if(o == 'nuevo') this.apartados.mostrarNuevo();
            else if(o == 'concluir') {
				this.apartados.mostrarConcluir();
            }
        }


    }

	pestañaExit = (k) => {
		let tabs = Array.from(this.state.tabs);
		for(let i = 0; i<tabs.length; i++) {
			if(tabs[i].key == k) {
				tabs.splice(i, 1);
				break;
			}
		}
		this.setState({tabs: tabs})
	}
	
	onChangeTab = (activeKey) => {
		console.log(activeKey);
		this.setState({activeKey});
	}


    onEdit = (targetKey, action) => {
		if(action === 'remove')
		{
			let tabs = Array.from(this.state.tabs);
			for(let i = 0; i<tabs.length; i++) {
				if(tabs[i].key == targetKey) {
					tabs.splice(i, 1);
					break;
				}
			}

			this.setState({tabs: tabs, activeKey: tabs.length > 0 ? tabs[tabs.length-1].key: ''})
		}
	}



    public render() {
      return (
        <LocaleProvider locale={esES}>
        <Layout style={{height: '100vh'}}>
            {
                (this.state.usuarioIdentificado == false) ?
                <Login loginSuccess={this.onLogin} />
                :
                <div>
                    <Header>
                        <Menu onClick={this.onMenuClick} selectable={false} theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
                            <Menu.SubMenu title={<span className="verde">{this.state.nombreUsuario}</span>}></Menu.SubMenu>

                            <Menu.SubMenu title="Conteos">
                                {this.state.privilegios >= 1 ? <Menu.Item key="conteos:nuevo">Nuevo</Menu.Item> : null}
                                {this.state.privilegios >= 2 ? <Menu.Item key="conteos:consultar">Consultar</Menu.Item> : null}
								{this.state.privilegios >= 2 ? <Menu.Item key="conteos:comparar">Comparar</Menu.Item> : null}
								
                            </Menu.SubMenu>

                            {this.state.privilegios >= 3 ? <Menu.SubMenu title="Capturistas">
                                <Menu.Item key="capturista:nuevo">Nuevo</Menu.Item>
                                <Menu.Item key="capturista:modifica">Modificar</Menu.Item>
                            </Menu.SubMenu> : null}

							{this.state.privilegios >= 2 ? <Menu.SubMenu title="Categorias">
                                <Menu.Item key="categorias:nueva">Nueva</Menu.Item>
                                <Menu.Item key="categorias:modifica">Modificar</Menu.Item>
                                <Menu.Item key="categorias:importarArticulos">Importar Artículos</Menu.Item>
							</Menu.SubMenu> : null}

							{this.state.privilegios >= 2 ? <Menu.SubMenu title="Apartados">
                                <Menu.Item key="apartados:nuevo">Nuevo</Menu.Item>
                                <Menu.Item key="apartados:concluir">Concluir</Menu.Item>
							</Menu.SubMenu> : null }
							
                        </Menu>
                    </Header>

                    <Content>
                        <Capturistas ref={ (input:Capturistas) => this.capturistas = input} />
                        <Categorias ref={ (input:Categorias) => this.categorias = input} />
                        <Apartados ref={ (input:Apartados) => this.apartados = input} />


                        <Tabs hideAdd type="editable-card" onChange={this.onChangeTab} onEdit={this.onEdit} activeKey={this.state.activeKey.toString()}>
							{
								this.state.tabs.map( (tab: any) => {
									return <Tabs.TabPane tab={tab.titulo} key={tab.key} closable>{tab.componente}</Tabs.TabPane>
								})
							}
						</Tabs>

                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        Control de Inventarios por Jovanny Rochín &copy; 2019
                    </Footer>
                </div>
            }
            
            
        </Layout>        
        </LocaleProvider>
        
      );
    }
  }  

ReactDOM.render(
    <App/>, document.getElementById("app")
);