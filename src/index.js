const express = require('express');
const morgan= require('morgan');
const path= require('path');
const app = express();
const {mongoose}= require('./database');
//settings
app.set('port',process.env.PORT || 3000); //que tome el puerto que le da el servivio de la nube o el 3000

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/tasks',require('./routes/task.routes'));

//static files
app.use(express.static(path.join(__dirname, 'public')));  //lo que esta adentro de path.join es una ruta


//starting the server
app.listen(app.get('port'),()=>{
    console.log(`server on port ${app.get('port')}`);
});