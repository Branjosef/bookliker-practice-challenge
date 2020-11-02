document.addEventListener("DOMContentLoaded",() => {

  const listPanel = document.querySelector('#list')
  const showPanel = document.querySelector('#show-panel')
  const currentUser = {"id": 1, "username": 'pouros'}

  fetch("http://localhost:3000/books")
  .then(resp => resp.json())
  .then(books =>{
    books.forEach(book =>{
      listPanel.innerHTML += bookIndex(book)
    })
  })

  function bookIndex(book){
    return `<li class='book-li' data-id=${book.id}> ${book.title}</li>`
  }


  listPanel.addEventListener('click',(event)=>{
    event.preventDefault()
    const bookId = event.target.dataset.id
    fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(book => {
      showPanel.innerHTML = ' '
      showPanel.innerHTML = 
        `<img src= ${book.img_url}>
        <h4>${book.title}</h4>
        <h4>${book.author}</h4>
        <p>${book.description}</p>`
      renderUsers(book)
    })
  })



  function renderUsers(book) {
    let ul = document.createElement('ul')
    book.users.forEach(user =>{
      let li = document.createElement('li')
      li.innerHTML = `${user.username}`
      showPanel.appendChild(ul)
      ul.appendChild(li)})

    let likeBtn = document.createElement('button')
    likeBtn.innerText = 'LIKE'
    likeBtn.id = `${book.id}`
    likeBtn.className = 'like-button'
    showPanel.appendChild(likeBtn)
     if (book.users.map( u => u.username).includes(currentUser.username)){
          likeBtn.innerText = 'UNLIKE'}
    likeBook(book)
  }


  function likeBook(book) {
    likeBtn = document.querySelector('.like-button')
    likeBtn.addEventListener('click', event => {
      if (likeBtn.innerText === 'LIKE'){
        book.users.push(currentUser)
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            body: JSON.stringify({'users': book.users}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(book => {
          likeBtn.previousSibling.remove()
          likeBtn.remove()
          renderUsers(book)})
      }
      if (likeBtn.innerText === 'UNLIKE'){
        let user = book.users.findIndex(user => user.username === currentUser.username)
        book.users.splice(user,1)
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            body: JSON.stringify({'users': book.users}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(book => {
          likeBtn.previousSibling.remove()
          likeBtn.remove()
          renderUsers(book)})
      }
    })
  }


})


  

      