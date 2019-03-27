use strict;
use warnings;
use feature qw/say/;
use Data::Printer colored => 1;
use File::Find::Rule;
use Cwd;
use JSON::XS;

my $cwd = getcwd() . '/mp3';
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

    my @List;
    map{ push @List, $_ } File::Find::Rule->or( $excludeDirs, $includeFiles )
                                ->in($cwd);

    #my @List = map { $_=~ s!^.*?mp3!http://localhost/mp3!; "$_\n" } @files;
    return \@List;
}


 

sub main {
  my $debug = 1;
  open my $fh, ">", "list-new.json" or die $!;

  say "Building raw file list" if $debug;
  my @List = @{buildFileIndex()};
  #my $re = qr!/home/andre/Projetos/Linkmusk/!;

#  say $fh '[';
  # say "Processing list";
  # say "List size: " . scalar(@List);
  my $struct = {};
  my $tracksCounter = 0;
  foreach my $l(@List){
    $l =~ s/^.*mp3/mp3/;
    my @Items = split m!/!,$l;
    my $len = scalar(@Items);
    #say "LINE: $l";
    
    if($len > 0) {
      my ($artist,$album,$track) = ($Items[1],$Items[-2],$Items[-1]);
      
      if($len >= 6){
        ($artist,$album,$track) = ($Items[1],$Items[-3],$Items[-1]);
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

        # Removing extension from track name
        $track =~ s/\.(mp3|flac|ogg)$//;
        
        my $link_struct = {
                          "url" => $l,
                          "artist" => $artist,
                          "album" => $album,
                          "trackName" => $track,
                          "year" => $year
                        };
        # if($album_feature ne 'Unknown'){
        #   $link_struct->{'album_feature'} = $album_feature;
        # }

        push @{$struct->{$artist}->{$album}} , $link_struct;
        $tracksCounter++;
      }
    }
  }
  say "Tracks found: $tracksCounter";
  say "Saving on 'list-new.json' file!";
  say $fh JSON::XS->new->pretty(1)->encode($struct) ;
  say "Done!"
}

 
main()
