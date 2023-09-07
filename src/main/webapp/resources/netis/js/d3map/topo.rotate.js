"use strict";
var rotates = [];
var i, j, d;
var removeRotate = null;
var rotators = null;
var updateRotate = null;
var rotator;
var rotateStartPos,
	r = { angle: 0, cx: 0, cy: 0 },
	t = { angle: 0, cx: 0, cy: 0 };
var rTargetId;
var rTargetShape;
var rotatePos = [];
var rData = null;
var shapeNode = null;
var textShape = null;
var bBoxHeight = 0;


var TopoRotate = {

	setRotateData: function(list) {
		if (list == null || list.data().length == 0) return list;
		rotates = [];

		for (i = 0; i < list.data().length; i++) {
			d = list.data()[i];

			// rotates.push($.extend({
			// 	id: "rotate_" + d.id,
			// 	posX: d.posX,
			// 	posY: d.posY,
			// 	r: 5
			// }, d));

			// if (d.devKind1 == "DRAW_TEXT" || d.devKind1 == "DRAW_TEXT_AREA") {
			// 	bBoxHeight =  d.posY - (d.bbox.height/2);
			// } else if (d.devKind1 == "DRAW_TEXT_AREA") {
			// 	bBoxHeight = d.posY - 20;
			// }

			rotates.push({
				id: "rotate_" + d.id,
				rTargetId : d.id,
				posX: d.posX,
				posY: d.posY,
				// posX: d.devKind2 == 'TEXT' ?  d.posX - (d.bbox.width/2) : d.posX,
				// posY: d.devKind2 == 'TEXT' ?  d.posY - 25 : d.posY,
				devKind1: d.devKind1,
				devKind2: d.devKind2,
				rx: d.rx,
				ry: d.ry,
				width: d.devKind2 == 'TEXT'? d.bbox.width : d.width,
				height: d.devKind2 == 'TEXT'? d.bbox.height : d.height,
				r: 5,
				bbox: d.bbox,
				textAnchor : d.textAnchor,
				rotation: d.rotation
			});
		}
		return rotates;
	},

	/** 데이터 갱신 */
	callRefresh: function(objTopo) {

	},

	refresh: function(objTopo, svg, rotate_data, shape_call) {

		removeRotate = svg.select("g.grp_rotator").selectAll(".rotator");
		removeRotate.remove();

		rotators = svg.select("g.grp_rotator").selectAll(".rotator").data(rotate_data);
		rotators.exit().remove();

		// rotators = rotators.enter()
		// //.insert("g", "g.grp_rotator")
		// 	.append("g")
		// 	.attr("id", function (d) { return d.id; })
		// 	.attr("cursor", "pointer");
		// 	// .attr("transform", function (d) {
		// 	// 	return "translate({0}, {1})".substitute(d.posX, d.posY);
		// 	// });

		rotators = rotators.enter()
			.selectAppend("image", "rotator")
			.attr("id", function (d) { return d.id; })
			.attr("xlink:href", "/img/d3/icon/rotator.png")
			//.append("circle")
			//.attr("class", "rotator")
			.classed("rotator", true)
			.attr("width", 16)
			.attr("height", 16)
			.attr("x", function (d) {
				return d.posX;
			})
			.attr("y", function (d) {
				return d.posY;
			})
			// .attr("r", 5)
			// .attr("fill", "yellow")
			// .attr('stroke','#03045E')
			// .attr("stroke-width", 1)
			.attr("transform", function (d) {
				var  rPosX, rPosY;
				if (d.devKind2 == "TEXT") {
                    rPosX = d.posX;
                    rPosY = d.posY;
					// rPosX = d.posX;
					// rPosY = d.posY;
				} else {
                    rPosX = d.posX + d.width / 2;
                    rPosY = d.posY + d.height / 2;
				}

				var rotatePos = [
					d.rotation,
					rPosX,
					rPosY
				];
				return "rotate({0})".substitute(rotatePos);

			})
			// .style("display", "block")
			.style("display", this.isManageMode(objTopo) ? "block" : "none")
			.style("cursor", 'pointer')
			.call(d3.drag()// call specific function when circle is dragged
				.on("start", function(d) {
					if(TopoRotate.isManageMode(objTopo)) TopoRotate.dragStartInit(this, objTopo);
				})
				.on("drag", function (d) {
					if(TopoRotate.isManageMode(objTopo)) TopoRotate.dragMoveInit(this, objTopo);
				})
			);
		// console.log("topo_rotator");
		return rotators;

	},

	dragStartInit: function (d, objTopo) {

		r = { angle: 0, x: 0, y: 0 };
		rotator = d3.select(d);
		rTargetId = rotator.data()[0].rTargetId;
		rTargetShape = objTopo.vars.svg.select(".svgGroup").selectAll("g.shape")
			.filter(function(d,i){
				return d.id == rTargetId;
			});

		r.x = TopoRotate.getElementCenter(objTopo, rTargetShape).x;
		r.y = TopoRotate.getElementCenter(objTopo, rTargetShape).y;

		if (rTargetShape.data()[0].devKind2 == "TEXT") {
			t.x = 0;//rTargetShape.data()[0].bbox.width / 2;
			t.y = 0;//rTargetShape.data()[0].bbox.height / 2;
		} else {
			t.x = rTargetShape.data()[0].width / 2;
			t.y = rTargetShape.data()[0].height / 2;
		}

		updateRotate = r;

		rotateStartPos = {
			angle: r.angle,
			x: parseFloat(rotator.attr('x')),
			y: parseFloat(rotator.attr('y'))
		};

		if (rotateStartPos.angle > 0) {
			var correctStartPos = TopoRotate.getHandleRotatePosition(
				objTopo, rotateStartPos, rTargetShape
			);
			rotateStartPos.x = correctStartPos.x;
			rotateStartPos.y = correctStartPos.y;
		}

		rotateStartPos.iniAngle = TopoRotate.calcAngleDeg(
			updateRotate,
			rotateStartPos
		);
	},

	dragMoveInit: function (d, objTopo) {
		var dragPointRotate = {};
		if (d3.event) {
			dragPointRotate.x = d3.event.x;
			dragPointRotate.y = d3.event.y;
		}

		var rotatePos = TopoRotate.dragPointRotate(rotateStartPos, dragPointRotate);
		// console.table(rotatePos);

		var rTargetPos = [
			rotatePos[0],
			t.x,
			t.y
		];

		$.each(rTargetShape.nodes()[0].childNodes, function (idx, item) {
			d3.select(item)
				.attr('transform', "rotate(" + rTargetPos + ")")
				.attr("rotation", rotatePos[0]);
			if (item.childNodes.length > 0 && d3.select(item).data()[0].devKind1 == "DRAW_TEXT_AREA") {
				$.each(item.childNodes, function (idx, tspan) {
					d3.select(tspan)
						.attr('transform', "rotate(" + rTargetPos + ")")
						.attr("rotation", rotatePos[0]);

				});
			}
		});

		d3.select(d).attr('transform', `rotate(${ rotatePos })`);

		objTopo.vars.svgGroup.selectAll("g.shape").each(function(d, i) {
			if (d.id == rTargetId) {
				d.rotation = rotatePos[0];
			}
		});
	},

	getElementCenter: function (objTopo, rTargetShape) {

		var elementPos = {};
		var rShapeData = rTargetShape.data()[0];
		if (rShapeData.devKind2 == "TEXT") {
			// elementPos.x = rShapeData.posX + (rShapeData.bbox.width / 2);
			// elementPos.y = rShapeData.posY + (rShapeData.bbox.height / 2);

			elementPos.x = rShapeData.posX ;
			elementPos.y = rShapeData.posY ;

		} else {
			elementPos.x = rShapeData.posX + (rShapeData.width / 2);
			elementPos.y = rShapeData.posY + (rShapeData.height / 2);
		}

		return elementPos;
	},

	getHandleRotatePosition: function (objTopo, handleStartPos, rTargetShape) {

		var originalX = handleStartPos.x ? handleStartPos.x : handleStartPos.cx;
		var originalY = handleStartPos.y ? handleStartPos.y : handleStartPos.cy;

		var center = TopoRotate.getElementCenter(objTopo, rTargetShape);
		//console.log(center);

		var dx = originalX - center.x;
		var dy = originalY - center.y;
		var theta = (handleStartPos.angle * Math.PI) / 180;

		return {
			x: dx * Math.cos(theta) - dy * Math.sin(theta) + center.x,
			y: dx * Math.sin(theta) + dy * Math.cos(theta) + center.y,
		};
	},

	calcAngleDeg: function (p1, p2) {
		var p1x = p1.x ? p1.x : p1.cx;
		var p1y = p1.y ? p1.y : p1.cy;
		return (Math.atan2(p2.y - p1y, p2.x - p1x) * 180) / Math.PI;
	},

	dragPointRotate: function (rotateStartPos, eventXY) {

		rotateStartPos.x = eventXY.x;
		rotateStartPos.y = eventXY.y;

		updateRotate = r;

		var angleFinal = TopoRotate.calcAngleDeg(updateRotate, rotateStartPos);

		var angle =	rotateStartPos.angle + angleFinal -	rotateStartPos.iniAngle;

		angle %= 360;
		if (angle < 0) 	angle += 360;

		var rotatePos = [
			angle,
			updateRotate.x,
			updateRotate.y
		];

		r.angle = angle;

		return rotatePos;
	},

	textRotatorRePointSet: function (objTopo) {
		if (objTopo.vars.mapMode == TopoConst.mapMode.MANAGE) {

			rotators =  objTopo.vars.svgGroup.selectAll(".rotator");
			rotatePos = [];
			$.each(rotators.nodes(), function (idx, r) {
				rData = d3.select(r).data()[0];
				if (rData.devKind2 == "TEXT") {
					textShape = objTopo.vars.svg.select(".svgGroup").selectAll("g.shape")
						.filter(function(d,i){
							return d.id == rData.rTargetId;
						});

					rData.posX = textShape.data()[0].posX - (textShape.data()[0].bbox.width / 2);
					rData.posY = textShape.data()[0].posY - (textShape.data()[0].bbox.height / 2);

					rotatePos = [
						textShape.data()[0].rotation,
						rData.posX,
						rData.posY
					];
					d3.select(r)
						.attr("x", function (d) { return rData.posX;})
						.attr("y", function (d) { return rData.posY;})
						.attr('transform', `rotate(${ rotatePos })`);
				}
			});
		}

	},

	shapeRotatorReDraw: function (objTopo) {
		shapeNode = objTopo.vars.svgGroup.selectAll("g.shape");
		objTopo.vars.rotates = this.setRotateData(shapeNode);
		this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.rotates, null);
	},

	isManageMode: function(objTopo) {
		return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
	}


};
