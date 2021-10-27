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

import at.univie.compass.domain.SharedCourseQrCode;
import at.univie.compass.repository.SharedCourseQrCodeRepository;
import at.univie.compass.security.AuthoritiesConstants;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.univie.compass.domain.SharedCourseQrCode}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SharedCourseQrCodeResource {

    private final Logger log = LoggerFactory.getLogger(SharedCourseQrCodeResource.class);

    private static final String ENTITY_NAME = "sharedCourseQrCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SharedCourseQrCodeRepository sharedCourseQrCodeRepository;

    public SharedCourseQrCodeResource(SharedCourseQrCodeRepository sharedCourseQrCodeRepository) {
        this.sharedCourseQrCodeRepository = sharedCourseQrCodeRepository;
    }

    /**
     * {@code POST  /shared-course-qr-codes} : Create a new sharedCourseQrCode.
     *
     * @param sharedCourseQrCode the sharedCourseQrCode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sharedCourseQrCode, or with status {@code 400 (Bad Request)} if the sharedCourseQrCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shared-course-qr-codes")
    public ResponseEntity<SharedCourseQrCode> createSharedCourseQrCode(@Valid @RequestBody SharedCourseQrCode sharedCourseQrCode) throws URISyntaxException {
        log.debug("REST request to save SharedCourseQrCode : {}", sharedCourseQrCode);
        if (sharedCourseQrCode.getId() != null) {
            throw new BadRequestAlertException("A new sharedCourseQrCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SharedCourseQrCode result = sharedCourseQrCodeRepository.save(sharedCourseQrCode);
        return ResponseEntity.created(new URI("/api/shared-course-qr-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shared-course-qr-codes} : Updates an existing sharedCourseQrCode.
     *
     * @param sharedCourseQrCode the sharedCourseQrCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sharedCourseQrCode,
     * or with status {@code 400 (Bad Request)} if the sharedCourseQrCode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sharedCourseQrCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shared-course-qr-codes")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<SharedCourseQrCode> updateSharedCourseQrCode(@Valid @RequestBody SharedCourseQrCode sharedCourseQrCode) throws URISyntaxException {
        log.debug("REST request to update SharedCourseQrCode : {}", sharedCourseQrCode);
        if (sharedCourseQrCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        Optional<SharedCourseQrCode> old = sharedCourseQrCodeRepository.findById(sharedCourseQrCode.getId());
        if (old.isPresent() && !SecurityUtils.isDataAccessAllowed(old.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }

        SharedCourseQrCode result = sharedCourseQrCodeRepository.save(sharedCourseQrCode);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sharedCourseQrCode.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shared-course-qr-codes} : get all the sharedCourseQrCodes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sharedCourseQrCodes in body.
     */
    @GetMapping("/shared-course-qr-codes")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<SharedCourseQrCode> getAllSharedCourseQrCodes() {
        log.debug("REST request to get all SharedCourseQrCodes");
        return sharedCourseQrCodeRepository.findAll();
    }

    /**
     * {@code GET  /shared-course-qr-codes/:id} : get the "id" sharedCourseQrCode.
     *
     * @param id the id of the sharedCourseQrCode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sharedCourseQrCode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shared-course-qr-codes/{id}")
    public ResponseEntity<SharedCourseQrCode> getSharedCourseQrCode(@PathVariable Long id) {
        log.debug("REST request to get SharedCourseQrCode : {}", id);
        Optional<SharedCourseQrCode> sharedCourseQrCode = sharedCourseQrCodeRepository.findById(id);
        
        if (sharedCourseQrCode.isPresent() && !SecurityUtils.isDataAccessAllowed(sharedCourseQrCode.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
        }
        
        return ResponseUtil.wrapOrNotFound(sharedCourseQrCode);
    }

    /**
     * {@code DELETE  /shared-course-qr-codes/:id} : delete the "id" sharedCourseQrCode.
     *
     * @param id the id of the sharedCourseQrCode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shared-course-qr-codes/{id}")
    public ResponseEntity<Void> deleteSharedCourseQrCode(@PathVariable Long id) {
        log.debug("REST request to delete SharedCourseQrCode : {}", id);

        Optional<SharedCourseQrCode> sharedCourseQrCode = sharedCourseQrCodeRepository.findById(id);
        
        if (sharedCourseQrCode.isPresent()) {
                
            if (!SecurityUtils.isDataAccessAllowed(sharedCourseQrCode.get().getCreatedBy())) {
                throw new BadRequestAlertException("Access denied", ENTITY_NAME, "accessdenied");
            }

            sharedCourseQrCodeRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        }
        
        throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"); 
    }
}
