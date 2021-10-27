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
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
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
import java.util.List;

import javax.persistence.EntityManager;

import org.junit.Rule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.rules.ExpectedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import at.univie.compass.CompassApp;
import at.univie.compass.domain.Course;
import at.univie.compass.domain.SharedCourse;
import at.univie.compass.domain.enumeration.GameModus;
import at.univie.compass.repository.SharedCourseRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.web.rest.errors.CustomQrCodeAlreadyScannedException;
import at.univie.compass.web.rest.errors.QrCodeTimestampExpiredException;
/**
 * Integration tests for the {@link SharedCourseResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SharedCourseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_QR_CODE = "AAAAAAAAAA";
    private static final String UPDATED_QR_CODE = "BBBBBBBBBB";

    private static final GameModus DEFAULT_GAME_MODUS = GameModus.QRCODE;
    private static final GameModus UPDATED_GAME_MODUS = GameModus.GPS;

    private static final ZonedDateTime DEFAULT_TIME_STAMP_SHARED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_STAMP_SHARED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_VISIBLE = true;
    private static final Boolean UPDATED_VISIBLE = false;

    private static final ZonedDateTime DEFAULT_TIME_STAMP_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0).minusDays(1);
    private static final ZonedDateTime UPDATED_TIME_STAMP_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIME_STAMP_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0).plusDays(1);
    private static final ZonedDateTime UPDATED_TIME_STAMP_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_NUMBER_OF_CUSTOM_QR_CODES = 0;
    private static final Integer UPDATED_NUMBER_OF_CUSTOM_QR_CODES = 1;

    private static final Boolean DEFAULT_SHOW_COURSE_BEFORE_START = false;
    private static final Boolean UPDATED_SHOW_COURSE_BEFORE_START = true;

    private static final Boolean DEFAULT_SHOW_POSITION_ALLOWED = false;
    private static final Boolean UPDATED_SHOW_POSITION_ALLOWED = true;

    private final Logger log = LoggerFactory.getLogger(SharedCourseResourceIT.class);
    
    @Autowired
    private SharedCourseRepository sharedCourseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSharedCourseMockMvc;

    private SharedCourse sharedCourse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SharedCourse createEntity(EntityManager em) {
        SharedCourse sharedCourse = new SharedCourse()
            .name(DEFAULT_NAME)
            .qrCode(DEFAULT_QR_CODE)
            .gameModus(DEFAULT_GAME_MODUS)
            .timeStampShared(DEFAULT_TIME_STAMP_SHARED)
            .visible(DEFAULT_VISIBLE)
            .timeStampStart(DEFAULT_TIME_STAMP_START)
            .timeStampEnd(DEFAULT_TIME_STAMP_END)
            .numberOfCustomQrCodes(DEFAULT_NUMBER_OF_CUSTOM_QR_CODES)
            .showCourseBeforeStart(DEFAULT_SHOW_COURSE_BEFORE_START)
            .showPositionAllowed(DEFAULT_SHOW_POSITION_ALLOWED);

        // Add required entity
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            course = CourseResourceIT.createEntity(em);
            em.persist(course);
            em.flush();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        sharedCourse.setCourse(course);
        return sharedCourse;
    }
    
    
    public static SharedCourse createEntityWithCustomQrCodes(EntityManager em, int numerOfCrCodes) {
        SharedCourse sharedCourse = new SharedCourse()
            .name(DEFAULT_NAME)
            .qrCode(DEFAULT_QR_CODE)
            .gameModus(DEFAULT_GAME_MODUS)
            .timeStampShared(DEFAULT_TIME_STAMP_SHARED)
            .visible(false)
            .timeStampStart(DEFAULT_TIME_STAMP_START)
            .timeStampEnd(DEFAULT_TIME_STAMP_END)
            .numberOfCustomQrCodes(numerOfCrCodes)
            .showCourseBeforeStart(DEFAULT_SHOW_COURSE_BEFORE_START)
            .showPositionAllowed(DEFAULT_SHOW_POSITION_ALLOWED);

        // Add required entity
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            course = CourseResourceIT.createEntity(em);
            em.persist(course);
            em.flush();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        sharedCourse.setCourse(course);
        return sharedCourse;
    }

    
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SharedCourse createUpdatedEntity(EntityManager em) {
        SharedCourse sharedCourse = new SharedCourse()
            .name(UPDATED_NAME)
            .qrCode(UPDATED_QR_CODE)
            .gameModus(UPDATED_GAME_MODUS)
            .timeStampShared(UPDATED_TIME_STAMP_SHARED)
            .visible(UPDATED_VISIBLE)
            .timeStampStart(UPDATED_TIME_STAMP_START)
            .timeStampEnd(UPDATED_TIME_STAMP_END)
            .numberOfCustomQrCodes(UPDATED_NUMBER_OF_CUSTOM_QR_CODES)
            .showCourseBeforeStart(UPDATED_SHOW_COURSE_BEFORE_START)
            .showPositionAllowed(UPDATED_SHOW_POSITION_ALLOWED);
        // Add required entity
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            course = CourseResourceIT.createUpdatedEntity(em);
            em.persist(course);
            em.flush();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        sharedCourse.setCourse(course);
        return sharedCourse;
    }

    @BeforeEach
    public void initTest() {
        sharedCourse = createEntity(em);
    }

    @Test
    @Transactional
    public void createSharedCourse() throws Exception {
        int databaseSizeBeforeCreate = sharedCourseRepository.findAll().size();
        // Create the SharedCourse
        restSharedCourseMockMvc.perform(post("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourse)))
            .andExpect(status().isCreated());

        // Validate the SharedCourse in the database
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeCreate + 1);
        SharedCourse testSharedCourse = sharedCourseList.get(sharedCourseList.size() - 1);
        assertThat(testSharedCourse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSharedCourse.getQrCode()).isNotNull();
        assertThat(testSharedCourse.getQrCode().length()).isEqualTo(36);
        assertThat(testSharedCourse.getGameModus()).isEqualTo(DEFAULT_GAME_MODUS);
        assertThat(testSharedCourse.getTimeStampShared()).isEqualTo(DEFAULT_TIME_STAMP_SHARED);
        assertThat(testSharedCourse.isVisible()).isEqualTo(Boolean.TRUE);
        assertThat(testSharedCourse.getTimeStampStart()).isEqualTo(DEFAULT_TIME_STAMP_START);
        assertThat(testSharedCourse.getTimeStampEnd()).isEqualTo(DEFAULT_TIME_STAMP_END);
        assertThat(testSharedCourse.getNumberOfCustomQrCodes()).isEqualTo(DEFAULT_NUMBER_OF_CUSTOM_QR_CODES);
        assertThat(testSharedCourse.getSharedCourseQrCodes().isEmpty(), is(true));
        assertThat(testSharedCourse.isShowCourseBeforeStart()).isEqualTo(DEFAULT_SHOW_COURSE_BEFORE_START);
        assertThat(testSharedCourse.isShowPositionAllowed()).isEqualTo(DEFAULT_SHOW_POSITION_ALLOWED);
    }

    @Test
    @Transactional
    public void createSharedCourseWithCustomQRCodes() throws Exception {
        int databaseSizeBeforeCreate = sharedCourseRepository.findAll().size();
        // Create the SharedCourse
        restSharedCourseMockMvc.perform(post("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(SharedCourseResourceIT.createEntityWithCustomQrCodes(em, 5))))
            .andExpect(status().isCreated());

        // Validate the SharedCourse in the database
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeCreate + 1);
        SharedCourse testSharedCourse = sharedCourseList.get(sharedCourseList.size() - 1);
        assertThat(testSharedCourse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSharedCourse.getQrCode()).isNotNull();
        assertThat(testSharedCourse.getQrCode().length()).isEqualTo(36);
        assertThat(testSharedCourse.getGameModus()).isEqualTo(DEFAULT_GAME_MODUS);
        assertThat(testSharedCourse.getTimeStampShared()).isEqualTo(DEFAULT_TIME_STAMP_SHARED);
        assertThat(testSharedCourse.isVisible()).isEqualTo(Boolean.TRUE);
        assertThat(testSharedCourse.getTimeStampStart()).isEqualTo(DEFAULT_TIME_STAMP_START);
        assertThat(testSharedCourse.getTimeStampEnd()).isEqualTo(DEFAULT_TIME_STAMP_END);
        assertThat(testSharedCourse.getNumberOfCustomQrCodes()).isEqualTo(5);
        assertThat(testSharedCourse.getSharedCourseQrCodes().isEmpty(), is(false));
        assertThat(testSharedCourse.getSharedCourseQrCodes().size(), is(5));
        assertThat(testSharedCourse.isShowCourseBeforeStart()).isEqualTo(DEFAULT_SHOW_COURSE_BEFORE_START);
        assertThat(testSharedCourse.isShowPositionAllowed()).isEqualTo(DEFAULT_SHOW_POSITION_ALLOWED);
    }

    @Test
    @Transactional
    public void createSharedCourseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sharedCourseRepository.findAll().size();

        // Create the SharedCourse with an existing ID
        sharedCourse.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSharedCourseMockMvc.perform(post("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourse)))
            .andExpect(status().isBadRequest());

        // Validate the SharedCourse in the database
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkGameModusIsRequired() throws Exception {
        int databaseSizeBeforeTest = sharedCourseRepository.findAll().size();
        // set the field null
        sharedCourse.setGameModus(null);

        // Create the SharedCourse, which fails.


        restSharedCourseMockMvc.perform(post("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourse)))
            .andExpect(status().isBadRequest());

        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllSharedCourses() throws Exception {
        // Initialize the database
        sharedCourseRepository.saveAndFlush(sharedCourse);

        // Get all the sharedCourseList
        restSharedCourseMockMvc.perform(get("/api/shared-courses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sharedCourse.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(DEFAULT_QR_CODE)))
            .andExpect(jsonPath("$.[*].gameModus").value(hasItem(DEFAULT_GAME_MODUS.toString())))
            .andExpect(jsonPath("$.[*].timeStampShared").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_SHARED))))
            .andExpect(jsonPath("$.[*].visible").value(hasItem(DEFAULT_VISIBLE.booleanValue())))
            .andExpect(jsonPath("$.[*].timeStampStart").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_START))))
            .andExpect(jsonPath("$.[*].timeStampEnd").value(hasItem(sameInstant(DEFAULT_TIME_STAMP_END))))
            .andExpect(jsonPath("$.[*].numberOfCustomQrCodes").value(hasItem(DEFAULT_NUMBER_OF_CUSTOM_QR_CODES)))
            .andExpect(jsonPath("$.[*].showCourseBeforeStart").value(hasItem(DEFAULT_SHOW_COURSE_BEFORE_START.booleanValue())))
            .andExpect(jsonPath("$.[*].showPositionAllowed").value(hasItem(DEFAULT_SHOW_POSITION_ALLOWED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getSharedCourse() throws Exception {
        // Initialize the database
        sharedCourseRepository.saveAndFlush(sharedCourse);

        // Get the sharedCourse
        restSharedCourseMockMvc.perform(get("/api/shared-courses/{id}", sharedCourse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sharedCourse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.qrCode").value(DEFAULT_QR_CODE))
            .andExpect(jsonPath("$.gameModus").value(DEFAULT_GAME_MODUS.toString()))
            .andExpect(jsonPath("$.timeStampShared").value(sameInstant(DEFAULT_TIME_STAMP_SHARED)))
            .andExpect(jsonPath("$.visible").value(DEFAULT_VISIBLE.booleanValue()))
            .andExpect(jsonPath("$.timeStampStart").value(sameInstant(DEFAULT_TIME_STAMP_START)))
            .andExpect(jsonPath("$.timeStampEnd").value(sameInstant(DEFAULT_TIME_STAMP_END)))
            .andExpect(jsonPath("$.numberOfCustomQrCodes").value(DEFAULT_NUMBER_OF_CUSTOM_QR_CODES))
            .andExpect(jsonPath("$.showCourseBeforeStart").value(DEFAULT_SHOW_COURSE_BEFORE_START.booleanValue()))
            .andExpect(jsonPath("$.showPositionAllowed").value(DEFAULT_SHOW_POSITION_ALLOWED.booleanValue()));
    }

    @Test
    @Transactional
    public void getSharedCourseWithGeneralQrCode() throws Exception {
        // Initialize the database
        sharedCourseRepository.saveAndFlush(sharedCourse);
        
        log.debug(sharedCourse.toString());

        // Get the sharedCourse
        restSharedCourseMockMvc.perform(get("/api/shared-courses/qrcode/{qrcode}", sharedCourse.getQrCode()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sharedCourse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.qrCode").value(DEFAULT_QR_CODE))
            .andExpect(jsonPath("$.gameModus").value(DEFAULT_GAME_MODUS.toString()))
            .andExpect(jsonPath("$.timeStampShared").value(sameInstant(DEFAULT_TIME_STAMP_SHARED)))
            .andExpect(jsonPath("$.visible").value(DEFAULT_VISIBLE.booleanValue()))
            .andExpect(jsonPath("$.timeStampStart").value(sameInstant(DEFAULT_TIME_STAMP_START)))
            .andExpect(jsonPath("$.timeStampEnd").value(sameInstant(DEFAULT_TIME_STAMP_END)))
            .andExpect(jsonPath("$.numberOfCustomQrCodes").value(DEFAULT_NUMBER_OF_CUSTOM_QR_CODES))
            .andExpect(jsonPath("$.showCourseBeforeStart").value(DEFAULT_SHOW_COURSE_BEFORE_START.booleanValue()))
            .andExpect(jsonPath("$.showPositionAllowed").value(DEFAULT_SHOW_POSITION_ALLOWED.booleanValue()));
    }

//    @Rule
//    public ExpectedException expectedEx = ExpectedException.none();
    
    @Test
    @Transactional
    public void getSharedCourseWithCustomQrCode() throws Exception {
        
//        expectedEx.expect(CustomQrCodeAlreadyScannedException.class);
//        expectedEx.expectMessage(CustomQrCodeAlreadyScannedException.QR_CODE_ALREADY_SCANNED);
        
        // Initialize the database
        SharedCourse sc = SharedCourseResourceIT.createEntityWithCustomQrCodes(em, 1);
        sc.setTimeStampStart(ZonedDateTime.now());
        sc.setTimeStampEnd(ZonedDateTime.now());
        sc.addSharedCourseQrCode(SharedCourseQrCodeResourceIT.createEntity(em));
        
        sharedCourseRepository.saveAndFlush(sc);
        
        restSharedCourseMockMvc
                .perform(get("/api/shared-courses/qrcode/{qrcode}",
                        sc.getSharedCourseQrCodes().iterator().next().getQrCode()))
                .andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE))
                .andExpect(jsonPath("$.title").value(QrCodeTimestampExpiredException.QR_CODE_TIMESTAMP_EXPIRED));
    }
    
    @Test
    @Transactional
    public void getNonExistingSharedCourse() throws Exception {
        // Get the sharedCourse
        restSharedCourseMockMvc.perform(get("/api/shared-courses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSharedCourse() throws Exception {
        // Initialize the database
        sharedCourseRepository.saveAndFlush(sharedCourse);

        int databaseSizeBeforeUpdate = sharedCourseRepository.findAll().size();

        // Update the sharedCourse
        SharedCourse updatedSharedCourse = sharedCourseRepository.findById(sharedCourse.getId()).get();
        // Disconnect from session so that the updates on updatedSharedCourse are not directly saved in db
        em.detach(updatedSharedCourse);
        updatedSharedCourse
            .name(UPDATED_NAME)
            .qrCode(UPDATED_QR_CODE)
            .gameModus(UPDATED_GAME_MODUS)
            .timeStampShared(UPDATED_TIME_STAMP_SHARED)
            .visible(UPDATED_VISIBLE)
            .timeStampStart(UPDATED_TIME_STAMP_START)
            .timeStampEnd(UPDATED_TIME_STAMP_END)
            .numberOfCustomQrCodes(UPDATED_NUMBER_OF_CUSTOM_QR_CODES)
            .showCourseBeforeStart(UPDATED_SHOW_COURSE_BEFORE_START)
            .showPositionAllowed(UPDATED_SHOW_POSITION_ALLOWED);

        restSharedCourseMockMvc.perform(put("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSharedCourse)))
            .andExpect(status().isOk());

        // Validate the SharedCourse in the database
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeUpdate);
        SharedCourse testSharedCourse = sharedCourseList.get(sharedCourseList.size() - 1);
        assertThat(testSharedCourse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSharedCourse.getQrCode()).isEqualTo(UPDATED_QR_CODE);
        assertThat(testSharedCourse.getGameModus()).isEqualTo(UPDATED_GAME_MODUS);
        assertThat(testSharedCourse.getTimeStampShared()).isEqualTo(UPDATED_TIME_STAMP_SHARED);
        assertThat(testSharedCourse.isVisible()).isEqualTo(UPDATED_VISIBLE);
        assertThat(testSharedCourse.getTimeStampStart()).isEqualTo(UPDATED_TIME_STAMP_START);
        assertThat(testSharedCourse.getTimeStampEnd()).isEqualTo(UPDATED_TIME_STAMP_END);
        assertThat(testSharedCourse.getNumberOfCustomQrCodes()).isEqualTo(UPDATED_NUMBER_OF_CUSTOM_QR_CODES);
        assertThat(testSharedCourse.isShowCourseBeforeStart()).isEqualTo(UPDATED_SHOW_COURSE_BEFORE_START);
        assertThat(testSharedCourse.isShowPositionAllowed()).isEqualTo(UPDATED_SHOW_POSITION_ALLOWED);
    }

    @Test
    @Transactional
    public void updateNonExistingSharedCourse() throws Exception {
        int databaseSizeBeforeUpdate = sharedCourseRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSharedCourseMockMvc.perform(put("/api/shared-courses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sharedCourse)))
            .andExpect(status().isBadRequest());

        // Validate the SharedCourse in the database
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSharedCourse() throws Exception {
        // Initialize the database
        sharedCourseRepository.saveAndFlush(sharedCourse);

        int databaseSizeBeforeDelete = sharedCourseRepository.findAll().size();

        // Delete the sharedCourse
        restSharedCourseMockMvc.perform(delete("/api/shared-courses/{id}", sharedCourse.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SharedCourse> sharedCourseList = sharedCourseRepository.findAll();
        assertThat(sharedCourseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
