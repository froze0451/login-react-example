import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

function Login() {
  const [data, changeData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [signMode, setMode] = useState('autorization')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  /*const [isLoggedIn, setLoggingIn] = useState(false)*/
  // const [isAuthenticated, setAuthentification] = useState(false)
  const url = 'http://localhost:3001/users'

  const style = { backgroundColor: "lightslategrey", border: '0.4vh solid DarkGray', cursor: 'inherit', color: 'Azure' }
  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     const hmm = await fetch(url)
  //     const json = await hmm.json();
  //     const result = await changeData(json)
  //     setIsLoading(false)
  //     console.log(data[0])
  //     return result
  //   }
  //   fetchData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const hello = fetch(url)
  //   .then((res) => res.json())
  //   .then((res) => changeData(res))

  /* good solution below*/
  // useEffect(() => {
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       changeData(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);


  let history = useHistory();

  /*function handleClick() {
    alert('Авторизация успешна. Переходим в личный кабинет')
    history.push("/profile");
  }*/

  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          changeData(data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
    fetchData()
    setIsLoading(false)
  }, [])


  async function addUser() {
    if (name.replace(/\s/g, '') !== '' & surname.replace(/\s/g, '') !== '') {
      let user = {
        id: null,
        name: name.replace(/\s/g, ''),
        surname: surname.replace(/\s/g, '')
      }

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      /* now get fetch and update state, rerender component. add async/await syntax!*/
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          changeData(data)
        })
        .catch((err) => {
          console.log(err)
        })

      setName('')
      setSurname('')
    } else {
      alert('Чтобы зарегистрироваться введите имя и фамилию')
    }
  }


  async function deleteUser(id) {
    await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    changeData(data.filter(c => c.id !== id))
  }

  function changeMode() {
    if (signMode === 'autorization') {
      setMode('registration')
    } else {
      setMode('autorization')
    }
  }

  async function authorize() {
    if (name === '' || surname === '') {
      alert('Введите имя и фамилию пользователя для авторизации')
    } else {
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const check = data.find(val => val.name === name && val.surname === surname)
          if (check === undefined) {
            alert('Данный пользователь не зарегистрирован')
          } else {
            console.log('Пользователь авторизирован: ', check)
            console.log(check.contacts.length === 0 ? 'У пользователя нет ни одного контакта :(' : check.contacts)
            console.log('Авторизованный пользователь имеет номер: ', data.indexOf(check), 'в базе данных')
            alert(`Пользователь ${name} ${surname} авторизирован. Переходим в личный кабинет`)


            localStorage.setItem('isAuthenticated', true)
            localStorage.setItem('userDataId', check.id)
            history.push('/profile')
            // history.push({
            //   pathname: '/profile',
            //   state: data[data.indexOf(check)],
            // })

            // location.state({ id: 12345 })
            /*setLoggingIn(true)*/
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  /*const location = {
    pathname: '/profile',
    state: { hello: true }
  }*/

  return (
    <div className="wrapper">

      <div className="user-form">
        <div className="sign-buttons">
          <button style={signMode === 'registration' ? style : { backgroundColor: "#efefef" }} onClick={signMode === 'autorization' ? changeMode : undefined}>Registration</button>
          <button style={signMode === 'autorization' ? style : { backgroundColor: "#efefef" }} onClick={signMode === 'registration' ? changeMode : undefined}>Autorization</button>
        </div>
        <input id="name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
        <input id="surname" value={surname} placeholder="Surname" onChange={(e) => setSurname(e.target.value)}></input>
        <button className="submit" style={{ cursor: 'pointer', backgroundColor: 'LightSeaGreen', color: 'white', borderRadius: '0 0 2vh 2vh' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'Turquoise' }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'LightSeaGreen' }} onClick={signMode === 'registration' ? addUser : authorize} /*to={isLoggedIn ? '/profile' : '/'}*/>{signMode === 'autorization' ? 'Login to account' : 'Register account'}</button>
      </div>

      {
        isLoading
          ? (<div>Loading...</div>)
          : (data.length === 0
            ? <p>Пока нет ни одного контакта</p>
            : (<ul>
              {data.map((item) => (
                <li className="account" key={item.id}>
                  <div>{data.indexOf(item) + 1}</div>
                  <div>
                    <div>{item.name}</div>
                    <div>{item.surname}</div>
                  </div>
                  <button onClick={() => deleteUser(item.id)}>X</button>
                </li>
              ))}
            </ul>))
      }
      {/* <Link to={{ pathname: "/profile", state: { id: 123 } }}>ЛИнка</Link> */}
      {/* <button onClick={handleClick}>ЛИнка</button> */}
    </div >
  )
}

export default Login