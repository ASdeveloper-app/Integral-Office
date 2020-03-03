import React, { createContext, Component } from 'react'
import { withRouter } from 'react-router-dom'
import AUTH_SERVICE from './services/auth'
// import axios from 'axios'
export const MyContext = createContext()

class MyProvider extends Component {
  state = {
    formSignup: {
      name: '',
      email: '',
      adress: '',
      phone: '', 
      purpose: '',  
      password: ''
    },
    formUpdate: {
      name: '',
      email: '',
      adress: '',
      phone: '', 
      purpose: '',  
      password: ''
    },
    formLogin: {
      email: '',
      password: ''
    },
    loggedUser: null,
    isLogged: false
  }

  handleLogout = async () => {
    await AUTH_SERVICE.LOGOUT()
    this.props.history.push('/')
    this.setState({ loggedUser: null, isLogged: false })
  }
  //Esta función destructura de el estado la form para poder acceder a
  //a sus key value pairs.
  //Destructuramos la key y su valor de element y con . target lo 
  //obtenemos.
  //A formSignUp en su llave name le damos el valor que pasa en value del
  //e.target
  //Se actualiza el estado al final.
  handleSignupInput = e => {
    const { formSignup } = this.state
    const { name, value } = e.target
    formSignup[name] = value
    this.setState({ formSignup })
  }

  handleUpdateInput = e => {
    const a = this.state['formUpdate']
    const key = e.target.name
    a[key] = e.target.value
    this.setState({ formUpdate: a })
    // const { formUpdate } = this.state
    // const { name, value } = e.target
    // formUpdate[name] = value
    // this.setState({ formUpdate })
    console.log('lel')
  }
  //Esta función destructura de el estado la form para poder acceder a
  //a sus key value pairs.
  //Destructuramos la key y su valor de element y con . target lo 
  //obtenemos.
  //A formLogin en su llave name le damos el valor que pasa en value del
  //e.target
  //Se actualiza el estado al final.
  handleLoginInput = e => {
    const { formLogin } = this.state
    const { name, value } = e.target
    formLogin[name] = value
    this.setState({ formLogin })
  }
  //La funcion asincrona recibe un evento; lo primero que hace es evitar la recarga 
  //de pagina con preventDefault. En seguida en una constante llamada form guardamos 
  //el state que actualizamos en la funcion handleSignUpInput. Despues limpiamos la informacion del signup
  //para terminar pasamos nuestra constante form a AUTH_SERVICE para mandar esa info al servidor. 
  handleSignupSubmit = async e => {
    e.preventDefault()
    const form = this.state.formSignup
    this.setState({ formSignup: { name: '', email: '', adress: '', phone: '', purpose:'', password: '' } })
    return await AUTH_SERVICE.SIGNUP(form)
  }

  handleUpdateSubmit = async e => {
    e.preventDefault()
    const form = this.state.formUpdate
    console.log(this.state.formUpdate)
    let newForm = await AUTH_SERVICE.UPDATE(form)
    this.setState({ formUpdate: { name: '', email: '', adress: '', phone: '', purpose:'', password: '' } })
    return newForm
  }

  handleUpdateUser = e=> {
    const {name, value} = e.target
      this.setState(prev => ({
        ...prev,
        loggedUser: {
            ...prev.loggedUser,
            [name]:value
        }
      }))
  }

  handleUpdateUserSubmit = async ()=> {
    console.log(this.state.loggedUser)
    await AUTH_SERVICE.UPDATE(this.state.loggedUser)
    alert('ok')
  }

  handleLoginSubmit = e => {
    e.preventDefault()
    const form = this.state.formLogin
    return AUTH_SERVICE.LOGIN(form)
      .then(({ user }) => {
        this.setState({
          loggedUser: user,
          isLogged: true
        })
        return { user, msg: 'logged' }
      })
      .catch(err => {
        this.setState({
          loggedUser: null,
          isLogged: false,
          formLogin: { email: '', password: '' }
        })
        return { user: null, msg: ' Usuario o contraseña incorrecta.' }
      })
      .finally(() => this.setState({ formLogin: { email: '', password: '' } }))
  }

    uploadPhoto = e => {
      const formPhoto = new FormData()
      formPhoto.append('imgURL', e.target.files[0])
      AUTH_SERVICE.uploadPhoto(formPhoto)
      .then(({ data}) => {
        this.setState({ loggedUser: data.user})
      })
      .catch(err => {
        console.log('entro en el catch')
        return err
      })
    }
  






  render() {
    const {
      state,
      handleSignupInput,
      handleSignupSubmit,
      handleLoginInput,
      handleLoginSubmit,
      handleLogout,
      handleUpdateUser,
      handleUpdateUserSubmit,
      uploadPhoto
    } = this
    return (
      <MyContext.Provider
        value={{
          state,
          handleSignupInput,
          handleSignupSubmit,
          handleLoginInput,
          handleLoginSubmit,
          handleLogout,
          handleUpdateUser,
          handleUpdateUserSubmit,
          uploadPhoto
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}
export default withRouter(MyProvider)