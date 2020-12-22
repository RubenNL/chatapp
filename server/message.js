const {Op}=require('sequelize');
let Message;
getMessagesByUser=id=>Message.findAll({
	where:{
		userId:id
	}
})
saveMessage=json=>Message.create(json)
deleteMessagesByUser=userId=>Message.destroy({where:{userId:userId}})
module.exports=sequelize=>{
	Message=sequelize.models.messages;
	return {getMessagesByUser,saveMessage,deleteMessagesByUser}
} 
