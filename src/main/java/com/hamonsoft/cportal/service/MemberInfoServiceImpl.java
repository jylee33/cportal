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
            logger.info("resultDto.getTRAN_STATUS()---------------------------------- memberLicenseInfo ---->"+netisUseServiceDto.getTRAN_STATUS());
            if (netisUseServiceDto.getTRAN_STATUS() != 1) {
                logger.info("MemberInfoServiceImpl memberLicenseInfo ---->"+email);
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

    public void licenseUpdate(MemberLicenseDto memberLicenseDto) throws Exception{
        memberinfoRepository.licenseUpdate(memberLicenseDto);
    };

    public void memberUpdate(MemberLicenseDto memberLicenseDto) throws Exception{
        memberinfoRepository.memberUpdate(memberLicenseDto);
    };


    private NetisUseServiceDto serviceInfo(String email) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/service_info";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

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

        NetisUseServiceDto dto = objectMapper.readValue(response.getBody(), NetisUseServiceDto.class);

        return dto;
    }


}
