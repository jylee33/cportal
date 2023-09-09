package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.AidFunctionDto;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.ResponseDTO;
import com.hamonsoft.cportal.service.LicenseManageService;
//import com.hamonsoft.cportal.utils.GridUtil;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//import java.util.*;

@RestController
@RequestMapping(value = "/license")
public class LicenseManageController {

    private static final Logger logger = LoggerFactory.getLogger(LicenseManageController.class);
    private static final String LOGIN = "login";

    @Resource
    private LicenseManageService licensemanageService;
/*
    @Resource
    private GridUtil gridutin;
*/
    @RequestMapping(value = "/licensemanage") // memberinfo
    public ModelAndView licensemanage(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/licensemanage");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String solution = request.getParameter("solutioncode");
        logger.info("LicenseManageController licensemanage ---->"+member.getEmail());
        logger.info("LicenseManageController licensemanage---->"+member.getEmailcertificationyn());
        logger.info("LicenseManageController licensemanage ---->"+member.getBusinessname());
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

    @GetMapping(value = "/creditinfo") // memberinfo
    public ModelAndView creditList(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/creditinfo");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String solution = request.getParameter("solutioncode");
        logger.info("LicenseManageController creditList ---->"+member.getEmail());
        logger.info("LicenseManageController creditList ---->"+member.getEmailcertificationyn());
        logger.info("LicenseManageController creditList ---->"+member.getBusinessname());
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


    @PostMapping(value="/aidc1111odeview")
    public ModelAndView aidcodeview(Map<String, Object> map, HttpServletRequest request) throws Exception {
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
        mav.setViewName("redirect:/license/aidcodeinfo");
        mav.addObject("aidInfo",licensemanageService.aidfunctionList(functioncode));
        //logger.info("LicenseManageController licensemanageService ---->"+licensemanageService.aidfunctionList(functioncode));
        return mav;
    }



    @PostMapping(value="/aidcodeinfo111111")
    public ModelAndView aidcodeinfolist(Map<String, Object> map, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/license/aidcodeinfo");

        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        String functioncode = request.getParameter("sltcode");
        if(functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }
        ArrayList<HashMap<String, Object>> aidFunctionDtos = licensemanageService.aidfunctionList(functioncode);
        mav.addObject("aidInfo",aidFunctionDtos);
        //logger.info("LicenseManageController licensemanageService ---->"+licensemanageService.aidfunctionList(functioncode));
        logger.info("LicenseManageController aidfunctionList           ModelAndView---->"+mav);
        return mav;
    }

    @GetMapping(value="/aidcodeinfo")
    public ResponseEntity<?> aidcodeinfolist(HttpServletResponse response) throws IOException {
        String sltcode = "";

        if (sltcode == null || sltcode.isEmpty()) {
            sltcode = "10";
        }

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(licensemanageService.aidfunctionList(sltcode));
        logger.info("LicenseManageController aidfunctionList ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);

    }
    @PostMapping(value = "/aidcodeinfo11111")
    public ArrayList<HashMap<String, Object>> aidcodeinfo (Map < String, Object > map, HttpServletRequest request) throws
    Exception {
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
//        Member member = new Member();
//        member.setEmail("manager01@hamonsoft.com");
//        member.setPassword("11111");
        String functioncode = request.getParameter("sltcode");
        logger.info("LicenseManageController jqxgridgrid ---->" + member.getBusinessname());
        if (functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }

        ArrayList<HashMap<String, Object>> aidInfo = licensemanageService.aidfunctionList(functioncode);
        logger.info("LicenseManageController aidfunctionList PostMapping---->" + aidInfo);
        //JSONArray jsonArr = convertListToJson(aidInfo);
       // logger.info(jsonArr.toJSONString());
        return aidInfo;
    }


    @GetMapping(value = "/aidtest")
    public ModelAndView aidtest (Map < String, Object > map, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        Member member = (Member) session.getAttribute("login");
        if (member.toString().isEmpty()) {
            member.setEmail("manager01@hamonsoft.com");
            member.setPassword("11111");
        }
        //        Member member = new Member();
//        member.setEmail("manager01@hamonsoft.com");
//        member.setPassword("11111");
        String functioncode = request.getParameter("sltcode");
        logger.info("LicenseManageController jqxgridgrid ---->" + member.getBusinessname());
        if (functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("aidInfo", licensemanageService.aidfunctionList(functioncode));
        logger.info("LicenseManageController aidfunctionList List<Map<String, Object>>---->" );
        //logger.info("LicenseManageController licensemanageService ---->"+licensemanageService.aidfunctionList(functioncode));
        return mav;
    }

    @RequestMapping(value = "/jqgrid", method = RequestMethod.GET)
    public ModelAndView jqgrid (ModelAndView mav)
    {
        mav.setViewName("/license/jqgrid");
        return mav;
    }

//    @GetMapping(value = "/aidcodeinfo")
//    public void get_aidcodeinfo(Model model) {
//
//    }
    /* Map, List Map으로 작업하다가 json array 로 변환이 필요할때 */
    @SuppressWarnings({"unchecked"})
    public static JSONArray convertListToJson (List < Map < String, Object >> listMap){

        JSONArray jsonArray = new JSONArray();
        for (Map<String, Object> map : listMap) {
            jsonArray.add(convertMapToJson(map));
        }
        return jsonArray;

    }

    @SuppressWarnings({"unchecked"})
    public static JSONObject convertMapToJson (Map < String, Object > map){

        JSONObject json = new JSONObject();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            json.put(key, value);

        }
        return json;
    }

}
