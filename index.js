const express=require("express")
const app=express()
const port=5000


app.get('/',(req,res)=>{
    res.send("back-end is running.")
})

app.listen(port,()=>{
    console.log(`this server is running on ${"http://localhost:5000"}`)
})