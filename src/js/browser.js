;(function(window, undefiend){

    'use strict';

    var ua = navigator.userAgent.toLowerCase(),
        div = document.createElement("div"),
        canvas = document.createElement('canvas'),
        /**
         * 체크해야 하는 브라우저 추가
         */
        browserList = [
            {
                test: /safari|applewebkit/i,
                version: /version\/(\d+(\.?_?\d+)+)/i,
                name: 'safari'
            },
            {
                test: /chrome|crios|crmo/i,
                version: /(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,
                name: 'chrome'
            },
            {
                test: /firefox|iceweasel|fxios/i,
                version: /(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,
                name: 'firefox'
            },
            {
                test: /opera|opr/i,
                version: '',
                name: 'opera'
            },
            {
                test: /msie|trident/i,
                version: /(?:msie |rv:)(\d+(\.?_?\d+)+)/i,
                name: 'ie'
            },
            {
                test: /edg([ea]|ios)/i,
                version: /edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,
                name: 'edge'
            }
        ],
        /**
         * 체크해야 하는 HTML style Attribute 추가
         */
        cssCheckList = ['transition', 'transform', 'opacity'],
        respond = {
            /**
             * 반응형 분기점 작성
             */
            point: [
                {type:"r1", width:767},
                {type:"r2", width:1024},
                {type:"r3", width:"max"}
            ],
            mode: '',
            setCallBack: function(type, func){
                for(var i = respond.point.length; i--;){
                    if(respond.point[i].type === type){
                        if(respond.point[i].callback === undefined) respond.point[i].callback = [];
                        respond.point[i].callback.push(func);
                        break;
                    }
                }
            }
        },
        spec = {browser: {name:'unknown', version:''}, support: {}},
        i = 0,
        classList = [];

    for(i = browserList.length; i--;){
        if(browserList[i].test.test(ua)){
            var arr = ua.match(browserList[i].version);
            spec.browser = {
                name: browserList[i].name,
                version : arr && arr.length > 0 && arr[1] || ''
            };
            classList.push(browserList[i].name);
            break;
        }
    }

    spec.ios = (/ip(ad|hone|od)/i).test(ua);
    spec.android = (/android/i).test(ua);
    spec.platform = (/[^-]mobi/i).test(ua) ? 'mobile' : 'desktop';
    
    if(spec.ios) classList.push('ios');
    if(spec.android) classList.push('android');
    classList.push(spec.platform);

    spec.support.canvas = (window.HTMLCanvasElement && canvas.getContext && canvas.getContext('2d')) !== undefiend;
    for(i = cssCheckList.length; i--;){
        spec.support[cssCheckList[i]] = div.style[cssCheckList[i]] !== undefined;
    }

    for(var key in spec.support){
        if(spec.support[key]) classList.push(key);
    }


    function getWidth(){
        return  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function getMode(){
        var  w = getWidth(), i=0, len=respond.point.length, mode;
		for(i;i<len;i++){
			if(w <= respond.point[i].width || respond.point[i].width == "max" || i == len-1){
				mode = respond.point[i];
				break;
			}
		};
		return mode;
    }

    function change(){
        var allClass= document.documentElement.className,
            mode = getMode();
        
        if(mode.type !== respond.mode) {
            var i = respond.point.length,
                newClass = '',
                word = '';

            respond.mode = mode.type;
            for(i;i--;){
                word += respond.point[i].type;
                if(i !== 0) word += '|';
            }
            newClass = allClass.replace(new RegExp('\\b('+word+')\\b','g'), '') + ' ' + mode.type;
            document.documentElement.className =  newClass.replace(/  +/g, ' ');
            
            if(mode.callback !== undefined && mode.callback.length > 0){
                for(i = 0; i< mode.callback.length;i++){
                    mode.callback[i]();
                }
            }
        }
    }

    function bind(){
        if(respond.point.length > 0) {
            classList.push(getMode().type);
            if(window.addEventListener) window.addEventListener('resize', change, false );
            else if(window.attachEvent) window.attachEvent('resize', change );
        }
    }

    
    //ie8 이하 반응형 미적용
	if(spec.browser.name === 'ie' && spec.browser.version < 9){
		document.documentElement.className += " no-respond";
	}
	else {
        bind();
        document.documentElement.className = classList.join(' ');
    };
    
    window.__BROWSER = {
        spec: spec,
        respond: respond
    };
	
	
})(window);
