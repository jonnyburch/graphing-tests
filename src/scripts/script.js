$(function() {
	
	// global variables
	var width = 1200;
	var height = 800;
	var margin = {"left": 25, "bottom": 25, "right": 5};
	
	// x scale
	var xScale = d3.scale.linear()
		.domain([0, 100])
		.range([0, width - margin.left - margin.right]);
		
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.ticks(0)
		.orient("bottom");
		
	// y scale
	var yScale = d3.scale.linear()
		.domain([0, 100])
		.range([height - margin.bottom, 0]);
		
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(0)
		.orient("left");
		
	// creating the main svg
	var svg = d3.select("#canvas")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "svg");
	
	// axis and axis description
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(15," + (height - 15) + ")")
		.call(xAxis);
		
	var xLabel = svg.append("text")
		.attr("x", 100)
		.attr("y", 398)
		.attr("class", "axis wcm-label")
		.text("completeness of vision");
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(15, 10)")
		.call(yAxis);
		
	var yLabel = svg.append("text")
		.attr("x", 10)
		.attr("y", 325)
		.attr("class", "axis wcm-label")
		.text("ability to execute")
		.attr("transform", "rotate(270 10,325)");
		
	// wcm quadrant
	var quadrant_group = svg.append("g")
		.attr("transform", "translate(" + margin.left + ",0)");
	
	var quadrant_border = quadrant_group.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width - margin.left - margin.right)
		.attr("height", height - margin.bottom)
		.attr("rx", 20)
		.attr("ry", 20)
		.attr("class", "quadrant_border");
	
	// creating quadrant descriptions
	quadrant_group.append("text")
		.attr("x", xScale(25))
		.attr("y", yScale(25))
		.attr("text-anchor", "middle")
		.text("Niche Players")
		.attr("class", "quad-label");
		
	quadrant_group.append("text")
		.attr("x", xScale(25))
		.attr("y", yScale(75))
		.attr("text-anchor", "middle")
		.text("Challengers")
		.attr("class", "quad-label");
	
	quadrant_group.append("text")
		.attr("x", xScale(75))
		.attr("y", yScale(25))
		.attr("text-anchor", "middle")
		.text("Visionaries")
		.attr("class", "quad-label");
		
	quadrant_group.append("text")
		.attr("x", xScale(75))
		.attr("y", yScale(75))
		.attr("text-anchor", "middle")
		.text("Leaders")
		.attr("class", "quad-label");
		
	// creating the dividers
	quadrant_group.append("line")
		.attr("x1", 0)
		.attr("y1", yScale(50))
		.attr("x2", xScale(100))
		.attr("y2", yScale(50))
		.attr("class", "divider");
		
	quadrant_group.append("line")
		.attr("x1", xScale(50))
		.attr("y1", 0)
		.attr("x2", xScale(50))
		.attr("y2", yScale(0))
		.attr("class", "divider");
		

	
	// creating the circles
	quadrant_group.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", function(d) {
			return "circle item " + d.flag + " " + d.language + " " + d.company.toLowerCase().replace(/\s/g, "");
		})
		.attr("cx", function(d) {
			return xScale(d.cov);
		})
		.attr("cy", function(d) {
			return yScale(d.ate);
		})
		.attr("r", 7)
		.attr("opacity", 1)
		.on("mouseover", function() {
			d3.select(this).classed("circle-hover", true);
			d3.select("text." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("wcm-label-hover", true);
		})
		.on("click", function() {
			$(".init-info").hide();
			$(".init-hidden").show();
			var self = this;
			d3.select(".circle-selected").classed("circle-selected", false);
			d3.select(".wcm-label-selected").classed("wcm-label-selected", false);
			d3.select(self).classed("circle-selected", true);
			d3.select("text." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("wcm-label-selected", true);
			d3.select("#language").text(self.__data__.languageLong);
			d3.select("#product").text(self.__data__.product);
			d3.select("#link").html("<a href='" + self.__data__.link + "'>" + self.__data__.link + "</a>");
			d3.select("#flag").html("<img src='img/flags/" + self.__data__.flag + ".png'>");
			d3.select("#logo").html("<a class='thumbnail' href='" + self.__data__.link + "'><img src='img/logos/" + self.__data__.logo + "'></a>");
			d3.select("#description").html(self.__data__.description);
			d3.select("#strengths").html(function() {
				return "<ul>" + 
							self.__data__.strengths.map(function(elem) {
								return "<li>" + elem + "</li>";
							}).join("") + 
						"</ul>";
			});
			d3.select("#cautions").html(function() {
				return "<ul>" + 
							self.__data__.cautions.map(function(elem) {
								return "<li>" + elem + "</li>";
							}).join("") + 
						"</ul>";
			});
		})
		.on("mouseout", function() {
			d3.select(this).classed("circle-hover", false);
			d3.select("text." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("wcm-label-hover", false);
		});
	
	// creating the labels for the circles
	quadrant_group.selectAll(".wcm-label")
		.data(data)
		.enter()
		.append("text")
		.attr("opacity", 1)
		.attr("class", function(d) {
			return "wcm-label item " + d.flag + " " + d.language + " " + d.company.toLowerCase().replace(/\s/g, "");
		})
		.attr("x", function(d) {
			return xScale(d.cov + d.label_x);
		})
		.attr("y", function(d) {
			return yScale(d.ate + d.label_y);
		})
		.text(function(d) {
			return d.company;
		})
		.attr("text-anchor", function(d) {
			return d.text_anchor;
		})
		.on("mouseover", function() {
			d3.select(this).classed("wcm-label-hover", true);
			d3.select("circle." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("circle-hover", true);
		})
		.on("mouseout", function() {
			d3.select(this).classed("wcm-label-hover", false);
			d3.select("circle." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("circle-hover", false);
		})
		.on("click", function() {
			$(".init-info").hide();
			$(".init-hidden").show();
			var self = this;
			d3.select(".circle-selected").classed("circle-selected", false);
			d3.select(".wcm-label-selected").classed("wcm-label-selected", false);
			d3.select(self).classed("wcm-label-selected", true);
			d3.select("circle." + this.__data__.company.toLowerCase().replace(/\s/g, "")).classed("circle-selected", true);
			d3.select("#language").text(self.__data__.languageLong);
			d3.select("#product").text(self.__data__.product);
			d3.select("#link").html("<a href='" + self.__data__.link + "'>" + self.__data__.link + "</a>");
			d3.select("#flag").html("<img src='img/flags/" + self.__data__.flag + ".png'>");
			d3.select("#logo").html("<a class='thumbnail' href='" + self.__data__.link + "'><img src='img/logos/" + self.__data__.logo + "'></a>");
			d3.select("#description").html(self.__data__.description);
			d3.select("#strengths").html(function() {
				return "<ul>" + 
							self.__data__.strengths.map(function(elem) {
								return "<li>" + elem + "</li>";
							}).join("") + 
						"</ul>";
			});
			d3.select("#cautions").html(function() {
				return "<ul>" + 
							self.__data__.cautions.map(function(elem) {
								return "<li>" + elem + "</li>";
							}).join("") + 
						"</ul>";
			});
		});
		
	// click on the country dropdown
	/*jshint multistr: true */
	$(".country-select").on("click", function(evt) {
		$(".country-top").html($(this).html());
		$(".language-top").html(' \
			<i class="icon-font"></i> \
			<span></span>  \
			<span>Select Language</span> \
		');
		d3.selectAll(".item")
			.transition()
			.duration(1000)
			.attr("opacity", 1);
		d3.selectAll(".item:not(." + $(this).attr("id") + ")")
			.transition()
			.duration(1000)
			.attr("opacity", 0.1);
	});
	
	// click on country reset
	$(".country-reset").on("click", function(evt) {
		$(".country-top").html($(this).html());
		d3.selectAll(".item")
			.transition()
			.duration(1000)
			.attr("opacity", 1);
	});
	
	// click on language dropdown
	$(".language-select").on("click", function(evt) {
		$(".country-top").html(' \
			<i class="icon-globe"></i> \
			<span></span>  \
			<span>Select Country</span> \
		');
		$(".language-top").html($(this).html());
		d3.selectAll(".item")
			.transition()
			.duration(1000)
			.attr("opacity", 1);
		d3.selectAll(".item:not(." + $(this).attr("id") + ")")
			.transition()
			.duration(1000)
			.attr("opacity", 0.1);
	});
	
	// click on language reset
	$(".language-reset").on("click", function(evt) {
		$(".language-top").html($(this).html());
		d3.selectAll(".item")
			.transition()
			.duration(1000)
			.attr("opacity", 1);
	});
	
	$(".init-hidden").hide();
	
});