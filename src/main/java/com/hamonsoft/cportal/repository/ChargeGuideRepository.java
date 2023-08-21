package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.MemberMonthUse;
import com.hamonsoft.cportal.domain.MemberUseDevice;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
@Mapper
@Repository
public interface ChargeGuideRepository {
    Page<List<MemberUseDevice>> doMemberDeviceList(String strBusinessName, Pageable pageable);

    List<MemberUseDevice> doMemberDeviceInfo(String strEmail);

    List<MemberMonthUse> doMemberMonthUseInfo(String strEmail);

}
