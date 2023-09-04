package com.hamonsoft.cportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.service.MemberInfoService;
import com.hamonsoft.cportal.utils.Pagination;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping(value = "/charge")
public class MemberInfoController {

    private static final Logger logger = LoggerFactory.getLogger(MemberInfoController.class);
    private static final String LOGIN = "login";

    @Resource
    private MemberInfoService memberinfoService;

    @RequestMapping(value = "/memberinfo") // memberinfo
    public ModelAndView MemberInfoList(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "cntPerPage", required = false, defaultValue = "10") int cntPerPage,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {


        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/memberinfo");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());

        int listCnt = memberinfoService.memberInfoCount("");
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize, "");
        pagination.setTotalRecordCount(listCnt);
        logger.info("pagination.toString--->" + pagination.toString());
        mav.addObject("pagination",pagination);
        List<Map<String, Object>> memberSet = memberinfoService.memberInfoList(pagination);
        String strEmail = memberSet.get(0).get("email").toString();
        //String strEmail = memberInfo.toString();
        logger.info("strEmail = memberInfo.toString() --->" + memberSet.get(0).toString());
        mav.addObject("list",memberSet);
        mav.addObject("userInfo",memberinfoService.memberLicenseInfo(strEmail));
        mav.addObject("chargeInfo",memberinfoService.memberChargeInfo(strEmail));
        mav.addObject("taxInfo",memberinfoService.memberTaxInfo(strEmail));
        logger.info("MemberSetList strEmail = memberInfo.toString() --->" + memberSet.get(0).toString());
        logger.info("mav.getViewName() = mav.getViewName() --->" +mav.getViewName());
        logger.info("mav.getModelMap() = mav.getModelMap() --->" +memberinfoService.memberLicenseInfo(strEmail).toString());
        return mav;
    }


    @PostMapping(value = "/memberinfo")
    public ModelAndView MemberInfoListPost(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "cntPerPage", required = false, defaultValue = "10") int cntPerPage,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {

        String searchname = request.getParameter("searchname");
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/memberinfo");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("searchname ---->"+searchname);
        logger.info("TestTableController member ---->"+member.getEmail());
        logger.info("TestTableController member ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController member ---->"+member.getBusinessname());

        int listCnt = memberinfoService.memberInfoCount(searchname);
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize, searchname);
        pagination.setTotalRecordCount(listCnt);
        logger.info("pagination.toString--->" + pagination.toString());
        mav.addObject("pagination",pagination);
        List<Map<String, Object>> memberSet = memberinfoService.memberInfoList(pagination);
        String strEmail = memberSet.get(0).get("email").toString();
        //String strEmail = memberInfo.toString();
        logger.info("strEmail = memberInfo.toString() --->" + memberSet.get(0).toString());
        mav.addObject("list",memberSet);
        mav.addObject("userInfo",memberinfoService.memberLicenseInfo(strEmail));
        mav.addObject("chargeInfo",memberinfoService.memberChargeInfo(strEmail));
        mav.addObject("taxInfo",memberinfoService.memberTaxInfo(strEmail));
        logger.info("mav.getViewName() = mav.getViewName() --->" +mav.getViewName());
        logger.info("mav.getModelMap() = mav.getModelMap() --->" +mav.getModelMap());
        logger.info("MemberSetListPost strEmail = memberInfo.toString() --->" + memberSet.get(0).toString());
        logger.info("mav.getModelMap() = mav.getModelMap() --->" +memberinfoService.memberLicenseInfo(strEmail).toString());
        return mav;
    }


    //@ResponseBody
    @RequestMapping(value = "/{email}")
    public List<Map<String, Object>> MemberIndividual(@PathVariable("email") String email, HttpServletRequest request,
                                 String stremail, Model model) throws Exception {
        String strEmail = request.getParameter("stremail");
        logger.info("MemberIndividual strEmail ---->"+strEmail);
        strEmail = email;
        Enumeration<String> params = request.getParameterNames();
        while(params.hasMoreElements()) {
            String name = (String) params.nextElement();
            logger.info(name + " : " + request.getParameter(name) + "     ");
        }
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");

        Map<String, Object> userInfo = memberinfoService.memberLicenseInfo(strEmail);
        List<Map<String, Object>> chargeInfo = memberinfoService.memberChargeInfo(strEmail);
        List<Map<String, Object>> taxInfo = memberinfoService.memberTaxInfo(strEmail);
        List<Map<String, Object>> listMap =  new ArrayList<Map<String, Object>>();
        Map<String, Object> map1 = new HashMap<String, Object>();
        Map<String, Object> map2 = new HashMap<String, Object>();
        Map<String, Object> map3 = new HashMap<String, Object>();
        map1.put("userInfo",userInfo);
        map2.put("chargeInfo",chargeInfo);
        map3.put("taxInfo",taxInfo);
        listMap.add(map1);
        listMap.add(map2);
        listMap.add(map3);

        logger.info("chargeInfo ---->"+chargeInfo);
        logger.info("strEmail ---------------------------------------------------------------------------------->"+listMap);
        return listMap;
        //return mav; //mav.addObject("list",memberinfoService.memberLicenseInfo(strEmail));
    }

    @RequestMapping(value = "/memberchargelist")
    public ModelAndView memberchargelist(Map<String, Object> map, HttpServletRequest request, String email) throws Exception {
        String strEmail = request.getParameter("email");

    //    strEmail = email;
        Enumeration<String> params = request.getParameterNames();
        while(params.hasMoreElements()) {
            String name = (String) params.nextElement();
            logger.info(name + " : " + request.getParameter(name) + "     ");
        }
        ModelAndView mav = new ModelAndView();
        //mav.setViewName("redirect:/charge/memberset");
        mav.setViewName("/charge/memberchargelist");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("memberchargelist strEmail ---->"+strEmail);
        logger.info("TestTableController MemberInfo ---->"+member.getEmail());
        logger.info("TestTableController MemberInfo ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController MemberInfo ---->"+member.getBusinessname());
        mav.addObject("chargeInfo",memberinfoService.memberChargeInfo(strEmail));
        return mav;
    }


    @RequestMapping(value = "/membertaxlist")
    public ModelAndView membertaxlist(Map<String, Object> map, HttpServletRequest request, String email) throws Exception {
        String strEmail = request.getParameter("email");
        strEmail = email;
        Enumeration<String> params = request.getParameterNames();
        while(params.hasMoreElements()) {
            String name = (String) params.nextElement();
            logger.info(name + " : " + request.getParameter(name) + "     ");
        }
        ModelAndView mav = new ModelAndView();
        //mav.setViewName("redirect:/charge/memberset");
        mav.setViewName("/charge/membertaxlist");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("strEmail ---->"+strEmail);
        logger.info("TestTableController MemberInfo ---->"+member.getEmail());
        logger.info("TestTableController MemberInfo ---->"+member.getEmailcertificationyn());
        logger.info("TestTableController MemberInfo ---->"+member.getBusinessname());
        mav.addObject("taxInfo",memberinfoService.memberTaxInfo(strEmail));
        return mav;
    }


    @RequestMapping(value = "/individualinfo")
    public ModelAndView MemberIndividual(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "20", required = false, defaultValue = "20") int cntPerPage,
            @RequestParam(value = "20", required = false, defaultValue = "20") int pageSize,
            Map<String, Object> map, HttpServletRequest request) throws Exception {

        ModelAndView mav = new ModelAndView();
        mav.setViewName("/charge/individualinfo");
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        logger.info("MemberInfoController individualinfo member ---->"+member.getEmail()+"  getAdministratoryn--> "+member.getAdministratoryn());

        //String strEmail = memberInfo.toString();
        mav.addObject("userInfo",memberinfoService.memberLicenseInfo(member.getEmail()));

        int listCnt = memberinfoService.memberChargeCount(member.getEmail());
        Pagination pagination = new Pagination(currentPage, cntPerPage, pageSize, member.getEmail());
        pagination.setTotalRecordCount(listCnt);
        mav.addObject("pagination1",pagination);
        mav.addObject("chargeInfo",memberinfoService.memberChargePageInfo(pagination));

        listCnt = memberinfoService.memberTaxCount(member.getEmail());
        pagination = new Pagination(currentPage, cntPerPage, pageSize, member.getEmail());
        pagination.setTotalRecordCount(listCnt);
        mav.addObject("pagination2",pagination);
        mav.addObject("taxInfo",memberinfoService.memberTaxPageInfo(pagination));
        logger.info("mav.getViewName() = mav.getViewName() --->" +mav.getViewName());
        logger.info("mav.getModelMap() = mav.getModelMap() --->" +mav.getModelMap());
        return mav;

    }


    @ResponseBody
    @PostMapping(value = "/userInfoSave")
    public String MemberInfoPostSave(@RequestBody MemberLicenseDto memberLicenseDto) throws Exception {
        logger.info("memberLicenseDto --> "+memberLicenseDto);

        memberinfoService.licenseUpdate(memberLicenseDto);
       // licenseUpdate
        return null;
    }

}
