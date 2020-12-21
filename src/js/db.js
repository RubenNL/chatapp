import Dexie from 'dexie';
const random=Math.random()*10000
//import relationships from 'dexie-relationships'
const db = new Dexie('storage') //, {addons: [relationships]}
db.version(1).stores({
	users: `id, name`,
	messages:`++,user` // -> user.id
});
console.log('random:',random)
export default db;
