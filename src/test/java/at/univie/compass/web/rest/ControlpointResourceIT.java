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
import at.univie.compass.domain.Controlpoint;
import at.univie.compass.domain.ControlpointInfo;
import at.univie.compass.domain.Course;
import at.univie.compass.domain.Question;
import at.univie.compass.repository.ControlpointRepository;
import at.univie.compass.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link ControlpointResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ControlpointResourceIT {

    private static final Integer DEFAULT_SEQUENCE = 1;
    private static final Integer UPDATED_SEQUENCE = 2;

    private static final Integer DEFAULT_CONTROL_CODE = 1;
    private static final Integer UPDATED_CONTROL_CODE = 2;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Double DEFAULT_ELEVATION = 1D;
    private static final Double UPDATED_ELEVATION = 2D;

    private static final Integer DEFAULT_RADIUS = 1;
    private static final Integer UPDATED_RADIUS = 2;

    private static final Boolean DEFAULT_SKIPPABLE = false;
    private static final Boolean UPDATED_SKIPPABLE = true;

    private static final Boolean DEFAULT_TEAM = false;
    private static final Boolean UPDATED_TEAM = true;

    private static final String DEFAULT_QR_CODE = "AAAAAAAAAA";
    private static final String UPDATED_QR_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private ControlpointRepository controlpointRepository;

    @Mock
    private ControlpointRepository controlpointRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restControlpointMockMvc;

    private Controlpoint controlpoint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Controlpoint createEntity(EntityManager em) {
        Controlpoint controlpoint = new Controlpoint()
            .sequence(DEFAULT_SEQUENCE)
            .controlCode(DEFAULT_CONTROL_CODE)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .elevation(DEFAULT_ELEVATION)
            .radius(DEFAULT_RADIUS)
            .skippable(DEFAULT_SKIPPABLE)
            .team(DEFAULT_TEAM)
            .qrCode(DEFAULT_QR_CODE)
            .description(DEFAULT_DESCRIPTION);
        // Add required entity
        Question question;
        if (TestUtil.findAll(em, Question.class).isEmpty()) {
            question = QuestionResourceIT.createEntity(em);
            em.persist(question);
            em.flush();
        } else {
            question = TestUtil.findAll(em, Question.class).get(0);
        }
        controlpoint.getQuestions().add(question);
        // Add required entity
        ControlpointInfo controlpointInfo;
        if (TestUtil.findAll(em, ControlpointInfo.class).isEmpty()) {
            controlpointInfo = ControlpointInfoResourceIT.createEntity(em);
            em.persist(controlpointInfo);
            em.flush();
        } else {
            controlpointInfo = TestUtil.findAll(em, ControlpointInfo.class).get(0);
        }
        controlpoint.getControlpointInfos().add(controlpointInfo);
        // Add required entity
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            course = CourseResourceIT.createEntity(em);
            em.persist(course);
            em.flush();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        controlpoint.setCourse(course);
        return controlpoint;
    }

    /**
     * Create an entity without parent for test.
     * 
     * @return
     */
    public static Controlpoint createEntity() {
        Controlpoint controlpoint = new Controlpoint()
            .sequence(DEFAULT_SEQUENCE)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .elevation(DEFAULT_ELEVATION)
            .radius(DEFAULT_RADIUS)
            .skippable(DEFAULT_SKIPPABLE)
            .team(DEFAULT_TEAM)
            .qrCode(UPDATED_QR_CODE);
        return controlpoint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Controlpoint createUpdatedEntity(EntityManager em) {
        Controlpoint controlpoint = new Controlpoint()
            .sequence(UPDATED_SEQUENCE)
            .controlCode(UPDATED_CONTROL_CODE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .elevation(UPDATED_ELEVATION)
            .radius(UPDATED_RADIUS)
            .skippable(UPDATED_SKIPPABLE)
            .team(UPDATED_TEAM)
            .qrCode(UPDATED_QR_CODE)
            .description(UPDATED_DESCRIPTION);
        // Add required entity
        Question question;
        if (TestUtil.findAll(em, Question.class).isEmpty()) {
            question = QuestionResourceIT.createUpdatedEntity(em);
            em.persist(question);
            em.flush();
        } else {
            question = TestUtil.findAll(em, Question.class).get(0);
        }
        controlpoint.getQuestions().add(question);
        // Add required entity
        ControlpointInfo controlpointInfo;
        if (TestUtil.findAll(em, ControlpointInfo.class).isEmpty()) {
            controlpointInfo = ControlpointInfoResourceIT.createUpdatedEntity(em);
            em.persist(controlpointInfo);
            em.flush();
        } else {
            controlpointInfo = TestUtil.findAll(em, ControlpointInfo.class).get(0);
        }
        controlpoint.getControlpointInfos().add(controlpointInfo);
        // Add required entity
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            course = CourseResourceIT.createUpdatedEntity(em);
            em.persist(course);
            em.flush();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        controlpoint.setCourse(course);
        return controlpoint;
    }

    @BeforeEach
    public void initTest() {
        controlpoint = createEntity(em);
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void createControlpoint() throws Exception {
        int databaseSizeBeforeCreate = controlpointRepository.findAll().size();
        // Create the Controlpoint
        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isCreated());

        // Validate the Controlpoint in the database
        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeCreate + 1);
        Controlpoint testControlpoint = controlpointList.get(controlpointList.size() - 1);
        assertThat(testControlpoint.getSequence()).isEqualTo(DEFAULT_SEQUENCE);
        assertThat(testControlpoint.getControlCode()).isEqualTo(DEFAULT_CONTROL_CODE);
        assertThat(testControlpoint.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testControlpoint.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testControlpoint.getElevation()).isEqualTo(DEFAULT_ELEVATION);
        assertThat(testControlpoint.getRadius()).isEqualTo(DEFAULT_RADIUS);
        assertThat(testControlpoint.isSkippable()).isEqualTo(DEFAULT_SKIPPABLE);
        assertThat(testControlpoint.isTeam()).isEqualTo(DEFAULT_TEAM);
        assertThat(testControlpoint.getQrCode()).isNotNull();
        assertThat(testControlpoint.getQrCode().length()).isEqualTo(36);
        assertThat(testControlpoint.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createControlpointWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = controlpointRepository.findAll().size();

        // Create the Controlpoint with an existing ID
        controlpoint.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        // Validate the Controlpoint in the database
        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkSequenceIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setSequence(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setLatitude(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setLongitude(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRadiusIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setRadius(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSkippableIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setSkippable(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTeamIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointRepository.findAll().size();
        // set the field null
        controlpoint.setTeam(null);

        // Create the Controlpoint, which fails.


        restControlpointMockMvc.perform(post("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllControlpoints() throws Exception {
        // Initialize the database
        controlpointRepository.saveAndFlush(controlpoint);

        // Get all the controlpointList
        restControlpointMockMvc.perform(get("/api/controlpoints?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(controlpoint.getId().intValue())))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)))
            .andExpect(jsonPath("$.[*].controlCode").value(hasItem(DEFAULT_CONTROL_CODE)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].elevation").value(hasItem(DEFAULT_ELEVATION.doubleValue())))
            .andExpect(jsonPath("$.[*].radius").value(hasItem(DEFAULT_RADIUS)))
            .andExpect(jsonPath("$.[*].skippable").value(hasItem(DEFAULT_SKIPPABLE.booleanValue())))
            .andExpect(jsonPath("$.[*].team").value(hasItem(DEFAULT_TEAM.booleanValue())))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(DEFAULT_QR_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllControlpointsWithEagerRelationshipsIsEnabled() throws Exception {
        when(controlpointRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restControlpointMockMvc.perform(get("/api/controlpoints?eagerload=true"))
            .andExpect(status().isOk());

        verify(controlpointRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllControlpointsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(controlpointRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restControlpointMockMvc.perform(get("/api/controlpoints?eagerload=true"))
            .andExpect(status().isOk());

        verify(controlpointRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getControlpoint() throws Exception {
        // Initialize the database
        controlpointRepository.saveAndFlush(controlpoint);

        // Get the controlpoint
        restControlpointMockMvc.perform(get("/api/controlpoints/{id}", controlpoint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(controlpoint.getId().intValue()))
            .andExpect(jsonPath("$.sequence").value(DEFAULT_SEQUENCE))
            .andExpect(jsonPath("$.controlCode").value(DEFAULT_CONTROL_CODE))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.elevation").value(DEFAULT_ELEVATION.doubleValue()))
            .andExpect(jsonPath("$.radius").value(DEFAULT_RADIUS))
            .andExpect(jsonPath("$.skippable").value(DEFAULT_SKIPPABLE.booleanValue()))
            .andExpect(jsonPath("$.team").value(DEFAULT_TEAM.booleanValue()))
            .andExpect(jsonPath("$.qrCode").value(DEFAULT_QR_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }
    @Test
    @Transactional
    public void getNonExistingControlpoint() throws Exception {
        // Get the controlpoint
        restControlpointMockMvc.perform(get("/api/controlpoints/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void updateControlpoint() throws Exception {
        // Initialize the database
        controlpointRepository.saveAndFlush(controlpoint);

        int databaseSizeBeforeUpdate = controlpointRepository.findAll().size();

        // Update the controlpoint
        Controlpoint updatedControlpoint = controlpointRepository.findById(controlpoint.getId()).get();
        // Disconnect from session so that the updates on updatedControlpoint are not directly saved in db
        em.detach(updatedControlpoint);
        updatedControlpoint
            .sequence(UPDATED_SEQUENCE)
            .controlCode(UPDATED_CONTROL_CODE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .elevation(UPDATED_ELEVATION)
            .radius(UPDATED_RADIUS)
            .skippable(UPDATED_SKIPPABLE)
            .team(UPDATED_TEAM)
            .qrCode(UPDATED_QR_CODE)
            .description(UPDATED_DESCRIPTION);

        restControlpointMockMvc.perform(put("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedControlpoint)))
            .andExpect(status().isOk());

        // Validate the Controlpoint in the database
        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeUpdate);
        Controlpoint testControlpoint = controlpointList.get(controlpointList.size() - 1);
        assertThat(testControlpoint.getSequence()).isEqualTo(UPDATED_SEQUENCE);
        assertThat(testControlpoint.getControlCode()).isEqualTo(UPDATED_CONTROL_CODE);
        assertThat(testControlpoint.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testControlpoint.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testControlpoint.getElevation()).isEqualTo(UPDATED_ELEVATION);
        assertThat(testControlpoint.getRadius()).isEqualTo(UPDATED_RADIUS);
        assertThat(testControlpoint.isSkippable()).isEqualTo(UPDATED_SKIPPABLE);
        assertThat(testControlpoint.isTeam()).isEqualTo(UPDATED_TEAM);
        assertThat(testControlpoint.getQrCode()).isEqualTo(UPDATED_QR_CODE);
        assertThat(testControlpoint.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingControlpoint() throws Exception {
        int databaseSizeBeforeUpdate = controlpointRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restControlpointMockMvc.perform(put("/api/controlpoints")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpoint)))
            .andExpect(status().isBadRequest());

        // Validate the Controlpoint in the database
        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteControlpoint() throws Exception {
        // Initialize the database
        controlpointRepository.saveAndFlush(controlpoint);

        int databaseSizeBeforeDelete = controlpointRepository.findAll().size();

        // Delete the controlpoint
        restControlpointMockMvc.perform(delete("/api/controlpoints/{id}", controlpoint.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Controlpoint> controlpointList = controlpointRepository.findAll();
        assertThat(controlpointList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
