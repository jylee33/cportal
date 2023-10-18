package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberInfoRepository {
    public int memberInfoCount(String searchbar) throws Exception;

    public int memberChargeCount(String email) throws Exception;//회원 과금 현황

    public int memberTaxCount(String email) throws Exception;//회원 세금계산서 현황

    public List<Map<String, Object>> memberInfoFirstList(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception;


    public Map<String, Object> memberLicenseInfo(String email) throws Exception;


    public List<Map<String, Object>> memberChargeList(String email) throws Exception;

    public List<Map<String, Object>> memberTaxList(String email) throws Exception;


    public List<Map<String, Object>> memberChargePageList(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberTaxPageList(Pagination pagination) throws Exception;

    public void licenseUpdate(MemberLicenseDto memberLicenseDto) throws Exception;

    public void memberUpdate(MemberLicenseDto memberLicenseDto) throws Exception;


    public String jsonUseDeviceCount(String email) throws Exception;

    public void jsonUseDeviceInsert(JsonUseVolume jsonUseVolume) throws Exception;


    public String memberHostName(String email);
}
