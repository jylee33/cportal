package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.dto.RequestIPDTO;
import com.hamonsoft.cportal.dto.ResponseDTO;
import com.hamonsoft.cportal.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    MemberService memberService;

    @Autowired
    public ApiController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping(value = "findAll")
    public ResponseEntity<?> findAll() {
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(memberService.findAll());
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PostMapping(value = "getIpAddress")
    public ResponseEntity<?> getIpAddress(@RequestBody RequestIPDTO req) {
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("0");
        responseDTO.setRes(memberService.getIpAddress(req.getUuid()));
        if (responseDTO.getRes() == null) {
            responseDTO.setResultCode("-1");
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
}
