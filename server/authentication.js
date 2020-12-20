const crypto=new (require("node-webcrypto-ossl").Crypto)();
const defaultCrypto=require("crypto");
let User
function verify(userId,signature,message) {
	return User.findByPk(userId,{attributes:['signKey']})
		.then(user=>crypto.subtle.importKey("jwk",JSON.parse(user.signKey),{name:"RSA-PSS",hash:"SHA-256"},false,['verify']))
		.then(key=>{
			const textencoder=new TextEncoder();
			return crypto.subtle.verify(
				{name: "RSA-PSS",saltLength: 64},
				key,
				Buffer.from(signature,'base64'),
				textencoder.encode(message)
			)
		})
}
module.exports=sequelize=>{
	User=sequelize.models.users;
	return (userId,send)=>{
		const randomString=defaultCrypto.randomBytes(64).toString('hex');
		send(JSON.stringify({type:"signMessage",message:randomString}))
		return message=>verify(userId,message.signature,randomString)
	}
}
