/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="musiccontroller.ts" />
$(function () {
    //GET ARTIST ALSBUM
    $('.artist-wrapper').click(function () {
        var id = $(this).attr('data-id');
        var musicCtr = new musicApp.MusicController();
        musicCtr.getAlbums(id, updateAlbumsPanel);
    });
    //SET UP PLAY-PAUSE BUTTON
    $('#pause-song').hide();
    $('.play-button').click(function () {
        if ($(this).hasClass('play-button-play')) {
            $(this).removeClass('play-button-play');
            $(this).addClass('play-button-pause');
            $('#pause-song').show();
            $('#play-song').hide();
        }
        else if ($(this).hasClass('play-button-pause')) {
            $(this).removeClass('play-button-pause');
            $(this).addClass('play-button-play');
            $('#pause-song').hide();
            $('#play-song').show();
        }
    });
    /*LOAD ALBUMS OF FIRST ARTIST ON START UP*/
    var firstArtistId = $('.artist-wrapper').first().attr('data-id');
    $.ajax({
        url: "/Music/GetAlbums",
        data: { artistId: firstArtistId },
        success: function (data) {
            $('#albums_wrapper').empty();
            $('#albums_wrapper').html(data);
        }
    });
});
function updateAlbumsPanel(data) {
    alert(data);
    $('#albums_wrapper').empty();
    $('#albums_wrapper').html(data);
}
;
function expandSongs(albumId) {
    console.log(albumId);
    $('#songs_of_' + albumId).slideToggle();
}
;
function selectSong(artistName, albumName, songName) {
    $('#artist_name').html(artistName);
    $('#album_name').html(albumName);
    $('#song_name').html(songName.substr(0, 35));
}
;
//# sourceMappingURL=EventHandlerRegistory.js.map