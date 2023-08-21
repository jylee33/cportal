package com.hamonsoft.cportal.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.annotations.Mapper;


public class UseDevice {

    private String usedeviceid;
    private String userid;
    private String useday;
    private String transtatus;
    private String info;
    private Integer nmscount;
    private Integer smscount;
    private Integer dbmscount;
    private Integer apcount;
    private Integer fmscount;
    private String reason;

    @Builder
    public UseDevice(String usedeviceid, String userid, String useday, String transtatus, String info,
                     Integer nmscount, Integer smscount, Integer dbmscount, Integer apcount, Integer fmscount, String reason) {
        this.usedeviceid = usedeviceid;
        this.userid = userid;
        this.useday = useday;
        this.transtatus = transtatus;
        this.info = info;
        this.nmscount = nmscount;
        this.smscount = smscount;
        this.dbmscount = dbmscount;
        this.apcount = apcount;
        this.fmscount = fmscount;
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "UseDevice [usedeviceid=" + usedeviceid + ", userid=" + userid + ", useday=" + useday
                + ", transtatus=" + transtatus + ", info=" + info
                + ", nmscount=" + nmscount + ", smscount=" + smscount + ", dbmscount=" + dbmscount
                + ", apcount=" + apcount +  ", fmscount=" + fmscount + ", reason=" + reason
                + "]";
    }

}
