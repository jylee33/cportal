package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.service.LicenseManageService;
import com.hamonsoft.cportal.service.MemberInfoService;
import com.hamonsoft.cportal.utils.Pagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping(value = "/charge")
public class LicenseManageController {

    private static final Logger logger = LoggerFactory.getLogger(LicenseManageController.class);
    private static final String LOGIN = "login";

    @Resource
    private LicenseManageService licensemanageService;

    @RequestMapping(value = "/licensemanage") // memberinfo
    public ModelAndView licensemanage(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/licensemanage");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String solution = request.getParameter("solutioncode");
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());
        if(solution == null || "".equals(solution)) {
            solution = "10";
        }

        mav.addObject("license",licensemanageService.licensePolicyList(solution));


        return mav;
    }

    @RequestMapping(value = "/aidcode") // memberinfo
    public ModelAndView aidfunctionList(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/aidcode");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String functioncode = request.getParameter("sltcode");
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());
        if(functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }

        mav.addObject("aid",licensemanageService.aidfunctionList(functioncode));
        logger.info("TestTableController aidfunctionList ---->"+licensemanageService.aidfunctionList(functioncode));
        return mav;
    }

    @RequestMapping(value = "/credit") // memberinfo
    public ModelAndView creditList(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/credit");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String solution = request.getParameter("solutioncode");
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());
        mav.addObject("credit",licensemanageService.creditList());


        return mav;
    }


    @ResponseBody
    @PostMapping(value = "/aidInfoSave")
    public String MemberInfoPostSave(@RequestBody MemberLicenseDto memberLicenseDto) throws Exception {
        logger.info("memberLicenseDto --> "+memberLicenseDto);



//        List<<Map<String, Object>> map, HttpServletRequest request) throws Exception {
//
//
//            licensemanageService.aidfunctionUpdate(memberLicenseDto);
//        // licenseUpdate
        return null;
    }
}
