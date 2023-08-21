package com.hamonsoft.cportal.domain;

import lombok.*;
import org.apache.ibatis.annotations.Mapper;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.ZonedDateTime;
/**
 * <b>사용자라이센스등급 정보 Vo</b>
 * <p>사용 라이센스 정책을 가져 오기 위한 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
public class MemberLicense {
    private String email;
    private String licensegrade;
    private int datakeepterm;
    private String datakeepunit;
    private int basevolume;
    private int basecharge;
    private int servicevolume;
    private int addvolume;
    private int addcharge;
    private String stdate;
    private String eddate;
    private ZonedDateTime createdAt;
    private String updatedBy;
    private ZonedDateTime updatedAt;
//    private String getEmail() {
//        return email;
//    }
//    private void setEmail(String email) {
//        this.email = email;
//    }
//    private String getLicensegrade() {
//        return licensegrade;
//    }
//    private void setLicensegrade(String licensegrade) {
//        this.licensegrade = licensegrade;
//    }
//    private int getDatakeepterm() {
//        return datakeepterm;
//    }
//    private void setDatakeepterm(int datakeepterm) {
//        this.datakeepterm = datakeepterm;
//    }
//    private String getDatakeepunit() {
//        return datakeepunit;
//    }
//    private void setDatakeepunit(String datakeepunit) {
//        this.datakeepunit = datakeepunit;
//    }
//    private int getBasevolume() {
//        return basevolume;
//    }
//    private void setBasevolume(int basevolume) {
//        this.basevolume = basevolume;
//    }
//    private int getBasecharge() {
//        return basecharge;
//    }
//    private void setBasecharge(int basecharge) {
//        this.basecharge = basecharge;
//    }
//    private int getServicevolume() {
//        return servicevolume;
//    }
//    private void setServicevolume(int servicevolume) {
//        this.servicevolume = servicevolume;
//    }
//    private int getAddvolume() {
//        return addvolume;
//    }
//    private void setAddvolume(int addvolume) {
//        this.addvolume = addvolume;
//    }
//    private int getAddcharge() {
//        return addcharge;
//    }
//    private void setAddcharge(int addcharge) {
//        this.addcharge = addcharge;
//    }
//    private String getStdate() {
//        return stdate;
//    }
//    private void setStdate(String stdate) {
//        this.stdate = stdate;
//    }
//    private String getEddate() {
//        return eddate;
//    }
//    private void setEddate(String eddate) {
//        this.eddate = eddate;
//    }
//    private ZonedDateTime getCreatedAt() {
//        return createdAt;
//    }
//    private void setCreatedAt(ZonedDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//    private String getUpdatedBy() {
//        return updatedBy;
//    }
//    private void setUpdatedBy(String updatedBy) {
//        this.updatedBy = updatedBy;
//    }
//    private ZonedDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//    private void setUpdatedAt(ZonedDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//
//    private String scream;
//
//
//    @Override
//    public String toString() {
//        return "MemberLicenseVO [email=" + email + ", licensegrade=" + licensegrade + ", datakeepterm=" + datakeepterm
//                + ", datakeepunit=" + datakeepunit + ", basevolume=" + basevolume
//                + ", basecharge=" + basecharge + ", servicevolume=" + servicevolume
//                + ", addvolume=" + addvolume + ", addcharge=" + addcharge
//                + ", stdate=" + stdate + ", eddate=" + eddate
//                + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
//                + "]";
//    }
/*
    @Override
    public String toString() {
        String str = super.toString();
        return "MemberLicenseVO{" +
                "scream='" + scream + '\'' +
                '}'+str;
    }

    @OneToOne
    @JoinColumn(name = "email", referencedColumnName = "email", insertable = false, updatable = false)
    private Member member;
    public static MemberLicenseVO of (String email) {
        return MemberLicenseVO.builder()
                .email(member.getEmail())
                .removed(false)
                .build();
    }

 */
}
