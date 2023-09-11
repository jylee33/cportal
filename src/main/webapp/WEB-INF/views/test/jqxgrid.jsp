<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<%@include file="../include/header.jsp" %>

<link rel="stylesheet" href="${path}/resources/js/jqwidgets/styles/jqx.base.css" type="text/css" />

<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.columnsresize.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdata.js"></script>
<%--<script type="text/javascript" src="${path}/resources/js/scripts/demos.js"></script>--%>

<div class="container">
    <div id="grid"></div>
    <div id="grid2"></div>
</div>



<script>

    $(document).ready(function() {

        var url = "${path}/resources/data.json";
        // prepare the data
        var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'name', type: 'string' },
                    { name: 'type', type: 'string' },
                    { name: 'calories', type: 'int' },
                    { name: 'totalfat', type: 'string' },
                    { name: 'protein', type: 'string' }
                ],
                id: 'id',
                url: url
            };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#grid").jqxGrid(
            {
                width: 1000,
                source: dataAdapter,
                // columnsresize: true,
                columns: [
                    { text: 'Name', datafield: 'name', width: 250 },
                    { text: 'Beverage Type', datafield: 'type', width: 250 },
                    { text: 'Calories', datafield: 'calories', width: 180 },
                    { text: 'Total Fat', datafield: 'totalfat', width: 120 },
                    { text: 'Protein', datafield: 'protein', minwidth: 120 }
                ]
            });

        url = "http://localhost:8080/portal/api/findAll";
        // prepare the data
        source =
            {
                datatype: "json",
                datafields: [
                    { name: 'email', type: 'string' },
                    { name: 'membername', type: 'string' },
                    { name: 'celltel', type: 'string' },
                    { name: 'businessname', type: 'string' },
                    { name: 'licensegrade', type: 'int' }
                ],
                id: 'id',
                url: url,
                type: "POST"
            };
        dataAdapter = new $.jqx.dataAdapter(source);
        $("#grid2").jqxGrid(
            {
                width: 1000,
                source: dataAdapter,
                // columnsresize: true,
                columns: [
                    { text: 'email', datafield: 'email', width: 250 },
                    { text: 'membername', datafield: 'membername', width: 250 },
                    { text: 'celltel', datafield: 'celltel', width: 180 },
                    { text: 'businessname', datafield: 'businessname', width: 180 },
                    { text: 'licensegrade', datafield: 'licensegrade', width: 120 }
                ]
            });
    });

</script>

<%@include file="../include/footer.jsp" %>