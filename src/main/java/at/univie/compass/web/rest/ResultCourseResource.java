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

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

import org.apache.commons.lang3.RandomStringUtils;
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
import at.univie.compass.domain.ResultAnswer;
import at.univie.compass.domain.ResultControlpoint;
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.domain.ResultQuestion;
import at.univie.compass.repository.ResultCourseRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.util.ZipperUtil;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.ResultCourse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultCourseResource {

    private final Logger log = LoggerFactory.getLogger(ResultCourseResource.class);

    private static final String ENTITY_NAME = "resultCourse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultCourseRepository resultCourseRepository;
    
    @PersistenceContext
    EntityManager em;
    
    public ResultCourseResource(ResultCourseRepository resultCourseRepository) {
        this.resultCourseRepository = resultCourseRepository;
    }
    
    /**
     * {@code POST  /result-courses} : Create a new resultCourse.
     *
     * @param resultCourse the resultCourse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultCourse, or with status {@code 400 (Bad Request)} if the resultCourse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/result-courses")
    public ResponseEntity<ResultCourse> createResultCourse(@Valid @RequestBody ResultCourse resultCourse) throws URISyntaxException {
        log.trace("REST request to save ResultCourse : {}", resultCourse);
        if (resultCourse.getId() != null) {
            throw new BadRequestAlertException("A new resultCourse cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (resultCourse.getResultControlpoints() != null) {
            for (ResultControlpoint rcp : resultCourse.getResultControlpoints()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                rcp.setResultCourse(resultCourse);
                
                for (ResultQuestion rq : rcp.getResultQuestions()) {
                    for (ResultAnswer ra : rq.getResultAnswers()) {
                        ra.setResultQuestion(rq);
                    }
                }
            }
        }

        if (resultCourse.getResultAdditionalinfo() != null) {
            // compress base64 gpx
            final ResultAdditionalInfo resultAdditionalInfo = resultCourse.getResultAdditionalinfo();
            
            if (resultAdditionalInfo.getGpxTrack() != null
                    && StringUtils.equals("application/xml", resultAdditionalInfo.getGpxTrackContentType())) {
                try {
                    resultAdditionalInfo.setGpxTrack(ZipperUtil.compress(resultAdditionalInfo.getGpxTrack()));
                    resultAdditionalInfo.setGpxTrackContentType("application/zip");
                } catch (IOException e) {
                    log.error("zipping of xml failed", e);
                }
            }

            // compress base64 heartrate
            if (resultAdditionalInfo.getHeartRate() != null
                    && StringUtils.equals("application/xml", resultAdditionalInfo.getHeartRateContentType())) {
                try {
                    resultAdditionalInfo.setHeartRate(ZipperUtil.compress(resultAdditionalInfo.getHeartRate()));
                    resultAdditionalInfo.setHeartRateContentType("application/zip");
                } catch (IOException e) {
                    log.error("zipping of xml failed", e);
                }
            }
        }
        
        resultCourse.getSharedCourse().setVisible(Boolean.TRUE);
        resultCourse.setViewCode(RandomStringUtils.randomAlphanumeric(5).toLowerCase()); // generate alphanumeric code
        ResultCourse result = resultCourseRepository.save(resultCourse);
        
        return ResponseEntity.created(new URI("/api/result-courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /result-courses} : Updates an existing resultCourse.
     *
     * @param resultCourse the resultCourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultCourse,
     * or with status {@code 400 (Bad Request)} if the resultCourse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultCourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/result-courses")
    public ResponseEntity<ResultCourse> updateResultCourse(@Valid @RequestBody ResultCourse resultCourse) throws URISyntaxException {
        log.trace("REST request to update ResultCourse : {}", resultCourse);
        if (resultCourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<ResultCourse> old =resultCourseRepository.findById(resultCourse.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        if (resultCourse.getResultControlpoints() != null) {
            for (ResultControlpoint rcp : resultCourse.getResultControlpoints()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                rcp.setResultCourse(resultCourse);
            }
        }

        ResultCourse result = resultCourseRepository.save(resultCourse);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultCourse.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /result-courses} : get all the resultCourses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultCourses in body.
     */
    @GetMapping("/result-courses")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<ResultCourse> getAllResultCourses() {
        log.trace("REST request to get all ResultCourses");
        return resultCourseRepository.findAll();
    }

    /**
     * {@code GET  /result-courses/:id} : get the "id" resultCourse.
     *
     * @param id the id of the resultCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-courses/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ResultCourse> getResultCourse(@PathVariable Long id, @RequestParam(required = false, defaultValue = "false") boolean addinfo) {
        log.trace("REST request to get ResultCourse : {}", id);
        Optional<ResultCourse> resultCourse = resultCourseRepository.findById(id);
        
        // Default everything is lazy
        if (resultCourse.isPresent()) {
            
            if (!SecurityUtils.isDataAccessAllowed(resultCourse.get().getSharedCourse().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }
            
            // eager fetch resultControlpoints
            resultCourse.get().getResultControlpoints().size();
            
            if (addinfo) {
                // eager fetch ResultAdditionalInfo
                ResultAdditionalInfo rai = em.find(ResultAdditionalInfo.class, resultCourse.get().getResultAdditionalinfo().getId());
                
                // unzipp xml data
                if (rai != null) {
                    if (StringUtils.equals("application/zip", rai.getGpxTrackContentType())) {
                        try {
                            rai.setGpxTrack(ZipperUtil.decompress(rai.getGpxTrack()));
                            rai.setGpxTrackContentType("application/xml");
                        } catch (Exception e) {
                            log.error("unzipping of xml failed", e);
                        }
                    }

                    if (StringUtils.equals("application/zip", rai.getHeartRateContentType())) {
                        try {
                            rai.setHeartRate(ZipperUtil.decompress(rai.getHeartRate()));
                            rai.setHeartRateContentType("application/xml");
                        } catch (Exception e) {
                            log.error("unzipping of xml failed", e);
                        }
                    }
                }
                
                resultCourse.get().setResultAdditionalinfo(rai);
            }

            // do not return parent data
            resultCourse.get().setSharedCourse(null);
            
            // necessary otherwise the ids null would be saved in the db
            em.detach(resultCourse.get());
        }
        
        return ResponseUtil.wrapOrNotFound(resultCourse);
    }
    
    /**
     * {@code DELETE  /result-courses/:id} : delete the "id" resultCourse.
     *
     * @param id the id of the resultCourse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/result-courses/{id}")
    public ResponseEntity<Void> deleteResultCourse(@PathVariable Long id) {
        log.trace("REST request to delete ResultCourse : {}", id);

        Optional<ResultCourse> resultCourse = resultCourseRepository.findById(id);
        
        if (resultCourse.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(resultCourse.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            resultCourseRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
