import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

function Login() {
  const [data, changeData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [signMode, setMode] = useState('autorization')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const url = 'http://localhost:3001/users'

  const style = { backgroundColor: "lightslategrey", border: '0.4vh solid DarkGray', cursor: 'inherit', color: 'Azure' }

  let history = useHistory();


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
    if (name.replace(/\s/g, '') !== '' & password.replace(/\s/g, '') !== '') {
      let user = {
        id: null,
        name: name.replace(/\s/g, ''),
        password: password.replace(/\s/g, ''),
        contacts: []
      }

      let testUser
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          testUser = data
        })
        .catch((err) => {
          console.log(err)
        })


      if (testUser.filter(u => u.name === user.name).length > 0) {
        alert('This user already exists. To autorize click "Autorization" and then Login')
      } else {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })

        await fetch(url)
          .then((res) => res.json())
          .then((data) => {
            changeData(data)
          })
          .catch((err) => {
            console.log(err)
          })

        alert('Registration complete. Now you can autorize')
        setName('')
        setPassword('')
      }
    } else {
      alert('You need to input name and password to register an account.')
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
    if (name === '' || password === '') {
      alert('You need to input name and password to autorize.')
    } else {
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const check = data.find(val => val.name === name && val.password === password)
          if (check === undefined) {
            alert('This account doesnt exist. To register click "Registration" and then register')
          } else {
            console.log('Пользователь авторизирован: ', check)
            console.log(check.contacts.length === 0 ? 'У пользователя нет ни одного контакта :(' : check.contacts)
            console.log('Авторизованный пользователь имеет номер: ', data.indexOf(check), 'в базе данных')
            alert(`User ${name} has been authorized. Moving to contact list`)

            localStorage.setItem('isAuthenticated', true)
            localStorage.setItem('userDataId', check.id)
            history.push('/profile')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return (
    <div className="wrapper">

      <div className="user-form">
        <div className="sign-buttons">
          <button style={signMode === 'registration' ? style : { backgroundColor: "#efefef" }} onClick={signMode === 'autorization' ? changeMode : undefined}>Registration</button>
          <button style={signMode === 'autorization' ? style : { backgroundColor: "#efefef" }} onClick={signMode === 'registration' ? changeMode : undefined}>Autorization</button>
        </div>
        <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
        <input value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
        <button className="submit" style={{ cursor: 'pointer', backgroundColor: 'LightSeaGreen', color: 'white', borderRadius: '0 0 2vh 2vh' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'Turquoise' }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'LightSeaGreen' }} onClick={signMode === 'registration' ? addUser : authorize} /*to={isLoggedIn ? '/profile' : '/'}*/>{signMode === 'autorization' ? 'Login to account' : 'Register account'}</button>
      </div>

      <p style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Users list</p>
      {
        isLoading
          ? (<div>Loading...</div>)
          : (data.length === 0
            ? <p>No registered accounts</p>
            : (<ul>
              {data.map((item) => (
                <li className="account" key={item.id}>
                  <div>{data.indexOf(item) + 1}</div>
                  <div>
                    <div>{item.name}</div>
                    <div>{item.password}</div>
                  </div>
                  <button onClick={() => deleteUser(item.id)}>X</button>
                </li>
              ))}
            </ul>))
      }

    </div >
  )
}

export default Login