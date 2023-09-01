package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberInfoRepository {
    public int memberInfoCount(String searchbar) throws Exception;

    public List<Map<String, Object>> memberInfoFirstList(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberInfoList(String searchbar, Pagination pagination) throws Exception;


    public Map<String, Object> memberLicenseInfo(String stsEmail) throws Exception;


    public List<Map<String, Object>> memberChargeList(String email) throws Exception;

    public List<Map<String, Object>> memberTaxList(String email) throws Exception;

    public void licenseUpdate(MemberLicenseDto memberLicenseDto) throws Exception;

}
