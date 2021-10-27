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

import static at.univie.compass.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import at.univie.compass.CompassApp;
import at.univie.compass.domain.ResultControlpoint;
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.domain.ResultQuestion;
import at.univie.compass.repository.ResultControlpointRepository;
import at.univie.compass.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link ResultControlpointResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResultControlpointResourceIT {

    private static final Integer DEFAULT_SEQUENCE = 1;
    private static final Integer UPDATED_SEQUENCE = 2;

    private static final ZonedDateTime DEFAULT_TIME_REACHED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_REACHED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Boolean DEFAULT_SKIP_ALLOWED = false;
    private static final Boolean UPDATED_SKIP_ALLOWED = true;

    private static final Boolean DEFAULT_REACHED = false;
    private static final Boolean UPDATED_REACHED = true;

    private static final Integer DEFAULT_BORG_SCALE = 1;
    private static final Integer UPDATED_BORG_SCALE = 2;

    private static final Boolean DEFAULT_FORCE_SKIPPED = false;
    private static final Boolean UPDATED_FORCE_SKIPPED = true;

    @Autowired
    private ResultControlpointRepository resultControlpointRepository;

    @Mock
    private ResultControlpointRepository resultControlpointRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultControlpointMockMvc;

    private ResultControlpoint resultControlpoint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultControlpoint createEntity(EntityManager em) {
        ResultControlpoint resultControlpoint = new ResultControlpoint()
            .sequence(DEFAULT_SEQUENCE)
            .timeReached(DEFAULT_TIME_REACHED)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .skipAllowed(DEFAULT_SKIP_ALLOWED)
            .reached(DEFAULT_REACHED)
            .borgScale(DEFAULT_BORG_SCALE)
            .forceSkipped(DEFAULT_FORCE_SKIPPED);
        // Add required entity
        ResultQuestion resultQuestion;
        if (TestUtil.findAll(em, ResultQuestion.class).isEmpty()) {
            resultQuestion = ResultQuestionResourceIT.createEntity(em);
            em.persist(resultQuestion);
            em.flush();
        } else {
            resultQuestion = TestUtil.findAll(em, ResultQuestion.class).get(0);
        }
        resultControlpoint.getResultQuestions().add(resultQuestion);
        // Add required entity
        ResultCourse resultCourse;
        if (TestUtil.findAll(em, ResultCourse.class).isEmpty()) {
            resultCourse = ResultCourseResourceIT.createEntity(em);
            em.persist(resultCourse);
            em.flush();
        } else {
            resultCourse = TestUtil.findAll(em, ResultCourse.class).get(0);
        }
        resultControlpoint.setResultCourse(resultCourse);
        return resultControlpoint;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultControlpoint createUpdatedEntity(EntityManager em) {
        ResultControlpoint resultControlpoint = new ResultControlpoint()
            .sequence(UPDATED_SEQUENCE)
            .timeReached(UPDATED_TIME_REACHED)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .skipAllowed(UPDATED_SKIP_ALLOWED)
            .reached(UPDATED_REACHED)
            .borgScale(UPDATED_BORG_SCALE)
            .forceSkipped(UPDATED_FORCE_SKIPPED);
        // Add required entity
        ResultQuestion resultQuestion;
        if (TestUtil.findAll(em, ResultQuestion.class).isEmpty()) {
            resultQuestion = ResultQuestionResourceIT.createUpdatedEntity(em);
            em.persist(resultQuestion);
            em.flush();
        } else {
            resultQuestion = TestUtil.findAll(em, ResultQuestion.class).get(0);
        }
        resultControlpoint.getResultQuestions().add(resultQuestion);
        // Add required entity
        ResultCourse resultCourse;
        if (TestUtil.findAll(em, ResultCourse.class).isEmpty()) {
            resultCourse = ResultCourseResourceIT.createUpdatedEntity(em);
            em.persist(resultCourse);
            em.flush();
        } else {
            resultCourse = TestUtil.findAll(em, ResultCourse.class).get(0);
        }
        resultControlpoint.setResultCourse(resultCourse);
        return resultControlpoint;
    }

    @BeforeEach
    public void initTest() {
        resultControlpoint = createEntity(em);
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void createResultControlpoint() throws Exception {
        int databaseSizeBeforeCreate = resultControlpointRepository.findAll().size();
        // Create the ResultControlpoint
        restResultControlpointMockMvc.perform(post("/api/result-controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultControlpoint)))
            .andExpect(status().isCreated());

        // Validate the ResultControlpoint in the database
        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeCreate + 1);
        ResultControlpoint testResultControlpoint = resultControlpointList.get(resultControlpointList.size() - 1);
        assertThat(testResultControlpoint.getSequence()).isEqualTo(DEFAULT_SEQUENCE);
        assertThat(testResultControlpoint.getTimeReached()).isEqualTo(DEFAULT_TIME_REACHED);
        assertThat(testResultControlpoint.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testResultControlpoint.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testResultControlpoint.isSkipAllowed()).isEqualTo(DEFAULT_SKIP_ALLOWED);
        assertThat(testResultControlpoint.isReached()).isEqualTo(DEFAULT_REACHED);
        assertThat(testResultControlpoint.getBorgScale()).isEqualTo(DEFAULT_BORG_SCALE);
        assertThat(testResultControlpoint.isForceSkipped()).isEqualTo(DEFAULT_FORCE_SKIPPED);
    }

    @Test
    @Transactional
    public void createResultControlpointWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resultControlpointRepository.findAll().size();

        // Create the ResultControlpoint with an existing ID
        resultControlpoint.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultControlpointMockMvc.perform(post("/api/result-controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultControlpoint)))
            .andExpect(status().isBadRequest());

        // Validate the ResultControlpoint in the database
        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkSequenceIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultControlpointRepository.findAll().size();
        // set the field null
        resultControlpoint.setSequence(null);

        // Create the ResultControlpoint, which fails.


        restResultControlpointMockMvc.perform(post("/api/result-controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultControlpoint)))
            .andExpect(status().isBadRequest());

        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllResultControlpoints() throws Exception {
        // Initialize the database
        resultControlpointRepository.saveAndFlush(resultControlpoint);

        // Get all the resultControlpointList
        restResultControlpointMockMvc.perform(get("/api/result-controlpoints?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultControlpoint.getId().intValue())))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)))
            .andExpect(jsonPath("$.[*].timeReached").value(hasItem(sameInstant(DEFAULT_TIME_REACHED))))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].skipAllowed").value(hasItem(DEFAULT_SKIP_ALLOWED.booleanValue())))
            .andExpect(jsonPath("$.[*].reached").value(hasItem(DEFAULT_REACHED.booleanValue())))
            .andExpect(jsonPath("$.[*].borgScale").value(hasItem(DEFAULT_BORG_SCALE)))
            .andExpect(jsonPath("$.[*].forceSkipped").value(hasItem(DEFAULT_FORCE_SKIPPED.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllResultControlpointsWithEagerRelationshipsIsEnabled() throws Exception {
        when(resultControlpointRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResultControlpointMockMvc.perform(get("/api/result-controlpoints?eagerload=true"))
            .andExpect(status().isOk());

        verify(resultControlpointRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllResultControlpointsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(resultControlpointRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResultControlpointMockMvc.perform(get("/api/result-controlpoints?eagerload=true"))
            .andExpect(status().isOk());

        verify(resultControlpointRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getResultControlpoint() throws Exception {
        // Initialize the database
        resultControlpointRepository.saveAndFlush(resultControlpoint);

        // Get the resultControlpoint
        restResultControlpointMockMvc.perform(get("/api/result-controlpoints/{id}", resultControlpoint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultControlpoint.getId().intValue()))
            .andExpect(jsonPath("$.sequence").value(DEFAULT_SEQUENCE))
            .andExpect(jsonPath("$.timeReached").value(sameInstant(DEFAULT_TIME_REACHED)))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.skipAllowed").value(DEFAULT_SKIP_ALLOWED.booleanValue()))
            .andExpect(jsonPath("$.reached").value(DEFAULT_REACHED.booleanValue()))
            .andExpect(jsonPath("$.borgScale").value(DEFAULT_BORG_SCALE))
            .andExpect(jsonPath("$.forceSkipped").value(DEFAULT_FORCE_SKIPPED.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingResultControlpoint() throws Exception {
        // Get the resultControlpoint
        restResultControlpointMockMvc.perform(get("/api/result-controlpoints/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void updateResultControlpoint() throws Exception {
        // Initialize the database
        resultControlpointRepository.saveAndFlush(resultControlpoint);

        int databaseSizeBeforeUpdate = resultControlpointRepository.findAll().size();

        // Update the resultControlpoint
        ResultControlpoint updatedResultControlpoint = resultControlpointRepository.findById(resultControlpoint.getId()).get();
        // Disconnect from session so that the updates on updatedResultControlpoint are not directly saved in db
        em.detach(updatedResultControlpoint);
        updatedResultControlpoint
            .sequence(UPDATED_SEQUENCE)
            .timeReached(UPDATED_TIME_REACHED)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .skipAllowed(UPDATED_SKIP_ALLOWED)
            .reached(UPDATED_REACHED)
            .borgScale(UPDATED_BORG_SCALE)
            .forceSkipped(UPDATED_FORCE_SKIPPED);

        restResultControlpointMockMvc.perform(put("/api/result-controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedResultControlpoint)))
            .andExpect(status().isOk());

        // Validate the ResultControlpoint in the database
        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeUpdate);
        ResultControlpoint testResultControlpoint = resultControlpointList.get(resultControlpointList.size() - 1);
        assertThat(testResultControlpoint.getSequence()).isEqualTo(UPDATED_SEQUENCE);
        assertThat(testResultControlpoint.getTimeReached()).isEqualTo(UPDATED_TIME_REACHED);
        assertThat(testResultControlpoint.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testResultControlpoint.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testResultControlpoint.isSkipAllowed()).isEqualTo(UPDATED_SKIP_ALLOWED);
        assertThat(testResultControlpoint.isReached()).isEqualTo(UPDATED_REACHED);
        assertThat(testResultControlpoint.getBorgScale()).isEqualTo(UPDATED_BORG_SCALE);
        assertThat(testResultControlpoint.isForceSkipped()).isEqualTo(UPDATED_FORCE_SKIPPED);
    }

    @Test
    @Transactional
    public void updateNonExistingResultControlpoint() throws Exception {
        int databaseSizeBeforeUpdate = resultControlpointRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultControlpointMockMvc.perform(put("/api/result-controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultControlpoint)))
            .andExpect(status().isBadRequest());

        // Validate the ResultControlpoint in the database
        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResultControlpoint() throws Exception {
        // Initialize the database
        resultControlpointRepository.saveAndFlush(resultControlpoint);

        int databaseSizeBeforeDelete = resultControlpointRepository.findAll().size();

        // Delete the resultControlpoint
        restResultControlpointMockMvc.perform(delete("/api/result-controlpoints/{id}", resultControlpoint.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResultControlpoint> resultControlpointList = resultControlpointRepository.findAll();
        assertThat(resultControlpointList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
