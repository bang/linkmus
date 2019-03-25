# linkmusK
	Extreme simplory music player wrote in Vanilla Javascript. But works... 

## Description

	I hate Spotify and internet radio in general. So, I decided to build this, 
	mapping my music from my personal NAS using NFS and JSON.

	After this, is just use some dynamic DNS or VPN provider and I can have my 
	own 'Spotify' without annoying advertising nor limitations. And don't forget 
	that is all free!
	
## Version

v0.0.3

## Features

* I've changed project from Linkus to LinkmusK because I want to!

* Searching engine(by album, artist or track name) 

* 'Almost' theme support

* JSON music list

* NFS mapping. 

## Extra

* Express server for convenience(routes, file server, CORS, etc). You can use any http server. Whatever...


## Limitations

* Less ugly!

* Pseudo-theme support. Working at

* Less ugly at the moment... come on! I'm not a designer!

* Theme support must be better! Trying to improve my CSS

* No mobile support

* No playlist support(working at)

## Bugs

* player timeline animation is not tottaly right.

* When NFS fails everything is freezing. 


## Installing


1. Installing using Node with express

	* Clone this repo
		
		`git clone git@github.com:bang/linkmus.git`

		or download from [https://github.com/bang/linkmus/archive/master.zip](here)

	* Install Node and npm

	* Go to repo location and install dependecies with `npm install`

	* Open app.js and config the port. 

	* exec `forever app.js`


2. Installing with another https

	* Google it!

	 
## Notes for this version

* Searching engine is completly refactored

* Appearance on default theme(actually is the only theme right now) is better

* There is no playlist support yet as I said before!

## Author

Andre Garica Carneiro bang@github.com




