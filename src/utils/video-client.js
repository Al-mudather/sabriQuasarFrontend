class videoPlayer {
    constructor(mode,auth_url) {
        this.auth_url=auth_url // /get_hls
        this.mode=mode
    }
    init = function(){
        var self=this
        return new Promise(function (resolve,reject) {
            
            self.lazyLoad("src/assets/css/video-js.min.css")
            self.lazyLoad("src/assets/css/videojs-http-source-selector.css")
            self.lazyLoad("src/assets/css/videojs-fantasy-theme.css")

            self.lazyLoad('public/video.min.js',function () {
                self.lazyLoad('public/videojs-contrib-eme.js',function () {
                    self.lazyLoad('public/videojs-contrib-quality-levels.min.js',function () {
                        self.lazyLoad('public/videojs-http-source-selector.min.js',function () {
                            self.lazyLoad('public/videojs-http-streaming.min.js', function () {
                                resolve(true)
                            })
                        })
                    })
                })
            })
        })
    }
    lazyLoad = function(src,callback) {
        if(src.endsWith("css")){
            let isLoaded = document.querySelectorAll(`[href='${src}']`);
            if (isLoaded.length > 0) {
                return;
            }
            let myScript = document.createElement("link");
            myScript.href = src;
            myScript.type="application/javascript"
            document.body.appendChild(myScript);
            
            if (callback)
                myScript.onload = callback
                
        }
        else if(src.endsWith("js")){
            let isLoaded = document.querySelectorAll(`[src='${src}']`);
            if (isLoaded.length > 0) {
                return;
            }
            let myScript = document.createElement("script");
            myScript.src = src;
            document.body.appendChild(myScript);
            if (callback)
                myScript.onload = callback
        }
    }
    play = function(videoParentElement,path,enrolment_id,course_id, token){
        var self=this
        if(self.player)
            self.player.dispose();
        document.querySelector(videoParentElement).innerHTML = ''
        document.querySelector(videoParentElement).innerHTML= `<video playsinline id='video-player' style='width: 100%; height: 100%;' class="video-js  vjs-theme-fantasy" controls> </video>`
        self.player = videojs('video-player', {
            html5: {
                vhs: {
                    cacheEncryptionKeys: true
                }
            },
            playbackRates: [0.5, 1, 1.5, 2]
        });

        self.player.eme();
        videojs.Hls.xhr.beforeRequest = function (options) {

            if(options.uri.includes('get_hls'))
                options.uri=self.auth_url+`/${path}/${enrolment_id}/${course_id}`;
                options.headers = options.headers || {};
                if (token) options.headers.Authorization = `JWT ${token}`;

            return options;
        };
        self.player.ready(function() {
            self.player.httpSourceSelector();
        });

        self.player.src([{
            // src: 'https://goron.smart-node.net/'+path+'/hls/playlist.m3u8',
            src: 'https://goron.smart-node.net/'+path+'/hls/playlist.m3u8',
            type: 'application/x-mpegURL',
            //withCredentials: true
        }]);
    }
    uninitializeTheVideo = function () {
        var self=this
        if (self.player) {
            self.player.dispose();
        }
    }

}
export default videoPlayer