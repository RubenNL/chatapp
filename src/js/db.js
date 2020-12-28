import Dexie from 'dexie';
const db = new Dexie('storage')
db.version(1).stores({
	users: `id, name`,
	messages:`++,user` // -> user.id
});
db.open().catch(e=>{
	console.log('DB error:',e)
	alert('DB error')
	alert('unable to run in incognito, or browser is not supported.')
})
export default db;
