var deb = (function() {

	var mainOfflineInit_origin = MainOffline.init;
	var hasInit = false;
	var feedNumber;
	// Unit number from MainOffline.init argument;
	
	trace('deb loaded');

	var me = {
		init : function() {
			hasInit = true;
			trace('feednumber', feedNumber);

			me.showTree();
		},

		showTree : function() {
			mainJS();
		}
	};

	/*
	 *
	 */
	trace(MainOffline.init);
	MainOffline.init = function(args) {
		trace('MainOffline.init override');
		feedNumber = args;

		if (!hasInit)
			me.init();

		mainOfflineInit_origin(args);
	}
	function mainJS() {
		if (!feedNumber)
			feedNumber = 1;

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
	}

	function playerJSparseXML(xml) {
		var startNode = $(xml).find('node-collection:first');
		var debug_menuMarkUp = playerJSmakeToc(startNode);
		var menuContent = $("<div style='position:absolute; top: 0; z-index:9990; width: 400px; height: 400px; overflow: auto;'><ul id='navigation'>" + debug_menuMarkUp + "</ul></div>").appendTo('#titleBar');
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

