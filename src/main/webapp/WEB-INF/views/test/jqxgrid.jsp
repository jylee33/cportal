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
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxgrid.edit.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="${path}/resources/js/jqwidgets/jqxcheckbox.js"></script>

<div class="container">
    <div id="grid1"></div>
    <div id="grid2"></div>
    <div id="grid3"></div>
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
        $("#grid1").jqxGrid(
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


        var url = "${path}/license/aidcodeview";
        // prepare the data
        var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'functionno',type:'int'},
                    { name: 'functionname',type:'string'},
                    { name: 'freeaid', type: 'string' },
                    { name: 'basicaid', type: 'string' },
                    { name: 'proaid', type: 'string' },
                    { name: 'entaid', type: 'string' },
                    { name: 'functioncode',type:'string'},
                    { name: 'useyn',type:'string'},
                    { name: 'stdate', type: 'string' },
                    { name: 'eddate', type: 'string' },
                    { name: 'sortno',type:'int'}
                ],
                id: 'id',
                url: url,
                type: "POST"
            };

        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#grid2").jqxGrid(
            {
                width: 1000,
                source: dataAdapter,
                // columnsresize: true,
                columns: [
                    { text: '지원관리번호', datafield: 'functionno', width: 250 },
                    { text: '지원기능', datafield: 'functionname', width: 250},
                    { text: 'freeaid',datafield: 'freeaid', width: 250 },
                    { text: 'basicaid', datafield: 'basicaid', width: 250 },
                    { text: 'proaid', datafield: 'proaid', width: 250 },
                    { text: 'entaid',datafield: 'entaid',  width: 250 },
                    { text: '기능구분', datafield: 'functioncode', width: 250},
                    { text: '사용여부', datafield: 'useyn', width: 250},
                    { text: 'stdate',datafield: 'stdate',  width: 250 },
                    { text: 'eddate',datafield: 'eddate',  width: 250 },
                    { text: '정렬기준', datafield: 'sortno', width: 250}
                ]
            });


        var data1 = [
            {value: "Y", label: "Yes"},
            {value: "N", label: "No"}
        ];

        var src1 =
            {
                datatype: "array",
                datafields: [
                    { name: 'label', type: 'string' },
                    { name: 'value', type: 'string' }
                ],
                localdata: data1
            };

        var da1 = new $.jqx.dataAdapter(src1, { autoBind: true });


        url = "${path}/api/findAll";
        // prepare the data
        source =
            {
                datatype: "json",
                datafields: [
                    { name: 'email',type:'string'},
                    { name: 'membername',type:'string'},
                    { name: 'celltel', type: 'string' },
                    { name: 'businessname', type: 'string' },
                    { name: 'licensegrade',type:'int'},
                    { name: 'administratoryn', value:'administratoryn', values: {source:da1.records, value:'value', name:'label'}}
                ],
                id: 'id',
                url: url,
                type: "POST"
            };

        dataAdapter = new $.jqx.dataAdapter(source);
        $("#grid3").jqxGrid({
                width: 1000,
                source: dataAdapter,
                columnsresize: true,
                editable: true,
                columns: [
                    { text: 'email', datafield: 'email', width: 250},
                    { text: 'membername', datafield: 'membername', width: 250},
                    { text: 'celltel',datafield: 'celltel',  width: 250 },
                    { text: 'businessname',datafield: 'businessname',  width: 250 },
                    { text: 'licensegrade', datafield: 'licensegrade', width: 250},
                    {
                        text: 'administratoryn', datafield: 'administratoryn', displayfield:'administratoryn', width: 250, columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({ source: da1, displayMember: 'label', valueMember: 'value' });
                        }
                    }
                ]
            });


    });

</script>

<%@include file="../include/footer.jsp" %>