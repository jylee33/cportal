<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>List View</title>
</head>
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>

<style>
table, td, th {
	border: 1px solid black;
}

th {
	background: #F3F5F5;
}

table {
	margin-top: 5%;
	margin-left: auto;
	margin-right: auto;
	text-align: center;
	width: 80%;
}

a:link {
	color: red;
	text-decoration: none;
	cursor: pointer;
}

a:visited {
	color: black;
	text-decoration: none;
}

/* paginate */
.paginate {
	padding: 0;
	line-height: normal;
	text-align: center;
	position: relative;
	margin: 20px 0 20px 0;
	z-index: 1;
}

.paginate .paging {
	text-align: center;
}

.paginate .paging a, .paginate .paging strong {
	margin: 0;
	padding: 0;
	width: 20px;
	height: 24px;
	line-height: 24px;
	text-align: center;
	color: #848484;
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	font-size: 12px;
}

.paginate .paging a:hover, .paginate .paging strong {
	color: #DAA520;
	font-weight: 600;
	font-weight: normal;
}

.paginate .paging .direction {
	z-index: 3;
	vertical-align: middle;
	background-color: none;
	margin: 0 2px;
	border: 1px solid #777;
	border-radius: 2px;
	width: 28px;
}

.paginate .paging .direction:hover {
	border: 1px solid #C40639;
}

.paginate .paging .direction.prev {
	margin-right: 4px;
}

.paginate .paging .direction.next {
	margin-left: 4px;
	cursor: pointer;
}

.paginate .paging img {
	vertical-align: middle;
}

.paginate .right {
	position: absolute;
	top: 0;
	right: 0;
}

.bottom-left, .bottom-right {
	position: relative;
	z-index: 5;
}

.paginate ~ .bottom {
	margin-top: -50px;
}

.bottom select {
	background: transparent;
	color: #aaa;
	cursor: pointer;
}

/* paginate */
.paginate {
	padding: 0;
	line-height: normal;
	text-align: center;
	position: relative;
	margin: 20px 0 20px 0;
}

.paginate .paging {
	text-align: center;
}

.paginate .paging a, .paginate .paging strong {
	margin: 0;
	padding: 0;
	width: 20px;
	height: 28px;
	line-height: 28px;
	text-align: center;
	color: #999;
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	font-size: 14px;
}

.paginate .paging a:hover, .paginate .paging strong {
	color: #C40639;
	font-weight: 600;
	font-weight: normal;
}

.paginate .paging .direction {
	z-index: 3;
	vertical-align: middle;
	background-color: none;
	margin: 0 2px;
}

.paginate .paging .direction:hover {
	background-color: transparent;
}

.paginate .paging .direction.prev {
	margin-right: 4px;
}

.paginate .paging .direction.next {
	margin-left: 4px;
}

.paginate .paging img {
	vertical-align: middle;
}

.paginate .right {
	position: absolute;
	top: 0;
	right: 0;
}
</style>

<body>
	<div>
		<table>
			<thead>
				<tr>
					<th>userCode</th>
					<th>userName</th>
					<th>userName</th>
				</tr>
			</thead>
			<tbody>
				<c:choose>
					<c:when test="${fn:length(Alllist) > 0}">
						<c:forEach items="${Alllist}" var="Alllist">
							<tr>
								<td>${Alllist}</td>
								<td>${Alllist.usercode}</td>
								<td>${Alllist.username}</td>
							</tr>
						</c:forEach>
					</c:when>
					<c:otherwise>
						<tr>
							<td colspan="4">조회된 결과가 없습니다.</td>
						</tr>
					</c:otherwise>
				</c:choose>
			</tbody>
		</table>
	</div>

	<!--paginate -->
	<div class="paginate">
		<div class="paging">
			<a class="direction prev" href="javascript:void(0);"
				onclick="movePage(1,${pagination.cntPerPage},${pagination.pageSize});">
				&lt;&lt; </a> <a class="direction prev" href="javascript:void(0);"
				onclick="movePage(${pagination.currentPage}<c:if test="${pagination.hasPreviousPage == true}">-1</c:if>,${pagination.cntPerPage},${pagination.pageSize});">
				&lt; </a>

			<c:forEach begin="${pagination.firstPage}"
				end="${pagination.lastPage}" var="idx">
				<a
					style="color:<c:out value="${pagination.currentPage == idx ? '#cc0000; font-weight:700; margin-bottom: 2px;' : ''}"/> "
					href="javascript:void(0);"
					onclick="movePage(${idx},${pagination.cntPerPage},${pagination.pageSize});"><c:out
						value="${idx}" /></a>
			</c:forEach>
			<a class="direction next" href="javascript:void(0);"
				onclick="movePage(${pagination.currentPage}<c:if test="${pagination.hasNextPage == true}">+1</c:if>,${pagination.cntPerPage},${pagination.pageSize});">
				&gt; </a> <a class="direction next" href="javascript:void(0);"
				onclick="movePage(${pagination.totalRecordCount},${pagination.cntPerPage},${pagination.pageSize});">
				&gt;&gt; </a>
		</div>
	</div>
	<!-- /paginate -->

	<div class="bottom">
		<div class="bottom-left">
			<select id="cntSelectBox" name="cntSelectBox"
				onchange="changeSelectBox(${pagination.currentPage},${pagination.cntPerPage},${pagination.pageSize});"
				class="form-control" style="width: 100px;">
				<option value="10"
					<c:if test="${pagination.cntPerPage == '10'}">selected</c:if>>10개씩</option>
				<option value="20"
					<c:if test="${pagination.cntPerPage == '20'}">selected</c:if>>20개씩</option>
				<option value="30"
					<c:if test="${pagination.cntPerPage == '30'}">selected</c:if>>30개씩</option>
			</select>
		</div>
	</div>





</body>

<script>
//10,20,30개씩 selectBox 클릭 이벤트
function changeSelectBox(currentPage, cntPerPage, pageSize){
	var selectValue = $("#cntSelectBox").children("option:selected").val();
	movePage(currentPage, selectValue, pageSize);
	
}

//페이지 이동
function movePage(currentPage, cntPerPage, pageSize){
	
	var url = "${pageContext.request.contextPath}/listpage";
	url = url + "?currentPage="+currentPage;
	url = url + "&cntPerPage="+cntPerPage;
	url = url + "&pageSize="+pageSize;
	
	location.href=url;
}

</script>
</html>