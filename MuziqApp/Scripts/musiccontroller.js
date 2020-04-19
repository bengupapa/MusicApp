/// <reference path="typings/jquery/jquery.d.ts" />
var musicApp;
(function (musicApp) {
    var MusicController = (function () {
        function MusicController() {
        }
        ;
        MusicController.prototype.getAlbums = function (artistID, callBackFunc) {
            $.ajax({
                url: "/Music/GetAlbums",
                data: { artistId: artistID },
                success: function (data) {
                    callBackFunc(data);
                }
            });
        };
        return MusicController;
    }());
    musicApp.MusicController = MusicController;
})(musicApp || (musicApp = {}));
//# sourceMappingURL=musiccontroller.js.map