package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.JsonUseVolume;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface SchedulerRepository {
    ArrayList<HashMap<String, Object>> memberAllList();


    public void batchUseDeviceInsert(JsonUseVolume JsonUseVolume) throws Exception;


    public void batchUseDeviceInsert(ArrayList<JsonUseVolume> createUseDivice) throws Exception;

}

