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
import at.univie.compass.repository.ResultAnswerRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.ResultAnswer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultAnswerResource {

    private final Logger log = LoggerFactory.getLogger(ResultAnswerResource.class);

    private static final String ENTITY_NAME = "resultAnswer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultAnswerRepository resultAnswerRepository;

    public ResultAnswerResource(ResultAnswerRepository resultAnswerRepository) {
        this.resultAnswerRepository = resultAnswerRepository;
    }

    /**
     * {@code POST  /result-answers} : Create a new resultAnswer.
     *
     * @param resultAnswer the resultAnswer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultAnswer, or with status {@code 400 (Bad Request)} if the resultAnswer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/result-answers")
    public ResponseEntity<ResultAnswer> createResultAnswer(@Valid @RequestBody ResultAnswer resultAnswer) throws URISyntaxException {
        log.trace("REST request to save ResultAnswer : {}", resultAnswer);
        if (resultAnswer.getId() != null) {
            throw new BadRequestAlertException("A new resultAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        if (!SecurityUtils.isDataAccessAllowed(resultAnswer.getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        ResultAnswer result = resultAnswerRepository.save(resultAnswer);
        return ResponseEntity.created(new URI("/api/result-answers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /result-answers} : Updates an existing resultAnswer.
     *
     * @param resultAnswer the resultAnswer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultAnswer,
     * or with status {@code 400 (Bad Request)} if the resultAnswer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultAnswer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/result-answers")
    public ResponseEntity<ResultAnswer> updateResultAnswer(@Valid @RequestBody ResultAnswer resultAnswer) throws URISyntaxException {
        log.trace("REST request to update ResultAnswer : {}", resultAnswer);
        if (resultAnswer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<ResultAnswer> old = resultAnswerRepository.findById(resultAnswer.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        ResultAnswer result = resultAnswerRepository.save(resultAnswer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultAnswer.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /result-answers} : get all the resultAnswers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultAnswers in body.
     */
    @GetMapping("/result-answers")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<ResultAnswer> getAllResultAnswers() {
        log.trace("REST request to get all ResultAnswers");
        return resultAnswerRepository.findAll();
    }

    /**
     * {@code GET  /result-answers/:id} : get the "id" resultAnswer.
     *
     * @param id the id of the resultAnswer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultAnswer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-answers/{id}")
    public ResponseEntity<ResultAnswer> getResultAnswer(@PathVariable Long id) {
        log.trace("REST request to get ResultAnswer : {}", id);
        Optional<ResultAnswer> resultAnswer = resultAnswerRepository.findById(id);
        
        if (resultAnswer.isPresent() && !SecurityUtils.isDataAccessAllowed(resultAnswer.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        return ResponseUtil.wrapOrNotFound(resultAnswer);
    }

    /**
     * {@code DELETE  /result-answers/:id} : delete the "id" resultAnswer.
     *
     * @param id the id of the resultAnswer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/result-answers/{id}")
    public ResponseEntity<Void> deleteResultAnswer(@PathVariable Long id) {
        log.trace("REST request to delete ResultAnswer : {}", id);

        Optional<ResultAnswer> resultAnswer = resultAnswerRepository.findById(id);
        
        if (resultAnswer.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(resultAnswer.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            resultAnswerRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
