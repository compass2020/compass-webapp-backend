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
import at.univie.compass.domain.Controlpoint;
import at.univie.compass.domain.Course;
import at.univie.compass.repository.CourseRepository;
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
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CourseResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class CourseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_SHARED = false;
    private static final Boolean UPDATED_SHARED = true;

    private static final byte[] DEFAULT_MAP_FINAL_SMALL = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_MAP_FINAL_SMALL = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_MAP_FINAL_SMALL_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_MAP_FINAL_SMALL_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Double DEFAULT_ALTITUDE_UP = 1D;
    private static final Double UPDATED_ALTITUDE_UP = 2D;

    private static final Double DEFAULT_ALTITUDE_DOWN = 1D;
    private static final Double UPDATED_ALTITUDE_DOWN = 2D;

    private static final Double DEFAULT_LENGTH = 1D;
    private static final Double UPDATED_LENGTH = 2D;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseMockMvc;

    private Course course;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Course createEntity(EntityManager em) {

        Controlpoint controlpoint = ControlpointResourceIT.createEntity();
        
        Course course = new Course()
            .name(DEFAULT_NAME)
            .shared(DEFAULT_SHARED)
            .mapFinalSmall(DEFAULT_MAP_FINAL_SMALL)
            .mapFinalSmallContentType(DEFAULT_MAP_FINAL_SMALL_CONTENT_TYPE)
            .location(DEFAULT_LOCATION)
            .altitudeUp(DEFAULT_ALTITUDE_UP)
            .altitudeDown(DEFAULT_ALTITUDE_DOWN)
            .length(DEFAULT_LENGTH)
            .addControlpoint(controlpoint)
            .orienteeringMap(OrienteeringMapResourceIT.createEntity(em));
        return course;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Course createUpdatedEntity(EntityManager em) {
        Course course = new Course()
            .name(UPDATED_NAME)
            .shared(UPDATED_SHARED)
            .mapFinalSmall(UPDATED_MAP_FINAL_SMALL)
            .mapFinalSmallContentType(UPDATED_MAP_FINAL_SMALL_CONTENT_TYPE)
            .location(UPDATED_LOCATION)
            .altitudeUp(UPDATED_ALTITUDE_UP)
            .altitudeDown(UPDATED_ALTITUDE_DOWN)
            .length(UPDATED_LENGTH);
        return course;
    }

    @BeforeEach
    public void initTest() {
        course = createEntity(em);
    }

    @Test
    @Transactional
    public void createCourse() throws Exception {
        int databaseSizeBeforeCreate = courseRepository.findAll().size();
        // Create the Course
        restCourseMockMvc.perform(post("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(course)))
            .andExpect(status().isCreated());

        // Validate the Course in the database
        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeCreate + 1);
        Course testCourse = courseList.get(courseList.size() - 1);
        assertThat(testCourse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCourse.isShared()).isEqualTo(DEFAULT_SHARED);
        assertThat(testCourse.getMapFinalSmall()).isEqualTo(DEFAULT_MAP_FINAL_SMALL);
        assertThat(testCourse.getMapFinalSmallContentType()).isEqualTo(DEFAULT_MAP_FINAL_SMALL_CONTENT_TYPE);
        assertThat(testCourse.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testCourse.getAltitudeUp()).isEqualTo(DEFAULT_ALTITUDE_UP);
        assertThat(testCourse.getAltitudeDown()).isEqualTo(DEFAULT_ALTITUDE_DOWN);
        assertThat(testCourse.getLength()).isEqualTo(DEFAULT_LENGTH);
        assertThat(testCourse.getControlpoints()).isNotNull();
        assertThat(testCourse.getControlpoints().size()).isEqualTo(1);
    }

    @Test
    @Transactional
    public void createCourseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = courseRepository.findAll().size();

        // Create the Course with an existing ID
        course.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseMockMvc.perform(post("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(course)))
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = courseRepository.findAll().size();
        // set the field null
        course.setName(null);

        // Create the Course, which fails.


        restCourseMockMvc.perform(post("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(course)))
            .andExpect(status().isBadRequest());

        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSharedIsRequired() throws Exception {
        int databaseSizeBeforeTest = courseRepository.findAll().size();
        // set the field null
        course.setShared(null);

        // result ist ok, cause the backend sets shared to default false
        restCourseMockMvc.perform(post("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(course)))
            .andExpect(status().isCreated());

        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeTest + 1);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllCourses() throws Exception {
        // Initialize the database
        courseRepository.saveAndFlush(course);

        // Get all the courseList
        restCourseMockMvc.perform(get("/api/courses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(course.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].shared").value(hasItem(DEFAULT_SHARED.booleanValue())))
            .andExpect(jsonPath("$.[*].mapFinalSmallContentType").value(hasItem(DEFAULT_MAP_FINAL_SMALL_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].mapFinalSmall").value(hasItem(Base64Utils.encodeToString(DEFAULT_MAP_FINAL_SMALL))))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].altitudeUp").value(hasItem(DEFAULT_ALTITUDE_UP.doubleValue())))
            .andExpect(jsonPath("$.[*].altitudeDown").value(hasItem(DEFAULT_ALTITUDE_DOWN.doubleValue())))
            .andExpect(jsonPath("$.[*].length").value(hasItem(DEFAULT_LENGTH.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getCourse() throws Exception {
        // Initialize the database
        courseRepository.saveAndFlush(course);

        // Get the course
        restCourseMockMvc.perform(get("/api/courses/{id}", course.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(course.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.shared").value(DEFAULT_SHARED.booleanValue()))
            .andExpect(jsonPath("$.mapFinalSmallContentType").value(DEFAULT_MAP_FINAL_SMALL_CONTENT_TYPE))
            .andExpect(jsonPath("$.mapFinalSmall").value(Base64Utils.encodeToString(DEFAULT_MAP_FINAL_SMALL)))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.altitudeUp").value(DEFAULT_ALTITUDE_UP.doubleValue()))
            .andExpect(jsonPath("$.altitudeDown").value(DEFAULT_ALTITUDE_DOWN.doubleValue()))
            .andExpect(jsonPath("$.length").value(DEFAULT_LENGTH.doubleValue()));
    }
    @Test
    @Transactional
    public void getNonExistingCourse() throws Exception {
        // Get the course
        restCourseMockMvc.perform(get("/api/courses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCourse() throws Exception {
        // Initialize the database
        courseRepository.saveAndFlush(course);

        int databaseSizeBeforeUpdate = courseRepository.findAll().size();

        // Update the course
        Course updatedCourse = courseRepository.findById(course.getId()).get();
        // Disconnect from session so that the updates on updatedCourse are not directly saved in db
        em.detach(updatedCourse);
        updatedCourse
            .name(UPDATED_NAME)
            .shared(UPDATED_SHARED)
            .mapFinalSmall(UPDATED_MAP_FINAL_SMALL)
            .mapFinalSmallContentType(UPDATED_MAP_FINAL_SMALL_CONTENT_TYPE)
            .location(UPDATED_LOCATION)
            .altitudeUp(UPDATED_ALTITUDE_UP)
            .altitudeDown(UPDATED_ALTITUDE_DOWN)
            .length(UPDATED_LENGTH);

        restCourseMockMvc.perform(put("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCourse)))
            .andExpect(status().isOk());

        // Validate the Course in the database
        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeUpdate);
        Course testCourse = courseList.get(courseList.size() - 1);
        assertThat(testCourse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourse.isShared()).isEqualTo(UPDATED_SHARED);
        assertThat(testCourse.getMapFinalSmall()).isEqualTo(UPDATED_MAP_FINAL_SMALL);
        assertThat(testCourse.getMapFinalSmallContentType()).isEqualTo(UPDATED_MAP_FINAL_SMALL_CONTENT_TYPE);
        assertThat(testCourse.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testCourse.getAltitudeUp()).isEqualTo(UPDATED_ALTITUDE_UP);
        assertThat(testCourse.getAltitudeDown()).isEqualTo(UPDATED_ALTITUDE_DOWN);
        assertThat(testCourse.getLength()).isEqualTo(UPDATED_LENGTH);
    }

    @Test
    @Transactional
    public void updateNonExistingCourse() throws Exception {
        int databaseSizeBeforeUpdate = courseRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseMockMvc.perform(put("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(course)))
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCourse() throws Exception {
        // Initialize the database
        courseRepository.saveAndFlush(course);

        int databaseSizeBeforeDelete = courseRepository.findAll().size();

        // Delete the course
        restCourseMockMvc.perform(delete("/api/courses/{id}", course.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Course> courseList = courseRepository.findAll();
        assertThat(courseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
