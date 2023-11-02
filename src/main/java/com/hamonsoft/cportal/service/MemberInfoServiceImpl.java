package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.controller.MemberInfoController;
import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.NetisUseServiceDto;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.MemberInfoRepository;
import com.hamonsoft.cportal.repository.MemberRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Component
@Primary
public class MemberInfoServiceImpl implements MemberInfoService {

    private static final Logger logger = LoggerFactory.getLogger(MemberInfoController.class);

    @Value("${rest.url}")
    String restURL;

    @Autowired
    MemberInfoRepository memberinfoRepository;

    @Autowired
    MemberRepository memberRepository;

    @Override
    public int memberInfoCount(String searchname) throws Exception {
        return memberinfoRepository.memberInfoCount(searchname);
    }

    @Override
    public int memberChargeCount(String email) throws Exception {
        return memberinfoRepository.memberChargeCount(email); //회원 과금 현황
    }
    @Override
    public int memberTaxCount(String email) throws Exception {
        return memberinfoRepository.memberTaxCount(email);  //회원 세금계산서 현황
    }
    @Override
    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception {
        return memberinfoRepository.memberInfoList(pagination);
    }

//    @Override
//    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception {
//        return memberinfoRepository.memberInfoFirstList(pagination);
//    }

    public Map<String, Object> memberLicenseInfo(String email) throws Exception{
        NetisUseServiceDto netisUseServiceDto = new NetisUseServiceDto();
        try {
            netisUseServiceDto = serviceInfo(email);
            logger.info("resultDto----- memberLicenseInfo ---->"+netisUseServiceDto.getTRAN_STATUS()+".."+netisUseServiceDto.getERROR_CODE());
            if (netisUseServiceDto.getTRAN_STATUS() != 1) {
                logger.info("MemberInfoServiceImpl memberLicenseInfo ---->"+email+".."+netisUseServiceDto.getERROR_CODE());
                throw new RuntimeException();
            }
            logger.info("MemberInfoServiceImpl memberLicenseInfo ---->"+netisUseServiceDto.toString());
            JsonUseVolume jsonUseVolume = new JsonUseVolume();

            jsonUseVolume.setUserid(email);
            jsonUseVolume.setNmscount(netisUseServiceDto.getINFO().getNMS_COUNT());
            jsonUseVolume.setSmscount(netisUseServiceDto.getINFO().getSMS_COUNT());
            jsonUseVolume.setDbmscount(netisUseServiceDto.getINFO().getDBMS_COUNT());
            jsonUseVolume.setApcount(netisUseServiceDto.getINFO().getAP_COUNT());
            jsonUseVolume.setFmscount(netisUseServiceDto.getINFO().getFMS_COUNT());
            jsonUseVolume.setInfo(netisUseServiceDto.getINFO().toString());
            jsonUseVolume.setTranstatus(netisUseServiceDto.getTRAN_STATUS());
            jsonUseVolume.setReason(netisUseServiceDto.getREASON());
            jsonUseVolume.setUsedeviceid(memberinfoRepository.jsonUseDeviceCount(email));
            memberinfoRepository.jsonUseDeviceInsert(jsonUseVolume);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            logger.info("사용자 등록이 안돼어 있습니다.(사용자 등록)");
        }finally {
            return memberinfoRepository.memberLicenseInfo(email);

        }
    }

    public List<Map<String, Object>> memberChargePageInfo(Pagination pagination) throws Exception{
        return memberinfoRepository.memberChargePageList(pagination);
    };

    public List<Map<String, Object>> memberTaxPageInfo(Pagination pagination) throws Exception{
        return memberinfoRepository.memberTaxPageList(pagination);
    };

    public List<Map<String, Object>> memberChargeInfo(String email) throws Exception{
        return memberinfoRepository.memberChargeList(email);
    };

    public List<Map<String, Object>> memberTaxInfo(String email) throws Exception{
        return memberinfoRepository.memberTaxList(email);
    };
    public List<Map<String, Object>> licenseHistoryInfo(String email) throws Exception{
        return memberinfoRepository.licenseHistoryList(email);
    };

    public List<Map<String, Object>> memberHistoryInfo(String email) throws Exception{
        return memberinfoRepository.memberHistoryList(email);
    };

    public ResultDto licenseUpdate(MemberLicenseDto memberLicenseDto) throws Exception{
        ResultDto resultDto = new ResultDto();
        try {
            String email = memberLicenseDto.getEmail();
            int preaddvolume = 0;
            int preservicevolume = 0;
            int addvolume = 0;
            int servicevolume = 0;
            if(memberLicenseDto.getPreaddvolume() != null) {
                preaddvolume = memberLicenseDto.getPreaddvolume();
            }
            if(memberLicenseDto.getAddvolume() != null) {
                addvolume = memberLicenseDto.getAddvolume();
            }
            String hostname = memberLicenseDto.getHostname();
            if(addvolume != preaddvolume){
                resultDto = manage_credit(email, addvolume, hostname);
                if (resultDto.getTRAN_STATUS() != 1) {
                    logger.info("MemberInfoServiceImpl memberLicenseInfo ---->"+email+".."+resultDto.getERROR_CODE());
                    throw new RuntimeException();
                }
                logger.info("MemberInfoServiceImpl memberLicenseInfo ---->"+resultDto.toString());
            }
            memberinfoRepository.licenseUpdate(memberLicenseDto);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
        }
        return resultDto;
    };

    public void memberUpdate(MemberLicenseDto memberLicenseDto) throws Exception{
        memberinfoRepository.memberUpdate(memberLicenseDto);
    };


    private NetisUseServiceDto serviceInfo(String email) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/service_info";
        logger.info("url - " + url);

        Member member = memberRepository.selectMember(email);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.add("netis-route", "free1");
        headers.add("netis-route", member.getHostname());

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", email);

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
//        objectMapper.configure(DeserializationFeature.USE_JAVA_ARRAY_FOR_JSON_ARRAY, true);

        String resBody = response.getBody();
        logger.info("response - " + resBody);

        NetisUseServiceDto dto = objectMapper.readValue(resBody, NetisUseServiceDto.class);

        return dto;
    }

    private ResultDto manage_credit(String email, int addvolume, String hostname) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://aws.lb.hamon.vip/cloud/v1/user_manager/manage_credit";
        logger.info("manage_credit   url - " + url);
        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("netis-route", hostname);
        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", email);
        body.put("CREDIT", addvolume);
        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        String resBody = response.getBody();
        logger.info("response - " + resBody);

        ResultDto dto = objectMapper.readValue(resBody, ResultDto.class);

        return dto;
    }


}
