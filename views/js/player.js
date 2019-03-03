/*
	Name: 
		player.js

	Version: 
		0.0.1

	Description:
		


*/



// Mock list
/*sources = [
	{
		'url':'mp3/AC_DC/Back In Black (Disc 8)/06 - Back In Black.mp3',
		'trackName':'Back In Black',
		'artist':'AC_DC'
	},
	
	{
		'url':'mp3/AC_DC/Back In Black (Disc 8)/01 - Hells Bells.mp3',
		'trackName':'Hells Bells',
		'artist':'AC_DC'
	}
];*/


//GLOBALS
audio = document.querySelector('#player');
isPlaying = false;
index = 0;
currentTrack = undefined


function isEmpty(obj) {
	// Returns true if object is empty. Otherwise, returns false
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


searchChars = []
searchElement = document.querySelector('#search');


loadJSON('/list.json',function(response){
	//console.log(JSON.stringify(response));
	
	// Getting music list
	sources = JSON.parse(response);

	//generating play list from 'sources'
	genList(sources,"artist")
	fullTracksList = []
	for( artist in sources ) {
		for( album in sources[artist]) {
			for(trackIndex in sources[artist][album]){
				track = sources[artist][album][trackIndex]
				if( currentTrack == undefined ){
					currentTrack = track
					console.log("FIRST TRACK: " + JSON.stringify(currentTrack))
				}
				fullTracksList.push(track)
				//console.log(track.trackName)
			}
		}
	}

	//initialize by the first music
	audio.src = currentTrack.url;
	document.querySelector("#trackName").innerHTML = currentTrack.trackName
	document.querySelector("#trackArtist").innerHTML = currentTrack.artist

	// Doing 'auto next' when the music is finished
	audio.addEventListener('ended',function(){
		/*lastIndex = sources.length;
			index = index + 1;
			audio.src=track.url;
			play(track);*/
			console.log("Next..." )
			console.log(currentTrack)
			next()
	},false);

	// BUTTONS EVENTS

	document.querySelector('#btn_play').addEventListener('click',function(){
		play(currentTrack);
	});

	document.querySelector('#btn_pause').addEventListener('click',function(){
		pause();
	});

	document.querySelector('#btn_stop').addEventListener('click',function(){
		stop();
	});


	document.querySelector('#btn_next').addEventListener('click',function(){
		next();
		document.querySelector("#trackName").innerHTML = currentTrack.trackName
		document.querySelector("#trackArtist").innerHTML = currentTrack.artist
	});

	document.querySelector('#btn_prev').addEventListener('click',function(){
		prev();
		document.querySelector("#trackName").innerHTML = currentTrack.trackName
		document.querySelector("#trackArtist").innerHTML = currentTrack.artist
	});				


	

	// Treating 'play' event
	audio.addEventListener('play',function(){
		document.querySelector('#div_play').style.display="none";
		document.querySelector('#div_pause').style.display="inline-block";
		document.querySelector('#div_stop').style.display="inline-block";	
	},false);

	// Treating 'pause/stop' event
	audio.addEventListener('pause',function(){
		document.querySelector('#div_play').style.display="inline-block";
		document.querySelector('#div_pause').style.display="none";
		document.querySelector('#div_stop').style.display="none";	
	},false);				

	var duration;
	audio.addEventListener('timeupdate',function() {
		if( duration != undefined && duration != null && duration > 0){
			var playPercent = 100 * (audio.currentTime / duration);
			playhead.style.marginLeft = playPercent + "%";
		}
	}, false);

	// Gets audio file duration
	audio.addEventListener("canplaythrough", function () {
		duration = audio.duration;
	}, false);

	timeline.addEventListener('mousedown',function(e) {
		pause()
		console.log("seekbar clicked")
		var x = e.pageX - e.currentTarget.offsetLeft; 
		var y = e.pageY - e.currentTarget.offsetTop;
		console.log("x: " + x);
		console.log("y: " + y); 
		bRect = timeline.getBoundingClientRect();
		console.log("SIZE: " + bRect.width);
		barPercentOnClick = 100 * ( x / bRect.width );
		if(barPercentOnClick < 5) {
			barPercentOnClick = 5;
		}
		console.log("barPercentOnClick: " + barPercentOnClick)
		console.log("DURATION: " + duration);

		
		currentTime = (duration * barPercentOnClick) / 100
			if( currentTime > duration ){
			currentTime = duration
		}
		console.log("Current time: " + currentTime)
		var playPercent = 100 * (currentTime / duration);
		
		playhead.style.marginLeft = ( playPercent ) + "%";

		audio.currentTime = currentTime;


	})

	timeline.addEventListener('mousedown',function(e) {
		play()
	})


	//adding events for search - keypress
	searchElement.addEventListener('keypress',function(e){
		if(e.keyCode != 13) {	
			searchChars.push(e.key )
		}
		
		if(searchChars.length >= 3){
			word = searchChars.join('')
			console.log("Searching for music... " + word)
			console.log("By artist")
			results = searchByArtist(word,sources)
			if(results == null || results.length == 0){
				console.log("By album")
				results = searchByAlbum(word,sources)
			}
			
			console.log("By track")
			results.push(searchByTrack(word,sources))
			
		}

		if(e.keyCode == 13) {
			document.querySelector('#search').value = ''
			document.querySelector('#search').innerHTML = ''
			searchChars = []
		}
	})

	//adding events for search - keydown
	searchElement.addEventListener('keydown',function(e){
	
		if(e.keyCode == 9){
			document.querySelector('#search').value = ''
			document.querySelector('#search').innerHTML = ''
			searchChars = []
		}
	
		if(e.keyCode == 8){
			searchChars.pop()
			word = searchChars.join('')
			searchByArtist(word)
		}

	})	

})

/*start the 'audio' player
	Arguments:
		index: (int) track index inside 'sources' array

*/
function play(track,changeSrc=false){
	if(track == undefined){
		track = currentTrack
	}
	console.log("TRACK ON PLAY...: " + JSON.stringify(track))
	//change source url only if needed. In this case, when some track from list is clicked.
	if(changeSrc) {
		audio.src = track.url;					
	}
	trackName = document.querySelector('#trackName');
	if(trackName != undefined){
		trackName.innerHTML=track.trackName;
		trackArtist.innerHTML=track.artist;
	}
	console.log("Playing...: " + track.trackName);
	audio.play();
	isPlaying = true;
	return true
}

function playAndMark(base64EncodedString){
	stop()
	decodedString = Base64.decode(base64EncodedString)
	List = decodedString.split(/\|/)
	url = List[0]
	artist = List[1]
	album = List[2]
	trackName = List[3]

	for( index in sources[artist][album]){
		track = sources[artist][album][index]
		if(track.trackName == trackName) {
			currentTrack = track
			play(track,true)
		}
	}
}

/*stop the audio player
	Arguments: no arguments
		

*/
function stop(){
	isPlaying = false;
	audio.pause();
	audio.currentTime = 0;
}

/*pause the audio player
	Arguments: no arguments
		

*/
function pause(){
	isPlaying = false;
	console.log("Pausing " + index + " ...:")
	audio.pause();
}

/*change to the previous track on playlist controled by 'index' variable. If 
music is the first track, previous will be the last music and so on.
	Arguments: no arguments
		

*/
function prev() {
	console.log("currentTrack" + JSON.stringify(currentTrack))
	artistName = currentTrack["artist"]
	albumName = currentTrack["album"]
	trackName = currentTrack["trackName"]

	// from current track find the music
	album = sources[artistName][albumName]
	found = false;
	previousTrack = {}
	console.log("LENGTH: " + fullTracksList.length)
	console.log( "COCO" + JSON.stringify(fullTracksList[3213]))
	for(trackIndex = (fullTracksList.length - 1); trackIndex >= 0; trackIndex-- ){
		track = fullTracksList[trackIndex]
		if(found){
			console.log("FOUND: " + track)
			if(!isEmpty(track)){
				previousTrack = track
				currentTrack = previousTrack
				break
			}
		}

		if(track.trackName == trackName){
			found = true
			continue
		}
	}	

	if(isEmpty(previousTrack)){
		previousTrack = currentTrack = fullTracksList[-1]
	}

	console.log("PREVIOUS TRACK: " + JSON.stringify(previousTrack))
	play(previousTrack,true)
}

/*change to the next track on playlist controled by 'index' variable. If 
music is the last track, next will be the first music and so on.
	Arguments: no arguments
		

*/
function next() {
	console.log("currentTrack" + JSON.stringify(currentTrack))
	artistName = currentTrack["artist"]
	albumName = currentTrack["album"]
	trackName = currentTrack["trackName"]

	// from current track find the music
	album = sources[artistName][albumName]
	found = false;
	nextTrack = {}
	for(trackIndex in fullTracksList ){
		console.log("trackIndex: " + trackIndex)
		track = fullTracksList[trackIndex]
		if(found){
			console.log("FOUND: " + track)
			if(!isEmpty(track)){
				nextTrack = track
				currentTrack = nextTrack
				break
			}
		}

		if(track.trackName == trackName){
			found = true
			continue
		}
	}

	if(isEmpty(nextTrack)){
		nextTrack = currentTrack = fullTracksList[0]
	}

	console.log("NEXT TRACK: " + JSON.stringify(nextTrack))
	play(nextTrack,true)

	return true
}			



/*Generates a track's list based on JSON with metadata of the tracks. This file is generated by 'link_creator.pl' script.

*/
function genList(sources,reference) {
	if( reference == undefined ) {
		reference = "artist"
	}
	list = document.querySelector("#list")

	switch(reference) {

		case "artist": 
			
			listStr = "<ul>"
			fakeIndex = 1;
			for( artist in sources ){
				listStr += "<li>" + artist + "<ul>"
				for(album in sources[artist] ){
					listStr += "<li class='album'>" + album + "<div class='album-vertical-spacer'> &nbsp;</div><ul>"
					for(trackIndex in sources[artist][album]){
						track = sources[artist][album][trackIndex]
						encodedData = Base64.encode(track.url + "|" + track.artist + "|" + track.album + "|" + track.trackName)
						listStr += "<li class='track'> <a href='javascript:null' id=" + fakeIndex + " onclick=\"playAndMark(\'" + encodedData + "\')\" >" + track.trackName + "</a></li>"

					}
					listStr += "</ul>"

					listStr += "</li>"
				}
				listStr += "</ul>"
				/*console.log("Playing index - " + i);
				source = sources[i]
				listStr += "<tr><td>" + fakeIndex + ". </td><td><a href='javascript:null' id=" + i + " onclick='play(" + i + ",true)' >" + source['trackName'] + "</a></td><td>" + source['artist'] + "</td><td>" + source['album'] + "</td></tr>"*/
				listStr += "</li>"
				fakeIndex += 1;
			}
			listStr += "</ul>"
			break;
		case "album": break;

		default: console.log("Invalid option to generate music list!")
	}
	
	//console.log(listStr)
	list.innerHTML = listStr;
}

function searchByArtist(word='',source={}){
	results = []
	if(word.length > 0 && document.querySelector('#search').value == ''){
		console.log("Oooops! Trash on the searching box. Cleaning up!")
		document.querySelector('#search').innerHTML = ''
		word = ''
	}

	
	for( artist in source ){
		matches = artist.match(new RegExp('^(' + word + '.*?)$'))
		
		if(matches != null && matches.length > 0){
			console.log("AKI, PORRA!")
			results.push(artist)
		}
	}

	if(results.length <= 0) {
		console.log("Not found yet!")
	}

	else {
		console.log("RESULTS: " + JSON.stringify(results))
	}

	return results
}



function searchByAlbum(word='',source={}){
	results = []
	if(word.length > 0 && document.querySelector('#search').value == ''){
		console.log("Oooops! Trash on the searching box. Cleaning up!")
		document.querySelector('#search').innerHTML = ''
		word = ''
	}

	
	for( artist in source ){
		for( album in sources[artist]) {
			matches = album.match(new RegExp('^.*?(' + word + '.*?)$'))
			
			if(matches != null && matches.length > 0){
				results.push(album)
			}
		}
	}

	if(results.length <= 0) {
		console.log("Not found yet!")
	}

	else {
		console.log("RESULTS: " + JSON.stringify(results))
	}

	return results
}


function searchByTrack(word='',source={}){
	results = []
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
				matches = track["trackName"].match(new RegExp('^.*?(' + word + '.*?)$'))		
				if(matches != null && matches.length > 0){
					results.push(track)
				}
			}
		}
	}

	if(results.length <= 0) {
		console.log("Not found yet!")
	}

	else {
		console.log("RESULTS: " + JSON.stringify(results))
	}

	return results
}



