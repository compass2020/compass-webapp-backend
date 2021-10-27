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
package at.univie.compass.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import at.univie.compass.service.dto.MessageDTO;
import at.univie.compass.service.dto.PositionDTO;

@Service
public class PositionService {

    private final Logger log = LoggerFactory.getLogger(PositionService.class);

    private final Map<String, PositionDTO> positionMap = new ConcurrentHashMap<>();

    public List<String> updatePosition(final PositionDTO position) {

        log.debug("updating player position (size of map={}: {})", positionMap.size(), position);

        final String key = "" + position.getUuid() + position.getSharedCourseId();
        List<String> messages = new ArrayList<>();

        if (positionMap.containsKey(key)) {
            final PositionDTO oldPosition = positionMap.get(key);
            messages = oldPosition.getMessages();
        }
        positionMap.put(key, position);

        log.debug("size of map after updating: {}, found messages: {})", positionMap.size(),
                Arrays.toString(messages.toArray()));

        return messages;
    }

    public void updatePosition(final MessageDTO message) {

        log.debug("updating player position with message {}", message);

        final boolean broadcast = message.getUuid() == null;
        if (broadcast) {
            log.info("Sending broadcast message: {}", message);

            for (Map.Entry<String, PositionDTO> entry : positionMap.entrySet()) {
                PositionDTO position = entry.getValue();
                if (position.getSharedCourseId().equals(message.getSharedCourseId())) {
                    position.addMessage(message.getMessage());
                }
            }

        } else {
            log.info("Sending direct message: {}", message);

            for (Map.Entry<String, PositionDTO> entry : positionMap.entrySet()) {
                PositionDTO position = entry.getValue();

                if (position.getSharedCourseId().equals(message.getSharedCourseId())
                        && position.getUuid().equals(message.getUuid())) {
                    position.addMessage(message.getMessage());
                }
            }
        }
    }

    public List<PositionDTO> getPosition(Long sharedCourseId) {

        List<PositionDTO> positions = new ArrayList<>();

        for (Map.Entry<String, PositionDTO> entry : positionMap.entrySet()) {
            if (entry.getValue().getSharedCourseId().equals(sharedCourseId)) {
                positions.add(entry.getValue());
            }
        }

        return positions;
    }

    /**
     * Old positions should be removed every day.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeOldPositions() {

        log.info("Job removeOldPositions is starting... (size of map={})", positionMap.size());

        // TOOD maybe in a single line with lambda expression
        for (Iterator<Map.Entry<String, PositionDTO>> it = positionMap.entrySet().iterator(); it.hasNext();) {

            Map.Entry<String, PositionDTO> entry = it.next();
            Instant timestamp = entry.getValue().getTimestamp();

            if (timestamp == null || isOlderThan24Hours(timestamp)) {

                log.info("remove old position (timestamp older than 24h): {}", entry.getValue());
                positionMap.remove(entry.getKey());
            }
        }

        log.info("Job removeOldPositions finished (size of map={})", positionMap.size());
    }

    public boolean isOlderThan24Hours(Instant timestamp) {
        return timestamp != null && timestamp.isBefore(Instant.now().minus(24, ChronoUnit.HOURS));
    }
}
