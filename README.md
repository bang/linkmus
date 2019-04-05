# linkmusK
Extreme simplory music player wrote in Vanilla Javascript. But, works!



## Description

If you have the desire to have your own music source to learn anywhere I have one of possible but simple solution. 



The main idea is have a music repository, (in my case, a NFS mount point). Then, I ran a Perl script to create a list of music that generates a JSON list. This list is put on directory for Javascript load it and transform everything in HTML. Simple, huh?



## Version

v0.0.4-rc1



## Features

* Searching engine(by album, artist or track name). Some issues but works...

* 'Almost' theme support

* music list

* playlist partial support(create and play it.)

* NFS mapping. Not required

  

## Extra

* Express server for convenience(routes, file server, CORS, etc). You can use any http server. Whatever...

  

# Pre-reqs



* Linux - Debian variants if it's possible
* Node + express + forever for backend - Again, you can use whatever you want but I made using Node.
* local or remote music location mapped on 'mp3' directory



## Installing


1. Installing using Node with express

  * Clone this repo

    `git clone git@github.com:bang/linkmus.git`

    or download from [here](https://github.com/bang/linkmus/archive/master.zip)

  * Install Node and npm

    

    `sudo apt install node npm node-express node-forever-agent`

    

  * Go to repo location and install dependecies with `npm install`

    

  * Create two directories

    `mkdir resources && mkdir mp3`

    The **resources** directory will contain your music list(JSON)

    

    The **mp3** directory obviously will contain your music files

    

  * If you're using *NFS*, export "LINKMUSK_NFS_ROOT" var to your music root

    `export LINKMUSK_NFS_ROOT=192.168.1.103/some/path/to/music`

    Now, run *get-music* script!

    `./get-music`

    

  * export "LINKMUSK_HTTP_PORT"

    `export LINKMUSIK_HTTP_PORT=80`

    

  * Finnaly, run the application using *forever* agent 

    `forever app.js`

    


2. Installing with another http server

  

  * "Duck duck go" it!

    



## Notes for this version

* Playlist system was born finally! But is not possible to save playlist yet. Working at

  


## Limitations

* Pseudo-theme support. Working at

* Poor documentation

* No mobile support

* Limited playlist support. Just three playlists can be created and no one can be saved yet

* 'Smooth' scrolling after search results doesn't working in Chrome yet. Just 'jump' to results!

  

## Bugs

* player timeline animation is not tottaly right.

* Everything freeze if tree of music loading fails;

* Search fails in some cases on Firefox(working at)

* A yellow div is appearing from nowhere when user click in some regions. Investigating

  


## Author

Andre Garcia Carneiro bang@github.com



## License

Copyright 2019 André Garcia Carneiro


You can copy, modify and distribute just for **non-commercial** purposes.



Copyright 2019 André Garcia Carneiro

