package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.domain.MemberUseDevice;
import com.hamonsoft.cportal.repository.ChargeGuideRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChargeGuideService {

    private static final Logger logger = LoggerFactory.getLogger(ChargeGuideService.class);
    @Autowired
    private ChargeGuideRepository chargeGuideRepository;
    public Page<List<MemberUseDevice>> doMemberDeviceList(String strBusinessName, Pageable pageable) {
        logger.info("ChargeGuideService model ---->");
        return chargeGuideRepository.doMemberDeviceList(strBusinessName, pageable);
    }

    public List<MemberUseDevice> doMemberDeviceInfo(String strEmail) {
        logger.info("ChargeGuideService model ---->");
        return chargeGuideRepository.doMemberDeviceInfo(strEmail);
    }
}
