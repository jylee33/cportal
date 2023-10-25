package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Authentication;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.dto.*;
import com.hamonsoft.cportal.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@RequiredArgsConstructor
@Service
//@Transactional
public class MemberService {

    @Value("${rest.url}")
    String restURL;

    private final MemberRepository memberRepository;
    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    // @RequiredArgsConstructor 를 사용함으로써 final 로 선언된 필드를 파라미터로 가지는 생성자가 자동으로 생성됨.
    // 아래 @Autowired 를 사용해서 생성자 주입을 명시적으로 할 필요가 없음.
//    @Autowired
//    public MemberService(MemberRepository memberRepository) {
//        this.memberRepository = memberRepository;
//    }

    public String getTime() {
        return memberRepository.getTime();
    }

    public Member selectMember(String email) {
        return memberRepository.selectMember(email);
    }

    public HashMap<String, Object> selectTaxByEmail(String email) {
        return memberRepository.selectTaxByEmail(email);
    }

    public TaxInformation taxInfo(String email) {
        return memberRepository.taxInfo(email);
    }

    public ArrayList<HashMap<String, String>> selectBaseLicense() {
        return memberRepository.selectBaseLicense();
    }

    public void updatePayInformation(Map<String, Object> paramMap) {
        memberRepository.updatePayInformation(paramMap);
    }

    public void insertTaxHistory(Map<String, Object> paramMap) {
        memberRepository.insertTaxHistory(paramMap);
    }

    public ArrayList<HashMap<String, String>> selectEmails() {
        return memberRepository.selectEmails();
    }

    public String selectSettlementmeans(String email) {
        return memberRepository.selectSettlementmeans(email);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto insertMember(Member member, TaxInformation taxInformation, Authentication authentication, MemberLicense license) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = addUser(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            LocalDate ldNow = LocalDate.now();
            int today = ldNow.getDayOfMonth();
            int endday = ldNow.lengthOfMonth();
            int dCount = endday - today + 1;
            long paid_amount2 = taxInformation.getPaid_amount() * dCount / endday;  // 일할 계산
            logger.info("일할 계산된 paid_amount2 - " + paid_amount2);
            taxInformation.setPaid_amount(paid_amount2);

            LocalDate ldNextMonth = ldNow.plusMonths(1).withDayOfMonth(1);
            Instant instant = ldNextMonth.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Date dtNext = Date.from(instant);
            taxInformation.setNext_pay_date(dtNext);
            member.setMemberid(resultDto.getUUID());
            member.setHostname(resultDto.getHOST_NAME());
            memberRepository.insertMember(member);
            memberRepository.insertTaxInfomation(taxInformation);
            memberRepository.insertAuthentication(authentication);
            memberRepository.insertMemberLicense(license);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
        }

        return resultDto;
    }

    public String getNetisToken(String email) {
        ResultAuthDto resultDto = new ResultAuthDto();
        logger.info("email - " + email);

        try {
            resultDto = getAccessToken(email);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return resultDto.getAccess_token();
    }

    private ResultAuthDto getAccessToken(String email) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://aws.auth.hamon.vip/netis/auth/token";
        logger.info("url - " + url);

        Member member = memberRepository.selectMember(email);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("netis-route", member.getHostname());

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("username", email);

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

        ResultAuthDto dto = objectMapper.readValue(resBody, ResultAuthDto.class);

        return dto;
    }

    private ResultDto addUser(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://aws.lb.hamon.vip/cloud/v1/user_manager/add_user";
        logger.info("url - " + url);

        String strGrade = "free";
        int credit = 0;
        switch (member.getLicensegrade()) {
            case 1:
                strGrade = "free";
                credit = 5;
                break;
            case 2:
                strGrade = "basic";
                credit = 25;
                break;
            case 3:
                strGrade = "pro";
                credit = 50;
                break;
            case 4:
                strGrade = "enterprise";
                credit = 100;
                break;
        }

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("netis-route", strGrade);


        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("PASSWORD", member.getPassword());
        body.put("USER_NAME", member.getMembername());
        body.put("GRP_NAME", member.getGrpname());
        body.put("EMAIL", member.getEmail());
        body.put("CELL_TEL", member.getCelltel());
        body.put("CLOUD_GRADE", member.getLicensegrade());
        body.put("CREDIT",credit);
        member.setCredit(credit);

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

        ResultDto dto = objectMapper.readValue(resBody, ResultDto.class);

        return dto;
    }

    public List<Member> listAll() {
        return memberRepository.listAll();
    }

    public ArrayList<HashMap<String, Object>> findAll() {
        return memberRepository.findAll();
    }

    public HashMap<String, Object> getIpAddress(String uuid) {
        return memberRepository.getIpAddress(uuid);
    }

    public Member login(LoginDTO dto) {
        return memberRepository.login(dto);
    }

    public void updateAccessToken(Map<String, Object> paramMap) {
        memberRepository.updateAccessToken(paramMap);
    }

    public void keepLogin(Map<String, Object> paramMap) {
        memberRepository.keepLogin(paramMap);
        logger.info("paramMap -->"+paramMap.toString());
        memberRepository.loginHistoryInsert(paramMap);
    }
    public void loginHistoryInsert(Map<String, Object> paramMap) {
        memberRepository.loginHistoryInsert(paramMap);
    }
    public Member checkUserWithSessionKey(Map<String, Object> paramMap) {
        return memberRepository.checkUserWithSessionKey(paramMap);
    }

    public String findId(Map<String, Object> paramMap) {
        return memberRepository.fineId(paramMap);
    }

    public void updatePw(Map<String, Object> paramMap) {
        memberRepository.updatePw(paramMap);
    }

    public void emailcertification(Map<String, Object> paramMap) {
        memberRepository.emailcertification(paramMap);
    }


    public int existsEmail(String email)  {
        return memberRepository.existsEmail(email);
    }

}
