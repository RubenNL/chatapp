const webpush = require('web-push');
const fs = require('fs');
let vapidKeys
if(process.env.vapidKeys) {
	vapidKeys=process.env.vapidKeys
} else if(fs.existsSync('vapidKeys.json')) {
	vapidKeys=fs.readFileSync('vapidKeys.json','utf8')
} else {
	vapidKeys = JSON.stringify(webpush.generateVAPIDKeys());
	fs.writeFileSync('vapidKeys.json',vapidKeys,'utf8')
}
vapidKeys=JSON.parse(vapidKeys)
webpush.setVapidDetails(
  'mailto:ruben-chat@rubend.nl',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
getPushkey=()=>vapidKeys.publicKey;
notificationRegister=(req,res)=>{
	const body=req.body;
	console.log(body)
	const pushSubscription = {
		endpoint: body.endpoint,
		keys: {
			auth: body.auth,
			p256dh: body.p256dh
		}
	};

	webpush.sendNotification(pushSubscription, JSON.stringify({title:'hoi!',options:{}})).catch(err=>{console.log(err)});
}
module.exports=()=>{
	return {getPushkey,notificationRegister}
}
