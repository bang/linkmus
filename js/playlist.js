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
		let r = false
		if(! this.findTrack('fingerprint',track.fingerprint)){
			this.tracks.push(track);
			r = true
		}
		else {
			console.log("Track already included '" + track.trackName + "'")
		}
		return r
	}

	addTracks(tracks) {
		// this.tracks = concatArray(this.tracks,tracks);
		for ( let i in tracks){
			track = tracks[i]
			this.addTrack(track)
		}
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

		for( let i in this.tracks){
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
			for( let i in this.tracks){
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
/*			case 'fingerprint':
				break*/
			default:
				console.error("The option '" + by + "' is invalid!")
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
		let element	= document.querySelector('#' + elementId + ' * table.playlist')
		element.innerHTML = ""
		
		//Adding th
		let thNames = new Array('Index','Artist','Album','Track','Year','Actions')
		let tr = document.createElement('tr')
		for(let i in thNames){
			
			let th = tr.appendChild(document.createElement('th'))
			th.setAttribute('class','playlist')
			th.appendChild(document.createTextNode(thNames[i]))
			element.appendChild(tr)	
		}
		
		//Adding a line for each track
		let tracks = this.tracks
		for(let i in this.tracks){
			let index = parseInt(i) + 1
			let pListId = this.name + '-' + index 
			let track = this.tracks[i]
			let tr = document.createElement('tr')
			tr.setAttribute('class','playlist')
			let targetColumns = new Array('artist','album','trackName','year','action')
			// creating the index column
			let td = tr.appendChild(document.createElement('td'))
			td.setAttribute('class','playlist')
			td.appendChild(document.createTextNode(index))
			let tdActions = undefined
			for (let kindex in targetColumns){
				let key = targetColumns[kindex]
				let td = tr.appendChild(document.createElement('td'))
				//td.innerHTML = track[key]
				td.appendChild(document.createTextNode(track[key]))
				element.appendChild(tr)
				
				if(targetColumns[kindex] == 'action'){
					// play action
					let actions = '<div class="playlist-actions"><div class="playlist-action"><a id="' + pListId + '" href="javascript:"> play</a></div></div>'
					
					// adding all actions to action column
					td.innerHTML = actions

					// adding mouse event listener to 'play' action 
					document.querySelector("#" + pListId).addEventListener('mouseup',function(){
						console.log("hey! I'm playing " + this.id )
						currentTrack = track 
						console.log("ON PAYLIST CURRENT TRACKS LIST")
						console.log(tracks)
						play(track, true, tracks)
					})



				}
			}
		}
	}

	// PERSISTENCE MATTERS
	store(){
		// save a playlist into localStorage
		localStorage.setItem(this.name,JSON.stringify(this))
		itemList = localStorage.getItem('itemsList')
		
		// mapping all playlists names in a list into localStorage
		if(itemsList == undefined || itemsList == null){
			itemsList = new Array()
		}

		itemsList.push(this.name)
		localStorage.setItem('itemsList',JSON.stringify(itemsList))

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

