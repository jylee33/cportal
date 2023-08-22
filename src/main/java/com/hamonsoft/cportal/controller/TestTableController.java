package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.TestTableService;
import com.hamonsoft.cportal.utils.Pagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
public class TestTableController {

    private static final Logger logger = LoggerFactory.getLogger(ChargeGuideController.class);

    @Resource
    private TestTableService testtableService;

    @RequestMapping(value = "/listpage")
    public ModelAndView AllListView(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "cntPerPage", required = false, defaultValue = "10") int cntPerPage,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/listpage");
        int listCnt = testtableService.testTableCount();
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize);
        pagination.setTotalRecordCount(listCnt);
        logger.info("pagination.toString--->" + pagination.toString());
        mav.addObject("pagination",pagination);
        mav.addObject("Alllist",testtableService.SelectAllList(pagination));
        return mav;
    }



    @RequestMapping(value = "/membersetpage")
    public ModelAndView MemberSetList(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "cntPerPage", required = false, defaultValue = "10") int cntPerPage,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/membersetpage");
        int listCnt = testtableService.memberSetCount02();
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize);
        pagination.setTotalRecordCount(listCnt);
        logger.info("pagination.toString--->" + pagination.toString());
        mav.addObject("pagination",pagination);
        mav.addObject("list",testtableService.memberSetList02(pagination));
        return mav;
    }
}
