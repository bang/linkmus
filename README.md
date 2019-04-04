# linkmusK
	Extreme simplory music player wrote in Vanilla Javascript. But works... 

## Description

	Since that I decide that I'm done with "free" music radios I've been building this 
	modest but sincer music player for my and my family's enjoyment.
	
	I hope nothing special, just a simple solution for listen my music wherever I am.
	
	Resuming, it works like this: There is a JSON file with all music('resources/list.json'). System loads this file
	and builds a "tree of music" hierarchically divided by: artist > album > track. Everything else is
	around of this including searching engine, playlists and music player itself.
	
	The music player can receive music from the main tree or from **active playlist**. But, if there is no 
	active playlist, the player starts from the first music of the "tree".
	
	Playlists is a list of tracks choosed from the "tree". For now it's possible just 3 playlists. 
	
	

## Version

v0.0.3-rc3

## Features

* Searching engine(by album, artist or track name). Some issues yet, but works...

* 'Almost' theme support

* music list

* NFS mapping. Not required

* Poor documentation

  

## Extra

* Express server for convenience(routes, file server, CORS, etc). You can use any http server. Whatever...

  

# Pre-reqs

* Linux - Debian variants if it's possible

* Node + express + forever for backend - Again, you can use whatever you want but I made it using Node(not required, but this is default).

* local or remote music location mapped on 'mp3' directory



## Installing


1. Installing using Node with express

  * Clone this repo

    `git clone git@github.com:bang/linkmus.git`

    or download from [here](https://github.com/bang/linkmus/archive/master.zip)

  * Install Node and npm

    

    `sudo apt install node npm node-express node-forever-agent`

    

  * Go to repo location and install dependecies with `npm install`

    

  * Open app.js and config the port
  
  
  * Supposing your music location is available on 'mp3' directory just the exec Perl script called `link_creator.pl`. This will
  create a JSON file called `list-new.json`. Check this file and if it's allright, copy this file to `resources` directory as
  `list.json`
   

  * exec `forever app.js`
  
  
  * You're done!

    


2. Installing with another http server

  

  * "Duck duck go" it!

    


3. Mapping NFS(Linux only)

  

  * Enable NFS support on your NFS provider(NAS or whatever...), and don't forget to configure the permissions!

  * open 'get-music' script and edit '$mountpoint' variable

  * run `./get-music` (root privileges/sudo is probably required)


  
## Notes for this version

* Searching engine tested on Chrome and Firefox(has issues yet. But it's much better!)

* Appearance improved
  


## Limitations

* Less ugly!

* Pseudo-theme support. Working at

* Less ugly at the moment... 

* Theme support must be better! Trying to improve my CSS

* No mobile support

* No playlist support(working at)

* 'Smooth' scrolling after search results doesn't working in Chrome yet. Just 'jump' to results!

  

## Bugs

* player timeline animation is not tottaly right.

* Everything freeze if tree of music loading fails;

* Search engine fails in some cases on Firefox(working at)
  


## Author

Andre Garcia Carneiro bang@github.com



## License

Copyright 2019 André Garcia Carneiro

You can copy, modify and distribute just for **non-commercial** purposes.




