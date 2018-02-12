var termSheet = {
	pullRequest: ko.observable(0),
	ts:{
		render 				 : ko.observable(false),
		loading 			 : ko.observable(false),
		issuerName 		 	 : ko.observableArray([]),
		issuerRating 		 : ko.observableArray([]),
		instrument   		 : ko.observable(""),
		distributionFormat   : ko.observableArray([]),
		currency 			 : ko.observableArray([]),
		size 				 : ko.observableArray([]),
		tenors 				 : ko.observableArray(),
		benchmarkYield		 : ko.observableArray([]),
		benchmarkToSpread	 : ko.observableArray([]),
		yield			     : ko.observableArray([]),
		afterSwap 			 : ko.observableArray([])
	},
	bondIssuenceSpreads:{
		render 		: ko.observable(false),
		yAxis 		: ko.observable(""),
		yAxisList 	: ko.observableArray([
											{ text:'Bid YTM',value:'Bidytm' },
											{ text:'Bid Spread G',value:'Bidgspread' },
											{ text:'Bid Spread Z',value:'Bidzspread' }
										])
	},
	table:{
		dataSource: ko.observableArray([]),
		render:ko.observable(false)
	},
	relativeValueCharts:{
		render 	: ko.observable(false),
		widgets : ko.observableArray([]),
		tenorList : ko.observableArray([]),
		ds : {
			basis 	: 0,
			tenors 	: [],
			size  	: 0,
			premium : 0,
			ratting : 0,
			totals   : []
		}
	},
	charts:{
		f:{
			listField: ko.observableArray([
									{
										text: "Bid_Price",
										value: "bid_price",
									},
									{
										text: "Ask_Price",
										value: "ask_price",
									},
									{
										text: "Bid_Yield",
										value: "bid_yield",
									},
									{
										text: "Ask_Yield",
										value: "ask_yield",
									},
									{
										text: "Bid_Tsy_Spread",
										value: "bid_tsy_spread",
									},
									{
										text: "Ask_Tsy_Spread",
										value: "ask_tsy_spread",
									},
									{
										text: "Bid_ASW",
										value: "bid_asw",
									},
									{
										text: "Ask_ASW",
										value: "ask_asw",
									},

									{
										text: "Bid_ZSpread",
										value: "bid_zspread",
									},
									{
										text: "Ask_ZSpread",
										value: "ask_zspread",
									},
									{
										text: "Bid_YTM",
										value: "bid_ytm",
									},
									{
										text: "Ask_YTM",
										value: "ask_ytm",
									},
									]),
			listIsin: ko.observableArray([]),
			valField: ko.observable("bid_price"),
			valIsin: ko.observable(""),
			valPeriod: ko.observable(1), 
		},
		ds: ko.observableArray([]),
		render: ko.observable(false),
		loading: ko.observable(false),
		infoChart: ko.observable({}),
	}
};
termSheet.summaryTableConfig = {
	issuerColspan: ko.observable(0),
	defaultColspan: ko.observable(0),
	tenorsColspan: ko.observable(0),
}
function createsummaryTableConfig(){
    
    var min = 3;
    var max = createTermSheet.tenor.checkeds().length;
    if(max > min){
    	min = max;
    	max = min;
    }

    var condition = false;
    var maxkali = 0;
    var minKali = 0;
    var minMultiple = [];
    var maxMultiple = [];
    var multiple = 0;
    var condition = false;
    var index = 0;

    while(!condition){
        index++;
        minMultiple.push(min * index);
        maxMultiple.push(max * index);
        var found = _.indexOf(maxMultiple,  min * index) + 1;
        if(found > 0){
            multiple = min * index;
            maxkali = found;
            minKali = index;
            condition =  true;
        }
    } 
    termsheet.summaryTableConfig.defaultColspan(multiple);
    
    if(createTermSheet.tenor.checkeds().length > 3){
    	termsheet.summaryTableConfig.tenorsColspan(maxkali);
    	termsheet.summaryTableConfig.issuerColspan(minKali);
    }else{ 
    	termsheet.summaryTableConfig.issuerColspan(minKali);
    	termsheet.summaryTableConfig.tenorsColspan(maxkali);
    }
}
termSheet.pullRequest.subscribe(function(n){
	if(n == 0)
		ds.loading(false);
})
termSheet.charts.f.valPeriod.subscribe(function(n){
	termSheet.GetChartGraphIsin()
})
// termSheet.ts = {	
// 	render 				 : ko.observable(false),
// 	loading 			 : ko.observable(false),
// 	issuerName 		 	 : ko.observableArray([]),
// 	issuerRating 		 : ko.observableArray([]),
// 	instrument   		 : ko.observable(""),
// 	distributionFormat   : ko.observableArray([]),
// 	currency 			 : ko.observableArray([]),
// 	size 				 : ko.observableArray([]),
// 	tenors 				 : ko.observableArray(),
// 	benchmarkYield		 : ko.observableArray([]),
// 	benchmarkToSpread	 : ko.observableArray([]),
// 	yield			     : ko.observableArray([]),
// 	afterSwap 			 : ko.observableArray([])
// };
// termSheet.bondIssuenceSpreads = {	
// 	render 		: ko.observable(false),
// 	yAxis 		: ko.observable(""),
// 	yAxisList 	: ko.observableArray([
// 										{ text:'Bid YTM',value:'Bidytm' },
// 										{ text:'Bid Spread G',value:'Bidgspread' },
// 										{ text:'Bid Spread Z',value:'Bidzspread' }
// 									])
// };
termSheet.bondIssuenceSpreads.yAxis.subscribe(function(){
	termSheet.createChartScatter();
});
// termSheet.table = {	
// 	dataSource: ko.observableArray([]),
// 	render:ko.observable(false),
// };
// termSheet.relativeValueCharts = {	
// 	render 	: ko.observable(false),
// 	widgets : ko.observableArray([]),
// 	tenorList : ko.observableArray([]),
// 	ds : {
// 		basis 	: 0,
// 		tenors 	: [],
// 		size  	: 0,
// 		premium : 0,
// 		ratting : 0,
// 		totals   : []
// 	}
// };
termSheet.GetBenchmark = function(){
	var total = [];


	var payload = {
		Tenor 	: pbGrid.gridTemplateFirst().payload.Tenor,
		Product : ds.issuerSelected.product,
		Total   : termSheet.relativeValueCharts.ds.totals,
		Flag 	: createTermSheet.finish.value(),
		Range 	: createTermSheet.finish.rangeValue(),
		Typevalue : createTermSheet.bidType()
	};

	ajaxPost("/dashboard/benchmark", payload, function (res){
	 	 termSheet.pullRequest(termSheet.pullRequest() - 1);
	 	 if(res.IsError)
	 	 	return;

		var benchmarkYields 	= [];
		var benchmarkToSpreads 	= [];
		var yields 				= [];
		var afterSwaps 			= [];
		
		_.each(res.Data, function(o){
			benchmarkYields.push(o.benchmarkyield);
			benchmarkToSpreads.push(o.spreadbenchmark);			
			yields.push(o.yield);
			afterSwaps.push(o.afterswamp);
		});

	 	termSheet.ts.benchmarkYield(benchmarkYields);
		termSheet.ts.benchmarkToSpread(benchmarkToSpreads);
		termSheet.ts.yield(yields);	
		termSheet.ts.afterSwap(afterSwaps);
		// termSheet.ts.loading(false);
		termSheet.ts.render(true);
	});
};
function getWidthPercetage(len){
	return String(100/len) + "%"; 
};
termSheet.renderTs = function(){
	var config  = termSheet.ts;
	if(config.render())
		return;

	config.loading(true);
	var rowBasis = pbGrid.rowBasis();
	config.issuerRating([ds.issuerSelected.moodys_issuer_rating, ds.issuerSelected.sp_issuer_rating, ds.issuerSelected.fitch_issuer_rating]);
	config.instrument(rowBasis.Ranking);
	config.distributionFormat([{text:"Reg S",value:"Reg S"},{text:"144A",value:"144A"}]);
	config.currency(["USD"]);
	config.tenors(pbGrid.gridTemplateFirst().tenors());
	config.size([parseInt(createTermSheet.issuenze.issueSize())]);
	config.issuerName(ds.issuerSelected.issuer);
	termSheet.GetBenchmark();
};
termSheet.createChartScatter = function(){
	var dataSource 	= _.first( 
							_.reject(pbGrid.dataGridTemplateFirst(), function(o){ 
								return pbGrid.gridTemplateFirst().deleteIsin().indexOf(o.Isin) != -1; 
							})  
						,10);
	var circelData 	= [];
	var colorScatter = ( createTermSheet.sameIssuer() ) ? "#60D5A8" : "#7BBFF6";
	_.each(dataSource,function(o){
		var color = "#7BBFF6";
		if(pbGrid.rowBasis().Issuer == o.Issuer)
			color = "#60D5A8";

		var y =  o[termSheet.bondIssuenceSpreads.yAxis()];
		if(termSheet.bondIssuenceSpreads.yAxis() == "Bidytm"){
			y = y/100;
		}
		circelData.push({
							x: o.Yearsmaturity, 
							y: y,
							desc: o.Security + ' / ' + o.Moodysissuerating + " "+ o.Spissuerating + " " + o.Fitchissuerrating,
							color: color
						});
	});
	var maxX_circele  = _.max(circelData, function(c){ return c['x'] })['x'];
	// console.log(maxY_circele);
	// 
	// 
	var  dataTotal = [];
	if(termSheet.bondIssuenceSpreads.yAxis() == "Bidytm"){
		dataTotal = termSheet.ts.yield();
	}else if(termSheet.bondIssuenceSpreads.yAxis()  == "Bidzspread"){
		dataTotal = termSheet.ts.benchmarkToSpread();
	}else{
		dataTotal = termSheet.ts.afterSwap();			
	}
	_.forEach(termSheet.relativeValueCharts.ds.totals, function(o,i){
		y = 0;
		switch(createTermSheet.finish.value()){
			case"Range":
				var d = dataTotal[i].split("-");
				y= ( parseFloat(d[0]) + parseFloat(d[1]) ) / 2;
			break;
			case"Area":
				y = parseFloat(dataTotal[i]);
			break;
			default:
				y = parseFloat(dataTotal[i]);
		}
		circelData.push({
							x: pbGrid.gridTemplateFirst().tenors()[i],
							// parseInt( maxX_circele ) + 1, 
							y: y, 
							desc: "Current Issue " + kendo.toString(y,"n0"),
							color: "#c9302c"
						});
	}) 
	var minY 		= _.min(_.clone(circelData), function(data){
							if(!_.has(data,'y'))
								return 0;
						 	return data.y;
						}).y; 
	var minX 		= _.min(_.clone(circelData), function(data){
						if(!_.has(data,'x'))
							return 0;
					 	return data.x;
					 }).x;

	var maxY		= _.min(_.clone(circelData), function(data){
							if(!_.has(data,'y'))
								return 0;
						 	return data.y;
						}).y; 
	var maxX 		= _.min(_.clone(circelData), function(data){
						if(!_.has(data,'x'))
							return 0;
					 	return data.x;
					 }).x;
	var xAxisMin = ( ( parseInt(minX.toFixed(0)) - 1 ) < 0 ) ? 0 : parseInt(minX.toFixed(0)) - 1;
	var yAxisMin =  parseInt( minY.toFixed(0) - 10);
	$("#scatterChartTab4").find(".contentWidget").html("")
	$("#scatterChartTab4").find(".contentWidget").kendoChart({
		series: [
			{
				type: "scatter",
				xField: "x",
				yField: "y",
				data: circelData,
				color : function(e){ 
					 return  e.dataItem.color;
				}, 
				markers: {
					size: function(e){
						return 10 
					}, 
					background : function(e){
						 return  e.dataItem.color;
					}
				},
				labels:{
					font: ds.font('9px'),
					visible:true,
				    template:function(e){
				    	return  e.dataItem.desc;
				    }
				},
			}
		],
		chartArea: {
		    background: "#f4f4f9",
		    margin:{
		    	top:40,
		    	left:20,
		    	right:50,
		    	bottom:40
		    }
		},  
		legend:{
			visible:false
		},
		xAxis: { 
			min : xAxisMin,
			labels: { 
			   	font: ds.font('11px'),
			    template:function(e){
			    	return e.value.toFixed(0);
			    },
			    color: "#0e678d"
   			},
   			majorGridLines: {
   				visible:false
   			},
 
        },
        yAxis:{  
    		min  : yAxisMin,
    		labels: { 
			   	font: ds.font('11px'),
			    template:function(e){
			    	return e.value.toFixed(0); 
			    },
			    color: "#0e678d"
   			},
   			majorGridLines: {
				visible: true,
				dashType: "dash"
			},
			// majorUnit :  ( maxY - yAxisMin ) / 3

        },
     
        tooltip 	: {
        	background:"#353D47",
            border: {
                width: 1,
                color: "#DDD"
	        },
        	visible  : false,
        	template : function(e){
        		return e.dataItem.desc;
        	}
        },
		pannable 	: true,
        zoomable 	: false,
	});
};
termSheet.crateeChartRange =  function(obj){
 
	var allDs =  termSheet.relativeValueCharts.ds;
	// var bench = "Bench YTM";

	// if(ds.issuerSelected.product.toLowerCase() == 'ig' || ds.issuerSelected.product.toLowerCase() == 'crossover')
	// 	bench = "Bench Z";
	var bench = "Base Comp ";
	switch(createTermSheet.bidType()){
		case"bid_ytm":
			bench += "YTM";
		break;
		case"bid_z_spread":
			bench += "Z";
		break;
		case"bid_g_spread":
			bench += "G";
		break;
		 
	}
 	var listCategory = [bench, "Tenor Diff", "LP", "NIC", "Ratings Diff"];
	var datas  = [allDs.basis, 
				 allDs.tenors[obj.tenor()], 
				 allDs.size, 
				 allDs.premium, 
				 allDs.ratting];

	var seriesDs     = [];
	var categories = [];
	var counter    = 0;
 	_.each(datas, function(o , i){
 		if(parseFloat(o) == 0)
 			return; 
 		seriesDs.push([parseFloat(counter), parseFloat(counter) + parseFloat(o)]);
 		categories.push(listCategory[i]);
 		counter += parseFloat(o);
	});

	seriesDs.push( [ 0, parseFloat(allDs.totals[obj.tenor() ]) ] );
	categories.push('Total');

	var maxAxis = _.max( _.flatten(seriesDs) );
	var minAxis = _.min( _.flatten(seriesDs) );

	$("#"+obj.id).find(".contentWidget").html()
	$("#"+obj.id).find(".contentWidget").kendoChart({
		chartArea: {
		    background: "#f4f4f9",
		    margin:{
		    	top:40,
		    	left:20,
		    	right:20,
		    	bottom:20
		    }
		},  
	    series: [{ 
	    	gap : 2,
	        type: "rangeColumn",
	        colorField :'color',
	        field:'value',
	        border: {
	        	width:0
	        },
	        data: seriesDs,
		    color: function(e){
		    	console.log(e.category);
		    	switch(e.category){
		    		case"Tenor Diff":
		    		case"Base Comp Z":
		    		case"Base Comp G":
		    		case"Base Comp YTM":
		    			return  "url(#svg-gradient-darkblue)";
		    			 
		    		break;
		    		case"LP":
						return  "url(#svg-gradient-lightblue1)";
		    		break;
		    		case"NIP":
		    		case"NIC":
		    		case"Ratings Diff":
		    			return  "url(#svg-gradient-lightblue2)";
		    		break;
		    		default:
		    			return  "url(#svg-gradient-green)";
		    	}
		    }, 
		    
	    }],
	    seriesDefaults: {
	    	overlay: {
				gradient: "none"
			},
	        labels: {
	            visible: true, 
	            from: {
	            	visible: false
	            },
	            to: {
	            	visible: true,
	            	template: function(e){
	            		var label = e.dataItem[1] - e.dataItem[0];
	            		if( e.category == "Base Comp Z" ||  
	            			e.category == "Base Comp Z" ||  
	            			e.category == "Base Comp YTM"  || 
	            			e.category == "Total"  )
	            			return  kendo.toString( label ,"N0" );
	            		else
		            		return ( label >= 0 ) ? "+" + kendo.toString( e.dataItem[1] - e.dataItem[0] ,"N0" ) : kendo.toString( e.dataItem[1] - e.dataItem[0] ,"N0" ); 
	            	}, 
	            	color: "#0e678d",
	            	background:"#f4f4f9"
	            },
	        	// position: "top"
	        }
	    },
	    categoryAxis: {
	        categories: categories,
	        labels: {
	            rotation: "auto",
	            font: ds.font('10px'),
	            visible: true,
	            color: "#0e678d"
	        },
	        majorGridLines: {
				visible: false
			},
			line:{
				visible: true
			}
	    },
	    valueAxis: {
	    	max   : maxAxis * 1.1,
	    	min   : minAxis,
			labels: {
				color: "#4c5356",
				font: ds.font('10px'),
				visible: true,
				color: "#0e678d"
			},
			line: {
				visible: true,
			},
			majorGridLines: {
				visiblet: true,
				dashType: "dash"
	        },
        },
	   	// seriesHover: showTooltip
	        
        tooltip: {
            visible: false,
            template : function(e){
                return kendo.toString((e.dataItem[1] - e.dataItem[0]),'n0');
            }

        }
	    
	});

	var showTooltip = function(e) { 
		console.log()
		$("#"+obj.id).find(".k-tooltip").html(e.value).show()
	};
 
};
termSheet.renderBondIssuenceSpreads = function(){	
	var config = termSheet.bondIssuenceSpreads;
	if(config.render())
		return;

	$("#scatterChartTab4").find(".contentWidget").html("");
	config.yAxis(createTermSheet.bidProp().key);
	setTimeout(function(){
		termSheet.createChartScatter();
		config.render(true)
	},300);

};
termSheet.renderTable = function(){	
	var config  = termSheet.table;
	if(config.render())
		return;
	config.dataSource(pbGrid.dataGridTemplateFirst());
	config.render(true);
};
termSheet.createDsRelativeValueCharts = function(){
 
	var ds = termSheet.relativeValueCharts.ds;
	// if(createTermSheet.bidProp().key == "Bidytm")
	// 	ds.basis 	 = pbGrid.rowBasis()[createTermSheet.bidProp().key] / 100;
 	// 	else
 	ds.basis 	 = pbGrid.rowBasis()[createTermSheet.bidProp().key];
 	ds.size  	 = ( createTermSheet.issuenze.issueSize() > 300) ? 0 : createTermSheet.issuenze.liquityPerm(); 
 	ds.premium   = ( createTermSheet.premium.checked() ) ? createTermSheet.premium.value() : 0; 
 	ds.ratting   = ( createTermSheet.sameIssuer() ) ? 0 : (createTermSheet.ratting.checked()) ? createTermSheet.ratting.sugested() : createTermSheet.ratting.manualInput(); 
	
	var tenors 	 = [];
	var totals 	 = [];
	_.each(createTermSheet.tenor.checkeds(), function(o,i){
		switch(o()){
			case"syndicate":
				tenors.push(createTermSheet.tenor.syndicateTabel()[i].value())
			break;
			case"trending":
				tenors.push(createTermSheet.tenor.trendingCurve()[i].value());
			break;
			default:
				tenors.push(createTermSheet.tenor.manualInput()[i].value());
		};
		totals.push( parseFloat(
							parseFloat(ds.basis) +
							parseFloat(tenors[i]) + 
							parseFloat(ds.size) + 
							parseFloat(ds.premium) + 
							parseFloat(ds.ratting)
					) );
	});
	ds.tenors 	 = tenors;
	ds.totals 	 = totals;
};
termSheet.renderRelativeValueCharts = function(){
	var config  = termSheet.relativeValueCharts;
	if(config.render())
		return;

	termSheet.createDsRelativeValueCharts();
	var tenorsList 	= [];
	var widgets 	= [];
	_.each(pbGrid.gridTemplateFirst().tenors(), function(obj,idx){
		tenorsList.push({text:obj,value:idx});
		if(idx > 1)
		 return	
		widgets.push({
						tenor: ko.observable(),
						id   : 'termSheet-chart'+idx
					});
			
	});
	config.widgets(widgets);
	config.tenorList(tenorsList);
	_.each(config.widgets(), function(o,i){
		o.tenor(i);
		setTimeout(function(){ termSheet.crateeChartRange(o) },300);
		o.tenor.subscribe(function(n){
			termSheet.crateeChartRange(o)
		})
	});

	config.render(true);
};
termSheet.charts.f.valField.subscribe(function(n){
	termSheet.createChart5();
})

termSheet.charts.f.valIsin.subscribe(function(n){
	// termSheet.createChart5();
	ajaxPost("/dashboard/graphisin",{ Issuer: ds.issuerSelected.issuer, Isin: termSheet.charts.f.valIsin() }, function(res){
		termSheet.charts.ds( res.Data );
		termSheet.createChart5();
	});
})
termSheet.createChart5 =  function(){ 
	var lastData = _.last(termSheet.charts.ds());
	termSheet.charts.infoChart( { category: lastData.date, value: lastData[termSheet.charts.f.valField() ] });
	var seriesHover = function(e){
		termSheet.charts.infoChart(e);
	};
	var data = [];
	// _.each(termSheet.charts.ds(), function(o){
	// 	if(	o.isin == termSheet.charts.f.valIsin() )
	// 		data.push({
	// 					Category : o.date,
	// 					Value: o[ termSheet.charts.f.valField() ],
	// 				});
	// });
	$sel = $("#termSheet-05").find(".contentWidget");
	// console.log(dataSource);
	// ds.drawChartBar($sel, [
	// 						{
	// 							categoryField:'Category',
	// 							field:  "Value",
	// 							type: "area", 
	// 							data: dataSource,
	// 						}
	// 					  ]
	// 				);
	// console.log(data);
	var max = _.max(termSheet.charts.ds(), function(d){
					return d[termSheet.charts.f.valField()] 
			  });
	$sel.kendoChart({
		theme: "flat",
		chartArea: {
			background: ""
		},
		seriesColors: ["#4183D7", "#CF000F"],
		legend: {
			position: "top",
			labels: {
				font: "10px Arial,Helvetica,sans-serif",
			}
		}, 
		seriesDefaults: {
			 
			markers: {
				visible: false
			}
		},
		seriesHover: seriesHover,
		series: [
					{
						categoryField:'date',
						field:  termSheet.charts.f.valField(),
						type: "area", 
						color: "url(#svg-gradient-blue)",
						data: termSheet.charts.ds(),
						line: {
					      color: "#4183D7",
					      width: 1    					
					  	},
					}
				],
		valueAxis: {
			max : ( max[termSheet.charts.f.valField()] == undefined ) ? 0 : max[termSheet.charts.f.valField()] * 1.01 ,
			majorGridLines: {
				visible: true,
				dashType: "dash"
			},
			labels: {
				font: "11px Arial,Helvetica,sans-serif",
			 
			},
			axisCrossingValue: [0, -100000000000000000]
		},
		categoryAxis: {
			labels: {
				color: "#4c5356",
				font: "9px Arial,Helvetica,sans-serif", 
				visible: true,
				background: "transparent",
				step: parseInt(termSheet.charts.ds().length / 15) + 1,
            		skip: parseInt(termSheet.charts.ds().length * 0.02),
        	},
			majorGridLines: {
				visible: false
			},
			line:{
				visible: true
			},
			majorTicks: {
            	step: parseInt(termSheet.charts.ds().length / 15) + 1,
            	skip: parseInt(termSheet.charts.ds().length * 0.02)
          	},
        },
        render: function(e){
        	console.log(e);
        },
		// categoryAxis: [
		// 	{
		// 		line: {
		// 			visible: false
		// 		},
		// 		field: "Category",
		// 		labels: {
		// 			visible: false
		// 		},
		// 		axisCrossingValue: data.length
		// 	},
		// 	{
		// 		field: "Category",
		// 		majorTicks: {
		// 			step: parseInt(data.length / 15) + 1,
		// 			skip: parseInt(data.length * 0.02)
		// 		},
		// 		labels: {
		// 			font: "11px Arial,Helvetica,sans-serif",
		// 			step: parseInt(data.length / 15) + 1,
		// 			skip: parseInt(data.length * 0.02), 
		// 		}
		// 	}
		// ],
		tooltip: {
			visible: false,
		},
	});
}
termSheet.GetChartGraphIsin = function(){
	// loading 			 : ko.observable(false),
	termSheet.charts.loading(true);
	ajaxPost("/dashboard/graphisin",{ Issuer: ds.issuerSelected.issuer, Isin: termSheet.charts.f.valIsin(), Month: termSheet.charts.f.valPeriod()  }, function(res){
		termSheet.charts.ds( res.Data );
		termSheet.createChart5();
		termSheet.charts.loading(false);
	});
}
termSheet.GetFilterIsin = function(){
 
	var payload ={
		Issuer: ds.issuerSelected.issuer
	}
	ajaxPost("/dashboard/getfiltergraph", payload, function (res){
		
	 	 termSheet.pullRequest(termSheet.pullRequest() - 1);
		if(res.length == 0)
			return;

		var resData = _.map(res, function(d){
 			return { text: d._id, value: d._id };
		})
		termSheet.charts.f.listIsin(resData);
		termSheet.charts.f.valIsin(resData[0].value);

    })

}
termSheet.renderChart =  function(){
	if( termSheet.charts.render() )
		return;
	
	termSheet.GetChartGraphIsin();	
	termSheet.charts.render(true)
 
} 

termSheet.orderedDataGrid = function(){
	// var obj 	= pbGrid.gridTemplateFirst();
	// var data  	= [];

	// _.each(obj.orderIsin(), function(o){ 
	// 	var d = _.where(obj.resData(),  {Isin: o})[0];
	//  		data.push(d);
	// });
	// obj.resData(data);
};
termSheet.init = function(){
		ds.loading(true);
	termSheet.pullRequest(2)
	termSheet.ts.render(false);
	termSheet.bondIssuenceSpreads.render(false);
	termSheet.table.render(false);
	termSheet.relativeValueCharts.render(false);
	termSheet.charts.render(false);
	termSheet.orderedDataGrid();
	termSheet.GetFilterIsin();
	termSheet.createDsRelativeValueCharts();
	createsummaryTableConfig();
	
	return $(".termSheet-tab").find("li a#termSheetTab1").click();
};

