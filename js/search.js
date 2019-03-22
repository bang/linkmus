/*search.js


	Description: This module is a handler for searching engine

*/

//Globals
showHideSearch = false
searchChars = []

// The search bar
searchElement = document.querySelector('#search');

// The search results div
searchResults = document.querySelector('#search-results')

function showHideSearchResults(force){
		if( force == null) {
			showHideSearch = !showHideSearch
		}
		else {
			showHideSearch = force
		}
		console.log("showHideSearch: " + showHideSearch)
		display = showHideSearch ? 'block' : 'none'
		console.log("display: " + display)
		document.querySelector('#search-results').style.display=display
	}

	//adding events for search - keypress
	searchElement.addEventListener('keypress',function(e){
		
		if(e.keyCode != 13 ) {	
			searchChars.push(e.key )
		}
		console.log(searchChars.length)
		if(searchChars.length >= 3){
			showHideSearchResults(true)	
			word = searchChars.join('')
			console.log("Searching for music... " + word)
			console.log("By artist")
			results = searchByArtist(word,sources)
/*			console.log("By album")
			concatArray(results,searchByAlbum(word,sources))
			console.log("By track")
			concatArray(results,searchByTrack(word,sources))*/
			
			if(searchResults == null){
				searchResults = document.querySelector('#search-results')
				showHideSearchResults(false)	
			}
			
			searchResults.innerHTML = getResultTracksList(results)
		}
	})

	//adding events for search - keydown
	searchElement.addEventListener('keydown',function(e){
		
		word = document.querySelector('#search').value
		if(word == '' || word === undefined || word == null){
			showHideSearchResults(false)	
		}

		if(e.keyCode == 9 || e.keycode == 27){
			document.querySelector('#search').value = ''
			searchChars = [];
			word = searchChars.join('')
			searchResults.innerHTML = "";
			showHideSearchResults(false);	
		}
	
		if(e.keyCode == 8){
			console.log("popping... ")
			searchChars.pop()
			word = searchChars.join('')
			//searchByArtist(word)
			console.log(searchChars.length)
			if(searchChars.length < 3){
				showHideSearchResults(false);
			}
		}
	})


	searchElement.addEventListener('keyup',function(e){
		
		word = document.querySelector('#search').value
		if(word == '' || word === undefined || word == null){
			showHideSearchResults(false)	
		}
	})

function searchByArtist(word='',source={}){
	let results = []
	if(word.length > 0 && document.querySelector('#search').value == ''){
		//"Oooops! Trash on the searching box. Cleaning up!
		document.querySelector('#search').innerHTML = ''
		word = ''
	}

	for( artist in source ){
		matches = artist.match(new RegExp('^(' + word + '.*?)$','gi'))
		if(matches != null && matches.length > 0){
			for( album in sources[artist]) {
				for(trackIndex in sources[artist][album]){
					track = sources[artist][album][trackIndex]
					//console.log("TRACK: " + JSON.stringify(track))
					results.push(track)
				}
			}
		}
	}

	if(results.length <= 0) {
		console.log("Artist not found yet!")
	}

	/*else {
		console.log("RESULTS BY ARTIST: " + JSON.stringify(results))
	}*/

	return results
}

function searchByAlbum(word='',source={}){
	let results = []
	if(word.length > 0 && document.querySelector('#search').value == ''){
		console.log("Oooops! Trash on the searching box. Cleaning up!")
		document.querySelector('#search').innerHTML = ''
		word = ''
	}

	
	for( artist in source ){
		for( album in sources[artist]) {
			matches = album.match(new RegExp('^.*?(' + word + '.*?)$','gi'))
			if(matches != null && matches.length > 0){
				results = sources[artist][album]
			}
		}
	}

	if(results.length <= 0) {
		console.log("Album not found yet!")
	}

/*	else {
		console.log("RESULTS BY ALBUM: " + JSON.stringify(results))
	}*/

	return results
}

function searchByTrack(word='',source={}){
	let results = []
	if(word.length > 0 && document.querySelector('#search').value == ''){
		console.log("Oooops! Trash on the searching box. Cleaning up!")
		document.querySelector('#search').innerHTML = ''
		word = ''
	}
	
	for( artist in source ){
		for( album in sources[artist]) {
			for(trackIndex in sources[artist][album]){
				track = sources[artist][album][trackIndex]
				//console.log("TRACK: " + JSON.stringify(track))
				matches = track["trackName"].match(new RegExp('^.*?(' + word + '.*?)$','gi'))		
				if(matches != null && matches.length > 0){
					results.push(track)
				}
			}
		}
	}

	if(results.length <= 0) {
		console.log("No tracks found!")
	}

/*	else {
		console.log("RESULTS BY TRACK: " + JSON.stringify(results))
	}*/

	return results
}

function getTrackPseudoId(track){
	trackPseudoId = track.artist + track.album + track.trackName 
	trackPseudoId = trackPseudoId.replace(/\s|\.|\,|\'|\"/g,'')
	return trackPseudoId
}

function getResultTracksList(results){
	list = '<table class="results">'
	list += '<tr class="results"><th class="results">Track Name</th><th class="results">Album</th><th class="results last">Artist</th></tr>'
	
	if(results != null){
		for( r in results){
			track = results[r]
			if(track != null && track != undefined){
				trackPseudoId = getTrackPseudoId(track)
				list += '<tr><td class="results"><a class="results" href="#' + trackPseudoId + '">' + track.trackName + '</a> </td><td class="results"> <a class="results" href="#'+track.album+'"' + track.album + '>' + track.album + '</a> </td><td class="results"> <a class="results" href="#' + track.artist + '">' + track.artist + '</a></td></tr>'
			}
		}
	}
	list += '</table>'
	return list
}
