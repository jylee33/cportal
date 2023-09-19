package com.hamonsoft.cportal.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface LicenseManageRepository {

    ArrayList<HashMap<String, Object>> licensemanageview(String solutioncode);

    ArrayList<HashMap<String, Object>> licensePolicyList(String solutioncode);

    ArrayList<HashMap<String, Object>> licensePolicyList1(String solutioncode);
    ArrayList<HashMap<String, Object>> aidfunctionList(String solutioncode);
    void licenseInsert(Map<String, Object> insertData);

    void licenseUpdate(Map<String, Object> insertData);


    List<HashMap<String, Object>> aidfunctionList2(String solutioncode);

    void aidfunctionInsert(Map<String, Object> insertData);

    void aidfunctionUpdate(Map<String, Object> insertData);


    ArrayList<HashMap<String, Object>> creditView(String groupcode);

    void creditInsert(Map<String, Object> insertData);

    void creditUpdate(Map<String, Object> insertData);

}
