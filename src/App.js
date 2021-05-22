import React, { useEffect, useState } from 'react'
/*uuid*/

function App() {
  const [data, changeData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const url = 'http://localhost:3001/users'

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


  async function addUser(e) {
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

    /* now get fetch and update state, rerender component. change syntax!*/
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
  }

  async function deleteUser(id) {
    await fetch(`http://localhost:3001/users/${id}`, {
      method: 'DELETE'
    })
    changeData(data.filter(c => c.id !== id))
  }



  // const createUser = () => {
  //   const newUser = {
  //     'First Name': name,
  //     'Last Name': surname
  //   }
  //   console.log(newUser);
  // }

  return (
    <div className="wrapper">

      <div className="user-form">
        <div className="sign-buttons">
          <button>Registration</button>
          <button>Autorization</button>
        </div>
        <input id="name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
        <input id="surname" value={surname} placeholder="Surname" onChange={(e) => setSurname(e.target.value)}></input>
        <button onClick={(e) => name.replace(/\s/g, '') !== '' & surname.replace(/\s/g, '') !== '' ? addUser(e) : alert('Чтобы создать пользователя введите имя и фамилию')} /*onClick={createUser}*/>Принять</button>
      </div>

      { isLoading
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

    </div >
  )
}

export default App;
