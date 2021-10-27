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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.ResultControlpoint;
import at.univie.compass.repository.ResultControlpointRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.ResultControlpoint}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResultControlpointResource {

    private final Logger log = LoggerFactory.getLogger(ResultControlpointResource.class);

    private static final String ENTITY_NAME = "resultControlpoint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResultControlpointRepository resultControlpointRepository;

    public ResultControlpointResource(ResultControlpointRepository resultControlpointRepository) {
        this.resultControlpointRepository = resultControlpointRepository;
    }

    /**
     * {@code POST  /result-controlpoints} : Create a new resultControlpoint.
     *
     * @param resultControlpoint the resultControlpoint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resultControlpoint, or with status {@code 400 (Bad Request)} if the resultControlpoint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/result-controlpoints")
    public ResponseEntity<ResultControlpoint> createResultControlpoint(@Valid @RequestBody ResultControlpoint resultControlpoint) throws URISyntaxException {
        log.trace("REST request to save ResultControlpoint : {}", resultControlpoint);
        if (resultControlpoint.getId() != null) {
            throw new BadRequestAlertException("A new resultControlpoint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResultControlpoint result = resultControlpointRepository.save(resultControlpoint);
        return ResponseEntity.created(new URI("/api/result-controlpoints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /result-controlpoints} : Updates an existing resultControlpoint.
     *
     * @param resultControlpoint the resultControlpoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resultControlpoint,
     * or with status {@code 400 (Bad Request)} if the resultControlpoint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resultControlpoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/result-controlpoints")
    public ResponseEntity<ResultControlpoint> updateResultControlpoint(@Valid @RequestBody ResultControlpoint resultControlpoint) throws URISyntaxException {
        log.trace("REST request to update ResultControlpoint : {}", resultControlpoint);
        if (resultControlpoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<ResultControlpoint> old = resultControlpointRepository.findById(resultControlpoint.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        ResultControlpoint result = resultControlpointRepository.save(resultControlpoint);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resultControlpoint.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /result-controlpoints} : get all the resultControlpoints.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resultControlpoints in body.
     */
    @GetMapping("/result-controlpoints")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<ResultControlpoint> getAllResultControlpoints(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.trace("REST request to get all ResultControlpoints");
        return resultControlpointRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /result-controlpoints/:id} : get the "id" resultControlpoint.
     *
     * @param id the id of the resultControlpoint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resultControlpoint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/result-controlpoints/{id}")
    public ResponseEntity<ResultControlpoint> getResultControlpoint(@PathVariable Long id) {
        log.trace("REST request to get ResultControlpoint : {}", id);
        Optional<ResultControlpoint> resultControlpoint = resultControlpointRepository.findOneWithEagerRelationships(id);
        
        if (resultControlpoint.isPresent() && !SecurityUtils.isDataAccessAllowed(resultControlpoint.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        return ResponseUtil.wrapOrNotFound(resultControlpoint);
    }

    /**
     * {@code DELETE  /result-controlpoints/:id} : delete the "id" resultControlpoint.
     *
     * @param id the id of the resultControlpoint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/result-controlpoints/{id}")
    public ResponseEntity<Void> deleteResultControlpoint(@PathVariable Long id) {
        log.trace("REST request to delete ResultControlpoint : {}", id);

        Optional<ResultControlpoint> resultControlpoint = resultControlpointRepository.findById(id);
        
        if (resultControlpoint.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(resultControlpoint.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            resultControlpointRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
