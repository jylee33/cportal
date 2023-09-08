<!-- %@page import="com.hm.netis.common.AppGlobal" % -->
<!--%@ page import="com.hm.netis.common.SiteEnum" % -->
<!--%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" % -->
<!--
<meta http-equiv='X-UA-Compatible' content='IE=edge'>
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="no-cache">
<meta http-equiv="Expires" content="-1">
<meta http-equiv="Cache-Control" content="no-cache">
<%--<meta http-equiv="set-cookie" content="SameSite=Strict" /> <!-- 강도: Lax < Strict < None -->--%>
-->
<!-- v5.0.1 css
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/jqx.hamon.css"/>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/jqx.hamon.v1.css">
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/jqx.ui-hamon-gray.css"/>
-->
<%--<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/netis.css"/>--%>

<%--<link rel="stylesheet" type="text/css"--%>
<%--      href="${path}/netis/css/v5.0.1/header-ui-<%=AppGlobal.netisThema%>.css"/>--%>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/button.css"/>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/button_new.css"/>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/button_v59.css"/>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/popup.css"/>
<link rel="stylesheet" type="text/css" href="${path}/netis/css/v5.0.1/ani.css"/>


<!-- js library -->
<script src="${path}/netis/lib/jquery/jquery-3.6.4.min.js"></script>
<script src="${path}/netis/lib/jquery/jquery-migrate-3.1.0.min.js"></script>
<script src="${path}/netis/lib/jquery/jquery-dateFormat.js"></script>
<script src="${path}/netis/lib/jquery/jquery.form.js"></script>

<!-- lodash -->
<script src="${path}/netis/lib/lodash/lodash_4.17.21.js"></script>

<!-- jqwidgets -->
<script src="${path}/netis/lib/jqwidgets/jqx-all.js"></script>
<script src='${path}/netis/lib/jqwidgets/localization.js'></script>
<script src='${path}/netis/lib/jqwidgets/globalization/globalize.js'></script>
<script src='${path}/netis/lib/jqwidgets/globalization/globalize.culture.ko-KR.js'></script>

<!-- highchart -->

<script src="${path}/netis/webjars/highstock/8.0.4/code/highstock.js"></script>
<script src="${path}/netis/webjars/highcharts/8.0.4/highcharts-more.js"></script>
<script src="${path}/netis/webjars/highcharts/8.0.4/modules/heatmap.js"></script>

<script src="${path}/netis/webjars/highstock/8.0.4/code/modules/data.js"></script>
<script src="${path}/netis/webjars/highstock/8.0.4/code/modules/exporting.js"></script>
<script src="${path}/netis/webjars/highstock/8.0.4/code/modules/export-data.js"></script>
<script src="${path}/netis/webjars/highstock/8.0.4/code/modules/no-data-to-display.js"></script>

<script src="${path}/netis/webjars/highcharts/8.0.4/modules/solid-gauge.js"></script>
<script src="${path}/netis/webjars/highcharts/8.0.4/highcharts-3d.js"></script>
<script src="${path}/netis/webjars/highcharts/8.0.4/modules/exporting.js"></script>

<!--script src="${path}/netis/js/hm/highchartscustomEvents.js"></script -->
<script src="${path}/netis/webjars/highcharts/8.0.4/modules/solid-gauge.js"></script>

<script src="${path}/netis/lib/megamenu/jquery.hoverIntent.minified.js"></script>
<script src="${path}/netis/lib/megamenu/jquery.dcmegamenu.1.3.4.min.js"></script>

<!-- svg to canvas library -->
<script src="${path}/netis/lib/rgbcolor.js"></script>
<script src="${path}/netis/lib/StackBlur.js"></script>
<script src="${path}/netis/lib/canvg.js"></script>

<!-- elastic search 2023.03.21 사용하지 않음으로 주석 처리 -->
<%--<script src="${path}/netis/lib/elasticsearch/elasticsearch.min.js"></script> --%>

<!-- hamon
<script src="${path}/netis/js/hm/master.js"></script>
<script src="${path}/netis/js/hm/hm.prototype.js"></script>
<script src="${path}/netis/js/hm/hm.resource.js"></script>
<script src="${path}/netis/js/hm/hm.util.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.grid.v5.0.1.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.window.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.tree.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.treegrid.v5.0.1.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.date.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.dropdownbtn.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.dropdownlist.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.splitter.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.chart.js"></script>
<script src="${path}/netis/js/hm/hm.highchart.v2.js"></script>
<script src="${path}/netis/js/hm/hm.es.js"></script>
<script src="${path}/netis/js/hm/chart/hm.aloneUpsVolChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.aloneUpsTempChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.perfData.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devCpuChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devCpsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devMemoryChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devResptimeChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devThresholdChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrThresholdChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devSessChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.devTempChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifBpsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifBpsPerChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifPpsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifCrcChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifErrorChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifCollisionChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifNonUnicastChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifDiscardChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifMulticastChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifBroadcastChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifDropChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifThresholdChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.mainIfBpsChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.svrCpuChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrMemoryChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrPerfMemChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrPerfFsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrPerfDiskChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrPerfNetworkChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrFileSystemChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrNetworkChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrDiskChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.vsvrCpuChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.vsvrMemoryChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.vsvrBpsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.vsvrPpsChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.vmPpsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.vmBpsChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.apByteChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.apClientByteChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrWasChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.svrDbmsChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.customChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.predictChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.fmsChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.l4ConnChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.l4CpsChart.js"></script>

<%--이상탐지 차트--%>
<script src="${path}/netis/js/hm/chart/hm.donutChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.abnlDtcBarChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.abnlDtcColumnChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.abnlDtcGrid.js"></script>
<script src="${path}/netis/js/hm/chart/hm.abnlDtcNetworkChart.js"></script>

<script src="${path}/netis/js/hm/chart/hm.solidGaugeChart.js"></script>
<script src="${path}/netis/js/hm/chart/hm.ifPerfTopNChart.js"></script>

<script src="${path}/netis/js/hm/hm.jqx.dataadapter.v2.js"></script>
<script src="${path}/netis/js/hm/hm.jqx.grid.v2.js"></script>
<script src="${path}/netis/js/hm/hm.boxcondition.js"></script>
-->
<script src="${path}/netis/lib/jquery.i18n.properties.min.js"></script>

<link rel="stylesheet" href="${path}/netis/lib/colorpicker/spectrum.css"/>
<script src="${path}/netis/lib/colorpicker/spectrum.js"></script>
<script src="${path}/netis/lib/colorpicker/jquery.spectrum-ko.js"></script>
<script src="${path}/netis/lib/d3/d3.v4.min.js"></script>