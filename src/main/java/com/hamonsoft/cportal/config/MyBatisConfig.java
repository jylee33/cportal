package com.hamonsoft.cportal.config;

import com.hamonsoft.cportal.interceptor.AuthInterceptor;
import com.hamonsoft.cportal.interceptor.LoginInterceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.sql.DataSource;

@Configuration
@MapperScan(value = "com.hamonsoft.cportal", sqlSessionFactoryRef = "SqlSessionFactory")
public class MyBatisConfig extends WebMvcConfigurerAdapter {

    private static final Logger logger = LoggerFactory.getLogger(MyBatisConfig.class);

    @Value("${spring.datasource.mapper-locations}")
    String mPath;

    @Value("${server.servlet.context-path:/portal}")
    String cpath;

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

//    @Autowired
//    AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
//                .addPathPatterns("/**/*")
//                .addPathPatterns("/**/**/*")
                .addPathPatterns("/member/loginPost") // 해당 경로에 접근하기 전에 인터셉터가 가로챈다.
                .excludePathPatterns("/**/*.css")
                .excludePathPatterns("/**/**/*.css")
                .excludePathPatterns("/boards");    // 해당 경로는 인터셉터가 가로채지 않는다.

        logger.info("cpath -------------- " + cpath);

        registry.addInterceptor(authInterceptor())
//                .addPathPatterns("/**/*")
//                .addPathPatterns("/member/insertMember")
//                .addPathPatterns("/member/listAll");
                .addPathPatterns("/user/*")
                .addPathPatterns("/license/*")
                .addPathPatterns("/charge/*");
//                .excludePathPatterns("/user/login");
//                .excludePathPatterns("/member/insertMember");
    }

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }

    public static final String ALLOWED_METHOD_NAMES = "GET,HEAD,POST,PUT,DELETE,TRACE,OPTIONS,PATCH";

    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080", "https://localhost:8080", "http://localhost:9090", "https://localhost:9090", "http://cloud.hamonsoft.com", "https://cloud.hamonsoft.com")
                .allowedMethods(ALLOWED_METHOD_NAMES.split(","));
    }
}
