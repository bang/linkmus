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
                             ->name('*.mp3'); # search by file extensions

    # my @files = File::Find::Rule->or( $excludeDirs, $includeFiles )
    #                             ->in($cwd);

    my @List;
    map{ push @List, $_ } File::Find::Rule->or( $excludeDirs, $includeFiles )
                                ->in($cwd);

    #my @List = map { $_=~ s!^.*?mp3!http://localhost/mp3!; "$_\n" } @files;
    return \@List;
}


 


sub main {

  open my $fh, ">", "list.json" or die $!;

  my @List = @{buildFileIndex()};
  my $re = qr!/home/andre/Projetos/Linkc/!;

  say $fh '[';
  foreach my $l(@List){
    my $struct = {};
    $l =~ s/$re//;
    my @Items = split m!/!,$l;
    my $len = scalar(@Items);

    if($len > 0) {
      my ($artist,$album,$song) = ('Unknown','Unknown','Unknown');
    
      if($len == 2) {
        $song = $Items[1];
      }
      elsif($len == 3){
        ($artist,$song) = ($Items[1],$Items[2]);
      }
      elsif($len == 4){
        ($artist,$album,$song) = ($Items[1],$Items[2],$Items[3]);
      }
      elsif($len == 5){
       ($artist,$album,$song) = ($Items[1],$Items[3],$Items[4]); 
      }
      elsif($len == 6){
       ($artist,$album,$song) = ($Items[1],$Items[3],$Items[$len - 1]); 
      }
      else {
        $song = $Items[$len - 1];
      }
      $song =~ s/\.mp3// if(defined($song) && length($song) > 0);
      
      $struct = { "url" => $l,
                  "artist" => $artist,
                  "album" => $album,
                  "songName" => $song
      };

      say $fh JSON::XS->new->pretty(1)->encode($struct);
    }
  }

  say $fh ']'

}

main()