# ytmfdwMiniGameFramework
# Laya小游戏基础框架

该项目为Laya2游戏开发的基础框架，包括常用工具类


Laya版本：2.8.0


### 主要功能： 
		1、分包加载功能 ，添加多分包，分级加载功能
		2、页面切换功能 
		3、常用工具类：Map、Log、Banner、Sound等 
		5、基础页面及对话框 
		6、加载页、首页、游戏页、过关结算页 只完成基本框架，没实现业务逻辑 
		7、屏幕适配
		8、常用切图、音效文件
		9、导量对话框
		
### 主要文件(合并到./js/bundle.js文件中)（详见文件注释）：
		Game.js					框架入口文件
		config.js				框架配置文件
		
		widget					自定义控件存放目录
		widget/ProgressView.js	进度条（由遮罩效果实现，需要WebGl）
		
		utils					工具类存放目录
		utils/AniUtils.js		公共动效类
		utils/Common.js			游戏设置类
		utils/imageRunTime.js	点击效果类
		utils/log.js				统一日志打印类
		utils/Map.js				键值对工具类
		utils/question.js		游戏关卡定义类
		utils/SharedUtils.js		分享工具类
		utils/sound.js			声音工具类
		utils/syncUtil.js		同步工具类
		utils/wxUtils.js			微信工具类
		
		ui						Laya界面目录（自动生成）
		
		home						游戏首页、加载页目录
		home/LoadPage.js			加载页
		
		game						游戏相关类目录
		game/GameInfo.js			游戏主页
		game/PassPage.js			过关结算页
		game/SettingsDialog.js	游戏设置对话框
		game/appListDialog.js	导量对话框
		game/appListDialog1.js	新导量对话框
		
		effect					特效相关目录
		effect/CaiDai.js			过关小彩带
		UI切图						切图文件
		音乐库						音效文件
		
### 接口说明
		Game.js				loadLaya()：	小游戏入口函数，初始舞台，加载图集，加载缓存，加载LoadPage
		home/LoadPage.js		loadRes(callBack:Function):		加载分包或网络资源，加载完成后，回调callBack
		game/GameInfo.js		initGameUi() ：	加载游戏界面，游戏逻辑由此入
		game/PassPage.js		setData(data:any):	过关数据展示
		game/PassPage.js		nextClick():	点击下一关
		
### License
	
released under the [Apache 2.0 license](LICENSE).

```
Copyright 2020 Ytmfdw Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```