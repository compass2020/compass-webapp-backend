/*-
 * #%L
 * COMPASS orienteering game
 * %%
 * Copyright (C) 2021 University of Vienna
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package at.univie.compass.config;

import com.github.benmanes.caffeine.jcache.configuration.CaffeineConfiguration;
import java.util.OptionalLong;
import java.util.concurrent.TimeUnit;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import io.github.jhipster.config.cache.PrefixedKeyGenerator;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {
    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Caffeine caffeine = jHipsterProperties.getCache().getCaffeine();

        CaffeineConfiguration<Object, Object> caffeineConfiguration = new CaffeineConfiguration<>();
        caffeineConfiguration.setMaximumSize(OptionalLong.of(caffeine.getMaxEntries()));
        caffeineConfiguration.setExpireAfterWrite(OptionalLong.of(TimeUnit.SECONDS.toNanos(caffeine.getTimeToLiveSeconds())));
        caffeineConfiguration.setStatisticsEnabled(true);
        jcacheConfiguration = caffeineConfiguration;
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, at.univie.compass.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, at.univie.compass.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, at.univie.compass.domain.User.class.getName());
            createCache(cm, at.univie.compass.domain.Authority.class.getName());
            createCache(cm, at.univie.compass.domain.User.class.getName() + ".authorities");
//            createCache(cm, at.univie.compass.domain.Course.class.getName());
//            createCache(cm, at.univie.compass.domain.Course.class.getName() + ".controlpoints");
//            createCache(cm, at.univie.compass.domain.Course.class.getName() + ".sharedCourses");
//            createCache(cm, at.univie.compass.domain.Controlpoint.class.getName());
//            createCache(cm, at.univie.compass.domain.Controlpoint.class.getName() + ".questions");
//            createCache(cm, at.univie.compass.domain.Question.class.getName());
//            createCache(cm, at.univie.compass.domain.Question.class.getName() + ".answers");
//            createCache(cm, at.univie.compass.domain.Question.class.getName() + ".controlpoints");
//            createCache(cm, at.univie.compass.domain.Category.class.getName());
//            createCache(cm, at.univie.compass.domain.Category.class.getName() + ".questions");
//            createCache(cm, at.univie.compass.domain.Answer.class.getName());
//            createCache(cm, at.univie.compass.domain.OrienteeringMap.class.getName());
//            createCache(cm, at.univie.compass.domain.SharedCourse.class.getName());
//            createCache(cm, at.univie.compass.domain.SharedCourse.class.getName() + ".resultCourses");
//            createCache(cm, at.univie.compass.domain.SharedCourse.class.getName() + ".sharedCourseQrCodes");
//            createCache(cm, at.univie.compass.domain.SharedCourseQrCode.class.getName());
//            createCache(cm, at.univie.compass.domain.ResultCourse.class.getName());
//            createCache(cm, at.univie.compass.domain.ResultCourse.class.getName() + ".resultControlpoints");
//            createCache(cm, at.univie.compass.domain.ResultControlpoint.class.getName());
//            createCache(cm, at.univie.compass.domain.ResultAdditionalInfo.class.getName());
//            createCache(cm, at.univie.compass.domain.ResultControlpoint.class.getName() + ".resultQuestions");
//            createCache(cm, at.univie.compass.domain.Category.class.getName() + ".resultQuestions");
//            createCache(cm, at.univie.compass.domain.ResultQuestion.class.getName());
//            createCache(cm, at.univie.compass.domain.ResultQuestion.class.getName() + ".resultAnswers");
//            createCache(cm, at.univie.compass.domain.ResultQuestion.class.getName() + ".resultControlpoints");
//            createCache(cm, at.univie.compass.domain.ResultAnswer.class.getName());
//            createCache(cm, at.univie.compass.domain.Controlpoint.class.getName() + ".controlpointInfos");
//            createCache(cm, at.univie.compass.domain.ControlpointInfo.class.getName());
//            createCache(cm, at.univie.compass.domain.ControlpointInfo.class.getName() + ".controlpoints");
            // jhipster-needle-caffeine-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
