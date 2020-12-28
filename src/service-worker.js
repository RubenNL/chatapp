self.addEventListener('fetch', function(event) {
	if(event.request.destination!=="") {
		event.respondWith(
			caches.open('chatapp').then(function(cache) {
				if(event.request.destination=="document") {
					const url=event.request.url.split('/').slice(0,3).join('/');
					console.log(url)
					return cache.match(url)
				} else return cache.match(event.request).then(function (response) {
					return response || fetch(event.request).then(function(response) {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	}
});
self.addEventListener('install',event=>{
	caches.open('chatapp').then(function(cache) {
		cache.add('/');
	});
})
