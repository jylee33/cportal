package com.hamonsoft.cportal.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;
/**
 * <b>비밀번호 변경이력 Vo</b>
 * <p>사용자 비밀번호 변경이력 VO </p>
 *
 * @author hs.park
 * @since 2023/08/18
 */
@Data
public class MemberPassword {
    @JsonIgnore
    private static final long serialVersionUID = 1L;
    /**
     * 유저 비밀번호 히스토리 ID
     */
    private UUID passwordid;
    private String email;
    private Member member;
    private String salt;

    private String password;

    private String useyn;

    private ZonedDateTime createdAt;
//
//    @Builder
//    public MemberPassword(String password, ZonedDateTime createdAt,
//                          Member member) {
//        this.password = password;
//        this.createdAt = createdAt;
//        this.member = member;
//    }
}
