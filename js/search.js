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

//adding events for search - keydown
searchElement.addEventListener('keydown',function(e){
	word = document.querySelector('#search').value;
	//checking tab
	switch(e.keyCode){
		case 9:
			document.querySelector('#search').value = '';
			showHideSearchResults(false);
			word = ''								
			break;
		case 13:
			if(word.length >= 3){
				getResults(word)
			}
			else {
				document.querySelector('#search').value = '';
				showHideSearchResults(false)
				word = ''
			}
			break;
		default:
			if(word.length >= 3){
				getResults(word)
			}
			break;
	}
})

searchElement.addEventListener('keyup',function(e){
	word = document.querySelector('#search').value
	console.log("keyup word: " + word)

	//checking delete or backspace
	if(e.keyCode == 8 || e.keyCode == 46){
		word = document.querySelector('#search').value;
		if(word == '' || word == null || word == undefined){
			showHideSearchResults(false)
		}
	}


	console.log(word)
})


function getResults(word){
	let results = searchByArtist(word,sources)
	console.log("Searching for music... " + word)
	console.log("By artist")
	console.log("By album")
	concatArray(results,searchByAlbum(word,sources))
	console.log("By track")
	concatArray(results,searchByTrack(word,sources))
	if(results != null && results != undefined && results.length > 0){
		searchResults.innerHTML = getResultTracksList(results);
		showHideSearchResults(true);
	}
	else{
		console.log("No results");
		document.querySelector('#search').value = '';
		showHideSearchResults(false)
	}
}

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
				list += '<tr><td class="results"><a class="results" href="#" onclick="scrollToTarget(\'list\',\'' + trackPseudoId + '\')">' + track.trackName + '</a> </td><td class="results"> <a class="results" href="#'+track.album+'"' + track.album + '>' + track.album + '</a> </td><td class="results"> <a class="results" href="#' + track.artist + '">' + track.artist + '</a></td></tr>'
			}
		}
	}
	list += '</table>'
	return list
}

function scrollToTarget(divId,targetId){
	const overflow = document.querySelector('#' + divId);
	const anchor = document.getElementById(targetId); // for some reason querySelector is not working... 

	// Get the bounding client rectangles for both
	// the overflow container and the target anchor
	const rectOverflow = overflow.getBoundingClientRect();
	const rectAnchor = anchor.getBoundingClientRect();

	// Set the scroll position of the overflow container
	overflow.scrollTop = rectAnchor.top - rectOverflow.top;
}
