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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import at.univie.compass.domain.OrienteeringMap;
import at.univie.compass.repository.OrienteeringMapRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.OrienteeringMap}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrienteeringMapResource {

    private final Logger log = LoggerFactory.getLogger(OrienteeringMapResource.class);

    private static final String ENTITY_NAME = "orienteeringMap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrienteeringMapRepository orienteeringMapRepository;

    public OrienteeringMapResource(OrienteeringMapRepository orienteeringMapRepository) {
        this.orienteeringMapRepository = orienteeringMapRepository;
    }

    /**
     * {@code POST  /orienteering-maps} : Create a new orienteeringMap.
     *
     * @param orienteeringMap the orienteeringMap to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orienteeringMap, or with status {@code 400 (Bad Request)} if the orienteeringMap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/orienteering-maps")
    public ResponseEntity<OrienteeringMap> createOrienteeringMap(@Valid @RequestBody OrienteeringMap orienteeringMap) throws URISyntaxException {
        log.trace("REST request to save OrienteeringMap : {}", orienteeringMap);
        if (orienteeringMap.getId() != null) {
            throw new BadRequestAlertException("A new orienteeringMap cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrienteeringMap result = orienteeringMapRepository.save(orienteeringMap);
        return ResponseEntity.created(new URI("/api/orienteering-maps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orienteering-maps} : Updates an existing orienteeringMap.
     *
     * @param orienteeringMap the orienteeringMap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orienteeringMap,
     * or with status {@code 400 (Bad Request)} if the orienteeringMap is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orienteeringMap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orienteering-maps")
    public ResponseEntity<OrienteeringMap> updateOrienteeringMap(@Valid @RequestBody OrienteeringMap orienteeringMap) throws URISyntaxException {
        log.trace("REST request to update OrienteeringMap : {}", orienteeringMap);
        if (orienteeringMap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<OrienteeringMap> old = orienteeringMapRepository.findById(orienteeringMap.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        OrienteeringMap result = orienteeringMapRepository.save(orienteeringMap);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orienteeringMap.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /orienteering-maps} : get all the orienteeringMaps.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orienteeringMaps in body.
     */
    @GetMapping("/orienteering-maps")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<OrienteeringMap>> getAllOrienteeringMaps(Pageable pageable) {
        log.trace("REST request to get all OrienteeringMaps");
        
        Page<OrienteeringMap> page = orienteeringMapRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    /**
     * {@code GET  /orienteering-maps/:id} : get the "id" orienteeringMap.
     *
     * @param id the id of the orienteeringMap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orienteeringMap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orienteering-maps/{id}")
    public ResponseEntity<OrienteeringMap> getOrienteeringMap(@PathVariable Long id) {
        log.trace("REST request to get OrienteeringMap : {}", id);
        Optional<OrienteeringMap> orienteeringMap = orienteeringMapRepository.findById(id);
        
        if (orienteeringMap.isPresent() && !SecurityUtils.isDataAccessAllowed(orienteeringMap.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        return ResponseUtil.wrapOrNotFound(orienteeringMap);
    }

    /**
     * {@code DELETE  /orienteering-maps/:id} : delete the "id" orienteeringMap.
     *
     * @param id the id of the orienteeringMap to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orienteering-maps/{id}")
    public ResponseEntity<Void> deleteOrienteeringMap(@PathVariable Long id) {
        log.trace("REST request to delete OrienteeringMap : {}", id);

        Optional<OrienteeringMap> orienteeringMap = orienteeringMapRepository.findById(id);
        
        if (orienteeringMap.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(orienteeringMap.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            orienteeringMapRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
