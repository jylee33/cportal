package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.dto.LicensePolicyDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface LicenseManageRepository {

    ArrayList<HashMap<String, Object>> licensePolicyList(String solution);

    ArrayList<HashMap<String, Object>> licensePolicyList1(String solution);
    ArrayList<HashMap<String, Object>> aidfunctionList(String solution);

    ArrayList<HashMap<String, Object>> creditList();
}
