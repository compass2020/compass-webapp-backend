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

import at.univie.compass.domain.ControlpointInfo;
import at.univie.compass.repository.ControlpointInfoRepository;
import at.univie.compass.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link at.univie.compass.domain.ControlpointInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ControlpointInfoResource {

    private final Logger log = LoggerFactory.getLogger(ControlpointInfoResource.class);

    private static final String ENTITY_NAME = "controlpointInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ControlpointInfoRepository controlpointInfoRepository;

    public ControlpointInfoResource(ControlpointInfoRepository controlpointInfoRepository) {
        this.controlpointInfoRepository = controlpointInfoRepository;
    }

    /**
     * {@code POST  /controlpoint-infos} : Create a new controlpointInfo.
     *
     * @param controlpointInfo the controlpointInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new controlpointInfo, or with status {@code 400 (Bad Request)} if the controlpointInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/controlpoint-infos")
    public ResponseEntity<ControlpointInfo> createControlpointInfo(@Valid @RequestBody ControlpointInfo controlpointInfo) throws URISyntaxException {
        log.trace("REST request to save ControlpointInfo : {}", controlpointInfo);
        if (controlpointInfo.getId() != null) {
            throw new BadRequestAlertException("A new controlpointInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ControlpointInfo result = controlpointInfoRepository.save(controlpointInfo);
        return ResponseEntity.created(new URI("/api/controlpoint-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /controlpoint-infos} : Updates an existing controlpointInfo.
     *
     * @param controlpointInfo the controlpointInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated controlpointInfo,
     * or with status {@code 400 (Bad Request)} if the controlpointInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the controlpointInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/controlpoint-infos")
    public ResponseEntity<ControlpointInfo> updateControlpointInfo(@Valid @RequestBody ControlpointInfo controlpointInfo) throws URISyntaxException {
        log.trace("REST request to update ControlpointInfo : {}", controlpointInfo);
        if (controlpointInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ControlpointInfo result = controlpointInfoRepository.save(controlpointInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, controlpointInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /controlpoint-infos} : get all the controlpointInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of controlpointInfos in body.
     */
    @GetMapping("/controlpoint-infos")
    public List<ControlpointInfo> getAllControlpointInfos() {
        log.trace("REST request to get all ControlpointInfos");
        return controlpointInfoRepository.findAll();
    }

    /**
     * {@code GET  /controlpoint-infos/:id} : get the "id" controlpointInfo.
     *
     * @param id the id of the controlpointInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the controlpointInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/controlpoint-infos/{id}")
    public ResponseEntity<ControlpointInfo> getControlpointInfo(@PathVariable Long id) {
        log.trace("REST request to get ControlpointInfo : {}", id);
        Optional<ControlpointInfo> controlpointInfo = controlpointInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(controlpointInfo);
    }

    /**
     * {@code DELETE  /controlpoint-infos/:id} : delete the "id" controlpointInfo.
     *
     * @param id the id of the controlpointInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/controlpoint-infos/{id}")
    public ResponseEntity<Void> deleteControlpointInfo(@PathVariable Long id) {
        log.trace("REST request to delete ControlpointInfo : {}", id);

        controlpointInfoRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
