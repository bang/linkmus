# linkmusK
A extreme simplory remote music indexer and player for using at home. All made in Vanilla Javascript


## Description

If you have the desire to have your own music source to listen from anywhere I have a mediocre and simple solution. Javascript + some http server + HTML frontend + NFS for make all acessible



The main idea is have a music repository, (in my case, a NFS mount point). Then, I ran a Perl script to create a list of music that generates a JSON list. This list is put on directory for Javascript load it and transform everything in HTML. Simple, huh?



## Version

v0.0.4



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
* Node + express + forever for backend - But, whatever... 
* local or remote music location mapped on 'mp3' directory



## Installing

1. Clone the repo

   - `git clone git@github.com:bang/linkmusk.git`

     or download from [here](https://github.com/bang/linkmusk/archive/master.zip)

     

2. Install Node/npm + express

   `sudo apt install node npm node-express node-forever-agent`

   

   `cd linkmusik && npm install` to install **Node** dependecies

   

3. Create two directories

   `mkdir resources && mkdir mp3`

   
   * The *resources* directory will contain your music list(JSON file called 'list.json')
   * The *mp3* directory obviously will contain your music subdirectories and files

   

4. Mapping the music location

   

   Well, there is many ways to do this. The way I choose is NFS.

   If you choose NFS to, follow the steps at bellow:

   

   **Step 1** - export environment variable for NFS

   `export LINKMUSK_NFS_ROOT=192.168.1.103/some/path/to/music`

   

   **Step 2** - run 'get-music' script

   `./get-music`

   

   Now, check if your music sub-directories are on 'mp3' dir. If not, you must check if you have NFS available in your $LINKMUSK_NFS_ROOT and if you have permission to access.

   

5. Generate JSON music list running the command:

   `perl link_creator.pl`

   

   **Warning!!** This script is not "magical"! For mapping the subdirectories, is expected the paths contains:

   

   * The artist name
   * The Album name
   * track name with the sequence number at the beginning of name

   

   Example: *AC_DC/Ballbraker/11-Ballbraker.mp3*

   

   Some subdivisions are expected and filtered. For example:

   

   *Black-Sabbath/Studio/Remasterized/Black-Sabbath/04-(Black-Sabbath)[Studio-Remasterized]N.I.B..mp3*

   

   This will be(well, should be) "normalized" to this:

   

   *Black-Sabbath/Black-Sabbath/04-NIB.mp3*

   

   And the answer **yes!** You need to have the index number that contain the sequence information of the track **at the beginning** of the track name!!! 

   

   Can be mixed with other information, but must start with the number. Otherwise is not guaranteed that sequence will be ok nor the track name. 

   

   Now, copy 'list-new.json' file to *resources* file changing name to 'list.json'

   `cp list-new.json resources/list.json`

   

6. Export your port enviroment variable

   `export LINKMUSIK_HTTP_PORT=8080`

   

7. Finally! Run your app with *forever* agent

   `forever app.js`







## Notes for this version

* Playlist system was born finally! But is not possible to save playlist yet. Working at

  


## Limitations

* Pseudo-theme support. Working at

* Poor documentation

* No mobile support

* Limited playlist support. Just three playlists can be created and no one can be saved yet

* 'Smooth' scrolling after search results doesn't working in Chrome yet. Just 'jump' to results!

* Environment is limited to use NFS. I should make this more dynamic.. 
  

## Bugs

* player timeline animation is not totally right.

* Everything freezes if tree of music loading fails;

* Search fails in some cases on Firefox(working at)

* A yellow div is appearing from nowhere when user click in some regions. Investigating

  


## Author

Andre Garcia Carneiro bang@github.com



## License

Copyright 2019 André Garcia Carneiro


You can copy, modify and distribute **only for non-commercial** purposes.



