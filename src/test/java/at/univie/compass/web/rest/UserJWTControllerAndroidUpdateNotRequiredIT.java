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

import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import at.univie.compass.CompassApp;
import at.univie.compass.domain.User;
import at.univie.compass.repository.UserRepository;
import at.univie.compass.web.rest.vm.LoginVM;

/**
 * Integration tests for the {@link UserJWTController} REST controller with user android.
 */
@AutoConfigureMockMvc
@SpringBootTest(classes = CompassApp.class,
                properties = {
                        "compass.android.minVersion=5",
                        "compass.android.updateRequired=false"})
public class UserJWTControllerAndroidUpdateNotRequiredIT {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Transactional
    public void testAuthorizeAndroidUpdateRecommended() throws Exception {
        
        User android = userRepository.findOneByLogin("android").get();
        android.setPassword(passwordEncoder.encode("test"));
        userRepository.saveAndFlush(android);

        LoginVM login = new LoginVM();
        login.setUsername("android");
        login.setPassword("test");
        login.setAppVersion("0.1.4(4)");
        mockMvc.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty())
            .andExpect(header().string("Authorization", not(nullValue())))
            .andExpect(header().string("Authorization", not(is(emptyString()))))
            .andExpect(header().string(UserJWTController.HEADER_LOGIN_UPDATE_RECOMMENDED, not(nullValue())))
            .andExpect(header().string(UserJWTController.HEADER_LOGIN_UPDATE_RECOMMENDED, not(is(emptyString()))));
    }

    @Test
    @Transactional
    public void testAuthorizeAndroidUpdateNotRecommended() throws Exception {
        
        User android = userRepository.findOneByLogin("android").get();
        android.setPassword(passwordEncoder.encode("test"));
        userRepository.saveAndFlush(android);

        LoginVM login = new LoginVM();
        login.setUsername("android");
        login.setPassword("test");
        login.setAppVersion("0.1.4(5)");
        mockMvc.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty())
            .andExpect(header().string("Authorization", not(nullValue())))
            .andExpect(header().string("Authorization", not(is(emptyString()))))
            .andExpect(header().doesNotExist(UserJWTController.HEADER_LOGIN_UPDATE_RECOMMENDED));
    }
}
