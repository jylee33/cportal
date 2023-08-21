package com.hamonsoft.cportal.domain;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
/**
 * <b>사용자 등록 장비 정보 Vo</b>
 * <p>사용자 등록 장비 정보를 가져 오기 위한 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
public class MemberUseDevice {
    private String membername;
    private String email;
    private String licensegrade;
    private String celltel;
    private String businessname;
    private String businessnumber;
    private String joindate;
    private int datakeepterm;
    private String datakeepunit;
    private int totalsoluble;
    private int basevolume;
    private int basecharge;
    private int servicevolume;
    private int addvolume;
    private int addcharge;
    private String postnumber;
    private String address;
    private String detailaddress;
    private String zipaddress;
    private int totalvolume;
    private int networkvolume;
    private int servervolume;
    private int apvolume;
    private int dbmsvolume;
    private int fmsvolume;
    private int totalcharge;
    private float userate;
//    public String getMembername() {
//        return membername;
//    }
//    public String getEmail() {
//        return email;
//    }
//    public String getLicensegrade() {
//        return licensegrade;
//    }
//    public String getCelltel() {
//        return celltel;
//    }
//    public String getBusinessname() {
//        return businessname;
//    }
//    public String getBusinessnumber() {
//        return businessnumber;
//    }
//    public String getJoindate() {
//        return joindate;
//    }
//    public int getDatakeepterm() {
//        return datakeepterm;
//    }
//    public String getDatakeepunit() {
//        return datakeepunit;
//    }
//    public int getBasevolume() {
//        return basevolume;
//    }
//    public int getBasecharge() {
//        return basecharge;
//    }
//    public int getServicevolume() {
//        return servicevolume;
//    }
//    public int getAddvolume() {
//        return addvolume;
//    }
//    public int getAddcharge() {
//        return addcharge;
//    }
//    public String getPostnumber() {
//        return postnumber;
//    }
//    public String getAddress() {
//        return address;
//    }
//    public String getDetailaddress() {
//        return detailaddress;
//    }
//    @Override
//    public String toString() {
//        return "MemberUseDevice [membername    = " + membername    +", email = " + email          +", licensegrade = " + licensegrade   +
//                ", celltel = " + celltel        +", businessname = " + businessname   +  ", businessnumber = " + businessnumber +
//                ", joindate = " + joindate       + ", datakeepterm = " + datakeepterm   +  ", datakeepunit = " + datakeepunit   +
//                ", basevolume = " + basevolume     +  ", basecharge = " + basecharge     +   ", servicevolume = " + servicevolume  +
//                ", addvolume = " + addvolume      +  ", addcharge = " + addcharge      +", postnumber = " + postnumber     +
//                ", address = " + address        + ", detailaddress = " + detailaddress  + "]";
//    }
}
