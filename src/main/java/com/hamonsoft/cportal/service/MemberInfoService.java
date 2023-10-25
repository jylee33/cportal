package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MemberInfoService {

    public int memberInfoCount(String searchname) throws Exception;  //관리자 회원 등록 현황

    public int memberChargeCount(String email) throws Exception;  //회원 과금 현황

    public int memberTaxCount(String email) throws Exception;  //회원 세금계산서 현황

    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception;

    //public List<Map<String, Object>> memberInfoList(String searchname) throws Exception;


    public Map<String, Object> memberLicenseInfo(String email) throws Exception;

    public List<Map<String, Object>> memberChargePageInfo(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberTaxPageInfo(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberChargeInfo(String email) throws Exception;

    public List<Map<String, Object>> memberTaxInfo(String email) throws Exception;

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto licenseUpdate(MemberLicenseDto memberLicenseDto) throws Exception;
    @Transactional(rollbackFor = {Exception.class})
    public void memberUpdate(MemberLicenseDto memberLicenseDto) throws Exception;


}
