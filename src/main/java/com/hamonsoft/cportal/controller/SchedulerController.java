package com.hamonsoft.cportal.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hamonsoft.cportal.ScheduleTaskClass;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.service.SchedulerService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class SchedulerController {
    private static final Logger logger = LoggerFactory.getLogger(SchedulerController.class);

    @Resource
    private SchedulerService schedulerService;
    /*
    ** netis사용자 사용 장비수를 배치로 가져 온다.
    **/
//    @Scheduled(cron = "0 0 0 1/1 * *")
    //@Scheduled(cron = "0 0 0 1/1 * *")
    //@Scheduled(cron = "0/5 * * * * *")

    @Scheduled(cron = "0 0 0 1/1 * *")
    public void deviceUseScheduler() throws Exception {
        String msgText = schedulerService.memberAllList();
        logger.info(msgText);
    }
    @Scheduled(cron="0/5 * * * * ?") //cron = "0 0 0 1/1 * *")
    public void allUseServiceInfo() throws Exception {
        String msgText = schedulerService.allUseServiceInfo();
        logger.info(msgText);
    }
}
