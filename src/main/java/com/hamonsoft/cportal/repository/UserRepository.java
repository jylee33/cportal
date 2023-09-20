package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.domain.TaxInformation;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.*;

@Mapper
@Repository
public interface UserRepository {


    Member memberInfo(Member member);
    TaxInformation taxInfo(Member member);
    int chgmember(Member member);
    int chggrade(Member member);
    int updatePaidAmount(TaxInformation tax);
    int chgtaxinformation(TaxInformation info);
    int chgpw(Member member);
    int withdrawal(Member member);
    Date getCreatedAt(TaxInformation tax);
    String getBaseLicense(Map<String, Object> paramMap);

    ArrayList<HashMap<String, Object>> findAll();
//    Member info(Map<String, Object> paramMap);

    void insertMemberLicenseHistory(MemberLicense license);

}
