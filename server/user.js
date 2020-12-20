let User;
getUser=id=>User.findByPk(id,{attributes:{exclude:['signKey']}})
async function saveUser(req,res) {
	if(req.body.id) throw "CANT SET ID! SECURITY!"
	return User.create(req.body).then(data=>data.id).then(response=>res.send({type:"yourId",id:response}))
}
module.exports=sequelize=>{
	User=sequelize.models.users;
	return {getUser,saveUser}
} 
