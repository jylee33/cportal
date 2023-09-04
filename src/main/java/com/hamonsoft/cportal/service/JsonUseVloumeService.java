package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.repository.JsonUseVolumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JsonUseVloumeService {
    private static final Logger logger = LoggerFactory.getLogger(JsonUseVloumeService.class);

    @Autowired
    JsonUseVolumeRepository jsonUseVolumeRepository;

    public int jsonUseVolumeCount(String email) throws Exception {
        return jsonUseVolumeRepository.jsonUseVolumeCount(email);
    }

    public void jsonUseVolumeInsert(JsonUseVolume jsonUseVolume) throws Exception {
        jsonUseVolumeRepository.JsonUseVolumeInsert(jsonUseVolume);
    }

    public void jsonUseDeviceInsert(JsonUseVolume jsonUseVolume) throws Exception {
        jsonUseVolumeRepository.jsonUseDeviceInsert(jsonUseVolume);
    }
}
