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

import at.univie.compass.domain.Controlpoint;
import at.univie.compass.repository.ControlpointRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.util.UUIDGenerator;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.Controlpoint}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ControlpointResource {

    private final Logger log = LoggerFactory.getLogger(ControlpointResource.class);

    private static final String ENTITY_NAME = "controlpoint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ControlpointRepository controlpointRepository;

    public ControlpointResource(ControlpointRepository controlpointRepository) {
        this.controlpointRepository = controlpointRepository;
    }

    /**
     * {@code POST  /controlpoints} : Create a new controlpoint.
     *
     * @param controlpoint the controlpoint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new controlpoint, or with status {@code 400 (Bad Request)} if the controlpoint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/controlpoints")
    public ResponseEntity<Controlpoint> createControlpoint(@Valid @RequestBody Controlpoint controlpoint) throws URISyntaxException {
        log.trace("REST request to save Controlpoint : {}", controlpoint);
        if (controlpoint.getId() != null) {
            throw new BadRequestAlertException("A new controlpoint cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // generate qrcode
        controlpoint.setQrCode(UUIDGenerator.generateType1UUID().toString());
        Controlpoint result = controlpointRepository.save(controlpoint);
        
        return ResponseEntity.created(new URI("/api/controlpoints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /controlpoints} : Updates an existing controlpoint.
     *
     * @param controlpoint the controlpoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated controlpoint,
     * or with status {@code 400 (Bad Request)} if the controlpoint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the controlpoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/controlpoints")
    public ResponseEntity<Controlpoint> updateControlpoint(@Valid @RequestBody Controlpoint controlpoint) throws URISyntaxException {
        log.trace("REST request to update Controlpoint : {}", controlpoint);
        if (controlpoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<Controlpoint> old = controlpointRepository.findById(controlpoint.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        Controlpoint result = controlpointRepository.save(controlpoint);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, controlpoint.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /controlpoints} : get all the controlpoints.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of controlpoints in body.
     */
    @GetMapping("/controlpoints")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<Controlpoint> getAllControlpoints(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.trace("REST request to get all Controlpoints");
        return controlpointRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /controlpoints/:id} : get the "id" controlpoint.
     *
     * @param id the id of the controlpoint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the controlpoint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/controlpoints/{id}")
    public ResponseEntity<Controlpoint> getControlpoint(@PathVariable Long id) {
        log.trace("REST request to get Controlpoint : {}", id);
        Optional<Controlpoint> controlpoint = controlpointRepository.findOneWithEagerRelationships(id);
        
        if (controlpoint.isPresent() && !SecurityUtils.isDataAccessAllowed(controlpoint.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        return ResponseUtil.wrapOrNotFound(controlpoint);
    }

    /**
     * {@code DELETE  /controlpoints/:id} : delete the "id" controlpoint.
     *
     * @param id the id of the controlpoint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/controlpoints/{id}")
    public ResponseEntity<Void> deleteControlpoint(@PathVariable Long id) {
        log.trace("REST request to delete Controlpoint : {}", id);

        Optional<Controlpoint> controlpoint = controlpointRepository.findById(id);
        
        if (controlpoint.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(controlpoint.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            controlpointRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
