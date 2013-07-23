var deb = (function(){
	
	
	function makeToc(xml)
	{
	    // variable to accumulate markup
	    var markup = "";
	    // worker function local to makeToc
	    var index = -1;
		var seen = [];
	    function processXml()
	    {
	
	        //var elem = $(this).find('node-collection:first');
	        //$(this).children('tag_name').length > 0;			
	        index++;
			if (seen[$(this).attr('id')] != true) {
				if ($(this).children('node-collection:first').length > 0) {
					markup += "<li><span id='menuitem' class='folder'>" + $(this).find('title:first').text() + "</span>";
					// var anchor = "<a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a>";
					// alert($(this).find('title:first').text());
					index--;
	
					markup += "<ul id='navigation'>";
	
					$(this).find("node").each(processXml);
					markup += "</ul>";
				}
				else {
					if ($(this).find('Show-in-outline-:first').text() != '1') {
						markup += "<li><span id='menuitem'><a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a></span>";
					}
				}
				markup += "</li>";
				seen[$(this).attr('id')] = true;
			}
	    }
	    // call worker function on all children
	    $(xml).children().each(processXml);
	    return markup;
	}
	
	var me = {
		init : function(){
			console.log('Hello world from the greatest nation on Earth!!');			
		},
		
		showTree : function(){
			makeToc();
		}
			
	};
	
	return me;
})();



$(document).ready(function () {
	deb.init();		
});