package com.hamonsoft.cportal.domain;

import lombok.Data;
/**
 * <b>사용자 과금 발행 정보 Vo</b>
 * <p>사용자 과금 내역을 가져 오기 위한 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
public class MemberMonthUse {
    private String email;
    private String useyym;
    private String licensegrade;
    private int datakeepterm;
    private String datakeepunit;
    private int basevolume;
    private int basecharge;
    private int servicevolume;
    private int addvolume;
    private int addcharge;
    private int totalvolume;
    private int networkvolume;
    private int servervolume;
    private int apvolume;
    private int dbmsvolume;
    private int fmsvolume;
    private int etcvolume;
    private int totalcharge;
}
