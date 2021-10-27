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
import at.univie.compass.domain.ControlpointInfo;
import at.univie.compass.domain.Controlpoint;
import at.univie.compass.repository.ControlpointInfoRepository;

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

import at.univie.compass.domain.enumeration.ControlpointInfoColumn;
/**
 * Integration tests for the {@link ControlpointInfoResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ControlpointInfoResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final ControlpointInfoColumn DEFAULT_COL = ControlpointInfoColumn.C;
    private static final ControlpointInfoColumn UPDATED_COL = ControlpointInfoColumn.D;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE_KEY = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_KEY = "BBBBBBBBBB";

    private static final Integer DEFAULT_SORT = 1;
    private static final Integer UPDATED_SORT = 2;

    @Autowired
    private ControlpointInfoRepository controlpointInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restControlpointInfoMockMvc;

    private ControlpointInfo controlpointInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ControlpointInfo createEntity(EntityManager em) {
        ControlpointInfo controlpointInfo = new ControlpointInfo()
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .col(DEFAULT_COL)
            .description(DEFAULT_DESCRIPTION)
            .messageKey(DEFAULT_MESSAGE_KEY)
            .sort(DEFAULT_SORT);
        // Add required entity
        Controlpoint controlpoint;
        if (TestUtil.findAll(em, Controlpoint.class).isEmpty()) {
            controlpoint = ControlpointResourceIT.createEntity(em);
            em.persist(controlpoint);
            em.flush();
        } else {
            controlpoint = TestUtil.findAll(em, Controlpoint.class).get(0);
        }
        controlpointInfo.getControlpoints().add(controlpoint);
        return controlpointInfo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ControlpointInfo createUpdatedEntity(EntityManager em) {
        ControlpointInfo controlpointInfo = new ControlpointInfo()
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .col(UPDATED_COL)
            .description(UPDATED_DESCRIPTION)
            .messageKey(UPDATED_MESSAGE_KEY)
            .sort(UPDATED_SORT);
        // Add required entity
        Controlpoint controlpoint;
        if (TestUtil.findAll(em, Controlpoint.class).isEmpty()) {
            controlpoint = ControlpointResourceIT.createUpdatedEntity(em);
            em.persist(controlpoint);
            em.flush();
        } else {
            controlpoint = TestUtil.findAll(em, Controlpoint.class).get(0);
        }
        controlpointInfo.getControlpoints().add(controlpoint);
        return controlpointInfo;
    }

    @BeforeEach
    public void initTest() {
        controlpointInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createControlpointInfo() throws Exception {
        int databaseSizeBeforeCreate = controlpointInfoRepository.findAll().size();
        // Create the ControlpointInfo
        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isCreated());

        // Validate the ControlpointInfo in the database
        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeCreate + 1);
        ControlpointInfo testControlpointInfo = controlpointInfoList.get(controlpointInfoList.size() - 1);
        assertThat(testControlpointInfo.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testControlpointInfo.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testControlpointInfo.getCol()).isEqualTo(DEFAULT_COL);
        assertThat(testControlpointInfo.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testControlpointInfo.getMessageKey()).isEqualTo(DEFAULT_MESSAGE_KEY);
        assertThat(testControlpointInfo.getSort()).isEqualTo(DEFAULT_SORT);
    }

    @Test
    @Transactional
    public void createControlpointInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = controlpointInfoRepository.findAll().size();

        // Create the ControlpointInfo with an existing ID
        controlpointInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        // Validate the ControlpointInfo in the database
        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkColIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointInfoRepository.findAll().size();
        // set the field null
        controlpointInfo.setCol(null);

        // Create the ControlpointInfo, which fails.


        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointInfoRepository.findAll().size();
        // set the field null
        controlpointInfo.setDescription(null);

        // Create the ControlpointInfo, which fails.


        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMessageKeyIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointInfoRepository.findAll().size();
        // set the field null
        controlpointInfo.setMessageKey(null);

        // Create the ControlpointInfo, which fails.


        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSortIsRequired() throws Exception {
        int databaseSizeBeforeTest = controlpointInfoRepository.findAll().size();
        // set the field null
        controlpointInfo.setSort(null);

        // Create the ControlpointInfo, which fails.


        restControlpointInfoMockMvc.perform(post("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllControlpointInfos() throws Exception {
        // Initialize the database
        controlpointInfoRepository.saveAndFlush(controlpointInfo);

        // Get all the controlpointInfoList
        restControlpointInfoMockMvc.perform(get("/api/controlpoint-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(controlpointInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].col").value(hasItem(DEFAULT_COL.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].messageKey").value(hasItem(DEFAULT_MESSAGE_KEY)))
            .andExpect(jsonPath("$.[*].sort").value(hasItem(DEFAULT_SORT)));
    }
    
    @Test
    @Transactional
    public void getControlpointInfo() throws Exception {
        // Initialize the database
        controlpointInfoRepository.saveAndFlush(controlpointInfo);

        // Get the controlpointInfo
        restControlpointInfoMockMvc.perform(get("/api/controlpoint-infos/{id}", controlpointInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(controlpointInfo.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.col").value(DEFAULT_COL.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.messageKey").value(DEFAULT_MESSAGE_KEY))
            .andExpect(jsonPath("$.sort").value(DEFAULT_SORT));
    }
    @Test
    @Transactional
    public void getNonExistingControlpointInfo() throws Exception {
        // Get the controlpointInfo
        restControlpointInfoMockMvc.perform(get("/api/controlpoint-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateControlpointInfo() throws Exception {
        // Initialize the database
        controlpointInfoRepository.saveAndFlush(controlpointInfo);

        int databaseSizeBeforeUpdate = controlpointInfoRepository.findAll().size();

        // Update the controlpointInfo
        ControlpointInfo updatedControlpointInfo = controlpointInfoRepository.findById(controlpointInfo.getId()).get();
        // Disconnect from session so that the updates on updatedControlpointInfo are not directly saved in db
        em.detach(updatedControlpointInfo);
        updatedControlpointInfo
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .col(UPDATED_COL)
            .description(UPDATED_DESCRIPTION)
            .messageKey(UPDATED_MESSAGE_KEY)
            .sort(UPDATED_SORT);

        restControlpointInfoMockMvc.perform(put("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedControlpointInfo)))
            .andExpect(status().isOk());

        // Validate the ControlpointInfo in the database
        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeUpdate);
        ControlpointInfo testControlpointInfo = controlpointInfoList.get(controlpointInfoList.size() - 1);
        assertThat(testControlpointInfo.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testControlpointInfo.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testControlpointInfo.getCol()).isEqualTo(UPDATED_COL);
        assertThat(testControlpointInfo.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testControlpointInfo.getMessageKey()).isEqualTo(UPDATED_MESSAGE_KEY);
        assertThat(testControlpointInfo.getSort()).isEqualTo(UPDATED_SORT);
    }

    @Test
    @Transactional
    public void updateNonExistingControlpointInfo() throws Exception {
        int databaseSizeBeforeUpdate = controlpointInfoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restControlpointInfoMockMvc.perform(put("/api/controlpoint-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(controlpointInfo)))
            .andExpect(status().isBadRequest());

        // Validate the ControlpointInfo in the database
        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteControlpointInfo() throws Exception {
        // Initialize the database
        controlpointInfoRepository.saveAndFlush(controlpointInfo);

        int databaseSizeBeforeDelete = controlpointInfoRepository.findAll().size();

        // Delete the controlpointInfo
        restControlpointInfoMockMvc.perform(delete("/api/controlpoint-infos/{id}", controlpointInfo.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ControlpointInfo> controlpointInfoList = controlpointInfoRepository.findAll();
        assertThat(controlpointInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
