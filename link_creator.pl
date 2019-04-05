#! /usr/bin/perl

=head1 NAME

  link_creator.pl

=head1 VERSION

  v0.0.15

=head1 DESCRIPTION

  This is a script that helps to normalize some patterns of track names. The idea is run a music directory tree 
  and build a list in JSON format with all tracks that it finds. 

=head1 USE

  perl link_creator.pl

=head1 AUTHOR

  Andre Carneiro L<mail:andregarciacarneiro@gmail.com>

=head1 LICENSE

  Copyright 2019 Andre Garcia Carneiro

  You can copy and distribute this code for non-commercial purporses only!

=cut


use strict;
use warnings;
use feature qw/say/;
use Data::Printer colored => 1;
use File::Find::Rule;
use Cwd;
use JSON::XS;
use MIME::Base64 qw/encode_base64 decode_base64/;
use DateTime;


my $test = 0; # get music from a local path. Test 0 depends of your config. In my case, gets from a NFS mountpoint with 10000 tracks
my $cwd = $test ? getcwd() . '/mp3Test' : getcwd() . '/mp3';
my $filelist;



sub buildFileIndex {

    # File find rule
    my $excludeDirs = File::Find::Rule->directory
                              ->name('/', 'var', 'www', '.AppleDouble') # Provide specific list of directories to *not* scan
                              ->prune          # don't go into it
                              ->discard;       # don't report it

    my $includeFiles = File::Find::Rule->file
                             ->name('*.mp3','*.flac'); # search by file extensions

    # my @files = File::Find::Rule->or( $excludeDirs, $includeFiles )
    #                             ->in($cwd);
    say "Trying to find music...";
    my @List;
    map{ push @List, $_ } File::Find::Rule->or( $excludeDirs, $includeFiles )
                                ->in($cwd);
    say "finished!";
    #my @List = map { $_=~ s!^.*?mp3!http://localhost/mp3!; "$_\n" } @files;
    return \@List;
}


 

sub main {
  my $debug = 1;

  open my $fh, ">", "list-new.json" or die $!;

  say "Building raw file list" if $debug;
  my @List = @{buildFileIndex()};
  my $re = qr!/home/andre/Projetos/Linkmusk/!;

#  say $fh '[';
  # say "Processing list";
  # say "List size: " . scalar(@List);
  my $struct = {};
  my $filteredTracksCounter = 0;
  my $lastAlbum = '';
  my %auxStruct;
  my $index = 0;
  foreach my $l(@List){
    $l =~ s/$re//;
    my @Items = split m!/!,$l;
    my $len = scalar(@Items);
    #say "LINE: $l";

    if($len > 0) {
      my ($artist,$album,$track) = ($Items[1],$Items[-2],$Items[-1]);
      
      if($len >= 6){
        ($artist,$album,$track) = ($Items[1],$Items[-3],$Items[-1]);
      }

      if($len == 5){
        ($artist,$album,$track) = ($Items[1],$Items[-2],$Items[-1]); 
      }

      if(defined($track) && length($track) > 0) {
        # removing crap from artist
        $artist =~ s/(|\s+(|-))discography.*$//i;
        
        # constructing the track struct
        $track =~ s/\.mp3//g;
        my $year = $1 if $album =~ /^(\d+).*$/;
        $year = 'no info' if( !defined($year) || $year eq '');
        if($year){
          $album =~ s/$year(\s|\s-|\.|\-|\s-(\s|))//;
        }
        $album =~ s/^-\s+//;
        
        # getting cover image paths
        @Items = split /\//,$l;
        pop @Items;
        my $coverBig = join '/',@Items;
        $coverBig .= '/cover-big.png';
        my $coverThumb = $coverBig;
        $coverThumb =~ s/big/thumb/;
        
        # building a track fingerprint using artist,album and the track name WITH THE EXTENSION

        my $fingerprint = encode_base64(join( '',($artist, $album, $track)));
        $fingerprint =~ s/\n//g;
        # Removing extension from track name
        $track =~ s/\.(mp3|flac|ogg)$//;
        
        # Normalizing(if is possible) track name, album and artist
        $album =~ s/\(|\[|\)|\]//g;
        $album =~ s/\-/ /g;
        $album =~ s/\–/ /g;
        $album =~ s/\./ /g;
        $album =~ s/\./ /g;
        $album =~ s/^\s+//;
        $album =~ s/\s+$//;
        my $pattern = qr/^$artist[^\d]+(\d{1,2})(\s+|\.|\-)+(.+?)$/;
        my ($trackInfo) = ($3) if $track =~ /$pattern/;
        $track =~ s/$pattern/$1$2 /;
        $track =~ s/\(|\[|\)|\]/ /g;
        $track =~ s/\-/ /g;
        $track =~ s/\./ /g;
        $track =~ s/\–/ /g;
        $track =~ s/^\s+//;
        $track =~ s/\s+$//;
        $track =~ s/(\s{2}+|\s{3}+)/ /;
        
        # if the results of normalization is just a number, concatenate track info(supposed track info)
        if($track =~ /^\d+$/){
          $track .= " $trackInfo";
        }        

        # Trying to make easier to get the supposed sequence of tracks
        my $supposedSequence;
        $supposedSequence = $1 if $track =~ /^(\d+).*?$/;
        $supposedSequence = '' if !defined($supposedSequence);
        $supposedSequence = int($supposedSequence) if $supposedSequence =~ /^\d+$/;

        # Creating a basic data structure
        my $link_struct = {
          "url" => $l,
          "artist" => $artist,
          "album" => $album,
          "trackName" => $track,
          "year" => $year,
          "cover-big" => $coverBig,
          "cover-thumb" => $coverThumb,
          "fingerprint" => $fingerprint,
          "supposedSequence" => $supposedSequence
        };
        push @{$struct->{$artist}->{$album}} , $link_struct;
        my $lastItem = $#List;
        # TODO Estudar um jeito mais eficiente.
        say "SUPPOSED_SEQUENCE($artist): $supposedSequence";
        if( "$supposedSequence" =~ /^\d+$/ ){  
          # getting an auxiliar structure when key is the supposed sequency number of the track
          foreach my $t(@{$struct->{$artist}->{$album}}){
            $auxStruct{$t->{'supposedSequence'}} = $t;
          }

          # getting tracks ordered by track sequence
          my @orderedTracks = ();
          my @keys = keys(%auxStruct);
          foreach my $k(sort {$a <=> $b}@keys){
            push @orderedTracks,$auxStruct{$k};
          }
          #p @orderedTracks;
          # cleanning up to do not fuck up with memory...
          %auxStruct = ();

          # Switch old track order of tracks to the new one.
          # When album and artist changes $oderedLen comes with zero of length          
          my $orderedLen = scalar(@orderedTracks);
          if( int($orderedLen) > 0){
            my $tracks = $struct->{$artist}->{$album};
            $struct->{$artist}->{$album} = \@orderedTracks;
          }
        }
        $filteredTracksCounter++;
      }
      $lastAlbum = $album;
    }
    $index++;
  }
  say "Filtered tracks found: $filteredTracksCounter";
  say "Total of found tracks: $index";
  
  say "Saving on 'list-new.json' file!";
  say $fh JSON::XS->new->pretty(1)->encode($struct) ;
  
  say "All done!";
}

 
main()
