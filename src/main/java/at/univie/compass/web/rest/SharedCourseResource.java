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

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

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
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.Controlpoint;
import at.univie.compass.domain.Course;
import at.univie.compass.domain.OrienteeringMap;
import at.univie.compass.domain.Question;
import at.univie.compass.domain.ResultCourse;
import at.univie.compass.domain.SharedCourse;
import at.univie.compass.domain.SharedCourseQrCode;
import at.univie.compass.repository.CourseRepository;
import at.univie.compass.repository.SharedCourseQrCodeRepository;
import at.univie.compass.repository.SharedCourseRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.util.UUIDGenerator;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import at.univie.compass.web.rest.errors.CustomQrCodeAlreadyScannedException;
import at.univie.compass.web.rest.errors.QrCodeTimestampExpiredException;
import at.univie.compass.web.rest.errors.QrCodeTimestampNotReachedException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.SharedCourse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SharedCourseResource {

    private final Logger log = LoggerFactory.getLogger(SharedCourseResource.class);

    private static final String ENTITY_NAME = "sharedCourse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SharedCourseRepository sharedCourseRepository;
    private final SharedCourseQrCodeRepository sharedCourseQrCodeRepository;
    private final CourseRepository courseRepository;

    @PersistenceContext
    EntityManager em;
    
    public SharedCourseResource(SharedCourseRepository sharedCourseRepository,
            SharedCourseQrCodeRepository sharedCourseQrCodeRepository, CourseRepository courseRepository) {
        this.sharedCourseRepository = sharedCourseRepository;
        this.sharedCourseQrCodeRepository = sharedCourseQrCodeRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * {@code POST  /shared-courses} : Create a new sharedCourse.
     *
     * @param sharedCourse the sharedCourse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sharedCourse, or with status {@code 400 (Bad Request)} if the sharedCourse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shared-courses")
    public ResponseEntity<SharedCourse> createSharedCourse(@Valid @RequestBody SharedCourse sharedCourse) throws URISyntaxException {
        log.trace("REST request to save SharedCourse : {}", sharedCourse);
        if (sharedCourse.getId() != null) {
            throw new BadRequestAlertException("A new sharedCourse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        Optional<Course> course = courseRepository.findById(sharedCourse.getCourse().getId());
        if (course.isPresent() && !SecurityUtils.isDataAccessAllowed(course.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied: you are not owner of the course", ENTITY_NAME, "accessdenied");
        }
        
        if (sharedCourse.getResultCourses() != null) {
            for (ResultCourse rc : sharedCourse.getResultCourses()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                rc.setSharedCourse(sharedCourse);
            }
        }

        if (sharedCourse.getSharedCourseQrCodes() != null) {
            for (SharedCourseQrCode scrc : sharedCourse.getSharedCourseQrCodes()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                scrc.setSharedCourse(sharedCourse);
            }
        }
        
        // custom qrCodes erzeugen
        if (sharedCourse.getNumberOfCustomQrCodes() != null && sharedCourse.getNumberOfCustomQrCodes() > 0) {
            for(int i=0; i<sharedCourse.getNumberOfCustomQrCodes(); i++) {
                SharedCourseQrCode qrCode = new SharedCourseQrCode();
                qrCode.setQrCode(UUIDGenerator.generateType1UUID().toString());
                qrCode.setScanned(Boolean.FALSE);
                sharedCourse.addSharedCourseQrCode(qrCode);
            }
        }
        
        sharedCourse.setQrCode(UUIDGenerator.generateType1UUID().toString());
        sharedCourse.setVisible(Boolean.TRUE);
        course.get().setShared(true);
        
        SharedCourse result = sharedCourseRepository.save(sharedCourse);
        
        return ResponseEntity.created(new URI("/api/shared-courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shared-courses} : Updates an existing sharedCourse.
     *
     * @param sharedCourse the sharedCourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sharedCourse,
     * or with status {@code 400 (Bad Request)} if the sharedCourse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sharedCourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shared-courses")
    public ResponseEntity<SharedCourse> updateSharedCourse(@Valid @RequestBody SharedCourse sharedCourse) throws URISyntaxException {
        log.trace("REST request to update SharedCourse : {}", sharedCourse);
        if (sharedCourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<SharedCourse> old = sharedCourseRepository.findById(sharedCourse.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        if (sharedCourse.getResultCourses() != null) {
            for (ResultCourse rc : sharedCourse.getResultCourses()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                rc.setSharedCourse(sharedCourse);
            }
        }

        if (sharedCourse.getSharedCourseQrCodes() != null) {
            for (SharedCourseQrCode scrc : sharedCourse.getSharedCourseQrCodes()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                scrc.setSharedCourse(sharedCourse);
            }
        }
        
        SharedCourse result = sharedCourseRepository.save(sharedCourse);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sharedCourse.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shared-courses} : get all the sharedCourses 
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sharedCourses in body.
     */
    @GetMapping("/shared-courses")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<SharedCourse> getAllSharedCourses() {
        log.trace("REST request to get all SharedCourses");
        return sharedCourseRepository.findAll();
    }

    /**
     * {@code GET  /shared-courses/current} : get all the sharedCourses or current user (logged in).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sharedCourses in body.
     */
    @GetMapping("/shared-courses/current")
    public List<SharedCourse> getAllSharedCoursesForCurrentUser() {
        log.trace("REST request to get all SharedCourses");
        
        List<SharedCourse> sharedCoursesForCurrentUser = sharedCourseRepository.findByUserIsCurrentUser();
        
        for (SharedCourse sc : sharedCoursesForCurrentUser) {
            // eager fetch resultCourses
            sc.getResultCourses().size();
            
            for (ResultCourse rc : sc.getResultCourses()) {
                // do not reutrn parent data
                rc.setSharedCourse(null);
            }

            // necessary otherwise the ids null would be saved in the db
            em.detach(sc);
        }
        
        return sharedCoursesForCurrentUser;
    }
    
    /**
     * {@code GET  /shared-courses/course/:id} : get all the sharedCourses by courseId.
     *
     * @param id the id of the course for which the sharedCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sharedCourses in body.
     */
    @GetMapping("/shared-courses/course/{id}")
    public List<SharedCourse> getAllSharedCoursesForCourseId(@PathVariable Long id) {
        log.trace("REST request to get all SharedCourses");
        
        List<SharedCourse> sharedCoursesForCurrentUser = sharedCourseRepository.findByCourseIdAndCurrentUser(id);
        
        for (SharedCourse sc : sharedCoursesForCurrentUser) {
            // eager fetch resultCourses
            sc.getResultCourses().size();
            
            for (ResultCourse rc : sc.getResultCourses()) {
                // do not reutrn parent data
                rc.setSharedCourse(null);
            }

            // necessary otherwise the ids null would be saved in the db
            em.detach(sc);
        }
        
        return sharedCoursesForCurrentUser;
    }

    /**
     * {@code GET  /shared-courses/:id} : get the "id" sharedCourse.
     *
     * @param id the id of the sharedCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sharedCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shared-courses/{id}")
    public ResponseEntity<SharedCourse> getSharedCourse(@PathVariable Long id) {
        log.trace("REST request to get SharedCourse : {}", id);
        Optional<SharedCourse> sharedCourse = sharedCourseRepository.findById(id);

        // Default everything is lazy
        if (sharedCourse.isPresent()) {

            SharedCourse sc = sharedCourse.get();

            if (!SecurityUtils.isDataAccessAllowed(sc.getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            // eager fetch orienteeringMap
            OrienteeringMap om = em.find(OrienteeringMap.class, sc.getCourse().getOrienteeringMap().getId());
            sc.getCourse().setOrienteeringMap(om);

            // eager fetch controlpoints
            sc.getCourse().getControlpoints().size();

            // eager fetch questions
            for (Controlpoint cp : sc.getCourse().getControlpoints()) {
                cp.getQuestions().size();

                // eager fetch answers
                for (Question q : cp.getQuestions()) {
                    q.getAnswers().size();
                }
            }

            // eager fetch resultCourses
            sc.getResultCourses().size();

            for (ResultCourse rc : sc.getResultCourses()) {
                // eager fetch resultControlpoints
                rc.getResultControlpoints().size();
                
                // do not reutrn parent data
                rc.setSharedCourse(null);
            }

            // necessary otherwise the ids null would be saved in the db
            em.detach(sc);
        }

        return ResponseUtil.wrapOrNotFound(sharedCourse);
    }
    
    /**
     * {@code GET  /shared-courses/qrcodes/:id} : get the "id" sharedCourse.
     *
     * @param id the id of the sharedCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sharedCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shared-courses/qrcodes/{id}")
    public ResponseEntity<SharedCourse> getSharedCourseWithCustomQrCodes(@PathVariable Long id) {
        log.trace("REST request to getSharedCourseWithCustomQrCodes : {}", id);
        Optional<SharedCourse> sharedCourse = sharedCourseRepository.findById(id);
                
        // Default everything is lazy
        if (sharedCourse.isPresent()) {
            
            if (!SecurityUtils.isDataAccessAllowed(sharedCourse.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }
            
            sharedCourse.get().getSharedCourseQrCodes().size();
        }
        
        return ResponseUtil.wrapOrNotFound(sharedCourse);
    }
    
    /**
     * {@code GET  /shared-courses/:qrcode} : get the "qrcode" sharedCourse.
     *
     * @param id the qrcode of the sharedCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sharedCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shared-courses/qrcode/{qrcode}")
    public ResponseEntity<SharedCourse> getSharedCourseFromQrCode(@PathVariable String qrcode) {
        log.trace("REST request to get SharedCourse : {}", qrcode);
        
        SharedCourse sc = null;
        
        // try to find generic qrcode
        Optional<SharedCourse> sharedCourse = sharedCourseRepository.findOneByQrCode(qrcode);

        if (sharedCourse.isPresent()) {
            sc = sharedCourse.get();
        } else {
            // try to find custom qrcode
            Optional<SharedCourseQrCode> sharedCourseQrCode = sharedCourseQrCodeRepository.findOneByQrCode(qrcode);
            if (sharedCourseQrCode.isPresent()) {
                
                if (sharedCourseQrCode.get().isScanned()) {
                    throw new CustomQrCodeAlreadyScannedException();
                }
                
                sc = sharedCourseQrCode.get().getSharedCourse();
                sharedCourseQrCode.get().setScanned(Boolean.TRUE);
            }
        }
        
        
        // Default everything is lazy
        if (sc != null) {
            
            // check timestamp
            LocalDateTime currentDateTime = LocalDateTime.now();
            LocalDateTime startDateTime = sc.getTimeStampStart() != null ? sc.getTimeStampStart().toLocalDateTime()
                    : null;
            LocalDateTime endDateTime = sc.getTimeStampEnd() != null ? sc.getTimeStampEnd().toLocalDateTime() : null;
            
            log.debug("Check Timestamp of SharedCourse: now=" + currentDateTime + " startDate=" + startDateTime
                    + " endDate=" + endDateTime);
            
            if (startDateTime != null && currentDateTime.isBefore(startDateTime)) {
                throw new QrCodeTimestampNotReachedException(sc.getTimeStampStart().withZoneSameInstant(ZoneId.of("UTC"))
                        .format(DateTimeFormatter.ISO_DATE_TIME));
            } else if (endDateTime != null && currentDateTime.isAfter(endDateTime)) {
                throw new QrCodeTimestampExpiredException(sc.getTimeStampEnd().withZoneSameInstant(ZoneId.of("UTC"))
                        .format(DateTimeFormatter.ISO_DATE_TIME));
            }
            
            // eager fetch orienteeringMap
            OrienteeringMap om = em.find(OrienteeringMap.class, sc.getCourse().getOrienteeringMap().getId());
            sc.getCourse().setOrienteeringMap(om);

            // eager fetch controlpoints
            sc.getCourse().getControlpoints().size();

            // eager fetch questions and controlpointinfo
            for (Controlpoint cp : sc.getCourse().getControlpoints()) {
                cp.getQuestions().size();
                cp.getControlpointInfos().size();

                // eager fetch answers
                for (Question q : cp.getQuestions()) {
                    q.getAnswers().size();
                }
            }
        }
        
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sc));
    }


    /**
     * {@code DELETE  /shared-courses/:id} : delete the "id" sharedCourse.
     *
     * @param id the id of the sharedCourse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shared-courses/{id}")
    public ResponseEntity<Void> deleteSharedCourse(@PathVariable Long id) {
        log.trace("REST request to delete SharedCourse : {}", id);

        Optional<SharedCourse> sharedCourse = sharedCourseRepository.findById(id);
        
        if (sharedCourse.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(sharedCourse.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            sharedCourseRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
