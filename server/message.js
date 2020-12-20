const {Op}=require('sequelize');
let Message;
getMessagesByUser=id=>Message.findAll({
	where:{
		userId:id
	}
})
saveMessage=json=>Message.create(json)
module.exports=sequelize=>{
	Message=sequelize.models.messages;
	return {getMessagesByUser,saveMessage}
} 
