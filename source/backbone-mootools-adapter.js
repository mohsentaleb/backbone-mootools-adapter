/*
---
name: Backbone-Mootools Adapter

description: Provides an adapter to use Backbone.js with Mootools, without including jQuery at all

authors: [Mohsen Taleb]

requires:
 - Core/*

Inspired by: git://github.com/julesjanssen/chosen.git

license: MIT-style license

provides: BackboneMootoolsAdapter
...
*/

(function(window){
	
	/**
	 * Implementing some alias methods into Mootools "Elements" class
	 * that are used in jQuery and Backbone
	 */
	Element.implement({
		attr: function(attrs) {
			this.setProperties(attrs);
			
			return this;
		},
		
		hide: function() {
			this.setStyle('display', 'none');
			
			return this;
		},
		
		appendTo: function(selector) {
			var targetElement = $(document.body).getElement(selector);
			targetElement.adopt(this);
			
			return this;
		},
		
		html: function(htmlString) {
        	if (typeof htmlString === 'undefined') {
	             return this.get('html');
	        }
        	else {
				this.set('html', htmlString);
	        }
	        
            return this;
		},
		
		bind: function(eventName, method){
			if (eventName == 'popstate' || eventName == 'hashchange'){
			    this.addEventListener(eventName, method);
			}
			else {
			    this.addEvent(eventName, method);
			}
			
			return this;
        },

        unbind: function(eventName){
	        if (eventName !== ""){
	            this.removeEvent(eventName);
	        }
	        else {
	            this.removeEvents();
	        }
	        
            return this;
        },
        append: function(element) {
        	this.adopt(element);
        	
        	return this;
        }
	});
	
	
	/**
	 * Dummy jQuery factory function
	 * 
	 * @param  {element|string|object} expression
	 * @param  {DOMElement} context
	 * @return {DOM Element wrapped in Mootools}
	 */
    window.jQuery = function(expression, context){

        // Handle jQuery(html).
        if (typeof expression === 'string' && !context){
            if (expression.charAt(0) === '<' && expression.chartAt(expression.length - 1) === '>'){
                var element = new Element('div', {
                    html: expression
                }).getFirst();
                return element;
            }
        } 
        
        /**
         * As we're not going to change the core of Backbone in any ways,
         * while using Mootools, In Backbone Views, We wont be using "viewInstance.el"
         * because of the structure of retured object of a jQuery selector. as we have:
         * this.el = this.$el[0];
         * 
         * instead of element.html(viewInstance.el) we use:
         * element.append(viewInstance.$el);
         * 
         * // TODO: make html() method support this: DOMElement.html(viewInstance.$el)
         * 
         */
        if (typeof expression === 'object') {
    		return document.id(expression); 
			//return $$(expression);
        }

        // Handle jQuery(expression) and jQuery(expression, context).
        context = context || document;
        element = context.getElement(expression);
        return element;
    }

    /*
     * jQuery.ajax
     *
     * Maps a jQuery ajax request to a MooTools Request and sends it.
     */
    window.jQuery.ajax = function(params){
        var emulation = false;
        var data = params.data;
        if (Backbone.emulateJSON){
            emulation = true;
            data = data ? { model: data } : {};
        }

        var parameters = {
            url: params.url,
            method: params.type,
            data: data,
            emulation: emulation,
            onSuccess: function(responseText){
                params.success(JSON.parse(responseText));
            },
            onFailure: params.error,
            headers: { 'Content-Type': params.contentType }
        };

        new Request(parameters).send();
    };

})(window);
