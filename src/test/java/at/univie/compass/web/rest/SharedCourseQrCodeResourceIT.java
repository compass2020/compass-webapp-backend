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

import at.univie.compass.CompassApp;
import at.univie.compass.domain.SharedCourseQrCode;
import at.univie.compass.domain.SharedCourse;
import at.univie.compass.repository.SharedCourseQrCodeRepository;
import at.univie.compass.security.AuthoritiesConstants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static at.univie.compass.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link SharedCourseQrCodeResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SharedCourseQrCodeResourceIT {

    private static final String DEFAULT_DEVICE = "AAAAAAAAAA";
    private static final String UPDATED_DEVICE = "BBBBBBBBBB";

    private static final String DEFAULT_QR_CODE = "XXXXX";
    private static final String UPDATED_QR_CODE = "YYYYY";

    private static final Boolean DEFAULT_SCANNED = false;
    private static final Boolean UPDATED_SCANNED = true;

    private static final ZonedDateTime DEFAULT_TIME_STAMP_SCANNED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_STAMP_SCANNED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private SharedCourseQrCodeRepository sharedCourseQrCodeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSharedCourseQrCodeMockMvc;

    private SharedCourseQrCode sharedCourseQrCode;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SharedCourseQrCode createEntity(EntityManager em) {
        SharedCourseQrCode sharedCourseQrCode = new SharedCourseQrCode()
            .device(DEFAULT_DEVICE)
            .qrCode(DEFAULT_QR_CODE)
            .scanned(DEFAULT_SCANNED)
            .timeStampScanned(DEFAULT_TIME_STAMP_SCANNED);
        // Add required entity
        SharedCourse sharedCourse;
        if (TestUtil.findAll(em, SharedCourse.class).isEmpty()) {
            sharedCourse = SharedCourseResourceIT.createEntity(em);
            em.persist(sharedCourse);
            em.flush();
        } else {
            sharedCourse = TestUtil.findAll(em, SharedCourse.class).get(0);
        }
        sharedCourseQrCode.setSharedCourse(sharedCourse);
        return sharedCourseQrCode;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SharedCourseQrCode createUpdatedEntity(EntityManager em) {
        SharedCourseQrCode sharedCourseQrCode = new SharedCourseQrCode()
            .device(UPDATED_DEVICE)
            .qrCode(UPDATED_QR_CODE)
            .scanned(UPDATED_SCANNED)
            .timeStampScanned(UPDATED_TIME_STAMP_SCANNED);
        // Add required entity
        SharedCourse sharedCourse;
        if (TestUtil.findAll(em, SharedCourse.class).isEmpty()) {
            sharedCourse = SharedCourseResourceIT.createUpdatedEntity(em);
            em.persist(sharedCourse);
            em.flush();
        } else {
            sharedCourse = TestUtil.findAll(em, SharedCourse.class).get(0);
        }
        sharedCourseQrCode.setSharedCourse(sharedCourse);
        return sharedCourseQrCode;
    }

    @BeforeEach
    public void initTest() {
        sharedCourseQrCode = createEntity(em);
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void createSharedCourseQrCode() throws Exception {
        int databaseSizeBeforeCreate = sharedCourseQrCodeRepository.findAll().size();
        // Create the SharedCourseQrCode
        restSharedCourseQrCodeMockMvc.perform(post("/api/shared-course-qr-codes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourseQrCode)))
            .andExpect(status().isCreated());

        // Validate the SharedCourseQrCode in the database
        List<SharedCourseQrCode> sharedCourseQrCodeList = sharedCourseQrCodeRepository.findAll();
        assertThat(sharedCourseQrCodeList).hasSize(databaseSizeBeforeCreate + 1);
        SharedCourseQrCode testSharedCourseQrCode = sharedCourseQrCodeList.get(sharedCourseQrCodeList.size() - 1);
        assertThat(testSharedCourseQrCode.getDevice()).isEqualTo(DEFAULT_DEVICE);
        assertThat(testSharedCourseQrCode.getQrCode()).isEqualTo(DEFAULT_QR_CODE);
        assertThat(testSharedCourseQrCode.isScanned()).isEqualTo(DEFAULT_SCANNED);
        assertThat(testSharedCourseQrCode.getTimeStampScanned()).isEqualTo(DEFAULT_TIME_STAMP_SCANNED);
    }

    @Test
    @Transactional
    public void createSharedCourseQrCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sharedCourseQrCodeRepository.findAll().size();

        // Create the SharedCourseQrCode with an existing ID
        sharedCourseQrCode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSharedCourseQrCodeMockMvc.perform(post("/api/shared-course-qr-codes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourseQrCode)))
            .andExpect(status().isBadRequest());

        // Validate the SharedCourseQrCode in the database
        List<SharedCourseQrCode> sharedCourseQrCodeList = sharedCourseQrCodeRepository.findAll();
        assertThat(sharedCourseQrCodeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllSharedCourseQrCodes() throws Exception {
        // Initialize the database
        sharedCourseQrCodeRepository.saveAndFlush(sharedCourseQrCode);

        // Get all the sharedCourseQrCodeList
        restSharedCourseQrCodeMockMvc.perform(get("/api/shared-course-qr-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sharedCourseQrCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].device").value(hasItem(DEFAULT_DEVICE)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(DEFAULT_QR_CODE)))
            .andExpect(jsonPath("$.[*].scanned").value(hasItem(DEFAULT_SCANNED.booleanValue())))
            .andExpect(jsonPath("$.[*].timeStampScanned").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_SCANNED))));
    }
    
    @Test
    @Transactional
    public void getSharedCourseQrCode() throws Exception {
        // Initialize the database
        sharedCourseQrCodeRepository.saveAndFlush(sharedCourseQrCode);

        // Get the sharedCourseQrCode
        restSharedCourseQrCodeMockMvc.perform(get("/api/shared-course-qr-codes/{id}", sharedCourseQrCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sharedCourseQrCode.getId().intValue()))
            .andExpect(jsonPath("$.device").value(DEFAULT_DEVICE))
            .andExpect(jsonPath("$.qrCode").value(DEFAULT_QR_CODE))
            .andExpect(jsonPath("$.scanned").value(DEFAULT_SCANNED.booleanValue()))
            .andExpect(jsonPath("$.timeStampScanned").value(sameInstant(DEFAULT_TIME_STAMP_SCANNED)));
    }
    @Test
    @Transactional
    public void getNonExistingSharedCourseQrCode() throws Exception {
        // Get the sharedCourseQrCode
        restSharedCourseQrCodeMockMvc.perform(get("/api/shared-course-qr-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void updateSharedCourseQrCode() throws Exception {
        // Initialize the database
        sharedCourseQrCodeRepository.saveAndFlush(sharedCourseQrCode);

        int databaseSizeBeforeUpdate = sharedCourseQrCodeRepository.findAll().size();

        // Update the sharedCourseQrCode
        SharedCourseQrCode updatedSharedCourseQrCode = sharedCourseQrCodeRepository.findById(sharedCourseQrCode.getId()).get();
        // Disconnect from session so that the updates on updatedSharedCourseQrCode are not directly saved in db
        em.detach(updatedSharedCourseQrCode);
        updatedSharedCourseQrCode
            .device(UPDATED_DEVICE)
            .qrCode(UPDATED_QR_CODE)
            .scanned(UPDATED_SCANNED)
            .timeStampScanned(UPDATED_TIME_STAMP_SCANNED);

        restSharedCourseQrCodeMockMvc.perform(put("/api/shared-course-qr-codes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSharedCourseQrCode)))
            .andExpect(status().isOk());

        // Validate the SharedCourseQrCode in the database
        List<SharedCourseQrCode> sharedCourseQrCodeList = sharedCourseQrCodeRepository.findAll();
        assertThat(sharedCourseQrCodeList).hasSize(databaseSizeBeforeUpdate);
        SharedCourseQrCode testSharedCourseQrCode = sharedCourseQrCodeList.get(sharedCourseQrCodeList.size() - 1);
        assertThat(testSharedCourseQrCode.getDevice()).isEqualTo(UPDATED_DEVICE);
        assertThat(testSharedCourseQrCode.getQrCode()).isEqualTo(UPDATED_QR_CODE);
        assertThat(testSharedCourseQrCode.isScanned()).isEqualTo(UPDATED_SCANNED);
        assertThat(testSharedCourseQrCode.getTimeStampScanned()).isEqualTo(UPDATED_TIME_STAMP_SCANNED);
    }

    @Test
    @Transactional
    public void updateNonExistingSharedCourseQrCode() throws Exception {
        int databaseSizeBeforeUpdate = sharedCourseQrCodeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSharedCourseQrCodeMockMvc.perform(put("/api/shared-course-qr-codes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourseQrCode)))
            .andExpect(status().isBadRequest());

        // Validate the SharedCourseQrCode in the database
        List<SharedCourseQrCode> sharedCourseQrCodeList = sharedCourseQrCodeRepository.findAll();
        assertThat(sharedCourseQrCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSharedCourseQrCode() throws Exception {
        // Initialize the database
        sharedCourseQrCodeRepository.saveAndFlush(sharedCourseQrCode);

        int databaseSizeBeforeDelete = sharedCourseQrCodeRepository.findAll().size();

        // Delete the sharedCourseQrCode
        restSharedCourseQrCodeMockMvc.perform(delete("/api/shared-course-qr-codes/{id}", sharedCourseQrCode.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SharedCourseQrCode> sharedCourseQrCodeList = sharedCourseQrCodeRepository.findAll();
        assertThat(sharedCourseQrCodeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
