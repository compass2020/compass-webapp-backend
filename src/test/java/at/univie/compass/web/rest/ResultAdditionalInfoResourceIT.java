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
import at.univie.compass.domain.ResultAdditionalInfo;
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.repository.ResultAdditionalInfoRepository;
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
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ResultAdditionalInfoResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResultAdditionalInfoResourceIT {

    private static final byte[] DEFAULT_GPX_TRACK = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_GPX_TRACK = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_GPX_TRACK_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_GPX_TRACK_CONTENT_TYPE = "image/png";

    private static final byte[] GPX_TRACK_XML = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    private static final String GPX_TRACK_CONTENT_TYPE_XML = "application/xml";
    private static final byte[] HEART_RATE_XML = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    private static final String HEART_RATE_CONTENT_TYPE_XML = "application/xml";
    
    
    private static final byte[] DEFAULT_HEART_RATE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_HEART_RATE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_HEART_RATE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_HEART_RATE_CONTENT_TYPE = "image/png";

    @Autowired
    private ResultAdditionalInfoRepository resultAdditionalInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultAdditionalInfoMockMvc;

    private ResultAdditionalInfo resultAdditionalInfo;

    private ResultAdditionalInfo resultAdditionalInfoXml;

    
    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultAdditionalInfo createEntity(EntityManager em) {
        ResultAdditionalInfo resultAdditionalInfo = new ResultAdditionalInfo()
            .gpxTrack(DEFAULT_GPX_TRACK)
            .gpxTrackContentType(DEFAULT_GPX_TRACK_CONTENT_TYPE)
            .heartRate(DEFAULT_HEART_RATE)
            .heartRateContentType(DEFAULT_HEART_RATE_CONTENT_TYPE);
        // Add required entity
        ResultCourse resultCourse;
        if (TestUtil.findAll(em, ResultCourse.class).isEmpty()) {
            resultCourse = ResultCourseResourceIT.createEntity(em);
            em.persist(resultCourse);
            em.flush();
        } else {
            resultCourse = TestUtil.findAll(em, ResultCourse.class).get(0);
        }
        resultAdditionalInfo.setResultCourse(resultCourse);
        return resultAdditionalInfo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultAdditionalInfo createUpdatedEntity(EntityManager em) {
        ResultAdditionalInfo resultAdditionalInfo = new ResultAdditionalInfo()
            .gpxTrack(UPDATED_GPX_TRACK)
            .gpxTrackContentType(UPDATED_GPX_TRACK_CONTENT_TYPE)
            .heartRate(UPDATED_HEART_RATE)
            .heartRateContentType(UPDATED_HEART_RATE_CONTENT_TYPE);
        // Add required entity
        ResultCourse resultCourse;
        if (TestUtil.findAll(em, ResultCourse.class).isEmpty()) {
            resultCourse = ResultCourseResourceIT.createUpdatedEntity(em);
            em.persist(resultCourse);
            em.flush();
        } else {
            resultCourse = TestUtil.findAll(em, ResultCourse.class).get(0);
        }
        resultAdditionalInfo.setResultCourse(resultCourse);
        return resultAdditionalInfo;
    }
    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultAdditionalInfo createEntityXml(EntityManager em) {
        ResultAdditionalInfo resultAdditionalInfoXml = new ResultAdditionalInfo()
            .gpxTrack(GPX_TRACK_XML)
            .gpxTrackContentType(GPX_TRACK_CONTENT_TYPE_XML)
            .heartRate(DEFAULT_HEART_RATE)
            .heartRateContentType(HEART_RATE_CONTENT_TYPE_XML);
        // Add required entity
        ResultCourse resultCourse;
        if (TestUtil.findAll(em, ResultCourse.class).isEmpty()) {
            resultCourse = ResultCourseResourceIT.createEntity(em);
            em.persist(resultCourse);
            em.flush();
        } else {
            resultCourse = TestUtil.findAll(em, ResultCourse.class).get(0);
        }
        resultAdditionalInfoXml.setResultCourse(resultCourse);
        return resultAdditionalInfoXml;
    }

    
    public static ResultAdditionalInfo createEntity() {
        ResultAdditionalInfo resultAdditionalInfo = new ResultAdditionalInfo()
            .gpxTrack(DEFAULT_GPX_TRACK)
            .gpxTrackContentType(DEFAULT_GPX_TRACK_CONTENT_TYPE);
        return resultAdditionalInfo;
    }

    @BeforeEach
    public void initTest() {
        resultAdditionalInfo = createEntity(em);
        resultAdditionalInfoXml = createEntityXml(em);
    }

    @Test
    @Transactional
    public void createResultAdditionalInfo() throws Exception {
        int databaseSizeBeforeCreate = resultAdditionalInfoRepository.findAll().size();
        // Create the ResultAdditionalInfo
        restResultAdditionalInfoMockMvc.perform(post("/api/result-additional-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAdditionalInfo)))
            .andExpect(status().isCreated());

        // Validate the ResultAdditionalInfo in the database
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeCreate + 1);
        ResultAdditionalInfo testResultAdditionalInfo = resultAdditionalInfoList.get(resultAdditionalInfoList.size() - 1);
        assertThat(testResultAdditionalInfo.getGpxTrack()).isEqualTo(DEFAULT_GPX_TRACK);
        assertThat(testResultAdditionalInfo.getGpxTrackContentType()).isEqualTo(DEFAULT_GPX_TRACK_CONTENT_TYPE);
        assertThat(testResultAdditionalInfo.getHeartRate()).isEqualTo(DEFAULT_HEART_RATE);
        assertThat(testResultAdditionalInfo.getHeartRateContentType()).isEqualTo(DEFAULT_HEART_RATE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createResultAdditionalInfoXml() throws Exception {
        int databaseSizeBeforeCreate = resultAdditionalInfoRepository.findAll().size();
        // Create the ResultAdditionalInfo
        restResultAdditionalInfoMockMvc.perform(post("/api/result-additional-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAdditionalInfoXml)))
            .andExpect(status().isCreated());

        // Validate the ResultAdditionalInfo in the database
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeCreate + 1);
        ResultAdditionalInfo testResultAdditionalInfo = resultAdditionalInfoList.get(resultAdditionalInfoList.size() - 1);
        assertThat(testResultAdditionalInfo.getGpxTrack()).isNotEqualTo(GPX_TRACK_XML);
        assertThat(testResultAdditionalInfo.getGpxTrackContentType()).isEqualTo("application/zip");
        assertThat(testResultAdditionalInfo.getHeartRate()).isNotEqualTo(HEART_RATE_XML);
        assertThat(testResultAdditionalInfo.getHeartRateContentType()).isEqualTo("application/zip");
    }

    @Test
    @Transactional
    public void createResultAdditionalInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resultAdditionalInfoRepository.findAll().size();

        // Create the ResultAdditionalInfo with an existing ID
        resultAdditionalInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultAdditionalInfoMockMvc.perform(post("/api/result-additional-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAdditionalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the ResultAdditionalInfo in the database
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllResultAdditionalInfos() throws Exception {
        // Initialize the database
        resultAdditionalInfoRepository.saveAndFlush(resultAdditionalInfo);

        // Get all the resultAdditionalInfoList
        restResultAdditionalInfoMockMvc.perform(get("/api/result-additional-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultAdditionalInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].gpxTrackContentType").value(hasItem(DEFAULT_GPX_TRACK_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].gpxTrack").value(hasItem(Base64Utils.encodeToString(DEFAULT_GPX_TRACK))))
            .andExpect(jsonPath("$.[*].heartRateContentType").value(hasItem(DEFAULT_HEART_RATE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].heartRate").value(hasItem(Base64Utils.encodeToString(DEFAULT_HEART_RATE))));
    }
    
    @Test
    @Transactional
    public void getResultAdditionalInfo() throws Exception {
        // Initialize the database
        resultAdditionalInfoRepository.saveAndFlush(resultAdditionalInfo);

        // Get the resultAdditionalInfo
        restResultAdditionalInfoMockMvc.perform(get("/api/result-additional-infos/{id}", resultAdditionalInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultAdditionalInfo.getId().intValue()))
            .andExpect(jsonPath("$.gpxTrackContentType").value(DEFAULT_GPX_TRACK_CONTENT_TYPE))
            .andExpect(jsonPath("$.gpxTrack").value(Base64Utils.encodeToString(DEFAULT_GPX_TRACK)))
            .andExpect(jsonPath("$.heartRateContentType").value(DEFAULT_HEART_RATE_CONTENT_TYPE))
            .andExpect(jsonPath("$.heartRate").value(Base64Utils.encodeToString(DEFAULT_HEART_RATE)));
    }
    @Test
    @Transactional
    public void getNonExistingResultAdditionalInfo() throws Exception {
        // Get the resultAdditionalInfo
        restResultAdditionalInfoMockMvc.perform(get("/api/result-additional-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResultAdditionalInfo() throws Exception {
        // Initialize the database
        resultAdditionalInfoRepository.saveAndFlush(resultAdditionalInfo);

        int databaseSizeBeforeUpdate = resultAdditionalInfoRepository.findAll().size();

        // Update the resultAdditionalInfo
        ResultAdditionalInfo updatedResultAdditionalInfo = resultAdditionalInfoRepository.findById(resultAdditionalInfo.getId()).get();
        // Disconnect from session so that the updates on updatedResultAdditionalInfo are not directly saved in db
        em.detach(updatedResultAdditionalInfo);
        updatedResultAdditionalInfo
            .gpxTrack(UPDATED_GPX_TRACK)
            .gpxTrackContentType(UPDATED_GPX_TRACK_CONTENT_TYPE)
            .heartRate(UPDATED_HEART_RATE)
            .heartRateContentType(UPDATED_HEART_RATE_CONTENT_TYPE);

        restResultAdditionalInfoMockMvc.perform(put("/api/result-additional-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedResultAdditionalInfo)))
            .andExpect(status().isOk());

        // Validate the ResultAdditionalInfo in the database
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeUpdate);
        ResultAdditionalInfo testResultAdditionalInfo = resultAdditionalInfoList.get(resultAdditionalInfoList.size() - 1);
        assertThat(testResultAdditionalInfo.getGpxTrack()).isEqualTo(UPDATED_GPX_TRACK);
        assertThat(testResultAdditionalInfo.getGpxTrackContentType()).isEqualTo(UPDATED_GPX_TRACK_CONTENT_TYPE);
        assertThat(testResultAdditionalInfo.getHeartRate()).isEqualTo(UPDATED_HEART_RATE);
        assertThat(testResultAdditionalInfo.getHeartRateContentType()).isEqualTo(UPDATED_HEART_RATE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingResultAdditionalInfo() throws Exception {
        int databaseSizeBeforeUpdate = resultAdditionalInfoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultAdditionalInfoMockMvc.perform(put("/api/result-additional-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAdditionalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the ResultAdditionalInfo in the database
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResultAdditionalInfo() throws Exception {
        // Initialize the database
        resultAdditionalInfoRepository.saveAndFlush(resultAdditionalInfo);

        int databaseSizeBeforeDelete = resultAdditionalInfoRepository.findAll().size();

        // Delete the resultAdditionalInfo
        restResultAdditionalInfoMockMvc.perform(delete("/api/result-additional-infos/{id}", resultAdditionalInfo.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResultAdditionalInfo> resultAdditionalInfoList = resultAdditionalInfoRepository.findAll();
        assertThat(resultAdditionalInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
