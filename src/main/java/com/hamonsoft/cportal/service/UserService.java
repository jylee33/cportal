package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.TaxInformation;
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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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

    public Member memberInfo(Member member) {
        return userRepository.memberInfo(member);
    }

    public TaxInformation taxInfo(Member member) {
        return userRepository.taxInfo(member);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto chgmember(Member member, TaxInformation tax, MemberLicense license) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = chgMemberInfo(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chgmember(member);
            userRepository.chgtaxinformation(tax);

            int preGrade = member.getPrelicensegrade();
            int newGrade = member.getLicensegrade();

            if (preGrade != newGrade) {
                resultDto = chgGrade(member);
                if (resultDto.getTRAN_STATUS() != 1) {
                    throw new RuntimeException();
                }

                userRepository.chggrade(member);

                Date dtCreated = userRepository.getCreatedAt(tax);

                DateFormat df = new SimpleDateFormat("yyyyMMdd");
                String sDate1 = df.format(dtCreated);

                long paidAmount = tax.getPaid_amount();
                LocalDate ldNow = LocalDate.now();
                int today = ldNow.getDayOfMonth();
                int endday = ldNow.lengthOfMonth();
                int dCount = endday - today + 1;    // 오늘 이후 이번달 남은 날짜수

                String sDate2 = df.format(java.sql.Date.valueOf(ldNow));

                // 가입일이 현재 달과 같을 경우 즉 이번달에 가입한 경우, 과금액을 가입일 기준으로 재계산
                if (sDate1.substring(0, 6).equals(sDate2.substring(0, 6))) {
                    today = today - Integer.parseInt(sDate1.substring(6, 8)) + 1;
                }

                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("commoncode", newGrade);

                String baseLicense = userRepository.getBaseLicense(paramMap);
                logger.info("baseLicense =============================== " + baseLicense);
                long lLicense = 0;
                if (newGrade != 1) {
                    if (newGrade == 4) {
                        lLicense = 1000000;  // enterprise 는 일단 1,000,000원
                    } else {
                        lLicense = Long.parseLong(baseLicense);
                    }

                }

                long paid_amount2 = paidAmount * (today-1) / endday;    // newGrade = 1, Free 가입자로 변경한 경우는 오늘까지만 금액 계산

                if (newGrade == 1) {
                    // Free 가입자는 next_pay_date 를 어제로 변경하고 chginforesult.jsp 에서 결제 페이지(bill/again)로 이동해서 결제되도록 한다.
                    logger.info("일할 계산된 paid_amount2 - " + paid_amount2);
                    tax.setPaid_amount(paid_amount2);

                    LocalDate ldYesterday = ldNow.plusDays(-1);
                    Instant instant = ldYesterday.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Date dtYesterday = Date.from(instant);
                    logger.info("dtYesterday - " + dtYesterday);

                    tax.setNext_pay_date(dtYesterday);

                    userRepository.updatePaidAmount(tax);

                } else {
                    // Free 이외의 그룹은 오늘 이후 이번달 잔여 날짜에 대한 금액을 더한다.
                    paid_amount2 += lLicense * dCount / endday;  // 일할 계산

                    logger.info("일할 계산된 paid_amount2 - " + paid_amount2);
                    tax.setPaid_amount(paid_amount2);

                    LocalDate ldNextMonth = ldNow.plusMonths(1).withDayOfMonth(1);
                    Instant instant = ldNextMonth.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Date dtNext = Date.from(instant);
                    tax.setNext_pay_date(dtNext);
                    logger.info("next_pay_date - " + tax.getNext_pay_date());

                    userRepository.updatePaidAmount(tax);
                }

                userRepository.insertMemberLicenseHistory(license);

            }
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

    private ResultDto chgMemberInfo(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_info";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("USER_NAME", member.getMembername());
        body.put("GRP_NAME", member.getGrpname());
        body.put("EMAIL", member.getEmail());
        body.put("CELL_TEL", member.getCelltel());
//        body.put("CLOUD_GRADE", member.getLicensegrade());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }

    private ResultDto chgGrade(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_grade";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("CLOUD_GRADE", member.getLicensegrade());

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


    @Transactional(rollbackFor = {Exception.class})
    public ResultDto withdrawal(Member member) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = closeUser(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.withdrawal(member);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;
    }

    private ResultDto closeUser(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/close_user";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }
    public ArrayList<HashMap<String, Object>> findAll() {
        return userRepository.findAll();
    }



}
