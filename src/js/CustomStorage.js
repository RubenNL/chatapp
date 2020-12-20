export default class CustomStorage {
	constructor(item) {
		this.item=item;
	}
	get value() {
		return window.localStorage.getItem(this.item)
	}
	set value(value) {
		window.localStorage.setItem(this.item,value)
	}
}
