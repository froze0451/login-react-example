import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

function Profile() {

  const [userData, setUserData] = useState([])
  const [userName, setUserName] = useState('')
  const [contacts, setContacts] = useState([])
  const [contactName, setContactName] = useState('')
  const [contactSurname, setContactSurname] = useState('')
  const id = localStorage.getItem('userDataId')


  const url = 'http://localhost:3001/users'
  let history = useHistory()

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      history.push('/')
    }


    async function fetchData() {
      await fetch(`${url}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data)
          setUserName(data.name)
          setContacts(data.contacts)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    fetchData()
  }, [])

  function exitPage() {
    localStorage.clear()
    history.replace('/')
  }

  async function addContact() {
    let someData
    await fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        someData = data
      })

    await console.log(someData)


    let newContact = {
      id: someData.contacts.length + 1,
      name: contactName.replace(/\s/g, ''),
      surname: contactSurname.replace(/\s/g, '')
    }

    await someData.contacts.push(newContact)

    await fetch(`${url}/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(someData)
    })

    await fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts)
      })
      .catch((err) => {
        console.log(err)
      })
    setContactName('')
    setContactSurname('')
  }

  return (
    <div className="profile">
      <header>
        <div className="search-section">
          <input placeholder="Find contact" />
          <button>Search</button>
        </div>
        <h1 className="profile-name" onClick={() => console.log(userData)}>{userName}</h1>
        <button onClick={exitPage}>Log out -&gt;</button>
      </header>

      <div className="add-contact-section">
        <input placeholder="Name" onChange={(e) => setContactName(e.target.value)} />
        <input placeholder="Surname" onChange={(e) => setContactSurname(e.target.value)} />
        <button onClick={addContact}>Add contact</button>
      </div>

      <h2>Contact list</h2>
      <ul>
        {contacts.map((item, index) => (
          <li className='contact' key={index}>
            <p>{index + 1}</p>
            <input value={item.name + ' ' + item.surname} /*onChange={(e) => item.name = e.target}*/ />
            <p onClick={(e) => console.log()}>edit</p>
            <button /*onClick={() => deleteUser(item.id)}*/>X</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default Profile