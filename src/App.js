import React, { Component } from 'react'
import './App.css'
import firebase from './firebase'

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      currentItem: '',
      items: []
    }
  }

  componentDidMount() {
    const collection = firebase.database().ref('items')
    collection.on('value', snapshot => {
      let items = snapshot.val()
      let newState = []
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        })
      }
      this.setState({
        items: newState
      })
    })
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const collection = firebase.database().ref('items')
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    collection.push(item)
    this.setState({
      username: '',
      currentItem: ''
    })
  }

  removeItem(itemId){
    const itemRef = firebase.database().ref(`/items/${itemId}`)
    itemRef.remove()
  }

  render() {
    return (
      <div className='app'>
        <header>
          <div className='wrapper'>
            <h1>Fun Food Friends</h1>
          </div>
        </header>
        <div className='container'>
          <section className='add-item'>
            <form onSubmit={this.handleSubmit}>
              <input
                type='text'
                name='username'
                placeholder="What's your name?"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <input
                type='text'
                name='currentItem'
                placeholder='What are you bringing?'
                value={this.state.currentItem}
                onChange={this.handleChange}
              />
              <button>Add Item</button>
            </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                {this.state.items.map(item => {
                  return(
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>Brought by: {item.user}</p>
                      <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
export default App
