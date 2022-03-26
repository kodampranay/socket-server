import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv'
import cors from 'cors'



dotenv.config();
const app=express();
app.use(cors({origin: '*',methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}))
const httpServer = createServer(app);




//online users
let onlineusers=[];

function addusers(userid,socketid){
  !onlineusers.some(user=>user.userid===userid)&& onlineusers.push({userid,socketid})
  console.log('userss',onlineusers);
}
function removeuser(socketid)
{
  onlineusers=onlineusers.filter((user)=>user.socketid!==socketid)
  // console.log('new array remove',onlineusers)
}

function getuser(userid)
{
  return  onlineusers.filter(user=>user.userid===userid)
  // console.log('this is usr',user)

}



let users=[];

//HOW MANY USER ARE IN ONLINE
function addonline(userid,socketid)
{
  !users.some(user=>user.userid===userid)&& users.push({userid,socketid})
  console.log('userss',users);

}
function removeonlineuser(socketid)
{
  users=users.filter((user)=>user.socketid!==socketid)
  // console.log('new array remove',users)
}

function getonlineuser(userid)
{
  return  users.filter(user=>user.userid===userid)[0]
}


const io = new Server(httpServer, {
    
  
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  }

  );


  
app.use(express.json());

  io.on("connection", (socket) => {
    // console.log('connected  ',socket)
    
    socket.on('newuser',(userid)=>
    {
        addusers(userid._id,socket.id)

    })

    socket.on('userlist',(userid)=>
    {
        
          try{
            addonline(userid._id,socket.id)
        // console.log('userlist=>',userid._id,socket.id)
        io.emit('online',users.map(user=>user.userid));

          }
          catch(err)
          {

          }
        
        
    })
    socket.on("disconnect",()=>
    {
      try{
        console.log(socket.id)
      removeuser(socket.id)
      removeonlineuser(socket.id)
      io.emit('online',users.map(user=>user.userid));
      }
      catch(err)
      {

      }
    })
    socket.on('typing',(userid)=>
    {
      try{

        
        const user=getuser(userid)
        console.log('socketid-',user[0].socketid)
       
       if(user[0])return io.to(user[0].socketid).emit('typing','someone is typing'+Math.random())
       
       
      }
      catch(err)
      {

      }
    })
    socket.on('sendmessage',(userid)=>
    {
      try{

        console.log('hello this is your user id',userid)
        const user=getuser(userid)
        console.log('socketid-',user[0].socketid)
       
       if(user[0])return io.to(user[0].socketid).emit('msgnotification','hi you got  message'+Math.random())
       
       
      }
      catch(err)
      {

      }
    })
    socket.on('sendrequest',(data)=>
    {
      console.log('socket request id',data)
      const user=getonlineuser(data)
      io.to(user.socketid).emit('request',"request came"+Math.random())
    })

    socket.on('accept',(userid)=>
    {
      console.log('accepted',userid)
      const user=getonlineuser(userid)
      io.to(user.socketid).emit('accepted',"request came"+Math.random())
    })
    
    
  });




//STATIC PATH FOR IMAGES



const PORT=process.env.PORT;


//CONNECTING TO DATABASE



// ROUTERS MIDDLWARE


app.get('/',(req,res)=>{
  res.send('hello world')
})
httpServer.listen(PORT,()=>console.log(`server is running at http://localhost:`+PORT))
