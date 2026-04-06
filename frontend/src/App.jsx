import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [users, setUsers] = useState([]);

  function changeName(e) {
    setName(e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  async function submitForm(e) {
    e.preventDefault(); //prevents page from refreshing when we submit

    // use fetch to call api
    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    setResponse(data.message);
  }

  async function getAllUsers() {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setUsers(data.users);

    console.log("all users", data);
  }


  useEffect(() => {
    getAllUsers();
  }, [])

  return (
    <div>
      <h4>Response: {response}</h4>
      <form onSubmit={submitForm}>
        <input
          type="text"
          value={name}
          onChange={changeName}
          placeholder="Your name"
        />
        <input
          type="text"
          value={email}
          onChange={changeEmail}
          placeholder="Your email"
        />
        <input
          type="text"
          value={password}
          onChange={changePassword}
          placeholder="password"
        />

        <button type="submit">Signup</button>
      </form>

      <h1>List of users</h1>
      {users.map((user) => (
        <p>{user.name}</p>
      ))}
    </div>
  );
}

export default App;
