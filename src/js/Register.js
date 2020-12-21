export default class Register {
	constructor(encryption,sign) {
		this._encryption=encryption;
		this._sign=sign;
		if(!window.localStorage.getItem('userId')) return this._register().then(id=>window.localStorage.setItem('userId',id));
		else return Promise.resolve();
	}
	_register() {
		return Promise.all([this._encryption.publicKey(),this._sign.publicKey()]).then(keys=>{
			const message={publicKey:keys[0].n,signKey:JSON.stringify(keys[1])}
			return JSON.stringify(message)
		})
			.then(message=>fetch('/api/register',{method:'POST',headers:{'Content-Length':message.length,'Content-Type':'application/json'},body:message}))
			.then(response=>response.json()).then(response=>response.id)
	}
}
