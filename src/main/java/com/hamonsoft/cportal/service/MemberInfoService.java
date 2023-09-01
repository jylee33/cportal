package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.utils.Pagination;

import java.util.List;
import java.util.Map;

public interface MemberInfoService {

    public int memberInfoCount(String searchname) throws Exception;

    public List<Map<String, Object>> memberInfoList(String searchname, Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberInfoList(Pagination pagination) throws Exception;


    public Map<String, Object> memberLicenseInfo(String email) throws Exception;

    public List<Map<String, Object>> memberChargeInfo(String email) throws Exception;

    public List<Map<String, Object>> memberTaxInfo(String email) throws Exception;

}
