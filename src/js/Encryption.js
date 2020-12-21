export default class Encryption {
	constructor() {
		this._private
		this._public
	}
	publicStringToKey(keyString) {
		return window.crypto.subtle.importKey("jwk",{"alg":"RSA-OAEP-256","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":keyString},{name:"RSA-OAEP",hash:"SHA-256"},true,['encrypt'])
	}
	async load() {
		const privateKeyJson=JSON.parse((window.localStorage.getItem('encryptKey')?window.localStorage.getItem('encryptKey'):await this.generate()))
		return Promise.all([window.crypto.subtle.importKey("jwk",privateKeyJson,{name:"RSA-OAEP",hash:"SHA-256"},true,['decrypt']).then(key=>this._private=key),
		this.publicStringToKey(privateKeyJson.n).then(key=>this._public=key)])
	}
	async generate() {
		const key=await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 4096,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		).then(keypair=>keypair.privateKey).then(privateKey=>window.crypto.subtle.exportKey('jwk',privateKey)).then(key=>JSON.stringify(key))
		window.localStorage.setItem('encryptKey',key)
		return key;
	}
	encrypt(key,message) {
		const chunks=[]
		message=JSON.stringify({message:message,from:me.id})
		for (var i = 0, charsLength = message.length; i < charsLength; i += 446) chunks.push(message.substring(i, i + 446));
		return this.publicStringToKey(key).then(key=>Promise.all(chunks.map(chunk=>this.encryptPart(key,chunk))))
	}
	encryptPart(key,message) {
		const textencoder=new TextEncoder();
		return window.crypto.subtle.encrypt(
			{name: "RSA-OAEP"},
			key,
			textencoder.encode(message)
		).then(buffer=>btoa(String.fromCharCode(...new Uint8Array(buffer))))
	}
	decrypt(message) {
		return Promise.all(message.map(this.decryptPart.bind(this))).then(chunks=>JSON.parse(chunks.join('')))
	}
	decryptPart(message) {
		message=Uint8Array.from(atob(message), c => c.charCodeAt(0))
		const textDecoder=new TextDecoder();
		return window.crypto.subtle.decrypt(
			{name: "RSA-OAEP"},
			this._private,
			message
		).then(message=>textDecoder.decode(message))
	}
	publicKey() {
		return window.crypto.subtle.exportKey('jwk',this._public)
	}
}
