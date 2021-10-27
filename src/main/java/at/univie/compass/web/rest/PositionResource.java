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

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.univie.compass.domain.SharedCourse;
import at.univie.compass.repository.SharedCourseRepository;
import at.univie.compass.security.SecurityUtils;
import at.univie.compass.service.PositionService;
import at.univie.compass.service.dto.MessageDTO;
import at.univie.compass.service.dto.PositionDTO;
import at.univie.compass.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing user positions und messaging.
 * <p>
 * This class accesses the {@link PositionService} service.
 * <p>
 */
@RestController
@RequestMapping("/api")
public class PositionResource {

    private final Logger log = LoggerFactory.getLogger(PositionResource.class);

    private final PositionService positionService;

    @Autowired
    private SharedCourseRepository sharedCourseRepository;

    public PositionResource(PositionService positionService) {
        this.positionService = positionService;
    }

    /**
     * {@code POST  /position} : Updates a position.
     */
    @PostMapping("/position")
    public List<String> updatePosition(@Valid @RequestBody PositionDTO position) throws URISyntaxException {
        return positionService.updatePosition(position);
    }

    /**
     * {@code GET  /position/:id} : get the positions to a sharedCourseId.
     */
    @GetMapping("/position/{sharedCourseId}")
    public List<PositionDTO> getPosition(@PathVariable Long sharedCourseId) {
        
        Optional<SharedCourse> sharedCourse = sharedCourseRepository.findById(sharedCourseId);
        
        if (!sharedCourse.isPresent() || !SecurityUtils.isDataAccessAllowed(sharedCourse.get().getCreatedBy())) {
            throw new BadRequestAlertException("Access denied", "sharedCourse", "accessdenied");
        }
        
        return positionService.getPosition(sharedCourseId);
    }

    /**
     * {@code POST  /message} : Sends a broadcast oder directmessage to a position.
     */
    @PostMapping("/message")
    public void broadcastMessage(@Valid @RequestBody MessageDTO message) {
        positionService.updatePosition(message);
    }
}
