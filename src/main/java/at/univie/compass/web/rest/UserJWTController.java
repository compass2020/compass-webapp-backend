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
package at.univie.compass.web.rest;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonProperty;

import at.univie.compass.config.Constants;
import at.univie.compass.security.jwt.JWTFilter;
import at.univie.compass.security.jwt.TokenProvider;
import at.univie.compass.util.AppVersionChecker;
import at.univie.compass.web.rest.errors.LoginUpdateRequiredException;
import at.univie.compass.web.rest.vm.LoginVM;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    public static final String HEADER_LOGIN_UPDATE_RECOMMENDED = "LOGIN_UPDATE_RECOMMENDED";

    private final Logger log = LoggerFactory.getLogger(UserJWTController.class);
    
    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    
    @Autowired
    private ApplicationContext appContext;

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        
        log.trace("REST request to authorize : {}", loginVM);

        // check version number
        if (StringUtils.equalsIgnoreCase(Constants.ANDROID_USER, loginVM.getUsername())) {
            Boolean updateRequired = Boolean
                    .valueOf(appContext.getEnvironment().getProperty("compass.android.updateRequired", "false"));
            Integer minVersion = Integer
                    .valueOf(appContext.getEnvironment().getProperty("compass.android.minVersion", "1"));

            int appVersion = AppVersionChecker.getVersionNumber(loginVM.getAppVersion());
            
            if (updateRequired && appVersion < minVersion) {
                log.error("login failed for user {} appVersion={} but required minVersion={}", loginVM.getUsername(),
                        appVersion, minVersion);
                throw new LoginUpdateRequiredException(minVersion);
            }
        }
        
        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername(), loginVM.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
        String jwt = tokenProvider.createToken(authentication, rememberMe);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        
        // add update information
        if (StringUtils.equalsIgnoreCase(Constants.ANDROID_USER, loginVM.getUsername())) {
            Integer minVersion = Integer
                    .valueOf(appContext.getEnvironment().getProperty("compass.android.minVersion", "1"));
            int appVersion = AppVersionChecker.getVersionNumber(loginVM.getAppVersion());

            if (appVersion < minVersion) {
                httpHeaders.add(HEADER_LOGIN_UPDATE_RECOMMENDED, ""+minVersion);
            }
        }
        
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }
    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
