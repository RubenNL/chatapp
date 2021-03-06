const { DataTypes,Sequelize } = require('sequelize');
module.exports=sequelize=>{
	const User=sequelize.define("users",{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		publicKey: DataTypes.STRING(700),
		signKey: DataTypes.STRING(1024)
	});
	const Message=sequelize.define("messages",{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		message: DataTypes.STRING(32768)
	})
	User.hasMany(Message);
	Message.belongsTo(User);
	return sequelize.sync()//{force:true}
}
