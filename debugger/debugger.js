var deb = (function() {

	var mainOfflineInit_origin = MainOffline.init;
	// Unit number from MainOffline.init argument;
	var feedNumber;

	var $menuContent;
	// Tree menu html

	var me = {
		init : function() {
			hasInit = true;
			trace('feednumber', feedNumber);

			me.showTree();

			me.canSkip();
		},

		showTree : function() {
			$.ajax({
				url : "data/asset-feed/" + feedNumber + ".xml",
				dataType : ($.browser.msie) ? "text" : "xml",
				success : function(data) {
					var xml;
					if ( typeof data == "string") {
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = false;
						xml.loadXML(data);
					} else {

						xml = data;
					}

					playerJSparseXML(xml);
				},
				error : function() {
					trace('Error loading ' + feedNumber + '.xml');
				}
			});
		},

		hideTree : function() {
			if ($menuContent)
				$menuContent.hide();
		},

		canSkip : function() {
			// var org_permissionCheckResultHandler = window.permissionCheckResultHandler;

			window.permissionCheckResultHandler = function(e) {

				trace('override surrogate.js permissionCheckResultHandler');

				var callback = offlineLoaders[e.data.index].callback;
				var data = e.data.result;

				offlineLoaders[e.data.index] = null;

				if (data.indexOf("true") > -1) {
					//return true;
					if ( typeof callback == 'function') {
						callback();
					}
				} else {
					// alert('you do not have permission to view this yet!');

					if ( typeof callback == 'function') {
						callback();
					}

					return false;
				}
			}
		},

		login : function() {
			var un = '60';
			var pass = 'd41d8cd98f00b204e9800998ecf8427e';
			// LIM.surrogate.loadUser("http://myprime.o.wwbtc.com/passcheck.php?uid=" + un + "&md5=" + pass);
			LIM.surrogate.loadUser("http://myprime.o.wwbtc.com/passcheck.php?uid=60" + "&md5=d41d8cd98f00b204e9800998ecf8427e");

		},

		next : function() {
			trace('stepNumber : ' + stepNumber + ' nid : ' + getNidByStep(stepNumber));
			handleBranchAsset(getNidByStep(stepNumber));
		},

		handleCourse : function() {
			var object = {
				'id' : '11339',
				'src' : '11339.swf?pri',
				'title' : 'Lesson Intro Screen',
				'type' : ''
			};
		},

		gotoUnit : function(num) {
			/*
			 *
			 // node id of the first scene of the unit.
			 var nid = 11363;

			 if ( num = 1) {
			 nid = 11493;
			 } else if ( num = 2) {
			 nid = 11336;
			 } else {
			 nid = 11363;
			 }

			 if (surrogate) {
			 var requestLoader = {
			 failcallback : function() {
			 trace('failed at goto Unit');
			 }
			 };

			 requestLoader.data = {
			 index : offlineLoaders.push(requestLoader) - 1,
			 request : {
			 method : "POST",
			 url : "/coursedata/course_data/jumpToLesson/",
			 data : {
			 'nid' : nid
			 }
			 }
			 };

			 surrogate.load(requestLoader, "goToLesson");
			 }
			 */
		},
		
		go : function(nid)
		{
			surrogate.goto(nid);
		}
	};

	/*
	 *
	 */
	MainOffline.init = function(args) {
		trace('MainOffline.init override');
		mainOfflineInit_origin(args);

		if (args) {
			feedNumber = args;
			me.init();
		}
	}

	function playerJSparseXML(xml) {
		var startNode = $(xml).find('node-collection:first');
		var debug_menuMarkUp = playerJSmakeToc(startNode);
		if ($menuContent)
			$menuContent.empty();
		// clear out old markups
		$menuContent = $("<div id='debug-tree' style='position:absolute; top: 0; right: 20px; z-index:9990; width: 300px; height: 600px; overflow: auto; background-color: grey;'><ul id='navigation'>" + debug_menuMarkUp + "</ul></div>").appendTo('#titleBar');
	}

	function playerJSmakeToc(xml) {
		// variable to accumulate markup
		var markup = "";
		// worker function local to makeToc
		var index = -1;
		var seen = [];

		//Level will revolve Issues with groups. Groups are level2 classed.
		var currentLevel = 1;

		function processXml() {

			//var elem = $(this).find('node-collection:first');
			//$(this).children('tag_name').length > 0;
			index++;
			if (seen[$(this).attr('id')] != true) {
				if ($(this).children('node-collection:first').length > 0) {
					currentLevel++;
					if (currentLevel == 3) {
						markup += "<li><span id='menuitem' class='folder grouped'>" + $(this).find('title:first').text() + "</span>";
					} else {
						markup += "<li><span id='menuitem' class='folder'>" + $(this).find('title:first').text() + "</span>";
					}

					index--;

					markup += "<ul id='navigation'>";
					$(this).find("node").each(processXml);

					markup += "</ul>";
					markup += "</li>";
					currentLevel--;
				} else {
					//if ($(this).find('Show-in-outline-:first').text() != '1') {
					if (currentLevel == 3) {
						markup += "<li class='groupchild'><span id='menuitem'><a href='#' id=" + index + " class='level2'>" + $(this).find('title:first').text() + "</a></span>";
						//markup += "<li><span class='menuitem'><a href='#' id=" + index + " class='level2'>" + $(this).find('title:first').text() + "</a></span>";
					} else {
						markup += "<li><span id='menuitem'><a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a></span>";
						//markup += "<li><span class='menuitem'><a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a></span>";
					}
					markup += "</li>";
					//}
				}
				//markup += "</li>";
				seen[$(this).attr('id')] = true;
			} else {
				index--;
				//markup += "</ul>";
			}
		}

		// call worker function on all children
		$(xml).children().each(processXml);
		//console.log(markup);
		//$(markup).find()
		return markup;
	}

	function trace(val1, val2) {
		console.log('-@@-', val1, arguments);
	}

	return me;
})();

console.log('deb loaded');
