import useAppContext from '../hooks/useAppContext'

const Gallery = () => {
  const { users } = useAppContext()
  return (
    <>
      <div>Usuarios</div>
      <div>
        {
          users.state.loading ?
            <span>cargando...</span> :
            <ul>
              {
                users.get?.map(({ id, name, lastname, _lastname, entity, key, type, user, enterprise: { logo } }) => (
                  <li key={id}>
                    <img src={logo} />
                    <span>
                      {id} - {user}, {name} {lastname} {_lastname} ({key}) - {entity} {type}
                    </span>
                  </li>
                ))
              }
            </ul>
        }
      </div>
    </>
  )
}

export default Gallery