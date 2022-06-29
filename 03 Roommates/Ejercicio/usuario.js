const axios = require('axios')
const {v4: uuidv4} = require('uuid')
const {guardarUser} = require('./fileSystem.js')

const roommateRandom = async () => {
    const data = await axios.get('https://randomuser.me/api/')
    const result = data.data.results[0]
    const id = uuidv4().slice(0,6)
    const user = {
        id: id,
        email: result.email,
        nombre: result.name.first + result.name.last ,
        debe: 0,
        recibe: 0
    }
    guardarUser(user);
    return user;
}

module.exports = {roommateRandom};