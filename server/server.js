const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL?process.env.DATABASE_URL:'sqlite:data.db');
const connections={}
module.exports=(app,wss)=>{
	return require('./tables.js')(sequelize).then(()=>{
		const {getUser,saveUser} = require('./user.js')(sequelize);
		const {getMessagesByUser,saveMessage} = require('./message.js')(sequelize);
		const authentication=require('./authentication.js')(sequelize);		
		app.post('/api/register',saveUser)
		wss.on('connection',(ws,req)=>{
			ws.userId=req.url.split('=')[1];
			ws=>ws.authenticated=false
			ws.authentication=authentication(ws.userId,ws.send.bind(ws))
			ws.on('message',message=>{
				message=JSON.parse(message)
				if(!ws.authenticated) ws.authentication(message).then(status=>{
					console.log('authStatus:',status)
					if(status) {
						ws.authenticated=true
						connections[ws.userId]=ws
					} else ws.close();
					delete ws.authentication;
					return;
				})
				if(message.type=="sendTo") connections[message.dest].send(JSON.stringify({type:"encrypted",message:message.message}))
			})
			ws.on('close',()=>delete connections[ws.userId]);
		})
	})
}
