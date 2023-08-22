package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.service.MemberSetService;
import com.hamonsoft.cportal.utils.Pagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.annotation.Resources;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
public class MemberSetController {

    private static final Logger logger = LoggerFactory.getLogger(MemberSetController.class);
    private static final String LOGIN = "login";

    @Resource
    private MemberSetService membersetService;

    @RequestMapping(value = "/memberset")
    public ModelAndView MemberSetList(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "cntPerPage", required = false, defaultValue = "10") int cntPerPage,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/memberset");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());

        int listCnt = membersetService.memberSetCount();
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize);
        pagination.setTotalRecordCount(listCnt);
        logger.info("pagination.toString--->" + pagination.toString());
        mav.addObject("pagination",pagination);
        mav.addObject("list",membersetService.memberSetList(pagination));
        return mav;
    }
}
