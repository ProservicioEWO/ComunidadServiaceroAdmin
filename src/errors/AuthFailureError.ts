class AuthFailureError extends Error{
  override name: string 
  constructor() {
    super("No se poseen los permisos para acceder a este recurso.")
    this.name = 'AuthFailureError'
  }
}

export default AuthFailureError