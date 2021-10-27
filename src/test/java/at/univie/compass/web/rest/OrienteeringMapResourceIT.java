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
import at.univie.compass.domain.OrienteeringMap;
import at.univie.compass.repository.OrienteeringMapRepository;
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
 * Integration tests for the {@link OrienteeringMapResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrienteeringMapResourceIT {

    private static final byte[] DEFAULT_MAP_OVERLAY_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_MAP_OVERLAY_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_MAP_OVERLAY_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_MAP_OVERLAY_IMAGE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_MAP_OVERLAY_KML = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_MAP_OVERLAY_KML = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_MAP_OVERLAY_KML_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_MAP_OVERLAY_KML_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_MAP_FINAL = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_MAP_FINAL = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_MAP_FINAL_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_MAP_FINAL_CONTENT_TYPE = "image/png";

    private static final Double DEFAULT_IMAGE_SCALE_X = 1D;
    private static final Double UPDATED_IMAGE_SCALE_X = 2D;

    private static final Double DEFAULT_IMAGE_SCALE_Y = 1D;
    private static final Double UPDATED_IMAGE_SCALE_Y = 2D;

    private static final Double DEFAULT_IMAGE_CENTER_X = 1D;
    private static final Double UPDATED_IMAGE_CENTER_X = 2D;

    private static final Double DEFAULT_IMAGE_CENTER_Y = 1D;
    private static final Double UPDATED_IMAGE_CENTER_Y = 2D;

    private static final Double DEFAULT_IMAGE_ROTATION = 1D;
    private static final Double UPDATED_IMAGE_ROTATION = 2D;

    private static final Double DEFAULT_DECLINATION = 1D;
    private static final Double UPDATED_DECLINATION = 2D;

    @Autowired
    private OrienteeringMapRepository orienteeringMapRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrienteeringMapMockMvc;

    private OrienteeringMap orienteeringMap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrienteeringMap createEntity(EntityManager em) {
        OrienteeringMap orienteeringMap = new OrienteeringMap()
            .mapOverlayImage(DEFAULT_MAP_OVERLAY_IMAGE)
            .mapOverlayImageContentType(DEFAULT_MAP_OVERLAY_IMAGE_CONTENT_TYPE)
            .mapOverlayKml(DEFAULT_MAP_OVERLAY_KML)
            .mapOverlayKmlContentType(DEFAULT_MAP_OVERLAY_KML_CONTENT_TYPE)
            .imageScaleX(DEFAULT_IMAGE_SCALE_X)
            .imageScaleY(DEFAULT_IMAGE_SCALE_Y)
            .imageCenterX(DEFAULT_IMAGE_CENTER_X)
            .imageCenterY(DEFAULT_IMAGE_CENTER_Y)
            .imageRotation(DEFAULT_IMAGE_ROTATION)
            .declination(DEFAULT_DECLINATION);
        return orienteeringMap;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrienteeringMap createUpdatedEntity(EntityManager em) {
        OrienteeringMap orienteeringMap = new OrienteeringMap()
            .mapOverlayImage(UPDATED_MAP_OVERLAY_IMAGE)
            .mapOverlayImageContentType(UPDATED_MAP_OVERLAY_IMAGE_CONTENT_TYPE)
            .mapOverlayKml(UPDATED_MAP_OVERLAY_KML)
            .mapOverlayKmlContentType(UPDATED_MAP_OVERLAY_KML_CONTENT_TYPE)
            .imageScaleX(UPDATED_IMAGE_SCALE_X)
            .imageScaleY(UPDATED_IMAGE_SCALE_Y)
            .imageCenterX(UPDATED_IMAGE_CENTER_X)
            .imageCenterY(UPDATED_IMAGE_CENTER_Y)
            .imageRotation(UPDATED_IMAGE_ROTATION)
            .declination(UPDATED_DECLINATION);
        return orienteeringMap;
    }

    @BeforeEach
    public void initTest() {
        orienteeringMap = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrienteeringMap() throws Exception {
        int databaseSizeBeforeCreate = orienteeringMapRepository.findAll().size();
        // Create the OrienteeringMap
        restOrienteeringMapMockMvc.perform(post("/api/orienteering-maps")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orienteeringMap)))
            .andExpect(status().isCreated());

        // Validate the OrienteeringMap in the database
        List<OrienteeringMap> orienteeringMapList = orienteeringMapRepository.findAll();
        assertThat(orienteeringMapList).hasSize(databaseSizeBeforeCreate + 1);
        OrienteeringMap testOrienteeringMap = orienteeringMapList.get(orienteeringMapList.size() - 1);
        assertThat(testOrienteeringMap.getMapOverlayImage()).isEqualTo(DEFAULT_MAP_OVERLAY_IMAGE);
        assertThat(testOrienteeringMap.getMapOverlayImageContentType()).isEqualTo(DEFAULT_MAP_OVERLAY_IMAGE_CONTENT_TYPE);
        assertThat(testOrienteeringMap.getMapOverlayKml()).isEqualTo(DEFAULT_MAP_OVERLAY_KML);
        assertThat(testOrienteeringMap.getMapOverlayKmlContentType()).isEqualTo(DEFAULT_MAP_OVERLAY_KML_CONTENT_TYPE);
        assertThat(testOrienteeringMap.getImageScaleX()).isEqualTo(DEFAULT_IMAGE_SCALE_X);
        assertThat(testOrienteeringMap.getImageScaleY()).isEqualTo(DEFAULT_IMAGE_SCALE_Y);
        assertThat(testOrienteeringMap.getImageCenterX()).isEqualTo(DEFAULT_IMAGE_CENTER_X);
        assertThat(testOrienteeringMap.getImageCenterY()).isEqualTo(DEFAULT_IMAGE_CENTER_Y);
        assertThat(testOrienteeringMap.getImageRotation()).isEqualTo(DEFAULT_IMAGE_ROTATION);
        assertThat(testOrienteeringMap.getDeclination()).isEqualTo(DEFAULT_DECLINATION);
    }

    @Test
    @Transactional
    public void createOrienteeringMapWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orienteeringMapRepository.findAll().size();

        // Create the OrienteeringMap with an existing ID
        orienteeringMap.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrienteeringMapMockMvc.perform(post("/api/orienteering-maps")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orienteeringMap)))
            .andExpect(status().isBadRequest());

        // Validate the OrienteeringMap in the database
        List<OrienteeringMap> orienteeringMapList = orienteeringMapRepository.findAll();
        assertThat(orienteeringMapList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllOrienteeringMaps() throws Exception {
        // Initialize the database
        orienteeringMapRepository.saveAndFlush(orienteeringMap);

        // Get all the orienteeringMapList
        restOrienteeringMapMockMvc.perform(get("/api/orienteering-maps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orienteeringMap.getId().intValue())))
            .andExpect(jsonPath("$.[*].mapOverlayImageContentType").value(hasItem(DEFAULT_MAP_OVERLAY_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].mapOverlayImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_MAP_OVERLAY_IMAGE))))
            .andExpect(jsonPath("$.[*].mapOverlayKmlContentType").value(hasItem(DEFAULT_MAP_OVERLAY_KML_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].mapOverlayKml").value(hasItem(Base64Utils.encodeToString(DEFAULT_MAP_OVERLAY_KML))))
            .andExpect(jsonPath("$.[*].imageScaleX").value(hasItem(DEFAULT_IMAGE_SCALE_X.doubleValue())))
            .andExpect(jsonPath("$.[*].imageScaleY").value(hasItem(DEFAULT_IMAGE_SCALE_Y.doubleValue())))
            .andExpect(jsonPath("$.[*].imageCenterX").value(hasItem(DEFAULT_IMAGE_CENTER_X.doubleValue())))
            .andExpect(jsonPath("$.[*].imageCenterY").value(hasItem(DEFAULT_IMAGE_CENTER_Y.doubleValue())))
            .andExpect(jsonPath("$.[*].imageRotation").value(hasItem(DEFAULT_IMAGE_ROTATION.doubleValue())))
            .andExpect(jsonPath("$.[*].declination").value(hasItem(DEFAULT_DECLINATION.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getOrienteeringMap() throws Exception {
        // Initialize the database
        orienteeringMapRepository.saveAndFlush(orienteeringMap);

        // Get the orienteeringMap
        restOrienteeringMapMockMvc.perform(get("/api/orienteering-maps/{id}", orienteeringMap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orienteeringMap.getId().intValue()))
            .andExpect(jsonPath("$.mapOverlayImageContentType").value(DEFAULT_MAP_OVERLAY_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.mapOverlayImage").value(Base64Utils.encodeToString(DEFAULT_MAP_OVERLAY_IMAGE)))
            .andExpect(jsonPath("$.mapOverlayKmlContentType").value(DEFAULT_MAP_OVERLAY_KML_CONTENT_TYPE))
            .andExpect(jsonPath("$.mapOverlayKml").value(Base64Utils.encodeToString(DEFAULT_MAP_OVERLAY_KML)))
            .andExpect(jsonPath("$.imageScaleX").value(DEFAULT_IMAGE_SCALE_X.doubleValue()))
            .andExpect(jsonPath("$.imageScaleY").value(DEFAULT_IMAGE_SCALE_Y.doubleValue()))
            .andExpect(jsonPath("$.imageCenterX").value(DEFAULT_IMAGE_CENTER_X.doubleValue()))
            .andExpect(jsonPath("$.imageCenterY").value(DEFAULT_IMAGE_CENTER_Y.doubleValue()))
            .andExpect(jsonPath("$.imageRotation").value(DEFAULT_IMAGE_ROTATION.doubleValue()))
            .andExpect(jsonPath("$.declination").value(DEFAULT_DECLINATION.doubleValue()));
    }
    @Test
    @Transactional
    public void getNonExistingOrienteeringMap() throws Exception {
        // Get the orienteeringMap
        restOrienteeringMapMockMvc.perform(get("/api/orienteering-maps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrienteeringMap() throws Exception {
        // Initialize the database
        orienteeringMapRepository.saveAndFlush(orienteeringMap);

        int databaseSizeBeforeUpdate = orienteeringMapRepository.findAll().size();

        // Update the orienteeringMap
        OrienteeringMap updatedOrienteeringMap = orienteeringMapRepository.findById(orienteeringMap.getId()).get();
        // Disconnect from session so that the updates on updatedOrienteeringMap are not directly saved in db
        em.detach(updatedOrienteeringMap);
        updatedOrienteeringMap
            .mapOverlayImage(UPDATED_MAP_OVERLAY_IMAGE)
            .mapOverlayImageContentType(UPDATED_MAP_OVERLAY_IMAGE_CONTENT_TYPE)
            .mapOverlayKml(UPDATED_MAP_OVERLAY_KML)
            .mapOverlayKmlContentType(UPDATED_MAP_OVERLAY_KML_CONTENT_TYPE)
            .imageScaleX(UPDATED_IMAGE_SCALE_X)
            .imageScaleY(UPDATED_IMAGE_SCALE_Y)
            .imageCenterX(UPDATED_IMAGE_CENTER_X)
            .imageCenterY(UPDATED_IMAGE_CENTER_Y)
            .imageRotation(UPDATED_IMAGE_ROTATION)
            .declination(UPDATED_DECLINATION);

        restOrienteeringMapMockMvc.perform(put("/api/orienteering-maps")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrienteeringMap)))
            .andExpect(status().isOk());

        // Validate the OrienteeringMap in the database
        List<OrienteeringMap> orienteeringMapList = orienteeringMapRepository.findAll();
        assertThat(orienteeringMapList).hasSize(databaseSizeBeforeUpdate);
        OrienteeringMap testOrienteeringMap = orienteeringMapList.get(orienteeringMapList.size() - 1);
        assertThat(testOrienteeringMap.getMapOverlayImage()).isEqualTo(UPDATED_MAP_OVERLAY_IMAGE);
        assertThat(testOrienteeringMap.getMapOverlayImageContentType()).isEqualTo(UPDATED_MAP_OVERLAY_IMAGE_CONTENT_TYPE);
        assertThat(testOrienteeringMap.getMapOverlayKml()).isEqualTo(UPDATED_MAP_OVERLAY_KML);
        assertThat(testOrienteeringMap.getMapOverlayKmlContentType()).isEqualTo(UPDATED_MAP_OVERLAY_KML_CONTENT_TYPE);
        assertThat(testOrienteeringMap.getImageScaleX()).isEqualTo(UPDATED_IMAGE_SCALE_X);
        assertThat(testOrienteeringMap.getImageScaleY()).isEqualTo(UPDATED_IMAGE_SCALE_Y);
        assertThat(testOrienteeringMap.getImageCenterX()).isEqualTo(UPDATED_IMAGE_CENTER_X);
        assertThat(testOrienteeringMap.getImageCenterY()).isEqualTo(UPDATED_IMAGE_CENTER_Y);
        assertThat(testOrienteeringMap.getImageRotation()).isEqualTo(UPDATED_IMAGE_ROTATION);
        assertThat(testOrienteeringMap.getDeclination()).isEqualTo(UPDATED_DECLINATION);
    }

    @Test
    @Transactional
    public void updateNonExistingOrienteeringMap() throws Exception {
        int databaseSizeBeforeUpdate = orienteeringMapRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrienteeringMapMockMvc.perform(put("/api/orienteering-maps")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orienteeringMap)))
            .andExpect(status().isBadRequest());

        // Validate the OrienteeringMap in the database
        List<OrienteeringMap> orienteeringMapList = orienteeringMapRepository.findAll();
        assertThat(orienteeringMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrienteeringMap() throws Exception {
        // Initialize the database
        orienteeringMapRepository.saveAndFlush(orienteeringMap);

        int databaseSizeBeforeDelete = orienteeringMapRepository.findAll().size();

        // Delete the orienteeringMap
        restOrienteeringMapMockMvc.perform(delete("/api/orienteering-maps/{id}", orienteeringMap.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrienteeringMap> orienteeringMapList = orienteeringMapRepository.findAll();
        assertThat(orienteeringMapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
