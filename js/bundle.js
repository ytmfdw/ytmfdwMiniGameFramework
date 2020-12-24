(function () {
    'use strict';

    var WxConfig;
    (function (WxConfig) {
        //是否开启Debug
        WxConfig.DEBUG = false;
        //版本号
        WxConfig.VERSION = '0_0_1';
        //中文名称
        WxConfig.APP_CNAME = '';
        //英文名称
        WxConfig.APPNAME = '';
        //appid
        WxConfig.APPID = '';
        //广告相关的id
        WxConfig.BANNER_ID = "";
        WxConfig.VIDEO_ID = "";
        WxConfig.INSTER_ID = "";
        WxConfig.GRID_ID1 = "";
        WxConfig.GRID_ID2 = "";
        WxConfig.GRID_ID3 = "";
        //声音相关文件
        WxConfig.GAME_BG_MUSIC = "";
        WxConfig.CHOOSE = "";
        WxConfig.DEATH_SOUND = "";
        WxConfig.LEVELCOMPLETED = "";
        WxConfig.SEND_SOUND = "";
        WxConfig.TYPEWRITE_SOUND = "";
        WxConfig.CLICK_SOUND = "";
        WxConfig.LOSER_SOUND = "";
        WxConfig.POP_SOUND = "";
        //导量设置 
        WxConfig.NAV_DATA = [

        ];
        //游戏状态
        WxConfig.GAME_STATE = {
            NONE: -1,
            PLAYING: 0,
            PAUSE: 1,
            ANI: 2,
            GAMEOVER: 3,
            DEATH: 4,
            INIT: 5,
            JUMP: 6,
            DISSMISS: 7
        };
        //玩家过的关卡数
        WxConfig.level = 0;
        //屏幕安世高
        WxConfig.SCREENHEIGHT = 1920;
        WxConfig.appListHeight = 1550;
        //状态相关
        WxConfig.STATE_NORMAL = 1;
        WxConfig.STATE_SELECTED = 2;
        WxConfig.STATE_LOCKED = 3;
        WxConfig.STATE_BONUS = 4;
        WxConfig.CHARGE_DIALOG_HOME = 1;
        WxConfig.CHARGE_DIALOG_GAME = 2;
        WxConfig.HELP_COIN_NUM = 3;
        WxConfig.GAME_BANNER_HEIGHT = 100;
        WxConfig.IPHONEX_TOP = 100;
        WxConfig.LARGE_PHONE_H = 2000;
        WxConfig.PAGE_PASS = 1;
        WxConfig.WX_SHARE_KEY = 'sharedContent';
        WxConfig.ALL_LEVEL_KEY = "all_level_" + WxConfig.APPNAME;
        WxConfig.FREE_TIP_COUNT = "freeTipCountKey";
        WxConfig.LEVEL_SCORE_STR = 'levelScoreStr';
        WxConfig.levelScoreObj = {};
        //题目数量，题目放在分包中，使用分包加载，完成后再计算下题目数量
        WxConfig.allQuestionLen = 100;
        //接收分包加载的题目
        WxConfig.questions = [];
        //分享状态
        WxConfig.ShareState = {
            TIP: 1,
            BONUS: 2,
            LGBONUS: 3,
            CHARGE: 4,
            GROUPRANK: 5,
            INVITE: 6,
            MENU: 7,
            MONEY: 8,
            DOUBLE: 9,
            OTHER: 0
        };
        WxConfig.openDataKey = 'level';
        WxConfig.QUES = [];
        WxConfig.ifIphoneX = false;
        WxConfig.isLoadSubpackages = false;
        /**
         * 震动
         * @param {*} time 
         */
        function vibrate(time) {
            var isNoVibrate = wx.getStorageSync(WxConfig.NOVIRBATE);
            if (isNoVibrate)
                return;
            let count = time / 15;
            let index = 0;
            let obj = {
                count: count,
                index: index
            };
            Laya.timer.loop(15, obj, function () {
                wx.vibrateShort();
                index++;
                if (index > count) {
                    Laya.timer.clearAll(obj);
                    obj = null;
                }
            });
        }
        WxConfig.vibrate = vibrate;

        function vibrateLong() {
            var isNoVibrate = wx.getStorageSync(WxConfig.NOVIRBATE);
            if (isNoVibrate)
                return;
            wx.vibrateLong();
        }
        WxConfig.vibrateLong = vibrateLong;
        /**
         * 统一打开开关
         * @param {*} msg 
         */
        function log(msg) {
            if (WxConfig.DEBUG) {
                console.log(msg);
            }
        }
        WxConfig.log = log;
        class Log {
            static d(msg = "") {
                if (WxConfig.DEBUG) {
                    console.log(msg);
                }
            }
            static e(msg = "") {
                console.error(msg);
            }
        }
        WxConfig.Log = Log;

        function showToast(data) {
            wx.showToast(data);
        }
        WxConfig.showToast = showToast;
        WxConfig.MUTE = "MUTE_KEY";
        WxConfig.MUTE_MUSIC = "MUTE_MUSIC_KEY";
        WxConfig.NOVIRBATE = "NOVIRBATE_KEY";
        WxConfig.isMute = false;
        WxConfig.isMuteMusic = false;
        WxConfig.isNoVirbate = false;
    })(WxConfig || (WxConfig = {}));
    /**
     * 声音工具类
     */
    class soundUtils {
        static playSound(music, vol) {
            if (WxConfig.isLoadSubpackages == false)
                return;
            if (WxConfig.isMute && WxConfig.isMute == true) {} else {
                Laya.SoundManager.playSound(music);
            }
        }
        static playBgMusic() {
            if (WxConfig.isLoadSubpackages == false)
                return;
            if (WxConfig.GAME_BG_MUSIC == null)
                return;
            if (WxConfig.isMuteMusic && WxConfig.isMuteMusic == true) {
                Laya.SoundManager.stopMusic();
            } else {
                Laya.SoundManager.playMusic(WxConfig.GAME_BG_MUSIC);
            }
        }
        static stopAllSound() {
            Laya.SoundManager.stopAllSound();
        }
    }
    /**
     * 小彩带
     */
    class SmallCaiDai extends Laya.Image {
        constructor() {
            super(...arguments);
            this.father = null;
            this.speedInitX = 1;
            this.speedInitY = 20;
            this.aInitX = 0.05;
            this.aInitY = 0.1;
        }
        init(father, x, y) {
            this.father = father;
            if (!this.skin) {
                let rnd = Math.floor(Math.random() * 7) + 1;
                this.skin = 'caidai/caidai' + rnd + '.png';
            }
            var scaleValue = Math.random() * 50;
            var w = scaleValue;
            var h = scaleValue;
            this.width = w;
            this.height = h;
            this.anchorX = 0.5;
            this.anchorY = 0.5;
            this.rotation = Math.random() * 360;
            this.pos(x ? x : 0, y ? y : 0);
            this.zOrder = 9999;
            this.father.addChild(this);
            let thiz = this;
            this.on(Laya.Event.REMOVED, this, function () {
                Laya.Pool.recover("SmallCaiDai", thiz);
            });
            this.popup();
        }
        recover() {
            let rnd = Math.floor(Math.random() * 7) + 1;
            this.skin = 'caidai/caidai' + rnd + '.png';
            var scaleValue = Math.random() * 50;
            var w = scaleValue;
            var h = scaleValue;
            this.width = w;
            this.height = h;
            this.anchorX = 0.5;
            this.anchorY = 0.5;
            this.rotation = Math.random() * 360;
            this.skewY = Math.random() * 360;
            this.zOrder = 9999;
            let thiz = this;
            Laya.Pool.recover("SmallCaiDai", thiz);
        }
        popup() {
            var thiz = this;
            var index = 0;
            var starX = this.x;
            var starY = this.y;
            var speedX = Math.random() >= 0.5 ? Math.random() * this.speedInitX : -Math.random() * this.speedInitX;
            var aX = ((Math.random() > 0.5) ? -Math.random() : Math.random()) * this.aInitX;
            var aY = this.aInitY;
            var speedY = -Math.random() * this.speedInitY;
            var skew = Math.random() * 10;
            Laya.timer.frameLoop(1, thiz, function () {
                if (thiz.x < 0 || thiz.x > thiz.father.width || thiz.y > thiz.father.height || thiz.y < 0) {
                    Laya.timer.clearAll(thiz);
                    thiz.removeSelf();
                    return;
                }
                thiz.skewY += skew;
                var moveY = speedY * index + 0.5 * aY * index * index;
                thiz.y = starY + moveY;
                if (thiz.y > 0) {
                    var moveX = speedX * index + 0.5 * aX * index * index;
                    thiz.x = starX + moveX;
                }
                index++;
            });
        }
    }
    class CaiDai {
        constructor(x, y, father) {
            this.father = null;
            this.baseCount = 50;
            this.rndMax = 50;
            this.father = father;
            this.loaded(x, y, this.father);
        }
        loaded(x, y, father) {
            let max = this.baseCount + Math.floor(Math.random() * this.rndMax);
            for (let i = 0; i < max; i++) {
                let caidai = Laya.Pool.getItemByClass('SmallCaiDai', SmallCaiDai);
                caidai.init(father, x, y);
            }
        }
        static init() {}
        static show(x, y, father) {
            soundUtils.playSound(WxConfig.SEND_SOUND);
            if (CaiDai.self) {
                CaiDai.self.loaded(x, y, father ? father : Laya.stage);
            } else {
                CaiDai.self = new CaiDai(x, y, father ? father : Laya.stage);
            }
        }
    }
    CaiDai.self = null;
    /**
     * 游戏框架逻辑
     */
    class Game {
        constructor() {
            this.isWX = false;
            this.isIos = true;
            this.isShareTip = false;
            this.isShareBonus = false;
            this.isShareLgBonus = false;
            this.isShareCharge = false;
            this.shareTicket = null;
            this.isLogin = false;
            this.isLoadAssets = false;
            this.onShowRes = null;
            this.QueryState = null;
            this.uid = '';
            this.freeTipCount = 0;
            this.TipCoinRate = 1.0;
            this.useTipCoinNum = 10;
            this.chargeCoinNum = 10;
            this.coinNum = 0;
            this.SHARED_URL = 'subassets/share.jpg';
            this.SHARED_TITLE = "这题好难啊~谁来帮帮我！T_T";
            this.SHARED_PARAM = "";
            this.SHARED_IMG_ARR = [{
                "id": "P0",
                "url": this.SHARED_URL,
                "t": this.SHARED_TITLE,
                "p": "",
                "min": 0,
                "max": 1
            }];
            this.userId = '';
            this.nickName = '';
            this.avatarUrl = '';
            this.all_level = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.screenWidth = 1080;
            this.screenHeight = 1920;
            this.pixelRatio = 1;
            this.userLevel = null;
            this.levelcount = null;
            this.levelArr = null;
            this.userButton = null;
            this.shareToGroupIdArr = [];
            this.shareCode = '';
            this.shareMoney = 0;
            this.shareMode = 1;
            this.shareUseTime = 4000;
            this.shareCancel = false;
            this.shareStartTime = 0;
            this.shareBackTime = 0;
            this.shareType = 0;
            this.shareQuery = '';
            this.nextChangeTime = 5000;
            this.scene = 0;
        }
        static getSelf() {
            if (!Game.self) {
                Game.self = new Game();
            }
            return Game.self;
        }
        getUserDataFromStorage() {
            WxConfig.log('Game Version: ' + WxConfig.VERSION);
            WxConfig.log('题目数量：' + WxConfig.allQuestionLen);
            var tmp_level = wx.getStorageSync(WxConfig.ALL_LEVEL_KEY);
            if (tmp_level === '' || tmp_level === undefined || tmp_level === null) {
                wx.setStorageSync(WxConfig.ALL_LEVEL_KEY, 0);
                this.all_level = 0;
            } else {
                this.all_level = Math.floor(tmp_level);
            }
            var tmp_coin = wx.getStorageSync('CoinNum');
            if (tmp_coin === '' || tmp_coin === undefined || tmp_coin === null) {
                this.coinNum = 10;
            } else {
                this.coinNum = Math.floor(tmp_coin);
            }
            this.getFreeTipCount();
        }
        getFreeTipCount() {
            let cache = wx.getStorageSync(WxConfig.FREE_TIP_COUNT);
            if (cache && !isNaN(cache)) {
                this.freeTipCount = cache;
            } else {
                this.freeTipCount = 0;
            }
        }
        addFreeTipCount(count) {
            this.getFreeTipCount();
            this.freeTipCount += count;
            if (this.freeTipCount < 0) {
                this.freeTipCount = 0;
            }
            wx.setStorageSync(WxConfig.FREE_TIP_COUNT, this.freeTipCount);
        }
        useFreeTipCount(count, callBack) {
            this.getFreeTipCount();
            if (this.freeTipCount < count) {
                callBack(false);
            } else {
                this.addFreeTipCount(-count);
                callBack(true);
            }
        }
    }
    Game.self = null;
    var game = Game.getSelf();
    /**
     * UI相关文件
     */
    var View = Laya.View;
    var Dialog = Laya.Dialog;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var dialog;
        (function (dialog) {
            class AddStepsDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(AddStepsDialogUI.uiView);
                }
            }
            AddStepsDialogUI.uiView = {
                "type": "Dialog",
                "props": {
                    "width": 900,
                    "height": 760
                },
                "compId": 1,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 322,
                        "x": 450,
                        "width": 900,
                        "var": "imgBg",
                        "skin": "subassets/comp/img_dialogBg.png",
                        "height": 644,
                        "anchorY": 0.5,
                        "anchorX": 0.5,
                        "sizeGrid": "156,40,123,40"
                    },
                    "compId": 2,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "y": 70,
                            "x": 450,
                            "width": 398,
                            "valign": "middle",
                            "text": "添加次数",
                            "skin": "subassets/skins/imgTextSheZhi.png",
                            "height": 78,
                            "fontSize": 60,
                            "color": "#ffffff",
                            "bold": true,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "align": "center"
                        },
                        "compId": 3
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 697,
                            "x": 450,
                            "width": 100,
                            "visible": false,
                            "var": "closeButton",
                            "skin": "subassets/comp/CloseButton.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 100,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 4
                    }, {
                        "type": "Label",
                        "props": {
                            "y": 296,
                            "x": 450,
                            "wordWrap": true,
                            "width": 808,
                            "valign": "middle",
                            "text": "看个小视频，休息下，免费添加3步",
                            "skin": "subassets/skins/imgTextSheZhi.png",
                            "leading": 25,
                            "height": 152,
                            "fontSize": 50,
                            "color": "#00f3fd",
                            "bold": false,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "align": "center"
                        },
                        "compId": 17
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 517,
                            "x": 239,
                            "width": 254,
                            "var": "btnShare",
                            "skin": "subassets/comp/btnBg.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 127,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 18,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 0,
                                "x": 0,
                                "width": 249,
                                "valign": "middle",
                                "text": "考考好友",
                                "strokeColor": "#115651",
                                "stroke": 5,
                                "height": 123,
                                "fontSize": 45,
                                "color": "#14e2ff",
                                "align": "center"
                            },
                            "compId": 20
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 517,
                            "x": 666,
                            "width": 254,
                            "var": "btnTip",
                            "skin": "subassets/comp/btnBg.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 127,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 19,
                        "child": [{
                            "type": "Sprite",
                            "props": {
                                "y": 29,
                                "x": 23,
                                "width": 73,
                                "texture": "subassets/comp/ads_icon.png",
                                "height": 69
                            },
                            "compId": 21
                        }, {
                            "type": "Label",
                            "props": {
                                "y": 0,
                                "x": 59,
                                "width": 190,
                                "valign": "middle",
                                "text": "添加",
                                "strokeColor": "#115651",
                                "stroke": 5,
                                "height": 123,
                                "fontSize": 45,
                                "color": "#14e2ff",
                                "align": "center"
                            },
                            "compId": 22
                        }]
                    }]
                }],
                "loadList": ["subassets/comp/img_dialogBg.png", "subassets/skins/imgTextSheZhi.png", "subassets/comp/CloseButton.png", "subassets/comp/btnBg.png", "subassets/comp/ads_icon.png"],
                "loadList3D": []
            };
            dialog.AddStepsDialogUI = AddStepsDialogUI;
            REG("ui.dialog.AddStepsDialogUI", AddStepsDialogUI);
            class DialogSettingUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(DialogSettingUI.uiView);
                }
            }
            DialogSettingUI.uiView = {
                "type": "Dialog",
                "props": {
                    "width": 900,
                    "height": 644
                },
                "compId": 1,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 322,
                        "x": 450,
                        "width": 900,
                        "var": "imgBg",
                        "skin": "subassets/comp/img_dialogBg.png",
                        "height": 644,
                        "anchorY": 0.5,
                        "anchorX": 0.5,
                        "sizeGrid": "156,40,123,40"
                    },
                    "compId": 2,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "y": 70,
                            "x": 450,
                            "width": 166,
                            "valign": "middle",
                            "text": "设  置",
                            "skin": "subassets/skins/imgTextSheZhi.png",
                            "height": 78,
                            "fontSize": 60,
                            "color": "#ffffff",
                            "bold": true,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "align": "center"
                        },
                        "compId": 3
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 70,
                            "x": 833,
                            "width": 100,
                            "var": "btnClose",
                            "skin": "subassets/comp/CloseButton.png",
                            "height": 100,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 4
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 180,
                            "x": 446,
                            "width": 700,
                            "var": "layoutMusic",
                            "skin": "subassets/comp/ScreenMask_HardwareGame.png",
                            "height": 130,
                            "anchorY": 0,
                            "anchorX": 0.5
                        },
                        "compId": 6,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 60,
                                "x": 100,
                                "width": 130,
                                "valign": "middle",
                                "text": "音  乐",
                                "skin": "subassets/skins/imgTextYinYue.png",
                                "height": 57,
                                "fontSize": 50,
                                "color": "#ffffff",
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "align": "center"
                            },
                            "compId": 9
                        }, {
                            "type": "CheckBox",
                            "props": {
                                "y": 18,
                                "x": 475,
                                "width": 199,
                                "var": "cbMusic",
                                "stateNum": 2,
                                "skin": "comp/img_checkbox.png",
                                "height": 94
                            },
                            "compId": 7
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 339,
                            "x": 446,
                            "width": 700,
                            "var": "layoutSound",
                            "skin": "subassets/comp/ScreenMask_HardwareGame.png",
                            "height": 130,
                            "anchorY": 0,
                            "anchorX": 0.5
                        },
                        "compId": 10,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 60,
                                "x": 100,
                                "width": 130,
                                "valign": "middle",
                                "text": "音  效",
                                "skin": "subassets/skins/imgTextYinXiao.png",
                                "height": 57,
                                "fontSize": 50,
                                "color": "#ffffff",
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "align": "center"
                            },
                            "compId": 11
                        }, {
                            "type": "CheckBox",
                            "props": {
                                "y": 16,
                                "x": 477,
                                "width": 202,
                                "var": "cbSound",
                                "stateNum": 2,
                                "skin": "comp/img_checkbox.png",
                                "height": 101
                            },
                            "compId": 12
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 498,
                            "x": 446,
                            "width": 700,
                            "var": "layoutVirbrate",
                            "skin": "subassets/comp/ScreenMask_HardwareGame.png",
                            "height": 130,
                            "anchorY": 0,
                            "anchorX": 0.5
                        },
                        "compId": 13,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 60,
                                "x": 100,
                                "width": 130,
                                "valign": "middle",
                                "text": "震  动",
                                "skin": "subassets/skins/imgTextZhenDong.png",
                                "height": 57,
                                "fontSize": 50,
                                "color": "#ffffff",
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "align": "center"
                            },
                            "compId": 14
                        }, {
                            "type": "CheckBox",
                            "props": {
                                "y": 19,
                                "x": 480,
                                "width": 202,
                                "var": "cbVirbrate",
                                "stateNum": 2,
                                "skin": "comp/img_checkbox.png",
                                "height": 98
                            },
                            "compId": 15
                        }]
                    }, {
                        "type": "Label",
                        "props": {
                            "y": 91,
                            "x": 29,
                            "width": 200,
                            "var": "versionLabel",
                            "valign": "middle",
                            "text": "版本：v0.0.1",
                            "height": 40,
                            "fontSize": 25,
                            "color": "#b4b4b4",
                            "align": "left"
                        },
                        "compId": 16
                    }]
                }],
                "loadList": ["subassets/comp/img_dialogBg.png", "subassets/skins/imgTextSheZhi.png", "subassets/comp/CloseButton.png", "subassets/comp/ScreenMask_HardwareGame.png", "subassets/skins/imgTextYinYue.png", "comp/img_checkbox.png", "subassets/skins/imgTextYinXiao.png", "subassets/skins/imgTextZhenDong.png"],
                "loadList3D": []
            };
            dialog.DialogSettingUI = DialogSettingUI;
            REG("ui.dialog.DialogSettingUI", DialogSettingUI);
        })(dialog = ui.dialog || (ui.dialog = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var page;
        (function (page) {
            class GameInfoUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameInfoUI.uiView);
                }
            }
            GameInfoUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 1080,
                    "height": 2000
                },
                "compId": 1,
                "child": [{
                    "type": "Sprite",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "width": 1080,
                        "var": "layout",
                        "height": 1920
                    },
                    "compId": 116
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 10,
                        "x": 0,
                        "width": 1080,
                        "visible": false,
                        "var": "layoutLabel",
                        "height": 100
                    },
                    "compId": 31,
                    "child": [{
                        "type": "Text",
                        "props": {
                            "y": 0,
                            "x": 540,
                            "width": 300,
                            "var": "labelLevel",
                            "valign": "middle",
                            "text": "第 30 关",
                            "pivotX": 150,
                            "height": 100,
                            "fontSize": 60,
                            "font": "Arial",
                            "color": "#8be2ff",
                            "bold": true,
                            "align": "center",
                            "runtime": "laya.display.Text"
                        },
                        "compId": 30
                    }]
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 130,
                        "x": 0,
                        "width": 1080,
                        "visible": false,
                        "var": "topNavLayout",
                        "height": 270
                    },
                    "compId": 40
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 1630,
                        "x": 0,
                        "width": 1080,
                        "var": "btnTipLayout",
                        "height": 10
                    },
                    "compId": 14
                }],
                "loadList": [],
                "loadList3D": []
            };
            page.GameInfoUI = GameInfoUI;
            REG("ui.page.GameInfoUI", GameInfoUI);
            class LoadPageUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadPageUI.uiView);
                }
            }
            LoadPageUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 1080,
                    "height": 2000
                },
                "compId": 1,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "width": 1080,
                        "var": "bgImg",
                        "skin": "comp/bg.png",
                        "height": 2500
                    },
                    "compId": 5
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 1294,
                        "x": 0,
                        "width": 1080,
                        "height": 545
                    },
                    "compId": 13
                }, {
                    "type": "Label",
                    "props": {
                        "y": 400,
                        "x": 0,
                        "width": 1080,
                        "text": "成语表情包",
                        "height": 150,
                        "fontSize": 140,
                        "color": "#393939",
                        "bold": true,
                        "align": "center"
                    },
                    "compId": 10,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "y": 6,
                            "x": 4,
                            "width": 1080,
                            "text": "成语表情包",
                            "height": 150,
                            "fontSize": 140,
                            "color": "#e8532e",
                            "bold": true,
                            "align": "center"
                        },
                        "compId": 11
                    }]
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 832,
                        "x": 190,
                        "width": 700,
                        "var": "progressLayout",
                        "height": 200
                    },
                    "compId": 2,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "y": 100,
                            "width": 647,
                            "var": "loadText",
                            "valign": "middle",
                            "text": "加载中...",
                            "height": 50,
                            "fontSize": 45,
                            "color": "#9a9a9a",
                            "align": "center"
                        },
                        "compId": 4
                    }]
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 1080,
                        "x": 0,
                        "width": 1080,
                        "var": "readmeLayout",
                        "height": 400
                    },
                    "compId": 6,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "width": 1000,
                            "text": "健康游戏忠告",
                            "height": 80,
                            "fontSize": 40,
                            "color": "#343434",
                            "bold": true,
                            "align": "center"
                        },
                        "compId": 7
                    }, {
                        "type": "Label",
                        "props": {
                            "y": 80,
                            "x": 50,
                            "width": 900,
                            "var": "msgLabel",
                            "text": "忠告内容",
                            "leading": 28,
                            "height": 237,
                            "fontSize": 28,
                            "color": "#1c1c1c",
                            "bold": false,
                            "align": "center"
                        },
                        "compId": 8
                    }, {
                        "type": "Label",
                        "props": {
                            "y": 340,
                            "x": 0,
                            "width": 1000,
                            "text": "Powered by LayaAir Engine",
                            "height": 49,
                            "fontSize": 38,
                            "color": "#666666",
                            "bold": false,
                            "align": "center"
                        },
                        "compId": 9
                    }]
                }],
                "loadList": ["comp/bg.png"],
                "loadList3D": []
            };
            page.LoadPageUI = LoadPageUI;
            REG("ui.page.LoadPageUI", LoadPageUI);
            class PassPageUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(PassPageUI.uiView);
                }
            }
            PassPageUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 1080,
                    "height": 2000
                },
                "compId": 1,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "width": 1080,
                        "var": "bgImg",
                        "skin": "comp/bg.png",
                        "height": 2500
                    },
                    "compId": 5
                }],
                "loadList": ["comp/bg.png"],
                "loadList3D": []
            };
            page.PassPageUI = PassPageUI;
            REG("ui.page.PassPageUI", PassPageUI);
        })(page = ui.page || (ui.page = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            class GameViewUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameViewUI.uiView);
                }
            }
            GameViewUI.uiView = {
                "type": "View",
                "props": {
                    "width": 1080,
                    "runtime": "view/GameView.ts",
                    "height": 2000
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": -283,
                        "x": 540,
                        "width": 1456,
                        "var": "bgImg",
                        "skin": "subassets/comp/gameBg.jpg",
                        "height": 2441,
                        "anchorY": 0,
                        "anchorX": 0.5
                    },
                    "compId": 10,
                    "child": [{
                        "type": "Image",
                        "props": {
                            "y": 2018,
                            "x": 270,
                            "width": 120,
                            "var": "btnSet",
                            "skin": "comp/setting.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 120,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 51
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 578,
                            "x": 627,
                            "width": 621,
                            "texture": "subassets/comp/Timer_HardwareGame.png",
                            "height": 355
                        },
                        "compId": 11,
                        "child": [{
                            "type": "Sprite",
                            "props": {
                                "y": 42.5,
                                "x": 0,
                                "width": 449,
                                "var": "timeLayoutCount",
                                "height": 219
                            },
                            "compId": 43,
                            "child": [{
                                "type": "Sprite",
                                "props": {
                                    "y": 24,
                                    "x": 39,
                                    "width": 121,
                                    "texture": "subassets/comp/Leftword_Timer_HardwareGame.png",
                                    "height": 123
                                },
                                "compId": 12
                            }, {
                                "type": "Image",
                                "props": {
                                    "y": -71,
                                    "x": 375,
                                    "width": 83,
                                    "var": "imgLight",
                                    "skin": "subassets/comp/Gray_Light_Timer_HardwareGame.png",
                                    "height": 117,
                                    "alpha": 0.6
                                },
                                "compId": 13,
                                "child": [{
                                    "type": "Image",
                                    "props": {
                                        "y": 58,
                                        "x": 41,
                                        "width": 100,
                                        "skin": "subassets/comp/time_ani_img.png",
                                        "height": 104,
                                        "anchorY": 0.5,
                                        "anchorX": 0.5
                                    },
                                    "compId": 48
                                }]
                            }, {
                                "type": "FontClip",
                                "props": {
                                    "y": 99,
                                    "x": 202,
                                    "width": 50,
                                    "var": "leftTimes",
                                    "value": "1",
                                    "spaceY": 0,
                                    "spaceX": 0,
                                    "skin": "subassets/comp/img_num.png",
                                    "sheet": "0123456789",
                                    "scaleY": 1.3,
                                    "scaleX": 1.3,
                                    "height": 74,
                                    "direction": "horizontal",
                                    "anchorY": 0.5,
                                    "anchorX": 0.5
                                },
                                "compId": 15,
                                "child": [{
                                    "type": "FontClip",
                                    "props": {
                                        "y": 45,
                                        "x": 75,
                                        "width": 50,
                                        "var": "leftTimes2",
                                        "value": "5",
                                        "spaceY": 0,
                                        "spaceX": 0,
                                        "skin": "subassets/comp/img_num.png",
                                        "sheet": "0123456789",
                                        "scaleY": 1,
                                        "scaleX": 1,
                                        "height": 74,
                                        "direction": "horizontal",
                                        "anchorY": 0.5,
                                        "anchorX": 0.5
                                    },
                                    "compId": 20
                                }]
                            }, {
                                "type": "Image",
                                "props": {
                                    "y": 110,
                                    "x": 377,
                                    "width": 81,
                                    "var": "btnAddTimes",
                                    "skin": "subassets/comp/AddButton_Timer_HardwareGame.png",
                                    "height": 81,
                                    "anchorY": 0.5,
                                    "anchorX": 0.5
                                },
                                "compId": 16
                            }, {
                                "type": "Sprite",
                                "props": {
                                    "y": 150,
                                    "x": 325,
                                    "width": 100,
                                    "texture": "subassets/comp/Addword_Timer_HardwareGame.png",
                                    "height": 45
                                },
                                "compId": 17
                            }]
                        }]
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 942,
                            "x": 261,
                            "width": 928,
                            "var": "screenLayout",
                            "height": 687
                        },
                        "compId": 21,
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": 4,
                                "x": 4,
                                "width": 919,
                                "var": "screenBg",
                                "skin": "subassets/comp/ScreenBG_HardwareGame.png",
                                "height": 677,
                                "alpha": 1,
                                "sizeGrid": "76,135,96,149"
                            },
                            "compId": 23
                        }, {
                            "type": "Sprite",
                            "props": {
                                "y": 23,
                                "x": 14,
                                "width": 896,
                                "var": "gridLayout",
                                "height": 640,
                                "alpha": 1
                            },
                            "compId": 25
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 345,
                                "x": 463,
                                "width": 953,
                                "var": "imgScreenAni",
                                "skin": "subassets/comp/PC_Screenlight.png",
                                "mouseThrough": true,
                                "mouseEnabled": false,
                                "height": 729,
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "alpha": 0.5
                            },
                            "compId": 22
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 340,
                                "x": 462,
                                "width": 905,
                                "var": "screenMask",
                                "skin": "subassets/comp/ScreenMask_HardwareGame.png",
                                "height": 665,
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 46,
                            "child": [{
                                "type": "Image",
                                "props": {
                                    "y": 336,
                                    "x": 455,
                                    "width": 905,
                                    "visible": false,
                                    "skin": "subassets/comp/GridFlash_Screen_HardwareGame.png",
                                    "height": 665,
                                    "anchorY": 0.5,
                                    "anchorX": 0.5
                                },
                                "compId": 49
                            }]
                        }]
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 1938,
                            "x": 399,
                            "width": 640,
                            "var": "selectIconLayout",
                            "height": 160
                        },
                        "compId": 30,
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": 80,
                                "x": 80,
                                "width": 150,
                                "var": "item1",
                                "skin": "subassets/comp/ItemFrame.png",
                                "height": 150,
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "sizeGrid": "29,29,26,29"
                            },
                            "compId": 33
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 80,
                                "x": 240,
                                "width": 150,
                                "var": "item2",
                                "skin": "subassets/comp/ItemFrame.png",
                                "height": 150,
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "sizeGrid": "29,29,26,29"
                            },
                            "compId": 34
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 80,
                                "x": 400,
                                "width": 150,
                                "var": "item3",
                                "skin": "subassets/comp/ItemFrame.png",
                                "height": 150,
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "sizeGrid": "29,29,26,29"
                            },
                            "compId": 35
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 80,
                                "x": 560,
                                "width": 150,
                                "var": "item4",
                                "skin": "subassets/comp/ItemFrame.png",
                                "height": 150,
                                "anchorY": 0.5,
                                "anchorX": 0.5,
                                "sizeGrid": "29,29,26,29"
                            },
                            "compId": 36
                        }, {
                            "type": "Sprite",
                            "props": {
                                "y": 0,
                                "x": 0,
                                "width": 640,
                                "var": "itemLayout",
                                "height": 160
                            },
                            "compId": 38
                        }]
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 0,
                            "x": 188,
                            "width": 1080,
                            "visible": true,
                            "var": "fingerLayout",
                            "mouseThrough": true,
                            "mouseEnabled": false,
                            "height": 1200
                        },
                        "compId": 4,
                        "child": [{
                            "type": "Animation",
                            "props": {
                                "y": 1984,
                                "x": 1112,
                                "var": "hand",
                                "source": "view/handAni.ani"
                            },
                            "compId": 50
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 1846,
                            "x": 728,
                            "visible": true,
                            "var": "tipWords",
                            "skin": "subassets/comp/GameStart_Word.png",
                            "rotation": 0,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 52
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 1934,
                            "x": 1097,
                            "width": 150,
                            "var": "iconLayout",
                            "height": 150
                        },
                        "compId": 56
                    }]
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": 120,
                        "x": 10,
                        "width": 272,
                        "var": "grid1",
                        "height": 352
                    },
                    "compId": 53
                }],
                "animations": [{
                    "nodes": [{
                        "target": 22,
                        "keyframes": {
                            "x": [{
                                "value": 463,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 463,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "x",
                                "index": 2
                            }],
                            "width": [{
                                "value": 1035,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "width",
                                "index": 0
                            }],
                            "mouseThrough": [{
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 22,
                                "key": "mouseThrough",
                                "index": 0
                            }, {
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 22,
                                "key": "mouseThrough",
                                "index": 2
                            }],
                            "mouseEnabled": [{
                                "value": false,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 22,
                                "key": "mouseEnabled",
                                "index": 0
                            }, {
                                "value": false,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 22,
                                "key": "mouseEnabled",
                                "index": 2
                            }],
                            "height": [{
                                "value": 855,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "height",
                                "index": 0
                            }],
                            "alpha": [{
                                "value": 0.05,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "alpha",
                                "index": 0
                            }, {
                                "value": 0.1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "alpha",
                                "index": 2
                            }]
                        }
                    }],
                    "name": "screenAni",
                    "id": 1,
                    "frameRate": 24,
                    "action": 0
                }, {
                    "nodes": [{
                        "target": 46,
                        "keyframes": {
                            "x": [{
                                "value": 462,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 462,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "x",
                                "index": 15
                            }, {
                                "value": 462,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "x",
                                "index": 25
                            }],
                            "visible": [{
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 46,
                                "key": "visible",
                                "index": 0
                            }, {
                                "value": false,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 46,
                                "key": "visible",
                                "index": 25
                            }],
                            "height": [{
                                "value": 665,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "height",
                                "index": 0
                            }, {
                                "value": 665,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "height",
                                "index": 15
                            }, {
                                "value": 665,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 46,
                                "key": "height",
                                "index": 25
                            }]
                        }
                    }, {
                        "target": 43,
                        "keyframes": {
                            "x": [{
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 15
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 17
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 19
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 21
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 23
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "x",
                                "index": 25
                            }],
                            "alpha": [{
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 0
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 15
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 17
                            }, {
                                "value": 0.5,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 19
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 21
                            }, {
                                "value": 0.2,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 23
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 43,
                                "key": "alpha",
                                "index": 25
                            }]
                        }
                    }, {
                        "target": 22,
                        "keyframes": {
                            "x": [{
                                "value": 463,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 463,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "x",
                                "index": 15
                            }],
                            "alpha": [{
                                "value": 0.5,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "alpha",
                                "index": 0
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 22,
                                "key": "alpha",
                                "index": 15
                            }]
                        }
                    }, {
                        "target": 49,
                        "keyframes": {
                            "visible": [{
                                "value": false,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 49,
                                "key": "visible",
                                "index": 0
                            }, {
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 49,
                                "key": "visible",
                                "index": 15
                            }],
                            "height": [{
                                "value": 665,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 49,
                                "key": "height",
                                "index": 0
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 49,
                                "key": "height",
                                "index": 15
                            }, {
                                "value": 665,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 49,
                                "key": "height",
                                "index": 24
                            }]
                        }
                    }, {
                        "target": 50,
                        "keyframes": {
                            "y": [{
                                "value": 1984,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "y",
                                "index": 0
                            }, {
                                "value": 1656,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "y",
                                "index": 15
                            }, {
                                "value": 2124,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "y",
                                "index": 60
                            }],
                            "x": [{
                                "value": 1112,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 812,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "x",
                                "index": 15
                            }, {
                                "value": 812,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "x",
                                "index": 20
                            }, {
                                "value": 1332,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 50,
                                "key": "x",
                                "index": 60
                            }]
                        }
                    }],
                    "name": "openAni",
                    "id": 2,
                    "frameRate": 24,
                    "action": 0
                }, {
                    "nodes": [{
                        "target": 48,
                        "keyframes": {
                            "x": [{
                                "value": 41,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 41,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "x",
                                "index": 15
                            }, {
                                "value": 41,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "x",
                                "index": 30
                            }],
                            "scaleY": [{
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleY",
                                "index": 0
                            }, {
                                "value": 2,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleY",
                                "index": 15
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleY",
                                "index": 30
                            }],
                            "scaleX": [{
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleX",
                                "index": 0
                            }, {
                                "value": 2,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleX",
                                "index": 15
                            }, {
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 48,
                                "key": "scaleX",
                                "index": 30
                            }]
                        }
                    }],
                    "name": "redLightAni",
                    "id": 3,
                    "frameRate": 24,
                    "action": 0
                }, {
                    "nodes": [{
                        "target": 52,
                        "keyframes": {
                            "x": [{
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 2
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 4
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 6
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 8
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 10
                            }, {
                                "value": 728,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "x",
                                "index": 50
                            }],
                            "visible": [{
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 52,
                                "key": "visible",
                                "index": 0
                            }],
                            "rotation": [{
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 0
                            }, {
                                "value": -11,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 2
                            }, {
                                "value": 8,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 4
                            }, {
                                "value": -8,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 6
                            }, {
                                "value": 9,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 8
                            }, {
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 52,
                                "key": "rotation",
                                "index": 10
                            }]
                        }
                    }],
                    "name": "tipAni",
                    "id": 4,
                    "frameRate": 24,
                    "action": 0
                }],
                "loadList": ["subassets/comp/gameBg.jpg", "comp/setting.png", "subassets/comp/Timer_HardwareGame.png", "subassets/comp/Leftword_Timer_HardwareGame.png", "subassets/comp/Gray_Light_Timer_HardwareGame.png", "subassets/comp/time_ani_img.png", "subassets/comp/img_num.png", "subassets/comp/AddButton_Timer_HardwareGame.png", "subassets/comp/Addword_Timer_HardwareGame.png", "subassets/comp/ScreenBG_HardwareGame.png", "subassets/comp/PC_Screenlight.png", "subassets/comp/ScreenMask_HardwareGame.png", "subassets/comp/GridFlash_Screen_HardwareGame.png", "subassets/comp/ItemFrame.png", "view/handAni.ani", "subassets/comp/GameStart_Word.png"],
                "loadList3D": []
            };
            view.GameViewUI = GameViewUI;
            REG("ui.view.GameViewUI", GameViewUI);
            class IconViewUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(IconViewUI.uiView);
                }
            }
            IconViewUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 200,
                    "height": 200
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 100,
                        "x": 100,
                        "width": 200,
                        "height": 200,
                        "anchorY": 0.5,
                        "anchorX": 0.5
                    },
                    "compId": 3
                }],
                "loadList": [],
                "loadList3D": []
            };
            view.IconViewUI = IconViewUI;
            REG("ui.view.IconViewUI", IconViewUI);
            class ProgressViewUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(ProgressViewUI.uiView);
                }
            }
            ProgressViewUI.uiView = {
                "type": "View",
                "props": {
                    "width": 700,
                    "height": 33
                },
                "compId": 1,
                "child": [{
                    "type": "Panel",
                    "props": {
                        "y": 0,
                        "x": 350,
                        "width": 700,
                        "height": 33,
                        "anchorY": 0,
                        "anchorX": 0.5
                    },
                    "compId": 2,
                    "child": [{
                        "type": "Image",
                        "props": {
                            "y": 0,
                            "x": 350,
                            "width": 700,
                            "var": "progressBg",
                            "value": 0,
                            "skin": "comp/imgProgressBarBg.png",
                            "height": 33,
                            "anchorY": 0,
                            "anchorX": 0.5,
                            "sizeGrid": "0,30,0,30"
                        },
                        "compId": 3
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 0,
                            "x": 350,
                            "width": 700,
                            "var": "progressBar",
                            "skin": "comp/imgProgressBar.png",
                            "height": 33,
                            "anchorY": 0,
                            "anchorX": 0.5,
                            "sizeGrid": "0,30,0,30"
                        },
                        "compId": 4,
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": 0,
                                "x": -350,
                                "width": 700,
                                "var": "progressMask",
                                "skin": "comp/imgProgressBar.png",
                                "renderType": "mask",
                                "height": 33,
                                "anchorY": 0,
                                "anchorX": 0.5,
                                "sizeGrid": "0,30,0,30"
                            },
                            "compId": 5
                        }]
                    }]
                }],
                "loadList": ["comp/imgProgressBarBg.png", "comp/imgProgressBar.png"],
                "loadList3D": []
            };
            view.ProgressViewUI = ProgressViewUI;
            REG("ui.view.ProgressViewUI", ProgressViewUI);
            class SpeekViewUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(SpeekViewUI.uiView);
                }
            }
            SpeekViewUI.uiView = {
                "type": "Scene",
                "props": {
                    "y": 520,
                    "x": 540,
                    "width": 1080,
                    "pivotY": 520,
                    "pivotX": 540,
                    "height": 520
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 260,
                        "x": 540,
                        "width": 1012,
                        "skin": "subassets/comp/imgGuideSpeekBg.png",
                        "height": 520,
                        "anchorY": 0.5,
                        "anchorX": 0.5
                    },
                    "compId": 7
                }, {
                    "type": "Label",
                    "props": {
                        "y": 221,
                        "x": 254,
                        "wordWrap": true,
                        "width": 700,
                        "var": "msgLab",
                        "valign": "middle",
                        "text": "点击格子，找出所有隐藏的表情图标",
                        "italic": true,
                        "height": 206,
                        "fontSize": 45,
                        "font": "Arial",
                        "color": "#000000",
                        "bold": true,
                        "align": "center"
                    },
                    "compId": 8,
                    "child": [{
                        "type": "Script",
                        "props": {
                            "speed": 50,
                            "runtime": "script/SpeekScript.ts"
                        },
                        "compId": 9
                    }]
                }, {
                    "type": "Label",
                    "props": {
                        "y": 430,
                        "x": 190,
                        "wordWrap": true,
                        "width": 700,
                        "valign": "middle",
                        "underlineColor": "#000000",
                        "underline": true,
                        "text": "点击此处继续",
                        "italic": false,
                        "height": 46,
                        "fontSize": 40,
                        "font": "Arial",
                        "color": "#000000",
                        "bold": true,
                        "align": "center"
                    },
                    "compId": 10
                }],
                "loadList": ["subassets/comp/imgGuideSpeekBg.png"],
                "loadList3D": []
            };
            view.SpeekViewUI = SpeekViewUI;
            REG("ui.view.SpeekViewUI", SpeekViewUI);
            class ToastViewUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(ToastViewUI.uiView);
                }
            }
            ToastViewUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 1080,
                    "height": 200
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "width": 1080,
                        "skin": "comp/toastBg.png",
                        "height": 200,
                        "sizeGrid": "10,10,10,10"
                    },
                    "compId": 3,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "width": 1080,
                            "var": "textMsg",
                            "valign": "middle",
                            "text": "label",
                            "height": 200,
                            "fontSize": 50,
                            "color": "#e2e2e2",
                            "align": "center"
                        },
                        "compId": 4
                    }]
                }],
                "loadList": ["comp/toastBg.png"],
                "loadList3D": []
            };
            view.ToastViewUI = ToastViewUI;
            REG("ui.view.ToastViewUI", ToastViewUI);
            class WordDialogUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(WordDialogUI.uiView);
                }
            }
            WordDialogUI.uiView = {
                "type": "View",
                "props": {
                    "y": 650,
                    "x": 540,
                    "width": 1080,
                    "height": 1300,
                    "anchorY": 0.5,
                    "anchorX": 0.5
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 643,
                        "x": 540,
                        "width": 950,
                        "var": "imgBg",
                        "skin": "subassets/comp/img_dialogBg.png",
                        "height": 1274,
                        "anchorY": 0.5,
                        "anchorX": 0.5,
                        "sizeGrid": "156,40,123,40"
                    },
                    "compId": 3,
                    "child": [{
                        "type": "Image",
                        "props": {
                            "y": 464,
                            "x": 135,
                            "width": 160,
                            "var": "w0",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 27
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 464,
                            "x": 305,
                            "width": 160,
                            "var": "w1",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 29
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 464,
                            "x": 475,
                            "width": 160,
                            "var": "w2",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 30
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 464,
                            "x": 645,
                            "width": 160,
                            "var": "w3",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 32
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 464,
                            "x": 815,
                            "width": 160,
                            "var": "w4",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 33
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 639,
                            "x": 135,
                            "width": 160,
                            "var": "w5",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 34
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 639,
                            "x": 310,
                            "width": 160,
                            "var": "w6",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 35
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 639,
                            "x": 480,
                            "width": 160,
                            "var": "w7",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 36
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 639,
                            "x": 650,
                            "width": 160,
                            "var": "w8",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 37
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 639,
                            "x": 820,
                            "width": 160,
                            "var": "w9",
                            "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                            "height": 160,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "21,18,20,17"
                        },
                        "compId": 38
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 0,
                            "x": 0,
                            "width": 950,
                            "visible": true,
                            "var": "passLayout",
                            "height": 1100
                        },
                        "compId": 42,
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": 537,
                                "x": 476,
                                "width": 1080,
                                "skin": "subassets/comp/SponsorPanel.png",
                                "height": 1,
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 40
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 953,
                            "x": 176,
                            "width": 180,
                            "var": "s1",
                            "skin": "subassets/comp/ItemFrame.png",
                            "height": 180,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "29,29,26,29"
                        },
                        "compId": 9
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 953,
                            "x": 376,
                            "width": 180,
                            "var": "s2",
                            "skin": "subassets/comp/ItemFrame.png",
                            "height": 180,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "29,29,26,29"
                        },
                        "compId": 10
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 953,
                            "x": 576,
                            "width": 180,
                            "var": "s3",
                            "skin": "subassets/comp/ItemFrame.png",
                            "height": 180,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "29,29,26,29"
                        },
                        "compId": 11
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 953,
                            "x": 776,
                            "width": 180,
                            "var": "s4",
                            "skin": "subassets/comp/ItemFrame.png",
                            "height": 180,
                            "anchorY": 0.5,
                            "anchorX": 0.5,
                            "sizeGrid": "29,29,26,29"
                        },
                        "compId": 12
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 88,
                            "x": 76,
                            "width": 800,
                            "var": "iconLayout",
                            "height": 200
                        },
                        "compId": 17,
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": 100,
                                "x": 100,
                                "var": "icon1",
                                "skin": "subassets/icons/107.png",
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 18
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 100,
                                "x": 300,
                                "var": "icon2",
                                "skin": "subassets/icons/10.png",
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 20
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 100,
                                "x": 500,
                                "var": "icon3",
                                "skin": "subassets/icons/101.png",
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 22
                        }, {
                            "type": "Image",
                            "props": {
                                "y": 100,
                                "x": 700,
                                "var": "icon4",
                                "skin": "subassets/icons/163.png",
                                "anchorY": 0.5,
                                "anchorX": 0.5
                            },
                            "compId": 24
                        }]
                    }, {
                        "type": "Sprite",
                        "props": {
                            "y": 0,
                            "x": 0,
                            "width": 950,
                            "var": "wordLayout",
                            "height": 1100
                        },
                        "compId": 26
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 1175,
                            "x": 249,
                            "width": 254,
                            "var": "btnRefresh",
                            "skin": "subassets/comp/btnBg.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 127,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 44,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 0,
                                "x": 0,
                                "width": 249,
                                "valign": "middle",
                                "text": "考考好友",
                                "strokeColor": "#115651",
                                "stroke": 5,
                                "height": 123,
                                "fontSize": 45,
                                "color": "#14e2ff",
                                "align": "center"
                            },
                            "compId": 47
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 1175,
                            "x": 678,
                            "width": 254,
                            "var": "btnTip",
                            "skin": "subassets/comp/btnBg.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 127,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 45,
                        "child": [{
                            "type": "Sprite",
                            "props": {
                                "y": 29,
                                "x": 23,
                                "width": 73,
                                "texture": "subassets/comp/ads_icon.png",
                                "height": 69
                            },
                            "compId": 46
                        }, {
                            "type": "Label",
                            "props": {
                                "y": 0,
                                "x": 59,
                                "width": 190,
                                "valign": "middle",
                                "text": "提示",
                                "strokeColor": "#115651",
                                "stroke": 5,
                                "height": 123,
                                "fontSize": 45,
                                "color": "#14e2ff",
                                "align": "center"
                            },
                            "compId": 48
                        }]
                    }, {
                        "type": "Image",
                        "props": {
                            "y": 1178,
                            "x": 683,
                            "width": 254,
                            "var": "btnNext",
                            "skin": "subassets/comp/btnBg.png",
                            "runtime": "script/ImageRuntime.ts",
                            "height": 127,
                            "anchorY": 0.5,
                            "anchorX": 0.5
                        },
                        "compId": 49,
                        "child": [{
                            "type": "Label",
                            "props": {
                                "y": 0,
                                "x": 1,
                                "width": 248,
                                "valign": "middle",
                                "text": "下一关",
                                "strokeColor": "#115651",
                                "stroke": 5,
                                "height": 123,
                                "fontSize": 45,
                                "color": "#14e2ff",
                                "align": "center"
                            },
                            "compId": 51
                        }]
                    }, {
                        "type": "Animation",
                        "props": {
                            "y": 489,
                            "x": -499,
                            "var": "hand",
                            "source": "view/handAni.ani"
                        },
                        "compId": 43
                    }]
                }],
                "animations": [{
                    "nodes": [{
                        "target": 40,
                        "keyframes": {
                            "x": [{
                                "value": 476,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 40,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 476,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 40,
                                "key": "x",
                                "index": 20
                            }],
                            "height": [{
                                "value": 1,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 40,
                                "key": "height",
                                "index": 0
                            }, {
                                "value": 360,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 40,
                                "key": "height",
                                "index": 20
                            }]
                        }
                    }, {
                        "target": 9,
                        "keyframes": {
                            "y": [{
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "y",
                                "index": 0
                            }, {
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "y",
                                "index": 20
                            }, {
                                "value": 550,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "y",
                                "index": 50
                            }],
                            "x": [{
                                "value": 176,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 176,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "x",
                                "index": 20
                            }, {
                                "value": 176,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 9,
                                "key": "x",
                                "index": 50
                            }]
                        }
                    }, {
                        "target": 10,
                        "keyframes": {
                            "y": [{
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "y",
                                "index": 0
                            }, {
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "y",
                                "index": 20
                            }, {
                                "value": 550,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "y",
                                "index": 50
                            }],
                            "x": [{
                                "value": 376,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 376,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "x",
                                "index": 20
                            }, {
                                "value": 376,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 10,
                                "key": "x",
                                "index": 50
                            }]
                        }
                    }, {
                        "target": 11,
                        "keyframes": {
                            "y": [{
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "y",
                                "index": 0
                            }, {
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "y",
                                "index": 20
                            }, {
                                "value": 550,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "y",
                                "index": 50
                            }],
                            "x": [{
                                "value": 576,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 576,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "x",
                                "index": 20
                            }, {
                                "value": 576,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 11,
                                "key": "x",
                                "index": 50
                            }]
                        }
                    }, {
                        "target": 12,
                        "keyframes": {
                            "y": [{
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "y",
                                "index": 0
                            }, {
                                "value": 953,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "y",
                                "index": 20
                            }, {
                                "value": 550,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "y",
                                "index": 50
                            }],
                            "x": [{
                                "value": 776,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "x",
                                "index": 0
                            }, {
                                "value": 776,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "x",
                                "index": 20
                            }, {
                                "value": 776,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 12,
                                "key": "x",
                                "index": 50
                            }]
                        }
                    }, {
                        "target": 42,
                        "keyframes": {
                            "x": [{
                                "value": 0,
                                "tweenMethod": "linearNone",
                                "tween": true,
                                "target": 42,
                                "key": "x",
                                "index": 0
                            }],
                            "visible": [{
                                "value": true,
                                "tweenMethod": "linearNone",
                                "tween": false,
                                "target": 42,
                                "key": "visible",
                                "index": 0
                            }]
                        }
                    }],
                    "name": "passAni",
                    "id": 1,
                    "frameRate": 24,
                    "action": 0
                }],
                "loadList": ["subassets/comp/img_dialogBg.png", "subassets/comp/Grid1_Screen_HardwareGame.png", "subassets/comp/SponsorPanel.png", "subassets/comp/ItemFrame.png", "subassets/icons/107.png", "subassets/icons/10.png", "subassets/icons/101.png", "subassets/icons/163.png", "subassets/comp/btnBg.png", "subassets/comp/ads_icon.png", "view/handAni.ani"],
                "loadList3D": []
            };
            view.WordDialogUI = WordDialogUI;
            REG("ui.view.WordDialogUI", WordDialogUI);
            class WordItemUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(WordItemUI.uiView);
                }
            }
            WordItemUI.uiView = {
                "type": "Scene",
                "props": {
                    "width": 170,
                    "height": 170
                },
                "compId": 2,
                "child": [{
                    "type": "Image",
                    "props": {
                        "y": 5,
                        "x": 5,
                        "width": 160,
                        "skin": "subassets/comp/Grid1_Screen_HardwareGame.png",
                        "height": 160,
                        "sizeGrid": "21,18,20,17"
                    },
                    "compId": 3,
                    "child": [{
                        "type": "Label",
                        "props": {
                            "y": 0,
                            "x": 0,
                            "width": 160,
                            "var": "labText",
                            "valign": "middle",
                            "text": "中",
                            "strokeColor": "#0a0a0e",
                            "stroke": 10,
                            "height": 160,
                            "fontSize": 100,
                            "color": "#7fdfff",
                            "bold": true,
                            "align": "center"
                        },
                        "compId": 4
                    }]
                }],
                "loadList": ["subassets/comp/Grid1_Screen_HardwareGame.png"],
                "loadList3D": []
            };
            view.WordItemUI = WordItemUI;
            REG("ui.view.WordItemUI", WordItemUI);
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    /**
     * 公共工具类
     */
    var Common;
    (function (Common) {
        //前面与特定游戏相关
        function shuffArr(array) {
            let len = array.length;
            for (let i = len - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        Common.shuffArr = shuffArr;
        Common.Rad2Deg = 57.29578;
        Common.Deg2Rad = 0.0174532924;
        Common.rootLayout = null;

        function addView(view, x, y) {
            if (!Common.rootLayout)
                return;
            this.rootLayout.addChild(view);
            if (x != undefined) {
                view.x = x;
            }
            if (y != undefined) {
                view.y = y;
            }
        }
        Common.addView = addView;

        function removeAllView() {
            if (!Common.rootLayout)
                return;
            Common.rootLayout.removeChildren();
        }
        Common.removeAllView = removeAllView;

        function getIndex(row, col, cols) {
            return row * cols + col;
        }
        Common.getIndex = getIndex;

        function getPoint(index, cols) {
            let p = new Point();
            p.x = index % cols;
            p.y = Math.floor(index / cols);
            return p;
        }
        Common.getPoint = getPoint;

        function calc3DOffsetFrom2D(camera, layout) {
            let center2D = new Laya.Point();
            center2D.x = layout.width / 2;
            center2D.y = layout.height / 2;
            layout.localToGlobal(center2D, false);
            let result = new Laya.Vector3();
            let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            camera.viewportPointToRay(new Laya.Vector2(center2D.x, center2D.y), ray);
            WxConfig.log(ray);
            let dz = ray.direction.z / ray.direction.y * ray.origin.y;
            let dx = ray.origin.x;
            let dy = ray.origin.y;
            result.x = dx;
            result.y = dy;
            result.z = dz;
            WxConfig.log(result);
            return result;
        }
        Common.calc3DOffsetFrom2D = calc3DOffsetFrom2D;
        class Point {
            constructor(x, y, d) {
                this.x = x;
                this.y = y;
                this.d = d;
            }
            clone() {
                let p = new Point(this.x, this.y);
                if (this.d) {
                    p.d = this.d.clone();
                }
                return p;
            }
        }
        Common.Point = Point;
        class Direction {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            clone() {
                let d = new Direction();
                d.x = this.x;
                d.y = this.y;
                return d;
            }
        }
        Common.Direction = Direction;

        function changeColorToVector4(colorStr) {
            let color = Laya.ColorUtils.create(colorStr);
            WxConfig.log("changeColorToVector4=>");
            WxConfig.log(color);
            return new Laya.Vector4(color.arrColor[0], color.arrColor[1], color.arrColor[2], color.arrColor[3]);
        }
        Common.changeColorToVector4 = changeColorToVector4;

        function calcViewHeight(distance, fov) {
            var frustumHeight = 2.0 * distance * Math.tan(fov * 0.5 * Common.Rad2Deg);
            return frustumHeight;
        }
        Common.calcViewHeight = calcViewHeight;

        function calcCameraDistance(frustumHeight, fov) {
            var distance = frustumHeight * 0.5 / Math.tan(fov * 0.5 * Common.Deg2Rad);
            return distance;
        }
        Common.calcCameraDistance = calcCameraDistance;

        function calcCameraFov(frustumHeight, distance) {
            var fov = 2 * Math.atan(frustumHeight * 0.5 / distance) * Common.Rad2Deg;
            return fov;
        }
        Common.calcCameraFov = calcCameraFov;
    })(Common || (Common = {}));
    /**
     * 切片工具类
     */
    class GifView extends Laya.Clip {
        constructor(path, cols, rows, interval, isLoop) {
            super(path, cols, rows);
            this.frameIndex = 0;
            this.toFrameIndex = -1;
            if (interval != void 0) {
                this.interval = interval;
            }
            this.on(Laya.Event.COMPLETE, this, () => {
                this.destroy();
            });
            this.frameIndex = 0;
            isLoop ? this.toFrameIndex = -1 : this.toFrameIndex = (cols * rows - 1);
            this.play(0, isLoop ? -1 : (cols * rows - 1));
        }
        changePath(path, cols, rows, interval, isLoop) {
            Laya.timer.clear(this, this._loop);
            this.skin = path;
            this.clipX = cols;
            this.clipY = rows;
            this.changeClip();
            if (interval != void 0) {
                this.interval = interval;
            }
            this.on(Laya.Event.COMPLETE, this, () => {
                this.destroy();
            });
            this.frameIndex = 0;
            if (cols * rows == 1) {
                this.index = 0;
            } else {
                isLoop ? this.toFrameIndex = -1 : this.toFrameIndex = (cols * rows - 1);
                this.play(0, isLoop ? -1 : (cols * rows - 1));
            }
        }
        _loop() {
            if (this.visible && this._sources) {
                if (this.toFrameIndex > -1 && this.frameIndex >= this.toFrameIndex) {
                    this.stop();
                } else if (this.frameIndex >= this._sources.length) {
                    this.frameIndex = 0;
                }
                this.index = this.frameIndex;
                this.frameIndex++;
            }
        }
    }
    /**
     * 弹出toast
     */
    class Toast extends ui.view.ToastViewUI {
        constructor() {
            super();
            this.dissmissCallBack = null;
            this.caller = null;
            this.on(Laya.Event.REMOVED, this, this.onRemoved);
        }
        onRemoved() {
            if (!this.destroyed) {
                Laya.Pool.recover("ToastView", this);
            }
        }
        closeClick(e) {
            e.stopPropagation();
            this.dissmass();
        }
        static toast(msg, duration, callBack, caller) {
            let toastView = Laya.Pool.getItemByClass("ToastView", Toast);
            toastView.dissmissCallBack = callBack;
            toastView.caller = caller;
            toastView.showToast(msg, duration == void 0 ? Toast.SHORT : duration);
        }
        showToast(msg, duration) {
            this.setMsg(msg);
            this.popup(duration);
        }
        popup(duration) {
            this.pos((Laya.stage.width - this.width) / 2, Laya.stage.height / 2);
            this.alpha = 0;
            Laya.stage.addChild(this);
            this.zOrder = 1001;
            var thiz = this;
            Laya.Tween.to(this, {
                alpha: 1,
                y: Laya.stage.height / 3
            }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.timer.once(duration, this, function () {
                    thiz.dissmass();
                });
            }));
        }
        dissmass(time) {
            var thiz = this;
            var obj = {
                value: 1
            };
            Laya.Tween.to(obj, {
                value: 0,
                update: Laya.Handler.create(thiz, function () {
                    thiz.alpha = obj.value;
                    thiz.y = thiz.y - 1;
                }, null, false)
            }, time ? time : 300, Laya.Ease.linearNone, Laya.Handler.create(this, function () {
                thiz.removeSelf();
                if (thiz.dissmissCallBack) {
                    thiz.dissmissCallBack(thiz.caller);
                }
            }));
        }
        setMsg(msg) {
            this.textMsg.text = msg;
        }
    }
    Toast.LONG = 3000;
    Toast.SHORT = 1000;
    /**
     * 分享工具类
     */
    var SharedUtils;
    (function (SharedUtils) {
        SharedUtils.ShareState = {
            TIP: 1,
            BONUS: 2,
            LGBONUS: 3,
            CHARGE: 4,
            GROUPRANK: 5,
            INVITE: 6,
            MENU: 7,
            MONEY: 8,
            DOUBLE: 9,
            OTHER: 0
        };

        function getShareImg() {
            if (game.SHARED_IMG_ARR != null && game.SHARED_IMG_ARR.length > 0 && game.shareType === SharedUtils.ShareState.MONEY) {
                var tr = Math.random();
                WxConfig.log('getShareImg random=' + tr);
                for (var i = 0; i < game.SHARED_IMG_ARR.length; i++) {
                    var ele = game.SHARED_IMG_ARR[i];
                    if (tr >= ele.min && tr < ele.max) {
                        if (ele.e) {
                            return [ele.id, ele.url, ele.t, ele.p, ele.e];
                        } else {
                            return [ele.id, ele.url, ele.t, ele.p];
                        }
                    }
                }
                return ['P0', game.SHARED_URL, game.SHARED_TITLE, game.SHARED_PARAM];
            } else {
                return ['P0', game.SHARED_URL, game.SHARED_TITLE, game.SHARED_PARAM];
            }
        }

        function wxShareFunc(type, query) {
            var tmpQuery = query ? query : ('uid=' + game.userId + '&state=' + SharedUtils.ShareState.OTHER);
            game.shareType = type;
            game.shareQuery = tmpQuery;
            var shareImgInfo = getShareImg();
            WxConfig.log('shareImgInfo:');
            WxConfig.log(shareImgInfo);
            tmpQuery += ('&img=' + shareImgInfo[0] + '&' + shareImgInfo[3]);
            WxConfig.log('wxShare query:' + tmpQuery);
            shareImgInfo[1] = getScreenPath();
            if (shareImgInfo.length === 4) {
                game.shareStartTime = (new Date()).getTime(); {
                    wx.shareAppMessage({
                        query: tmpQuery,
                        imageUrl: shareImgInfo[1],
                        title: shareImgInfo[2],
                        cancel: function (res) {
                            WxConfig.log('取消分享:' + res);
                            game.shareCancel = true;
                        }
                    });
                }
            }
        }
        SharedUtils.wxShareFunc = wxShareFunc;

        function getScreenPath() {
            let path = "";
            return path;
        }
        SharedUtils.getScreenPath = getScreenPath;
    })(SharedUtils || (SharedUtils = {}));
    /**
     * 微信工具类：
     * 保存用户数据
     * 广告
     */
    var WxUtils;
    (function (WxUtils) {
        function saveUserData(level, score) {
            if (level <= game.all_level) {
                return;
            }
            game.all_level = level;
            wx.setStorageSync(WxConfig.ALL_LEVEL_KEY, game.all_level);
            var data = {
                key: WxConfig.openDataKey,
                value: game.all_level + ""
            };
            var utimestamp = Math.round((new Date()).getTime() / 1000);
            var wxValue = {
                "wxgame": {
                    "score": game.all_level,
                    "update_time": utimestamp
                }
            };
            var jsonWxValue = JSON.stringify(wxValue);
            WxConfig.log('jsonWxValue:' + jsonWxValue);
            var wxgameData = {
                key: 'wxLevel',
                value: jsonWxValue
            };
            wx.setUserCloudStorage({
                KVDataList: [data, wxgameData],
                success: res => {
                    WxConfig.log(res);
                },
                fail: res => {
                    WxConfig.log(res);
                }
            });
        }
        WxUtils.saveUserData = saveUserData;

        function checkForUpdate() {
            if (typeof Laya.Browser.window.wx.getUpdateManager === 'function') {
                const updateManager = Laya.Browser.window.wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {
                    WxConfig.log("版本更新信息：");
                    WxConfig.log(res.hasUpdate);
                });
                updateManager.onUpdateReady(function () {
                    Laya.Browser.window.wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启以使用？',
                        cancelText: "知道了",
                        confirmText: "重启",
                        success: function (res) {
                            if (res.confirm) {
                                updateManager.applyUpdate();
                            } else {}
                        }
                    });
                });
            }
        }
        WxUtils.checkForUpdate = checkForUpdate;

        function initShare(gameUi) {
            wx.showShareMenu({
                withShareTicket: false
            });
            wx.onShareAppMessage(function () {
                var tmp_query = 'uid=' + game.userId + '&state=' + WxConfig.ShareState.MENU;
                tmp_query += ('&img=P0&' + game.SHARED_PARAM);
                WxConfig.log('wxShare query:' + tmp_query);
                game.shareType = WxConfig.ShareState.MENU;
                game.shareQuery = tmp_query;
                return {
                    query: tmp_query,
                    title: game.SHARED_TITLE,
                    imageUrl: SharedUtils.getScreenPath()
                };
            });
            wx.onShow(res => {
                soundUtils.playBgMusic();
                game.onShowRes = res;
                game.shareTicket = res.shareTicket;
                game.QueryState = res.query.state;
                if (!game.userId) {
                    game.userId = wx.getStorageSync('myUserId');
                }
                WxConfig.log('onShow:');
                WxConfig.log(res);
                if (gameUi && gameUi.lastClickTime) {
                    let offsetTimestamp = (new Date()).getTime() - gameUi.lastClickTime.getTime();
                    WxConfig.log("onShow布局");
                    gameUi.lastClickTime = null;
                }
                Laya.Browser.window.poponshow = true;
                var ifShareAward = (game.shareType === WxConfig.ShareState.TIP || game.shareType === WxConfig.ShareState.BONUS || game.shareType === WxConfig.ShareState.LGBONUS || game.shareType === WxConfig.ShareState.CHARGE || game.shareType === WxConfig.ShareState.MONEY || game.shareType === WxConfig.ShareState.DOUBLE);
                if (game.shareMode === 0) {} else if (game.shareMode === 1 && game.shareStartTime > 0 && ifShareAward) {
                    wx.showLoading({
                        title: '加载中...',
                        mask: true
                    });
                    game.shareBackTime = (new Date()).getTime();
                    var tmpShareUseTime = game.shareBackTime - game.shareStartTime;
                    Laya.timer.once(1000, game, function () {
                        wx.hideLoading();
                        WxConfig.log('判断是否有取消分享：' + game.shareCancel + ',分享用时：' + tmpShareUseTime + ',分享用时阈值：' + game.shareUseTime);
                        if (game.shareCancel || (tmpShareUseTime < game.shareUseTime)) {
                            wx.showModal({
                                title: '温馨提示',
                                content: '分享失败，请分享到不同群',
                                showCancel: true,
                                cancelText: '取消',
                                confirmText: '确定',
                                success: function (callBack) {
                                    if (callBack.confirm) {
                                        SharedUtils.wxShareFunc(game.shareType, game.shareQuery);
                                    } else if (callBack.cancel) {}
                                }
                            });
                        } else {
                            WxConfig.log('shareType=' + game.shareType + ',shareQuery=' + game.shareQuery);
                            if (game.shareType === WxConfig.ShareState.TIP) {
                                wx.showToast({
                                    title: '获得提示',
                                    icon: 'success',
                                    duration: 500,
                                    mask: true,
                                });
                                if (gameUi) {
                                    gameUi.showTipFunc();
                                }
                            }
                        }
                        game.shareCancel = false;
                        game.shareStartTime = 0;
                        game.shareBackTime = 0;
                    });
                }
            });
            wx.onHide(function () {});
        }
        WxUtils.initShare = initShare;
        var tipVideoAd = null;
        var videoCloseCallBack = null;

        function showVideoAd(callBack) {
            videoCloseCallBack = callBack;
            if (tipVideoAd == null) {
                tipVideoAd = wx.createRewardedVideoAd({
                    adUnitId: WxConfig.VIDEO_ID
                });
            }
            if (tipVideoAd != null) {
                tipVideoAd.load()
                    .then(() => {
                        tipVideoAd.show().then(() => {});
                    })
                    .catch(err => {
                        callBack(false);
                    });
                tipVideoAd.onError(e => {
                    callBack(false);
                    Toast.toast("暂时没有可观看的视频!");
                });
                tipVideoAd.onClose(videoClose);
            }
        }
        WxUtils.showVideoAd = showVideoAd;

        function videoClose(status) {
            tipVideoAd.offClose();
            if ((status && status.isEnded) || status === undefined) {
                videoCloseCallBack(true);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '视频未完整播放，无法获取提示！',
                    confirmText: '好的',
                    showCancel: false,
                });
            }
        }
        var gameBannerAd = null;

        function showBanner(y, callBack) {
            if (gameBannerAd) {
                gameBannerAd.hide();
                gameBannerAd.destroy();
            }
            gameBannerAd = wx.createBannerAd({
                adUnitId: WxConfig.BANNER_ID,
                style: {
                    left: 0,
                    top: y * game.scaleX,
                    width: Math.floor(0.8 * game.screenWidth),
                    height: (Laya.stage.height - y) * game.scaleX
                }
            });
            gameBannerAd.onResize(size => {
                var tmpHt = game.screenHeight - size.height - (Laya.stage.height > 2300 ? 20 : 0);
                var tmpWt = (game.screenWidth - size.width) / 2;
                if (tmpHt > y * game.scaleX) {
                    gameBannerAd.style.top = tmpHt;
                    gameBannerAd.style.left = tmpWt;
                    gameBannerAd.show();
                    if (callBack) {
                        callBack(true);
                    }
                } else {
                    hideBanner();
                    if (callBack) {
                        callBack(false);
                    }
                }
            });
            gameBannerAd.onError(res => {
                hideBanner();
                if (callBack) {
                    callBack(false);
                }
            });
        }
        WxUtils.showBanner = showBanner;

        function hideBanner() {
            if (gameBannerAd) {
                gameBannerAd.hide();
                gameBannerAd.destroy();
                gameBannerAd = null;
            }
        }
        WxUtils.hideBanner = hideBanner;
        var gridAd1 = null;
        var gridAd2 = null;

        function showGrid1(x, y) {
            var ifShowGrid = (typeof Laya.Browser.window.wx.createCustomAd === 'function');
            if (ifShowGrid == false)
                return;
            if (gridAd1 == null) {
                gridAd1 = Laya.Browser.window.wx.createCustomAd({
                    adUnitId: WxConfig.GRID_ID1,
                    adIntervals: 30,
                    style: {
                        left: x * game.scaleX,
                        top: y * game.scaleY,
                        width: 240,
                        fixed: false
                    }
                });
            }
            if (gridAd1) {
                gridAd1.show();
            }
        }
        WxUtils.showGrid1 = showGrid1;

        function showGrid2(x, y) {
            var ifShowGrid = (typeof Laya.Browser.window.wx.createCustomAd === 'function');
            if (ifShowGrid == false)
                return;
            if (gridAd2 == null) {
                gridAd2 = Laya.Browser.window.wx.createCustomAd({
                    adUnitId: WxConfig.GRID_ID2,
                    adIntervals: 30,
                    style: {
                        left: x * game.scaleX,
                        top: y * game.scaleY,
                        width: 240,
                        fixed: false
                    }
                });
            }
            if (gridAd2) {
                gridAd2.show();
            }
        }
        WxUtils.showGrid2 = showGrid2;

        function hideGrid() {
            if (gridAd1) {
                gridAd1.hide();
            }
            if (gridAd2) {
                gridAd2.hide();
            }
        }
        WxUtils.hideGrid = hideGrid;
        var interstitialAd = null;

        function showInterAd() {
            if (interstitialAd == null) {
                if (typeof Laya.Browser.window.wx.createInterstitialAd === 'function') {
                    interstitialAd = Laya.Browser.window.wx.createInterstitialAd({
                        adUnitId: WxConfig.INSTER_ID
                    });
                }
            }
            interstitialAd.show().then(() => {}).catch((err) => {});
        }
        WxUtils.showInterAd = showInterAd;

        function clickNav(appid, apppath, appname, from, appskin, callBack) {
            wx.navigateToMiniProgram({
                appId: appid,
                path: apppath,
                envVersion: 'release',
                success(res) {
                    WxConfig.log('跳转成功');
                    if (callBack) {
                        callBack(true);
                    }
                },
                fail(err) {
                    WxConfig.log('取消跳转');
                    if (callBack) {
                        callBack(false);
                    }
                }
            });
        }
        WxUtils.clickNav = clickNav;
        var navIcon = null;
        var navData = null;

        function showNav(x, y) {
            Laya.timer.clear(Laya.stage, loopNav);
            navData = WxConfig.NAV_DATA[Math.floor(Math.random() * WxConfig.NAV_DATA.length)];
            if (navIcon) {
                navIcon.changePath(navData.icon.path, navData.icon.cols, navData.icon.rows, navData.icon.duration, true);
            } else {
                navIcon = new GifView(navData.icon.path, navData.icon.cols, navData.icon.rows, navData.icon.duration, true);
            }
            navIcon.size(150, 150);
            Laya.timer.loop(5000, Laya.stage, loopNav);
            navIcon.pos(x, y);
            Laya.stage.addChild(navIcon);
            navIcon.on(Laya.Event.CLICK, navIcon, clickNav, [navData.appid, navData.path, navData.name, "navIcon", navData.icon.path]);
        }
        WxUtils.showNav = showNav;

        function loopNav() {
            navData = WxConfig.NAV_DATA[Math.floor(Math.random() * WxConfig.NAV_DATA.length)];
            if (navIcon) {
                navIcon.changePath(navData.icon.path, navData.icon.cols, navData.icon.rows, navData.icon.duration, true);
                navIcon.on(Laya.Event.CLICK, navIcon, clickNav, [navData.appid, navData.path, navData.name, "navIcon", navData.icon.path]);
            }
        }

        function hideNav() {
            Laya.timer.clear(Laya.stage, loopNav);
            if (navIcon) {
                navIcon.destroy();
            }
        }
        WxUtils.hideNav = hideNav;
    })(WxUtils || (WxUtils = {}));
    /**
     * 设置对话框
     */
    class SettingDialog extends ui.dialog.DialogSettingUI {
        constructor() {
            super();
            this.btnClose.on(Laya.Event.CLICK, this, this.clickClose);
            this.cbSound.on(Laya.Event.CLICK, this, this.clickSound);
            this.cbMusic.on(Laya.Event.CLICK, this, this.clickMusic);
            this.cbVirbrate.on(Laya.Event.CLICK, this, this.clickVirbate);
        }
        clickClose(e) {
            e.stopPropagation();
            this.close();
        }
        clickVirbate(e) {
            e.stopPropagation();
            WxConfig.isNoVirbate = !WxConfig.isNoVirbate;
            Laya.Browser.window.wx.setStorageSync(WxConfig.NOVIRBATE, WxConfig.isNoVirbate);
        }
        clickMusic(e) {
            e.stopPropagation();
            WxConfig.isMuteMusic = !WxConfig.isMuteMusic;
            Laya.Browser.window.wx.setStorageSync(WxConfig.MUTE_MUSIC, WxConfig.isMuteMusic);
            soundUtils.playBgMusic();
        }
        clickSound(e) {
            e.stopPropagation();
            WxConfig.isMute = !WxConfig.isMute;
            Laya.Browser.window.wx.setStorageSync(WxConfig.MUTE, WxConfig.isMute);
        }
        static getSelf() {
            if (SettingDialog.self == null) {
                SettingDialog.self = new SettingDialog();
            }
            return SettingDialog.self;
        }
        init() {
            this.cbSound.selected = WxConfig.isMute;
            this.cbMusic.selected = WxConfig.isMuteMusic;
            this.cbVirbrate.selected = WxConfig.isNoVirbate;
        }
        popup() {
            super.popup();
            this.init();
        }
    }
    SettingDialog.self = null;
    /**
     * 打字机效果
     */
    class SpeekScript extends Laya.Script {
        constructor() {
            super(...arguments);
            this.speed = 200;
            this.text = null;
            this.self = null;
            this.selfText = null;
            this.ziIndex = 0;
            this.textArr = [];
        }
        onAwake() {
            this.self = this.owner;
            this.selfText = this.self.getChildAt(0);
        }
        onEnable() {
            this.selfText.pos(0, 0);
            this.typewrite(this.text, this.speed);
        }
        onClick() {
            Laya.timer.clear(this, this.onPlayDaZi);
            this.self.text = this.text;
        }
        clearTypewrite() {
            Laya.timer.clear(this, this.onPlayDaZi);
            this.self.text = this.text;
        }
        typewrite(text, speed = 100) {
            Laya.timer.clear(this, this.onPlayDaZi);
            this.self.text = "";
            if (!text)
                return;
            let thiz = this;
            thiz.text = text;
            thiz.speed = speed;
            thiz.ziIndex = 0;
            thiz.textArr = text.split("");
            Laya.timer.loop(speed, this, this.onPlayDaZi);
        }
        onPlayDaZi() {
            if (this.ziIndex >= this.textArr.length) {
                Laya.timer.clear(this, this.onPlayDaZi);
                return;
            }
            this.ziIndex++;
            soundUtils.playSound(WxConfig.TYPEWRITE_SOUND);
            let src = "";
            for (let i = 0; i < this.ziIndex; i++) {
                src += this.textArr[i];
            }
            this.self.text = src;
        }
    }
    /**
     * 动画效果
     */
    var AniUtils;
    (function (AniUtils) {
        function loadAni(path, nameOrIndex, caller, armatureCallBack, stopCallBack, loop) {
            let mFactory = new Laya.Templet();
            mFactory.on(Laya.Event.COMPLETE, caller, () => {
                let mArmature = mFactory.buildArmature(1);
                armatureCallBack(mArmature);
                if (loop) {
                    mArmature.play(nameOrIndex, true);
                } else {
                    mArmature.play(nameOrIndex, false);
                    mArmature.on(Laya.Event.STOPPED, caller, function stop() {
                        if (stopCallBack) {
                            stopCallBack();
                            mArmature.off(Laya.Event.STOPPED, caller, stop);
                        } else {
                            mArmature.destroy();
                        }
                    });
                }
            });
            mFactory.loadAni(path);
        }
        AniUtils.loadAni = loadAni;

        function passAni() {
            WxConfig.log("playPart =======");
            CaiDai.show(Laya.stage.width / 2, Laya.stage.height / 3);
        }
        AniUtils.passAni = passAni;

        function vibrateView(view, time) {
            let initPos = {
                x: view.x,
                y: view.y
            };
            var count = time ? (time / 10) : 50;
            var loop = 0;
            var offX;
            var offY;
            var dir = 1;
            var rotation;
            Laya.timer.loop(10, view, function () {
                loop++;
                dir = Math.random() > .5 ? 1 : -1;
                offX = Math.random() * 5 * dir + initPos.x;
                offY = Math.random() * 5 * dir * -1 + initPos.y;
                Laya.Tween.to(view, {
                    x: offX,
                    y: offY
                }, 10, Laya.Ease.linearNone, Laya.Handler.create(view, function () {
                    if (loop > count) {
                        Laya.timer.clearAll(view);
                        view.x = initPos.x;
                        view.y = initPos.y;
                        return;
                    }
                }));
            });
        }
        AniUtils.vibrateView = vibrateView;

        function rippleViews(views, stime, scale) {
            let len = views.length;
            let scalTime = stime ? stime : 100;
            let scaleN = scale ? scale : 1.1;
            for (let i = 0; i < len; i++) {
                let aniView = views[i];
                Laya.Tween.clearTween(aniView);
                Laya.timer.once(i * scalTime, aniView, function () {
                    Laya.Tween.to(aniView, {
                        scaleX: scaleN,
                        scaleY: scaleN
                    }, scalTime, Laya.Ease.linearIn, Laya.Handler.create(aniView, function () {
                        Laya.Tween.to(aniView, {
                            scaleX: 1,
                            scaleY: 1
                        }, scalTime, Laya.Ease.linearOut);
                    }));
                });
            }
        }
        AniUtils.rippleViews = rippleViews;
        const SCALE_DURATION = 200;
        const TWINKLE_DURATION = 100;

        function scaleAni(caller, view, scaleXY) {
            var obj = {
                scale: 0
            };
            var thiz = caller;
            var scaleTmp = scaleXY ? scaleXY : 0.2;
            Laya.Tween.to(obj, {
                scale: scaleTmp,
                update: new Laya.Handler(thiz, () => {
                    view.scaleX = 1 + obj.scale;
                    view.scaleY = 1 - obj.scale;
                })
            }, SCALE_DURATION, Laya.Ease.bounceInOut, Laya.Handler.create(thiz, function () {
                obj = {
                    scale: 0
                };
                Laya.Tween.to(obj, {
                    scale: scaleTmp,
                    update: new Laya.Handler(thiz, () => {
                        view.scaleX = 1 + scaleTmp - obj.scale;
                        view.scaleY = 1 - scaleTmp + obj.scale;
                    })
                }, SCALE_DURATION, Laya.Ease.bounceInOut);
            }));
        }
        AniUtils.scaleAni = scaleAni;

        function sharkAni(caller, view, count, times, callBack) {
            var index = count ? count : 0;
            var r = index % 4 === 0 ? 15 : (index % 4 === 1 ? 0 : (index % 4 === 2 ? -15 : 0));
            Laya.Tween.to(view, {
                rotation: r
            }, 60, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                if (index <= (4 * (times ? times : 5))) {
                    sharkAni(caller, view, index + 1, times, callBack);
                } else {
                    if (callBack) {
                        callBack();
                    }
                }
            }));
        }
        AniUtils.sharkAni = sharkAni;

        function shark3DObjAni(caller, view, count, times, callBack) {
            var index = count ? count : 0;
            var r = index % 4 === 0 ? 15 : (index % 4 === 1 ? 0 : (index % 4 === 2 ? -15 : 0));
            Laya.Tween.to(view.transform, {
                localRotationEulerX: r,
                localRotationEulerY: r
            }, 30, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                if (index <= (4 * (times ? times : 5))) {
                    shark3DObjAni(caller, view, index + 1, times, callBack);
                } else {
                    if (callBack) {
                        callBack();
                    }
                }
            }));
        }
        AniUtils.shark3DObjAni = shark3DObjAni;

        function sharkAniLeftRight(caller, view, count, times, callBack) {
            var index = count ? count : 0;
            var r = index % 4 === 0 ? 0 : (index % 4 === 1 ? 20 : (index % 4 === 2 ? 0 : -20));
            var t = view.x + r;
            Laya.Tween.to(view, {
                x: t
            }, 10, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                if (index <= (3 * (times ? times : 5))) {
                    sharkAniLeftRight(caller, view, ++index, times, callBack);
                } else {
                    if (callBack) {
                        callBack();
                    }
                }
            }));
        }
        AniUtils.sharkAniLeftRight = sharkAniLeftRight;

        function twinkle(caller, view, count, times, callBack) {
            var index = count ? count : 0;
            var r = index % 2 === 0 ? 0.5 : 1;
            Laya.Tween.to(view, {
                alpha: r
            }, TWINKLE_DURATION, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                if (index <= (2 * (times ? times : 1))) {
                    twinkle(caller, view, index + 1, times, callBack);
                } else {
                    WxConfig.log('播放完成回调');
                    if (callBack) {
                        WxConfig.log('播放完成回调 callBack');
                        callBack();
                    }
                }
            }));
        }
        AniUtils.twinkle = twinkle;

        function skipAni(caller, view, skipHeight, skipNum, callBack, skipIndex) {
            var obj = {
                scale: 0
            };
            var thiz = caller;
            var h = view.height;
            var baseY = view.y;
            var height = skipHeight ? skipHeight : (h * 3 / 4);
            var skipCount = skipNum ? skipNum : 3;
            var skips = skipIndex ? skipIndex : 0;
            height = height / (skips + 1);
            Laya.Tween.to(obj, {
                scale: height,
                update: new Laya.Handler(thiz, () => {
                    view.y = baseY - obj.scale;
                })
            }, 100, Laya.Ease.bounceInOut, Laya.Handler.create(thiz, function () {
                obj = {
                    scale: 0
                };
                Laya.Tween.to(obj, {
                    scale: height,
                    update: new Laya.Handler(thiz, () => {
                        view.y = baseY - height + obj.scale;
                    })
                }, 100, Laya.Ease.bounceInOut, Laya.Handler.create(thiz, function () {
                    if (skips >= skipCount) {
                        if (callBack) {
                            callBack();
                        }
                    } else {
                        skipAni(caller, view, skipHeight, skipNum, callBack, skips + 1);
                    }
                }));
            }));
        }
        AniUtils.skipAni = skipAni;

        function scaleInAni(caller, view) {
            Laya.Tween.to(view, {
                scaleX: 0.8,
                scaleY: 0.8
            }, 550, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                Laya.Tween.to(view, {
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 550, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {}));
            }));
        }
        AniUtils.scaleInAni = scaleInAni;

        function scaleOutAni(caller, view) {
            Laya.Tween.to(view, {
                scaleX: 1.2,
                scaleY: 1.2
            }, 550, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {
                Laya.Tween.to(view, {
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 550, Laya.Ease.linearInOut, Laya.Handler.create(caller, function () {}));
            }));
        }
        AniUtils.scaleOutAni = scaleOutAni;

        function twinkleView(content, callBack) {
            let w = content.width;
            let h = content.height;
            let img = new Laya.Image();
            img.skin = "comp/blurredCircle.png";
            img.size(w * 2, h * 2);
            img.alpha = 0;
            img.anchorX = 0.5;
            img.anchorY = 0.5;
            img.pos(w / 2, h / 2);
            content.addChild(img);
            Laya.Tween.to(img, {
                scaleX: 4,
                scaleY: 4,
                alpha: 0.5
            }, 500, Laya.Ease.linearOut, Laya.Handler.create(img, function () {
                Laya.Tween.to(img, {
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 0
                }, 500, Laya.Ease.linearIn, Laya.Handler.create(img, function () {
                    img.destroy();
                    if (callBack) {
                        callBack();
                    }
                }));
            }));
        }
        AniUtils.twinkleView = twinkleView;
        var vibrateObj = {
            x: 0,
            y: 0,
            rotation: 0,
            view: null
        };

        function vibrateScreen(view, callBack, time) {
            if (vibrateObj.view) {
                Laya.timer.clearAll(vibrateObj);
                vibrateObj.view.x = vibrateObj.x;
                vibrateObj.view.y = vibrateObj.y;
                vibrateObj.view.rotation = vibrateObj.rotation;
            }
            vibrateObj.x = view.x;
            vibrateObj.y = view.y;
            vibrateObj.rotation = view.rotation;
            vibrateObj.view = view;
            var count = time ? (time / 10) : 50;
            var loop = 0;
            var offX;
            var offY;
            var dir = 1;
            var rotation;
            Laya.timer.loop(10, vibrateObj, function () {
                loop++;
                dir = Math.random() > .5 ? 1 : -1;
                offX = Math.random() * 7 * dir + vibrateObj.x;
                offY = Math.random() * 7 * dir * (-1) + vibrateObj.y;
                if (loop > count) {
                    view.x = vibrateObj.x;
                    view.y = vibrateObj.y;
                    view.rotation = vibrateObj.rotation;
                    vibrateObj.view = null;
                    if (callBack) {
                        callBack();
                    }
                    Laya.timer.clearAll(vibrateObj);
                    return;
                }
                Laya.Tween.to(view, {
                    x: offX,
                    y: offY,
                    rotation: rotation
                }, 10, Laya.Ease.linearNone);
            });
        }
        AniUtils.vibrateScreen = vibrateScreen;
        var vCamera = {
            x: 0,
            y: 0,
            z: 0,
            camera: null
        };

        function vibrateCamera(camera, callBack, time) {
            if (vCamera.camera) {
                Laya.timer.clearAll(vCamera);
                vCamera.camera.transform.localPositionX = vCamera.x;
                vCamera.camera.transform.localPositionY = vCamera.y;
                vCamera.camera.transform.localPositionZ = vCamera.z;
            }
            vCamera.x = camera.transform.localPositionX;
            vCamera.y = camera.transform.localPositionY;
            vCamera.z = camera.transform.localPositionZ;
            vCamera.camera = camera;
            let count = time ? (time / 30) : 50;
            let loop = 0;
            let offX;
            let offY;
            let offZ;
            let dir = 1;
            Laya.timer.loop(30, vCamera, function () {
                Laya.Tween.clearAll(camera.transform);
                loop++;
                dir = Math.random() >= .5 ? 1 : -1;
                offX = Math.random() * 0.5 * dir + vCamera.x;
                offZ = Math.random() * 0.5 * dir * (-1) + vCamera.z;
                if (loop > count) {
                    camera.transform.localPositionX = vCamera.x;
                    camera.transform.localPositionZ = vCamera.z;
                    vCamera.camera = null;
                    if (callBack) {
                        callBack();
                    }
                    Laya.timer.clearAll(vCamera);
                    return;
                }
                Laya.Tween.to(camera.transform, {
                    localPositionX: offX,
                    localPositionZ: offZ
                }, 25, Laya.Ease.linearNone);
            });
        }
        AniUtils.vibrateCamera = vibrateCamera;
    })(AniUtils || (AniUtils = {}));



    /**
     * 游戏业务逻辑类
     */
    class GameView extends ui.view.GameViewUI {
        constructor() {
            super();
            this.callObj = null;
            this.gameStateCallback = null;
            this.q = null;
            this.gameState = WxConfig.GAME_STATE.NONE;

            this.name = "gameView";

        }
        setData(q, callBack, obj) {
            this.gameState = WxConfig.GAME_STATE.NONE;
            this.gameStateCallback = callBack;
            this.callObj = obj;
            this.q = q;

        }
        resetBanner() {

        }

        reset() {
            this.gameState = WxConfig.GAME_STATE.INIT;

        }


        judgeOver(flag) {

        }

        resetItemLayout() {
            let thiz = this;
            thiz.itemLayout.destroyChildren();
        }

        removeGif() {}
        showTip() {}
        showGuide() {

        }
        onFreeAdd(e) {
            e.stopPropagation();

        }
        clickSet(e) {
            e.stopPropagation();
            soundUtils.playSound(WxConfig.CHOOSE);
            SettingDialog.getSelf().popup();
        }
        initUI() {}
        static getSelf() {
            if (GameView.self == null) {
                GameView.self = new GameView();
            }
            return GameView.self;
        }
    }
    GameView.self = null;
    /**
     * 游戏界面承载页面
     */
    class GameUI extends ui.page.GameInfoUI {
        constructor() {
            super();
            this.gameView = null;
            this.gameState = WxConfig.GAME_STATE.NONE;
            this.hasOver = 0;
            this.level = 0;
            this.isGuide = false;
            this.clickTip = false;
            this.q = null;
            this.gameView = GameView.getSelf();
            this.height = Laya.stage.height;
            this.graphics.drawRect(0, 0, this.width, this.height, "#513d3e");
            this.setViews();
        }
        static getSelf() {
            if (!GameUI.self) {
                GameUI.self = new GameUI();
            }
            return GameUI.self;
        }
        setViews() {
            if (WxConfig.SCREENHEIGHT > WxConfig.LARGE_PHONE_H) {
                this.layoutLabel.y += WxConfig.IPHONEX_TOP - 10;
                this.layout.y += WxConfig.IPHONEX_TOP;
                this.btnTipLayout.y += WxConfig.IPHONEX_TOP;
            }
            this.gameView = GameView.getSelf();
            this.layout.addChild(this.gameView);
            this.height = WxConfig.SCREENHEIGHT;
        }
        setFreeTipCount() {
            game.getFreeTipCount();
        }
        gameStateChange(obj, state, data) {
            WxConfig.log("game state change:=>" + state);
            if (state == WxConfig.GAME_STATE.GAMEOVER) {
                obj.q = data;
                if (obj.hasOver == 1)
                    return;
                obj.hasOver = 1;
                obj.gameOver();
            } else if (state == WxConfig.GAME_STATE.INIT) {
                if (obj.isGuide) {
                    Laya.timer.once(500, obj, () => {
                        obj.gameView.showGuide();
                    });
                }
            } else if (state == WxConfig.GAME_STATE.DEATH) {
                obj.gameView.reset();
            }
        }
        initGameView(index) {
            this.q = WxConfig.questions[index - 1];
            this.gameView = GameView.getSelf();
            this.gameView.setData(this.q, this.gameStateChange, this);
            this.layout.addChild(this.gameView);
            this.setFreeTipCount();
        }
        initGameUi(levelIndex) {
            WxConfig.log('initGameUi');
            this.gameState = WxConfig.GAME_STATE.NONE;
            this.level = levelIndex;
            if (levelIndex > WxConfig.allQuestionLen) {
                let rnd = Math.floor(Math.random() * WxConfig.allQuestionLen);
                this.initGameUi(rnd);
            }
            WxConfig.level = this.level;
            this.isGuide = (this.level == 1);
            this.clickTip = false;
            this.removeGif();
            this.hasOver = 0;
            this.setLevel(levelIndex);
            let thiz = this;
            thiz.initGameView(this.level);
        }
        setLevel(levelIndex) {
            this.labelLevel.text = '第 ' + levelIndex + ' 关';
        }
        removeGif() {
            this.gameView.removeGif();
        }
        showTipFunc() {}
        onFreeTip(e) {
            e.stopPropagation();
            soundUtils.playSound(WxConfig.CHOOSE);
            let thiz = this;
        }
        gameOver() {
            var that = this;
            if (this.hasOver == 1) {
                this.gameState = WxConfig.GAME_STATE.GAMEOVER;
                WxUtils.saveUserData(this.level, 3);
                this.removeGif();
                Laya.stage.offAll();
                that.nextLevel();
            }
        }
        nextLevel() {
            Common.removeAllView();
            Common.addView(GameUI.getSelf());
            WxConfig.level++;
            GameUI.getSelf().initGameUi(WxConfig.level);
        }
    }
    GameUI.self = null;
    /**
     * 图片点击效果
     */
    class ImageRunTime extends Laya.Image {
        constructor() {
            super();
            this.scaleTime = 100;
            this.anchorX = this.anchorY = 0.5;
            this.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmal);
            this.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
            this.on(Laya.Event.MOUSE_OUT, this, this.scaleBig);
        }
        scaleBig() {
            Laya.Tween.to(this, {
                scaleX: 1,
                scaleY: 1
            }, this.scaleTime);
        }
        scaleSmal() {
            Laya.Tween.to(this, {
                scaleX: 0.8,
                scaleY: 0.8
            }, this.scaleTime);
        }
    }

    class GameConfig {
        constructor() {}
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/ImageRuntime.ts", ImageRunTime);
            reg("view/GameView.ts", GameView);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "view/GameView.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class ProgressBar extends ui.view.ProgressViewUI {
        constructor() {
            super();
            this.maxValue = 100;
            this.minValue = 0;
            this.progress = 0;
        }
        getProgress() {
            return this.progress;
        }
        setProgress(progress, max, min, callBack) {
            if (!isNaN(min)) {
                this.minValue = min;
            }
            if (!isNaN(max)) {
                this.maxValue = max;
            }
            let isBack = progress < this.progress;
            this.progress = progress;
            var per = this.progress / (this.maxValue - this.minValue) * this.progressBar.width;
            var moveX = -this.progressBar.width / 2 + per;
            if (isBack) {
                this.progressMask.x = -this.progressBar.width / 2;
                Laya.Tween.to(this.progressMask, {
                    x: moveX
                }, 500, null, Laya.Handler.create(this, function () {
                    if (callBack) {
                        callBack();
                    }
                }));
            } else {
                Laya.Tween.to(this.progressMask, {
                    x: moveX
                }, 500, null, Laya.Handler.create(this, function () {
                    if (callBack) {
                        callBack();
                    }
                }));
            }
        }
    }

    class LoadPage extends ui.page.LoadPageUI {
        constructor() {
            super();
            this.progressBar = null;
            this.progress = 0;
            this.subpackage = [
                'subassets'
            ];
            this.stateFlag = [];
            this.subLen = 0;
            this.loadIndex = 0;
            this.min = 0;
            this.max = 100;
            this.totalProgress = [0, 0, 0];
            this.callBack = null;
            this.msg = "抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。";
            this.progressBar = new ProgressBar();
            this.progressLayout.addChild(this.progressBar);
            this.subLen = this.subpackage.length;
            this.on(Laya.Event.REMOVED, this, this.onRemove);
            this.msgLabel.text = this.msg;
        }
        setCallBack(callBack) {
            this.callBack = callBack;
        }
        static getSelf(callBack) {
            if (LoadPage.self == null) {
                LoadPage.self = new LoadPage();
            }
            if (callBack) {
                LoadPage.self.setCallBack(callBack);
                LoadPage.self.loadRes(callBack);
            }
            return LoadPage.self;
        }
        loadRes(callBack) {
            this.callBack = callBack;
            this.setProgress(0);
            let thiz = this;
            thiz.loadIndex = 0;
            let isSuccess = true;
            if (this.subLen == 0) {
                thiz.onCompelete(thiz, isSuccess);
                return;
            }
            WxConfig.log(this.subpackage);
            for (let i = 0; i < this.subLen; i++) {
                if (thiz.stateFlag[i]) {
                    thiz.loadIndex++;
                    if (thiz.loadIndex == thiz.subLen) {
                        thiz.onCompelete(thiz, isSuccess);
                    } else {
                        continue;
                    }
                }
                let loadTask = wx.loadSubpackage({
                    name: thiz.subpackage[i],
                    success: (res) => {
                        WxConfig.log(res);
                        thiz.stateFlag[i] = true;
                    },
                    fail: (res) => {
                        isSuccess = false;
                        thiz.stateFlag[i] = false;
                    },
                    complete() {
                        thiz.loadIndex++;
                        WxConfig.log("分包加载完成:::" + thiz.subpackage[i]);
                        if (thiz.loadIndex == thiz.subLen) {
                            WxConfig.log("分包加载完成");
                            thiz.onCompelete(thiz, isSuccess);
                        }
                    }
                });
                loadTask.onProgressUpdate(res => {
                    WxConfig.log('下载进度  i=>' + i + res.progress);
                    WxConfig.log('已经下载的数据长度' + res.totalBytesWritten);
                    WxConfig.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
                    thiz.setProgress(res.progress);
                });
            }
        }
        setProgress(progress, min, max) {
            if (!isNaN(min)) {
                this.min = min;
            }
            if (!isNaN(max)) {
                this.max = max;
            }
            this.progress = progress;
            this.progressBar.setProgress(this.progress);
            this.loadText.text = '正在玩命加载...' + Math.round(progress) + '%';
        }
        onCompelete(call, flag) {
            WxConfig.questions = window["game_level_array"];
            WxConfig.allQuestionLen = WxConfig.questions.length;
            if (call.callBack) {
                call.callBack(flag);
            }
            call.removeSelf();
        }
        onRemove() {
            WxConfig.log("移出舞台");
            LoadPage.self = null;
            this.destroy();
        }
    }
    LoadPage.self = null;

    class SceneManager {
        constructor() {
            this.rootLayout = null;
            this.addRoot();
        }
        static getSelf() {
            if (!SceneManager.self) {
                SceneManager.self = new SceneManager();
            }
            return SceneManager.self;
        }
        addRoot() {
            if (this.rootLayout)
                return;
            this.rootLayout = new Laya.Sprite();
            this.rootLayout.size(Laya.stage.width, Laya.stage.height);
            Laya.stage.addChild(this.rootLayout);
            Common.rootLayout = this.rootLayout;
        }
        initGame(level) {
            this.rootLayout.removeChildren();
            this.rootLayout.addChild(GameUI.getSelf());
            GameUI.getSelf().initGameUi(level);
        }
        showNext() {}
        setGameUiNavi() {}
        showLogin() {}
    }
    SceneManager.self = null;

    class Main {
        constructor() {
            Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            Laya.Browser.window.systemInfo = wx.getSystemInfoSync();
            let platform = Laya.Browser.window.systemInfo.platform;
            let model = Laya.Browser.window.systemInfo.model;
            if (platform && platform.indexOf('android') != -1) {
                game.isIos = false;
            }
            WxConfig.log('model:' + model);
            if (model.indexOf('iPhone X') !== -1) {
                WxConfig.ifIphoneX = true;
            }
            UIConfig.closeDialogOnSide = false;
            game.pixelRatio = Laya.Browser.window.systemInfo.pixelRatio;
            game.scaleX = Laya.Browser.window.systemInfo.screenWidth / game.screenWidth;
            game.scaleY = Laya.Browser.window.scaleX;
            game.screenWidth = Laya.Browser.window.systemInfo.screenWidth;
            game.screenHeight = Laya.Browser.window.systemInfo.screenHeight;
            WxConfig.SCREENHEIGHT = Math.floor(Laya.Browser.window.systemInfo.screenHeight / game.scaleX);
            let urls = [{
                    url: "res/atlas/comp.atlas",
                    type: Laya.Loader.ATLAS
                },
                {
                    url: "res/atlas/caidai.atlas",
                    type: Laya.Loader.ATLAS
                }
            ];
            Laya.loader.load(urls, Laya.Handler.create(this, this.onAssetLoaded), Laya.Handler.create(this, this.onLoading), Laya.Loader.ATLAS);
            WxUtils.showBanner(0);
        }
        onLoading() {}
        onAssetLoaded() {
            CaiDai.init();
            Common.addView(LoadPage.getSelf(state => {
                WxConfig.log("加载页完成~~~");
                WxConfig.isLoadSubpackages = true;
                game.isLoadAssets = true;
                WxUtils.initShare(GameUI.getSelf());
                SceneManager.getSelf();
                game.getUserDataFromStorage();
                soundUtils.playBgMusic();
                if (game.all_level >= WxConfig.allQuestionLen) {
                    SceneManager.getSelf().initGame(game.all_level);
                } else {
                    SceneManager.getSelf().initGame(game.all_level + 1);
                }
            }));
        }
    }
    new Main();

}());