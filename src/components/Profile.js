import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

function Profile() {
  const [userData, setUserData] = useState([])
  const [userName, setUserName] = useState('')
  const [contacts, setContacts] = useState([])
  const [contactName, setContactName] = useState('')
  const [contactSurname, setContactSurname] = useState('')
  const [contactsFilter, setContactsFilter] = useState('')
  const [testFilter, setTestFilter] = useState('')
  const [testEdit, setTestEdit] = useState({})

  const id = localStorage.getItem('userDataId')
  const url = 'http://localhost:3001/users'
  let history = useHistory()

  /* */
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
  }, [history, id])

  /* */
  function logOut() {
    localStorage.clear()
    history.replace('/')
  }

  /* */
  async function addContact() {
    let someData
    await fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        someData = data
      })

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

  /* */
  async function deleteContact(name, surname) {
    let someData
    await fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        someData = data
      })

    someData.contacts = someData.contacts.filter(c => (c.name !== name || c.surname !== surname))

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
  }

  async function filterContacts(e) {
    await setContactsFilter(e.target.value)

    let re = new RegExp('^' + e.target.value, 'i')
    let filteredContacts = contacts.filter(c => { return c.name.match(re) || c.surname.match(re) || (c.name + " " + c.surname).match(re) })

    console.log(filteredContacts)

    setTestFilter(filteredContacts.length > 0 ? (filteredContacts.map((item, index) => (
      <li className='contact' key={index}>
        <p>{index + 1}</p>
        <div>
          <input readOnly value={item.name} />
          <input readOnly value={item.surname} />
        </div>
        <p>edit</p>
        <button onClick={() => deleteContact(item.name, item.surname)}>X</button>
      </li>
    ))) : (<p>No matches</p>))
  }

  /* */
  function engageEdit(name, surname, index) {
    setTestEdit({
      name: name,
      surname: surname,
      index: index
    })
  }

  function editContactName(e) {
    setTestEdit(prevState => ({
      ...prevState,
      name: e.target.value
    }))
    console.log(testEdit)
  }

  function editContactSurname(e) {
    setTestEdit(prevState => ({
      ...prevState,
      surname: e.target.value
    }))
    console.log(testEdit)
  }

  async function saveEdit() {
    let someData

    await fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        someData = data
      })

    let editedContact = {
      id: someData.contacts[testEdit.index].id,
      name: testEdit.name,
      surname: testEdit.surname
    }

    someData.contacts[testEdit.index] = editedContact

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

    setTestEdit({})
  }

  return (
    <div className="profile">
      <header>
        <input onChange={(e) => filterContacts(e)} placeholder="Find contact" />
        <h1 className="profile-name" onClick={() => console.log(userData)}>{userName}</h1>
        <button onClick={logOut}>Log out -&gt;</button>
      </header>

      <div className="add-contact-section">
        <input value={contactName} placeholder="Name" onChange={(e) => setContactName(e.target.value)} />
        <input value={contactSurname} placeholder="Surname" onChange={(e) => setContactSurname(e.target.value)} />
        <button onClick={addContact}>Add contact</button>
      </div>

      <h2>Contacts list</h2>
      <ul>
        {contactsFilter !== '' ? (testFilter) :
          (contacts.length === 0 ? <p>Contact list is empty.</p> :
            (contacts.map((item, index) => (
              <li className='contact' key={index}>
                <p>{index + 1}</p>
                <div>
                  <input readOnly={testEdit.index === index ? false : true} value={testEdit.index === index ? testEdit.name : item.name} style={testEdit.index === index ? { border: '1px solid black' } : { border: 'none' }} onChange={(e) => editContactName(e)} />
                  <input readOnly={testEdit.index === index ? false : true} value={testEdit.index === index ? testEdit.surname : item.surname} style={testEdit.index === index ? { border: '1px solid black' } : { border: 'none' }} onChange={(e) => editContactSurname(e)} />
                </div>
                <p onClick={testEdit.index !== index ? (() => engageEdit(item.name, item.surname, index)) : (() => saveEdit())}>{testEdit.index === index ? 'save' : 'edit'}</p>
                <button onClick={() => deleteContact(item.name, item.surname)}>X</button>
              </li>
            ))))}
      </ul>
    </div>
  )
}

export default Profile