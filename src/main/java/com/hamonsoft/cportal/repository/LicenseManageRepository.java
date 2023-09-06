package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.dto.LicensePolicyDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface LicenseManageRepository {

    public List<Map<String, Object>> licensePolicyList(String solution) throws Exception;

    public List<Map<String, Object>> aidfunctionList(String functioncode) throws Exception;

    public List<Map<String, Object>> creditList() throws Exception;
}
