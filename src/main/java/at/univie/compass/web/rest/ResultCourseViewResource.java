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

import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.Controlpoint;
import at.univie.compass.domain.Course;
import at.univie.compass.domain.OrienteeringMap;
import at.univie.compass.domain.Question;
import at.univie.compass.domain.ResultAdditionalInfo;
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.repository.ResultCourseRepository;
import at.univie.compass.util.ZipperUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing unsecured {@link at.univie.compass.domain.ResultCourse}.
 * 
 * There is no autentification requiered for this requests. see also {@link at.univie.compass.config.SecurityConfiguration}.
 */
@RestController
@RequestMapping("/view")
@Transactional
public class ResultCourseViewResource {

    private final Logger log = LoggerFactory.getLogger(ResultCourseViewResource.class);

    private final ResultCourseRepository resultCourseRepository;
    
    @PersistenceContext
    EntityManager em;
    
    public ResultCourseViewResource(ResultCourseRepository resultCourseRepository) {
        this.resultCourseRepository = resultCourseRepository;
    }
        
    /**
     * {@code GET  /result-courses/viewcode/:sharedCourseId/:viewCode : get the resultCourse to the "sharedCourseId" and "viewCode".
     *
     * @param sharedCourseId the sharedCourseId of the ResultCourse
     * @param viewCode the viewCode of the ResultCourse
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-courses/viewcode/{sharedCourseId}/{viewCode}")
    @Transactional(readOnly = true)
    public ResponseEntity<ResultCourse> getResultCoursesFromCode(@PathVariable Long sharedCourseId, @PathVariable String viewCode, @RequestParam(required = false, defaultValue = "true") boolean fetchCourse) {
        
        Optional<ResultCourse> resultCourse = resultCourseRepository.findOneBySharedCourseIdAndViewCode(sharedCourseId, viewCode);
         
        if ( resultCourse.isPresent()) {         
            
            resultCourse.get().getResultControlpoints().size();
            
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

            if (fetchCourse) {

                // eager fetch sharedCourse, course, resultControlpoints
                Course course = resultCourse.get().getSharedCourse().getCourse();
                course.getControlpoints().size();
                
                // eager fetch orienteeringMap
                if (course.getOrienteeringMap() != null && course.getOrienteeringMap().getId() != null) {
                    OrienteeringMap om = em.find(OrienteeringMap.class, course.getOrienteeringMap().getId());
                    course.setOrienteeringMap(om);
                }
                
                // eager fetch questions
                for (Controlpoint cp : course.getControlpoints()) {
                    cp.getQuestions().size();

                    // eager fetch answers
                    for (Question q : cp.getQuestions()) {
                        q.getAnswers().size();
                    }
                }

            } else {
                // do not return parent data
                resultCourse.get().setSharedCourse(null);
            }
            
            // Achtung nach detach kein lazy loading mehr möglich
            em.detach(resultCourse.get());
        }
        
        return ResponseUtil.wrapOrNotFound(resultCourse);
    }
}
