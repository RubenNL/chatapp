import CustomStorage from "./CustomStorage.js" 
export default class Register {
	constructor(encryption,sign) {
		this._encryption=encryption;
		this._sign=sign;
		this._storage=new CustomStorage('userId')
		if(!this._storage.value) return this._register().then(id=>this._storage.value=id);
		else return Promise.resolve();
	}
	_register() {
		return Promise.all([this._encryption.publicKey(),this._sign.publicKey()]).then(keys=>{
			const message={publicKey:JSON.stringify(keys[0]),signKey:JSON.stringify(keys[1])}
			return JSON.stringify(message)
		})
			.then(message=>fetch('/api/register',{method:'POST',headers:{'Content-Length':message.length,'Content-Type':'application/json'},body:message}))
			.then(response=>response.json()).then(response=>response.id)
	}
}
