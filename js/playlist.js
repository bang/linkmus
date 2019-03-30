/*playlist.js - Playlist matters
	version: 0.0.1
*/


function treatTab(e){
	element = this
	tabIndex = element.id.replace(/tab/,'')
	activePlaylist = Playlists[tabIndex - 1]
	console.log("ACTIVE PLAYLIST: " + activePlaylist.name)
	console.log(activePlaylist)
}

// tabs event listeners
document.querySelector('#tab1').addEventListener('mouseup',treatTab,false)
document.querySelector('#tab2').addEventListener('mouseup',treatTab,false)
document.querySelector('#tab3').addEventListener('mouseup',treatTab,false)

class Playlist {

	constructor(name=''){
		if(name == '' || name == null || name === undefined) name = 'PlayList-' + Math.floor((Math.random() * 700000000) + 1);
		this.name = name;
		this.tracks = new Array();
		this.dtCreation=getCurrentDateTime()
	}

	//BASIC OPERATIONS
	addTrack(track) {
		if(! this.findTrack('fingerprint',track.fingerprint)){
			this.tracks.push(track);
		}
		else {
			console.log("Track already included '" + track.trackName + "'")
		}
	}

	addTracks(tracks) {
		self.tracks = concatArray(self.tracks,tracks);
	}

	findTrack(by,target){
		switch(by){
			case 'trackName':
				return this.findTrackByName(target);
				break;
			case 'fingerprint':
				return this.findTrackByFingerprint(target)
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

	findTrackByFingerprint(target){
		if(target === undefined || target == null || target == ''){
			console.error("fingerprint is not defined!!!! Panic!")
		}
		else {
			console.log("FINGERPRINT ON TARGET(SUPPOSED): " + target)
			for( i in this.tracks){
				track = this.tracks[i];
				if(track != null && track != undefined && track.fingerprint == target){
					return track
				}
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

	render(elementId){
		console.log("elementID: " + elementId)
		let element	= document.querySelector('#' + elementId + ' * table > tbody')
		element.innerHTML = ""
		
		//Adding th
		let thNames = new Array('Index','Artist','Album','Track','Year')
		let tr = document.createElement('tr')
		for(let i in thNames){
			
			let th = tr.appendChild(document.createElement('th'))
			th.appendChild(document.createTextNode(thNames[i]))
			element.appendChild(tr)	
		}
		
		//Adding a line for each track
		for(let i in this.tracks){
			let index = parseInt(i) + 1
			let track = this.tracks[i]
			let tr = document.createElement('tr')
			let targetColumns = new Array('artist','album','trackName','year')
			// creating the index column
			let td = tr.appendChild(document.createElement('td'))
			td.appendChild(document.createTextNode(index))
			for (let kindex in targetColumns){
				let key = targetColumns[kindex]
				console.log('key: ' + key)
				let td = tr.appendChild(document.createElement('td'))
				//td.innerHTML = track[key]
				td.appendChild(document.createTextNode(track[key]))
				element.appendChild(tr)
			}
		}
	}

	// PERSISTENCE MATTERS
	store(){
		localStorage.setItem(this.name,JSON.stringify(this))
	}

	retrieve(key){
		var value = localStorage.getItem(key);
    	var jsonObj = value && JSON.parse(value);
    	var instance = new Playlist(key);
    	instance.dtCreation = jsonObj.dtCreation;
    	instance.tracks = jsonObj.tracks

    	return instance
	}
}

