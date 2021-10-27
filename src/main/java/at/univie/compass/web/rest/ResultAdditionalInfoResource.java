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

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.ResultAdditionalInfo;
import at.univie.compass.repository.ResultAdditionalInfoRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.util.ZipperUtil;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.ResultAdditionalInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultAdditionalInfoResource {

    private final Logger log = LoggerFactory.getLogger(ResultAdditionalInfoResource.class);

    private static final String ENTITY_NAME = "resultAdditionalInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultAdditionalInfoRepository resultAdditionalInfoRepository;

    public ResultAdditionalInfoResource(ResultAdditionalInfoRepository resultAdditionalInfoRepository) {
        this.resultAdditionalInfoRepository = resultAdditionalInfoRepository;
    }

    /**
     * {@code POST  /result-additional-infos} : Create a new resultAdditionalInfo.
     *
     * @param resultAdditionalInfo the resultAdditionalInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultAdditionalInfo, or with status {@code 400 (Bad Request)} if the resultAdditionalInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/result-additional-infos")
    public ResponseEntity<ResultAdditionalInfo> createResultAdditionalInfo(@Valid @RequestBody ResultAdditionalInfo resultAdditionalInfo) throws URISyntaxException {
        log.trace("REST request to save ResultAdditionalInfo : {}", resultAdditionalInfo);
        if (resultAdditionalInfo.getId() != null) {
            throw new BadRequestAlertException("A new resultAdditionalInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        // compress base64 gpx
        if (StringUtils.equals("application/xml", resultAdditionalInfo.getGpxTrackContentType())) {
            try {
                resultAdditionalInfo.setGpxTrack(ZipperUtil.compress(resultAdditionalInfo.getGpxTrack()));
                resultAdditionalInfo.setGpxTrackContentType("application/zip");
            } catch (IOException e) {
                log.error("zipping of xml failed", e);
            }
        }

        // compress base64 heartrate
        if (StringUtils.equals("application/xml", resultAdditionalInfo.getHeartRateContentType())) {
            try {
                resultAdditionalInfo.setHeartRate(ZipperUtil.compress(resultAdditionalInfo.getHeartRate()));
                resultAdditionalInfo.setHeartRateContentType("application/zip");
            } catch (IOException e) {
                log.error("zipping of xml failed", e);
            }
        }

        ResultAdditionalInfo result = resultAdditionalInfoRepository.save(resultAdditionalInfo);
        
        return ResponseEntity.created(new URI("/api/result-additional-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /result-additional-infos} : Updates an existing resultAdditionalInfo.
     *
     * @param resultAdditionalInfo the resultAdditionalInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultAdditionalInfo,
     * or with status {@code 400 (Bad Request)} if the resultAdditionalInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultAdditionalInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/result-additional-infos")
    public ResponseEntity<ResultAdditionalInfo> updateResultAdditionalInfo(@Valid @RequestBody ResultAdditionalInfo resultAdditionalInfo) throws URISyntaxException {
        log.trace("REST request to update ResultAdditionalInfo : {}", resultAdditionalInfo);
        if (resultAdditionalInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<ResultAdditionalInfo> old = resultAdditionalInfoRepository.findById(resultAdditionalInfo.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        ResultAdditionalInfo result = resultAdditionalInfoRepository.save(resultAdditionalInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultAdditionalInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /result-additional-infos} : get all the resultAdditionalInfos.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultAdditionalInfos in body.
     */
    @GetMapping("/result-additional-infos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<ResultAdditionalInfo> getAllResultAdditionalInfos(@RequestParam(required = false) String filter) {
        if ("resultcourse-is-null".equals(filter)) {
            log.trace("REST request to get all ResultAdditionalInfos where resultCourse is null");
            return StreamSupport
                .stream(resultAdditionalInfoRepository.findAll().spliterator(), false)
                .filter(resultAdditionalInfo -> resultAdditionalInfo.getResultCourse() == null)
                .collect(Collectors.toList());
        }
        log.trace("REST request to get all ResultAdditionalInfos");
        return resultAdditionalInfoRepository.findAll();
    }

    /**
     * {@code GET  /result-additional-infos/:id} : get the "id" resultAdditionalInfo.
     *
     * @param id the id of the resultAdditionalInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultAdditionalInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-additional-infos/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ResultAdditionalInfo> getResultAdditionalInfo(@PathVariable Long id) {
        log.trace("REST request to get ResultAdditionalInfo : {}", id);
        Optional<ResultAdditionalInfo> resultAdditionalInfo = resultAdditionalInfoRepository.findById(id);
        
        if (resultAdditionalInfo.isPresent() && !SecurityUtils.isDataAccessAllowed(resultAdditionalInfo.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        if (resultAdditionalInfo.isPresent()) {
            if (StringUtils.equals("application/zip", resultAdditionalInfo.get().getGpxTrackContentType())) {
                try {
                    resultAdditionalInfo.get().setGpxTrack(ZipperUtil.decompress(resultAdditionalInfo.get().getGpxTrack()));
                    resultAdditionalInfo.get().setGpxTrackContentType("application/xml");
                } catch (Exception e) {
                    log.error("unzipping of xml failed", e);
                }
            }

            if (StringUtils.equals("application/zip", resultAdditionalInfo.get().getHeartRateContentType())) {
                try {
                    resultAdditionalInfo.get().setHeartRate(ZipperUtil.decompress(resultAdditionalInfo.get().getHeartRate()));
                    resultAdditionalInfo.get().setHeartRateContentType("application/xml");
                } catch (Exception e) {
                    log.error("unzipping of xml failed", e);
                }
            }
        }
        
        return ResponseUtil.wrapOrNotFound(resultAdditionalInfo);
    }

    /**
     * {@code GET  /result-additional-infos/result-course/ :id} : get the "id" resultCourse.
     *
     * @param id the id of the result-course to retrieve the ResusltAdditionalInfo for.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultAdditionalInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-additional-infos/result-course/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ResultAdditionalInfo> getResultAdditionalInfoToResultCourse(@PathVariable Long id) {
        log.trace("REST request to getResultAdditionalInfoToResultCourse : {}", id);
        Optional<ResultAdditionalInfo> resultAdditionalInfo = resultAdditionalInfoRepository.findOneByResultCourseId(id);
        
        if (resultAdditionalInfo.isPresent() && !SecurityUtils
                .isDataAccessAllowed(resultAdditionalInfo.get().getResultCourse().getSharedCourse().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        if (resultAdditionalInfo.isPresent()) {
            if (StringUtils.equals("application/zip", resultAdditionalInfo.get().getGpxTrackContentType())) {
                try {
                    resultAdditionalInfo.get().setGpxTrack(ZipperUtil.decompress(resultAdditionalInfo.get().getGpxTrack()));
                    resultAdditionalInfo.get().setGpxTrackContentType("application/xml");
                } catch (Exception e) {
                    log.error("unzipping of xml failed", e);
                }
            }

            if (StringUtils.equals("application/zip", resultAdditionalInfo.get().getHeartRateContentType())) {
                try {
                    resultAdditionalInfo.get().setHeartRate(ZipperUtil.decompress(resultAdditionalInfo.get().getHeartRate()));
                    resultAdditionalInfo.get().setHeartRateContentType("application/xml");
                } catch (Exception e) {
                    log.error("unzipping of xml failed", e);
                }
            }
        }
        
        return ResponseUtil.wrapOrNotFound(resultAdditionalInfo);
    }

    /**
     * {@code DELETE  /result-additional-infos/:id} : delete the "id" resultAdditionalInfo.
     *
     * @param id the id of the resultAdditionalInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/result-additional-infos/{id}")
    public ResponseEntity<Void> deleteResultAdditionalInfo(@PathVariable Long id) {
        log.trace("REST request to delete ResultAdditionalInfo : {}", id);

        Optional<ResultAdditionalInfo> resultAdditionalInfo = resultAdditionalInfoRepository.findById(id);
        
        if (resultAdditionalInfo.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(resultAdditionalInfo.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            resultAdditionalInfoRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
