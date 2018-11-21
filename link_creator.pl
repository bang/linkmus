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
  my $re = qr!/home/andre/Projetos/Linkmus/!;

#  say $fh '[';
  my $struct = {};
  foreach my $l(@List){
    $l =~ s/$re//;
    my @Items = split m!/!,$l;
    my $len = scalar(@Items);
    say "LINE: $l";
    if($len > 0) {
      my ($artist,$album_feature,$album,$track) = ('Unknown','Unknown','Unknown','Unknown');
    

      # if($len == 2) {
      #   $track = $Items[1];
      # }
      # elsif($len == 3){
      #   ($artist,$track) = ($Items[1],$Items[2]);
      # }
      if($len == 4){
        ($artist,$album,$track) = ($Items[1],$Items[2],$Items[3]);
      }
      elsif($len == 5){
        ($artist,$album_feature,$album,$track) = ($Items[1],$Items[2],$Items[3],$Items[4]); 
      }
      else { #ignoring 'exoteric' paths
        next;
      }
      # elsif($len == 5){
      #  ($artist,$album,$track) = ($Items[1],$Items[3],$Items[4]); 
      # }
      # elsif($len == 6){
      #  ($artist,$album,$track) = ($Items[1],$Items[3],$Items[$len - 1]); 
      # }
      # else {
      #   $track = $Items[$len - 1];
      # }
      if(defined($track) && length($track) > 0) {
        # removing crap from artist
        $artist =~ s/(|\s+(|-))discography.*$//i;
        
        # constructing the track struct
        $track =~ s/\.mp3//g;
        my $link_struct = {
                          "url" => $l,
                          "artist" => $artist,
                          "album" => $album,
                          "trackName" => $track
                        };
        if($album_feature ne 'Unknown'){
          $link_struct->{'album_feature'} = $album_feature;
        }

        push @{$struct->{$artist}->{$album}} , $link_struct;
      }
    }
  }

  say $fh JSON::XS->new->pretty(1)->encode($struct) ;

#  say $fh ']'

}

main()
