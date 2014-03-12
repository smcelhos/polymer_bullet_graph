Polymer("bullet-", {
	width: 610,
	height: 50,
	data: null,
	margin: null,
	duration: 600,
	created: function(){ 
		// summary:
		//		Lifecycle method
		
		// initialize margin
		this.margin = { top: 5, right: 40, bottom: 20, left: 120 };
		
		// calculated dimensions
		this.graphWidth = this.width - this.margin.left - this.margin.right;
		this.graphHeight = this.height - this.margin.top - this.margin.bottom;
			
	},
	dataChanged: function(oldValue, newValue){
		// summary:
		//		Watch function for data.  If data is in JSON format, convert it to an object
		//	oldValue: null || object 
		//		The previous value of data, or null if this is the first time we are setting
		//	newValue: string || object
		//		The new value we are setting data too, should be an object or string
		
		
		// handle JSON data (most likely from template)
		if(typeof newValue === "string"){
			try{
				this.data = JSON.parse(newValue);
			}catch(e){
				// not valid json?  What do we do?
				throw new Error("u be crazy");
			}
		}
		this._expandData();
	},
	// if data, or data component parts, change, we want to re-calc graphics
	observe: {
		"data.ranges": "_expandData",
		"data.measures": "_expandData",
		"data.markers": "_expandData"
	},
	_sort: function(prop){
		// summary:
		//		Sort a given prop, or all relevant properties of data in descending order
		//	prop: String?
		//		Optional name of array-like property on data object we would like to sort 
		if(!prop){
			this.data.ranges.sort(this.descending);
			this.data.measures.sort(this.descending);
			this.data.markers.sort(this.descending);
		}else{
			this.data[prop].sort(this.descending);
		}
	},
	_expandData: function(){
		// summary: 
		//		Expand our simple data model out into something we can bind template too.
		
		// need to sort so we can scale
		this._sort();
		this.ranges = this.rangez();
		this.measures = this.measurez();
		this.markers = this.markerz();
		this.ticks = this.tickz();
	},
	scale: function(x){
		// summary:
		//		Scale to our x coordinate

		// TODO: remove d3 dependency, or use fully
		return d3.scale.linear()
          .domain([0, Math.max(this.data.ranges[0], this.data.markers[0], this.data.measures[0])])
          .range([0, this.graphWidth])(x);
	},
	descending: function (a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    },
	rangez: function(){
		// summary:
		//		Expand data.ranges to objects we can bind too
		// return Array
		//		An array of range objects, with scaled properites for our template to bind too
		
		var base = this.data.ranges;
		
		var scale = this.scale.bind(this);
		var graphHeight = this.graphHeight;
		var ranges = base.map(function(range){
			return {
				value: range,
				width: scale(range),
				height: graphHeight,
				x: 0
			};
		});
		
		return ranges;
	},
	measurez: function(){
		// summary:
		//		Expand data.measures to objects we can bind too
		// return Array
		//		An array of measure objects, with scaled properites for our template to bind too
	
		var base = this.data.measures.sort(this.descending);;
		var scale = this.scale.bind(this);
		var graphHeight = this.graphHeight;
		var measures = base.map(function(measure){
			return {
				value: measure,
				width: scale(measure),
				height: graphHeight/3,
				x: 0,
				y: graphHeight/3
			};
		}); 
		
		return measures;
	},
	markerz: function(){
		// summary:
		//		Expand data.markers to objects we can bind too
		// return Array
		//		An array of marker objects, with scaled properites for our template to bind too
		
		var base = this.data.markers.sort(this.descending);;
		var scale = this.scale.bind(this);
		var graphHeight = this.graphHeight;
		var markers = base.map(function(marker){
			return {
				value: marker,
				x1: scale(marker),
				x2: scale(marker),
				y1: graphHeight/6,
				y2: graphHeight * (5/6)
			};
		});
		
		return markers;
	},
	tickz: function(){
		// summary:
		//		Create a list (array) of tick marks appropriate for our scale
		//	return Array
		//		An array of tick objects with properties for our template to bind too
		
		// TODO: remove d3 dependency, or use to full effect
		var base = d3.scale.linear()
          .domain([0, Math.max(this.data.ranges[0], this.data.markers[0], this.data.measures[0])])
          .range([0, this.graphWidth]).ticks(8);
		  
		 var scale = this.scale.bind(this);
		var graphHeight = this.graphHeight;
		var ticks = base.map(function(tick){
			return { 
				value: tick,
				height: graphHeight,
				scaled: scale(tick)
			};
		});
		
		return ticks;
	}
	
});