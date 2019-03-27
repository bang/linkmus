# linkmusK
	Extreme simplory music player wrote in Vanilla Javascript. But works... 

## Description

	I hate Spotify and internet radio in general. So, I decided to build this, 
	mapping my music from my personal NAS using NFS and JSON.

	After this, is just use some dynamic DNS or VPN provider and I can have my 
	own 'Spotify' without annoying advertising nor limitations. And don't forget 
	that is all free!
	
## Version

v0.0.3-rc3

## Features

* I've changed the project name from Linkus to LinkmusK because I wanted to!

* Searching engine(by album, artist or track name) fixed and tested on Chrome and Firefox

* 'Almost' theme support

* JSON music list

* NFS mapping. 

## Extra

* Express server for convenience(routes, file server, CORS, etc). You can use any http server. Whatever...


## Installing


1. Installing using Node with express

	* Clone this repo
		
		`git clone git@github.com:bang/linkmus.git`

		or download from [here](https://github.com/bang/linkmus/archive/master.zip)

	* Install Node and npm

	* Go to repo location and install dependecies with `npm install`

	* Open app.js and config the port. 

	* exec `forever app.js`


2. Installing with another http server

	* Google 'how to serve node app in nginx/apache/iis or whatever'! 


3. Mapping NFS(Linux only)

	* Enable NFS support on your NFS provider(NAS or wherever...)

	* open 'get-music' script and edit 'mountpoint' variable

	* run `./get-music` (root privileges/sudo is required)

	* To generate a new JSON music list, run `perl link_creator.pl`

	* move 'list-new.json' file to 'resources' directory

4. Mapping music in another way
	
	* If you want to keep the same structure, you need to put all your mp3
	 
## Notes for this version

* Searching engine tested on Chrome and Firefox(has issues yet. But it's much better!)

* Appearance on default theme(actually is the only theme right now) is better


## Limitations

* Less ugly!

* Pseudo-theme support. Working at

* Less ugly at the moment... 

* Theme support must be better! Trying to improve my CSS

* No mobile support

* No playlist support(working at)

* 'Smooth' search engine doesn't working in Chrome yet. But works!

## Bugs

* player timeline animation is not tottaly right.

* When NFS fails everything is freezing. 

* Search fails in some cases on Firefox(working at)


## Author

Andre Garica Carneiro bang@github.com




