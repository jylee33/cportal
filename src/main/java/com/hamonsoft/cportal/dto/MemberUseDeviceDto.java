package com.hamonsoft.cportal.dto;

import com.hamonsoft.cportal.utils.CommUtils;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.text.DecimalFormat;

/**
 * <b>사용자 등록 장비 정보 Vo</b>
 * <p>사용자 등록 장비 정보를 가져 오기 위한 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
@NoArgsConstructor
public class MemberUseDeviceDto implements Serializable {
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
    protected String decimalFormatter(String amount){
        if(CommUtils.isPresent(amount) && !amount.contains(",")){
            DecimalFormat decFormat = new DecimalFormat("###,###");
            amount = "" + decFormat.format(Long.parseLong(amount));
        }
        return amount;
    }
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
