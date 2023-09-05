package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
//@Transactional
public class UserService {

    @Value("${rest.url}")
    String restURL;

    UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MemberTaxInformation info(Member member) {
        return userRepository.info(member);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto chgmember(MemberTaxInformation info) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = chgMemberInfo(info);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chgmember(info);
            userRepository.chgtaxinformation(info);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto chgpw(Member member) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = chgPassword(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chgpw(member);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;

    }

    private ResultDto chgMemberInfo(MemberTaxInformation info) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_info";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", info.getEmail());
        body.put("USER_NAME", info.getMembername());
        body.put("GRP_NAME", info.getGrpname());
        body.put("EMAIL", info.getEmail());
        body.put("CELL_TEL", info.getCelltel());
//        body.put("CLOUD_GRADE", info.getLicensegrade());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }

    private ResultDto chgPassword(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_password";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("PASSWORD", member.getPassword());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }


    public int  withdrawal(Map<String, Object> paramMap) {
        return userRepository.withdrawal(paramMap);
    }


}
