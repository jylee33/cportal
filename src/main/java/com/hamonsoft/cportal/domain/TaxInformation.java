package com.hamonsoft.cportal.domain;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@Getter
@Setter
public class TaxInformation {
    private String taxid;
    private String email;
    private String Representationname;
    private String taxcompanynumber;
    private String taxemail;
    private String postnumber;
    private String address;
    private String detailaddress;
    private String businesscondition;
    private String businesskind;
    private String settlementmeans;
    private int baseamount;
    private int createdAt;
    private String updatedBy;
    private int updatedAt;
    private String getTaxid() {
        return taxid;
    }
    private void setTaxid(String taxid) {
        this.taxid = taxid;
    }
    private String getEmail() {
        return email;
    }
    private void setEmail(String email) {
        this.email = email;
    }
    private String getRepresentationname() {
        return Representationname;
    }
    private void setRepresentationname(String Representationname) {
        this.Representationname = Representationname;
    }
    private String getTaxcompanynumber() {
        return taxcompanynumber;
    }
    private void setTaxcompanynumber(String taxcompanynumber) {
        this.taxcompanynumber = taxcompanynumber;
    }
    private String getTaxemail() {
        return taxemail;
    }
    private void setTaxemail(String taxemail) {
        this.taxemail = taxemail;
    }
    private String getPostnumber() {
        return postnumber;
    }
    private void setPostnumber(String postnumber) {
        this.postnumber = postnumber;
    }
    private String getAddress() {
        return address;
    }
    private void setAddress(String address) {
        this.address = address;
    }
    private String getDetailaddress() {
        return detailaddress;
    }
    private void setDetailaddress(String detailaddress) {
        this.detailaddress = detailaddress;
    }
    private String getBusinesscondition() {
        return businesscondition;
    }
    private void setBusinesscondition(String businesscondition) {
        this.businesscondition = businesscondition;
    }
    private String getBusinesskind() {
        return businesskind;
    }
    private void setBusinesskind(String businesskind) {
        this.businesskind = businesskind;
    }
    private String getSettlementmeans() {
        return settlementmeans;
    }
    private void setSettlementmeans(String settlementmeans) {
        this.settlementmeans = settlementmeans;
    }
    private int getBaseamount() {
        return baseamount;
    }
    private void setBaseamount(int baseamount) {
        this.baseamount = baseamount;
    }
    private int getCreatedAt() {
        return createdAt;
    }
    private void setCreatedAt(int createdAt) {
        this.createdAt = createdAt;
    }
    private String getUpdatedBy() {
        return updatedBy;
    }
    private void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    private int getUpdatedAt() {
        return updatedAt;
    }
    private void setUpdatedAt(int updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "TaxInformationVO [taxid=" + taxid + ",email=" + email + ", Representationname=" + Representationname + ", taxcompanynumber=" + taxcompanynumber
                + ", taxemail=" + taxemail + ", postnumber=" + postnumber
                + ", address=" + address + ", detailaddress=" + detailaddress
                + ", businesscondition=" + businesscondition + ", businesskind=" + businesskind
                + ", settlementmeans=" + settlementmeans + ", baseamount=" + baseamount
                + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
                + "]";

    }
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
