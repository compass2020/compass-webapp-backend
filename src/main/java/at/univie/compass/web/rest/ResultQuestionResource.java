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

import at.univie.compass.domain.ResultAnswer;
import at.univie.compass.domain.ResultQuestion;
import at.univie.compass.repository.ResultQuestionRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.ResultQuestion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultQuestionResource {

    private final Logger log = LoggerFactory.getLogger(ResultQuestionResource.class);

    private static final String ENTITY_NAME = "resultQuestion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultQuestionRepository resultQuestionRepository;

    public ResultQuestionResource(ResultQuestionRepository resultQuestionRepository) {
        this.resultQuestionRepository = resultQuestionRepository;
    }

    /**
     * {@code POST  /result-questions} : Create a new resultQuestion.
     *
     * @param resultQuestion the resultQuestion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultQuestion, or with status {@code 400 (Bad Request)} if the resultQuestion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/result-questions")
    public ResponseEntity<ResultQuestion> createResultQuestion(@Valid @RequestBody ResultQuestion resultQuestion) throws URISyntaxException {
        log.trace("REST request to save ResultQuestion : {}", resultQuestion);
        if (resultQuestion.getId() != null) {
            throw new BadRequestAlertException("A new resultQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        if (resultQuestion.getResultAnswers() != null) {
            for ( ResultAnswer ra : resultQuestion.getResultAnswers()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                ra.setResultQuestion(resultQuestion);
            }
        }
        
        ResultQuestion result = resultQuestionRepository.save(resultQuestion);
        return ResponseEntity.created(new URI("/api/result-questions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /result-questions} : Updates an existing resultQuestion.
     *
     * @param resultQuestion the resultQuestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultQuestion,
     * or with status {@code 400 (Bad Request)} if the resultQuestion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultQuestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/result-questions")
    public ResponseEntity<ResultQuestion> updateResultQuestion(@Valid @RequestBody ResultQuestion resultQuestion) throws URISyntaxException {
        log.trace("REST request to update ResultQuestion : {}", resultQuestion);
        if (resultQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<ResultQuestion> old = resultQuestionRepository.findById(resultQuestion.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        if (resultQuestion.getResultAnswers() != null) {
            for ( ResultAnswer ra : resultQuestion.getResultAnswers()) {
                // This is necessary for Hibernate Cascade persist. Parent/Child so childs get parent ids on insert
                ra.setResultQuestion(resultQuestion);
            }
        }
        
        ResultQuestion result = resultQuestionRepository.save(resultQuestion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultQuestion.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /result-questions} : get all the resultQuestions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultQuestions in body.
     */
    @GetMapping("/result-questions")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<ResultQuestion> getAllResultQuestions() {
        log.trace("REST request to get all ResultQuestions");
        return resultQuestionRepository.findAll();
    }

    /**
     * {@code GET  /result-questions/:id} : get the "id" resultQuestion.
     *
     * @param id the id of the resultQuestion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultQuestion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-questions/{id}")
    public ResponseEntity<ResultQuestion> getResultQuestion(@PathVariable Long id) {
        log.trace("REST request to get ResultQuestion : {}", id);
        Optional<ResultQuestion> resultQuestion = resultQuestionRepository.findById(id);
        
        if (resultQuestion.isPresent() && !SecurityUtils.isDataAccessAllowed(resultQuestion.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        return ResponseUtil.wrapOrNotFound(resultQuestion);
    }

    /**
     * {@code DELETE  /result-questions/:id} : delete the "id" resultQuestion.
     *
     * @param id the id of the resultQuestion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/result-questions/{id}")
    public ResponseEntity<Void> deleteResultQuestion(@PathVariable Long id) {
        log.trace("REST request to delete ResultQuestion : {}", id);

        Optional<ResultQuestion> resultQuestion = resultQuestionRepository.findById(id);
        
        if (resultQuestion.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(resultQuestion.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            resultQuestionRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
