const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
getPushkey=()=>vapidKeys.publicKey;
module.exports=()=>{
	return {getPushkey}
}
