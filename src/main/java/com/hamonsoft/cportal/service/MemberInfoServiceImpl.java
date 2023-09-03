package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.repository.MemberInfoRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Primary
public class MemberInfoServiceImpl implements MemberInfoService {

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
        return memberinfoRepository.memberLicenseInfo(email);
    };

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
}
