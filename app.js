const express = require ("express")
const socketio = require ("socket.io")
const app = express()
const CryptoJS = require("crypto-js");

app.set("view engine","ejs")
app.use(express.static("public"))

app.get('/',(req,res)=>{
    res.render('index')

})

const server = app.listen(process.env.PORT || 7777,()=>{
    console.log("รันอยู่จ้า")
})

//Initialize socket

const io = socketio(server)

io.on("connection",socket =>{
    console.log("New user connected")

    socket.username = "Anonymous"

    socket.on("change_username" , data =>{
        socket.username = data.username
    })

    //Handle new masssage
    socket.on('new_massage' , data => {
        console.log("New massage")
        io.sockets.emit("receive_message",{message: data.message, username : socket.username})
       
    })
    socket.on('typing', data => {
        socket.broadcast.emit('typing',{username :socket.username})
    })
} )