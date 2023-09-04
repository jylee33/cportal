package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface JsonUseVolumeRepository {
    public int jsonUseVolumeCount(String email) throws Exception;

    public void JsonUseVolumeInsert(JsonUseVolume jsonUseVolume) throws Exception;

    public void jsonUseDeviceInsert(JsonUseVolume jsonUseVolume) throws Exception;

}
