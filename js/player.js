/*
	Name: 
		player.js

	Version: 
		0.0.1

	Description: This module is a handler for some player controllers: play, stop, pause, forward and backward. 
		


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
activePlaylist = undefined

// Everything starts after full list of music is loaded
loadJSON('/resources/list.json',function(response){
	//console.log(JSON.stringify(response));
	
	// Creating 3 empty playlists
	Playlists = []
	for(i in new Array(1,2,3)){
		index = parseInt(i) + 1;
		Playlists.push(new Playlist('Playlist' + index))
	}
	activePlaylist = Playlists[0]

	sources = JSON.parse(response);
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

	//generating play list from 'sources'
	genList(fullTracksList,"artist")

	//initialize by the first music

	audio.src = currentTrack.url;
	
	document.querySelector("#track-name").innerHTML = currentTrack.trackName
	document.querySelector("#track-album").innerHTML = currentTrack.album
	document.querySelector("#track-artist").innerHTML = currentTrack.artist

	// Doing 'auto next' when the music is finished
	audio.addEventListener('ended',function(){
			console.log("Next..." )
			console.log(currentTrack)
			next()
	},false);

	// TRACK TIME EVENTS
	audio.addEventListener('timeupdate',function(){
	    var currTime = audio.currentTime; //song is object of audio.  song= new Audio();
	    var formatedTime = formatTime(currTime)
	    document.querySelector('#track-time').innerHTML = formatedTime;   //Id where i have to print the total duration of song.
		
		if( duration != undefined && duration != null && duration > 0){
			var playPercent = 100 * (audio.currentTime / duration);
			playhead.style.marginLeft = playPercent + "%";
		}

	},false);

	// Track load metadata event
	audio.addEventListener('loadedmetadata',function(){
		document.querySelector('#track-duration').innerHTML = formatTime(audio.duration)		
	})

	// player control buttons events
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
		document.querySelector("#track-name").innerHTML = currentTrack.trackName
		document.querySelector("#track-artist").innerHTML = currentTrack.artist
	});

	document.querySelector('#btn_prev').addEventListener('click',function(){
		prev();
		document.querySelector("#track-name").innerHTML = currentTrack.trackName
		document.querySelector("#track-artist").innerHTML = currentTrack.artist
	});				

	// Treating audio 'play' event
	audio.addEventListener('play',function(){
		document.querySelector('#div_play').style.display="none";
		document.querySelector('#div_pause').style.display="inline-block";
		document.querySelector('#div_stop').style.display="inline-block";	
	},false);

	// Treating audio pause events
	audio.addEventListener('pause',function(){
		document.querySelector('#div_play').style.display="inline-block";
		document.querySelector('#div_pause').style.display="none";
		document.querySelector('#div_stop').style.display="none";	
	},false);				

	// Gets audio file duration
	audio.addEventListener("canplaythrough", function () {
		duration = audio.duration;
	}, false);

	// Timeline mouse click event handler
	timeline.addEventListener('mousedown',function(e) {
		pause()
		console.log("seekbar clicked")
		var x = e.pageX - e.currentTarget.offsetLeft; 
		var y = e.pageY - e.currentTarget.offsetTop;
		bRect = timeline.getBoundingClientRect();
		barPercentOnClick = 100 * ( x / bRect.width );
		if(barPercentOnClick < 5) {
			barPercentOnClick = 5;
		}
		/*console.log("barPercentOnClick: " + barPercentOnClick)
		console.log("DURATION: " + duration);*/

		
		currentTime = (duration * barPercentOnClick) / 100
			if( currentTime > duration ){
			currentTime = duration
		}
		//console.log("Current time: " + currentTime)
		var playPercent = 100 * (currentTime / duration);
		playhead.style.marginLeft = ( playPercent ) + "%";
		audio.currentTime = currentTime;
		play()
	})
		
})







function play(track,changeSrc=false){
	/*Start the 'audio' player
		Arguments:
			index: (int) track index inside 'sources' array
	*/
	if(track == undefined){
		track = currentTrack
	}

	if (audio === undefined || audio == null) {
		audio = document.querySelector('#player');
	}

	console.log("TRACK ON PLAYING...: " + JSON.stringify(track))
	//change source url only if needed. In this case, when some track from list is clicked.
	if(changeSrc) {
		audio.src = track.url;					
	}
	trackName = document.querySelector('#track-name');
	trackArtist = document.querySelector('#track-artist');
	trackAlbum = document.querySelector('#track-album');
	if(trackName != undefined){
		trackName.innerHTML=track.trackName;
		trackArtist.innerHTML=track.artist;
		trackAlbum.innerHTML=track.album
	}
	console.log("Playing...: " + track.trackName);
	console.log("URL...:" + track.url)
	audio.play();
	isPlaying = true;
	currentTrack = track;

	// Loading album images
	coverBig = track["cover-big"]
	coverThumb = track["cover-thumb"]
	document.querySelector('#cover-big').style.backgroundImage = 'url("' + coverBig + '")'
	document.querySelector('#cover-thumb').style.backgroundImage = 'url("' + coverThumb + '")'
	return true
}

function playAndMark(base64EncodedString){
	stop()
	stringTrack = Base64.decode(base64EncodedString)
	track = JSON.parse(stringTrack)
	play(track,true)
}

function stop(){
	/*Stop the audio player
		Arguments: no arguments
	*/
	isPlaying = false;
	audio.pause();
	audio.currentTime = 0;
}

function pause(){
	/*Pause the audio player
		Arguments: no arguments
	*/
	isPlaying = false;
	console.log("Pausing " + index + " ...:")
	audio.pause();
}

function prev() {
	/*change to the previous track on playlist controled by 'index' variable. If 
		music is the first track, previous will be the last music and so on.
		Arguments: no arguments
	*/
	console.log("currentTrack" + JSON.stringify(currentTrack))
	artistName = currentTrack["artist"]
	albumName = currentTrack["album"]
	trackName = currentTrack["trackName"]

	// from current track find the music
	album = sources[artistName][albumName]
	found = false;
	previousTrack = {}
	for(trackIndex = (fullTracksList.length - 1); trackIndex >= 0; trackIndex-- ){
		track = fullTracksList[trackIndex]
		if(found){
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
	play(previousTrack,true)
}

function next() {
	/*change to the next track on playlist controled by 'index' variable. If 
		music is the last track, next will be the first music and so on.
			Arguments: no arguments
	*/
	console.log("currentTrack" + JSON.stringify(currentTrack))
	artistName = currentTrack["artist"]
	albumName = currentTrack["album"]
	trackName = currentTrack["trackName"]

	// from current track find the music
	album = sources[artistName][albumName]
	found = false;
	nextTrack = {}
	for(trackIndex in fullTracksList ){
		//console.log("trackIndex: " + trackIndex)
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

function addToActivePlaylist(encoded){
	track = Base64.decode(encoded)
	var id = 1
	if(track != undefined && track != null){
		activePlaylist.addTrack(JSON.parse(track))
		for( i in Playlists ){
			index = parseInt(i)
			id = index + 1
			targetPL = Playlists[index]
			if(targetPL.name == activePlaylist.name){
				Playlists[index] = activePlaylist
				break
			}
		}
		Playlists[i].render("tab" + id)
/*		console.log("ACTIVE PLAY LIST: " + JSON.stringify(activePlaylist))
		console.log("PLALISTS[i]: " + JSON.stringify(Playlists))*/
	}
}

function genList(tracks,reference) {
	/*Generates a track's list based on JSON with metadata of the tracks. This file is generated by 'link_creator.pl' script.

	*/
	if( reference == undefined ) {
		reference = "artist"
	}
	list = document.querySelector("#list")

	switch(reference) {

		case "artist": 
			listStr = '<ul id="full-music-list">'
			for(artist in sources ) {
				listStr += '	<li id="' + artist + '" class="list-artist-title">' + artist
				listStr += '		<ul>'
				for(album in sources[artist]){
					if(sources[artist][album].length > 0) { // solving a bug in list generation on the client side.
						listStr += '			<li id="' + album + '" class="album">' + album	
						listStr += '				<ul>'			
						for(trackIndex in sources[artist][album]){
							track = sources[artist][album][trackIndex]
							pseudoTrackid = getTrackPseudoId(track)
							trackNameChanged = track.trackName
							encodedData = Base64.encode(JSON.stringify(track))
							if(trackNameChanged.length > 40){							
								trackNameChanged = track.trackName.substring(0,40) + ' . . . ';
							}
							listStr += '				<li class="track" title="' + track.trackName + '">'
							listStr += "<div class='track-matters'  > <div class='track-matters-link'><a title='" + track.trackName + "' href='javascript:' id=" + pseudoTrackid + " onclick=\"playAndMark(\'" + encodedData + "\')\" >" + trackNameChanged + "</a> </div>"
							listStr += "<div class='track-matters-actions'> <a href='javascript:void(0)' title='add track to active playlist' onclick=\"addToActivePlaylist(\'" + encodedData + "\')\" > + </a></div>"
							listStr += '				</li>'
						}
						listStr += '				</ul>'
						listStr += '			</li>'
					}
				}
				listStr += '		</ul>'
				listStr += '	</li>'
			}
			listStr += '</ul>'
		
			break;
		case "album": break;

		default: console.log("Invalid option to generate music list!")
	}
	
	//console.log(listStr)
	list.innerHTML = listStr;
}

