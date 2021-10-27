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
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.domain.SharedCourse;
import at.univie.compass.repository.ResultCourseRepository;
import at.univie.compass.security.AuthoritiesConstants;

import org.junit.jupiter.api.BeforeEach;
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
 * Integration tests for the {@link ResultCourseResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResultCourseResourceIT {

    private static final String DEFAULT_NICK_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NICK_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_STAMP_FINISHED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_STAMP_FINISHED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIME_STAMP_STARTED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_STAMP_STARTED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_TOTAL_DURATION_IN_MILLIS = 1L;
    private static final Long UPDATED_TOTAL_DURATION_IN_MILLIS = 2L;

    private static final String DEFAULT_VIEW_CODE = "abcd1";
    private static final String UPDATED_VIEW_CODE = "abcd2";

    private static final Integer DEFAULT_SHOW_POSITION_COUNTER = 1;
    private static final Integer UPDATED_SHOW_POSITION_COUNTER = 2;

    private static final Integer DEFAULT_SWITCH_APP_COUNTER = 1;
    private static final Integer UPDATED_SWITCH_APP_COUNTER = 2;

    @Autowired
    private ResultCourseRepository resultCourseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultCourseMockMvc;

    private ResultCourse resultCourse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultCourse createEntity(EntityManager em) {
        ResultCourse resultCourse = new ResultCourse()
            .nickName(DEFAULT_NICK_NAME)
            .timeStampFinished(DEFAULT_TIME_STAMP_FINISHED)
            .timeStampStarted(DEFAULT_TIME_STAMP_STARTED)
            .totalDurationInMillis(DEFAULT_TOTAL_DURATION_IN_MILLIS)
            .viewCode(DEFAULT_VIEW_CODE)
            .showPositionCounter(DEFAULT_SHOW_POSITION_COUNTER)
            .switchAppCounter(DEFAULT_SWITCH_APP_COUNTER);
        // Add required entity
        SharedCourse sharedCourse;
        if (TestUtil.findAll(em, SharedCourse.class).isEmpty()) {
            sharedCourse = SharedCourseResourceIT.createEntity(em);
            em.persist(sharedCourse);
            em.flush();
        } else {
            sharedCourse = TestUtil.findAll(em, SharedCourse.class).get(0);
        }
        resultCourse.setSharedCourse(sharedCourse);
        return resultCourse;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultCourse createUpdatedEntity(EntityManager em) {
        ResultCourse resultCourse = new ResultCourse()
            .nickName(UPDATED_NICK_NAME)
            .timeStampFinished(UPDATED_TIME_STAMP_FINISHED)
            .timeStampStarted(UPDATED_TIME_STAMP_STARTED)
            .totalDurationInMillis(UPDATED_TOTAL_DURATION_IN_MILLIS)
            .viewCode(UPDATED_VIEW_CODE)
            .showPositionCounter(UPDATED_SHOW_POSITION_COUNTER)
            .switchAppCounter(UPDATED_SWITCH_APP_COUNTER);
        // Add required entity
        SharedCourse sharedCourse;
        if (TestUtil.findAll(em, SharedCourse.class).isEmpty()) {
            sharedCourse = SharedCourseResourceIT.createUpdatedEntity(em);
            em.persist(sharedCourse);
            em.flush();
        } else {
            sharedCourse = TestUtil.findAll(em, SharedCourse.class).get(0);
        }
        resultCourse.setSharedCourse(sharedCourse);
        return resultCourse;
    }

    @BeforeEach
    public void initTest() {
        resultCourse = createEntity(em);
    }

    @Test
    @Transactional
    public void createResultCourse() throws Exception {
        int databaseSizeBeforeCreate = resultCourseRepository.findAll().size();
        // Create the ResultCourse
        restResultCourseMockMvc.perform(post("/api/result-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultCourse)))
            .andExpect(status().isCreated());

        // Validate the ResultCourse in the database
        List<ResultCourse> resultCourseList = resultCourseRepository.findAll();
        assertThat(resultCourseList).hasSize(databaseSizeBeforeCreate + 1);
        ResultCourse testResultCourse = resultCourseList.get(resultCourseList.size() - 1);
        assertThat(testResultCourse.getNickName()).isEqualTo(DEFAULT_NICK_NAME);
        assertThat(testResultCourse.getTimeStampFinished()).isEqualTo(DEFAULT_TIME_STAMP_FINISHED);
        assertThat(testResultCourse.getTimeStampStarted()).isEqualTo(DEFAULT_TIME_STAMP_STARTED);
        assertThat(testResultCourse.getTotalDurationInMillis()).isEqualTo(DEFAULT_TOTAL_DURATION_IN_MILLIS);
        assertThat(testResultCourse.getSharedCourse().isVisible()).isTrue();
        assertThat(testResultCourse.getViewCode()).isNotEmpty();
        assertThat(testResultCourse.getViewCode().length()).isEqualTo(5);
        assertThat(testResultCourse.getViewCode()).isNotEqualTo(DEFAULT_VIEW_CODE);
        assertThat(testResultCourse.getShowPositionCounter()).isEqualTo(DEFAULT_SHOW_POSITION_COUNTER);
        assertThat(testResultCourse.getSwitchAppCounter()).isEqualTo(DEFAULT_SWITCH_APP_COUNTER);
    }

    @Test
    @Transactional
    public void createResultCourseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resultCourseRepository.findAll().size();

        // Create the ResultCourse with an existing ID
        resultCourse.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultCourseMockMvc.perform(post("/api/result-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultCourse)))
            .andExpect(status().isBadRequest());

        // Validate the ResultCourse in the database
        List<ResultCourse> resultCourseList = resultCourseRepository.findAll();
        assertThat(resultCourseList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllResultCourses() throws Exception {
        // Initialize the database
        resultCourseRepository.saveAndFlush(resultCourse);

        // Get all the resultCourseList
        restResultCourseMockMvc.perform(get("/api/result-courses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultCourse.getId().intValue())))
            .andExpect(jsonPath("$.[*].nickName").value(hasItem(DEFAULT_NICK_NAME)))
            .andExpect(jsonPath("$.[*].timeStampFinished").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_FINISHED))))
            .andExpect(jsonPath("$.[*].timeStampStarted").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_STARTED))))
            .andExpect(jsonPath("$.[*].totalDurationInMillis").value(hasItem(DEFAULT_TOTAL_DURATION_IN_MILLIS.intValue())))
            .andExpect(jsonPath("$.[*].viewCode").value(hasItem(DEFAULT_VIEW_CODE)))
            .andExpect(jsonPath("$.[*].showPositionCounter").value(hasItem(DEFAULT_SHOW_POSITION_COUNTER)))
            .andExpect(jsonPath("$.[*].switchAppCounter").value(hasItem(DEFAULT_SWITCH_APP_COUNTER)));
    }
    
    @Test
    @Transactional
    public void getResultCourse() throws Exception {
        // Initialize the database
        resultCourseRepository.saveAndFlush(resultCourse);

        // Get the resultCourse
        restResultCourseMockMvc.perform(get("/api/result-courses/{id}", resultCourse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultCourse.getId().intValue()))
            .andExpect(jsonPath("$.nickName").value(DEFAULT_NICK_NAME))
            .andExpect(jsonPath("$.timeStampFinished").value(sameInstant(DEFAULT_TIME_STAMP_FINISHED)))
            .andExpect(jsonPath("$.timeStampStarted").value(sameInstant(DEFAULT_TIME_STAMP_STARTED)))
            .andExpect(jsonPath("$.totalDurationInMillis").value(DEFAULT_TOTAL_DURATION_IN_MILLIS.intValue()))
            .andExpect(jsonPath("$.viewCode").value(DEFAULT_VIEW_CODE))
            .andExpect(jsonPath("$.showPositionCounter").value(DEFAULT_SHOW_POSITION_COUNTER))
            .andExpect(jsonPath("$.switchAppCounter").value(DEFAULT_SWITCH_APP_COUNTER));
    }
    @Test
    @Transactional
    public void getNonExistingResultCourse() throws Exception {
        // Get the resultCourse
        restResultCourseMockMvc.perform(get("/api/result-courses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResultCourse() throws Exception {
        // Initialize the database
        resultCourseRepository.saveAndFlush(resultCourse);

        int databaseSizeBeforeUpdate = resultCourseRepository.findAll().size();

        // Update the resultCourse
        ResultCourse updatedResultCourse = resultCourseRepository.findById(resultCourse.getId()).get();
        // Disconnect from session so that the updates on updatedResultCourse are not directly saved in db
        em.detach(updatedResultCourse);
        updatedResultCourse
            .nickName(UPDATED_NICK_NAME)
            .timeStampFinished(UPDATED_TIME_STAMP_FINISHED)
            .timeStampStarted(UPDATED_TIME_STAMP_STARTED)
            .totalDurationInMillis(UPDATED_TOTAL_DURATION_IN_MILLIS)
            .viewCode(UPDATED_VIEW_CODE)
            .showPositionCounter(UPDATED_SHOW_POSITION_COUNTER)
            .switchAppCounter(UPDATED_SWITCH_APP_COUNTER);

        restResultCourseMockMvc.perform(put("/api/result-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedResultCourse)))
            .andExpect(status().isOk());

        // Validate the ResultCourse in the database
        List<ResultCourse> resultCourseList = resultCourseRepository.findAll();
        assertThat(resultCourseList).hasSize(databaseSizeBeforeUpdate);
        ResultCourse testResultCourse = resultCourseList.get(resultCourseList.size() - 1);
        assertThat(testResultCourse.getNickName()).isEqualTo(UPDATED_NICK_NAME);
        assertThat(testResultCourse.getTimeStampFinished()).isEqualTo(UPDATED_TIME_STAMP_FINISHED);
        assertThat(testResultCourse.getTimeStampStarted()).isEqualTo(UPDATED_TIME_STAMP_STARTED);
        assertThat(testResultCourse.getTotalDurationInMillis()).isEqualTo(UPDATED_TOTAL_DURATION_IN_MILLIS);
        assertThat(testResultCourse.getViewCode()).isEqualTo(UPDATED_VIEW_CODE);
        assertThat(testResultCourse.getShowPositionCounter()).isEqualTo(UPDATED_SHOW_POSITION_COUNTER);
        assertThat(testResultCourse.getSwitchAppCounter()).isEqualTo(UPDATED_SWITCH_APP_COUNTER);
    }

    @Test
    @Transactional
    public void updateNonExistingResultCourse() throws Exception {
        int databaseSizeBeforeUpdate = resultCourseRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultCourseMockMvc.perform(put("/api/result-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultCourse)))
            .andExpect(status().isBadRequest());

        // Validate the ResultCourse in the database
        List<ResultCourse> resultCourseList = resultCourseRepository.findAll();
        assertThat(resultCourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResultCourse() throws Exception {
        // Initialize the database
        resultCourseRepository.saveAndFlush(resultCourse);

        int databaseSizeBeforeDelete = resultCourseRepository.findAll().size();

        // Delete the resultCourse
        restResultCourseMockMvc.perform(delete("/api/result-courses/{id}", resultCourse.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResultCourse> resultCourseList = resultCourseRepository.findAll();
        assertThat(resultCourseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
