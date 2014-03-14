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

		var domain = [0, Math.max(this.data.ranges[0], this.data.markers[0], this.data.measures[0])];
		var range = [0, this.graphWidth];
		
		return this._scale_bilinear(domain, range)(x);//interpolate(uninterpolate(x));
	
	},
	
	_uninterpolate: function(a, b){
		b = b - (a = +a) ? 1 / (b - a) : 0;
		return function(x) {
		  return (x - a) * b;
		};
	},
	
	_interpolate: function(a, b){
		b -= a = +a;
		return function(t) {
		  return a + b * t;
		}
	},
	
	_scale_bilinear: function(domain, range){
		var u = this._uninterpolate(domain[0], domain[1]);
		var i = this._interpolate(range[0], range[1]);
		
		return function(x){
			return i(u(x));
		}
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
	
	range_integerScale: function(x){
		var k = 1;
		while (x * k % 1) k *= 10;
		return k;
	},
	// TODO: Rename
	_range: function(start, stop, step){
		// summary:
		// 		Using start/stop/step create appropriate intervals
		//	start: int
		//		starting int
		//	stop: int
		//		stopping int
		// step: int
		//
		//	return Number Array
		//		range
		
		if (arguments.length < 3) {
		  step = 1;
		  if (arguments.length < 2) {
			stop = start;
			start = 0;
		  }
		}
		
		if ((stop - start) / step === Infinity){ throw new Error("infinite range") };

		var range = [], k = this.range_integerScale(Math.abs(step)), i = -1, j;
	
		start *= k, stop *= k, step *= k;
		if (step < 0){ 
			while ((j = start + step * ++i) > stop) {range.push(j / k);} 
		}else{ 
			while ((j = start + step * ++i) < stop){ range.push(j / k);}
		}
		
		return range;
	},
	
	extent: function(m){
	
		var extent = [0, /*should prob be min*/ Math.max(this.data.ranges[0], this.data.markers[0], this.data.measures[0])];
		var span = extent[1] - extent[0];
		var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
		
		if (err <= .15){step *= 10;} else if (err <= .35) {step *= 5; }else if (err <= .75) {step *= 2};
		extent[0] = Math.ceil(extent[0] / step) * step;
		extent[1] = Math.floor(extent[1] / step) * step + step * .5;
		extent[2] = step;
		
		return extent;
	
	},
	
	tickz: function(){
		// summary:
		//		Create a list (array) of tick marks appropriate for our scale
		//	return Array
		//		An array of tick objects with properties for our template to bind too
		var m = 8; // magic number, max number of ticks
		// TODO: see if we need to use min instead of 0
		var extent = this.extent(m);
		var start = extent[0];
		var stop = extent[1];
		var step = extent[2];
		
		var range = this._range(start, stop, step);
		
		
		// TODO: remove d3 dependency, or use to full effect  
		  
		 var scale = this.scale.bind(this);
		var graphHeight = this.graphHeight;
		var ticks = range.map(function(tick){
			return { 
				value: tick,
				height: graphHeight,
				scaled: scale(tick)
			};
		});
		
		return ticks;
	}
	
});