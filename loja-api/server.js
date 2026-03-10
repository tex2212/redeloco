const express = require("express")
const cors = require("cors")
const mercadopago = require("mercadopago")
const { Rcon } = require("rcon-client")

const app = express()

app.use(cors())
app.use(express.json())

mercadopago.configure({
 access_token: "SEU_ACCESS_TOKEN_AQUI"
})

app.post("/criar-pix", async (req,res)=>{

 const {nick, produto, preco} = req.body

 const payment = await mercadopago.payment.create({
  transaction_amount: Number(preco),
  description: produto + " - " + nick,
  payment_method_id: "pix",
  payer:{
   email:"comprador@email.com"
  }
 })

 res.json({
  qr: payment.body.point_of_interaction.transaction_data.qr_code,
  qr_img: payment.body.point_of_interaction.transaction_data.qr_code_base64
 })

})

app.post("/entregar",(req,res)=>{

 const {nick, comando} = req.body

 Rcon.connect({
  host:"IP_DO_SERVIDOR",
  port:25575,
  password:"SENHA_RCON"
 }).then(async rcon => {

  await rcon.send(comando.replace("{player}",nick))
  rcon.end()

 })

 res.send("ok")

})

app.listen(3000,()=>{
 console.log("API rodando")
})