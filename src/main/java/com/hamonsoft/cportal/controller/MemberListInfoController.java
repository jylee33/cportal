package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.ResponseDTO;
import com.hamonsoft.cportal.repository.MemberListInfoRepository;
import com.hamonsoft.cportal.service.MemberInfoService;
import com.hamonsoft.cportal.service.MemberListInfoService;
import com.hamonsoft.cportal.utils.Pagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping(value = "/charge")
public class MemberListInfoController {

    private static final Logger logger = LoggerFactory.getLogger(MemberListInfoController.class);
    private static final String LOGIN = "login";

    @Resource
    private MemberListInfoService memberlistInfoService;


    @GetMapping(value = "/memberlistinfo")
    public void memberlistinfo(HttpServletRequest request) throws Exception {
        logger.info("MemberListInfoController memberlistinfo---->");
    }

    @RequestMapping(value="/memberlistview")
    public ResponseEntity<?> memberlistview(@RequestParam Map<String,Object> param
            , HttpServletRequest request) throws IOException {
        String membername =  request.getParameter("membername");
        logger.info("MemberListInfoController memberlistview---membername----->"+membername);
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(memberlistInfoService.memberlistview(membername));
        logger.info("MemberListInfoService.memberlistview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }
    @RequestMapping(value="/memberview")
    public ResponseEntity<?> memberview(@RequestParam Map<String,Object> param
            , HttpServletRequest request) throws IOException {
        String email =  request.getParameter("email");
        logger.info("MemberListInfoController memberview---email----->"+email);
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(memberlistInfoService.memberview(email));
        logger.info("MemberListInfoService.memberlistview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }
    @RequestMapping(value="/chargelistview")
    public ResponseEntity<?> chargelistview(@RequestParam Map<String,Object> param
            , HttpServletRequest request) throws IOException {
        String email =  request.getParameter("email");
        logger.info("MemberListInfoController chargelistview---email----->"+email);
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(memberlistInfoService.chargelistview(email));
        logger.info("MemberListInfoService.memberlistview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }
    @RequestMapping(value="/taxlistview")
    public ResponseEntity<?> taxlistview(@RequestParam Map<String,Object> param
            , HttpServletRequest request) throws IOException {
        String email =  request.getParameter("email");
        logger.info("MemberListInfoController taxlistview---email----->"+email);
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(memberlistInfoService.taxlistview(email));
        logger.info("MemberListInfoService.memberlistview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }



}
