/*playlist.js - Playlist matters
version: 0.0.1
*/

class Playlist {

	name=null;
	dtCreation=null;
	tracks;


	constructor(name){
		if(name == '' || name == null || name === undefined) name = 'PlayList-' + Math.floor((Math.random() * 700000000) + 1);
		this.name = name;
		this.tracks = new Array();
	}


	addTrack(track) {

		this.tracks.push(track);
	}

}

class Track {
	trackName = null;
	url = null;
	author = null;
	album = null;
	artist = null;
	albumIndex = null;
	genre = null;
	subgenre = null;

	constructor(trackName, url='',author='',album='',artist='',albumIndex=null,genre){

	}
}

class Artist {
	name = null;
	genre = null;
	subgenre = null;
	country= null;
	url=null

	constructor(url='',name='',album='',artist='',albumIndex=null,genre){

	}
}




