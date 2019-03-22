/*playlist.js - Playlist matters
version: 0.0.1
*/

//Importing utils.js
/*function loadScript(url,callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

//XHG - don't know how to solve this
function crap(){
	return true
}

console.log('loading utils from playlist module',crap)
loadScript('js/util.js')*/



class Playlist {

	name=null;
	dtCreation=null;
	tracks=null;
	crap=null;

	constructor(name=''){
		if(name == '' || name == null || name === undefined) name = 'PlayList-' + Math.floor((Math.random() * 700000000) + 1);
		this.name = name;
		this.tracks = new Array();
		this.dtCreation=getCurrentDateTime()
	}


	addTrack(track) {
		this.tracks.push(track);
	}

	addTracks(tracks) {
		self.tracks = concatArray(self.tracks,tracks);
	}

	findTrack(by,target){
		switch(by){
			case 'trackName':
				return this.findTrackByName(target);
				break;
			case 'uuid':
				break
			default:
				break;
		}
		return false;
	}

	findTrackByName(target){
		for( i in this.tracks){
			track = this.tracks[i];
			if(track != null && track != undefined && track.trackName == target){
				return track
			}
		}
		return false;
	}

	removeTrack(by,track){
		switch(by){
			case 'trackName':
				return this.removeTrackByName(target);
				break;
			case 'uuid':
				break
			default:
				break;
		}
		return false;
	}

	removeTrackByName(trackName){
		newList = new Array();
		for( i in this.tracks){
			track = this.tracks[i];
			if(track != null && track != undefined && track.trackName == target){
				continue;
			}
			else{
				newList.push(track)
			}
		}
		self.tracks = newList;
	}

	removeTrackByUUId(uuid){
		console.log("removeTrackByUUID is not implemented yet")
	}

	store(){
		localStorage.setItem(this.name,JSON.stringify(this))
	}

	retrieve(key){
		var value = localStorage.getItem(key);
    	var jsonObj = value && JSON.parse(value);
    	var instance = new Playlist(key);
    	instance.dtCreation = jsonObj.dtCreation;
    	instance.tracks = jsonObj.tracks
    	instance.crap=jsonObj.crap
    	return instance
	}

}

/*class Track {
	trackName = null;
	url = null;
	author = null;
	album = null;
	artist = null;
	albumIndex = null;
	genre = null;
	subgenre = null;

	constructor(trackName, url=null,author=null,album=null,artist=null,albumIndex=null,genre=null,subgenre=null){

	}
}

class Artist {
	name = null;
	genre = null;
	subgenre = null;
	country= null;
	url=null

	constructor(url=null,name=null,album=null,artist=null,albumIndex=null,genre){

	}
}



*/
