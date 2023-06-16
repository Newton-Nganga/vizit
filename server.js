require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')
const port = process.env.PORT


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static',express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))

const routes = require('./routers/routers');
app.use('/', routes);

//catch missing endpoints
app.get('*',(req,res)=>{
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
