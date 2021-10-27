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
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
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
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.Controlpoint;
import at.univie.compass.domain.Course;
import at.univie.compass.domain.OrienteeringMap;
import at.univie.compass.domain.Question;
import at.univie.compass.domain.SharedCourse;
import at.univie.compass.repository.CourseRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.util.ImageCompressionUtil;
import at.univie.compass.util.UUIDGenerator;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.Course}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CourseResource {

    private final Logger log = LoggerFactory.getLogger(CourseResource.class);

    private static final String ENTITY_NAME = "course";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseRepository courseRepository;
    
    @PersistenceContext
    EntityManager em;

    public CourseResource(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * {@code POST  /courses} : Create a new course.
     *
     * @param course the course to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new course, or with status {@code 400 (Bad Request)} if the course has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) throws URISyntaxException {
        log.trace("REST request to save Course : {}", course);
        if (course.getId() != null) {
            throw new BadRequestAlertException("A new course cannot already have an ID", ENTITY_NAME, "idexists");
        }
        course.setShared(false);

        if (course.getControlpoints() != null) {
            for (Controlpoint cp : course.getControlpoints()) {
                if (StringUtils.isEmpty(cp.getQrCode())) {
                    cp.setQrCode(UUIDGenerator.generateType1UUID().toString());
                }
                
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                cp.setCourse(course);
            }
        }
        
        if (course.getSharedCourses() != null) {
            for (SharedCourse sc : course.getSharedCourses()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                sc.setCourse(course);
            }
        }
        
//        // Overlay Image komprimieren wenn jpeg format  
//        if (course.getOrienteeringMap() != null && course.getOrienteeringMap().getMapOverlayImage() != null
//                && course.getOrienteeringMap().getMapOverlayImageContentType() != null
//                && (course.getOrienteeringMap().getMapOverlayImageContentType().toLowerCase().contains("jpeg")
//                        || course.getOrienteeringMap().getMapOverlayImageContentType().toLowerCase().contains("jpg"))) {
//            OrienteeringMap orienteeringMap = course.getOrienteeringMap();
//
//            orienteeringMap.setMapOverlayImage(ImageCompressionUtil.convert(orienteeringMap.getMapOverlayImage()));
//            orienteeringMap.setMapOverlayImageContentType("image/jpeg");
//        }

        Course result = courseRepository.save(course);
        
        return ResponseEntity.created(new URI("/api/courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /courses} : Updates an existing course.
     *
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/courses")
    public ResponseEntity<Course> updateCourse(@Valid @RequestBody Course course) throws URISyntaxException {
        log.trace("REST request to update Course : {}", course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<Course> old = courseRepository.findById(course.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        if (course.getControlpoints() != null) {
            for (Controlpoint cp : course.getControlpoints()) {
                if (StringUtils.isEmpty(cp.getQrCode())) {
                    cp.setQrCode(UUIDGenerator.generateType1UUID().toString());
                }
                
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                cp.setCourse(course);
            }
        }
        
        if (course.getSharedCourses() != null) {
            for (SharedCourse sc : course.getSharedCourses()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                sc.setCourse(course);
            }
        }
        
        Course result = courseRepository.save(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<Course> getAllCourses() {
        log.trace("REST request to get all Courses");
        return courseRepository.findAll();
    }

    /**
     * {@code GET  /courses/current} : get all the courses for current user (logged in).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses/current")
    public List<Course> getAllCoursesForCurrentUser() {
        log.trace("REST request to get all Courses for current user");
        
        final List<Course> courses = courseRepository.findByUserIsCurrentUser();
        
        for (Course course : courses ) {
            // eager fetch controlpoints
            course.getControlpoints().size();
        }
        
        return courses;
    }

    /**
     * {@code GET  /courses/:username} : get all the courses for the specified username.
     *
     * @param username the username to retrieve the coruses for.
     * @return list of courses
     */
    @GetMapping("/courses/user/{username}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<Course> getCoursesForUsername(@PathVariable String username) {
        
        final List<Course> courses = courseRepository.findAllByCreatedByIs(username);
        
        for (Course course : courses ) {
            // eager fetch controlpoints
            course.getControlpoints().size();
        }
        
        return courses;
    }

    /**
     * {@code GET  /courses/:username} : get the "id" course.
     *
     * @param id the id of the course to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the course, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        log.trace("REST request to get Course : {}", id);
        Optional<Course> course = courseRepository.findById(id);
        
        // Default everything is lazy
        if (course.isPresent()) {
            
            if (!SecurityUtils.isDataAccessAllowed(course.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            // eager fetch controlpoints
            course.get().getControlpoints().size();

            // eager fetch questions
            for (Controlpoint cp : course.get().getControlpoints()) {
                cp.getQuestions().size();

                // eager fetch answers
                for (Question q : cp.getQuestions()) {
                    q.getAnswers().size();
                }
                
                // eager fetch controlpointinfos
                cp.getControlpointInfos().size();
            }

            // eager fetch orienteeringMap
            if (course.get().getOrienteeringMap() != null && course.get().getOrienteeringMap().getId() != null) {
                OrienteeringMap om = em.find(OrienteeringMap.class, course.get().getOrienteeringMap().getId());
                course.get().setOrienteeringMap(om);
            }
        }
        
        return ResponseUtil.wrapOrNotFound(course);
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" course.
     *
     * @param id the id of the course to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        log.trace("REST request to delete Course : {}", id);
        
        Optional<Course> course = courseRepository.findById(id);
        
        if (course.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(course.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            courseRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
