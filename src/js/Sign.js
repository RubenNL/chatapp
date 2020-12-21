export default class Encryption {
	constructor() {
		this._private
		this._public
	}
	async load() {
		const privateKeyJson=JSON.stringify(JSON.parse((window.localStorage.getItem('signKey')?window.localStorage.getItem('signKey'):await this.generate())))
		const publicKeyJson=JSON.parse(privateKeyJson)
		delete publicKeyJson.d;
		delete publicKeyJson.dp;
		delete publicKeyJson.dp;
		delete publicKeyJson.dq;
		delete publicKeyJson.p;
		delete publicKeyJson.q;
		delete publicKeyJson.qi;
		publicKeyJson.key_ops=['verify'];
		return Promise.all([window.crypto.subtle.importKey("jwk",JSON.parse(privateKeyJson),{name:"RSA-PSS",hash:"SHA-256"},true,['sign']).then(key=>this._private=key),
		window.crypto.subtle.importKey("jwk",publicKeyJson,{name:"RSA-PSS",hash:"SHA-256"},true,['verify']).then(key=>this._public=key)])
	}
	async generate() {
		const key=await window.crypto.subtle.generateKey(
			{
				name: "RSA-PSS",
				modulusLength: 4096,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["sign", "verify"]
		).then(keypair=>keypair.privateKey).then(privateKey=>window.crypto.subtle.exportKey('jwk',privateKey)).then(key=>JSON.stringify(key))
		window.localStorage.setItem('signKey',key);
		return key;
	}
	sign(message) {
		const textencoder=new TextEncoder();
		return window.crypto.subtle.sign(
			{name: "RSA-PSS",saltLength: 64},
			this._private,
			textencoder.encode(message)
		);
	}
	verify(signature,message) {
		const textencoder=new TextEncoder();
		return window.crypto.subtle.verify(
			{name: "RSA-PSS",saltLength: 64},
			this._public,
			signature,
			textencoder.encode(message)
		)
	}
	publicKey() {
		return window.crypto.subtle.exportKey('jwk',this._public)
	}
}
