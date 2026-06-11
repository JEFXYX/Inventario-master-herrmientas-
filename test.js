fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin', password: '123', rol: 'admin' })
})
.then(res => res.json())
.then(data => console.log('REGISTER:', data))
.catch(console.error);
