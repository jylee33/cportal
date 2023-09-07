package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.service.LicenseManageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping(value = "/license")
public class LicenseManageController {

    private static final Logger logger = LoggerFactory.getLogger(LicenseManageController.class);
    private static final String LOGIN = "login";

    @Resource
    private LicenseManageService licensemanageService;

    @RequestMapping(value = "/licensemanage") // memberinfo
    public ModelAndView licensemanage(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/licensemanage");

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

//    @RequestMapping(value="/aidcode")
//    public ModelAndView aidfunctionList(Map<String, Object> map, HttpServletRequest request) throws Exception {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("license/aidcode");
//
//        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
//        String functioncode = request.getParameter("sltcode");
//        logger.info("LicenseManageController aidfunctionList ---->"+member.getBusinessname());
//        if(functioncode == null || "".equals(functioncode)) {
//            functioncode = "10";
//        }
//
//        mav.addObject("aidInfo",licensemanageService.aidfunctionList(functioncode));
//        logger.info("LicenseManageController aidfunctionList           DDDDDDDDD---->");
//        return mav;
//    }

    @RequestMapping(value = "/creditinfo") // memberinfo
    public ModelAndView creditList(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/creditinfo");

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


    @GetMapping(value="/aidview")
    public ModelAndView jqxgridgrid(Map<String, Object> map, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
//        Member member = new Member();
//        member.setEmail("manager01@hamonsoft.com");
//        member.setPassword("11111");
        String functioncode = request.getParameter("sltcode");
        logger.info("LicenseManageController  @RequestMapping jqxgridgrid ---->"+member.getBusinessname());
        if(functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/aidcodeinfo");
        mav.addObject("aidInfo",licensemanageService.aidfunctionList(functioncode));
        //logger.info("LicenseManageController licensemanageService ---->"+licensemanageService.aidfunctionList(functioncode));
        return mav;
    }

//    @RequestMapping(value="/aidcode")
//    public ModelAndView aidfunctionList(Map<String, Object> map, HttpServletRequest request) throws Exception {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("license/aidcode");
//
//        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
//        String functioncode = request.getParameter("sltcode");
//        logger.info("LicenseManageController aidfunctionList ---->"+member.getBusinessname());
//        if(functioncode == null || "".equals(functioncode)) {
//            functioncode = "10";
//        }
//
//        mav.addObject("aidInfo",licensemanageService.aidfunctionList(functioncode));
//        logger.info("LicenseManageController aidfunctionList           DDDDDDDDD---->");
//        return mav;
//    }
//    @GetMapping(value="/aidcode")
//    public String jqxgridtab_new(Model model, HttpServletRequest request) throws Exception {
//        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
//        String functioncode = request.getParameter("sltcode");
//        logger.info("LicenseManageController member ---->"+member.getBusinessname());
//        if(functioncode == null || "".equals(functioncode)) {
//            functioncode = "10";
//        }
//        model.addAttribute("aidInfo",licensemanageService.aidfunctionList(functioncode));
//        //logger.info("LicenseManageController licensemanageService ---->"+licensemanageService.aidfunctionList(functioncode));
//        //return "/license/aidcode";
//        return "/license/aidcode";
//    }

    @RequestMapping(value="/aidcodeinfo")
    public ModelAndView aidfunctionList(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/aidcodeinfo");
        logger.info("LicenseManageController aidfunctionList           DDDDDDDDD---->");
        return mav;
    }
    @RequestMapping(value="/jqgrid",method=RequestMethod.GET)
    public ModelAndView jqgrid(ModelAndView mav)
    {
        mav.setViewName("/license/jqgrid");
        return mav;
    }

}
