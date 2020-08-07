import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getData, postData, borrarDesdeLS } from "../fetchFunctions";

class NuevoPastillero extends React.Component {
  state: {};

  dosis1Ref = React.createRef();
  dosis2Ref = React.createRef();
  dosis3Ref = React.createRef();
  dosis4Ref = React.createRef();
  dosis5Ref = React.createRef();
  dosis6Ref = React.createRef();

  crearPastillero = () => (event) => {
    event.preventDefault();
    var dosisEnviar = [];

    // Recorre los campos y agrega las dosis que va encontrando
    if (this.dosis1Ref.current.value) {
      dosisEnviar.push({ horario: this.dosis1Ref.current.value });
    }
    if (this.dosis2Ref.current && this.dosis2Ref.current.value) {
      dosisEnviar.push(
        JSON.stringify({ horario: this.dosis2Ref.current.value })
      );
    }
    if (this.dosis3Ref.current && this.dosis3Ref.current.value) {
      dosisEnviar.push(
        JSON.stringify({ horario: this.dosis3Ref.current.value })
      );
    }
    if (this.dosis4Ref.current && this.dosis4Ref.current.value) {
      dosisEnviar.push(
        JSON.stringify({ horario: this.dosis4Ref.current.value })
      );
    }
    if (this.dosis5Ref.current && this.dosis5Ref.current.value) {
      dosisEnviar.push(
        JSON.stringify({ horario: this.dosis5Ref.current.value })
      );
    }
    if (this.dosis6Ref.current && this.dosis6Ref.current.value) {
      dosisEnviar.push(
        JSON.stringify({ horario: this.dosis6Ref.current.value })
      );
    }

    // Verifica que haya algo en el array
    if (!dosisEnviar.length) {
      alert(
        "Debes especificar al menos un horario de toma para tu pastillero."
      );
    } else {
      // Si llega acá es porque hay dosis ingresadas
      // Enciende el loader
      this.setState({
        loader: { encendido: true, texto: "Generando tu pastillero." },
      });
      // Arma los datos para enviar
      var data = { dia_actualizacion: 1, dosis: dosisEnviar };
      postData("pastillero", data)
        .then((response) => {
          if (response.status == 201) {
            this.props.history.push("home");
          } else {
            alert("Ocurrió un error, por favor vuelve a ingresar.");
            this.signOut();
          }
        })
        .catch((e) => {
          alert("Ocurrió un error, por favor inténtalo denuevo más tarde.");
          this.setState({
            loader: { encendido: false, texto: "Generando tu pastillero." },
          });
          console.log(e);
        });
    }
  };

  // Necesario para que se actualice el componente y
  // aparezcan o desaparezcan los campos
  refrescarState = () => () => {
    this.setState({ state: this.state });
  };

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS("midosis_logintoken");
    this.props.history.push({ pathname: "/login" });
  };

  navegarASeccion = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
  };

  componentDidMount() {
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (this.props.location.state && this.props.location.state.userInfo) {
      // Si se los pasó, los gaurda en state y apaga el loader
      this.setState({
        userInfo: this.props.location.state.userInfo,
        loader: { encendido: false },
      });
    } else {
      // Sino, los va a buscar al servidor
      // Va a buscar los datos del usuario
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Guarda la información del usuario en el state
              // y apaga el loader
              this.setState({
                userInfo: respuesta_usuario,
                loader: { encendido: false },
              });
            });
          } else {
            response_usuario.json().then((respuesta_usuario) => {
              this.signOut();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // prende el loader antes de cargar el componente
  constructor(props) {
    super(props);
    this.state = {
      loader: { encendido: true, texto: "Cargando datos del usuario." },
    };
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.loader.encendido && (
            <div className="loader-container">
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
              <p className={"negrita"}>{this.state.loader.texto}</p>
            </div>
          )}
          {this.state && !this.state.loader.encendido && (
            <>
              <div onClick={this.navegarASeccion("home")}>
                <Header
                  nombreCompleto={
                    this.state.userInfo.nombre +
                    " " +
                    this.state.userInfo.apellido
                  }
                />
              </div>
              <div className="content">
                <p>
                  Aquí podrás crear tu pastillero y empezar a configurarlo. Una
                  vez creado podrás agregar más usuarios para gestionarlo.{" "}
                </p>
                <p>
                  Primero necesitas especificar en qué momentos del día harás
                  las tomas de medicamentos. Puedes especificar hasta 6 y
                  ponerles el nombre que quieras (por ejemplo: desauyno,
                  almuerzo y cena; 9AM, 12PM, 6PM y 9PM; mañana, mediodía,
                  noche; etc.).
                </p>
                <p>Tomas de medicamentos:</p>

                <div className={"login-form"}>
                  <input
                    rows="8"
                    name="toma1"
                    type="text"
                    ref={this.dosis1Ref}
                    className="login-input"
                    onChange={this.refrescarState()}
                  />
                  {((this.dosis1Ref.current && this.dosis1Ref.current.value) ||
                    (this.dosis2Ref.current &&
                      this.dosis2Ref.current.value)) && (
                    <input
                      rows="8"
                      name="toma2"
                      type="text"
                      ref={this.dosis2Ref}
                      className="login-input"
                      onChange={this.refrescarState()}
                    />
                  )}
                  {((this.dosis2Ref.current && this.dosis2Ref.current.value) ||
                    (this.dosis3Ref.current &&
                      this.dosis3Ref.current.value)) && (
                    <input
                      rows="8"
                      name="toma2"
                      type="text"
                      ref={this.dosis3Ref}
                      className="login-input"
                      onChange={this.refrescarState()}
                    />
                  )}
                  {((this.dosis3Ref.current && this.dosis3Ref.current.value) ||
                    (this.dosis4Ref.current &&
                      this.dosis4Ref.current.value)) && (
                    <input
                      rows="8"
                      name="toma2"
                      type="text"
                      ref={this.dosis4Ref}
                      className="login-input"
                      onChange={this.refrescarState()}
                    />
                  )}
                  {((this.dosis4Ref.current && this.dosis4Ref.current.value) ||
                    (this.dosis5Ref.current &&
                      this.dosis5Ref.current.value)) && (
                    <input
                      rows="8"
                      name="toma2"
                      type="text"
                      ref={this.dosis5Ref}
                      className="login-input"
                      onChange={this.refrescarState()}
                    />
                  )}
                  {((this.dosis5Ref.current && this.dosis5Ref.current.value) ||
                    (this.dosis6Ref.current &&
                      this.dosis6Ref.current.value)) && (
                    <input
                      rows="8"
                      name="toma2"
                      type="text"
                      ref={this.dosis6Ref}
                      className="login-input"
                      onChange={this.refrescarState()}
                    />
                  )}
                </div>

                <div className="nav-buttons">
                  <div className="nav-button" onClick={this.crearPastillero()}>
                    <div className="nav-icon nav-icon-check"></div>
                    <span>Crear pastillero</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default NuevoPastillero;