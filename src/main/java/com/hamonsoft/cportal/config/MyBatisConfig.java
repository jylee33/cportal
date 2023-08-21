package com.hamonsoft.cportal.config;

import com.hamonsoft.cportal.interceptor.AuthInterceptor;
import com.hamonsoft.cportal.interceptor.LoginInterceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.sql.DataSource;

@Configuration
@MapperScan(value = "com.hamonsoft.cportal", sqlSessionFactoryRef = "SqlSessionFactory")
public class MyBatisConfig extends WebMvcConfigurerAdapter {

    @Value("${spring.datasource.mapper-locations}")
    String mPath;

    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource DataSource() {
        return DataSourceBuilder.create().build();
    }


    @Bean(name = "SqlSessionFactory")
    public SqlSessionFactory SqlSessionFactory(@Qualifier("dataSource") DataSource DataSource, ApplicationContext applicationContext) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(DataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage("com.hamonsoft.cportal.domain");    // 엔티티의 패키지 이름을 생략할 수 있도록 한다.
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources(mPath));
        return sqlSessionFactoryBean.getObject();
    }

    @Bean(name = "SessionTemplate")
    public SqlSessionTemplate SqlSessionTemplate(@Qualifier("SqlSessionFactory") SqlSessionFactory firstSqlSessionFactory) {
        return new SqlSessionTemplate(firstSqlSessionFactory);
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setDefaultEncoding("UTF-8"); // 파일 인코딩 설정
        multipartResolver.setMaxUploadSizePerFile(5 * 1024 * 1024); // 파일당 업로드 크기 제한 (5MB)
        return multipartResolver;
    }

    @Autowired
    LoginInterceptor loginInterceptor;

    @Autowired
    AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
//                .addPathPatterns("/**/*")
//                .addPathPatterns("/**/**/*")
                .addPathPatterns("/user/loginPost") // 해당 경로에 접근하기 전에 인터셉터가 가로챈다.
                .excludePathPatterns("/**/*.css")
                .excludePathPatterns("/**/**/*.css")
                .excludePathPatterns("/boards");    // 해당 경로는 인터셉터가 가로채지 않는다.

        registry.addInterceptor(authInterceptor)
//                .addPathPatterns("/**/*")
                .addPathPatterns("/member/insertMember")
                .addPathPatterns("/member/listAll");
//                .excludePathPatterns("/user/login");
//                .excludePathPatterns("/member/insertMember");
    }

}
