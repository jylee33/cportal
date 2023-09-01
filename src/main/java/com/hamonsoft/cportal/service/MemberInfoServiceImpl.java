package com.hamonsoft.cportal.service;

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
    public List<Map<String, Object>> memberInfoList(String searchname, Pagination pagination) throws Exception {
        return memberinfoRepository.memberInfoList(searchname, pagination);
    }

    @Override
    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception {
        return memberinfoRepository.memberInfoFirstList(pagination);
    }

    public Map<String, Object> memberLicenseInfo(String email) throws Exception{
        return memberinfoRepository.memberLicenseInfo(email);
    };

    public List<Map<String, Object>> memberChargeInfo(String email) throws Exception{
        return memberinfoRepository.memberChargeList(email);
    };

    public List<Map<String, Object>> memberTaxInfo(String email) throws Exception{
        return memberinfoRepository.memberTaxList(email);
    };
}
