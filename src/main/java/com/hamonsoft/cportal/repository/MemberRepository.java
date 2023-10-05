package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.*;
import com.hamonsoft.cportal.dto.LoginDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.*;

@Mapper
@Repository
public interface MemberRepository {


    String getTime();

    Member selectMember(String email);

    HashMap<String, Object> selectTaxByEmail(String email);

    TaxInformation taxInfo(String email);

    ArrayList<HashMap<String, String>> selectBaseLicense();

    void updatePayInformation(Map<String, Object> paramMap);

    void insertPayHistory(Map<String, Object> paramMap);

    ArrayList<HashMap<String, String>> selectEmails();

    String selectSettlementmeans(String email);

    void insertMember(Member member);

    void insertTaxInfomation(TaxInformation taxInformation);

    void insertAuthentication(Authentication authentication);

    void insertMemberLicense(MemberLicense license);

    List<Member> listAll();

    ArrayList<HashMap<String, Object>> findAll();

    Member login(LoginDTO dto);

    void keepLogin(Map<String, Object> paramMap);

    Member checkUserWithSessionKey(Map<String, Object> paramMap);

    String fineId(Map<String, Object> paramMap);

    void updatePw(Map<String, Object> paramMap);

    void emailcertification(Map<String, Object> paramMap);


    int existsEmail(String email);

}
