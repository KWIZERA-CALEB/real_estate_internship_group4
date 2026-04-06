import { useState } from "react"

function App() {
  // javascript code
  const [name, setName] = useState('caleb')
  const [age, setAge] = useState(30)
  const [email, setEmail] = useState('caleb@gmail.com')
  const [password, setPassword] = useState('we are here')



  function changeName(a) {
    setName(a.target.value)
  }

  function changeEmail(e) {
    setEmail(e.target.value)
  }

  function changePassword(event) {
    setPassword(event.target.value)
  }

  function showUsWhatIsInform(e) {
    e.preventDefault()
  }


  // here goes all html code
  return (
    <div>
      Hello
      <h1>Hello  {name}</h1>
      <p>Am {age} years old</p>
      <button onClick={changeName}>Change Name</button>

      {/* form */}
      <form onSubmit={showUsWhatIsInform}>
        <input type="text" value={name} onChange={changeName} placeholder="name" />
        <input type="text" value={email} onChange={changeEmail} placeholder="email" />
        <input type="text" value={password} onChange={changePassword} placeholder="password" />
        <button type="submit">Show us what is from the form</button>
      </form>


      <p>Email: {email}</p>
      <p>Password: {password}</p>
      <p>Name: {name}</p>

    </div>
  )
}

export default App