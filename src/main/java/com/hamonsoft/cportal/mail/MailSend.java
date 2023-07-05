package com.hamonsoft.cportal.mail;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

public class MailSend {
    public void MailSend() {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "dxoxmoxptbanvhvg";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "이종엽"));
            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("테스트 메일", "UTF-8");
            msg.setText("안녕하세요 테스트 메일입니다.", "UTF-8");

            Transport.send(msg);

        } catch(AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch(MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch(UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }
}
